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

export type DeckAssumption = {
  title: string
  detail: string
}

export type DeckBuildTool = {
  name: string
  role: string
  href?: string
  logoSrc?: string | string[]
}

export type DeckArchitectureLayer = {
  label: string
  items: string[]
}

export type DeckGap = {
  gap: string
  impact: string
}

export type DeckRoadmapHorizon = {
  label: string
  items: string[]
}

export type DeckCaseStudyCard = {
  slug: string
  title: string
  description: string
  tag: string
  coverImageUrl: string
  year?: string | null
  metrics?: string | null
  buildBadge?: "built-with-ai" | "pre-llm" | null
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
    otherCaseStudies: DeckCaseStudyCard[]
  }
  problem: {
    statement: string
    audience: string[]
    insight: {
      lead: string
      painPoints: string[]
      closing: string
    }
  }
  assumptions: {
    heading: string
    description: string
    items: DeckAssumption[]
  }
  architecture: {
    heading: string
    summary: string
    layers: DeckArchitectureLayer[]
    flow: string[]
    stack: string[]
    tools: DeckBuildTool[]
  }
  liveDemo: {
    heading: string
    description: string
    features: string[]
    screenshot: {
      src: string
      alt: string
    }
    previewUrl?: string
    liveUrl: string
    ctaLabel: string
    secondaryLiveUrl?: string
    secondaryCtaLabel?: string
  }
  learnings: {
    heading: string
    description: string
    items: string[]
  }
  gaps: {
    heading: string
    description: string
    items: DeckGap[]
  }
  roadmap: {
    heading: string
    description: string
    horizons: DeckRoadmapHorizon[]
    liveUrl: string
    ctaLabel: string
  }
  thankYou: {
    heading: string
    message: string
    name: string
    email: string
    linkedinUrl: string
  }
}

export type DeckSlideId =
  | "about-me"
  | "experience"
  | "skills"
  | "project-intro"
  | "problem"
  | "assumptions"
  | "architecture"
  | "live-demo"
  | "learnings"
  | "gaps"
  | "roadmap"
  | "thank-you"

export const DECK_SLIDE_IDS: DeckSlideId[] = [
  "about-me",
  "experience",
  // "skills",
  "project-intro",
  "problem",
  "assumptions",
  "architecture",
  "live-demo",
  "learnings",
  "gaps",
  "roadmap",
  "thank-you",
]

export type DeckGallery = VisualCaseStudyGallery
