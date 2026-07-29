import { profile } from "@/lib/profile"

import { DEFAULT_RESUME_SECTIONS } from "./default-sections"
import {
  OFFICIAL_CAPABILITIES,
  OFFICIAL_CERTIFICATIONS,
  OFFICIAL_CORE_STRENGTHS,
  OFFICIAL_HEADER_TAGLINE,
  OFFICIAL_HIGHLIGHT_METRICS,
  OFFICIAL_PROFILE_TEXT,
  OFFICIAL_PROJECTS,
  OFFICIAL_PROFESSIONAL_EXPERIENCE_COUNT,
} from "./official-resume-content"
import type { ResumeDocument, ResumeSectionConfig } from "./types"

function buildSkillsList(): string[] {
  const groupedTools = profile.tools.reduce<Record<string, string[]>>(
    (accumulator, tool) => {
      const bucket = accumulator[tool.category] ?? []
      bucket.push(tool.name)
      accumulator[tool.category] = bucket
      return accumulator
    },
    {},
  )

  const toolLines = Object.entries(groupedTools).map(([category, names]) => {
    const label = category === "Design" ? "Design Tools" : category
    return `${label}: ${names.join(", ")}`
  })

  return [
    `Design: ${profile.designSkills.join(", ")}`,
    `Engineering: ${profile.engineeringSkills.join(", ")}`,
    `Domain: ${profile.domainSkills.join(", ")}`,
    `Capabilities: ${profile.designCapabilities.join(", ")}`,
    ...toolLines,
  ]
}

export function buildResumeDocument(
  sections: ResumeSectionConfig = DEFAULT_RESUME_SECTIONS,
): ResumeDocument {
  const document: ResumeDocument = {
    name: profile.name,
    title: profile.title,
    location: profile.location,
    portrait: {
      src: profile.portrait.src,
      shape: profile.portrait.shape,
    },
  }

  if (sections.summary) {
    document.summary = [OFFICIAL_HEADER_TAGLINE, OFFICIAL_PROFILE_TEXT].join("\n\n")
  }

  if (sections.experience) {
    document.experience = profile.experience.map((item, index) => ({
      company: item.company,
      role: item.role,
      period: item.period,
      location: item.location,
      description: item.description,
      highlights: item.highlights,
      logoSrc: item.logoSrc,
      experienceGroup:
        index < OFFICIAL_PROFESSIONAL_EXPERIENCE_COUNT ? "professional" : "earlier",
    }))
  }

  document.highlightMetrics = OFFICIAL_HIGHLIGHT_METRICS
  document.projects = OFFICIAL_PROJECTS
  document.coreStrengths = OFFICIAL_CORE_STRENGTHS
  document.capabilities = OFFICIAL_CAPABILITIES

  if (sections.education) {
    document.education = {
      degree: profile.education.degree,
      school: profile.education.school,
      years: profile.education.years,
      location: profile.education.location,
    }
  }

  if (sections.skills) {
    document.skills = buildSkillsList()
  }

  if (sections.contact) {
    document.contact = {
      email: profile.contact.email,
      phone: profile.contact.phone,
      website: profile.links.website,
      linkedin: profile.links.linkedin,
      github: profile.links.github,
    }
  }

  if (sections.certifications) {
    document.certifications = OFFICIAL_CERTIFICATIONS
  }

  if (sections.languages) {
    document.languages = profile.languages.map((item) => ({
      name: item.name,
      level: item.level,
    }))
  }

  if (sections.interests) {
    document.interests = [...profile.interests]
  }

  return document
}

export function filterDocumentBySections(
  document: ResumeDocument,
  sections: ResumeSectionConfig,
): ResumeDocument {
  return {
    ...document,
    summary: sections.summary ? document.summary : undefined,
    experience: sections.experience ? document.experience : undefined,
    education: sections.education ? document.education : undefined,
    skills: sections.skills ? document.skills : undefined,
    contact: sections.contact ? document.contact : undefined,
    certifications: sections.certifications ? document.certifications : undefined,
    languages: sections.languages ? document.languages : undefined,
    interests: sections.interests ? document.interests : undefined,
    highlightMetrics: document.highlightMetrics,
    projects: document.projects,
    coreStrengths: document.coreStrengths,
    capabilities: document.capabilities,
  }
}

