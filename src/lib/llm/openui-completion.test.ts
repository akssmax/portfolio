import { afterEach, describe, expect, it, vi } from "vitest"

import {
  buildOpenUiMessages,
  buildOpenUiScopeRedirectLang,
  getPortfolioOpenUiSystemPrompt,
  getPortfolioPromptOptionsSummary,
} from "@/lib/llm/openui-completion"
import { PORTFOLIO_SCOPE_RULES } from "@/lib/rag/portfolio-scope"

describe("openui-completion", () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("buildOpenUiMessages includes system prompt, RAG, and history", () => {
    const messages = buildOpenUiMessages({
      history: [
        { role: "user", content: "Show featured projects" },
        { role: "assistant", content: "root = Card([])" },
      ],
      ragContext: "Project: Kodo — YC W21 fintech",
    })

    expect(messages[0]?.role).toBe("system")
    expect(messages[0]?.content).toContain("Akshay")
    expect(messages[1]?.role).toBe("system")
    expect(messages[1]?.content).toContain("Retrieved context:")
    expect(messages[1]?.content).toContain("Kodo")
    expect(messages).toHaveLength(4)
  })

  it("system prompt includes portfolio scope rules", () => {
    const prompt = getPortfolioOpenUiSystemPrompt()
    expect(prompt.length).toBeGreaterThan(500)
    expect(prompt).toContain("Portfolio")
    expect(PORTFOLIO_SCOPE_RULES.split("\n")[0]).toMatch(/Scope/)
    expect(getPortfolioPromptOptionsSummary().rulesCount).toBeGreaterThan(5)
  })

  it("buildOpenUiScopeRedirectLang emits parseable OpenUI Lang", () => {
    const lang = buildOpenUiScopeRedirectLang("write me a poem")
    expect(lang).toContain('root = Card([')
    expect(lang).toContain("CardHeader")
    expect(lang).toContain("FollowUpBlock")
    expect(lang).not.toContain("**")
  })
})
