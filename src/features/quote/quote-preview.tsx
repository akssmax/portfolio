"use client"

import { Download, Loader2 } from "lucide-react"


import { QuotePaper } from "./layouts/quote-paper"
import type { QuoteDocument } from "./types"
import { ThemeCustomizer } from "@/components/theme-customizer"
import { Button } from "@/components/ui/button"

type QuotePreviewProps = {
  document: QuoteDocument
  brandColor: string
  onDownload: () => void
  isGenerating: boolean
  error: string | null
}

export function QuotePreview({
  document,
  brandColor,
  onDownload,
  isGenerating,
  error,
}: QuotePreviewProps) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-muted/20">
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">Preview</p>
            <p className="text-xs text-muted-foreground">
              Live A4 preview — matches the exported PDF.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <ThemeCustomizer triggerSize="icon-sm" />
            <Button
              type="button"
              disabled={isGenerating}
              onClick={onDownload}
            >
              {isGenerating ? (
                <>
                  <Loader2 aria-hidden className="animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <Download aria-hidden />
                  Download PDF
                </>
              )}
            </Button>
          </div>
        </div>
        {error ? (
          <p className="mt-2 text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-6">
        <div className="mx-auto w-full max-w-[794px]">
          <article
            className="aspect-[210/297] w-full overflow-hidden rounded-sm border border-border bg-white shadow-sm"
            aria-label="Quotation preview"
          >
            <div className="h-full overflow-y-auto">
              <QuotePaper document={document} brandColor={brandColor} />
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}
