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

export const RENDER_CUSTOM_UI_TOOL_DEFINITION = {
  type: "function" as const,
  function: {
    name: RENDER_CUSTOM_UI_TOOL_NAME,
    description:
      "Render a custom interactive UI component on the page dynamically. Trigger this tool to show projects, skills, work history, timeline, comparisons, stats, or client feedback. Generate custom items on the fly.",
    parameters: {
      type: "object",
      properties: {
        title: { type: "string", description: "Title of the custom UI card." },
        badge: { type: "string", description: "Visual badge pill text." },
        layout: { type: "string", enum: ["grid", "list", "metrics"], description: "Layout container style." },
        items: {
          type: "array",
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
          },
        },
      },
      required: ["title", "layout", "items"],
    },
  },
}
