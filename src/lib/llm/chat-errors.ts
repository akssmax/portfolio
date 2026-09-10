const DEFAULT_ERROR =
  "Something went wrong while generating a response. Please try again in a moment."

export function formatChatError(raw: unknown): string {
  const text =
    raw instanceof Error ? raw.message : typeof raw === "string" ? raw : DEFAULT_ERROR

  if (/rate.?limit|429|rate_limited|temporarily rate-limited/i.test(text)) {
    return "The AI model is temporarily rate-limited. Please wait a moment and try again."
  }

  if (/missing_api_key|not configured/i.test(text)) {
    return "Chat is not configured on this server. Please try again later."
  }

  if (/temporarily unavailable/i.test(text)) {
    return "The AI service is temporarily unavailable. Please try again."
  }

  if (/aborted|abort/i.test(text)) {
    return "The request was cancelled."
  }

  if (/OpenRouter API error|Mistral API error|LLM request failed/i.test(text)) {
    if (/rate.?limit|429/i.test(text)) {
      return "The AI model is temporarily rate-limited. Please wait a moment and try again."
    }
    return "The AI provider returned an error. Please try again."
  }

  if (/Request failed \(4\d\d\)/.test(text)) {
    return "The request could not be completed. Please check your message and try again."
  }

  if (/Request failed \(5\d\d\)/.test(text)) {
    return "The chat service encountered a server error. Please try again."
  }

  if (text.length > 180) {
    return DEFAULT_ERROR
  }

  return text
}

export const EMPTY_RESPONSE_ERROR =
  "The AI didn't return a response. This can happen when the model is busy — please try again."

export function hasAssistantPayload(options: {
  content: string
  toolCalls?: Array<{ name?: string; arguments?: string }>
}): boolean {
  if (options.content.trim().length > 0) return true
  return (
    options.toolCalls?.some(
      (call) => Boolean(call.name) && (call.arguments?.trim().length ?? 0) > 2,
    ) ?? false
  )
}
