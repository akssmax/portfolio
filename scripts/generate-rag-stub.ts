import { writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

import {
  buildCorpusDocuments,
  chunkDocuments,
} from "../src/lib/rag/corpus-builder"
import type { CorpusIndex } from "../src/lib/rag/types"

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const outputPath = path.resolve(rootDir, "../src/lib/rag/corpus-index.json")

const documents = buildCorpusDocuments()
const chunks = chunkDocuments(documents)

const index: CorpusIndex = {
  version: 1,
  model: "mistral-embed",
  createdAt: new Date().toISOString(),
  chunks: chunks.map((chunk) => ({
    ...chunk,
    embedding: [],
  })),
}

writeFileSync(outputPath, JSON.stringify(index))
console.log(`Wrote stub index to ${outputPath} (${chunks.length} chunks, no embeddings)`)
console.log("Run npm run build:rag with MISTRAL_API_KEY in .env.local to generate embeddings.")
