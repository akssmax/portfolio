import { normalizeHex } from "@/features/brand-color/derive-brand-tokens"
import { resolveCssColorToHex } from "@/lib/themes/resolve-colors"

const DEFAULT_PDF_BRAND_COLOR = "#FF354B"

function rgbaFromHex(hex: string, alpha: number): string {
  const red = Number.parseInt(hex.slice(1, 3), 16)
  const green = Number.parseInt(hex.slice(3, 5), 16)
  const blue = Number.parseInt(hex.slice(5, 7), 16)

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}

function parseHexRgb(hex: string): { r: number; g: number; b: number } | null {
  const normalized = normalizeHex(hex)
  if (!normalized) return null

  return {
    r: Number.parseInt(normalized.slice(1, 3), 16),
    g: Number.parseInt(normalized.slice(3, 5), 16),
    b: Number.parseInt(normalized.slice(5, 7), 16),
  }
}

/** Solid hex equivalent of brand color at alpha over white — safe for react-pdf fills/borders. */
export function blendHexOverWhite(color: string, alpha: number): string {
  const rgb = parseHexRgb(resolvePdfBrandColor(color))
  if (!rgb) return blendHexOverWhite(DEFAULT_PDF_BRAND_COLOR, alpha)

  const weight = Math.min(Math.max(alpha, 0), 1)
  const mix = (channel: number) =>
    Math.round(channel * weight + 255 * (1 - weight))

  return `#${[mix(rgb.r), mix(rgb.g), mix(rgb.b)]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`
}

export function resolvePdfBrandColor(
  brandColor: string,
  fallback = DEFAULT_PDF_BRAND_COLOR,
): string {
  const normalized = normalizeHex(brandColor)
  if (normalized) return normalized

  if (typeof document === "undefined") return fallback

  const resolved = resolveCssColorToHex(brandColor, fallback)
  return normalizeHex(resolved) ?? fallback
}

export function cssColorWithAlpha(color: string, alpha: number): string {
  const resolvedHex = resolvePdfBrandColor(color, "")
  const normalized = normalizeHex(resolvedHex)

  if (normalized) {
    return rgbaFromHex(normalized, alpha)
  }

  const percent = Math.round(Math.min(Math.max(alpha, 0), 1) * 100)
  return `color-mix(in oklch, ${color} ${percent}%, transparent)`
}

export function hexToRgba(color: string, alpha: number): string {
  const normalized = normalizeHex(resolvePdfBrandColor(color))
  if (!normalized) return rgbaFromHex(DEFAULT_PDF_BRAND_COLOR, alpha)

  return rgbaFromHex(normalized, alpha)
}
