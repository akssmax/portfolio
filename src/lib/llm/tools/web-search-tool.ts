export const WEB_SEARCH_TOOL_NAME = "web_search"

export const WEB_SEARCH_TOOL_DEFINITION = {
  type: "function" as const,
  function: {
    name: WEB_SEARCH_TOOL_NAME,
    description:
      "Search the public web for up-to-date information, company details, LinkedIn profile snippets, or facts not in the portfolio context. Use concise keyword queries.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query, e.g. site:linkedin.com/in/jane-doe product designer",
        },
      },
      required: ["query"],
    },
  },
}

export type WebSearchToolArgs = {
  query: string
}

export function parseWebSearchToolArgs(raw: string): WebSearchToolArgs | null {
  try {
    const parsed = JSON.parse(raw) as { query?: unknown }
    if (typeof parsed.query !== "string" || !parsed.query.trim()) return null
    return { query: parsed.query.trim() }
  } catch {
    return null
  }
}
