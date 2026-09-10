import { writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { createEmbeddings } from "../src/lib/llm/openai-compatible-client"
import { resolveLlmConfig } from "../src/lib/llm/provider"
import {
  buildCorpusDocuments,
  chunkDocuments,
} from "../src/lib/rag/corpus-builder"
import type { CorpusIndex, IndexedChunk } from "../src/lib/rag/types"

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const outputPath = path.resolve(rootDir, "../src/lib/rag/corpus-index.json")
const BATCH_SIZE = 32

async function embedBatch(texts: string[], config: ReturnType<typeof resolveLlmConfig>): Promise<number[][]> {
  return createEmbeddings(config, {
    model: config.embedModel,
    input: texts,
  })
}

async function main() {
  const config = resolveLlmConfig()

  const documents = buildCorpusDocuments()
  const chunks = chunkDocuments(documents)

  console.log(
    `Building RAG index with ${config.provider} (${config.embedModel}): ${documents.length} documents → ${chunks.length} chunks`,
  )

  const indexed: IndexedChunk[] = []

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE)
    const embeddings = await embedBatch(
      batch.map((chunk) => chunk.text),
      config,
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
    model: config.embedModel,
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
