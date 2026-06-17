import { sanitizeSearchQuery } from "@/lib/search/ssrf"
import {
  dedupeSearchResults,
  type SearchResult,
  type SearchWebOptions,
} from "@/lib/search/types"

const BRAVE_WEB_SEARCH_URL = "https://api.search.brave.com/res/v1/web/search"
const DEFAULT_TIMEOUT_MS = 10_000

type BraveWebResult = {
  title?: string
  url?: string
  description?: string
}

type BraveWebSearchResponse = {
  web?: {
    results?: BraveWebResult[]
  }
}

function getBraveApiKey(): string | undefined {
  return process.env.BRAVE_SEARCH_API_KEY?.trim()
}

export function isBraveSearchConfigured(): boolean {
  return Boolean(getBraveApiKey())
}

export async function searchWithBrave(
  query: string,
  options: SearchWebOptions = {},
): Promise<SearchResult[]> {
  const sanitized = sanitizeSearchQuery(query)
  if (!sanitized) return []

  const apiKey = getBraveApiKey()
  if (!apiKey) {
    throw new Error("BRAVE_SEARCH_API_KEY is not configured.")
  }

  const limit = Math.min(Math.max(options.limit ?? 5, 1), 20)
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS

  const url = new URL(BRAVE_WEB_SEARCH_URL)
  url.searchParams.set("q", sanitized)
  url.searchParams.set("count", String(limit))
  if (options.language) {
    url.searchParams.set("search_lang", options.language)
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort("timeout"), timeoutMs)

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        "X-Subscription-Token": apiKey,
      },
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(`Brave Search request failed (${response.status}).`)
    }

    const payload = (await response.json()) as BraveWebSearchResponse
    const mapped = (payload.web?.results ?? [])
      .map((item) => ({
        title: item.title?.trim() ?? "",
        url: item.url?.trim() ?? "",
        snippet: item.description?.trim() ?? "",
        engine: "brave",
      }))
      .filter((item) => item.title && item.url)

    return dedupeSearchResults(mapped).slice(0, limit)
  } finally {
    clearTimeout(timeout)
  }
}
