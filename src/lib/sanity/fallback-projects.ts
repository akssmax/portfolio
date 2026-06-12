import type { Project, ProjectCard } from "./types"

function textBlock(key: string, text: string) {
  return {
    _type: "block" as const,
    _key: key,
    style: "normal" as const,
    markDefs: [],
    children: [
      {
        _type: "span" as const,
        _key: `${key}-span`,
        marks: [] as string[],
        text,
      },
    ],
  }
}

function bulletList(key: string, items: string[]) {
  return items.map((text, index) => ({
    _type: "block" as const,
    _key: `${key}-${index}`,
    style: "normal" as const,
    listItem: "bullet" as const,
    level: 1,
    markDefs: [],
    children: [
      {
        _type: "span" as const,
        _key: `${key}-${index}-span`,
        marks: [] as string[],
        text,
      },
    ],
  }))
}

const TECH_STACK_ITEMS = [
  { name: "React", logoSrc: "/projects/100x/tech/react.svg" },
  { name: "TypeScript", logoSrc: "/projects/100x/tech/typescript.svg" },
  { name: "Vite", logoSrc: "/projects/100x/tech/vite.svg" },
  { name: "Tailwind CSS", logoSrc: "/projects/100x/tech/tailwindcss.svg" },
  { name: "Framer Motion", logoSrc: "/projects/100x/tech/framer.svg" },
  { name: "Three.js", logoSrc: "/projects/100x/tech/threejs.svg" },
  { name: "shadcn/ui", logoSrc: "/projects/100x/tech/shadcn.svg" },
  { name: "TipTap", logoSrc: "/projects/100x/tech/tiptap.svg" },
]

const CHAT_SHELL_TECH_STACK_ITEMS = [
  { name: "React", logoSrc: "/projects/chat-shell/tech/react.svg" },
  { name: "TypeScript", logoSrc: "/projects/chat-shell/tech/typescript.svg" },
  { name: "Vite", logoSrc: "/projects/chat-shell/tech/vite.svg" },
  { name: "Tailwind CSS", logoSrc: "/projects/chat-shell/tech/tailwindcss.svg" },
  { name: "shadcn/ui", logoSrc: "/projects/chat-shell/tech/shadcn.svg" },
  { name: "Konva", logoSrc: "/projects/chat-shell/tech/konva.svg" },
  { name: "Zustand", logoSrc: "/projects/chat-shell/tech/zustand.svg" },
  { name: "Mistral", logoSrc: "/projects/chat-shell/tech/mistral.svg" },
  { name: "Vercel", logoSrc: "/projects/chat-shell/tech/vercel.svg" },
]

export const fallbackProjects: Project[] = [
  {
    _id: "fallback-100x-landing-page",
    title: "100x.Bot Marketing Site",
    slug: "100x-landing-page",
    description:
      "YC-backed marketing site for a browser automation platform — designed and built with Cursor alongside the founder.",
    tag: "Product UI",
    featured: true,
    coverImageUrl: "/projects/100x/hero.webp",
    year: "Jan–Mar 2026",
    role: "Design Engineer",
    client: "100x.Bot",
    tools: ["Cursor"],
    publishedAt: "2026-03-01T00:00:00.000Z",
    seo: {
      metaTitle: "100x.Bot Marketing Site — Case Study",
      metaDescription:
        "How a complex browser automation product became a clear, conversion-focused marketing site — designed and built with Cursor alongside the 100x.Bot founder.",
    },
    content: [
      {
        _type: "sectionHeading",
        _key: "h-context",
        title: "Context",
        subtitle: "Design engineer on a YC-backed browser automation product.",
      },
      {
        _type: "richTextBlock",
        _key: "rt-context",
        body: [
          textBlock(
            "rt-context-1",
            "100x.Bot is a browser-native automation platform — workflows, Smart Tables, custom apps, Page Boosters, and multi-LLM routing — that turns everyday browser work into reusable automations.",
          ),
          {
            _type: "block" as const,
            _key: "rt-context-2",
            style: "normal" as const,
            markDefs: [],
            children: [
              {
                _type: "span" as const,
                _key: "rt-context-2-a",
                marks: [],
                text: "Designed and built with ",
              },
              {
                _type: "span" as const,
                _key: "rt-context-2-b",
                marks: ["strong"],
                text: "Cursor",
              },
              {
                _type: "span" as const,
                _key: "rt-context-2-c",
                marks: [],
                text: ", in close collaboration with the ",
              },
              {
                _type: "span" as const,
                _key: "rt-context-2-d",
                marks: ["strong"],
                text: "100x.Bot founder",
              },
              {
                _type: "span" as const,
                _key: "rt-context-2-e",
                marks: [],
                text: " — from homepage through product, pricing, and compare pages.",
              },
            ],
          },
        ],
      },
      {
        _type: "collaborators",
        _key: "collab",
        subtitle: "Built with Cursor in collaboration with the 100x.Bot team.",
        items: [
          {
            name: "Akshay Saini",
            role: "Design Engineer",
            initials: "AS",
          },
          {
            name: "Shardul",
            role: "Founder, 100x.Bot",
            initials: "S",
          },
        ],
      },
      {
        _type: "metrics",
        _key: "metrics",
        items: [
          { value: "13", label: "Homepage sections" },
          { value: "799", label: "Integrations catalog" },
          { value: "YC", label: "Backed startup" },
        ],
      },
      {
        _type: "sectionHeading",
        _key: "h-challenge",
        title: "The challenge",
      },
      {
        _type: "richTextBlock",
        _key: "rt-challenge",
        body: [
          textBlock(
            "rt-challenge-1",
            "100x is a dense B2B product with overlapping capabilities — browser workflows, data tables, no-code apps, page-level UI injection, and automatic LLM routing. The site had to explain value fast, build trust with technical buyers, and convert without feeling like a feature dump.",
          ),
        ],
      },
      {
        _type: "sectionHeading",
        _key: "h-shipped",
        title: "What I shipped",
      },
      {
        _type: "richTextBlock",
        _key: "rt-shipped",
        body: [
          textBlock(
            "rt-shipped-1",
            "A full marketing surface — not a single landing page — spanning product storytelling, growth pages, and internal design tooling.",
          ),
          ...bulletList("rt-shipped-b", [
            "Homepage with scripted hero demo and WebGL background",
            "Five product pillars: workflows, apps, tables, boosters, and multi-LLM",
            "Product deep-dives, pricing, five competitor compare pages, and integrations catalog",
            "Design system plus motion and scroll-reveal patterns across the site",
          ]),
        ],
      },
      {
        _type: "techStack",
        _key: "tech",
        items: TECH_STACK_ITEMS.map((item, index) => ({
          ...item,
          _key: `tech-${index}`,
        })),
      },
      {
        _type: "staticImage",
        _key: "img-hero",
        src: "/projects/100x/hero.webp",
        alt: "100x.Bot marketing site hero with scripted browser demo",
        caption: "Hero — YC badge, cycling headline, and interactive product demo",
        fullBleed: true,
      },
      {
        _type: "staticImageGallery",
        _key: "gallery-home",
        caption: "Product storytelling — homepage workflows plus apps and Smart Tables deep-dives",
        images: [
          {
            src: "/projects/100x/workflows.webp",
            alt: "Workflows section — record in browser or chat to build",
          },
          {
            src: "/projects/100x/apps.webp",
            alt: "Apps section — no-code builder mock",
          },
          {
            src: "/projects/100x/smart-tables.webp",
            alt: "Smart Tables section — local data engine in the browser",
          },
        ],
      },
      {
        _type: "sectionHeading",
        _key: "h-decisions",
        title: "Design decisions",
      },
      {
        _type: "richTextBlock",
        _key: "rt-decisions",
        body: bulletList("rt-decisions-b", [
          "Editorial 1200px grid with border rails and alternating surfaces",
          "Scripted hero product demo (not static screenshots) with pause and replay",
          "Repeatable section anatomy: label → headline → proof → visual mock → CTA",
        ]),
      },
      {
        _type: "sectionHeading",
        _key: "h-beyond",
        title: "Beyond the homepage",
      },
      {
        _type: "siteMap",
        _key: "sitemap",
        groups: [
          {
            title: "Product",
            description:
              "Deep-dive pages for each core capability — eight to ten sections per route with mocks, proof, and CTAs.",
            routes: [
              { path: "/product/workflows", label: "Workflows" },
              { path: "/product/apps", label: "Apps" },
              { path: "/product/tables", label: "Smart Tables" },
              { path: "/product/boosters", label: "Page Boosters" },
            ],
          },
          {
            title: "Integrations",
            description:
              "799-entry searchable catalog with individual integration pages and SEO use-case landing pages.",
            routes: [
              { path: "/integrations", label: "Catalog" },
              { path: "/integrations/slack", label: "Integration detail" },
              { path: "/integrations/u/lead-generation", label: "Use-case pages" },
            ],
          },
          {
            title: "Marketplace",
            description:
              "Creator profiles, job board, and TipTap-powered articles for the 100x community.",
            routes: [
              { path: "/marketplace", label: "Marketplace" },
              { path: "/creators", label: "Creators" },
              { path: "/articles", label: "Articles" },
            ],
          },
          {
            title: "Hackathon",
            description:
              "Event landing page for the Google Ads workflow hackathon with submission flow.",
            routes: [{ path: "/hackathon", label: "Hackathon" }],
          },
          {
            title: "Compare",
            description:
              "Five competitor positioning pages against Manus, Lovable, ChatGPT, Grok, and Merlin.",
            routes: [
              { path: "/compare/100x-vs-manus", label: "vs Manus" },
              { path: "/compare/100x-vs-lovable", label: "vs Lovable" },
              { path: "/compare/100x-vs-chatgpt", label: "vs ChatGPT" },
              { path: "/compare/100x-vs-grok", label: "vs Grok" },
              { path: "/compare/100x-vs-merlin", label: "vs Merlin" },
            ],
          },
          {
            title: "Company",
            description:
              "About, pricing, deployment modes, and an internal design system with theme picker.",
            routes: [
              { path: "/company/about", label: "About" },
              { path: "/pricing", label: "Pricing" },
              { path: "/platform/deployment", label: "Deployment" },
              { path: "/design-system", label: "Design system" },
            ],
          },
        ],
      },
      {
        _type: "staticImageGallery",
        _key: "gallery-extended",
        caption: "Growth pages — integrations catalog, marketplace, and hackathon",
        images: [
          {
            src: "/projects/100x/integrations.webp",
            alt: "Integrations catalog with searchable grid",
          },
          {
            src: "/projects/100x/marketplace.webp",
            alt: "Marketplace landing with jobs and creators",
          },
          {
            src: "/projects/100x/hackathon.webp",
            alt: "Hackathon event page",
          },
        ],
      },
      {
        _type: "quote",
        _key: "quote",
        text: "We switched to 100X and cut our sourcing time from hours to minutes. None of the other bots even come close.",
        attribution: "Gilfoyle, System Architect",
      },
      {
        _type: "sectionHeading",
        _key: "h-outcome",
        title: "Outcome",
      },
      {
        _type: "richTextBlock",
        _key: "rt-outcome",
        body: [
          textBlock(
            "rt-outcome-1",
            "The full marketing site is live at 100x.bot — shipped Jan–Mar 2026 through a Cursor-assisted design-engineering workflow with the founder. Every major route group, from product deep-dives to compare pages and the integrations catalog, is production-ready.",
          ),
        ],
      },
      {
        _type: "embed",
        _key: "embed",
        url: "https://100x.bot/",
        label: "View live site",
        embedType: "link",
      },
    ],
  },
  {
    _id: "fallback-100x-chat-shell",
    title: "100x Chat Shell",
    slug: "100x-chat-shell",
    description:
      "AI-native workspace combining Mistral streaming chat, persistent memory, knowledge retrieval, and a conversational design studio.",
    tag: "Product UI",
    featured: true,
    coverImageUrl: "/projects/chat-shell/hero.webp",
    year: "May 5–15, 2026",
    role: "Design Engineer",
    client: "100x",
    tools: ["Cursor", "Mistral"],
    publishedAt: "2026-05-15T00:00:00.000Z",
    seo: {
      metaTitle: "100x Chat Shell — Case Study",
      metaDescription:
        "How a full AI workspace shell — chat, memory, RAG, and generative design studio — was designed and built in ten days as a reference for AI product UX.",
    },
    content: [
      {
        _type: "sectionHeading",
        _key: "cs-h-context",
        title: "Context",
        subtitle: "Solo design-engineering build for the 100x product ecosystem.",
      },
      {
        _type: "richTextBlock",
        _key: "cs-rt-context",
        body: [
          textBlock(
            "cs-rt-context-1",
            "100x Chat Shell is a production-minded reference app for a modern AI assistant workspace — not just a chat box, but memory, document grounding, and visual output in one cohesive shell.",
          ),
          {
            _type: "block" as const,
            _key: "cs-rt-context-2",
            style: "normal" as const,
            markDefs: [],
            children: [
              {
                _type: "span" as const,
                _key: "cs-rt-context-2-a",
                marks: [],
                text: "Designed and built with ",
              },
              {
                _type: "span" as const,
                _key: "cs-rt-context-2-b",
                marks: ["strong"],
                text: "Cursor",
              },
              {
                _type: "span" as const,
                _key: "cs-rt-context-2-c",
                marks: [],
                text: " and ",
              },
              {
                _type: "span" as const,
                _key: "cs-rt-context-2-d",
                marks: ["strong"],
                text: "Mistral",
              },
              {
                _type: "span" as const,
                _key: "cs-rt-context-2-e",
                marks: [],
                text: " — companion to the 100x.Bot marketing site, focused on the application experience.",
              },
            ],
          },
        ],
      },
      {
        _type: "collaborators",
        _key: "cs-collab",
        subtitle: "Solo design-engineering build — product design through deployment.",
        items: [
          {
            name: "Akshay Saini",
            role: "Design Engineer",
            initials: "AS",
          },
        ],
      },
      {
        _type: "metrics",
        _key: "cs-metrics-top",
        items: [
          { value: "35", label: "Layout patterns" },
          { value: "20+", label: "Design agent phases" },
          { value: "10", label: "Days to ship" },
        ],
      },
      {
        _type: "sectionHeading",
        _key: "cs-h-challenge",
        title: "The challenge",
      },
      {
        _type: "richTextBlock",
        _key: "cs-rt-challenge",
        body: [
          textBlock(
            "cs-rt-challenge-1",
            "Credible AI products need more than streaming text — users expect persistent memory, grounded answers from their documents, and visual output like social carousels, pitch decks, and documents. Building all of that in one shell, with polished chat UX and a generative canvas, is a design and engineering problem at once.",
          ),
        ],
      },
      {
        _type: "sectionHeading",
        _key: "cs-h-shipped",
        title: "What I shipped",
      },
      {
        _type: "richTextBlock",
        _key: "cs-rt-shipped",
        body: [
          textBlock(
            "cs-rt-shipped-1",
            "A full AI workspace — five major surfaces plus a UI playground — spanning chat reliability, memory systems, and conversational design generation.",
          ),
          ...bulletList("cs-rt-shipped-b", [
            "New Chat — Mistral streaming with attachments, chain-of-thought, virtualized threads, and 40+ starter prompts",
            "Memory — global profile, preferences, and facts plus per-thread context with retrieval gating",
            "Knowledge — client-side RAG with chunked file upload and keyword search",
            "Design Studio — split chat + Konva canvas with 20+ agent phases, 35 layouts, and 25+ canvas formats",
            "Playground — live chat UI configurator for colors, avatars, reasoning, and viewport modes",
          ]),
        ],
      },
      {
        _type: "techStack",
        _key: "cs-tech",
        items: CHAT_SHELL_TECH_STACK_ITEMS.map((item, index) => ({
          ...item,
          _key: `cs-tech-${index}`,
        })),
      },
      {
        _type: "staticImage",
        _key: "cs-img-hero",
        src: "/projects/chat-shell/hero.webp",
        alt: "100x Chat Shell Design Studio with split chat panel and Konva canvas",
        caption: "Design Studio — conversational layout generation with resizable split panels",
        fullBleed: true,
      },
      {
        _type: "staticImageGallery",
        _key: "cs-gallery-workspace",
        caption: "Core workspace — streaming chat, memory, and knowledge retrieval",
        images: [
          {
            src: "/projects/chat-shell/chat.webp",
            alt: "New Chat with starter prompt chips and virtualized message list",
          },
          {
            src: "/projects/chat-shell/memory.webp",
            alt: "Memory page with global profile, preferences, and thread memory",
          },
          {
            src: "/projects/chat-shell/knowledge.webp",
            alt: "Knowledge page with file upload for retrieval sources",
          },
        ],
      },
      {
        _type: "sectionHeading",
        _key: "cs-h-decisions",
        title: "Design decisions",
      },
      {
        _type: "richTextBlock",
        _key: "cs-rt-decisions",
        body: bulletList("cs-rt-decisions-b", [
          "Resizable split panels — 360px chat column pattern across Design and Playground",
          "Multi-phase Design Agent with visible chain-of-thought from intent through critic validation",
          "Layout Intelligence — 35 catalogued patterns with fit scoring, region binding, and variant pipeline",
          "8px grid, WCAG AA contrast, and ≤3 dominant colors enforced in design agent prompts",
        ]),
      },
      {
        _type: "sectionHeading",
        _key: "cs-h-appmap",
        title: "App structure",
      },
      {
        _type: "siteMap",
        _key: "cs-sitemap",
        baseUrl: "https://llm-daisyui-shell.vercel.app",
        groups: [
          {
            title: "Workspace",
            description:
              "Sidebar navigation with collapsible icon mode, recents for chat and design sessions, and theme switching.",
            routes: [
              { path: "/new-chat", label: "New Chat" },
              { path: "/memory", label: "Memory" },
              { path: "/knowledge", label: "Knowledge" },
            ],
          },
          {
            title: "Design Studio",
            description:
              "Split chat + canvas layout with manual tools, remix layout, floating properties panel, and HTML/PDF export.",
            routes: [{ path: "/design", label: "Design" }],
          },
          {
            title: "Playground",
            description:
              "Live preview of chat UI patterns — colors, avatars, code themes, reasoning traces, and viewport sizing.",
            routes: [{ path: "/playground", label: "Playground" }],
          },
        ],
      },
      {
        _type: "staticImageGallery",
        _key: "cs-gallery-design",
        caption: "Design canvas and UI playground",
        images: [
          {
            src: "/projects/chat-shell/design-canvas.webp",
            alt: "Design Studio canvas with generated layout and page navigator",
          },
          {
            src: "/projects/chat-shell/playground.webp",
            alt: "Playground settings panel with live chat preview",
          },
        ],
      },
      {
        _type: "metrics",
        _key: "cs-metrics-build",
        items: [
          { value: "25+", label: "Canvas formats" },
          { value: "8", label: "Design token themes" },
          { value: "29", label: "Vitest suites" },
        ],
      },
      {
        _type: "sectionHeading",
        _key: "cs-h-outcome",
        title: "Outcome",
      },
      {
        _type: "richTextBlock",
        _key: "cs-rt-outcome",
        body: [
          textBlock(
            "cs-rt-outcome-1",
            "Shipped in ten days (May 5–15, 2026) as a reference implementation for AI workspace UX — from Mistral streaming and client-side RAG through a multi-agent design pipeline with export-ready canvas output. 29 Vitest suites cover the layout intelligence pipeline.",
          ),
        ],
      },
      {
        _type: "embed",
        _key: "cs-embed",
        url: "https://llm-daisyui-shell.vercel.app/",
        label: "View live site",
        embedType: "link",
      },
    ],
  },
]

export function toProjectCards(projects: Project[]): ProjectCard[] {
  return projects.map(({ content: _content, seo: _seo, ...card }) => card)
}

export function getFallbackProjectCards(): ProjectCard[] {
  return toProjectCards(fallbackProjects)
}

export function getFallbackFeaturedProjects(): ProjectCard[] {
  return toProjectCards(fallbackProjects.filter((project) => project.featured))
}

export function getFallbackProjectBySlug(slug: string): Project | null {
  return fallbackProjects.find((project) => project.slug === slug) ?? null
}
