import type { ResolvedLlmConfig } from "@/lib/llm/provider"
import { PORTFOLIO_SCOPE_RULES } from "@/lib/rag/portfolio-scope"

export const SHOW_PROJECTS_TOOL_NAME = "show_projects"
export const SHOW_EXPERIENCE_TOOL_NAME = "show_experience"

export const SHOW_PROJECTS_TOOL_DEFINITION = {
  type: "function" as const,
  function: {
    name: SHOW_PROJECTS_TOOL_NAME,
    description:
      "Display an interactive grid or carousel of Akshay's product design and design engineering projects (including Design with AI, Kodo, Unlogged, Tulr, Resume Builder). Trigger this tool when the user asks about projects, case studies, apps built, or work highlights.",
    parameters: {
      type: "object",
      properties: {
        filter: {
          type: "string",
          enum: ["featured", "all", "recent"],
          description: "Category of projects to filter by.",
          default: "all",
        },
      },
      required: [],
    },
  },
}

export const SHOW_EXPERIENCE_TOOL_DEFINITION = {
  type: "function" as const,
  function: {
    name: SHOW_EXPERIENCE_TOOL_NAME,
    description:
      "Display an interactive vertical timeline of Akshay's professional work experience (including roles at Tulr, Unlogged, Kodo, and solo ventures). Trigger this tool when the user asks about resume history, work duration, past jobs, or timeline.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
}

export type ShowProjectsToolArgs = {
  filter: "featured" | "all" | "recent"
}

export function parseShowProjectsArgs(raw: string): ShowProjectsToolArgs {
  try {
    const parsed = JSON.parse(raw) as { filter?: unknown }
    return {
      filter: (parsed.filter === "featured" || parsed.filter === "recent") ? parsed.filter : "all"
    }
  } catch {
    return { filter: "all" }
  }
}

export const RENDER_CUSTOM_UI_TOOL_NAME = "render_custom_ui"

export const GEN_UI_MAX_TOKENS = 900

export const GEN_UI_SYSTEM_PROMPT = [
  "You are Akshay Saini's portfolio Gen UI assistant.",
  PORTFOLIO_SCOPE_RULES,
  "Always respond by calling render_custom_ui exactly once — never reply with plain text.",
  "If the user asks something off-topic (poems, jokes, unrelated tasks), render a card that politely redirects:",
  'title="Portfolio assistant", layout="list", items explaining you only cover Akshay\'s work and suggesting portfolio questions.',
  "Use real portfolio facts only: projects (Kodo, 100x, Unlogged, Tulr, PostForge, RupeeLens, Resume Builder),",
  "design-engineering skills, YC-backed fintech/devtools experience, Bengaluru-based, nearly 6 years in design.",
  "Pick layout: grid (cards), list (timeline/roles), or metrics (stats).",
  "Keep items concise: 3–6 items, short titles, one-line descriptions, optional url to /projects/* when relevant.",
].join(" ")

/** OpenRouter-compatible tool schema — flat properties, no nested required arrays. */
export const RENDER_CUSTOM_UI_TOOL_DEFINITION = {
  type: "function" as const,
  function: {
    name: RENDER_CUSTOM_UI_TOOL_NAME,
    description:
      "Render an interactive UI card on the page. Call once per user request with title, layout, and items.",
    parameters: {
      type: "object",
      properties: {
        title: { type: "string", description: "Card heading." },
        badge: { type: "string", description: "Optional pill label, e.g. Projects or Skills." },
        layout: {
          type: "string",
          enum: ["grid", "list", "metrics"],
          description: "grid=cards, list=timeline, metrics=stats.",
        },
        items: {
          type: "array",
          description: "3–6 content rows for the layout.",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              description: { type: "string" },
              subtitle: { type: "string" },
              metric: { type: "string" },
              tag: { type: "string" },
              url: { type: "string" },
              buttonLabel: { type: "string" },
            },
            required: ["title"],
            additionalProperties: false,
          },
        },
      },
      required: ["title", "layout", "items"],
      additionalProperties: false,
    },
  },
}

/** Provider-specific tool_choice — OpenRouter free models work best with "required". */
export function getGenUiToolChoice(config: ResolvedLlmConfig) {
  if (config.provider === "openrouter") {
    return "required" as const
  }
  return {
    type: "function" as const,
    function: { name: RENDER_CUSTOM_UI_TOOL_NAME },
  }
}

export function getGenUiStreamOptions(config: ResolvedLlmConfig) {
  return {
    tools: [RENDER_CUSTOM_UI_TOOL_DEFINITION],
    toolChoice: getGenUiToolChoice(config),
    parallel_tool_calls: false,
    temperature: 0.2,
    maxTokens: GEN_UI_MAX_TOKENS,
  }
}
