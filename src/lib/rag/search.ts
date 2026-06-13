import corpusIndex from "./corpus-index.json"
import type { CorpusIndex, IndexedChunk } from "./types"
import { MIN_SCORE, TOP_K } from "./types"

const index = corpusIndex as CorpusIndex

function getMistralApiKey(): string {
  const key = process.env.MISTRAL_API_KEY
  if (!key) {
    throw new Error("MISTRAL_API_KEY is not configured.")
  }
  return key
}

function getEmbedModel(): string {
  return process.env.MISTRAL_EMBED_MODEL ?? index.model ?? "mistral-embed"
}

export async function embedQuery(text: string): Promise<number[]> {
  const apiKey = getMistralApiKey()
  const response = await fetch("https://api.mistral.ai/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: getEmbedModel(),
      input: [text],
    }),
  })

  if (!response.ok) {
    const body = await response.text().catch(() => "")
    throw new Error(`Embedding request failed (${response.status}): ${body}`)
  }

  const json = (await response.json()) as {
    data?: Array<{ embedding?: number[] }>
  }

  const embedding = json.data?.[0]?.embedding
  if (!Array.isArray(embedding)) {
    throw new Error("Missing embedding vector in Mistral response")
  }

  return embedding
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0

  let dot = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  if (normA === 0 || normB === 0) return 0
  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

export type SearchResult = {
  chunk: IndexedChunk
  score: number
}

export function searchCorpus(queryEmbedding: number[]): SearchResult[] {
  if (queryEmbedding.length === 0 || index.chunks.every((c) => c.embedding.length === 0)) {
    return []
  }

  const results = index.chunks
    .map((chunk) => ({
      chunk,
      score: cosineSimilarity(queryEmbedding, chunk.embedding),
    }))
    .filter((result) => result.score >= MIN_SCORE)
    .sort((a, b) => b.score - a.score)
    .slice(0, TOP_K)

  return results
}

function tokenize(value: string): Set<string> {
  const matches = value.toLowerCase().match(/[a-z0-9]{2,}/g) ?? []
  return new Set(matches)
}

function keywordSearch(query: string): SearchResult[] {
  const terms = tokenize(query)
  if (terms.size === 0) return []

  const results = index.chunks
    .map((chunk) => {
      const chunkTerms = tokenize(chunk.text)
      let score = 0
      for (const term of terms) {
        if (chunkTerms.has(term)) score += 1
      }
      return { chunk, score: score / terms.size }
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, TOP_K)

  return results
}

export async function retrieveForQuery(query: string): Promise<SearchResult[]> {
  const trimmed = query.trim()
  if (!trimmed || index.chunks.length === 0) return []

  const hasEmbeddings = index.chunks.some((chunk) => chunk.embedding.length > 0)
  if (!hasEmbeddings) {
    return keywordSearch(trimmed)
  }

  const queryEmbedding = await embedQuery(trimmed)
  return searchCorpus(queryEmbedding)
}

export function getCorpusChunkCount(): number {
  return index.chunks.length
}
