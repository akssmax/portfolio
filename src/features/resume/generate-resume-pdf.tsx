import { resolvePdfBrandColor } from "./color-utils"
import { ensurePdfBuffer } from "./ensure-pdf-buffer"
import { ResumePdfDocument } from "./layouts/resume-pdf-document"
import { CoverLetterPdfDocument } from "./layouts/cover-letter-pdf-document"
import { resolveDocumentImages } from "./pdf-image-utils"
import type { CoverLetterDocument, ResumeDocument, ResumeLayoutId } from "./types"

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
): Promise<Blob> {
  await ensurePdfBuffer()
  const { pdf } = await import("@react-pdf/renderer")
  const pdfBrandColor = resolvePdfBrandColor(brandColor)

  const documentWithImages = await resolveDocumentImages(document)

  return withTimeout(
    pdf(
      <ResumePdfDocument
        document={documentWithImages}
        brandColor={pdfBrandColor}
        layout={layout}
      />,
    ).toBlob(),
    "Resume PDF generation",
  )
}

export function getResumeFilename(name: string, layout: ResumeLayoutId = "classic"): string {
  const slug = name.toLowerCase().replace(/\s+/g, "-")
  return layout === "classic" ? `${slug}-resume.pdf` : `${slug}-resume-${layout}.pdf`
}

export async function downloadResumePdf({
  document,
  brandColor,
  layout = "classic",
  filename,
}: {
  document: ResumeDocument
  brandColor: string
  layout?: ResumeLayoutId
  filename?: string
}) {
  const blob = await generateResumePdf(document, brandColor, layout)
  const url = URL.createObjectURL(blob)
  const anchor = window.document.createElement("a")
  anchor.href = url
  anchor.download = filename ?? getResumeFilename(document.name, layout)
  anchor.click()
  URL.revokeObjectURL(url)
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
  const url = URL.createObjectURL(blob)
  const anchor = window.document.createElement("a")
  anchor.href = url
  anchor.download = filename ?? getCoverLetterFilename(document.senderName, document.recipientCompany, layout)
  anchor.click()
  URL.revokeObjectURL(url)
}
