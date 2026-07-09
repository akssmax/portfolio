import type { FontPresetId } from "@/lib/themes/types"

import geistLatin from "@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?url"
import interLatin from "@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url"
import dmSansLatin from "@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2?url"
import outfitLatin from "@fontsource-variable/outfit/files/outfit-latin-wght-normal.woff2?url"
import sourceSerifLatin from "@fontsource-variable/source-serif-4/files/source-serif-4-latin-wght-normal.woff2?url"
import jetbrainsLatin from "@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2?url"

import geistPixelSquare from "../../../node_modules/geist/dist/fonts/geist-pixel/GeistPixel-Square.woff2?url"
import geistPixelGrid from "../../../node_modules/geist/dist/fonts/geist-pixel/GeistPixel-Grid.woff2?url"
import geistPixelCircle from "../../../node_modules/geist/dist/fonts/geist-pixel/GeistPixel-Circle.woff2?url"
import geistPixelTriangle from "../../../node_modules/geist/dist/fonts/geist-pixel/GeistPixel-Triangle.woff2?url"
import geistPixelLine from "../../../node_modules/geist/dist/fonts/geist-pixel/GeistPixel-Line.woff2?url"

/** Registered family names used in react-pdf `fontFamily`. */
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

const FONT_SOURCES: Record<FontPresetId, string> = {
  geist: geistLatin,
  inter: interLatin,
  "dm-sans": dmSansLatin,
  outfit: outfitLatin,
  "source-serif": sourceSerifLatin,
  "jetbrains-mono": jetbrainsLatin,
  "geist-pixel-square": geistPixelSquare,
  "geist-pixel-grid": geistPixelGrid,
  "geist-pixel-circle": geistPixelCircle,
  "geist-pixel-triangle": geistPixelTriangle,
  "geist-pixel-line": geistPixelLine,
}

const registered = new Set<FontPresetId>()

export function getResumePdfFontFamily(font: FontPresetId): string {
  return RESUME_PDF_FONT_FAMILY[font] ?? RESUME_PDF_FONT_FAMILY.geist
}

export async function registerResumePdfFont(font: FontPresetId): Promise<string> {
  const family = getResumePdfFontFamily(font)
  if (registered.has(font)) return family

  const { Font } = await import("@react-pdf/renderer")
  const src = FONT_SOURCES[font] ?? FONT_SOURCES.geist
  Font.register({
    family,
    fonts: [
      { src, fontWeight: 400 },
      { src, fontWeight: 700 },
    ],
  })
  registered.add(font)
  return family
}
