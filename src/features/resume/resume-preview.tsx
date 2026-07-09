"use client"

import { useMemo } from "react"
import { Download, Loader2, Sparkles } from "lucide-react"


import { buildResumeDocument } from "./build-resume-document"
import { ResumeHtmlDocument } from "./layouts/html/resume-html-document"
import { CoverLetterHtmlDocument } from "./layouts/html/cover-letter-html-document"
import {
  
  getResumeColorSelectionKey,
  resolveResumeBrandColor
} from "./resume-brand-color-utils"
import type {ResumeBrandColorSelection} from "./resume-brand-color-utils";
import type { CoverLetterDocument, ResumeDocument, ResumeLayoutId, ResumeSectionConfig } from "./types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type ResumePreviewProps = {
  document: ResumeDocument
  colorSelection: ResumeBrandColorSelection
  fallbackColor: string
  layout: ResumeLayoutId
  onDownload: () => void
  isGenerating: boolean
  downloadDisabled: boolean
  error: string | null
  onChange?: (updated: ResumeDocument) => void
  
  // Cover Letter props
  activeTab?: "resume" | "cover-letter"
  onActiveTabChange?: (tab: "resume" | "cover-letter") => void
  coverLetterDocument?: CoverLetterDocument | null
  onCoverLetterDocumentChange?: (updated: CoverLetterDocument) => void
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
  onChange,
  
  activeTab = "resume",
  onActiveTabChange,
  coverLetterDocument = null,
  onCoverLetterDocumentChange,
}: ResumePreviewProps) {
  const brandColor = resolveResumeBrandColor(colorSelection, fallbackColor)
  const colorKey = getResumeColorSelectionKey(colorSelection)

  return (
    <div className="flex h-full min-h-0 flex-col bg-muted/20">
      {/* Header with Navigation Tabs */}
      <div className="border-b border-border bg-background px-3 py-3 sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <nav className="flex gap-4 sm:gap-6" aria-label="Resume Workspace Tabs">
            <button
              type="button"
              onClick={() => onActiveTabChange?.("resume")}
              className={cn(
                "relative py-1 text-sm font-semibold transition-colors outline-none",
                activeTab === "resume"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Resume
              {activeTab === "resume" && (
                <span className="absolute bottom-[-13px] left-0 right-0 h-[2px] bg-primary" />
              )}
            </button>
            {onActiveTabChange ? (
              <button
                type="button"
                onClick={() => onActiveTabChange("cover-letter")}
                className={cn(
                  "relative py-1 text-sm font-semibold transition-colors outline-none",
                  activeTab === "cover-letter"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Cover Letter
                {activeTab === "cover-letter" && (
                  <span className="absolute bottom-[-13px] left-0 right-0 h-[2px] bg-primary" />
                )}
              </button>
            ) : null}
          </nav>

          <Button
            type="button"
            className="shrink-0 font-semibold text-xs"
            disabled={isGenerating || downloadDisabled}
            onClick={onDownload}
          >
            {isGenerating ? (
              <>
                <Loader2 aria-hidden className="animate-spin" />
                Generating PDF…
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

      {/* Main Preview Container */}
      <div className="min-h-0 flex-1 overflow-auto p-3 sm:p-6">
        <div className="mx-auto w-full max-w-[794px]">
          <article
            className="aspect-[210/297] w-full overflow-hidden rounded-sm border border-border bg-white shadow-sm"
            aria-label={`${activeTab === "resume" ? "Resume" : "Cover Letter"} preview`}
          >
            <div className="h-full overflow-y-auto">
              {activeTab === "resume" ? (
                <ResumeHtmlDocument
                  key={`${layout}-${colorKey}`}
                  document={document}
                  brandColor={brandColor}
                  layout={layout}
                  onChange={onChange}
                />
              ) : coverLetterDocument ? (
                <CoverLetterHtmlDocument
                  key={`cl-${layout}-${colorKey}`}
                  document={coverLetterDocument}
                  brandColor={brandColor}
                  layout={layout}
                  onChange={onCoverLetterDocumentChange}
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center p-8 text-center text-muted-foreground">
                  <div className="rounded-full bg-muted/40 p-4 mb-4 border border-border">
                    <Sparkles className="size-8 text-primary animate-pulse" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">
                    AI Cover Letter Draft
                  </h3>
                  <p className="text-xs max-w-sm leading-relaxed mb-4 text-muted-foreground">
                    Tailor a matching cover letter instantly. Fill in the company and job role fields in the left controls panel and click generate.
                  </p>
                </div>
              )}
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
