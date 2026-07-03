export const SHOW_PROJECTS_TOOL_NAME = "show_projects"
export const SHOW_EXPERIENCE_TOOL_NAME = "show_experience"

export const SHOW_PROJECTS_TOOL_DEFINITION = {
  type: "function" as const,
  function: {
    name: SHOW_PROJECTS_TOOL_NAME,
    description:
      "Display an interactive grid or carousel of Akshay's product design and design engineering projects (including 100x chat shell, Kodo, Unlogged, Tulr, Resume Builder). Trigger this tool when the user asks about projects, case studies, apps built, or work highlights.",
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
