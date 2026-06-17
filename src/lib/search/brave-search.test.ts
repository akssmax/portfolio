import { afterEach, describe, expect, it, vi } from "vitest"

import { searchWithBrave } from "@/lib/search/brave-search"

describe("searchWithBrave", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it("returns deduped results from Brave Search API", async () => {
    vi.stubEnv("BRAVE_SEARCH_API_KEY", "BSAI_test_key_12345678901234567890")

    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          web: {
            results: [
              {
                title: "Example",
                url: "https://example.com/a",
                description: "Snippet A",
              },
              {
                title: "Example duplicate",
                url: "https://example.com/a",
                description: "Duplicate",
              },
              {
                title: "Second",
                url: "https://example.com/b",
                description: "Snippet B",
              },
            ],
          },
        }),
        { status: 200 },
      ),
    )
    vi.stubGlobal("fetch", fetchMock)

    const results = await searchWithBrave("portfolio test", { limit: 5 })

    expect(results).toHaveLength(2)
    expect(results[0]?.url).toBe("https://example.com/a")
    expect(fetchMock).toHaveBeenCalledOnce()

    const [requestUrl, requestInit] = fetchMock.mock.calls[0] ?? []
    expect(String(requestUrl)).toContain("api.search.brave.com")
    expect(
      (requestInit as RequestInit)?.headers &&
        (requestInit as RequestInit).headers instanceof Object &&
        "X-Subscription-Token" in ((requestInit as RequestInit).headers as Record<string, string>),
    ).toBe(true)
  })

  it("throws when Brave Search is not configured", async () => {
    await expect(searchWithBrave("test")).rejects.toThrow("BRAVE_SEARCH_API_KEY")
  })

  it("throws on non-OK responses", async () => {
    vi.stubEnv("BRAVE_SEARCH_API_KEY", "BSAI_test_key_12345678901234567890")
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("fail", { status: 503 })),
    )

    await expect(searchWithBrave("test")).rejects.toThrow("503")
  })
})
