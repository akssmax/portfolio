import {
  createChatCompletion,
  createChatCompletionStream,
  type ChatCompletionResponse,
} from "@/lib/llm/openai-compatible-client"
import type { ResolvedLlmConfig } from "@/lib/llm/provider"
import type { LlmChatMessage, LlmToolCall } from "@/lib/llm/llm-types"
import { executeToolCall, type ToolExecutionContext } from "@/lib/llm/tools/executor"
import { WEB_SEARCH_TOOL_DEFINITION } from "@/lib/llm/tools/web-search-tool"

export type ToolLoopOptions = {
  config: ResolvedLlmConfig
  model: string
  messages: LlmChatMessage[]
  maxRounds?: number
  maxSearches?: number
  temperature?: number
  maxTokens?: number
  responseFormat?: { type: "json_object" }
  enableTools?: boolean
  tools?: any[]
  /** When false, the final assistant reply is returned in `content` but not appended to `messages` (for streaming). */
  appendFinalAssistant?: boolean
  toolContext?: ToolExecutionContext
  onToolStart?: (payload: { name: string; query?: string }) => void
  onToolEnd?: (payload: { name: string; query?: string; resultCount?: number; error?: string; result?: string }) => void
}

type ApiToolCall = {
  id: string
  type: "function"
  function: {
    name: string
    arguments: string
  }
}

export function toApiMessages(messages: LlmChatMessage[]) {
  return messages.map((message) => {
    if (message.role === "tool") {
      return {
        role: "tool",
        content: message.content,
        name: message.name,
        tool_call_id: message.tool_call_id,
      }
    }

    if (message.role === "assistant" && "tool_calls" in message && message.tool_calls) {
      return {
        role: "assistant",
        content: message.content,
        tool_calls: message.tool_calls.map((call: any) => {
          const name = call.name || call.function?.name
          const args = call.arguments || call.function?.arguments
          return {
            id: call.id,
            type: "function",
            function: {
              name: name || "",
              arguments: typeof args === "object" ? JSON.stringify(args) : (args || ""),
            },
          }
        }),
      }
    }

    return { role: message.role, content: message.content }
  })
}

/** @deprecated Use toApiMessages */
export const toMistralApiMessages = toApiMessages

function parseToolCalls(raw?: ApiToolCall[]): LlmToolCall[] {
  if (!raw?.length) return []
  return raw.map((call) => ({
    id: call.id,
    name: call.function.name,
    arguments: call.function.arguments,
  }))
}

function extractAssistantMessage(payload: ChatCompletionResponse) {
  const choice = payload.choices?.[0]
  return {
    choice,
    assistantMessage: choice?.message,
    toolCalls: parseToolCalls(choice?.message?.tool_calls as ApiToolCall[] | undefined),
  }
}

export async function runToolLoop(
  options: ToolLoopOptions,
): Promise<{ messages: LlmChatMessage[]; content: string }> {
  const maxRounds = options.maxRounds ?? 2
  const messages = [...options.messages]
  const searchesUsed = { count: 0 }
  const enableTools = options.enableTools ?? true
  const appendFinalAssistant = options.appendFinalAssistant ?? true

  for (let round = 0; round < maxRounds; round += 1) {
    const payload = await createChatCompletion(options.config, {
      model: options.model,
      messages: toApiMessages(messages),
      ...(enableTools
        ? {
            tools: options.tools ?? [WEB_SEARCH_TOOL_DEFINITION],
            tool_choice: "auto",
          }
        : {}),
      temperature: options.temperature ?? 0.3,
      max_tokens: options.maxTokens ?? 2048,
      ...(options.responseFormat && !enableTools
        ? { response_format: options.responseFormat }
        : {}),
    })

    const { assistantMessage, toolCalls } = extractAssistantMessage(payload)

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
          result: result.content,
        })

        messages.push({
          role: "tool",
          name: call.name,
          tool_call_id: call.id,
          content: result.error ? `Error: ${result.error}` : result.content,
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

  const payload = await createChatCompletion(options.config, {
    model: options.model,
    messages: toApiMessages(messages),
    temperature: options.temperature ?? 0.3,
    max_tokens: options.maxTokens ?? 2048,
    ...(options.responseFormat ? { response_format: options.responseFormat } : {}),
  })

  const content = payload.choices?.[0]?.message?.content ?? ""
  if (appendFinalAssistant) {
    messages.push({ role: "assistant", content })
  }
  return { messages, content }
}

export async function streamCompletion(options: {
  config: ResolvedLlmConfig
  model: string
  messages: LlmChatMessage[]
  temperature?: number
  maxTokens?: number
  signal?: AbortSignal
  tools?: any[]
  toolChoice?: any
  parallelToolCalls?: boolean
}): Promise<Response> {
  return createChatCompletionStream(
    options.config,
    {
      model: options.model,
      messages: toApiMessages(options.messages),
      temperature: options.temperature ?? 0.3,
      max_tokens: options.maxTokens ?? 2048,
      ...(options.tools ? { tools: options.tools } : {}),
      ...(options.toolChoice !== undefined ? { tool_choice: options.toolChoice } : {}),
      ...(options.parallelToolCalls === false ? { parallel_tool_calls: false } : {}),
    },
    options.signal,
  )
}

/** @deprecated Use runToolLoop */
export async function runMistralToolLoop(
  options: Omit<ToolLoopOptions, "config"> & { apiKey: string; config?: ResolvedLlmConfig },
): Promise<{ messages: LlmChatMessage[]; content: string }> {
  const { apiKey, config, ...rest } = options
  const resolved =
    config ??
    ({
      provider: "mistral",
      apiKey,
      chatBaseUrl: "https://api.mistral.ai/v1",
      embedBaseUrl: "https://api.mistral.ai/v1",
      chatModel: rest.model,
      embedModel: "mistral-embed",
    } satisfies ResolvedLlmConfig)

  return runToolLoop({ ...rest, config: resolved })
}

/** @deprecated Use streamCompletion */
export async function streamMistralCompletion(
  options: Omit<Parameters<typeof streamCompletion>[0], "config"> & {
    apiKey: string
    config?: ResolvedLlmConfig
  },
): Promise<Response> {
  const { apiKey, config, ...rest } = options
  const resolved =
    config ??
    ({
      provider: "mistral",
      apiKey,
      chatBaseUrl: "https://api.mistral.ai/v1",
      embedBaseUrl: "https://api.mistral.ai/v1",
      chatModel: rest.model,
      embedModel: "mistral-embed",
    } satisfies ResolvedLlmConfig)

  return streamCompletion({ ...rest, config: resolved })
}
