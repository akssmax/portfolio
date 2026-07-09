import { resolvePdfBrandColor } from "./color-utils"
import { ensurePdfBuffer } from "./ensure-pdf-buffer"
import { registerResumePdfFont } from "./register-resume-fonts"
import { resolveResumeFontPreset } from "./resume-font-utils"
import { ResumePdfDocument } from "./layouts/resume-pdf-document"
import { CoverLetterPdfDocument } from "./layouts/cover-letter-pdf-document"
import { resolveDocumentImages } from "./pdf-image-utils"
import type { CoverLetterDocument, ResumeDocument, ResumeLayoutId } from "./types"
import type { ResumeDisplayPreferences } from "./resume-display-preferences"
import { DEFAULT_RESUME_DISPLAY_PREFERENCES } from "./resume-display-preferences"
import type { FontPresetId } from "@/lib/themes/types"

const PDF_GENERATION_TIMEOUT_MS = 30_000

async function withTimeout<T>(promise: Promise<T>, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => {
          reject(new Error(`${label} timed out. Please try again.`))
        }, PDF_GENERATION_TIMEOUT_MS)
      }),
    ])
  } finally {
    if (timer) clearTimeout(timer)
  }
}

export async function generateResumePdf(
  document: ResumeDocument,
  brandColor: string,
  layout: ResumeLayoutId = "classic",
  fontPresetId: FontPresetId = "inter",
  display?: ResumeDisplayPreferences,
): Promise<Blob> {
  await ensurePdfBuffer()
  const { pdf } = await import("@react-pdf/renderer")
  const pdfBrandColor = resolvePdfBrandColor(brandColor)
  const fontFamily = await registerResumePdfFont(resolveResumeFontPreset(fontPresetId))

  const documentWithImages = await resolveDocumentImages(document)

  return withTimeout(
    pdf(
      <ResumePdfDocument
        document={documentWithImages}
        brandColor={pdfBrandColor}
        layout={layout}
        fontFamily={fontFamily}
        display={display ?? DEFAULT_RESUME_DISPLAY_PREFERENCES}
      />,
    ).toBlob(),
    "Resume PDF generation",
  )
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

// Cover Letter PDF Compile & Download Utilities
export async function generateCoverLetterPdf(
  document: CoverLetterDocument,
  brandColor: string,
  layout: ResumeLayoutId = "classic",
): Promise<Blob> {
  await ensurePdfBuffer()
  const { pdf } = await import("@react-pdf/renderer")
  const pdfBrandColor = resolvePdfBrandColor(brandColor)

  return withTimeout(
    pdf(
      <CoverLetterPdfDocument
        document={document}
        brandColor={pdfBrandColor}
        layout={layout}
      />,
    ).toBlob(),
    "Cover letter PDF generation",
  )
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
