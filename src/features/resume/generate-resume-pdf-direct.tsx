import { resolvePdfBrandColor } from "./color-utils"
import { getMinimalAccentImageSrc } from "./minimal-accent-utils"
import { ensurePdfBuffer } from "./ensure-pdf-buffer"
import { registerResumePdfFont } from "./register-resume-fonts"
import { resolveResumeFontPreset } from "./resume-font-utils"
import { ResumePdfDocument } from "./layouts/resume-pdf-document"
import { CoverLetterPdfDocument } from "./layouts/cover-letter-pdf-document"
import { resolveDocumentImages, resolveResumeImageSrc } from "./pdf-image-utils"
import type { CoverLetterDocument, ResumeDocument, ResumeLayoutId } from "./types"
import type { ResumeDisplayPreferences } from "./resume-display-preferences"
import {
  normalizeResumeDisplayPreferences,
} from "./resume-display-preferences"
import type { FontPresetId } from "@/lib/themes/types"

const PDF_GENERATION_TIMEOUT_MS = 45_000

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

export async function generateResumePdfDirect(
  document: ResumeDocument,
  brandColor: string,
  layout: ResumeLayoutId = "classic",
  fontPresetId: FontPresetId = "inter",
  display?: ResumeDisplayPreferences,
  baseUrl?: string,
): Promise<Blob> {
  await ensurePdfBuffer()
  const { pdf } = await import("@react-pdf/renderer")
  const pdfBrandColor = resolvePdfBrandColor(brandColor)
  const fontFamily = await registerResumePdfFont(resolveResumeFontPreset(fontPresetId))

  const documentWithImages = await resolveDocumentImages(document, baseUrl)
  const resolvedDisplay = normalizeResumeDisplayPreferences(display)
  const accentImageSrc =
    layout === "minimal" && resolvedDisplay.showMinimalAccentImage
      ? await resolveResumeImageSrc(
          getMinimalAccentImageSrc(resolvedDisplay.minimalAccentImage),
          baseUrl,
        )
      : undefined

  return withTimeout(
    pdf(
      <ResumePdfDocument
        document={documentWithImages}
        brandColor={pdfBrandColor}
        layout={layout}
        fontFamily={fontFamily}
        display={resolvedDisplay}
        accentImageSrc={accentImageSrc}
      />,
    ).toBlob(),
    "Resume PDF generation",
  )
}

export async function generateCoverLetterPdfDirect(
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
