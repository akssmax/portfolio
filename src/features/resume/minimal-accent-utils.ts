import type { ResumeDisplayPreferences } from "./resume-display-preferences"

export type MinimalAccentImageId = "portrait" | "atmosphere"

export const MINIMAL_ACCENT_IMAGE_OPTIONS: Record<
  MinimalAccentImageId,
  {
    label: string
    description: string
    src: string
    htmlSizeClass: string
    pdfWidth: number
    pdfHeight: number
  }
> = {
  portrait: {
    label: "Hero portrait",
    description: "Selfie from the homepage hero",
    src: "/images/portraits/02.webp",
    htmlSizeClass: "h-44 w-36",
    pdfWidth: 150,
    pdfHeight: 190,
  },
  atmosphere: {
    label: "Hero atmosphere",
    description: "Monolith landscape from the homepage hero",
    src: "/images/hero-atmosphere.webp",
    htmlSizeClass: "h-36 w-52",
    pdfWidth: 200,
    pdfHeight: 130,
  },
}

export function clampAccentFade(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)))
}

export function getMinimalAccentImageSrc(imageId: MinimalAccentImageId): string {
  return MINIMAL_ACCENT_IMAGE_OPTIONS[imageId].src
}

export type AccentFadeStyles = {
  imageOpacity: number
  htmlGradient: string
  pdfStops: Array<{ offset: string; stopOpacity: number }>
}

/** Maps fade 0 (subtle) → 100 (heavy white wash). */
export function getAccentFadeStyles(fade: number): AccentFadeStyles {
  const f = clampAccentFade(fade) / 100

  const imageOpacity = 0.4 * (1 - f) + 0.06
  const fromOpacity = 0.12 + f * 0.88
  const viaOpacity = 0.4 + f * 0.45

  return {
    imageOpacity,
    htmlGradient: `linear-gradient(to top left, rgba(255,255,255,${fromOpacity}) 8%, rgba(255,255,255,${viaOpacity}) 42%, rgba(255,255,255,0) 100%)`,
    pdfStops: [
      { offset: "0%", stopOpacity: 0.08 + f * 0.35 },
      { offset: "45%", stopOpacity: 0.32 + f * 0.52 },
      { offset: "100%", stopOpacity: 0.72 + f * 0.28 },
    ],
  }
}

export function resolveMinimalAccentImageId(
  value: unknown,
): MinimalAccentImageId {
  return value === "portrait" || value === "atmosphere" ? value : "atmosphere"
}

export function pickMinimalAccentPreferences(
  display: ResumeDisplayPreferences,
): {
  imageId: MinimalAccentImageId
  fade: number
  src: string
  fadeStyles: AccentFadeStyles
} {
  const imageId = display.minimalAccentImage
  return {
    imageId,
    fade: display.minimalAccentFade,
    src: getMinimalAccentImageSrc(imageId),
    fadeStyles: getAccentFadeStyles(display.minimalAccentFade),
  }
}
