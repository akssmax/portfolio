import { createFileRoute } from "@tanstack/react-router"

import { formatChatError } from "@/lib/llm/chat-errors"
import { completeGenUiToolCalls } from "@/lib/llm/gen-ui-completion"
import { createChatCompletion } from "@/lib/llm/openai-compatible-client"
import { extractToolCallDeltas } from "@/lib/llm/tool-call-utils"
import type { LlmChatMessage } from "@/lib/llm/llm-types"
import {
  buildOpenUiMessages,
  buildOpenUiScopeRedirectLang,
  getOpenUiStreamOptions,
} from "@/lib/llm/openui-completion"
import {
  getDefaultChatModel,
  getGenUiEngine,
  isValidChatModel,
  LlmConfigError,
  resolveLlmConfig,
  type ResolvedLlmConfig,
} from "@/lib/llm/provider"
import { runToolLoop, streamCompletion } from "@/lib/llm/tool-loop"
import {
  getPortfolioScopeRedirect,
  isLikelyOffTopicQuery,
  OFF_TOPIC_SUGGESTIONS,
} from "@/lib/rag/portfolio-scope"
import { buildRetrievedContext, PORTFOLIO_SYSTEM_PROMPT } from "@/lib/rag/system-prompt"
import { retrieveForQuery } from "@/lib/rag/search"
import {
  checkRateLimit,
  getClientIp,
  rateLimitHeaders,
  CHAT_RATE_LIMIT,
  WEB_SEARCH_RATE_LIMIT,
} from "@/lib/rag/rate-limit"
import { WEB_SEARCH_TOOL_DEFINITION } from "@/lib/llm/tools/web-search-tool"
import {
  GEN_UI_SYSTEM_PROMPT,
  getGenUiStreamOptions,
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
  config: ResolvedLlmConfig,
  model: string,
  userPrompt: string,
  assistantResponse: string,
  signal: AbortSignal,
): Promise<string[]> {
  if (!assistantResponse.trim()) return []

  const prompt = [
    "Generate 3 short follow-up suggestions for a portfolio visitor chatting about a design engineer.",
    "Suggestions must be about Akshay's portfolio, projects, experience, or hiring — never off-topic.",
    "Return strict JSON array only (no markdown). Each suggestion <= 8 words.",
    `User prompt: ${userPrompt}`,
    `Assistant answer: ${assistantResponse.slice(0, 1200)}`,
  ].join("\n")

  try {
    const json = await createChatCompletion(
      config,
      {
        model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 120,
        temperature: 0.3,
      },
      signal,
    )
    const content = json?.choices?.[0]?.message?.content
    if (typeof content !== "string") return []
    return parseSuggestions(content)
  } catch {
    return []
  }
}

function validateRequest(body: ChatRequestBody, config: ResolvedLlmConfig) {
  const model = body.model ?? getDefaultChatModel(config)
  if (!model || !isValidChatModel(model, config)) {
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
  const temperature = body.temperature ?? 0.35

  return { ok: true as const, model, maxTokens, temperature }
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let llmConfig: ResolvedLlmConfig
        try {
          llmConfig = resolveLlmConfig()
        } catch (error) {
          if (error instanceof LlmConfigError) {
            return jsonError(500, error.code, error.message)
          }
          throw error
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

        const validation = validateRequest(body, llmConfig)
        console.log("[api/chat] Validation result:", JSON.stringify(validation))
        if (!validation.ok) {
          return jsonError(validation.status, validation.code, validation.message)
        }

        const messages = body.messages ?? []
        const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content ?? ""

        const useGenUi = body.mode === "gen-ui"
        const useOpenUiEngine = useGenUi && getGenUiEngine() === "openui"
        const useLegacyGenUi = useGenUi && !useOpenUiEngine

        let retrievedContext = ""
        if ((!useGenUi || useOpenUiEngine) && lastUserMessage.trim()) {
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
              for (const call of msg.tool_calls as any[]) {
                const callId = call.id
                const callName = call.name || call.function?.name || "render_custom_ui"
                const hasResponse = messages.some(
                  (m: any) => m.role === "tool" && m.tool_call_id === callId
                )
                if (!hasResponse) {
                  processedHistory.push({
                    role: "tool",
                    name: callName,
                    tool_call_id: callId,
                    content: '{"status": "success"}',
                  })
                }
              }
            }
          }
        }

        const finalMessages: LlmChatMessage[] = useOpenUiEngine
          ? buildOpenUiMessages({ history: processedHistory, ragContext: retrievedContext })
          : useLegacyGenUi
            ? [{ role: "system", content: GEN_UI_SYSTEM_PROMPT }, ...processedHistory]
            : [
                { role: "system", content: PORTFOLIO_SYSTEM_PROMPT },
                ...(retrievedContext
                  ? [{ role: "system" as const, content: `Retrieved context:\n${retrievedContext}` }]
                  : []),
                ...processedHistory,
              ]

        const openUiStreamOptions = useOpenUiEngine ? getOpenUiStreamOptions(llmConfig) : null
        const streamModel = openUiStreamOptions?.model ?? validation.model
        const streamMaxTokens = openUiStreamOptions?.maxTokens ?? validation.maxTokens
        const streamTemperature = openUiStreamOptions?.temperature ?? validation.temperature

        const controller = new AbortController()
        const timeoutMs = Number(process.env.VERCEL_CHAT_TIMEOUT_MS) || 55_000
        const timeout = setTimeout(() => controller.abort("timeout"), timeoutMs)

        const stream = new ReadableStream({
          async start(streamController) {
            try {
              if (!useGenUi && isLikelyOffTopicQuery(lastUserMessage)) {
                const redirect = getPortfolioScopeRedirect(lastUserMessage)
                writeSse(streamController, "token", { text: redirect })
                writeSse(streamController, "suggestions", {
                  suggestions: [...OFF_TOPIC_SUGGESTIONS],
                })
                writeSse(streamController, "done", {
                  ok: true,
                  finishReason: "stop",
                  maxTokens: validation.maxTokens,
                  status: "completed",
                })
                streamController.close()
                return
              }

              if (useOpenUiEngine && isLikelyOffTopicQuery(lastUserMessage)) {
                const redirectLang = buildOpenUiScopeRedirectLang(lastUserMessage)
                writeSse(streamController, "token", { text: redirectLang })
                writeSse(streamController, "suggestions", {
                  suggestions: [...OFF_TOPIC_SUGGESTIONS],
                })
                writeSse(streamController, "done", {
                  ok: true,
                  finishReason: "stop",
                  maxTokens: streamMaxTokens,
                  status: "completed",
                  engine: "openui",
                })
                streamController.close()
                return
              }

              if (useLegacyGenUi) {
                try {
                  const genUiResult = await completeGenUiToolCalls({
                    config: llmConfig,
                    model: validation.model,
                    messages: finalMessages,
                    signal: controller.signal,
                  })

                  if (genUiResult.toolCalls.length === 0) {
                    writeSse(streamController, "error", {
                      message:
                        "The model did not return a UI layout. Please try again or switch to Chat mode.",
                    })
                  } else {
                    const call = genUiResult.toolCalls[0]
                    writeSse(streamController, "gen_ui", {
                      toolCall: {
                        name: call.name,
                        arguments: call.arguments,
                      },
                    })
                  }

                  writeSse(streamController, "done", {
                    ok: genUiResult.toolCalls.length > 0,
                    finishReason: genUiResult.finishReason ?? "tool_calls",
                    maxTokens: getGenUiStreamOptions(llmConfig).maxTokens,
                    status: genUiResult.toolCalls.length > 0 ? "completed" : "upstream_error",
                    engine: "legacy",
                  })
                } catch (error) {
                  writeSse(streamController, "error", {
                    message: formatChatError(error),
                  })
                  writeSse(streamController, "done", {
                    ok: false,
                    status: "upstream_error",
                  })
                }
                streamController.close()
                return
              }

              let response: Response

              if (useOpenUiEngine) {
                response = await streamCompletion({
                  config: llmConfig,
                  model: streamModel,
                  messages: finalMessages,
                  temperature: streamTemperature,
                  maxTokens: streamMaxTokens,
                  signal: controller.signal,
                })
              } else {
                const { messages: toolAwareMessages } = await runToolLoop({
                  config: llmConfig,
                  model: streamModel,
                  messages: finalMessages,
                  maxRounds: 2,
                  maxSearches: 3,
                  appendFinalAssistant: false,
                  temperature: streamTemperature,
                  maxTokens: streamMaxTokens,
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

                response = await streamCompletion({
                  config: llmConfig,
                  model: streamModel,
                  messages: toolAwareMessages,
                  temperature: streamTemperature,
                  maxTokens: streamMaxTokens,
                  signal: controller.signal,
                })
              }

              if (!response.ok || !response.body) {
                const text = await response.text().catch(() => "")
                console.error("LLM request failed:", response.status, text)
                writeSse(streamController, "error", {
                  message: formatChatError(
                    text ? new Error(`${response.status}: ${text}`) : new Error(String(response.status)),
                  ),
                })
                streamController.close()
                return
              }

              const reader = response.body.getReader()
              const decoder = new TextDecoder()
              let upstreamBuffer = ""
              let assistantText = ""
              let accumulatedToolCallsText = ""
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

                    const toolCalls = extractToolCallDeltas(choice)
                    if (toolCalls.length > 0) {
                      writeSse(streamController, "tool_delta", { toolCalls })
                      for (const tc of toolCalls) {
                        if (tc.function?.arguments) {
                          accumulatedToolCallsText += tc.function.arguments
                        }
                      }
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

              if (!useLegacyGenUi) {
                try {
                  const responseForSuggestions =
                    assistantText.trim() ||
                    (accumulatedToolCallsText.trim()
                      ? `[Rendered UI with arguments: ${accumulatedToolCallsText.trim()}]`
                      : "")

                  const suggestions = await Promise.race([
                    generateSuggestions(
                      llmConfig,
                      streamModel,
                      lastUserMessage,
                      responseForSuggestions,
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
              }

              writeSse(streamController, "done", {
                ok: true,
                finishReason: finishReason ?? "stop",
                maxTokens: streamMaxTokens,
                status: finishReason === "length" ? "max_tokens_reached" : "completed",
                ...(useOpenUiEngine ? { engine: "openui" as const } : {}),
              })
              streamController.close()
            } catch (error) {
              console.error("[api/chat] Stream processing error:", error)
              writeSse(streamController, "error", { message: formatChatError(error) })
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
