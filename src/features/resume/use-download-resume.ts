"use client"

import { useCallback, useState } from "react"

import { buildResumeDocument } from "./build-resume-document"
import { downloadResumePdf, getResumeFilename } from "./generate-resume-pdf"
import type { ResumeLayoutId, ResumeSectionConfig } from "./types"

type DownloadResumeOptions = {
  sections: ResumeSectionConfig
  brandColor: string
  layout: ResumeLayoutId
  document?: import("./types").ResumeDocument
}

export function useDownloadResume() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const downloadResume = useCallback(
    async ({ sections, brandColor, layout, document }: DownloadResumeOptions) => {
      setIsGenerating(true)
      setError(null)

      try {
        const resumeDocument = document ?? buildResumeDocument(sections)
        await downloadResumePdf({
          document: resumeDocument,
          brandColor,
          layout,
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
