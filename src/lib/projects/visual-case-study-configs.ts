import type { Project } from "@/lib/sanity/types"
import { siteUrl } from "@/lib/site-url"

export type VisualCaseStudyGallery = {
  title: string
  description?: string
  images: Array<{ src: string; alt: string; label: string; href?: string }>
  layout?: "row" | "feature"
}

export type VisualCaseStudyConfig = {
  liveUrl: string
  ctaLabel?: string
  secondaryUrl?: string
  secondaryLabel?: string
  heroImageSrc?: string
  heroImageAlt?: string
  heroImageHref?: string
  stack: string[]
  highlights: string[]
  designNotes: string[]
  builtSummary: string
  footerNote: string
  stats: Array<{ value: string; label: string }>
  galleries: VisualCaseStudyGallery[]
}

export type VisualCaseStudyLayoutProps = VisualCaseStudyConfig & {
  project: Project
}

const DESIGN_WITH_AI_APP = "https://llm-daisyui-shell.vercel.app"

const DESIGN_WITH_AI: VisualCaseStudyConfig = {
  liveUrl: `${DESIGN_WITH_AI_APP}/`,
  ctaLabel: "Open live app",
  heroImageSrc: "/projects/chat-shell/hero.webp",
  heroImageAlt: "Design with AI — Design Studio",
  heroImageHref: `${DESIGN_WITH_AI_APP}/design`,
  stack: ["React", "TypeScript", "Tailwind", "Konva", "Zustand", "Mistral", "Vite"],
  stats: [
    { value: "10", label: "Days to ship" },
    { value: "5", label: "Core surfaces" },
    { value: "35", label: "Layout patterns" },
  ],
  builtSummary: "Five surfaces in one React shell — from streaming chat to generative canvas.",
  footerNote: "Personal experiment in AI workspace UX — shipped in ten days.",
  highlights: [
    "Mistral streaming chat with virtualized threads and starter prompts",
    "Persistent memory — global profile, preferences, and per-thread context",
    "Client-side knowledge upload for grounded answers without a backend",
    "Design Studio — resizable split chat + Konva canvas with export",
    "Multi-phase design agent with visible chain-of-thought",
    "UI Playground to theme chat patterns and preview viewports live",
  ],
  designNotes: [
    "360px chat column pinned across Design and Playground surfaces",
    "Layout intelligence scores LLM output against 35 catalogued patterns",
    "WCAG AA contrast and 8px grid enforced in agent prompts",
    "Solo personal build — design through deployment in ten days",
  ],
  galleries: [
    {
      title: "Workspace",
      description: "Chat, memory, and knowledge in one sidebar-driven shell.",
      layout: "row",
      images: [
        {
          src: "/projects/chat-shell/chat.webp",
          alt: "New Chat with starter prompts",
          label: "New Chat",
          href: `${DESIGN_WITH_AI_APP}/`,
        },
        {
          src: "/projects/chat-shell/memory.webp",
          alt: "Memory page with profile and thread context",
          label: "Memory",
          href: `${DESIGN_WITH_AI_APP}/memory`,
        },
        {
          src: "/projects/chat-shell/knowledge.webp",
          alt: "Knowledge upload for retrieval",
          label: "Knowledge",
          href: `${DESIGN_WITH_AI_APP}/knowledge`,
        },
      ],
    },
    {
      title: "Design Studio",
      description: "Conversational layout generation on a Konva canvas.",
      layout: "feature",
      images: [
        {
          src: "/projects/chat-shell/design-canvas.webp",
          alt: "Design Studio with canvas and page navigator",
          label: "Canvas workspace",
          href: `${DESIGN_WITH_AI_APP}/design`,
        },
      ],
    },
    {
      title: "Playground",
      description: "Live chat UI configurator for themes, avatars, and viewports.",
      layout: "feature",
      images: [
        {
          src: "/projects/chat-shell/playground.webp",
          alt: "Playground settings with live chat preview",
          label: "Live preview",
          href: `${DESIGN_WITH_AI_APP}/playground`,
        },
      ],
    },
  ],
}

const MARKETING_SITE = "https://100x.bot"

const AGENT_APP = "https://agent.akshaysaini.xyz"

const V1_100X_PROTO: VisualCaseStudyConfig = {
  liveUrl: `${AGENT_APP}/`,
  ctaLabel: "Open live app",
  secondaryUrl: "https://github.com/akssmax/V1-100x-Proto",
  secondaryLabel: "View on GitHub",
  heroImageSrc: "/projects/v1-100x-proto/hero.webp",
  heroImageAlt: "100x Agent Extension — multi-mode chat workspace",
  heroImageHref: `${AGENT_APP}/100x`,
  stack: [
    "React",
    "TypeScript",
    "Tailwind",
    "Framer Motion",
    "TanStack Table",
    "Zustand",
    "Neon",
    "Vite",
  ],
  stats: [
    { value: "8", label: "Core surfaces" },
    { value: "167", label: "React components" },
    { value: "40+", label: "Design system UI" },
  ],
  builtSummary:
    "Full agent extension shell — chat, workflows, data explorer, app generation, and onboarding in one React workspace.",
  footerNote:
    "V1 prototype for 100x.bot — shipped in two weeks with Neon auth and a documented 100X-UI design system.",
  highlights: [
    "Multi-mode AI chat with streaming responses, attachments, and thread-scoped file tracking",
    "Visual workflow builder with browser simulation and script compilation",
    "Data explorer — TanStack Table with AI filters, grouping, and D3/Perspective charts",
    "Natural-language app generation with sandboxed React/JSX preview",
    "Quick actions and interest-based personalization from onboarding tags",
    "100X-UI design system — 40+ components, semantic tokens, light/dark themes",
  ],
  designNotes: [
    "Mode-aware shell — chat, build, data, and app surfaces share navigation without context loss",
    "Semantic design tokens synced to the 100X-UI Figma system for light/dark parity",
    "Miller's Law in UI — dropdowns capped at seven items to reduce cognitive load",
    "Built with Cursor in two weeks as a design-engineering reference for 100x product direction",
  ],
  galleries: [
    {
      title: "Agent workspace",
      description: "Chat, home dashboard, and workflow automation surfaces.",
      layout: "row",
      images: [
        {
          src: "/projects/v1-100x-proto/chat.webp",
          alt: "Dashboard with chat input and productivity widgets",
          label: "Dashboard",
          href: `${AGENT_APP}/dashboard`,
        },
        {
          src: "/projects/v1-100x-proto/home.webp",
          alt: "Agent shell with quick actions and browser workspace",
          label: "Agent shell",
          href: `${AGENT_APP}/100x`,
        },
        {
          src: "/projects/v1-100x-proto/workflows.webp",
          alt: "Visual workflow builder with browser simulation",
          label: "Workflows",
          href: `${AGENT_APP}/workflows/1`,
        },
      ],
    },
    {
      title: "Data & app generation",
      description: "Interactive tables and sandboxed React output from natural language.",
      layout: "row",
      images: [
        {
          src: "/projects/v1-100x-proto/data.webp",
          alt: "Data explorer with saved workflow outputs",
          label: "Data explorer",
          href: `${AGENT_APP}/data-explorer`,
        },
        {
          src: "/projects/v1-100x-proto/apps.webp",
          alt: "Applets library with generated mini-apps",
          label: "Applets",
          href: `${AGENT_APP}/applets`,
        },
      ],
    },
    {
      title: "Design system",
      description: "100X-UI component catalog with semantic tokens and theme switching.",
      layout: "feature",
      images: [
        {
          src: "/projects/v1-100x-proto/design-system.webp",
          alt: "Design system components, tokens, and themes",
          label: "Component library",
          href: `${AGENT_APP}/design-system`,
        },
      ],
    },
  ],
}

const LANDING_PAGE_100X: VisualCaseStudyConfig = {
  liveUrl: `${MARKETING_SITE}/`,
  ctaLabel: "View live site",
  secondaryUrl: "https://100x-landing-page.vercel.app/",
  secondaryLabel: "Preview deployment",
  heroImageSrc: "/projects/100x/hero.webp",
  heroImageAlt: "100x.Bot marketing site — hero with scripted browser demo",
  stack: ["React", "TypeScript", "Tailwind", "Framer Motion", "Three.js", "shadcn/ui", "TipTap", "Vite"],
  stats: [
    { value: "13", label: "Homepage sections" },
    { value: "799", label: "Integrations" },
    { value: "5", label: "Compare pages" },
  ],
  builtSummary:
    "Full marketing surface — homepage, product pillars, growth pages, and compare funnels.",
  footerNote:
    "Live at 100x.bot — shipped Jan–Mar 2026 with Cursor alongside the founder.",
  highlights: [
    "Homepage with scripted hero demo, WebGL background, and YC trust signals",
    "Five product pillars — workflows, apps, Smart Tables, Page Boosters, multi-LLM",
    "Product deep-dives with repeatable label → headline → proof → mock → CTA anatomy",
    "799-entry integrations catalog with search and SEO use-case landing pages",
    "Five competitor compare pages plus pricing, deployment, and design system routes",
    "Motion system with scroll reveals and alternating editorial surfaces",
  ],
  designNotes: [
    "1200px grid with border rails for an editorial, print-inspired layout",
    "Scripted walkthrough engine — HTML product demos instead of static video embeds",
    "Alternating dark and light sections to pace a long scrolling homepage",
    "Built with Cursor in close collaboration with the 100x.Bot founder",
  ],
  galleries: [
    {
      title: "Product storytelling",
      description: "Homepage workflows plus apps and Smart Tables deep-dives.",
      layout: "row",
      images: [
        {
          src: "/projects/100x/workflows.webp",
          alt: "Workflows section — record in browser or chat to build",
          label: "Workflows",
          href: `${MARKETING_SITE}/`,
        },
        {
          src: "/projects/100x/apps.webp",
          alt: "Apps section — no-code builder mock",
          label: "Apps",
          href: `${MARKETING_SITE}/product/apps`,
        },
        {
          src: "/projects/100x/smart-tables.webp",
          alt: "Smart Tables section — local data engine in the browser",
          label: "Smart Tables",
          href: `${MARKETING_SITE}/product/tables`,
        },
      ],
    },
    {
      title: "Growth pages",
      description: "Integrations catalog, marketplace, and hackathon landing.",
      layout: "row",
      images: [
        {
          src: "/projects/100x/integrations.webp",
          alt: "Integrations catalog with searchable grid",
          label: "Integrations",
          href: `${MARKETING_SITE}/integrations`,
        },
        {
          src: "/projects/100x/marketplace.webp",
          alt: "Marketplace landing with jobs and creators",
          label: "Marketplace",
          href: `${MARKETING_SITE}/marketplace`,
        },
        {
          src: "/projects/100x/hackathon.webp",
          alt: "Hackathon event page",
          label: "Hackathon",
          href: `${MARKETING_SITE}/hackathon`,
        },
      ],
    },
  ],
}

const RUPEELENS_APP = "https://rupeelens-coral.vercel.app"

const RUPEELENS: VisualCaseStudyConfig = {
  liveUrl: `${RUPEELENS_APP}/`,
  ctaLabel: "Open live app",
  secondaryUrl: "https://github.com/akssmax/Rupeelens",
  secondaryLabel: "View on GitHub",
  heroImageSrc: "/projects/rupeelens/hero.webp",
  heroImageAlt: "RupeeLens — personal finance dashboard",
  heroImageHref: `${RUPEELENS_APP}/`,
  stack: [
    "React",
    "TypeScript",
    "TanStack Start",
    "Tailwind",
    "shadcn/ui",
    "Mistral",
    "IndexedDB",
    "Neon",
  ],
  stats: [
    { value: "8+", label: "Bank parsers" },
    { value: "Local", label: "First by default" },
    { value: "AI", label: "Categorize + chat" },
  ],
  builtSummary:
    "India-first statement finance — import CSV/Excel/PDF, categorize with rules + Mistral, explore spend in one shell.",
  footerNote:
    "Personal product — local-first privacy with an optional Neon cloud upgrade path.",
  highlights: [
    "Multi-bank statement import with Axis-first parsing and debit/credit fixes",
    "IndexedDB local ledger; optional Neon Auth migrates data on signup",
    "Hybrid categorization — Indian merchant rules plus Mistral for the long tail",
    "Dashboard with income/expense, categories, cashflow, and trends",
    "Subscriptions detection, credits/debits views, and CSV/PDF export",
    "RupeeLens AI side panel grounded in imported transactions",
  ],
  designNotes: [
    "Upload-first onboarding — no login wall before the first statement",
    "Teal Geist fintech shell with dense charts and a collapsible sidebar",
    "Background categorize jobs so import never blocks exploration",
    "Sources integrity — duplicates, overlaps, and row-count mismatches",
  ],
  galleries: [
    {
      title: "Overview",
      description: "Income, spend, categories, and weekly cashflow from an imported statement.",
      layout: "feature",
      images: [
        {
          src: "/projects/rupeelens/dashboard.webp",
          alt: "RupeeLens dashboard overview",
          label: "Dashboard",
          href: `${RUPEELENS_APP}/`,
        },
      ],
    },
    {
      title: "Ledger & spend",
      description: "Filterable transactions, spending charts, and recurring merchants.",
      layout: "row",
      images: [
        {
          src: "/projects/rupeelens/transactions.webp",
          alt: "Transactions table",
          label: "Transactions",
          href: `${RUPEELENS_APP}/transactions`,
        },
        {
          src: "/projects/rupeelens/spending.webp",
          alt: "Spending charts",
          label: "Spending",
          href: `${RUPEELENS_APP}/spending`,
        },
        {
          src: "/projects/rupeelens/subscriptions.webp",
          alt: "Subscriptions detection",
          label: "Subscriptions",
          href: `${RUPEELENS_APP}/subscriptions`,
        },
      ],
    },
    {
      title: "Money flow",
      description: "Credits vs debits and trend insights over the imported period.",
      layout: "row",
      images: [
        {
          src: "/projects/rupeelens/credits-debits.webp",
          alt: "Credits and debits views",
          label: "Credits / Debits",
          href: `${RUPEELENS_APP}/credits-debits`,
        },
        {
          src: "/projects/rupeelens/trends.webp",
          alt: "Trends tab with spend insights",
          label: "Trends",
          href: `${RUPEELENS_APP}/`,
        },
      ],
    },
  ],
}

const RESUME_BUILDER: VisualCaseStudyConfig = {
  liveUrl: siteUrl("/tools/resume"),
  ctaLabel: "Try the tool",
  secondaryUrl: siteUrl("/resume"),
  secondaryLabel: "Owner workspace",
  heroImageSrc: "/projects/resume-builder/hero.webp",
  heroImageAlt: "AI Resume Builder — customize layout and live PDF preview",
  heroImageHref: siteUrl("/tools/resume"),
  stack: [
    "React",
    "TypeScript",
    "TanStack Start",
    "Mistral",
    "Brave Search",
    "@react-pdf/renderer",
    "Tailwind",
  ],
  stats: [
    { value: "1", label: "PDF schema" },
    { value: "3 / 24h", label: "Public generation cap" },
    { value: "2", label: "Shared flows" },
  ],
  builtSummary:
    "Public AI import tool and password-protected owner workspace — one resume schema, one PDF pipeline.",
  footerNote:
    "Portfolio-native tool — Mistral structuring, Brave Search grounding, and client-side PDF export.",
  highlights: [
    "Public tool at /tools/resume — profile URL import with optional pasted summary fallback",
    "Brave Search gathers public snippets; Mistral maps results into structured ResumeDocument JSON",
    "Live HTML preview with layout, section, and brand-color controls before PDF download",
    "Owner workspace at /resume — password-protected editor seeded from portfolio profile data",
    "Shared @react-pdf/renderer pipeline for visitor and owner exports",
    "Rate limits — 3 public generations per IP per day to control API cost",
  ],
  designNotes: [
    "Split-panel editor — controls on the left, live resume preview on the right",
    "One document schema powers owner editing and visitor AI import flows",
    "Brand color ties into portfolio theme tokens for consistent PDF accents",
    "Disclosure banner sets expectations that AI output must be verified before use",
  ],
  galleries: [
    {
      title: "Public AI import",
      description: "LinkedIn, GitHub, Peerlist, or portfolio URL to structured resume PDF.",
      layout: "row",
      images: [
        {
          src: "/projects/resume-builder/wizard-input.webp",
          alt: "Public resume builder input — profile URL and optional summary",
          label: "Import step",
          href: siteUrl("/tools/resume"),
        },
        {
          src: "/projects/resume-builder/preview.webp",
          alt: "Customize layout, sections, and brand color with live preview",
          label: "Customize & preview",
          href: siteUrl("/tools/resume"),
        },
      ],
    },
    {
      title: "Owner workspace",
      description: "Private /resume editor for tailoring PDFs from seeded profile data.",
      layout: "feature",
      images: [
        {
          src: "/projects/resume-builder/owner.webp",
          alt: "Password-protected owner resume workspace with live preview",
          label: "Owner editor",
          href: siteUrl("/resume"),
        },
      ],
    },
  ],
}

const VISUAL_CASE_STUDY_CONFIGS: Record<string, VisualCaseStudyConfig> = {
  rupeelens: RUPEELENS,
  "100x-chat-shell": DESIGN_WITH_AI,
  "100x-landing-page": LANDING_PAGE_100X,
  "v1-100x-proto": V1_100X_PROTO,
  "resume-builder": RESUME_BUILDER,
}

export function getVisualCaseStudyConfig(slug: string): VisualCaseStudyConfig | null {
  return VISUAL_CASE_STUDY_CONFIGS[slug] ?? null
}

export function listVisualCaseStudyConfigs(): Array<{
  slug: string
  config: VisualCaseStudyConfig
}> {
  return Object.entries(VISUAL_CASE_STUDY_CONFIGS).map(([slug, config]) => ({
    slug,
    config,
  }))
}
