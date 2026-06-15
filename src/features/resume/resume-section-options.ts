import type { ResumeSectionId } from "./types"

export const RESUME_SECTION_OPTIONS: {
  id: ResumeSectionId
  label: string
  description: string
}[] = [
  { id: "summary", label: "Summary", description: "Tagline, bio, and location" },
  {
    id: "experience",
    label: "Experience",
    description: "Roles, companies, and highlights",
  },
  {
    id: "education",
    label: "Education",
    description: "Degree and school",
  },
  {
    id: "skills",
    label: "Skills",
    description: "Capabilities, skills, and tools",
  },
  {
    id: "contact",
    label: "Contact",
    description: "Email, phone, and links",
  },
  {
    id: "certifications",
    label: "Certifications",
    description: "Credentials and issuers",
  },
  {
    id: "languages",
    label: "Languages",
    description: "Spoken languages and proficiency",
  },
  {
    id: "interests",
    label: "Interests",
    description: "Personal interests",
  },
]
