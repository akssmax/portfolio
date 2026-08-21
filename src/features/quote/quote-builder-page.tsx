"use client"

import { useEffect, useState } from "react"


import { createDefaultQuoteDocument } from "./default-quote"
import { QuoteBuilderControls } from "./quote-builder-controls"
import { resolveQuoteFontPreset } from "./quote-fonts"
import { loadQuoteDocument, saveQuoteDocument } from "./quote-storage"
import { QuotePreview } from "./quote-preview"
import { useDownloadQuote } from "./use-download-quote"
import type { QuoteDocument } from "./types"
import { preloadResumeFont } from "@/features/resume/resume-font-utils"
import { useBrandColors } from "@/hooks/use-brand-colors"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

function QuoteBuilderWorkspace() {
  const { primary } = useBrandColors()
  const { downloadQuote, isGenerating, error } = useDownloadQuote()

  const [document, setDocument] = useState<QuoteDocument>(
    () => loadQuoteDocument() ?? createDefaultQuoteDocument(),
  )

  useEffect(() => {
    saveQuoteDocument(document)
  }, [document])

  useEffect(() => {
    preloadResumeFont(resolveQuoteFontPreset(document.font))
  }, [document.font])

  return (
    <div className="h-svh bg-background">
      <ResizablePanelGroup orientation="horizontal" className="h-full">
        <ResizablePanel id="quote-controls" defaultSize={380} minSize={320} maxSize={520}>
          <div className="h-full min-w-[320px]">
            <QuoteBuilderControls document={document} onChange={setDocument} />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel id="quote-preview" minSize={480}>
          <QuotePreview
            document={document}
            brandColor={primary}
            isGenerating={isGenerating}
            error={error}
            onDownload={() => {
              void downloadQuote({ document, brandColor: primary })
            }}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export function QuoteBuilderPage() {
  return <QuoteBuilderWorkspace />
}
