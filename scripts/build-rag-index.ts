import { writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

import {
  buildCorpusDocuments,
  chunkDocuments,
} from "../src/lib/rag/corpus-builder"
import type { CorpusIndex, IndexedChunk } from "../src/lib/rag/types"

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const outputPath = path.resolve(rootDir, "../src/lib/rag/corpus-index.json")

const EMBED_MODEL = process.env.MISTRAL_EMBED_MODEL ?? "mistral-embed"
const BATCH_SIZE = 32

async function embedBatch(texts: string[], apiKey: string): Promise<number[][]> {
  const response = await fetch("https://api.mistral.ai/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: EMBED_MODEL,
      input: texts,
    }),
  })

  if (!response.ok) {
    const text = await response.text().catch(() => "")
    throw new Error(`Mistral embeddings failed (${response.status}): ${text}`)
  }

  const json = (await response.json()) as {
    data?: Array<{ embedding?: number[]; index?: number }>
  }

  const rows = json.data ?? []
  const sorted = [...rows].sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
  return sorted.map((row) => {
    if (!Array.isArray(row.embedding)) {
      throw new Error("Missing embedding in Mistral response")
    }
    return row.embedding
  })
}

async function main() {
  const apiKey = process.env.MISTRAL_API_KEY
  if (!apiKey) {
    throw new Error("MISTRAL_API_KEY is required. Set it in .env.local")
  }

  const documents = buildCorpusDocuments()
  const chunks = chunkDocuments(documents)

  console.log(`Building RAG index: ${documents.length} documents → ${chunks.length} chunks`)

  const indexed: IndexedChunk[] = []

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE)
    const embeddings = await embedBatch(
      batch.map((chunk) => chunk.text),
      apiKey,
    )

    for (const [index, chunk] of batch.entries()) {
      indexed.push({
        ...chunk,
        embedding: embeddings[index],
      })
    }

    console.log(`Embedded ${Math.min(i + BATCH_SIZE, chunks.length)}/${chunks.length}`)
  }

  const index: CorpusIndex = {
    version: 1,
    model: EMBED_MODEL,
    createdAt: new Date().toISOString(),
    chunks: indexed,
  }

  writeFileSync(outputPath, JSON.stringify(index))
  console.log(`Wrote ${outputPath} (${indexed.length} chunks)`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
