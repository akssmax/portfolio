"use client"

import { useMemo, useState } from "react"
import { Download, Eye, Loader2, Pencil, Sparkles } from "lucide-react"


import { buildResumeDocument } from "./build-resume-document"
import { ResumeHtmlDocument } from "./layouts/html/resume-html-document"
import { CoverLetterHtmlDocument } from "./layouts/html/cover-letter-html-document"
import { ResumeA4PdfPreview } from "./resume-a4-pdf-preview"
import {
  resolveResumeBrandColor
} from "./resume-brand-color-utils"
import type {ResumeBrandColorSelection} from "./resume-brand-color-utils";
import type { ResumeDisplayPreferences } from "./resume-display-preferences"
import type { CoverLetterDocument, ResumeDocument, ResumeLayoutId, ResumeSectionConfig } from "./types"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { FontPresetId } from "@/lib/themes/types"

import { ResumeFontSelect } from "./resume-font-select"

type PreviewSurface = "pdf" | "edit"

type ResumePreviewProps = {
  document: ResumeDocument
  colorSelection: ResumeBrandColorSelection
  fallbackColor: string
  layout: ResumeLayoutId
  fontFamily: string
  fontPreset?: FontPresetId
  onFontPresetChange?: (font: FontPresetId) => void
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
  fontPreset,
  onFontPresetChange,
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
  const [previewSurface, setPreviewSurface] = useState<PreviewSurface>("pdf")
  const resolvedFontPreset = fontPreset ?? "inter"

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

          <div className="flex shrink-0 items-center gap-2">
            {fontPreset && onFontPresetChange ? (
              <ResumeFontSelect value={fontPreset} onChange={onFontPresetChange} />
            ) : null}
            <div className="hidden items-center rounded-md border border-border bg-background p-0.5 sm:flex">
              <Button
                type="button"
                variant={previewSurface === "pdf" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 px-2.5 text-xs"
                onClick={() => setPreviewSurface("pdf")}
              >
                <Eye aria-hidden />
                PDF pages
              </Button>
              <Button
                type="button"
                variant={previewSurface === "edit" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 px-2.5 text-xs"
                onClick={() => setPreviewSurface("edit")}
              >
                <Pencil aria-hidden />
                Edit
              </Button>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0 text-xs sm:hidden"
              onClick={() =>
                setPreviewSurface((current) => (current === "pdf" ? "edit" : "pdf"))
              }
            >
              {previewSurface === "pdf" ? (
                <>
                  <Pencil aria-hidden />
                  Edit
                </>
              ) : (
                <>
                  <Eye aria-hidden />
                  PDF
                </>
              )}
            </Button>
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
        </div>
        {error ? (
          <p className="mt-2 text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      {/* Main Preview Container */}
      <div className="min-h-0 flex-1 overflow-auto bg-muted/30 p-3 sm:p-6">
        {activeTab === "resume" ? (
          previewSurface === "pdf" ? (
            <ResumeA4PdfPreview
              activeTab="resume"
              resumeDocument={document}
              coverLetterDocument={null}
              brandColor={brandColor}
              layout={layout}
              fontPreset={resolvedFontPreset}
              display={display}
            />
          ) : (
            <article className="mx-auto w-full max-w-[794px] overflow-hidden rounded-sm border border-border bg-white shadow-sm">
              <ResumeHtmlDocument
                key={layout}
                document={document}
                brandColor={brandColor}
                fontFamily={fontFamily}
                display={display}
                layout={layout}
                onChange={onChange}
              />
            </article>
          )
        ) : coverLetterDocument ? (
          previewSurface === "pdf" ? (
            <ResumeA4PdfPreview
              activeTab="cover-letter"
              resumeDocument={document}
              coverLetterDocument={coverLetterDocument}
              brandColor={brandColor}
              layout={layout}
              fontPreset={resolvedFontPreset}
              display={display}
            />
          ) : (
            <article className="mx-auto w-full max-w-[794px] overflow-hidden rounded-sm border border-border bg-white shadow-sm">
              <CoverLetterHtmlDocument
                key={`cl-${layout}`}
                document={coverLetterDocument}
                brandColor={brandColor}
                layout={layout}
                onChange={onCoverLetterDocumentChange}
              />
            </article>
          )
        ) : (
          <div className="mx-auto flex aspect-[210/297] w-full max-w-[794px] items-center justify-center rounded-sm border border-border bg-white p-8 text-center text-muted-foreground shadow-sm">
            <div>
              <div className="mb-4 rounded-full border border-border bg-muted/40 p-4">
                <Sparkles className="mx-auto size-8 animate-pulse text-primary" />
              </div>
              <h3 className="mb-1 text-sm font-semibold text-foreground">
                AI Cover Letter Draft
              </h3>
              <p className="mx-auto max-w-sm text-xs leading-relaxed text-muted-foreground">
                Tailor a matching cover letter instantly. Fill in the company and job role fields
                in the left controls panel and click generate.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function useResumePreviewDocument(sections: ResumeSectionConfig) {
  return useMemo(() => buildResumeDocument(sections), [sections])
}
