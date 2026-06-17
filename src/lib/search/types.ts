export type SearchResult = {
  title: string
  url: string
  snippet: string
  engine?: string
}

export type SearchWebOptions = {
  limit?: number
  language?: string
  timeoutMs?: number
}

export function dedupeSearchResults(results: SearchResult[]): SearchResult[] {
  const seen = new Set<string>()
  const output: SearchResult[] = []

  for (const result of results) {
    const key = result.url.toLowerCase()
    if (!key || seen.has(key)) continue
    seen.add(key)
    output.push(result)
  }

  return output
}

export function formatSearchResultsForTool(results: SearchResult[]): string {
  if (results.length === 0) {
    return "No search results found."
  }

  return results
    .map(
      (result, index) =>
        `[${index + 1}] ${result.title}\nURL: ${result.url}\n${result.snippet}`.trim(),
    )
    .join("\n\n---\n\n")
}
