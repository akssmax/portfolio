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

export type ResumeExperienceItem = {
  company: string
  role: string
  period: string
  location: string
  description: string
  highlights?: Array<string>
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
