import type {
  ResumeContact,
  ResumeDocument,
  ResumeExperienceItem,
} from "../types"
import {
  OFFICIAL_CAPABILITIES,
  OFFICIAL_CERTIFICATIONS,
  OFFICIAL_CORE_STRENGTHS,
  OFFICIAL_EDUCATION,
  OFFICIAL_HEADER_TAGLINE,
  OFFICIAL_HIGHLIGHT_METRICS,
  OFFICIAL_PROFILE_TEXT,
  OFFICIAL_PROJECTS,
  OFFICIAL_PROFESSIONAL_EXPERIENCE_COUNT,
} from "../official-resume-content"

export function splitSummaryForOfficial(summary: string): {
  tagline?: string
  profile?: string
} {
  const parts = summary.split("\n\n").map((part) => part.trim()).filter(Boolean)
  if (parts.length === 0) return {}
  if (parts.length === 1) return { profile: parts[0] }
  return {
    tagline: parts[0],
    profile: parts.slice(1).join("\n\n"),
  }
}

export function getOfficialSummaryParts(document: ResumeDocument): {
  tagline?: string
  profile?: string
} {
  if (document.summary) return splitSummaryForOfficial(document.summary)
  return {
    tagline: OFFICIAL_HEADER_TAGLINE,
    profile: OFFICIAL_PROFILE_TEXT,
  }
}

export function formatOfficialTitle(title: string): string {
  return title.replace(/\s*\/\s*/g, " | ").replace(/\s*\|\s*/g, " | ").trim()
}

export function formatOfficialMetricText(text: string): string {
  const trimmed = text.trim()
  if (!trimmed || trimmed !== trimmed.toUpperCase()) return trimmed

  return trimmed
    .toLowerCase()
    .replace(/\b\w+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1))
}

export function splitExperienceGroups(experience: ResumeExperienceItem[]): {
  professional: ResumeExperienceItem[]
  earlier: ResumeExperienceItem[]
} {
  const professional: ResumeExperienceItem[] = []
  const earlier: ResumeExperienceItem[] = []

  for (const [index, job] of experience.entries()) {
    const group =
      job.experienceGroup ??
      (index < OFFICIAL_PROFESSIONAL_EXPERIENCE_COUNT ? "professional" : "earlier")

    if (group === "earlier") {
      earlier.push(job)
    } else {
      professional.push(job)
    }
  }

  return { professional, earlier }
}

export function getOfficialHighlightMetrics(document: ResumeDocument) {
  return document.highlightMetrics?.length
    ? document.highlightMetrics
    : OFFICIAL_HIGHLIGHT_METRICS
}

export function getOfficialCoreStrengths(document: ResumeDocument) {
  return document.coreStrengths?.length
    ? document.coreStrengths
    : OFFICIAL_CORE_STRENGTHS
}

export function getOfficialProjects(document: ResumeDocument) {
  return document.projects?.length ? document.projects : OFFICIAL_PROJECTS
}

export function getOfficialCapabilities(document: ResumeDocument) {
  return document.capabilities?.length
    ? document.capabilities
    : OFFICIAL_CAPABILITIES
}

export function getOfficialEducation(document: ResumeDocument) {
  return document.education ?? OFFICIAL_EDUCATION
}

export function getOfficialCertifications(document: ResumeDocument) {
  return document.certifications?.length
    ? document.certifications
    : OFFICIAL_CERTIFICATIONS
}

/** @deprecated Use getOfficialCoreStrengths — kept for module compatibility. */
export function extractSkillChips(skills: string[], limit = 12): string[] {
  const chips: string[] = []

  for (const line of skills) {
    const separatorIndex = line.indexOf(": ")
    if (separatorIndex === -1) continue

    const values = line
      .slice(separatorIndex + 2)
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean)

    chips.push(...values)
  }

  return chips.slice(0, limit)
}

/** @deprecated Use getOfficialCapabilities — kept for module compatibility. */
export function parseSkillCategories(
  skills: string[],
): Array<{ label: string; values: string }> {
  return skills
    .map((line) => {
      const separatorIndex = line.indexOf(": ")
      if (separatorIndex === -1) {
        return { label: "Skills", values: line.trim() }
      }

      return {
        label: line.slice(0, separatorIndex).trim(),
        values: line.slice(separatorIndex + 2).trim(),
      }
    })
    .filter((entry) => entry.values.length > 0)
}

export type OfficialContactPart = {
  label: string
  href?: string
}

export function buildOfficialContactParts(
  document: ResumeDocument,
): OfficialContactPart[] {
  const parts: OfficialContactPart[] = []

  if (document.location) {
    parts.push({ label: document.location })
  }

  const contact = document.contact
  if (!contact) return parts

  if (contact.email) {
    parts.push({ label: contact.email, href: `mailto:${contact.email}` })
  }
  if (contact.phone) {
    parts.push({ label: contact.phone, href: `tel:${contact.phone.replace(/\s/g, "")}` })
  }
  if (contact.website) {
    parts.push({ label: "Portfolio", href: contact.website })
  }
  if (contact.linkedin) {
    parts.push({ label: "LinkedIn", href: contact.linkedin })
  }
  if (contact.github) {
    parts.push({ label: "GitHub", href: contact.github })
  }

  return parts
}

export function buildOfficialFooterLabel(document: ResumeDocument): string {
  return `${document.name} | ${document.title}`
}

export function hasOfficialContact(contact?: ResumeContact): boolean {
  return Boolean(
    contact &&
      (contact.email ||
        contact.phone ||
        contact.website ||
        contact.linkedin ||
        contact.github),
  )
}

export function buildOfficialLinkParts(document: ResumeDocument): OfficialContactPart[] {
  return buildOfficialContactParts(document).filter((part) => part.href)
}

export function formatLanguageLine(
  languages: NonNullable<ResumeDocument["languages"]>,
): string {
  return languages.map((language) => `${language.name} - ${language.level}`).join(" | ")
}

const PROJECT_DOMAIN_PATTERN = /^[\w.-]+\.[a-z]{2,}(?:\/[^\s|]*)?$/i
const PROJECT_URL_PATTERN = /^https?:\/\//i

function normalizeProjectHref(value: string): string {
  const trimmed = value.trim()
  if (PROJECT_URL_PATTERN.test(trimmed)) return trimmed
  return `https://${trimmed.replace(/^www\./i, "")}`
}

function projectSegmentHref(segment: string, projectUrl?: string): string | undefined {
  const label = segment.trim()
  if (!label) return undefined

  if (PROJECT_URL_PATTERN.test(label) || PROJECT_DOMAIN_PATTERN.test(label)) {
    return normalizeProjectHref(label)
  }

  if (!projectUrl) return undefined

  try {
    const host = new URL(projectUrl).hostname.replace(/^www\./i, "")
    const normalized = label
      .replace(/^https?:\/\//i, "")
      .replace(/^www\./i, "")
      .split("/")[0]
      .toLowerCase()

    if (host.toLowerCase() === normalized || host.toLowerCase().startsWith(normalized)) {
      return projectUrl
    }
  } catch {
    return undefined
  }

  return undefined
}

export function parseProjectMetaParts(
  meta: string,
  projectUrl?: string,
): OfficialContactPart[] {
  return meta
    .split(/\s*\|\s*/)
    .map((segment) => {
      const label = segment.trim()
      const href = projectSegmentHref(label, projectUrl)

      return href ? { label, href } : { label }
    })
    .filter((part) => part.label.length > 0)
}
