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
  { value: "2,000+", label: "Companies served by Kodo" },
  { value: "100K+", label: "Wallzy installs" },
  { value: "799", label: "100x.bot integrations" },
]

export const OFFICIAL_CORE_STRENGTHS: string[][] = [
  ["Product Strategy", "Design Systems", "Complex Workflows", "React UI"],
  ["Rapid Prototyping", "UX Research", "AI Product Design", "Design Engineering"],
]

export const OFFICIAL_PROJECTS: ResumeProjectItem[] = [
  {
    title: "RupeeLens - Personal Finance",
    url: "https://rupeelens-coral.vercel.app/",
    meta: "Personal project | Design Engineer | Jul 2026",
    description:
      "Built an India-first, local-first finance experience with 8+ bank parsers, CSV/Excel/PDF import, hybrid rules plus Mistral categorization, spending insights, subscription detection, and grounded AI chat.",
    stack:
      "React, TypeScript, TanStack Start, Tailwind, shadcn/ui, IndexedDB, Mistral, Neon",
  },
  {
    title: "Design with AI",
    url: "https://llm-daisyui-shell.vercel.app/",
    meta: "Personal project | Shipped in 10 days | May 2026",
    description:
      "Designed and deployed five connected AI surfaces — streaming chat, persistent memory, knowledge grounding, a conversational design canvas, and a live UI playground — using 35 catalogued layout patterns.",
    stack: "React, TypeScript, Tailwind, Konva, Zustand, Mistral, Vite",
  },
  {
    title: "100x.Bot Marketing Site",
    url: "https://100x.bot/",
    meta: "100x.bot | Design Engineer | Jan-Mar 2026",
    description:
      "Designed and built a YC-backed browser-automation marketing system with a scripted product demo, WebGL background, repeatable product storytelling, an integrations catalogue, and comparison funnels.",
    stack:
      "React, TypeScript, Tailwind, Framer Motion, Three.js, shadcn/ui, TipTap",
  },
  {
    title: "AI Resume Builder",
    url: "https://www.akshaysaini.xyz/tools/resume",
    meta: "Portfolio tool | Design Engineer | 2026",
    description:
      "Created a profile-to-PDF tool with AI-assisted public data import, structured resume JSON, live customization, and a shared PDF pipeline for public generation and a private owner workspace.",
    stack:
      "React, TypeScript, TanStack Start, Mistral, Brave Search, React PDF, Tailwind",
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
      "React UI, TypeScript workflows, Cursor, Antigravity, v0, shadcn/ui, Framer, Webflow, code-based prototyping and AI-assisted product development",
  },
  {
    label: "Research and Analytics",
    values:
      "Miro, FigJam, SurveyMonkey, Maze, Amplitude, Google Analytics, PostHog, usability testing and product discovery",
  },
  {
    label: "Creative and Operations",
    values:
      "Adobe Creative Suite, Jitter, video editing, UI animation, branding, investor presentations, Notion and cross-functional collaboration",
  },
]

/** First N roles are treated as professional experience; remainder as earlier experience. */
export const OFFICIAL_PROFESSIONAL_EXPERIENCE_COUNT = 4

/** Reference CV palette — header band and strengths grid surfaces. */
export const OFFICIAL_HEADER_BG = "#101828"
export const OFFICIAL_HEADER_NAME_COLOR = "#FFFFFF"
export const OFFICIAL_HEADER_TAGLINE_COLOR = "#E4E7EC"
export const OFFICIAL_HEADER_CONTACT_SEPARATOR = "#475467"
export const OFFICIAL_CONTACT_SEPARATOR_COLOR = "#1D2939"
export const OFFICIAL_STRENGTHS_SURFACE = "#E8F5F3"
export const OFFICIAL_STRENGTHS_DIVIDER = "#FFFFFF"
