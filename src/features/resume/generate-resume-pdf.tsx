import type { CoverLetterDocument, ResumeDocument, ResumeLayoutId } from "./types"
import type { ResumeDisplayPreferences } from "./resume-display-preferences"
import { resolvePdfBrandColor } from "./color-utils"
import type { FontPresetId } from "@/lib/themes/types"

const CLIENT_PDF_FETCH_TIMEOUT_MS = 60_000

type GeneratePdfApiPayload = {
  kind?: "resume" | "cover-letter"
  document?: ResumeDocument
  coverLetterDocument?: CoverLetterDocument
  brandColor: string
  layout?: ResumeLayoutId
  fontPresetId?: FontPresetId
  display?: ResumeDisplayPreferences
}

async function fetchPdfFromApi(payload: GeneratePdfApiPayload): Promise<Blob> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), CLIENT_PDF_FETCH_TIMEOUT_MS)

  try {
    const response = await fetch("/api/resume/generate-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        brandColor: resolvePdfBrandColor(payload.brandColor),
      }),
      signal: controller.signal,
    })

    if (!response.ok) {
      let message = "Unable to generate resume PDF."
      try {
        const errorBody = (await response.json()) as {
          error?: { message?: string }
        }
        message = errorBody.error?.message ?? message
      } catch {
        // Ignore malformed error payloads.
      }
      throw new Error(message)
    }

    return response.blob()
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Resume PDF generation timed out. Please try again.")
    }
    throw error
  } finally {
    clearTimeout(timer)
  }
}

export async function generateResumePdf(
  document: ResumeDocument,
  brandColor: string,
  layout: ResumeLayoutId = "classic",
  fontPresetId: FontPresetId = "inter",
  display?: ResumeDisplayPreferences,
): Promise<Blob> {
  if (typeof window !== "undefined") {
    return fetchPdfFromApi({
      kind: "resume",
      document,
      brandColor,
      layout,
      fontPresetId,
      display,
    })
  }

  const { generateResumePdfDirect } = await import("./generate-resume-pdf-direct")
  return generateResumePdfDirect(document, brandColor, layout, fontPresetId, display)
}

export function getResumeFilename(name: string, layout: ResumeLayoutId = "classic"): string {
  const slug = name.toLowerCase().replace(/\s+/g, "-")
  return layout === "classic" ? `${slug}-resume.pdf` : `${slug}-resume-${layout}.pdf`
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = window.document.createElement("a")
  anchor.href = url
  anchor.download = filename
  anchor.rel = "noopener"
  anchor.style.display = "none"
  window.document.body.appendChild(anchor)
  anchor.click()
  window.document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}

export async function downloadResumePdf({
  document,
  brandColor,
  layout = "classic",
  filename,
  fontPresetId = "inter",
  display,
}: {
  document: ResumeDocument
  brandColor: string
  layout?: ResumeLayoutId
  filename?: string
  fontPresetId?: FontPresetId
  display?: ResumeDisplayPreferences
}) {
  const blob = await generateResumePdf(document, brandColor, layout, fontPresetId, display)
  triggerBlobDownload(blob, filename ?? getResumeFilename(document.name, layout))
}

export async function generateCoverLetterPdf(
  document: CoverLetterDocument,
  brandColor: string,
  layout: ResumeLayoutId = "classic",
): Promise<Blob> {
  if (typeof window !== "undefined") {
    return fetchPdfFromApi({
      kind: "cover-letter",
      coverLetterDocument: document,
      brandColor,
      layout,
    })
  }

  const { generateCoverLetterPdfDirect } = await import("./generate-resume-pdf-direct")
  return generateCoverLetterPdfDirect(document, brandColor, layout)
}

export function getCoverLetterFilename(
  name: string,
  company: string,
  layout: ResumeLayoutId = "classic",
): string {
  const nameSlug = name.toLowerCase().replace(/\s+/g, "-")
  const companySlug = company.toLowerCase().replace(/\s+/g, "-")
  return layout === "classic"
    ? `${nameSlug}-cover-letter-${companySlug}.pdf`
    : `${nameSlug}-cover-letter-${companySlug}-${layout}.pdf`
}

export async function downloadCoverLetterPdf({
  document,
  brandColor,
  layout = "classic",
  filename,
}: {
  document: CoverLetterDocument
  brandColor: string
  layout?: ResumeLayoutId
  filename?: string
}) {
  const blob = await generateCoverLetterPdf(document, brandColor, layout)
  triggerBlobDownload(
    blob,
    filename ?? getCoverLetterFilename(document.senderName, document.recipientCompany, layout),
  )
}

export {
  generateCoverLetterPdfDirect,
  generateResumePdfDirect,
} from "./generate-resume-pdf-direct"
