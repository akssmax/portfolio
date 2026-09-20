export type GenUiEngine = "legacy" | "openui"

type GenUiMessageLike = {
  mode?: "gen-ui" | "chat"
  genUiEngine?: GenUiEngine
  content?: string
  toolCalls?: Array<{ name?: string; arguments?: string }>
}

export function resolveGenUiEngine(message: GenUiMessageLike): GenUiEngine | null {
  if (message.mode !== "gen-ui") return null
  if (message.genUiEngine) return message.genUiEngine

  const hasLegacyToolCall =
    message.toolCalls?.some(
      (call) => Boolean(call.name) && (call.arguments?.trim().length ?? 0) > 2,
    ) ?? false

  if (hasLegacyToolCall) return "legacy"
  if (message.content?.trim()) return "openui"
  return null
}

export function hasLegacyGenUiToolCalls(
  toolCalls?: Array<{ name?: string; arguments?: string }>,
): boolean {
  return (
    toolCalls?.some(
      (call) => Boolean(call.name) && (call.arguments?.trim().length ?? 0) > 2,
    ) ?? false
  )
}
