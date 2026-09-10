import { describe, expect, it } from "vitest"

import {
  getPortfolioScopeRedirect,
  isLikelyOffTopicQuery,
} from "@/lib/rag/portfolio-scope"

describe("portfolio-scope", () => {
  it("flags creative off-topic requests", () => {
    expect(isLikelyOffTopicQuery("write me a poem")).toBe(true)
    expect(isLikelyOffTopicQuery("tell me a joke")).toBe(true)
  })

  it("allows portfolio-related questions", () => {
    expect(isLikelyOffTopicQuery("What's his work experience?")).toBe(false)
    expect(isLikelyOffTopicQuery("How does he ship Figma to React?")).toBe(false)
    expect(isLikelyOffTopicQuery("Why hire Akshay for a fintech startup?")).toBe(false)
  })

  it("flags model identity probes", () => {
    expect(isLikelyOffTopicQuery("what model are you")).toBe(true)
    expect(isLikelyOffTopicQuery("are you GPT-4")).toBe(true)
  })

  it("returns redirect copy without naming providers", () => {
    const redirect = getPortfolioScopeRedirect("write me a poem")
    expect(redirect.toLowerCase()).toContain("portfolio")
    expect(redirect.toLowerCase()).not.toContain("mistral")
    expect(redirect.toLowerCase()).not.toContain("openrouter")

    const modelRedirect = getPortfolioScopeRedirect("what model are you")
    expect(modelRedirect.toLowerCase()).toContain("portfolio")
    expect(modelRedirect.toLowerCase()).not.toMatch(/\b(gpt|claude|mistral|openrouter|llama)\b/)
  })
})
