import type { ResumeDisplayPreferences } from "./resume-display-preferences"

/** Tailwind spacing scale steps for vertical section gaps (1 unit = 0.25rem = 4px). */
export const RESUME_SECTION_SPACING_TOKENS = [2, 2.5, 3, 3.5, 4, 5, 6, 8] as const

export type ResumeSectionSpacingToken = (typeof RESUME_SECTION_SPACING_TOKENS)[number]

export const DEFAULT_RESUME_SECTION_SPACING: ResumeSectionSpacingToken = 3.5

const SECTION_SPACING_MB_CLASSES: Record<
  ResumeSectionSpacingToken,
  `mb-${ResumeSectionSpacingToken}`
> = {
  2: "mb-2",
  2.5: "mb-2.5",
  3: "mb-3",
  3.5: "mb-3.5",
  4: "mb-4",
  5: "mb-5",
  6: "mb-6",
  8: "mb-8",
}

export function resolveSectionSpacingToken(value: unknown): ResumeSectionSpacingToken {
  if (typeof value !== "number") return DEFAULT_RESUME_SECTION_SPACING

  let nearest: ResumeSectionSpacingToken = DEFAULT_RESUME_SECTION_SPACING
  let minDiff = Number.POSITIVE_INFINITY

  for (const token of RESUME_SECTION_SPACING_TOKENS) {
    const diff = Math.abs(value - token)
    if (diff < minDiff) {
      minDiff = diff
      nearest = token
    }
  }

  return nearest
}

export function getSectionSpacingIndex(token: ResumeSectionSpacingToken): number {
  const index = RESUME_SECTION_SPACING_TOKENS.indexOf(token)
  return index >= 0 ? index : RESUME_SECTION_SPACING_TOKENS.indexOf(DEFAULT_RESUME_SECTION_SPACING)
}

export function sectionSpacingTokenToPx(token: ResumeSectionSpacingToken): number {
  return token * 4
}

export function getSectionSpacingMbClass(token: unknown): string {
  return SECTION_SPACING_MB_CLASSES[resolveSectionSpacingToken(token)]
}

export function formatSectionSpacingLabel(token: unknown): string {
  const resolved = resolveSectionSpacingToken(token)
  return `${sectionSpacingTokenToPx(resolved)}px · space-${resolved}`
}

export function getPdfSectionMarginBottom(display: ResumeDisplayPreferences): number {
  return sectionSpacingTokenToPx(
    resolveSectionSpacingToken(display?.sectionSpacing),
  )
}
