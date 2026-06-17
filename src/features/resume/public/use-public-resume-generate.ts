"use client"

import { useCallback, useState } from "react"

import type { ResumeDocument } from "@/features/resume/types"
import { formatResumeValidationError } from "@/features/resume/validate-resume-document"

export type PublicResumeGeneratePhase =
  | "idle"
  | "searching"
  | "structuring"
  | "ready"
  | "error"

type GenerateOptions = {
  linkedinUrl: string
  profileText?: string
  signal?: AbortSignal
  onStatus?: (message: string, phase: PublicResumeGeneratePhase) => void
}

function parseSseEvent(rawEvent: string): { event: string; data: string } | null {
  const lines = rawEvent.replace(/\r\n/g, "\n").split("\n").filter(Boolean)
  if (lines.length === 0) return null

  let event = "message"
  const dataParts: string[] = []

  for (const line of lines) {
    if (line.startsWith("event:")) event = line.slice("event:".length).trim()
    else if (line.startsWith("data:")) dataParts.push(line.slice("data:".length).trim())
  }

  return { event, data: dataParts.join("\n") }
}

export function usePublicResumeGenerate() {
  const [phase, setPhase] = useState<PublicResumeGeneratePhase>("idle")
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [error, setError] = useState<{ title: string; description: string } | null>(
    null,
  )
  const [document, setDocument] = useState<ResumeDocument | null>(null)

  const setGenerationError = useCallback((message: string, title?: string) => {
    if (title) {
      setError({ title, description: message })
      return
    }
    const alert = formatResumeValidationError(message)
    setError({ title: alert.title, description: alert.description })
  }, [])

  const generate = useCallback(async (options: GenerateOptions) => {
    setPhase("searching")
    setStatusMessage("Searching profile…")
    setError(null)
    setDocument(null)
    options.onStatus?.("Searching profile…", "searching")

    const response = await fetch("/api/resume/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        linkedinUrl: options.linkedinUrl,
        profileText: options.profileText,
      }),
      signal: options.signal,
    })

    if (!response.ok) {
      let message = "Unable to generate resume."
      try {
        const payload = (await response.json()) as { error?: { message?: string } }
        message = payload.error?.message ?? message
      } catch {
        // ignore
      }
      setPhase("error")
      setGenerationError(message)
      options.onStatus?.(message, "error")
      throw new Error(message)
    }

    if (!response.body) {
      const message = "Missing response stream."
      setPhase("error")
      setGenerationError(message)
      throw new Error(message)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ""
    let resultDocument: ResumeDocument | null = null
    let streamErrorMessage: string | null = null

    const handleEvent = (rawEvent: string) => {
      const parsed = parseSseEvent(rawEvent)
      if (!parsed) return

      if (parsed.event === "status") {
        try {
          const payload = JSON.parse(parsed.data) as { phase?: string; message?: string }
          const message = payload.message ?? "Working…"
          setStatusMessage(message)
          if (payload.phase === "searching") {
            setPhase("searching")
            options.onStatus?.(message, "searching")
          } else if (payload.phase === "structuring") {
            setPhase("structuring")
            options.onStatus?.(message, "structuring")
          } else if (payload.phase === "ready") {
            setPhase("ready")
            options.onStatus?.(message, "ready")
          }
        } catch {
          // ignore
        }
      } else if (parsed.event === "document") {
        try {
          const payload = JSON.parse(parsed.data) as { document?: ResumeDocument }
          if (payload.document) {
            resultDocument = payload.document
            setDocument(payload.document)
          }
        } catch {
          // ignore
        }
      } else if (parsed.event === "error") {
        try {
          const payload = JSON.parse(parsed.data) as { message?: string; title?: string }
          const message = payload.message ?? "Generation failed."
          streamErrorMessage = message
          setPhase("error")
          setGenerationError(message, payload.title)
          options.onStatus?.(message, "error")
        } catch {
          streamErrorMessage = "Generation failed."
        }
      }
    }

    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        const trailing = buffer.trim()
        if (trailing) handleEvent(trailing)
        break
      }

      buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, "\n")
      let boundary = buffer.indexOf("\n\n")
      while (boundary !== -1) {
        handleEvent(buffer.slice(0, boundary))
        buffer = buffer.slice(boundary + 2)
        boundary = buffer.indexOf("\n\n")
      }
    }

    if (streamErrorMessage) {
      throw new Error(streamErrorMessage)
    }

    if (!resultDocument) {
      const message = "No resume document was returned."
      setPhase("error")
      setGenerationError(message)
      throw new Error(message)
    }

    setPhase("ready")
    setStatusMessage("Ready")
    return resultDocument
  }, [setGenerationError])

  const reset = useCallback(() => {
    setPhase("idle")
    setStatusMessage(null)
    setError(null)
    setDocument(null)
  }, [])

  return {
    generate,
    reset,
    phase,
    statusMessage,
    error,
    document,
    isGenerating: phase === "searching" || phase === "structuring",
  }
}
