import { normalizeHex } from "@/features/brand-color/derive-brand-tokens"

const DEFAULT_PDF_BRAND_COLOR = "#FF354B"

/** Normalized hex safe for react-pdf fills — resolves CSS variables when in a browser. */
export function resolveQuotePdfColor(
  color: string,
  fallback = DEFAULT_PDF_BRAND_COLOR,
): string {
  const normalized = normalizeHex(color)
  if (normalized) return normalized
  return fallback
}

/** Solid hex equivalent of color at alpha over white — react-pdf has no rgba fills. */
export function blendQuoteColorOverWhite(color: string, alpha: number): string {
  const normalized = normalizeHex(resolveQuotePdfColor(color))
  if (!normalized) {
    return blendQuoteColorOverWhite(DEFAULT_PDF_BRAND_COLOR, alpha)
  }

  const weight = Math.min(Math.max(alpha, 0), 1)
  const mix = (channel: number) =>
    Math.round(channel * weight + 255 * (1 - weight))

  return `#${[mix(Number.parseInt(normalized.slice(1, 3), 16)), mix(Number.parseInt(normalized.slice(3, 5), 16)), mix(Number.parseInt(normalized.slice(5, 7), 16))]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`
}
