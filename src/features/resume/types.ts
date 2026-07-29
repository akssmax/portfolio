export type ResumeSectionId =
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "contact"
  | "certifications"
  | "languages"
  | "interests"

export type ResumeSectionConfig = Record<ResumeSectionId, boolean>

export type ResumeLayoutId =
  | "classic"
  | "designer"
  | "modern"
  | "minimal"
  | "executive"
  | "official"

export type ResumeExperienceItem = {
  company: string
  role: string
  period: string
  location: string
  description: string
  highlights?: Array<string>
  logoSrc?: string
  /** Used by the Official layout to split professional vs earlier roles. */
  experienceGroup?: "professional" | "earlier"
}

export type ResumeHighlightMetric = {
  value: string
  label: string
}

export type ResumeProjectItem = {
  title: string
  meta: string
  description: string
  stack: string
  url?: string
}

export type ResumeCapabilityGroup = {
  label: string
  values: string
}

export type ResumeCertificationItem = {
  title: string
  issuer: string
  date: string
  credentialId?: string
}

export type ResumeLanguageItem = {
  name: string
  level: string
}

export type ResumePortrait = {
  src: string
  shape: string
}

export type ResumeContact = {
  email: string
  phone: string
  website?: string
  linkedin?: string
  github?: string
}

export type ResumeDocument = {
  name: string
  title: string
  location: string
  portrait?: ResumePortrait
  summary?: string
  experience?: Array<ResumeExperienceItem>
  education?: {
    degree: string
    school: string
    years: string
    location: string
  }
  skills?: Array<string>
  contact?: ResumeContact
  certifications?: Array<ResumeCertificationItem>
  languages?: Array<ResumeLanguageItem>
  interests?: Array<string>
  /** Official layout — stat highlights below the profile. */
  highlightMetrics?: Array<ResumeHighlightMetric>
  /** Official layout — featured project cards in a grid. */
  projects?: Array<ResumeProjectItem>
  /** Official layout — core strength rows (space-separated chips). */
  coreStrengths?: string[][]
  /** Official layout — capabilities columns near the footer. */
  capabilities?: Array<ResumeCapabilityGroup>
}

export type CoverLetterDocument = {
  senderName: string
  senderTitle: string
  senderLocation: string
  senderContact?: ResumeContact
  recipientName: string
  recipientCompany: string
  recipientAddress?: string
  date: string
  subject?: string
  body: string
  signOff?: string
}

export type GenerateResumePdfOptions = {
  document: ResumeDocument
  brandColor: string
  layout?: ResumeLayoutId
  filename?: string
}

export type GenerateCoverLetterPdfOptions = {
  document: CoverLetterDocument
  brandColor: string
  layout?: ResumeLayoutId
  filename?: string
}
