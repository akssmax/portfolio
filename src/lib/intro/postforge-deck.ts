import type { VisualCaseStudyConfig } from "@/lib/projects/visual-case-study-configs"
import { getExperienceTagLabel } from "@/lib/experience-duration"
import { profile } from "@/lib/profile"
import type { ContentBlock, Project, RichTextBlock } from "@/lib/sanity/types"

import type { DeckData } from "./types"
import { buildJourneyTimeline } from "./journey-timeline"

function getSectionIndex(blocks: ContentBlock[], title: string): number {
  return blocks.findIndex(
    (block) => block._type === "sectionHeading" && block.title === title,
  )
}

function getRichTextAfterHeading(blocks: ContentBlock[], title: string): RichTextBlock | null {
  const index = getSectionIndex(blocks, title)
  if (index === -1) return null

  for (let i = index + 1; i < blocks.length; i++) {
    const block = blocks[i]
    if (block._type === "sectionHeading") break
    if (block._type === "richTextBlock") return block
  }

  return null
}

function getSectionSubtitle(blocks: ContentBlock[], title: string): string {
  const index = getSectionIndex(blocks, title)
  if (index === -1) return ""

  const block = blocks[index]
  if (block._type !== "sectionHeading") return ""
  return block.subtitle ?? ""
}

function portableTextToStrings(body: RichTextBlock["body"]): string[] {
  return body
    .map((block) => {
      if (!("children" in block) || !Array.isArray(block.children)) return ""
      return block.children
        .map((child) => ("text" in child ? child.text : ""))
        .join("")
    })
    .filter(Boolean)
}

function getParagraphsAfterHeading(blocks: ContentBlock[], title: string): string[] {
  const richText = getRichTextAfterHeading(blocks, title)
  if (!richText) return []
  return portableTextToStrings(richText.body)
}

function getFirstParagraphAfterHeading(blocks: ContentBlock[], title: string): string {
  return getParagraphsAfterHeading(blocks, title)[0] ?? ""
}

function getMetricsAfterHeading(blocks: ContentBlock[], title: string): DeckData["context"]["stats"] {
  const index = getSectionIndex(blocks, title)
  if (index === -1) return []

  for (let i = index + 1; i < blocks.length; i++) {
    const block = blocks[i]
    if (block._type === "sectionHeading") break
    if (block._type === "metrics") {
      return block.items.map(({ value, label }) => ({ value, label }))
    }
  }

  return []
}

const EDITOR_CALLOUTS = ["Brand kit", "Shuffle", "AI brief"]

function buildProfileSection(): Pick<DeckData, "aboutMe" | "experience" | "skills"> {
  const toolNames = profile.tools
    .slice(0, 8)
    .map((tool) => tool.name)

  return {
    aboutMe: {
      name: profile.name,
      title: profile.title,
      tagline: profile.tagline,
      bio: profile.bio,
      role: profile.role,
      company: profile.company,
      location: profile.location,
      experienceLabel: getExperienceTagLabel(),
      portraitSrc: profile.portrait.src,
      email: profile.contact.email,
      education: {
        degree: profile.education.degree,
        school: profile.education.school,
        years: profile.education.years,
      },
    },
    experience: buildJourneyTimeline(),
    skills: {
      design: profile.designSkills,
      engineering: profile.engineeringSkills,
      domains: profile.domainSkills,
      tools: toolNames,
    },
  }
}

export function buildPostforgeDeck(
  project: Project,
  visual: VisualCaseStudyConfig,
): DeckData {
  const { content } = project
  const editorGallery = visual.galleries[0]
  const libraryGallery = visual.galleries[1]
  const editorImage = editorGallery?.images[0]

  return {
    ...buildProfileSection(),
    projectIntro: {
      title: project.title,
      description: project.description,
      tag: project.tag,
      role: project.role ?? "Design Engineer",
      year: project.year ?? "",
      coverImageUrl: project.coverImageUrl ?? visual.heroImageSrc ?? "",
      metrics: project.metrics,
      stats: visual.stats,
      buildBadge: project.buildBadge,
    },
    context: {
      subtitle: getSectionSubtitle(content, "Context"),
      paragraphs: getParagraphsAfterHeading(content, "Context"),
      stats: getMetricsAfterHeading(content, "Context").length
        ? getMetricsAfterHeading(content, "Context")
        : visual.stats,
    },
    problem: {
      statement: getFirstParagraphAfterHeading(content, "The challenge"),
    },
    solution: {
      summary: getFirstParagraphAfterHeading(content, "What I shipped"),
      highlights: visual.highlights,
    },
    productEditor: {
      title: editorGallery?.title ?? "Design tool",
      description: editorGallery?.description ?? "",
      image: {
        src: editorImage?.src ?? "/projects/postforge/tool.webp",
        alt: editorImage?.alt ?? "Postforge design tool",
        label: editorImage?.label ?? "Editor",
        href: editorImage?.href ?? visual.liveUrl,
      },
      callouts: EDITOR_CALLOUTS,
    },
    productLibrary: {
      title: libraryGallery?.title ?? "Library & decks",
      description: libraryGallery?.description ?? "",
      images:
        libraryGallery?.images.map((image) => ({
          src: image.src,
          alt: image.alt,
          label: image.label,
          href: image.href,
        })) ?? [],
    },
    designDecisions: visual.designNotes,
    outcome: {
      statement: getFirstParagraphAfterHeading(content, "Outcome"),
      liveUrl: visual.liveUrl,
      ctaLabel: visual.ctaLabel ?? "Open live app",
      stats: visual.stats,
      stack: visual.stack,
    },
  }
}
