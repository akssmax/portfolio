import {
  OFFICIAL_PROFESSIONAL_EXPERIENCE_COUNT,
  SIGNATURE_TOOLKIT,
} from "../official-resume-content"
import {
  
  getOfficialHighlightMetrics,
  getOfficialProjects,
  splitSummaryForOfficial
} from "./official-layout-utils"
import { formatSignatureWebsiteLabel } from "./signature-tokens"
import type {OfficialContactPart} from "./official-layout-utils";
import type {
  ResumeCapabilityGroup,
  ResumeDocument,
  ResumeExperienceItem,
  ResumeHighlightMetric,
  ResumeProjectItem,
} from "../types"

export type SignatureJob = {
  job: ResumeExperienceItem
  /** Index in `document.experience`, used for edits. */
  index: number
  /** Bullets shown in Signature: the first few, so it fits on 2 pages. */
  visibleHighlights: Array<string>
}

/** Signature is the 2-page version: each job keeps its strongest (first) bullets. */
export const SIGNATURE_MAX_HIGHLIGHTS = 4
/** "Recent projects" cards shown in Signature, in this order. */
const SIGNATURE_PROJECT_KEYS = ["cue", "postforge"]

function pickSignatureProjects(projects: Array<ResumeProjectItem>): Array<ResumeProjectItem> {
  const picked = SIGNATURE_PROJECT_KEYS.flatMap((key) =>
    projects.filter((project) => project.title.toLowerCase().startsWith(key)),
  )
  return picked.length ? picked : projects
}

export type SignatureContent = {
  tagline?: string
  profileParagraphs: Array<string>
  contactLine: Array<OfficialContactPart>
  linkLine: Array<OfficialContactPart>
  metrics: Array<ResumeHighlightMetric>
  toolkit: Array<ResumeCapabilityGroup>
  professional: Array<SignatureJob>
  earlier: Array<SignatureJob>
  projects: Array<ResumeProjectItem>
  footerLabel: string
}

function buildContactLine(document: ResumeDocument): Array<OfficialContactPart> {
  const parts: Array<OfficialContactPart> = []
  if (document.location) parts.push({ label: document.location })

  const contact = document.contact
  if (!contact) return parts

  if (contact.email) parts.push({ label: contact.email, href: `mailto:${contact.email}` })
  if (contact.phone) {
    parts.push({ label: contact.phone, href: `tel:${contact.phone.replace(/\s/g, "")}` })
  }
  return parts
}

/** Portfolio first, then professional profiles. */
function buildLinkLine(document: ResumeDocument): Array<OfficialContactPart> {
  const contact = document.contact
  if (!contact) return []

  const parts: Array<OfficialContactPart> = []
  if (contact.website) {
    parts.push({
      label: formatSignatureWebsiteLabel(contact.website),
      href: contact.website,
    })
  }
  if (contact.linkedin) parts.push({ label: formatSignatureWebsiteLabel(contact.linkedin), href: contact.linkedin })
  if (contact.github) parts.push({ label: formatSignatureWebsiteLabel(contact.github), href: contact.github })
  return parts
}

export function getSignatureContent(document: ResumeDocument): SignatureContent {
  const summary = document.summary ? splitSummaryForOfficial(document.summary) : {}
  const professional: Array<SignatureJob> = []
  const earlier: Array<SignatureJob> = []

  for (const [index, job] of (document.experience ?? []).entries()) {
    const group =
      job.experienceGroup ??
      (index < OFFICIAL_PROFESSIONAL_EXPERIENCE_COUNT ? "professional" : "earlier")
    ;(group === "earlier" ? earlier : professional).push({
      job,
      index,
      visibleHighlights: (job.highlights ?? []).slice(0, SIGNATURE_MAX_HIGHLIGHTS),
    })
  }

  return {
    tagline: summary.tagline,
    profileParagraphs: summary.profile ? summary.profile.split("\n\n") : [],
    contactLine: buildContactLine(document),
    linkLine: buildLinkLine(document),
    metrics: getOfficialHighlightMetrics(document),
    toolkit: document.skills?.length ? SIGNATURE_TOOLKIT : [],
    professional,
    earlier,
    projects: pickSignatureProjects(getOfficialProjects(document)),
    footerLabel: `${document.name} · ${document.title}`,
  }
}

/** Write an edited profile paragraph back into the two-part summary string. */
export function replaceSignatureProfileParagraph(
  document: ResumeDocument,
  paragraphIndex: number,
  value: string,
): string {
  const { tagline, profile } = splitSummaryForOfficial(document.summary ?? "")
  const paragraphs = (profile ?? "").split("\n\n")
  paragraphs[paragraphIndex] = value
  return [tagline, ...paragraphs].filter(Boolean).join("\n\n")
}

export function replaceSignatureTagline(document: ResumeDocument, value: string): string {
  const { profile } = splitSummaryForOfficial(document.summary ?? "")
  return [value, profile].filter(Boolean).join("\n\n")
}

export function chunkPairs<T>(items: Array<T>): Array<Array<T>> {
  const rows: Array<Array<T>> = []
  for (let index = 0; index < items.length; index += 2) {
    rows.push(items.slice(index, index + 2))
  }
  return rows
}
