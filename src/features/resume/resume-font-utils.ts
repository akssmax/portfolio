import type { FontPresetId } from "@/lib/themes/types"
import { FONT_FAMILY_BY_PRESET } from "@/lib/fonts/font-families"
import { FONT_PRESETS } from "@/lib/themes/registry"
import { loadFontPreset } from "@/lib/themes/font-loader"

const GEIST_PIXEL_FONTS = new Set<FontPresetId>([
  "geist-pixel-square",
  "geist-pixel-grid",
  "geist-pixel-circle",
  "geist-pixel-triangle",
  "geist-pixel-line",
])

/** Resume preview/PDF fallback when Geist Pixel files are unavailable. */
export const RESUME_FALLBACK_FONT: FontPresetId = "inter"

/** Default font for new resume builder sessions and public downloads. */
export const RESUME_DEFAULT_FONT: FontPresetId = "inter"

export function isGeistPixelFont(font: FontPresetId): boolean {
  return GEIST_PIXEL_FONTS.has(font)
}

export function resolveResumeFontPreset(font: FontPresetId): FontPresetId {
  return isGeistPixelFont(font) ? RESUME_FALLBACK_FONT : font
}

export function getResumePreviewFontFamily(font: FontPresetId): string {
  const resolved = resolveResumeFontPreset(font)
  return FONT_FAMILY_BY_PRESET[resolved] ?? FONT_FAMILY_BY_PRESET.inter
}

/** Fonts offered in the resume builder (Geist Pixel maps to Inter in preview/PDF). */
export const RESUME_FONT_PRESET_OPTIONS = FONT_PRESETS.filter(
  (preset) => !isGeistPixelFont(preset.id),
).sort((a, b) => {
  if (a.id === RESUME_DEFAULT_FONT) return -1
  if (b.id === RESUME_DEFAULT_FONT) return 1
  return 0
})

export function preloadResumeFont(font: FontPresetId): void {
  void loadFontPreset(resolveResumeFontPreset(font))
}
