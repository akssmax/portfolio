import { createFileRoute } from "@tanstack/react-router"

import {
  getDefaultChatModel,
  MISTRAL_MODELS,
  type LlmChatMessage,
} from "@/lib/llm/llm-types"
import { buildRetrievedContext, PORTFOLIO_SYSTEM_PROMPT } from "@/lib/rag/system-prompt"
import { retrieveForQuery } from "@/lib/rag/search"
import { checkRateLimit, getClientIp } from "@/lib/rag/rate-limit"

type ChatRequestBody = {
  model?: string
  messages?: LlmChatMessage[]
  temperature?: number
  maxTokens?: number
  retrievedContext?: string
}

type GroundedSource = { href: string; title: string }
type GroundedCitation = { href: string; label: string }

const DEFAULT_MAX_TOKENS = 1500
const MAX_MESSAGES = 40
const SUGGESTIONS_BUDGET_MS = 350

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
  try {
    const parsed = JSON.parse(raw) as unknown
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

  return { ok: true as const, model }
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.MISTRAL_API_KEY
        if (!apiKey) {
          return jsonError(500, "missing_api_key", "MISTRAL_API_KEY is not configured.")
        }

        const rate = checkRateLimit(getClientIp(request))
        if (!rate.allowed) {
          return jsonError(429, "rate_limited", "Too many requests. Please try again later.")
        }

        let body: ChatRequestBody
        try {
          body = (await request.json()) as ChatRequestBody
        } catch {
          return jsonError(400, "invalid_json", "Request body must be JSON.")
        }

        const validation = validateRequest(body)
        if (!validation.ok) {
          return jsonError(validation.status, validation.code, validation.message)
        }

        const messages = body.messages ?? []
        const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content ?? ""

        let retrievedContext = body.retrievedContext?.trim() ?? ""
        if (!retrievedContext && lastUserMessage.trim()) {
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

        const finalMessages: LlmChatMessage[] = [
          { role: "system", content: PORTFOLIO_SYSTEM_PROMPT },
          ...(retrievedContext
            ? [{ role: "system" as const, content: `Retrieved context:\n${retrievedContext}` }]
            : []),
          ...messages,
        ]

        const controller = new AbortController()
        const timeoutMs = Number(process.env.VERCEL_CHAT_TIMEOUT_MS) || 55_000
        const timeout = setTimeout(() => controller.abort("timeout"), timeoutMs)

        const stream = new ReadableStream({
          async start(streamController) {
            try {
              const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${apiKey}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  model: validation.model,
                  messages: finalMessages,
                  max_tokens: body.maxTokens ?? DEFAULT_MAX_TOKENS,
                  temperature: body.temperature ?? 0.5,
                  stream: true,
                }),
                signal: controller.signal,
              })

              if (!response.ok || !response.body) {
                const text = await response.text().catch(() => "")
                writeSse(streamController, "error", {
                  message: text || "Mistral request failed.",
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
                maxTokens: body.maxTokens ?? DEFAULT_MAX_TOKENS,
                status: finishReason === "length" ? "max_tokens_reached" : "completed",
              })
              streamController.close()
            } catch (error) {
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
