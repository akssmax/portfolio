import type { FileUIPart } from "ai"

export {
  MISTRAL_MODELS,
  type MistralModel,
  getDefaultChatModel,
  getDefaultEmbedModel,
  isValidChatModel,
} from "@/lib/llm/provider"

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
  model?: string
  messages: LlmChatMessage[]
  attachments?: FileUIPart[]
  temperature?: number
  maxTokens?: number
  mode?: "gen-ui" | "chat"
}
