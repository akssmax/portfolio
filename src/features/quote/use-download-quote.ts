"use client"

import { useCallback, useState } from "react"

import { downloadQuotePdf } from "./generate-quote-pdf"
import type { QuoteDocument } from "./types"

export function useDownloadQuote() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const downloadQuote = useCallback(
    async ({ document, brandColor }: { document: QuoteDocument; brandColor: string }) => {
      setIsGenerating(true)
      setError(null)

      try {
        await downloadQuotePdf({ document, brandColor })
      } catch (cause) {
        setError(
          cause instanceof Error ? cause.message : "Unable to generate quotation PDF.",
        )
        throw cause
      } finally {
        setIsGenerating(false)
      }
    },
    [],
  )

  return {
    downloadQuote,
    isGenerating,
    error,
  }
}
