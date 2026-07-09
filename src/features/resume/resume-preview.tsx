"use client"

import { useMemo } from "react"
import { Download, Loader2, Sparkles } from "lucide-react"


import { buildResumeDocument } from "./build-resume-document"
import { ResumeHtmlDocument } from "./layouts/html/resume-html-document"
import { CoverLetterHtmlDocument } from "./layouts/html/cover-letter-html-document"
import {
  resolveResumeBrandColor
} from "./resume-brand-color-utils"
import type {ResumeBrandColorSelection} from "./resume-brand-color-utils";
import type { ResumeDisplayPreferences } from "./resume-display-preferences"
import type { CoverLetterDocument, ResumeDocument, ResumeLayoutId, ResumeSectionConfig } from "./types"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type ResumePreviewProps = {
  document: ResumeDocument
  colorSelection: ResumeBrandColorSelection
  fallbackColor: string
  layout: ResumeLayoutId
  fontFamily: string
  display: ResumeDisplayPreferences
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
  fontFamily,
  display,
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

  return (
    <div className="flex h-full min-h-0 flex-col bg-muted/20">
      {/* Header with Navigation Tabs */}
      <div className="border-b border-border bg-background px-3 py-3 sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              onActiveTabChange?.(value as "resume" | "cover-letter")
            }
            className="min-w-0"
          >
            <TabsList aria-label="Resume Workspace Tabs">
              <TabsTrigger value="resume">Resume</TabsTrigger>
              {onActiveTabChange ? (
                <TabsTrigger value="cover-letter">Cover Letter</TabsTrigger>
              ) : null}
            </TabsList>
          </Tabs>

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
                  key={layout}
                  document={document}
                  brandColor={brandColor}
                  fontFamily={fontFamily}
                  display={display}
                  layout={layout}
                  onChange={onChange}
                />
              ) : coverLetterDocument ? (
                <CoverLetterHtmlDocument
                  key={`cl-${layout}`}
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
