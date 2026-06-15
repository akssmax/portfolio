"use client"

import { useMemo } from "react"
import { Download, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"

import { buildResumeDocument } from "./build-resume-document"
import { ResumeHtmlDocument } from "./layouts/html/resume-html-document"
import {
  getResumeColorSelectionKey,
  resolveResumeBrandColor,
  type ResumeBrandColorSelection,
} from "./resume-brand-color-utils"
import type { ResumeDocument, ResumeLayoutId, ResumeSectionConfig } from "./types"

type ResumePreviewProps = {
  document: ResumeDocument
  colorSelection: ResumeBrandColorSelection
  fallbackColor: string
  layout: ResumeLayoutId
  onDownload: () => void
  isGenerating: boolean
  downloadDisabled: boolean
  error: string | null
}

export function ResumePreview({
  document,
  colorSelection,
  fallbackColor,
  layout,
  onDownload,
  isGenerating,
  downloadDisabled,
  error,
}: ResumePreviewProps) {
  const brandColor = resolveResumeBrandColor(colorSelection, fallbackColor)
  const colorKey = getResumeColorSelectionKey(colorSelection)

  return (
    <div className="flex h-full min-h-0 flex-col bg-muted/20">
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">Preview</p>
            <p className="text-xs text-muted-foreground">
              Live HTML preview of your current settings.
            </p>
          </div>
          <Button
            type="button"
            className="shrink-0"
            disabled={isGenerating || downloadDisabled}
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
            aria-label="Resume preview"
          >
            <div className="h-full overflow-y-auto">
              <ResumeHtmlDocument
                key={`${layout}-${colorKey}`}
                document={document}
                brandColor={brandColor}
                layout={layout}
              />
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}

export function useResumePreviewDocument(sections: ResumeSectionConfig) {
  return useMemo(() => buildResumeDocument(sections), [sections])
}
