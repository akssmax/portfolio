import type { VisualCaseStudyGallery } from "@/lib/projects/visual-case-study-configs"

export type DeckStat = {
  value: string
  label: string
}

export type DeckImage = {
  src: string
  alt: string
  label: string
  href?: string
}

export type DeckExperienceItem = {
  company: string
  role: string
  period: string
  location: string
  description: string
  highlights: string[]
  logoSrc?: string
  websiteUrl?: string
  startYear?: string
  duration?: string
  isCurrent?: boolean
}

export type DeckData = {
  aboutMe: {
    name: string
    title: string
    tagline: string
    bio: string
    role: string
    company: string
    location: string
    experienceLabel: string
    portraitSrc: string
    email: string
    education: {
      degree: string
      school: string
      years: string
    }
  }
  experience: {
    heading: string
    subtitle: string
    journeyStart: string
    items: DeckExperienceItem[]
  }
  skills: {
    design: string[]
    engineering: string[]
    domains: string[]
    tools: string[]
  }
  projectIntro: {
    title: string
    description: string
    tag: string
    role: string
    year: string
    coverImageUrl: string
    metrics?: string | null
    stats: DeckStat[]
    buildBadge?: "built-with-ai" | "pre-llm" | null
  }
  context: {
    subtitle: string
    paragraphs: string[]
    stats: DeckStat[]
  }
  problem: {
    statement: string
  }
  solution: {
    summary: string
    highlights: string[]
  }
  productEditor: {
    title: string
    description: string
    image: DeckImage
    callouts: string[]
  }
  productLibrary: {
    title: string
    description: string
    images: DeckImage[]
  }
  designDecisions: string[]
  outcome: {
    statement: string
    liveUrl: string
    ctaLabel: string
    stats: DeckStat[]
    stack: string[]
  }
}

export type DeckSlideId =
  | "about-me"
  | "experience"
  | "skills"
  | "project-intro"
  | "context"
  | "problem"
  | "solution"
  | "product-editor"
  | "product-library"
  | "design-decisions"
  | "outcome"

export const DECK_SLIDE_IDS: DeckSlideId[] = [
  "about-me",
  "experience",
  "skills",
  "project-intro",
  "context",
  "problem",
  "solution",
  "product-editor",
  "product-library",
  "design-decisions",
  "outcome",
]

export type DeckGallery = VisualCaseStudyGallery
