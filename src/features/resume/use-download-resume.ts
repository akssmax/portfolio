"use client"

import { useCallback, useState } from "react"

import { buildResumeDocument } from "./build-resume-document"
import { downloadResumePdf, getResumeFilename } from "./generate-resume-pdf"
import type { ResumeLayoutId, ResumeSectionConfig } from "./types"

type DownloadResumeOptions = {
  sections: ResumeSectionConfig
  brandColor: string
  layout: ResumeLayoutId
}

export function useDownloadResume() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const downloadResume = useCallback(
    async ({ sections, brandColor, layout }: DownloadResumeOptions) => {
      setIsGenerating(true)
      setError(null)

      try {
        const document = buildResumeDocument(sections)
        await downloadResumePdf({
          document,
          brandColor,
          layout,
          filename: getResumeFilename(document.name, layout),
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
