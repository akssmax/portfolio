"use client"

import { Loader2 } from "lucide-react"

import type { FontPresetId } from "@/lib/themes/types"

import { ResumePdfCanvasPreview } from "./resume-pdf-canvas-preview"
import type { ResumeDisplayPreferences } from "./resume-display-preferences"
import { useResumePdfPreviewUrl } from "./use-resume-pdf-preview-url"
import type { CoverLetterDocument, ResumeDocument, ResumeLayoutId } from "./types"

type ResumeA4PdfPreviewProps = {
  activeTab: "resume" | "cover-letter"
  resumeDocument: ResumeDocument
  coverLetterDocument: CoverLetterDocument | null
  brandColor: string
  layout: ResumeLayoutId
  fontPreset: FontPresetId
  display: ResumeDisplayPreferences
  enabled?: boolean
}

export function ResumeA4PdfPreview({
  activeTab,
  resumeDocument,
  coverLetterDocument,
  brandColor,
  layout,
  fontPreset,
  display,
  enabled = true,
}: ResumeA4PdfPreviewProps) {
  const { pdfUrl, isLoading, error } = useResumePdfPreviewUrl({
    enabled,
    activeTab,
    resumeDocument,
    coverLetterDocument,
    brandColor,
    layout,
    fontPreset,
    display,
  })

  if (error) {
    return (
      <div className="flex min-h-[480px] items-center justify-center p-6">
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      </div>
    )
  }

  if (isLoading || !pdfUrl) {
    return (
      <div className="flex min-h-[480px] flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 aria-hidden className="size-8 animate-spin" />
        <p className="text-sm">Rendering PDF pages…</p>
      </div>
    )
  }

  return <ResumePdfCanvasPreview pdfUrl={pdfUrl} showPageBreaks />
}
