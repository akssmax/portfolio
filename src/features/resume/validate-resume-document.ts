import type { ResumeDocument } from "@/features/resume/types"
import { slugToDisplayName } from "@/lib/linkedin/parse-linkedin-url"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string")
}

function asTrimmedString(value: unknown): string {
  if (typeof value === "string") return value.trim()
  if (typeof value === "number" && Number.isFinite(value)) return String(value)
  return ""
}

function isPlaceholder(value: string): boolean {
  return !value || value === "-" || value === "—" || value === "N/A"
}

function normalizeSkillsValue(value: unknown): string[] | undefined {
  if (value === null || value === undefined) return undefined

  if (isStringArray(value)) {
    const skills = value.map((skill) => skill.trim()).filter(Boolean)
    return skills.length ? skills : undefined
  }

  if (Array.isArray(value)) {
    const skills = value.flatMap((item) => {
      if (typeof item === "string") return [item.trim()]
      if (isRecord(item)) {
        const name = asTrimmedString(item.name ?? item.skill ?? item.label)
        return name ? [name] : []
      }
      return []
    })
    return skills.length ? [...new Set(skills.filter(Boolean))] : undefined
  }

  if (isRecord(value)) {
    const skills: string[] = []
    for (const nested of Object.values(value)) {
      if (isStringArray(nested)) {
        skills.push(...nested.map((skill) => skill.trim()).filter(Boolean))
      } else if (typeof nested === "string" && nested.trim()) {
        skills.push(nested.trim())
      }
    }
    return skills.length ? [...new Set(skills)] : undefined
  }

  if (typeof value === "string") {
    const skills = value
      .split(/[,;|]/)
      .map((skill) => skill.trim())
      .filter(Boolean)
    return skills.length ? skills : undefined
  }

  return undefined
}

function normalizeDescription(value: unknown): string {
  const direct = asTrimmedString(value)
  if (direct) return direct

  if (Array.isArray(value)) {
    return value
      .flatMap((item) => {
        if (typeof item === "string") return [item.trim()]
        if (isRecord(item) && typeof item.text === "string") return [item.text.trim()]
        return []
      })
      .filter(Boolean)
      .join("\n")
  }

  return ""
}

function normalizePeriod(item: Record<string, unknown>): string {
  const direct = asTrimmedString(item.period ?? item.dates ?? item.duration)
  if (direct) return direct

  const start = asTrimmedString(item.start_date ?? item.startDate ?? item.from)
  const end = asTrimmedString(item.end_date ?? item.endDate ?? item.to ?? item.end)
  if (start || end) {
    return [start, end || "Present"].filter(Boolean).join(" – ")
  }

  return "-"
}

function normalizeExperienceItem(
  item: Record<string, unknown>,
): Record<string, unknown> | null {
  const company = asTrimmedString(item.company ?? item.employer ?? item.organization) || "-"
  const role =
    asTrimmedString(item.role ?? item.position ?? item.job_title ?? item.title) || "-"
  const period = normalizePeriod(item)
  const location = asTrimmedString(item.location ?? item.city)
  const description =
    normalizeDescription(item.description) ||
    normalizeDescription(item.highlights) ||
    normalizeDescription(item.responsibilities) ||
    "-"

  if (isPlaceholder(company) && isPlaceholder(role) && isPlaceholder(description)) {
    return null
  }

  const normalized: Record<string, unknown> = {
    company,
    role,
    period,
    location,
    description,
  }

  if (Array.isArray(item.highlights) && isStringArray(item.highlights)) {
    normalized.highlights = item.highlights
  }

  return normalized
}

function normalizeEducationFields(
  record: Record<string, unknown>,
): Record<string, unknown> {
  const start = asTrimmedString(record.start_date ?? record.startDate)
  const end = asTrimmedString(record.end_date ?? record.endDate)
  const yearsFromDates = [start, end].filter(Boolean).join(" – ")

  return {
    degree:
      record.degree ??
      record.title ??
      record.program ??
      record.field_of_study ??
      record.name ??
      "",
    school:
      record.school ??
      record.institution ??
      record.university ??
      record.college ??
      "",
    years: record.years ?? record.year ?? record.period ?? record.dates ?? yearsFromDates ?? "",
    location: record.location ?? record.city ?? "",
  }
}

function normalizeEducationValue(value: unknown): Record<string, unknown> | undefined {
  if (value === null || value === undefined) return undefined

  if (Array.isArray(value)) {
    for (const item of value) {
      if (!isRecord(item)) continue
      const normalized = normalizeEducationFields(item)
      const degree = asTrimmedString(normalized.degree)
      const school = asTrimmedString(normalized.school)
      if (!isPlaceholder(degree) || !isPlaceholder(school)) {
        return normalized
      }
    }
    return undefined
  }

  if (!isRecord(value)) return undefined
  return normalizeEducationFields(value)
}

function normalizeContactValue(value: unknown): Record<string, unknown> | undefined {
  if (!isRecord(value)) return undefined

  const contact: Record<string, unknown> = {}
  for (const [key, fieldValue] of Object.entries(value)) {
    if (fieldValue === null || fieldValue === undefined) continue
    if (typeof fieldValue === "string") {
      const trimmed = fieldValue.trim()
      if (trimmed) contact[key] = trimmed
    }
  }

  return Object.keys(contact).length ? contact : undefined
}

function preprocessResumeInput(raw: unknown): unknown {
  if (!isRecord(raw)) return raw

  const copy: Record<string, unknown> = { ...raw }

  if (copy.summary !== undefined && typeof copy.summary !== "string") {
    copy.summary = asTrimmedString(copy.summary) || undefined
  }

  if (copy.skills !== undefined) {
    const normalized = normalizeSkillsValue(copy.skills)
    if (normalized) copy.skills = normalized
    else delete copy.skills
  }

  if (copy.interests !== undefined) {
    const normalized = normalizeSkillsValue(copy.interests)
    if (normalized) copy.interests = normalized
    else delete copy.interests
  }

  if (copy.experience !== undefined) {
    if (Array.isArray(copy.experience)) {
      const normalized = copy.experience
        .filter(isRecord)
        .map(normalizeExperienceItem)
        .filter((item): item is Record<string, unknown> => item !== null)
      if (normalized.length) copy.experience = normalized
      else delete copy.experience
    } else {
      delete copy.experience
    }
  }

  if (copy.education !== undefined) {
    const normalized = normalizeEducationValue(copy.education)
    if (normalized) copy.education = normalized
    else delete copy.education
  }

  if (copy.contact !== undefined) {
    const normalized = normalizeContactValue(copy.contact)
    if (normalized) copy.contact = normalized
    else delete copy.contact
  }

  if (copy.certifications !== undefined) {
    if (!Array.isArray(copy.certifications)) {
      delete copy.certifications
    } else {
      copy.certifications = copy.certifications.filter(isRecord)
    }
  }

  if (copy.languages !== undefined && !Array.isArray(copy.languages)) {
    delete copy.languages
  }

  return copy
}

export function buildMinimalResumeDocument(
  linkedInSlug: string,
  linkedinUrl?: string,
): ResumeDocument {
  return {
    name: slugToDisplayName(linkedInSlug),
    title: "Professional",
    location: "-",
    summary:
      "Draft resume generated from your Profile URL. Review and edit sections before downloading.",
    contact: {
      email: "",
      phone: "",
      ...(linkedinUrl ? { linkedin: linkedinUrl } : {}),
    },
  }
}

export function formatResumeValidationError(error: string): {
  title: string
  description: string
} {
  const lower = error.toLowerCase()

  if (lower.includes("linkedin") || lower.includes("profile") || lower.includes("invalid_url")) {
    return {
      title: "Invalid Profile URL",
      description: "Use a profile link like linkedin.com/in/your-name, github.com/username, or your portfolio website",
    }
  }

  if (lower.includes("rate limit")) {
    return {
      title: "Daily limit reached",
      description: error,
    }
  }

  if (lower.includes("education")) {
    return {
      title: "Couldn't build education section",
      description:
        "We couldn't parse education from the AI response. You can edit it after generation or paste details in the optional summary.",
    }
  }

  if (lower.includes("experience")) {
    return {
      title: "Couldn't build experience section",
      description:
        "Work history came back in an unexpected format. You can edit it after generation or paste details in the optional summary.",
    }
  }

  if (lower.includes("json") || lower.includes("empty")) {
    return {
      title: "Generation failed",
      description:
        "The AI response wasn't valid resume data. Try again - a profile summary is optional but can improve accuracy.",
    }
  }

  if (
    lower.includes("mistral") ||
    lower.includes("brave") ||
    lower.includes("not configured") ||
    lower.includes("api error")
  ) {
    return {
      title: "Service unavailable",
      description:
        "The AI or search service isn't configured or returned an error. Try again in a moment.",
    }
  }

  if (lower.includes("no resume document")) {
    return {
      title: "No resume produced",
      description:
        "We couldn't build a resume from public search results alone. Try again, or optionally paste a profile summary for better accuracy.",
    }
  }

  return {
    title: "Couldn't generate resume",
    description:
      "We couldn't structure a resume from the available data. Try again - a profile summary is optional but can improve accuracy.",
  }
}

export type ResumeValidationResult =
  | { ok: true; document: ResumeDocument }
  | { ok: false; error: string }

export type ResumeValidationContext = {
  linkedInSlug?: string
  linkedinUrl?: string
}

export function validateResumeDocument(
  raw: unknown,
  context: ResumeValidationContext = {},
): ResumeValidationResult {
  const preprocessed = preprocessResumeInput(raw)

  if (!isRecord(preprocessed)) {
    return { ok: false, error: "Resume document must be a JSON object." }
  }

  const rawRecord = preprocessed

  const name =
    asTrimmedString(rawRecord.name) ||
    (context.linkedInSlug ? slugToDisplayName(context.linkedInSlug) : "")
  const title = asTrimmedString(rawRecord.title) || "Professional"
  const location = asTrimmedString(rawRecord.location) || "-"

  if (!name) {
    return { ok: false, error: "Resume name is required." }
  }

  const document: ResumeDocument = {
    name,
    title,
    location,
  }

  if (typeof rawRecord.summary === "string" && rawRecord.summary.trim()) {
    document.summary = rawRecord.summary.trim()
  }

  if (rawRecord.skills !== undefined) {
    if (!isStringArray(rawRecord.skills)) {
      return { ok: false, error: "Skills must be an array of strings." }
    }
    document.skills = rawRecord.skills.map((skill) => skill.trim()).filter(Boolean)
  }

  if (rawRecord.interests !== undefined) {
    if (!isStringArray(rawRecord.interests)) {
      return { ok: false, error: "Interests must be an array of strings." }
    }
    document.interests = rawRecord.interests.map((item) => item.trim()).filter(Boolean)
  }

  if (rawRecord.experience !== undefined) {
    if (!Array.isArray(rawRecord.experience)) {
      return { ok: false, error: "Experience must be an array." }
    }

    document.experience = rawRecord.experience.map((item, index) => {
      if (!isRecord(item)) {
        throw new Error(`Experience item ${index + 1} must be an object.`)
      }

      return {
        company: asTrimmedString(item.company) || "-",
        role: asTrimmedString(item.role) || "-",
        period: asTrimmedString(item.period) || "-",
        location: asTrimmedString(item.location),
        description: asTrimmedString(item.description) || "-",
        ...(isStringArray(item.highlights)
          ? { highlights: item.highlights.map((h) => h.trim()).filter(Boolean) }
          : {}),
      }
    })
  }

  if (rawRecord.education !== undefined) {
    if (!isRecord(rawRecord.education)) {
      return { ok: false, error: "Education must be an object." }
    }
    const { degree, school, years, location: eduLocation } = rawRecord.education
    document.education = {
      degree: asTrimmedString(degree) || "-",
      school: asTrimmedString(school) || "-",
      years: asTrimmedString(years) || "-",
      location: asTrimmedString(eduLocation),
    }
  }

  if (rawRecord.contact !== undefined) {
    if (!isRecord(rawRecord.contact)) {
      return { ok: false, error: "Contact must be an object." }
    }
    document.contact = {
      email: asTrimmedString(rawRecord.contact.email),
      phone: asTrimmedString(rawRecord.contact.phone),
      ...(typeof rawRecord.contact.website === "string"
        ? { website: rawRecord.contact.website.trim() }
        : {}),
      ...(typeof rawRecord.contact.linkedin === "string"
        ? { linkedin: rawRecord.contact.linkedin.trim() }
        : {}),
      ...(typeof rawRecord.contact.github === "string"
        ? { github: rawRecord.contact.github.trim() }
        : {}),
    }
  }

  if (rawRecord.certifications !== undefined && Array.isArray(rawRecord.certifications)) {
    document.certifications = rawRecord.certifications
      .filter(isRecord)
      .map((item) => ({
        title: asTrimmedString(item.title ?? item.name) || "-",
        issuer: asTrimmedString(item.issuer ?? item.organization) || "-",
        date: asTrimmedString(item.date ?? item.year) || "-",
        ...(typeof item.credentialId === "string"
          ? { credentialId: item.credentialId.trim() }
          : {}),
      }))
      .filter((item) => !isPlaceholder(item.title) || !isPlaceholder(item.issuer))
  }

  if (rawRecord.languages !== undefined && Array.isArray(rawRecord.languages)) {
    document.languages = rawRecord.languages
      .filter(isRecord)
      .map((item) => ({
        name: asTrimmedString(item.name ?? item.language) || "-",
        level: asTrimmedString(item.level ?? item.proficiency) || "-",
      }))
      .filter((item) => !isPlaceholder(item.name))
  }

  return { ok: true, document }
}

export function extractJsonFromModelOutput(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return trimmed

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fenced?.[1]) return fenced[1].trim()

  const start = trimmed.indexOf("{")
  const end = trimmed.lastIndexOf("}")
  if (start !== -1 && end > start) {
    return trimmed.slice(start, end + 1)
  }

  return trimmed
}

export function parseResumeDocumentJson(
  raw: string,
  context: ResumeValidationContext = {},
): ResumeValidationResult {
  const jsonText = extractJsonFromModelOutput(raw)
  if (!jsonText) {
    if (context.linkedInSlug) {
      return {
        ok: true,
        document: buildMinimalResumeDocument(context.linkedInSlug, context.linkedinUrl),
      }
    }
    return { ok: false, error: "Resume output was empty." }
  }

  try {
    const parsed = JSON.parse(jsonText) as unknown
    const result = validateResumeDocument(parsed, context)
    if (result.ok) return result

    return result
  } catch {
    if (context.linkedInSlug) {
      return {
        ok: true,
        document: buildMinimalResumeDocument(context.linkedInSlug, context.linkedinUrl),
      }
    }
    return { ok: false, error: "Resume output was not valid JSON." }
  }
}
