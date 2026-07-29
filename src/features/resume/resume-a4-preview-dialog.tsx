"use client"

import { Loader2 } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { FontPresetId } from "@/lib/themes/types"

import { ResumePdfCanvasPreview } from "./resume-pdf-canvas-preview"
import type { ResumeDisplayPreferences } from "./resume-display-preferences"
import { useResumePdfPreviewUrl } from "./use-resume-pdf-preview-url"
import type { CoverLetterDocument, ResumeDocument, ResumeLayoutId } from "./types"

type ResumeA4PreviewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  activeTab: "resume" | "cover-letter"
  resumeDocument: ResumeDocument
  coverLetterDocument: CoverLetterDocument | null
  brandColor: string
  layout: ResumeLayoutId
  fontPreset: FontPresetId
  display: ResumeDisplayPreferences
}

export function ResumeA4PreviewDialog({
  open,
  onOpenChange,
  activeTab,
  resumeDocument,
  coverLetterDocument,
  brandColor,
  layout,
  fontPreset,
  display,
}: ResumeA4PreviewDialogProps) {
  const { pdfUrl, isLoading, error } = useResumePdfPreviewUrl({
    enabled: open,
    activeTab,
    resumeDocument,
    coverLetterDocument,
    brandColor,
    layout,
    fontPreset,
    display,
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="flex h-[min(92vh,900px)] w-[min(96vw,920px)] max-w-none flex-col gap-0 overflow-hidden p-0 sm:max-w-none"
      >
        <DialogHeader className="border-b border-border px-5 py-4 text-start">
          <DialogTitle>A4 preview</DialogTitle>
          <DialogDescription>
            Paginated export at A4 size (210 × 297 mm). Matches the downloaded PDF.
          </DialogDescription>
        </DialogHeader>

        <div className="relative min-h-0 flex-1 overflow-hidden bg-neutral-200/80 dark:bg-neutral-900/80">
          {isLoading ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
              <Loader2 aria-hidden className="size-8 animate-spin" />
              <p className="text-sm">Generating A4 preview…</p>
            </div>
          ) : error ? (
            <div className="flex h-full items-center justify-center p-6">
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            </div>
          ) : pdfUrl ? (
            <ResumePdfCanvasPreview pdfUrl={pdfUrl} />
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
