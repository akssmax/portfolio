"use client"

import { useCallback, useState } from "react"

import { buildResumeDocument } from "./build-resume-document"
import { resolveResumeFontPreset } from "./resume-font-utils"
import type { ResumeDisplayPreferences } from "./resume-display-preferences"
import type { ResumeLayoutId, ResumeSectionConfig } from "./types"
import type { FontPresetId } from "@/lib/themes/types"

type DownloadResumeOptions = {
  sections: ResumeSectionConfig
  brandColor: string
  layout: ResumeLayoutId
  document?: import("./types").ResumeDocument
  fontPresetId?: FontPresetId
  display?: ResumeDisplayPreferences
}

export function useDownloadResume() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const downloadResume = useCallback(
    async ({ sections, brandColor, layout, document, fontPresetId, display }: DownloadResumeOptions) => {
      setIsGenerating(true)
      setError(null)

      try {
        const resumeDocument = document ?? buildResumeDocument(sections)
        const resolvedFont = resolveResumeFontPreset(fontPresetId ?? "geist")
        const { downloadResumePdf, getResumeFilename } = await import("./generate-resume-pdf")
        await downloadResumePdf({
          document: resumeDocument,
          brandColor,
          layout,
          fontPresetId: resolvedFont,
          display,
          filename: getResumeFilename(resumeDocument.name, layout),
        })
      } catch (cause) {
        setError(
          cause instanceof Error ? cause.message : "Unable to generate resume PDF.",
        )
        throw cause
      } finally {
        setIsGenerating(false)
      }
    },
    [],
  )

  return {
    downloadResume,
    isGenerating,
    error,
  }
}
