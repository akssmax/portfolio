import type { FileUIPart } from "ai"

export const MISTRAL_MODELS = [
  "mistral-small-latest",
  "mistral-medium-latest",
  "mistral-large-latest",
] as const

export type MistralModel = (typeof MISTRAL_MODELS)[number]

export type ChatCompletionStatus =
  | "completed"
  | "max_tokens_reached"
  | "timeout"
  | "upstream_error"
  | "aborted_by_user"

export type LlmToolCall = {
  id: string
  name: string
  arguments: string
}

export type LlmChatMessage =
  | { role: "system" | "user" | "assistant"; content: string }
  | { role: "assistant"; content: string; tool_calls: LlmToolCall[] }
  | { role: "tool"; content: string; name: string; tool_call_id: string }

export interface LlmChatRequest {
  model: MistralModel
  messages: LlmChatMessage[]
  attachments?: FileUIPart[]
  temperature?: number
  maxTokens?: number
}

export function getDefaultChatModel(): MistralModel {
  const envModel = process.env.MISTRAL_CHAT_MODEL
  if (envModel && MISTRAL_MODELS.includes(envModel as MistralModel)) {
    return envModel as MistralModel
  }
  return "mistral-small-latest"
}
