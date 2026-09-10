import { describe, expect, it } from "vitest"

import {
  EMPTY_RESPONSE_ERROR,
  formatChatError,
  hasAssistantPayload,
} from "@/lib/llm/chat-errors"

describe("formatChatError", () => {
  it("maps rate limit errors to a friendly message", () => {
    expect(
      formatChatError(
        new Error('OpenRouter API error (429): {"message":"Rate limit exceeded"}'),
      ),
    ).toContain("rate-limited")
  })

  it("truncates long provider errors", () => {
    expect(formatChatError(new Error("x".repeat(300)))).toContain("Something went wrong")
  })
})

describe("hasAssistantPayload", () => {
  it("detects empty responses", () => {
    expect(hasAssistantPayload({ content: "", toolCalls: [] })).toBe(false)
    expect(hasAssistantPayload({ content: "Hello" })).toBe(true)
    expect(
      hasAssistantPayload({
        content: "",
        toolCalls: [{ name: "render_custom_ui", arguments: '{"title":"Hi"}' }],
      }),
    ).toBe(true)
  })

  it("exports empty response copy", () => {
    expect(EMPTY_RESPONSE_ERROR.length).toBeGreaterThan(10)
  })
})
