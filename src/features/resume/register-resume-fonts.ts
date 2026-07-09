import type { FontPresetId } from "@/lib/themes/types"

import { resolveResumeFontPreset } from "./resume-font-utils"

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
 * download buttons. Geist Pixel also 404s in production. Use Helvetica for PDF export;
 * HTML preview falls back to Inter via resolveResumeFontPreset().
 */
export async function registerResumePdfFont(font: FontPresetId): Promise<string> {
  void resolveResumeFontPreset(font)
  return RESUME_PDF_SAFE_FONT_FAMILY
}
