import type { ResumeDocument } from "./types"

export function addExperienceJob(document: ResumeDocument): ResumeDocument {
  const experience = document.experience ?? []
  return {
    ...document,
    experience: [
      ...experience,
      {
        company: "Company",
        role: "Role",
        period: "2024 – Present",
        location: "City",
        description: "Describe your impact.",
        highlights: ["Key achievement"],
      },
    ],
  }
}

export function removeExperienceJob(document: ResumeDocument, index: number): ResumeDocument {
  if (!document.experience?.length) return document
  return {
    ...document,
    experience: document.experience.filter((_, i) => i !== index),
  }
}

export function addExperienceHighlight(
  document: ResumeDocument,
  jobIndex: number,
): ResumeDocument {
  if (!document.experience?.[jobIndex]) return document
  const experience = [...document.experience]
  const job = experience[jobIndex]
  experience[jobIndex] = {
    ...job,
    highlights: [...(job.highlights ?? []), "New highlight"],
  }
  return { ...document, experience }
}

export function removeExperienceHighlight(
  document: ResumeDocument,
  jobIndex: number,
  highlightIndex: number,
): ResumeDocument {
  if (!document.experience?.[jobIndex]) return document
  const experience = [...document.experience]
  const job = experience[jobIndex]
  experience[jobIndex] = {
    ...job,
    highlights: job.highlights?.filter((_, i) => i !== highlightIndex),
  }
  return { ...document, experience }
}

export function addSkill(document: ResumeDocument): ResumeDocument {
  return { ...document, skills: [...(document.skills ?? []), "New skill"] }
}

export function removeSkill(document: ResumeDocument, index: number): ResumeDocument {
  return {
    ...document,
    skills: document.skills?.filter((_, i) => i !== index),
  }
}

export function addCertification(document: ResumeDocument): ResumeDocument {
  return {
    ...document,
    certifications: [
      ...(document.certifications ?? []),
      { title: "Certification", issuer: "Issuer", date: "2024" },
    ],
  }
}

export function removeCertification(document: ResumeDocument, index: number): ResumeDocument {
  return {
    ...document,
    certifications: document.certifications?.filter((_, i) => i !== index),
  }
}

export function addLanguage(document: ResumeDocument): ResumeDocument {
  return {
    ...document,
    languages: [...(document.languages ?? []), { name: "Language", level: "Fluent" }],
  }
}

export function removeLanguage(document: ResumeDocument, index: number): ResumeDocument {
  return {
    ...document,
    languages: document.languages?.filter((_, i) => i !== index),
  }
}

export function addSummaryParagraph(document: ResumeDocument): ResumeDocument {
  const summary = document.summary ?? ""
  return {
    ...document,
    summary: summary ? `${summary}\n\nNew paragraph` : "New paragraph",
  }
}
