import {
  clampAccentFade,
  resolveMinimalAccentImageId,
} from "./minimal-accent-utils"
import {
  DEFAULT_RESUME_SECTION_SPACING,
  resolveSectionSpacingToken,
  type ResumeSectionSpacingToken,
} from "./section-spacing-utils"
import type { ResumeSectionId } from "./types"

/** Lucide icon names used in resume UI. */
export type ResumeIconName =
  | "mail"
  | "phone"
  | "globe"
  | "linkedin"
  | "github"
  | "briefcase"
  | "graduation-cap"
  | "sparkles"
  | "award"
  | "languages"
  | "heart"
  | "user"
  | "map-pin"
  | "file-text"
  | "star"
  | "bookmark"

export type ResumeContactIconField = "email" | "phone" | "website" | "linkedin" | "github"

export type ResumeDisplayPreferences = {
  showContactIcons: boolean
  showSectionIcons: boolean
  /** Vertical gap between resume sections (Tailwind spacing scale). */
  sectionSpacing: ResumeSectionSpacingToken
  /** Faded accent image on the last page of the minimal layout. */
  showMinimalAccentImage: boolean
  /** Portrait selfie or hero atmosphere background. */
  minimalAccentImage: "portrait" | "atmosphere"
  /** Gradient wash strength over the accent image (0 = subtle, 100 = heavy). */
  minimalAccentFade: number
  /** Official layout: two-column card grid for experience sections. */
  experienceGridLayout: boolean
}

export const DEFAULT_CONTACT_ICONS: Record<ResumeContactIconField, ResumeIconName> = {
  email: "mail",
  phone: "phone",
  website: "globe",
  linkedin: "linkedin",
  github: "github",
}

export const DEFAULT_SECTION_ICONS: Partial<Record<ResumeSectionId, ResumeIconName>> = {
  summary: "file-text",
  experience: "briefcase",
  education: "graduation-cap",
  skills: "sparkles",
  contact: "mail",
  certifications: "award",
  languages: "languages",
  interests: "heart",
}

export const DEFAULT_RESUME_DISPLAY_PREFERENCES: ResumeDisplayPreferences = {
  showContactIcons: true,
  showSectionIcons: true,
  sectionSpacing: DEFAULT_RESUME_SECTION_SPACING,
  showMinimalAccentImage: true,
  minimalAccentImage: "atmosphere",
  minimalAccentFade: 65,
  experienceGridLayout: false,
}

export function parseResumeDisplayPreferences(
  value: unknown,
): ResumeDisplayPreferences | null {
  if (typeof value !== "object" || value === null) return null
  const record = value as Record<string, unknown>

  if (typeof record.showContactIcons !== "boolean") return null
  if (typeof record.showSectionIcons !== "boolean") return null

  return normalizeResumeDisplayPreferences({
    showContactIcons: record.showContactIcons,
    showSectionIcons: record.showSectionIcons,
    sectionSpacing: resolveSectionSpacingToken(record.sectionSpacing),
    showMinimalAccentImage:
      typeof record.showMinimalAccentImage === "boolean"
        ? record.showMinimalAccentImage
        : true,
    minimalAccentImage: resolveMinimalAccentImageId(record.minimalAccentImage),
    minimalAccentFade:
      typeof record.minimalAccentFade === "number"
        ? clampAccentFade(record.minimalAccentFade)
        : DEFAULT_RESUME_DISPLAY_PREFERENCES.minimalAccentFade,
    experienceGridLayout:
      typeof record.experienceGridLayout === "boolean"
        ? record.experienceGridLayout
        : false,
  })
}

export function normalizeResumeDisplayPreferences(
  display?: Partial<ResumeDisplayPreferences> | null,
): ResumeDisplayPreferences {
  return {
    ...DEFAULT_RESUME_DISPLAY_PREFERENCES,
    ...display,
    sectionSpacing: resolveSectionSpacingToken(display?.sectionSpacing),
    minimalAccentImage: resolveMinimalAccentImageId(display?.minimalAccentImage),
    minimalAccentFade:
      typeof display?.minimalAccentFade === "number"
        ? clampAccentFade(display.minimalAccentFade)
        : DEFAULT_RESUME_DISPLAY_PREFERENCES.minimalAccentFade,
    experienceGridLayout: display?.experienceGridLayout === true,
  }
}
