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
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null)
  const [previewVersion, setPreviewVersion] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const requestIdRef = useRef(0)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    abortRef.current?.abort()
    abortRef.current = null

    if (!enabled) {
      setPdfData(null)
      setPreviewVersion(0)
      setError(null)
      setIsLoading(false)
      return
    }

    if (activeTab === "cover-letter" && !coverLetterDocument) {
      setPdfData(null)
      setPreviewVersion(0)
      setError("Generate a cover letter first to preview it.")
      setIsLoading(false)
      return
    }

    const requestId = ++requestIdRef.current
    const abortController = new AbortController()
    abortRef.current = abortController

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
                  abortController.signal,
                )
              : await generateCoverLetterPdf(
                  coverLetterDocument!,
                  brandColor,
                  layout,
                  abortController.signal,
                )

          if (requestId !== requestIdRef.current) return

          const arrayBuffer = await blob.arrayBuffer()
          setPdfData(arrayBuffer)
          setPreviewVersion((version) => version + 1)
        } catch (cause) {
          if (requestId !== requestIdRef.current) return
          if (cause instanceof DOMException && cause.name === "AbortError") return

          setPdfData(null)
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
      abortController.abort()
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
      abortRef.current?.abort()
    }
  }, [])

  return { pdfData, previewVersion, isLoading, error }
}
