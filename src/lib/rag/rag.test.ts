import { describe, expect, it } from "vitest"

import {
  buildCorpusDocuments,
  chunkDocuments,
} from "@/lib/rag/corpus-builder"
import { buildRetrievedContext } from "@/lib/rag/system-prompt"
import { cosineSimilarity, searchCorpus } from "@/lib/rag/search"
import { parseSseEvent } from "@/lib/llm/llm-service"

describe("corpus-builder", () => {
  it("extracts profile and project documents", () => {
    const docs = buildCorpusDocuments()
    expect(docs.length).toBeGreaterThan(10)
    expect(docs.some((doc) => doc.source.startsWith("project/"))).toBe(true)
    expect(docs.some((doc) => doc.source === "profile")).toBe(true)
  })

  it("chunks long documents", () => {
    const docs = buildCorpusDocuments()
    const chunks = chunkDocuments(docs)
    expect(chunks.length).toBeGreaterThan(docs.length)
    expect(chunks.every((chunk) => chunk.text.length <= 800)).toBe(true)
  })
})

describe("buildRetrievedContext", () => {
  it("formats chunks with labels and links", () => {
    const context = buildRetrievedContext([
      {
        sourceLabel: "Kodo",
        text: "Enterprise fintech P2P flows.",
        href: "/projects/kodo",
      },
    ])
    expect(context).toContain("Kodo")
    expect(context).toContain("/projects/kodo")
    expect(context).toContain("Enterprise fintech")
  })
})

describe("cosineSimilarity", () => {
  it("returns 1 for identical vectors", () => {
    expect(cosineSimilarity([1, 0, 0], [1, 0, 0])).toBe(1)
  })

  it("returns 0 for orthogonal vectors", () => {
    expect(cosineSimilarity([1, 0], [0, 1])).toBe(0)
  })
})

describe("searchCorpus", () => {
  it("returns empty when query embedding is empty", () => {
    expect(searchCorpus([])).toEqual([])
  })
})

describe("parseSseEvent", () => {
  it("parses token events", () => {
    const parsed = parseSseEvent('event: token\ndata: {"text":"Hi"}')
    expect(parsed?.event).toBe("token")
    expect(parsed?.data).toBe('{"text":"Hi"}')
  })
})
