import { createLibrary, type PromptOptions } from "@openuidev/react-lang"
import {
  openuiChatComponentGroups,
  openuiChatLibrary,
  openuiChatPromptOptions,
} from "@openuidev/react-ui/genui-lib"

import { PORTFOLIO_SCOPE_RULES } from "@/lib/rag/portfolio-scope"

import {
  ExperienceTimeline,
  PortfolioMetric,
  portfolioComponentGroup,
  ProjectCard,
  ProjectGrid,
} from "./portfolio-components"

const portfolioComponents = [ProjectCard, ProjectGrid, ExperienceTimeline, PortfolioMetric]

export const portfolioLibrary = createLibrary({
  root: openuiChatLibrary.root ?? "Card",
  id: "portfolio-openui",
  componentGroups: [...(openuiChatComponentGroups ?? []), portfolioComponentGroup],
  components: [...Object.values(openuiChatLibrary.components), ...portfolioComponents],
})

export const portfolioPromptOptions: PromptOptions = {
  preamble: "You are Akshay Saini's portfolio Gen UI assistant.",
  examples: openuiChatPromptOptions.examples,
  additionalRules: [
    ...(openuiChatPromptOptions.additionalRules ?? []),
    PORTFOLIO_SCOPE_RULES,
    "Emit valid OpenUI Lang only — no markdown prose outside components.",
    "Use portfolio facts only; never invent employers or projects.",
    "Prefer ProjectGrid / ExperienceTimeline for project and resume questions.",
    ...portfolioComponentGroup.notes,
  ],
}

/** Runtime system prompt — matches generated/system-prompt.txt when regenerated via OpenUI CLI. */
export function getPortfolioOpenUiPrompt(): string {
  return portfolioLibrary.prompt(portfolioPromptOptions)
}
