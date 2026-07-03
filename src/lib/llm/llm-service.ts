import type { ChatCompletionStatus, LlmChatRequest } from "@/lib/llm/llm-types"
import type { AssistantMeta, ChatSource } from "@/lib/llm/chat-types"

type Citation = NonNullable<AssistantMeta["citations"]>[number]
type ReasoningMeta = NonNullable<AssistantMeta["reasoning"]>
type StreamDonePayload = {
  status?: ChatCompletionStatus
  finishReason?: string
  maxTokens?: number
}

export type StreamChatResult = {
  completionStatus: ChatCompletionStatus
  emittedTokens: number
  finishReason?: string
  maxTokens?: number
}

export interface StreamChatOptions extends LlmChatRequest {
  onToken: (token: string) => void
  onSuggestions?: (suggestions: string[]) => void
  onReasoning?: (reasoning: ReasoningMeta) => void
  onSources?: (sources: ChatSource[]) => void
  onCitations?: (citations: Citation[]) => void
  onToolStart?: (payload: { name: string; query?: string }) => void
  onToolEnd?: (payload: { name: string; query?: string; resultCount?: number; error?: string; result?: string }) => void
  onToolDelta?: (toolCalls: any[]) => void
  onComplete?: (result: StreamChatResult) => void
  signal?: AbortSignal
  chatApiPath?: string
}

const RETRY_DELAY_MS = 500

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function shouldRetryStatus(status: number): boolean {
  return status >= 500
}

function parseSseEvent(rawEvent: string): { event: string; data: string } | null {
  const lines = rawEvent
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .filter(Boolean)

  if (lines.length === 0) return null

  let event = "message"
  const dataParts: string[] = []

  for (const line of lines) {
    if (line.startsWith("event:")) {
      event = line.slice("event:".length).trim()
    } else if (line.startsWith("data:")) {
      dataParts.push(line.slice("data:".length).trim())
    }
  }

  return { event, data: dataParts.join("\n") }
}

async function streamSseResponse(
  response: Response,
  onToken: (token: string) => void,
  onSuggestions?: (suggestions: string[]) => void,
  onReasoning?: (reasoning: ReasoningMeta) => void,
  onSources?: (sources: ChatSource[]) => void,
  onCitations?: (citations: Citation[]) => void,
  onToolStart?: (payload: { name: string; query?: string }) => void,
  onToolEnd?: (payload: { name: string; query?: string; resultCount?: number; error?: string; result?: string }) => void,
  onToolDelta?: (toolCalls: any[]) => void,
): Promise<StreamDonePayload | null> {
  if (!response.body) {
    throw new Error("Missing response body from /api/chat")
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ""
  let donePayload: StreamDonePayload | null = null

  const processEvent = (rawEvent: string) => {
    const parsed = parseSseEvent(rawEvent)
    if (!parsed) return

    if (parsed.event === "token") {
      try {
        const payload = JSON.parse(parsed.data) as { text?: string }
        if (payload.text) onToken(payload.text)
      } catch {
        // ignore
      }
    } else if (parsed.event === "suggestions") {
      try {
        const payload = JSON.parse(parsed.data) as { suggestions?: unknown }
        if (!Array.isArray(payload.suggestions)) return
        const suggestions = payload.suggestions.filter(
          (item): item is string => typeof item === "string",
        )
        if (suggestions.length > 0) onSuggestions?.(suggestions)
      } catch {
        // ignore
      }
    } else if (parsed.event === "reasoning") {
      try {
        const payload = JSON.parse(parsed.data) as {
          reasoning?: { content?: unknown; durationSeconds?: unknown }
        }
        if (typeof payload.reasoning?.content !== "string") return
        onReasoning?.({
          content: payload.reasoning.content,
          durationSeconds:
            typeof payload.reasoning.durationSeconds === "number"
              ? payload.reasoning.durationSeconds
              : undefined,
        })
      } catch {
        // ignore
      }
    } else if (parsed.event === "sources") {
      try {
        const payload = JSON.parse(parsed.data) as { sources?: unknown }
        if (!Array.isArray(payload.sources)) return
        const sources = payload.sources.filter(
          (item): item is ChatSource =>
            Boolean(item) &&
            typeof item === "object" &&
            typeof (item as ChatSource).href === "string" &&
            typeof (item as ChatSource).title === "string",
        )
        if (sources.length > 0) onSources?.(sources)
      } catch {
        // ignore
      }
    } else if (parsed.event === "citations") {
      try {
        const payload = JSON.parse(parsed.data) as { citations?: unknown }
        if (!Array.isArray(payload.citations)) return
        const citations = payload.citations.filter(
          (item): item is Citation =>
            Boolean(item) &&
            typeof item === "object" &&
            typeof (item as Citation).href === "string" &&
            typeof (item as Citation).label === "string",
        )
        if (citations.length > 0) onCitations?.(citations)
      } catch {
        // ignore
      }
    } else if (parsed.event === "tool_start") {
      try {
        const payload = JSON.parse(parsed.data) as { name?: string; query?: string }
        if (typeof payload.name === "string") {
          onToolStart?.({ name: payload.name, query: payload.query })
        }
      } catch {
        // ignore
      }
    } else if (parsed.event === "tool_end") {
      try {
        const payload = JSON.parse(parsed.data) as {
          name?: string
          query?: string
          resultCount?: number
          error?: string
          result?: string
        }
        if (typeof payload.name === "string") {
          onToolEnd?.({
            name: payload.name,
            query: payload.query,
            resultCount: payload.resultCount,
            error: payload.error,
            result: payload.result,
          })
        }
      } catch {
        // ignore
      }
    } else if (parsed.event === "error") {
      try {
        const payload = JSON.parse(parsed.data) as { message?: string }
        throw new Error(payload.message || "Streaming failed")
      } catch (error) {
        if (error instanceof Error) throw error
        throw new Error("Streaming failed")
      }
    } else if (parsed.event === "tool_delta") {
      try {
        const payload = JSON.parse(parsed.data) as { toolCalls?: any[] }
        if (payload.toolCalls) onToolDelta?.(payload.toolCalls)
      } catch {
        // ignore
      }
    } else if (parsed.event === "done") {
      try {
        donePayload = JSON.parse(parsed.data) as StreamDonePayload
      } catch {
        // ignore
      }
    }
  }

  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      const trailing = buffer.trim()
      if (trailing) processEvent(trailing)
      break
    }

    buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, "\n")
    let separatorIndex = buffer.indexOf("\n\n")
    while (separatorIndex !== -1) {
      processEvent(buffer.slice(0, separatorIndex))
      buffer = buffer.slice(separatorIndex + 2)
      separatorIndex = buffer.indexOf("\n\n")
    }
  }

  return donePayload
}

async function requestChat(
  payload: LlmChatRequest,
  signal: AbortSignal | undefined,
  onToken: (token: string) => void,
  onSuggestions: ((suggestions: string[]) => void) | undefined,
  onReasoning: ((reasoning: ReasoningMeta) => void) | undefined,
  onSources: ((sources: ChatSource[]) => void) | undefined,
  onCitations: ((citations: Citation[]) => void) | undefined,
  onToolStart: ((payload: { name: string; query?: string }) => void) | undefined,
  onToolEnd: ((payload: { name: string; query?: string; resultCount?: number; error?: string; result?: string }) => void) | undefined,
  onToolDelta: ((toolCalls: any[]) => void) | undefined,
  chatApiPath: string,
): Promise<StreamChatResult> {
  const response = await fetch(chatApiPath, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal,
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => "")
    throw new Error(
      `Request failed (${response.status}): ${errorText || response.statusText || "Unknown error"}`,
    )
  }

  let tokenCount = 0
  const donePayload = await streamSseResponse(
    response,
    (token) => {
      tokenCount += 1
      onToken(token)
    },
    onSuggestions,
    onReasoning,
    onSources,
    onCitations,
    onToolStart,
    onToolEnd,
    onToolDelta,
  )

  return {
    completionStatus: donePayload?.status ?? "completed",
    emittedTokens: tokenCount,
    finishReason: donePayload?.finishReason,
    maxTokens: donePayload?.maxTokens,
  }
}

export async function streamChat(options: StreamChatOptions): Promise<StreamChatResult> {
  const {
    onToken,
    onSuggestions,
    onReasoning,
    onSources,
    onCitations,
    onToolStart,
    onToolEnd,
    onToolDelta,
    onComplete,
    signal,
    chatApiPath = "/api/chat",
    ...payload
  } = options

  try {
    const result = await requestChat(
      payload,
      signal,
      onToken,
      onSuggestions,
      onReasoning,
      onSources,
      onCitations,
      onToolStart,
      onToolEnd,
      onToolDelta,
      chatApiPath,
    )
    onComplete?.(result)
    return result
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    const isNetworkError = error instanceof TypeError
    const statusMatch = errorMessage.match(/Request failed \((\d+)\):/)
    const status = statusMatch ? Number(statusMatch[1]) : NaN
    const shouldRetry =
      isNetworkError || (Number.isFinite(status) && shouldRetryStatus(status))

    if (!shouldRetry) throw error

    await sleep(RETRY_DELAY_MS)
    const result = await requestChat(
      payload,
      signal,
      onToken,
      onSuggestions,
      onReasoning,
      onSources,
      onCitations,
      onToolStart,
      onToolEnd,
      onToolDelta,
      chatApiPath,
    )
    onComplete?.(result)
    return result
  }
}

export { parseSseEvent }
