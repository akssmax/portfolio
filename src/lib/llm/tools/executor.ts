import {
  formatSearchResultsForTool,
  isWebSearchConfigured,
  searchWeb,
} from "@/lib/search/search-web"
import {
  parseWebSearchToolArgs,
  WEB_SEARCH_TOOL_NAME,
} from "@/lib/llm/tools/web-search-tool"
import {
  SHOW_PROJECTS_TOOL_NAME,
  SHOW_EXPERIENCE_TOOL_NAME,
  parseShowProjectsArgs,
} from "@/lib/llm/tools/gen-ui-tools"

export type ToolExecutionContext = {
  clientIp?: string
  maxSearches?: number
  searchesUsed?: { count: number }
  beforeSearch?: () => { allowed: boolean; error?: string }
  onSearchStart?: (query: string) => void
  onSearchEnd?: (query: string, resultCount: number) => void
}

export type ToolExecutionResult = {
  content: string
  error?: string
}

export async function executeToolCall(
  name: string,
  argumentsJson: string,
  context: ToolExecutionContext = {},
): Promise<ToolExecutionResult> {
  if (name === SHOW_PROJECTS_TOOL_NAME) {
    const args = parseShowProjectsArgs(argumentsJson)
    return {
      content: JSON.stringify({
        status: "success",
        component: "projects_grid",
        filter: args.filter,
      }),
    }
  }

  if (name === SHOW_EXPERIENCE_TOOL_NAME) {
    return {
      content: JSON.stringify({
        status: "success",
        component: "experience_timeline",
      }),
    }
  }

  if (name !== WEB_SEARCH_TOOL_NAME) {
    return { content: "", error: `Unknown tool: ${name}` }
  }

  if (!isWebSearchConfigured()) {
    return {
      content: "",
      error: "Web search is not configured on this deployment.",
    }
  }

  const args = parseWebSearchToolArgs(argumentsJson)
  if (!args) {
    return { content: "", error: "Invalid web_search arguments." }
  }

  const maxSearches = context.maxSearches ?? 3
  const searchesUsed = context.searchesUsed ?? { count: 0 }
  if (searchesUsed.count >= maxSearches) {
    return {
      content: "",
      error: `Search limit reached (${maxSearches} queries per request).`,
    }
  }

  const rateCheck = context.beforeSearch?.()
  if (rateCheck && !rateCheck.allowed) {
    return {
      content: "",
      error: rateCheck.error ?? "Web search rate limit exceeded.",
    }
  }

  searchesUsed.count += 1
  context.onSearchStart?.(args.query)

  try {
    const results = await searchWeb(args.query, { limit: 5 })
    context.onSearchEnd?.(args.query, results.length)
    return { content: formatSearchResultsForTool(results) }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Search failed."
    context.onSearchEnd?.(args.query, 0)
    return { content: "", error: message }
  }
}
