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

export type ResumeLayoutId = "classic" | "designer" | "modern"

export type ResumeExperienceItem = {
  company: string
  role: string
  period: string
  location: string
  description: string
  highlights?: string[]
  logoSrc?: string
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
  experience?: ResumeExperienceItem[]
  education?: {
    degree: string
    school: string
    years: string
    location: string
  }
  skills?: string[]
  contact?: ResumeContact
  certifications?: ResumeCertificationItem[]
  languages?: ResumeLanguageItem[]
  interests?: string[]
}

export type GenerateResumePdfOptions = {
  document: ResumeDocument
  brandColor: string
  layout?: ResumeLayoutId
  filename?: string
}
