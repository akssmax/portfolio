import { resolvePdfBrandColor } from "./color-utils"
import { ResumePdfDocument } from "./layouts/resume-pdf-document"
import { resolveDocumentImages } from "./pdf-image-utils"
import type { ResumeDocument, ResumeLayoutId } from "./types"

export async function generateResumePdf(
  document: ResumeDocument,
  brandColor: string,
  layout: ResumeLayoutId = "classic",
): Promise<Blob> {
  const { pdf } = await import("@react-pdf/renderer")
  const pdfBrandColor = resolvePdfBrandColor(brandColor)

  const documentWithImages = await resolveDocumentImages(document)

  return pdf(
    <ResumePdfDocument
      document={documentWithImages}
      brandColor={pdfBrandColor}
      layout={layout}
    />,
  ).toBlob()
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
