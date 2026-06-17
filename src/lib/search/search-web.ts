import { searchWithBrave, isBraveSearchConfigured } from "@/lib/search/brave-search"
import type { SearchResult, SearchWebOptions } from "@/lib/search/types"

export type { SearchResult, SearchWebOptions } from "@/lib/search/types"
export { formatSearchResultsForTool } from "@/lib/search/types"

export function isWebSearchConfigured(): boolean {
  return isBraveSearchConfigured()
}

export async function searchWeb(
  query: string,
  options: SearchWebOptions = {},
): Promise<SearchResult[]> {
  return searchWithBrave(query, options)
}
