import type { FontPresetId } from "@/lib/themes/types"

/** Built-in PDF font — variable WOFF2 theme fonts crash fontkit in the browser. */
export const RESUME_PDF_SAFE_FONT_FAMILY = "Helvetica"

export const RESUME_PDF_FONT_FAMILY: Record<FontPresetId, string> = {
  geist: "ResumeGeist",
  "geist-pixel-square": "ResumeGeistPixelSquare",
  "geist-pixel-grid": "ResumeGeistPixelGrid",
  "geist-pixel-circle": "ResumeGeistPixelCircle",
  "geist-pixel-triangle": "ResumeGeistPixelTriangle",
  "geist-pixel-line": "ResumeGeistPixelLine",
  inter: "ResumeInter",
  "dm-sans": "ResumeDMSans",
  outfit: "ResumeOutfit",
  "source-serif": "ResumeSourceSerif",
  "jetbrains-mono": "ResumeJetBrainsMono",
}

export function getResumePdfFontFamily(font: FontPresetId): string {
  return RESUME_PDF_FONT_FAMILY[font] ?? RESUME_PDF_FONT_FAMILY.geist
}

/**
 * Theme fonts are variable WOFF2 files. @react-pdf/fontkit cannot parse them in the
 * browser (throws "Offset is outside the bounds of the DataView"), which breaks public
 * download buttons. Use Helvetica until we ship static TTF/OTF sources for PDF export.
 */
export async function registerResumePdfFont(_font: FontPresetId): Promise<string> {
  return RESUME_PDF_SAFE_FONT_FAMILY
}
