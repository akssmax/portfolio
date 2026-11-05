import type {
  ResumeCapabilityGroup,
  ResumeCertificationItem,
  ResumeDocument,
  ResumeHighlightMetric,
  ResumeLayoutId,
  ResumeProjectItem,
} from "./types"

/** Resume headline. The site-wide `profile.title` is unchanged. */
export const OFFICIAL_RESUME_TITLE = "Full Stack Designer"

/** Tagline for Signature and Official, the two main layouts. */
export const OFFICIAL_HEADER_TAGLINE =
  "AI-native product designer who ships: 0-to-1 products, from research to production code."

/**
 * Alternate taglines so each resume style reads a little differently. Applied
 * only while the summary still starts with the default tagline, so an edited
 * tagline is never overwritten.
 */
export const LAYOUT_TAGLINES: Partial<Record<ResumeLayoutId, string>> = {
  designer: "Designer who builds: AI-native, 0-to-1 products taken from user research to shipped code.",
  modern: "Designer who builds: AI-native, 0-to-1 products taken from user research to shipped code.",
  classic: "From first research to shipped product: AI-native design and code for 0-to-1 teams.",
  minimal: "From first research to shipped product: AI-native design and code for 0-to-1 teams.",
  executive: "From first research to shipped product: AI-native design and code for 0-to-1 teams.",
}

export function withLayoutTagline(document: ResumeDocument, layout: ResumeLayoutId): ResumeDocument {
  const tagline = LAYOUT_TAGLINES[layout]
  if (!tagline || !document.summary?.startsWith(OFFICIAL_HEADER_TAGLINE)) return document
  return {
    ...document,
    summary: tagline + document.summary.slice(OFFICIAL_HEADER_TAGLINE.length),
  }
}

export const OFFICIAL_PROFILE_TEXT =
  "Product designer with 6+ years designing web and mobile products end to end: research, interaction design, design systems, and detailed UX specs. Has worked with YC-backed teams in fintech, developer tools, no-code, and conversational AI, built six design systems, and partners closely with product, engineering, and content teams. Works in a lean UX loop: an AI-native workflow (Claude Code, Codex, Cursor) gets ideas prototyped in real code fast, then validated with users and analytics."

export const OFFICIAL_HIGHLIGHT_METRICS: Array<ResumeHighlightMetric> = [
  { value: "6 Years", label: "Design experience" },
  // Videobug, Unlogged, Tulr, two at Kodo, and one at 100x.bot.
  { value: "6", label: "Design systems built" },
  // Kodo (YC W21), Videobug/Unlogged and 100x.bot (YC S22).
  { value: "3", label: "YC-backed products" },
  // Fintech, developer tools, no-code, AI, creative tools, and food processing.
  { value: "6", label: "Industries worked in" },
]

export const OFFICIAL_CORE_STRENGTHS: Array<Array<string>> = [
  ["Product Strategy", "Design Systems", "Complex Workflows", "Design-to-Code"],
  ["Rapid Prototyping", "UX Research", "AI Product Design", "Design Engineering"],
]

export const OFFICIAL_PROJECTS: Array<ResumeProjectItem> = [
  {
    title: "Postforge - Social Media Post Design Tool",
    url: "https://postforge-kohl.vercel.app/",
    meta: "Personal project | Design Engineer | Jul 2026",
    description:
      "Designed and built a social media post design tool with brand kits, 20+ layouts, AI-assisted briefs, and a canvas for creating and exporting branded posts and slide decks.",
    stack: "Next.js, Mistral, Cursor",
  },
  {
    title: "Ion Workspace",
    url: "https://ion-workspace.vercel.app/",
    meta: "Freelance | Product Design & Engineering | Ongoing",
    description:
      "Designing and building a connected business workspace for email, calendars, contacts, and files, with mail search, keyboard shortcuts, event creation, and a public sample-data demo.",
    stack: "TanStack Start, React, TypeScript, JMAP",
  },
  {
    title: "Indus Best Mega Food Park",
    url: "https://www.indusbestmegafoodpark.com/",
    meta: "Freelance | Design Engineer | Live in production",
    description:
      "Redesigned and shipped a responsive food-processing campus website with facilities information, investor journeys, enquiry flows, and a private CMS for content and enquiry management.",
    stack: "TanStack Start, React, TypeScript, Tailwind CSS, shadcn/ui, Drizzle, Postgres",
  },
  {
    title: "Cue - Browser DJ Studio",
    url: "https://dj-app-kappa.vercel.app/",
    meta: "Personal project | Design Engineer | Oct 2026",
    description:
      "Designed and built a free, in-browser DJ studio with two decks, stems, an Automix that explains every transition, a live mixing coach, and on-device beat, key, and stem analysis.",
    stack:
      "React, TypeScript, TanStack Start, Tailwind, shadcn/ui, Web Audio, ONNX Runtime, IndexedDB",
  },



]

export const OFFICIAL_EDUCATION = {
  degree: "B.Tech, Computer Science",
  school: "Guru Jambheshwar University of Science and Technology",
  years: "2014 – 2018",
  location: "Hisar, Haryana",
}

export const OFFICIAL_CERTIFICATIONS: Array<ResumeCertificationItem> = [
  {
    title: "UX Design Masterclass",
    issuer: "UXDMC",
    date: "Sep 2020",
    credentialId: "23119389",
  },
]

export const OFFICIAL_CAPABILITIES: Array<ResumeCapabilityGroup> = [
  {
    label: "Design",
    values:
      "Design systems and tokens, Figma variables, Auto Layout, advanced prototyping, responsive web and mobile UI, UX research, design sprints, wireframing, motion and interaction design",
  },
  {
    label: "AI and build",
    values:
      "Claude, Claude Code, Codex, OpenCode, Cursor, Paper, v0, MCP, React, TypeScript, TanStack Start, shadcn/ui, Neon Postgres, Cloudflare, Vercel, Framer, Webflow, AI-assisted product development",
  },
  {
    label: "Research and Analytics",
    values:
      "Miro, FigJam, SurveyMonkey, Maze, Amplitude, Google Analytics, PostHog, usability testing and product discovery",
  },
  {
    label: "Creative and Operations",
    values:
      "Adobe Creative Suite, Blender, Jitter, video editing, UI animation, branding, investor presentations, Notion and cross-functional collaboration",
  },
]

/** Signature layout — AI-first toolkit, grouped the way the work actually happens. */
export const SIGNATURE_TOOLKIT: Array<ResumeCapabilityGroup> = [
  {
    label: "AI and agents",
    values: "Claude, Claude Code, Codex, OpenCode, Cursor, Paper, v0, MCP, Mistral, AI-assisted research and prototyping",
  },
  {
    label: "Design",
    values: "Figma (variables, Auto Layout, prototyping), FigJam, Framer, Jitter, design systems and tokens",
  },
  {
    label: "Build and ship",
    values: "React, TypeScript, TanStack Start, Next.js, Tailwind, shadcn/ui, Neon Postgres, Cloudflare, Vercel, Sanity",
  },
  {
    label: "Measure and learn",
    values: "PostHog, Amplitude, Google Analytics, Maze, usability testing, product discovery",
  },
]

/** First N roles are treated as professional experience; remainder as earlier experience. */
export const OFFICIAL_PROFESSIONAL_EXPERIENCE_COUNT = 5

/** Reference CV palette — header band and strengths grid surfaces. */
export const OFFICIAL_HEADER_BG = "#101828"
export const OFFICIAL_HEADER_NAME_COLOR = "#FFFFFF"
export const OFFICIAL_HEADER_TAGLINE_COLOR = "#E4E7EC"
export const OFFICIAL_HEADER_CONTACT_SEPARATOR = "#475467"
export const OFFICIAL_CONTACT_SEPARATOR_COLOR = "#1D2939"
export const OFFICIAL_STRENGTHS_SURFACE = "#E8F5F3"
export const OFFICIAL_STRENGTHS_DIVIDER = "#FFFFFF"
