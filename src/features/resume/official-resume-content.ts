import type {
  ResumeCapabilityGroup,
  ResumeCertificationItem,
  ResumeHighlightMetric,
  ResumeProjectItem,
} from "./types"

export const OFFICIAL_HEADER_TAGLINE =
  "Designing in Figma. Shipping production-ready React. Turning complex fintech, devtools, no-code, and agentic-AI workflows into clear product experiences."

export const OFFICIAL_PROFILE_TEXT =
  "Product Designer and Design Engineer with six years of experience delivering high-stakes digital products across enterprise fintech, developer tooling, no-code platforms, and agentic AI. Combines product thinking, UX research, scalable design systems, advanced prototyping, and hands-on React implementation to take ambiguous ideas from concept to production."

export const OFFICIAL_HIGHLIGHT_METRICS: ResumeHighlightMetric[] = [
  { value: "6 Years", label: "Design experience" },
  { value: "700+", label: "Design system components" },
  { value: "100K+", label: "Wallzy installs" },
  { value: "799", label: "100x.bot integrations" },
]

export const OFFICIAL_CORE_STRENGTHS: string[][] = [
  ["Product Strategy", "Design Systems", "Complex Workflows", "React UI"],
  ["Rapid Prototyping", "UX Research", "AI Product Design", "Design Engineering"],
]

export const OFFICIAL_PROJECTS: ResumeProjectItem[] = [
  {
    title: "Postforge - Social Media Post Design Tool",
    url: "https://postforge-kohl.vercel.app/",
    meta: "Freelance | Design Engineer | Jul 2026",
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
    title: "RupeeLens - Personal Finance",
    url: "https://rupeelens-coral.vercel.app/",
    meta: "Personal project | Design Engineer | Jul 2026",
    description:
      "Built an India-first, local-first finance experience with 8+ bank parsers, CSV/Excel/PDF import, hybrid rules plus Mistral categorization, spending insights, subscription detection, and grounded AI chat.",
    stack:
      "React, TypeScript, TanStack Start, Tailwind, shadcn/ui, IndexedDB, Mistral, Neon",
  },



]

export const OFFICIAL_EDUCATION = {
  degree: "B.Tech, Computer Science",
  school: "Guru Jambheshwar University of Science and Technology",
  years: "2014 – 2018",
  location: "Hisar, Haryana",
}

export const OFFICIAL_CERTIFICATIONS: ResumeCertificationItem[] = [
  {
    title: "UX Design Masterclass",
    issuer: "UXDMC",
    date: "Sep 2020",
    credentialId: "23119389",
  },
]

export const OFFICIAL_CAPABILITIES: ResumeCapabilityGroup[] = [
  {
    label: "Design",
    values:
      "Design systems and tokens, Figma variables, Auto Layout, advanced prototyping, responsive web and mobile UI, UX research, design sprints, wireframing, motion and interaction design",
  },
  {
    label: "Build and AI",
    values:
      "React UI, TypeScript workflows, Three.js, Codex, Claude, Cursor, Antigravity, v0, shadcn/ui, Framer, Webflow, code-based prototyping and AI-assisted product development",
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
