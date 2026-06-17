import type { LlmChatMessage, LlmToolCall } from "@/lib/llm/llm-types"
import { executeToolCall, type ToolExecutionContext } from "@/lib/llm/tools/executor"
import { WEB_SEARCH_TOOL_DEFINITION } from "@/lib/llm/tools/web-search-tool"

export type MistralToolLoopOptions = {
  apiKey: string
  model: string
  messages: LlmChatMessage[]
  maxRounds?: number
  maxSearches?: number
  temperature?: number
  maxTokens?: number
  responseFormat?: { type: "json_object" }
  enableTools?: boolean
  /** When false, the final assistant reply is returned in `content` but not appended to `messages` (for streaming). */
  appendFinalAssistant?: boolean
  toolContext?: ToolExecutionContext
  onToolStart?: (payload: { name: string; query?: string }) => void
  onToolEnd?: (payload: { name: string; query?: string; resultCount?: number; error?: string }) => void
}

type MistralToolCall = {
  id: string
  type: "function"
  function: {
    name: string
    arguments: string
  }
}

type MistralCompletionResponse = {
  choices?: Array<{
    finish_reason?: string
    message?: {
      role?: string
      content?: string | null
      tool_calls?: MistralToolCall[]
    }
  }>
}

export function toMistralApiMessages(messages: LlmChatMessage[]) {
  return messages.map((message) => {
    if (message.role === "tool") {
      return {
        role: "tool",
        content: message.content,
        name: message.name,
        tool_call_id: message.tool_call_id,
      }
    }

    if (message.role === "assistant" && "tool_calls" in message) {
      return {
        role: "assistant",
        content: message.content,
        tool_calls: message.tool_calls.map((call) => ({
          id: call.id,
          type: "function",
          function: {
            name: call.name,
            arguments: call.arguments,
          },
        })),
      }
    }

    return { role: message.role, content: message.content }
  })
}

function parseToolCalls(raw?: MistralToolCall[]): LlmToolCall[] {
  if (!raw?.length) return []
  return raw.map((call) => ({
    id: call.id,
    name: call.function.name,
    arguments: call.function.arguments,
  }))
}

export async function runMistralToolLoop(
  options: MistralToolLoopOptions,
): Promise<{ messages: LlmChatMessage[]; content: string }> {
  const maxRounds = options.maxRounds ?? 2
  const messages = [...options.messages]
  const searchesUsed = { count: 0 }
  const enableTools = options.enableTools ?? true
  const appendFinalAssistant = options.appendFinalAssistant ?? true

  for (let round = 0; round < maxRounds; round += 1) {
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${options.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: options.model,
        messages: toMistralApiMessages(messages),
        ...(enableTools
          ? {
              tools: [WEB_SEARCH_TOOL_DEFINITION],
              tool_choice: "auto",
            }
          : {}),
        temperature: options.temperature ?? 0.3,
        max_tokens: options.maxTokens ?? 2048,
        ...(options.responseFormat && !enableTools
          ? { response_format: options.responseFormat }
          : {}),
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Mistral API error (${response.status}): ${errorText}`)
    }

    const payload = (await response.json()) as MistralCompletionResponse
    const choice = payload.choices?.[0]
    const assistantMessage = choice?.message
    const toolCalls = parseToolCalls(assistantMessage?.tool_calls)

    if (enableTools && toolCalls.length > 0) {
      messages.push({
        role: "assistant",
        content: assistantMessage?.content ?? "",
        tool_calls: toolCalls,
      })

      for (const call of toolCalls) {
        let query: string | undefined
        try {
          const parsed = JSON.parse(call.arguments) as { query?: string }
          query = parsed.query
        } catch {
          query = undefined
        }

        options.onToolStart?.({ name: call.name, query })

        const result = await executeToolCall(call.name, call.arguments, {
          ...options.toolContext,
          maxSearches: options.maxSearches ?? 3,
          searchesUsed,
          onSearchStart: (q) => options.onToolStart?.({ name: call.name, query: q }),
          onSearchEnd: (q, count) =>
            options.onToolEnd?.({ name: call.name, query: q, resultCount: count }),
        })

        options.onToolEnd?.({
          name: call.name,
          query,
          resultCount: result.error ? 0 : undefined,
          error: result.error,
        })

        messages.push({
          role: "tool",
          name: call.name,
          tool_call_id: call.id,
          content: result.error
            ? `Error: ${result.error}`
            : result.content,
        })
      }

      continue
    }

    const content = assistantMessage?.content ?? ""
    if (appendFinalAssistant) {
      messages.push({ role: "assistant", content })
    }
    return { messages, content }
  }

  const finalResponse = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${options.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: options.model,
      messages: toMistralApiMessages(messages),
      temperature: options.temperature ?? 0.3,
      max_tokens: options.maxTokens ?? 2048,
      ...(options.responseFormat ? { response_format: options.responseFormat } : {}),
    }),
  })

  if (!finalResponse.ok) {
    const errorText = await finalResponse.text()
    throw new Error(`Mistral API error (${finalResponse.status}): ${errorText}`)
  }

  const payload = (await finalResponse.json()) as MistralCompletionResponse
  const content = payload.choices?.[0]?.message?.content ?? ""
  if (appendFinalAssistant) {
    messages.push({ role: "assistant", content })
  }
  return { messages, content }
}

export async function streamMistralCompletion(options: {
  apiKey: string
  model: string
  messages: LlmChatMessage[]
  temperature?: number
  maxTokens?: number
  signal?: AbortSignal
}): Promise<Response> {
  return fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${options.apiKey}`,
      "Content-Type": "application/json",
    },
    signal: options.signal,
    body: JSON.stringify({
      model: options.model,
      messages: toMistralApiMessages(options.messages),
      stream: true,
      temperature: options.temperature ?? 0.3,
      max_tokens: options.maxTokens ?? 2048,
    }),
  })
}
