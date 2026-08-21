import type { FontPresetId } from "@/lib/themes/types"

import { resolveResumeFontPreset } from "@/features/resume/resume-font-utils"

/**
 * Static Geist TTFs served from /public/fonts — registered with @react-pdf/renderer.
 * Built-in Helvetica/Courier lack the ₹ (U+20B9) glyph, which broke investment amounts.
 * Variable WOFF2 theme fonts crash fontkit in the browser, so static instances are used.
 */
export const QUOTE_PDF_FONT_FAMILY = "QuoteSans"
export const QUOTE_PDF_MONO_FAMILY = "QuoteMono"

let registrationPromise: Promise<void> | null = null

async function registerQuotePdfFonts(): Promise<void> {
  const { Font } = await import("@react-pdf/renderer")
  const base = typeof window !== "undefined" ? window.location.origin : ""

  Font.register({
    family: QUOTE_PDF_FONT_FAMILY,
    fonts: [
      { src: `${base}/fonts/geist-regular.ttf`, fontWeight: 400 },
      { src: `${base}/fonts/geist-medium.ttf`, fontWeight: 500 },
      { src: `${base}/fonts/geist-semibold.ttf`, fontWeight: 600 },
      { src: `${base}/fonts/geist-bold.ttf`, fontWeight: 700 },
    ],
  })

  Font.register({
    family: QUOTE_PDF_MONO_FAMILY,
    fonts: [
      { src: `${base}/fonts/geist-mono-regular.ttf`, fontWeight: 400 },
      { src: `${base}/fonts/geist-mono-bold.ttf`, fontWeight: 700 },
    ],
  })
}

/** Idempotent — safe to call before every PDF generation. */
export function ensureQuotePdfFonts(): Promise<void> {
  if (!registrationPromise) {
    registrationPromise = registerQuotePdfFonts().catch((cause) => {
      registrationPromise = null
      throw cause
    })
  }
  return registrationPromise
}

export function resolveQuoteFontPreset(font: FontPresetId): FontPresetId {
  return resolveResumeFontPreset(font)
}
