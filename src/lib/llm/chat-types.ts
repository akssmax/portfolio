import type { UIMessage } from "ai"

export type ChatSource = { href: string; title: string }

export type AssistantMeta = {
  reasoning?: { content: string; durationSeconds?: number }
  sources?: ChatSource[]
  citations?: Array<{ label: string; href: string }>
  feedback?: "up" | "down"
}

export type ChatItem = {
  id: string
  message: UIMessage
  meta?: AssistantMeta
}

export type ChatStatus = "ready" | "submitted" | "streaming" | "error"
