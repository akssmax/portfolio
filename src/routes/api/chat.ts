import { createFileRoute } from "@tanstack/react-router"

import {
  getDefaultChatModel,
  MISTRAL_MODELS,
  type LlmChatMessage,
} from "@/lib/llm/llm-types"
import { buildRetrievedContext, PORTFOLIO_SYSTEM_PROMPT } from "@/lib/rag/system-prompt"
import { retrieveForQuery } from "@/lib/rag/search"
import {
  checkRateLimit,
  getClientIp,
  rateLimitHeaders,
  CHAT_RATE_LIMIT,
  WEB_SEARCH_RATE_LIMIT,
} from "@/lib/rag/rate-limit"
import {
  runMistralToolLoop,
  streamMistralCompletion,
} from "@/lib/llm/mistral-tool-loop"
import { WEB_SEARCH_TOOL_DEFINITION } from "@/lib/llm/tools/web-search-tool"
import {
  RENDER_CUSTOM_UI_TOOL_DEFINITION,
} from "@/lib/llm/tools/gen-ui-tools"

type ChatRequestBody = {
  model?: string
  messages?: LlmChatMessage[]
  temperature?: number
  maxTokens?: number
  mode?: "gen-ui" | "chat"
}

const MAX_MAX_TOKENS = 2000
const MIN_TEMPERATURE = 0
const MAX_TEMPERATURE = 1

type GroundedSource = { href: string; title: string }
type GroundedCitation = { href: string; label: string }

const DEFAULT_MAX_TOKENS = 1500
const MAX_MESSAGES = 40
const SUGGESTIONS_BUDGET_MS = 3500

function jsonError(status: number, code: string, message: string): Response {
  return Response.json({ error: { code, message } }, { status })
}

function writeSse(controller: ReadableStreamDefaultController, event: string, data: unknown) {
  const encoder = new TextEncoder()
  controller.enqueue(encoder.encode(`event: ${event}\n`))
  controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
}

function mistralDeltaToText(content: unknown): string {
  if (typeof content === "string") return content
  if (!Array.isArray(content)) return ""
  let out = ""
  for (const part of content) {
    if (typeof part === "string") {
      out += part
      continue
    }
    if (part && typeof part === "object") {
      const p = part as Record<string, unknown>
      if (typeof p.text === "string") out += p.text
      else if (typeof p.content === "string") out += p.content
    }
  }
  return out
}

function extractGroundedLinks(text: string): GroundedSource[] {
  if (!text.trim()) return []
  const links = new Set<string>()
  const markdownLinkRegex = /\[[^\]]+\]\((https?:\/\/[^)\s]+)\)/g
  const urlRegex = /https?:\/\/[^\s)]+/g

  let match = markdownLinkRegex.exec(text)
  while (match) {
    links.add(match[1])
    match = markdownLinkRegex.exec(text)
  }

  const cleaned = text.replace(markdownLinkRegex, "")
  for (const url of cleaned.match(urlRegex) ?? []) {
    links.add(url)
  }

  return Array.from(links)
    .slice(0, 6)
    .map((href) => {
      try {
        const parsed = new URL(href, "https://akshaysaini.design")
        const title = parsed.pathname.startsWith("/projects/")
          ? parsed.pathname.replace("/projects/", "Project: ")
          : parsed.hostname.replace(/^www\./, "")
        return { href, title }
      } catch {
        return null
      }
    })
    .filter((item): item is GroundedSource => Boolean(item))
}

function toGroundedCitations(sources: GroundedSource[]): GroundedCitation[] {
  return sources.map((source, index) => ({
    href: source.href,
    label: `Reference ${index + 1}: ${source.title}`,
  }))
}

function parseSuggestions(raw: string): string[] {
  let cleaned = raw.trim()
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```[a-zA-Z]*\n/, "").replace(/\n```$/, "").trim()
  }
  try {
    const parsed = JSON.parse(cleaned) as unknown
    if (!Array.isArray(parsed)) return []
    return Array.from(
      new Set(
        parsed
          .filter((item): item is string => typeof item === "string")
          .map((item) => item.trim())
          .filter(Boolean),
      ),
    ).slice(0, 4)
  } catch {
    return []
  }
}

async function generateSuggestions(
  key: string,
  model: string,
  userPrompt: string,
  assistantResponse: string,
  signal: AbortSignal,
): Promise<string[]> {
  if (!assistantResponse.trim()) return []

  const prompt = [
    "Generate 3 short follow-up suggestions for a portfolio visitor chatting about a design engineer.",
    "Return strict JSON array only (no markdown). Each suggestion <= 8 words.",
    `User prompt: ${userPrompt}`,
    `Assistant answer: ${assistantResponse.slice(0, 1200)}`,
  ].join("\n")

  const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 120,
      temperature: 0.3,
      stream: false,
    }),
    signal,
  })

  if (!response.ok) return []
  const json = await response.json()
  const content = json?.choices?.[0]?.message?.content
  if (typeof content !== "string") return []
  return parseSuggestions(content)
}

function validateRequest(body: ChatRequestBody) {
  const model = body.model ?? getDefaultChatModel()
  if (!model || !MISTRAL_MODELS.includes(model as (typeof MISTRAL_MODELS)[number])) {
    return { ok: false as const, status: 400, code: "invalid_model", message: "Invalid model." }
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return { ok: false as const, status: 400, code: "invalid_messages", message: "messages required." }
  }

  if (body.messages.length > MAX_MESSAGES) {
    return { ok: false as const, status: 400, code: "message_limit", message: "Too many messages." }
  }

  for (const message of body.messages) {
    if (!["system", "user", "assistant"].includes(message.role) || typeof message.content !== "string") {
      return { ok: false as const, status: 400, code: "invalid_message_shape", message: "Invalid message." }
    }
  }

  if (body.maxTokens !== undefined) {
    if (typeof body.maxTokens !== "number" || !Number.isFinite(body.maxTokens)) {
      return { ok: false as const, status: 400, code: "invalid_max_tokens", message: "Invalid maxTokens." }
    }
    if (body.maxTokens < 1 || body.maxTokens > MAX_MAX_TOKENS) {
      return {
        ok: false as const,
        status: 400,
        code: "max_tokens_out_of_range",
        message: `maxTokens must be between 1 and ${MAX_MAX_TOKENS}.`,
      }
    }
  }

  if (body.temperature !== undefined) {
    if (typeof body.temperature !== "number" || !Number.isFinite(body.temperature)) {
      return { ok: false as const, status: 400, code: "invalid_temperature", message: "Invalid temperature." }
    }
    if (body.temperature < MIN_TEMPERATURE || body.temperature > MAX_TEMPERATURE) {
      return {
        ok: false as const,
        status: 400,
        code: "temperature_out_of_range",
        message: `temperature must be between ${MIN_TEMPERATURE} and ${MAX_TEMPERATURE}.`,
      }
    }
  }

  const maxTokens = body.maxTokens ?? DEFAULT_MAX_TOKENS
  const temperature = body.temperature ?? 0.5

  return { ok: true as const, model, maxTokens, temperature }
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.MISTRAL_API_KEY
        if (!apiKey) {
          return jsonError(500, "missing_api_key", "MISTRAL_API_KEY is not configured.")
        }

        const clientIp = getClientIp(request)
        const rate = checkRateLimit(`chat:${clientIp}`, CHAT_RATE_LIMIT)
        if (!rate.allowed) {
          return Response.json(
            { error: { code: "rate_limited", message: "Too many requests. Please try again later." } },
            { status: 429, headers: rateLimitHeaders(rate.retryAfterMs) },
          )
        }

        let body: ChatRequestBody
        try {
          body = (await request.json()) as ChatRequestBody
          console.log("[api/chat] Received body:", JSON.stringify(body))
        } catch {
          return jsonError(400, "invalid_json", "Request body must be JSON.")
        }

        const validation = validateRequest(body)
        console.log("[api/chat] Validation result:", JSON.stringify(validation))
        if (!validation.ok) {
          return jsonError(validation.status, validation.code, validation.message)
        }

        const messages = body.messages ?? []
        const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content ?? ""

        let retrievedContext = ""
        if (lastUserMessage.trim()) {
          try {
            const results = await retrieveForQuery(lastUserMessage)
            retrievedContext = buildRetrievedContext(
              results.map((result) => ({
                sourceLabel: result.chunk.sourceLabel,
                text: result.chunk.text,
                href: result.chunk.href,
              })),
            )
          } catch (error) {
            console.error("RAG retrieval failed:", error)
          }
        }

        // Ensure every assistant tool call in history has a corresponding tool result message to keep the API valid
        const processedHistory: LlmChatMessage[] = []
        if (messages) {
          for (const msg of messages) {
            processedHistory.push(msg)
            if (msg.role === "assistant" && "tool_calls" in msg && msg.tool_calls) {
              for (const call of msg.tool_calls) {
                const hasResponse = messages.some(
                  (m) => m.role === "tool" && m.tool_call_id === call.id
                )
                if (!hasResponse) {
                  processedHistory.push({
                    role: "tool",
                    name: call.name,
                    tool_call_id: call.id,
                    content: '{"status": "success"}',
                  })
                }
              }
            }
          }
        }

        const finalMessages: LlmChatMessage[] = [
          { role: "system", content: PORTFOLIO_SYSTEM_PROMPT },
          ...(retrievedContext
            ? [{ role: "system" as const, content: `Retrieved context:\n${retrievedContext}` }]
            : []),
          ...(body.mode === "gen-ui"
            ? [
                {
                  role: "system" as const,
                  content:
                    "You are in Generative UI mode. You MUST call the 'render_custom_ui' tool to display structured cards, list layout widgets, timelines, stats, or projects on the page dynamically. Generate the custom layout (grid, list, or metrics) and custom items dynamically on the fly based on the user's specific request. Never write general text replies; always call the tool to render UI.",
                },
              ]
            : []),
          ...processedHistory,
        ]

        const controller = new AbortController()
        const timeoutMs = Number(process.env.VERCEL_CHAT_TIMEOUT_MS) || 55_000
        const timeout = setTimeout(() => controller.abort("timeout"), timeoutMs)

        const stream = new ReadableStream({
          async start(streamController) {
            try {
              const useGenUi = body.mode === "gen-ui"
              let response: Response

              if (useGenUi) {
                // Stream custom UI tool directly from the start
                response = await streamMistralCompletion({
                  apiKey,
                  model: validation.model,
                  messages: finalMessages,
                  temperature: validation.temperature,
                  maxTokens: validation.maxTokens,
                  signal: controller.signal,
                  tools: [RENDER_CUSTOM_UI_TOOL_DEFINITION],
                  toolChoice: { type: "function", function: { name: "render_custom_ui" } },
                })
              } else {
                const { messages: toolAwareMessages } = await runMistralToolLoop({
                  apiKey,
                  model: validation.model,
                  messages: finalMessages,
                  maxRounds: 2,
                  maxSearches: 3,
                  appendFinalAssistant: false,
                  temperature: validation.temperature,
                  maxTokens: validation.maxTokens,
                  tools: [WEB_SEARCH_TOOL_DEFINITION],
                  toolContext: {
                    beforeSearch: () => {
                      const searchRate = checkRateLimit(
                        `web_search:${clientIp}`,
                        WEB_SEARCH_RATE_LIMIT,
                      )
                      return searchRate.allowed
                        ? { allowed: true }
                        : {
                            allowed: false,
                            error: "Web search rate limit exceeded. Try again later.",
                          }
                    },
                  },
                  onToolStart: (payload) => {
                    writeSse(streamController, "tool_start", payload)
                  },
                  onToolEnd: (payload) => {
                    writeSse(streamController, "tool_end", payload)
                  },
                })

                response = await streamMistralCompletion({
                  apiKey,
                  model: validation.model,
                  messages: toolAwareMessages,
                  temperature: validation.temperature,
                  maxTokens: validation.maxTokens,
                  signal: controller.signal,
                })
              }

              if (!response.ok || !response.body) {
                const text = await response.text().catch(() => "")
                console.error("Mistral request failed:", response.status, text)
                writeSse(streamController, "error", {
                  message: "The AI service is temporarily unavailable. Please try again.",
                })
                streamController.close()
                return
              }

              const reader = response.body.getReader()
              const decoder = new TextDecoder()
              let upstreamBuffer = ""
              let assistantText = ""
              let finishReason: string | null = null

              const processRawEvent = (rawEvent: string) => {
                for (const line of rawEvent.replace(/\r\n/g, "\n").split("\n")) {
                  if (!line.startsWith("data:")) continue
                  const data = line.slice("data:".length).trim()
                  if (!data || data === "[DONE]") continue
                  try {
                    const payload = JSON.parse(data)
                    const choice = payload?.choices?.[0]
                    if (typeof choice?.finish_reason === "string" && choice.finish_reason.trim()) {
                      finishReason = choice.finish_reason
                    }
                    
                    const token =
                      mistralDeltaToText(choice?.delta?.content) ||
                      mistralDeltaToText(choice?.message?.content)
                    if (token.length > 0) {
                      assistantText += token
                      writeSse(streamController, "token", { text: token })
                    }

                    // Forward tool call delta streaming to client
                    const toolCalls = choice?.delta?.tool_calls || choice?.message?.tool_calls
                    if (toolCalls && toolCalls.length > 0) {
                      writeSse(streamController, "tool_delta", { toolCalls })
                    }
                  } catch {
                    // ignore malformed chunks
                  }
                }
              }

              while (true) {
                const { done, value } = await reader.read()
                if (done) {
                  const trailing = upstreamBuffer.trim()
                  if (trailing) processRawEvent(trailing)
                  break
                }
                upstreamBuffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, "\n")
                let boundary = upstreamBuffer.indexOf("\n\n")
                while (boundary !== -1) {
                  processRawEvent(upstreamBuffer.slice(0, boundary))
                  upstreamBuffer = upstreamBuffer.slice(boundary + 2)
                  boundary = upstreamBuffer.indexOf("\n\n")
                }
              }

              try {
                const suggestions = await Promise.race([
                  generateSuggestions(
                    apiKey,
                    validation.model,
                    lastUserMessage,
                    assistantText,
                    controller.signal,
                  ),
                  new Promise<string[]>((resolve) =>
                    setTimeout(() => resolve([]), SUGGESTIONS_BUDGET_MS),
                  ),
                ])
                if (suggestions.length > 0) {
                  writeSse(streamController, "suggestions", { suggestions })
                }
              } catch {
                // optional
              }

              const ragSources = retrieveRagSources(retrievedContext)
              const groundedSources = [
                ...ragSources,
                ...extractGroundedLinks(assistantText),
              ].slice(0, 6)

              if (groundedSources.length > 0) {
                writeSse(streamController, "sources", { sources: groundedSources })
                writeSse(streamController, "citations", {
                  citations: toGroundedCitations(groundedSources),
                })
              }

              writeSse(streamController, "done", {
                ok: true,
                finishReason: finishReason ?? "stop",
                maxTokens: validation.maxTokens,
                status: finishReason === "length" ? "max_tokens_reached" : "completed",
              })
              streamController.close()
            } catch (error) {
              console.error("[api/chat] Stream processing error:", error)
              const message = error instanceof Error ? error.message : "Chat request failed"
              writeSse(streamController, "error", { message })
              streamController.close()
            } finally {
              clearTimeout(timeout)
            }
          },
        })

        return new Response(stream, {
          headers: {
            "Cache-Control": "no-cache, no-transform",
            "Content-Type": "text/event-stream; charset=utf-8",
            Connection: "keep-alive",
          },
        })
      },
    },
  },
})

function retrieveRagSources(context: string): GroundedSource[] {
  const sources: GroundedSource[] = []
  const linkRegex = /\((\/projects\/[^)\s]+)\)/g
  let match = linkRegex.exec(context)
  while (match) {
    sources.push({ href: match[1], title: match[1].replace("/projects/", "Project: ") })
    match = linkRegex.exec(context)
  }
  return sources
}
