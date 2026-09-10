export type StreamToolCallDelta = {
  index?: number
  id?: string
  type?: string
  function?: {
    name?: string
    arguments?: string
  }
}

export type NormalizedToolCall = {
  id: string
  name: string
  arguments: string
}

export function extractToolCallDeltas(choice: unknown): StreamToolCallDelta[] {
  if (!choice || typeof choice !== "object") return []
  const c = choice as Record<string, unknown>
  const delta = c.delta as Record<string, unknown> | undefined
  const message = c.message as Record<string, unknown> | undefined

  const fromDelta = delta?.tool_calls
  if (Array.isArray(fromDelta) && fromDelta.length > 0) {
    return fromDelta as StreamToolCallDelta[]
  }

  const fromMessage = message?.tool_calls
  if (Array.isArray(fromMessage) && fromMessage.length > 0) {
    return fromMessage as StreamToolCallDelta[]
  }

  return []
}

export function mergeToolCallDeltas(
  existing: NormalizedToolCall[],
  deltas: StreamToolCallDelta[],
): NormalizedToolCall[] {
  const merged = existing.map((call) => ({ ...call }))

  for (const delta of deltas) {
    const index = delta.index ?? 0
    if (!merged[index]) {
      merged[index] = {
        id: delta.id ?? `call_${index}`,
        name: delta.function?.name ?? "",
        arguments: "",
      }
    }
    if (delta.id) merged[index].id = delta.id
    if (delta.function?.name) merged[index].name = delta.function.name
    if (delta.function?.arguments) {
      merged[index].arguments += delta.function.arguments
    }
  }

  return merged
}

export function normalizeToolCalls(raw: unknown): NormalizedToolCall[] {
  if (!Array.isArray(raw)) return []

  return raw.map((call, index) => {
    const c = call as Record<string, unknown>
    const fn = c.function as Record<string, unknown> | undefined
    return {
      id: typeof c.id === "string" ? c.id : `call_${index}`,
      name: typeof fn?.name === "string" ? fn.name : typeof c.name === "string" ? c.name : "",
      arguments:
        typeof fn?.arguments === "string"
          ? fn.arguments
          : typeof c.arguments === "string"
            ? c.arguments
            : "",
    }
  })
}

export function deltasFromNormalizedCalls(calls: NormalizedToolCall[]): StreamToolCallDelta[] {
  return calls.map((call, index) => ({
    index,
    id: call.id,
    type: "function",
    function: { name: call.name, arguments: call.arguments },
  }))
}

/** Some models return JSON in message.content instead of tool_calls. */
export function parseGenUiPayloadFromText(text: string): Record<string, unknown> | null {
  const trimmed = text.trim()
  if (!trimmed) return null

  let candidate = trimmed
  if (candidate.startsWith("```")) {
    candidate = candidate.replace(/^```[a-zA-Z]*\n?/, "").replace(/\n?```$/, "").trim()
  }

  try {
    const parsed = JSON.parse(candidate) as Record<string, unknown>
    if (typeof parsed.title === "string" && typeof parsed.layout === "string") {
      return parsed
    }
  } catch {
    // ignore
  }

  return null
}

export function buildSyntheticGenUiCall(
  payload: Record<string, unknown>,
  name: string,
): NormalizedToolCall {
  return {
    id: `call_gen_ui_${Date.now()}`,
    name,
    arguments: JSON.stringify(payload),
  }
}

export function chunkToolArgumentDeltas(
  call: NormalizedToolCall,
): StreamToolCallDelta[] {
  const deltas: StreamToolCallDelta[] = [
    {
      index: 0,
      id: call.id,
      type: "function",
      function: { name: call.name, arguments: "" },
    },
  ]

  const args = call.arguments
  const chunkSize = 56
  for (let i = 0; i < args.length; i += chunkSize) {
    deltas.push({
      index: 0,
      function: { arguments: args.slice(i, i + chunkSize) },
    })
  }

  return deltas
}
