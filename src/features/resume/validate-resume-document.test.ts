import { describe, expect, it } from "vitest"

import {
  parseResumeDocumentJson,
  validateResumeDocument,
} from "@/features/resume/validate-resume-document"

const MISTRAL_SHAPED_OUTPUT = {
  name: "Akshay Saini",
  title: "Software Engineer",
  location: "-",
  contact: {
    email: null,
    phone: null,
    linkedin: "https://www.linkedin.com/in/akshaysaini",
  },
  summary: "Software Engineer with expertise in full-stack development.",
  experience: [
    {
      company: "Microsoft",
      position: "Intern",
      start_date: "2020",
      end_date: "2021",
      location: "Redmond",
      description: [
        "Built features for cloud services.",
        "Collaborated with senior engineers.",
      ],
    },
  ],
  education: [
    {
      institution: "IIT Roorkee",
      degree: "B.Tech Computer Science",
      start_date: "2016",
      end_date: "2020",
    },
  ],
  skills: {
    technical: ["JavaScript", "Python", "React"],
    soft: ["Communication"],
  },
}

describe("validateResumeDocument", () => {
  it("accepts a minimal valid document", () => {
    const result = validateResumeDocument({
      name: "Jane Doe",
      title: "Product Designer",
      location: "San Francisco, CA",
      summary: "Design leader.",
    })

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.document.name).toBe("Jane Doe")
    }
  })

  it("fills required fields from LinkedIn slug when missing", () => {
    const result = validateResumeDocument({}, { linkedInSlug: "jane-doe" })

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.document.name).toBe("Jane Doe")
      expect(result.document.title).toBe("Professional")
      expect(result.document.location).toBe("-")
    }
  })

  it("rejects empty name when no slug fallback exists", () => {
    const result = validateResumeDocument({
      name: "",
      title: "",
      location: "",
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toContain("name")
    }
  })

  it("normalizes Mistral-shaped resume JSON", () => {
    const result = validateResumeDocument(MISTRAL_SHAPED_OUTPUT, {
      linkedInSlug: "akshaysaini",
    })

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.document.skills).toEqual(
        expect.arrayContaining(["JavaScript", "Python", "React", "Communication"]),
      )
      expect(result.document.experience?.[0]?.role).toBe("Intern")
      expect(result.document.experience?.[0]?.description).toContain("Built features")
      expect(result.document.education?.school).toBe("IIT Roorkee")
      expect(result.document.contact?.linkedin).toBe("https://www.linkedin.com/in/akshaysaini")
    }
  })

  it("parses JSON strings with nested Mistral shapes", () => {
    const result = parseResumeDocumentJson(JSON.stringify(MISTRAL_SHAPED_OUTPUT), {
      linkedInSlug: "akshaysaini",
    })

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.document.name).toBe("Akshay Saini")
      expect(result.document.skills?.length).toBeGreaterThan(0)
    }
  })
})
