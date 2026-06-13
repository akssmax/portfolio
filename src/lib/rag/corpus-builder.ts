import { toPlainText } from "@portabletext/toolkit"
import type { PortableTextBlock } from "@portabletext/react"

import { HERO_COPY } from "@/lib/hero-headlines"
import { profile } from "@/lib/profile"
import { fallbackProjects } from "@/lib/sanity/fallback-projects"
import type { ContentBlock } from "@/lib/sanity/types"

import type { CorpusChunk, CorpusDocument } from "./types"
import { CHUNK_OVERLAP, CHUNK_SIZE } from "./types"

function joinLines(lines: string[]): string {
  return lines.filter(Boolean).join("\n")
}

function buildProfileDocuments(): CorpusDocument[] {
  const docs: CorpusDocument[] = []

  docs.push({
    id: "profile-overview",
    source: "profile",
    sourceLabel: "About Akshay Saini",
    text: joinLines([
      `${profile.name} — ${profile.title}`,
      profile.tagline,
      profile.bio,
      `Location: ${profile.location}`,
      `Current role: ${profile.role} at ${profile.company}`,
      `Email: ${profile.contact.email}`,
    ]),
    href: "/about",
  })

  docs.push({
    id: "profile-skills",
    source: "profile",
    sourceLabel: "Skills & Tools",
    text: joinLines([
      "Design skills:",
      profile.designSkills.join(", "),
      "Engineering skills:",
      profile.engineeringSkills.join(", "),
      "Domain expertise:",
      profile.domainSkills.join(", "),
      "Design capabilities:",
      profile.designCapabilities.join(", "),
      "Tools:",
      profile.tools.map((t) => `${t.name} (${t.category}) — ${t.note}`).join("; "),
    ]),
    href: "/about",
  })

  docs.push({
    id: "profile-education",
    source: "profile",
    sourceLabel: "Education & Certifications",
    text: joinLines([
      `${profile.education.degree}, ${profile.education.school} (${profile.education.years})`,
      "Certifications:",
      profile.certifications.map((c) => `${c.title} — ${c.issuer} (${c.date})`).join("; "),
      "Languages:",
      profile.languages.map((l) => `${l.name} (${l.level})`).join(", "),
      "Interests:",
      profile.interests.join(", "),
    ]),
    href: "/about",
  })

  for (const [index, exp] of profile.experience.entries()) {
    docs.push({
      id: `profile-experience-${index}`,
      source: "profile",
      sourceLabel: `Experience — ${exp.company}`,
      text: joinLines([
        `${exp.role} at ${exp.company}`,
        exp.period,
        exp.location,
        exp.description,
        exp.highlights ? `Highlights: ${exp.highlights.join("; ")}` : "",
      ]),
      href: "/about",
    })
  }

  return docs
}

function blockToText(block: ContentBlock): string | null {
  switch (block._type) {
    case "sectionHeading":
      return joinLines([
        block.title,
        block.subtitle ? `(${block.subtitle})` : "",
      ])
    case "richTextBlock":
      return toPlainText(block.body as PortableTextBlock[])
    case "metrics":
      return block.items.map((item) => `${item.value} — ${item.label}`).join("; ")
    case "quote":
      return joinLines([
        `"${block.text}"`,
        block.attribution ? `— ${block.attribution}` : "",
      ])
    case "techStack":
      return `Tech stack: ${block.items.map((item) => item.name).join(", ")}`
    case "collaborators":
      return joinLines([
        block.subtitle ?? "",
        block.items.map((item) => `${item.name} (${item.role})`).join("; "),
      ])
    case "siteMap":
      return block.groups
        .flatMap((group) => [
          group.title,
          group.description ?? "",
          ...(group.routes?.map((route) => route.label) ?? []),
        ])
        .filter(Boolean)
        .join("; ")
    case "embed":
      return joinLines([block.label ?? "Embed", block.url])
    case "staticImage":
      return joinLines([block.alt, block.caption ?? ""])
    case "staticImageGallery":
      return block.images.map((img) => img.alt).join("; ")
    case "separator":
      return block.label ?? null
    default:
      return null
  }
}

function buildProjectDocuments(): CorpusDocument[] {
  const docs: CorpusDocument[] = []

  for (const project of fallbackProjects) {
    const href = `/projects/${project.slug}`
    const overview = joinLines([
      project.title,
      project.description,
      project.tag ? `Tag: ${project.tag}` : "",
      project.year ? `Year: ${project.year}` : "",
      project.role ? `Role: ${project.role}` : "",
      project.client ? `Client: ${project.client}` : "",
      project.tools?.length ? `Tools: ${project.tools.join(", ")}` : "",
      project.seo?.metaDescription ?? "",
    ])

    docs.push({
      id: `project-${project.slug}-overview`,
      source: `project/${project.slug}`,
      sourceLabel: project.title,
      text: overview,
      href,
    })

    const blockTexts = project.content
      .map(blockToText)
      .filter((text): text is string => Boolean(text?.trim()))

    if (blockTexts.length > 0) {
      docs.push({
        id: `project-${project.slug}-content`,
        source: `project/${project.slug}`,
        sourceLabel: `${project.title} — Case Study`,
        text: blockTexts.join("\n\n"),
        href,
      })
    }
  }

  return docs
}

function buildHeadlineDocuments(): CorpusDocument[] {
  return HERO_COPY.map((item, index) => ({
    id: `hero-copy-${index}`,
    source: "hero",
    sourceLabel: "Portfolio positioning",
    text: `${item.headline}\n${item.tagline}`,
    href: "/",
  }))
}

export function buildCorpusDocuments(): CorpusDocument[] {
  return [
    ...buildProfileDocuments(),
    ...buildProjectDocuments(),
    ...buildHeadlineDocuments(),
  ]
}

export function chunkDocuments(documents: CorpusDocument[]): CorpusChunk[] {
  const chunks: CorpusChunk[] = []

  for (const doc of documents) {
    const normalized = doc.text.trim()
    if (!normalized) continue

    let start = 0
    let chunkIndex = 0

    while (start < normalized.length) {
      const end = Math.min(normalized.length, start + CHUNK_SIZE)
      const slice = normalized.slice(start, end).trim()
      if (slice) {
        chunks.push({
          id: `${doc.id}-chunk-${chunkIndex}`,
          documentId: doc.id,
          source: doc.source,
          sourceLabel: doc.sourceLabel,
          text: slice,
          href: doc.href,
        })
        chunkIndex += 1
      }
      if (end === normalized.length) break
      start = Math.max(0, end - CHUNK_OVERLAP)
    }
  }

  return chunks
}
