import { profile } from "@/lib/profile"

import { DEFAULT_RESUME_SECTIONS } from "./default-sections"
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

  const toolLines = Object.entries(groupedTools).map(
    ([category, names]) => `${category}: ${names.join(", ")}`,
  )

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
    document.summary = [profile.tagline, profile.bio].filter(Boolean).join("\n\n")
  }

  if (sections.experience) {
    document.experience = profile.experience.map((item) => ({
      company: item.company,
      role: item.role,
      period: item.period,
      location: item.location,
      description: item.description,
      highlights: item.highlights,
      logoSrc: item.logoSrc,
    }))
  }

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
    document.certifications = profile.certifications.map((item) => ({
      title: item.title,
      issuer: item.issuer,
      date: item.date,
      credentialId: item.credentialId,
    }))
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
  }
}

