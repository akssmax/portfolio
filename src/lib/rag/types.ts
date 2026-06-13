export type CorpusDocument = {
  id: string
  source: string
  sourceLabel: string
  text: string
  href?: string
}

export type CorpusChunk = {
  id: string
  documentId: string
  source: string
  sourceLabel: string
  text: string
  href?: string
}

export type IndexedChunk = CorpusChunk & {
  embedding: number[]
}

export type CorpusIndex = {
  version: 1
  model: string
  createdAt: string
  chunks: IndexedChunk[]
}

export const CHUNK_SIZE = 800
export const CHUNK_OVERLAP = 150
export const TOP_K = 8
export const MIN_SCORE = 0.35
