import {
  clampAccentFade,
  resolveMinimalAccentImageId,
} from "./minimal-accent-utils"
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
  /** Faded accent image on the last page of the minimal layout. */
  showMinimalAccentImage: boolean
  /** Portrait selfie or hero atmosphere background. */
  minimalAccentImage: "portrait" | "atmosphere"
  /** Gradient wash strength over the accent image (0 = subtle, 100 = heavy). */
  minimalAccentFade: number
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
  showMinimalAccentImage: true,
  minimalAccentImage: "atmosphere",
  minimalAccentFade: 65,
}

export function parseResumeDisplayPreferences(
  value: unknown,
): ResumeDisplayPreferences | null {
  if (typeof value !== "object" || value === null) return null
  const record = value as Record<string, unknown>

  if (typeof record.showContactIcons !== "boolean") return null
  if (typeof record.showSectionIcons !== "boolean") return null

  return {
    showContactIcons: record.showContactIcons,
    showSectionIcons: record.showSectionIcons,
    showMinimalAccentImage:
      typeof record.showMinimalAccentImage === "boolean"
        ? record.showMinimalAccentImage
        : true,
    minimalAccentImage: resolveMinimalAccentImageId(record.minimalAccentImage),
    minimalAccentFade:
      typeof record.minimalAccentFade === "number"
        ? clampAccentFade(record.minimalAccentFade)
        : DEFAULT_RESUME_DISPLAY_PREFERENCES.minimalAccentFade,
  }
}
