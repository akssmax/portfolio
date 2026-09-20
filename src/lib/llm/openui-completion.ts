import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

import type { LlmChatMessage } from "@/lib/llm/llm-types"
import { getGenUiModel, type ResolvedLlmConfig } from "@/lib/llm/provider"
import { getPortfolioOpenUiPrompt, portfolioPromptOptions } from "@/lib/openui/portfolio-library"
import { getPortfolioScopeRedirect } from "@/lib/rag/portfolio-scope"

export const OPENUI_GEN_UI_MAX_TOKENS = Number(process.env.GEN_UI_MAX_TOKENS) || 2500

let cachedSystemPrompt: string | null = null

function loadGeneratedSystemPrompt(): string | null {
  try {
    const dir = dirname(fileURLToPath(import.meta.url))
    return readFileSync(join(dir, "../openui/generated/system-prompt.txt"), "utf-8")
  } catch {
    return null
  }
}

export function getPortfolioOpenUiSystemPrompt(): string {
  if (cachedSystemPrompt) return cachedSystemPrompt
  cachedSystemPrompt = loadGeneratedSystemPrompt() ?? getPortfolioOpenUiPrompt()
  return cachedSystemPrompt
}

export function buildOpenUiMessages(options: {
  history: LlmChatMessage[]
  ragContext?: string
}): LlmChatMessage[] {
  return [
    { role: "system", content: getPortfolioOpenUiSystemPrompt() },
    ...(options.ragContext
      ? [{ role: "system" as const, content: `Retrieved context:\n${options.ragContext}` }]
      : []),
    ...options.history,
  ]
}

export function getOpenUiStreamOptions(config: ResolvedLlmConfig) {
  return {
    temperature: 0.2,
    maxTokens: OPENUI_GEN_UI_MAX_TOKENS,
    model: getGenUiModel(config),
  }
}

/** Minimal OpenUI Lang card for off-topic redirects the Renderer can parse. */
export function buildOpenUiScopeRedirectLang(query: string): string {
  const redirect = getPortfolioScopeRedirect(query)
    .replace(/\*\*/g, "")
    .replace(/\n+/g, " ")
    .trim()

  return [
    'root = Card([header, body, followUp])',
    'header = CardHeader("Portfolio assistant", "Akshay Saini\'s work only")',
    `body = TextContent("${redirect.replace(/"/g, '\\"')}", "default")`,
    'followUp = FollowUpBlock([fu1, fu2, fu3])',
    'fu1 = FollowUpItem("projects", "Show featured projects")',
    'fu2 = FollowUpItem("experience", "What\'s Akshay\'s experience?")',
    'fu3 = FollowUpItem("hire", "Why hire Akshay?")',
  ].join("\n")
}

/** Used by tests and CLI drift checks. */
export function getPortfolioPromptOptionsSummary() {
  return {
    preamble: portfolioPromptOptions.preamble,
    rulesCount: portfolioPromptOptions.additionalRules?.length ?? 0,
    promptLength: getPortfolioOpenUiSystemPrompt().length,
  }
}
