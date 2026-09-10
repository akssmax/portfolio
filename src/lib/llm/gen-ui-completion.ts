import { createChatCompletion } from "@/lib/llm/openai-compatible-client"
import type { LlmChatMessage } from "@/lib/llm/llm-types"
import type { ResolvedLlmConfig } from "@/lib/llm/provider"
import {
  getGenUiStreamOptions,
  getGenUiToolChoice,
  RENDER_CUSTOM_UI_TOOL_NAME,
  RENDER_CUSTOM_UI_TOOL_DEFINITION,
} from "@/lib/llm/tools/gen-ui-tools"
import {
  buildSyntheticGenUiCall,
  chunkToolArgumentDeltas,
  normalizeToolCalls,
  parseGenUiPayloadFromText,
  type NormalizedToolCall,
} from "@/lib/llm/tool-call-utils"

export type GenUiCompletionResult = {
  toolCalls: NormalizedToolCall[]
  finishReason?: string
}

async function requestGenUiToolCalls(options: {
  config: ResolvedLlmConfig
  model: string
  messages: LlmChatMessage[]
  toolChoice: unknown
  signal?: AbortSignal
}): Promise<GenUiCompletionResult> {
  const genUiOptions = getGenUiStreamOptions(options.config)
  const payload = await createChatCompletion(
    options.config,
    {
      model: options.model,
      messages: options.messages,
      tools: genUiOptions.tools,
      tool_choice: options.toolChoice,
      parallel_tool_calls: false,
      temperature: genUiOptions.temperature,
      max_tokens: genUiOptions.maxTokens,
    },
    options.signal,
  )

  const choice = payload.choices?.[0]
  const message = choice?.message
  let toolCalls = normalizeToolCalls(message?.tool_calls)

  if (toolCalls.length === 0 && typeof message?.content === "string") {
    const parsed = parseGenUiPayloadFromText(message.content)
    if (parsed) {
      toolCalls = [buildSyntheticGenUiCall(parsed, RENDER_CUSTOM_UI_TOOL_NAME)]
    }
  }

  return {
    toolCalls: toolCalls.filter((call) => call.name && call.arguments.trim()),
    finishReason: choice?.finish_reason,
  }
}

/** Non-streaming Gen UI completion with tool_choice fallbacks for cross-provider support. */
export async function completeGenUiToolCalls(options: {
  config: ResolvedLlmConfig
  model: string
  messages: LlmChatMessage[]
  signal?: AbortSignal
}): Promise<GenUiCompletionResult> {
  const primaryChoice = getGenUiToolChoice(options.config)
  const result = await requestGenUiToolCalls({ ...options, toolChoice: primaryChoice })
  if (result.toolCalls.length > 0) return result

  const namedChoice = {
    type: "function" as const,
    function: { name: RENDER_CUSTOM_UI_TOOL_NAME },
  }
  const retry = await requestGenUiToolCalls({ ...options, toolChoice: namedChoice })
  if (retry.toolCalls.length > 0) return retry

  const autoResult = await requestGenUiToolCalls({ ...options, toolChoice: "auto" })
  return autoResult
}

export function genUiCallsToStreamDeltas(calls: NormalizedToolCall[]) {
  if (calls.length === 0) return []
  return chunkToolArgumentDeltas(calls[0])
}

export { RENDER_CUSTOM_UI_TOOL_DEFINITION }
