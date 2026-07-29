"use client"

import { useEffect, useRef, useState } from "react"

import type { FontPresetId } from "@/lib/themes/types"

import { generateCoverLetterPdf, generateResumePdf } from "./generate-resume-pdf"
import type { ResumeDisplayPreferences } from "./resume-display-preferences"
import type { CoverLetterDocument, ResumeDocument, ResumeLayoutId } from "./types"

const PDF_PREVIEW_DEBOUNCE_MS = 450

type UseResumePdfPreviewUrlOptions = {
  enabled: boolean
  activeTab: "resume" | "cover-letter"
  resumeDocument: ResumeDocument
  coverLetterDocument: CoverLetterDocument | null
  brandColor: string
  layout: ResumeLayoutId
  fontPreset: FontPresetId
  display: ResumeDisplayPreferences
}

export function useResumePdfPreviewUrl({
  enabled,
  activeTab,
  resumeDocument,
  coverLetterDocument,
  brandColor,
  layout,
  fontPreset,
  display,
}: UseResumePdfPreviewUrlOptions) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const pdfUrlRef = useRef<string | null>(null)
  const requestIdRef = useRef(0)

  function clearPdfUrl() {
    if (pdfUrlRef.current) {
      URL.revokeObjectURL(pdfUrlRef.current)
      pdfUrlRef.current = null
    }
    setPdfUrl(null)
  }

  useEffect(() => {
    if (!enabled) {
      clearPdfUrl()
      setError(null)
      setIsLoading(false)
      return
    }

    if (activeTab === "cover-letter" && !coverLetterDocument) {
      clearPdfUrl()
      setError("Generate a cover letter first to preview it.")
      setIsLoading(false)
      return
    }

    const requestId = ++requestIdRef.current
    setIsLoading(true)
    setError(null)

    const timer = window.setTimeout(() => {
      void (async () => {
        try {
          const blob =
            activeTab === "resume"
              ? await generateResumePdf(
                  resumeDocument,
                  brandColor,
                  layout,
                  fontPreset,
                  display,
                )
              : await generateCoverLetterPdf(coverLetterDocument!, brandColor, layout)

          if (requestId !== requestIdRef.current) return

          clearPdfUrl()
          const objectUrl = URL.createObjectURL(blob)
          pdfUrlRef.current = objectUrl
          setPdfUrl(objectUrl)
        } catch (cause) {
          if (requestId !== requestIdRef.current) return
          clearPdfUrl()
          setError(
            cause instanceof Error ? cause.message : "Unable to generate A4 preview.",
          )
        } finally {
          if (requestId === requestIdRef.current) {
            setIsLoading(false)
          }
        }
      })()
    }, PDF_PREVIEW_DEBOUNCE_MS)

    return () => {
      window.clearTimeout(timer)
    }
  }, [
    enabled,
    activeTab,
    resumeDocument,
    coverLetterDocument,
    brandColor,
    layout,
    fontPreset,
    display,
  ])

  useEffect(() => {
    return () => {
      if (pdfUrlRef.current) {
        URL.revokeObjectURL(pdfUrlRef.current)
      }
    }
  }, [])

  return { pdfUrl, isLoading, error }
}
