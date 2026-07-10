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

const V1_100X_PROTO_TECH_STACK_ITEMS = [
  { name: "React", logoSrc: "/projects/v1-100x-proto/tech/react.svg" },
  { name: "Vite", logoSrc: "/projects/v1-100x-proto/tech/vite.svg" },
  { name: "Tailwind CSS", logoSrc: "/projects/v1-100x-proto/tech/tailwindcss.svg" },
  { name: "Framer Motion", logoSrc: "/projects/v1-100x-proto/tech/framer.svg" },
  { name: "TanStack Table", logoSrc: "/projects/v1-100x-proto/tech/react.svg" },
  { name: "Radix UI", logoSrc: "/projects/v1-100x-proto/tech/shadcn.svg" },
  { name: "TipTap", logoSrc: "/projects/v1-100x-proto/tech/tiptap.svg" },
  { name: "OpenRouter", logoSrc: "/projects/v1-100x-proto/tech/react.svg" },
  { name: "Vercel", logoSrc: "/projects/v1-100x-proto/tech/vercel.svg" },
]

const KODO_TECH_STACK_ITEMS = [
  { name: "Figma", logoSrc: "/projects/kodo/tech/figma.svg" },
  { name: "Framer", logoSrc: "/projects/kodo/tech/framer.svg" },
]

const TULR_TECH_STACK_ITEMS = [
  { name: "Figma", logoSrc: "/projects/tulr/tech/figma.svg" },
]

const UNLOGGED_TECH_STACK_ITEMS = [
  { name: "Figma", logoSrc: "/tools/figma.svg" },
  { name: "Webflow", logoSrc: "/tools/webflow.svg" },
  { name: "IntelliJ IDEA", logoSrc: "/companies/unlogged.svg" },
]

export const fallbackProjects: Project[] = [
  {
    _id: "fallback-100x-landing-page",
    title: "100x.Bot Marketing Site",
    slug: "100x-landing-page",
    description:
      "YC-backed marketing site for browser automation — designed and built with Cursor.",
    tag: "Product UI",
    featured: true,
    workSection: "recentProject",
    buildBadge: "built-with-ai",
    coverImageUrl: "/projects/100x/hero.webp",
    year: "Jan–Mar 2026",
    role: "Design Engineer",
    client: "100x.Bot",
    tools: ["Cursor"],
    publishedAt: "2026-06-10T00:00:00.000Z",
    metrics: "Live in < 1 week · Designed + built with Cursor alongside founder",
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
    title: "Design with AI",
    slug: "100x-chat-shell",
    description:
      "A personal AI workspace — streaming chat, memory, RAG, and a conversational design studio in one shell.",
    tag: "Product UI",
    featured: true,
    workSection: "recentProject",
    buildBadge: "built-with-ai",
    coverImageUrl: "/projects/chat-shell/hero.webp",
    year: "May 5–15, 2026",
    role: "Design Engineer",
    client: "Personal",
    tools: ["Cursor", "Mistral"],
    publishedAt: "2026-06-15T00:00:00.000Z",
    metrics: "Personal project · Shipped in 10 days",
    seo: {
      metaTitle: "Design with AI — Case Study",
      metaDescription:
        "How a personal AI workspace — chat, memory, RAG, and generative design studio — was designed and built in ten days as a reference for AI product UX.",
    },
    content: [
      {
        _type: "sectionHeading",
        _key: "cs-h-context",
        title: "Context",
        subtitle: "Solo personal build exploring AI-native product UX.",
      },
      {
        _type: "richTextBlock",
        _key: "cs-rt-context",
        body: [
          textBlock(
            "cs-rt-context-1",
            "Design with AI is a personal reference app for a modern AI assistant workspace — not just a chat box, but memory, document grounding, and visual output in one cohesive shell.",
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
                text: " as a self-initiated experiment in design-engineering — focused on what a credible AI workspace feels like end to end.",
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
        alt: "Design with AI — Design Studio with split chat panel and Konva canvas",
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
        _key: "cs-h-agent",
        title: "Design agent pipeline",
        subtitle: "Multi-phase orchestration from intent to export-ready canvas.",
      },
      {
        _type: "richTextBlock",
        _key: "cs-rt-agent",
        body: [
          textBlock(
            "cs-rt-agent-1",
            "The Design Studio runs a visible multi-phase agent — not a black-box generate button. Each phase streams chain-of-thought so you can see intent parsing, layout selection, typography passes, color passes, and critic validation before anything lands on the Konva canvas.",
          ),
          ...bulletList("cs-rt-agent-b", [
            "20+ orchestrated phases — composition planning, region binding, typography engine, spacing pass, and design critic loop",
            "Layout Intelligence catalog with 35 responsive patterns and fit scoring to map LLM output to real viewports",
            "Design principles baked into prompts — 8px grid, WCAG AA contrast, ≤3 dominant colors, and platform-specific recipes (LinkedIn carousel, slide decks, social posts)",
            "Continue flow when output hits token or time limits — partial JSON recovery and user-triggered resume",
          ]),
        ],
      },
      {
        _type: "sectionHeading",
        _key: "cs-h-canvas",
        title: "Canvas & export tooling",
      },
      {
        _type: "richTextBlock",
        _key: "cs-rt-canvas",
        body: [
          textBlock(
            "cs-rt-canvas-1",
            "The right panel is a full design surface — not a static preview. Manual tools, remix layout, floating properties, layers control, and multi-page navigation sit alongside AI generation.",
          ),
          ...bulletList("cs-rt-canvas-b", [
            "25+ canvas formats — mobile, Instagram, banner, slide, document, and carousel aspect ratios",
            "Konva stage with Lucide icon rendering, pattern fills, and agent silhouette placeholders",
            "HTML, PDF, and SVG export from generated layouts; resizable 360px chat column pinned across Design and Playground",
            "Playground sandbox for live chat UI theming — avatars, code themes, reasoning traces, and viewport sizing",
          ]),
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
            "Shipped in ten days (May 5–15, 2026) as a personal reference implementation for AI workspace UX — from Mistral streaming and client-side RAG through a multi-agent design pipeline with export-ready canvas output. 29 Vitest suites cover the layout intelligence pipeline.",
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
  {
    _id: "fallback-resume-builder",
    title: "Resume Builder",
    slug: "resume-builder",
    description:
      "AI resume builder — public profile import and a private owner workspace sharing one PDF pipeline.",
    tag: "Product UI / Tool",
    featured: true,
    workSection: "recentProject",
    buildBadge: "built-with-ai",
    coverImageUrl: "/projects/resume-builder/hero.webp",
    year: "2026",
    role: "Design Engineer",
    client: "Portfolio",
    tools: ["Mistral", "Brave Search", "@react-pdf/renderer", "TanStack Start"],
    publishedAt: "2026-06-01T00:00:00.000Z",
    metrics: "Public tool · 3 generations/day · Shared PDF schema",
    seo: {
      metaTitle: "Resume Builder — Case Study",
      metaDescription:
        "How a password-protected owner workspace and public AI LinkedIn import flow share one PDF pipeline, Mistral tool calls, and Brave Search web search.",
    },
    content: [
      {
        _type: "sectionHeading",
        _key: "rb-h-problem",
        title: "Problem",
      },
      {
        _type: "richTextBlock",
        _key: "rb-rt-problem",
        body: [
          textBlock(
            "rb-rt-problem-1",
            "Visitors wanted a tangible demo of the AI tooling behind the portfolio — not just chat, but a workflow that produces a downloadable artifact. The owner path also needed a fast way to tailor PDF resumes without rebuilding layouts each time.",
          ),
        ],
      },
      {
        _type: "sectionHeading",
        _key: "rb-h-shipped",
        title: "What I shipped",
      },
      {
        _type: "richTextBlock",
        _key: "rb-rt-shipped",
        body: bulletList("rb-shipped", [
          "Owner workspace at /resume — password-protected, seeded from static profile data, live HTML preview, client-side PDF via @react-pdf/renderer.",
          "Public tool at /tools/resume — LinkedIn URL plus optional pasted summary, Brave Search, Mistral tool loop, structured ResumeDocument JSON, same PDF pipeline.",
          "Portfolio chat web_search tool — shared Mistral tool executor and Brave Search client for grounded answers about external companies and current events.",
          "Work section case study with Try it CTA and rate limits (3 resume generations / 24h per IP).",
        ]),
      },
      {
        _type: "sectionHeading",
        _key: "rb-h-stack",
        title: "Stack",
      },
      {
        _type: "techStack",
        _key: "rb-tech",
        items: [
          { name: "Mistral", logoSrc: "/projects/chat-shell/tech/mistral.svg" },
          { name: "React", logoSrc: "/projects/100x/tech/react.svg" },
          { name: "TypeScript", logoSrc: "/projects/100x/tech/typescript.svg" },
          { name: "TanStack Start", logoSrc: "/projects/100x/tech/vite.svg" },
        ],
      },
      {
        _type: "sectionHeading",
        _key: "rb-h-outcome",
        title: "Outcome",
      },
      {
        _type: "richTextBlock",
        _key: "rb-rt-outcome",
        body: [
          textBlock(
            "rb-rt-outcome-1",
            "One resume document schema powers owner and visitor flows. Web search runs via the Brave Search API with per-IP rate limits and a capped number of tool calls per request to control cost and abuse.",
          ),
        ],
      },
    ],
  },
  {
    _id: "fallback-v1-100x-proto",
    title: "100x Agent Extension",
    slug: "v1-100x-proto",
    description:
      "V1 agent extension prototype — chat, workflows, data explorer, and app generation in one shell.",
    tag: "Product UI",
    featured: true,
    workSection: "recentProject",
    buildBadge: "built-with-ai",
    coverImageUrl: "/projects/v1-100x-proto/hero.webp",
    year: "Jun 2026",
    role: "Design Engineer",
    client: "100x.bot",
    tools: ["Cursor", "Figma"],
    publishedAt: "2026-06-12T00:00:00.000Z",
    metrics: "2-week prototype · 8 core surfaces · Built with Cursor",
    seo: {
      metaTitle: "100x Agent Extension — Case Study",
      metaDescription:
        "How a V1 agent extension prototype unified chat, workflows, data tables, app generation, and onboarding into one AI productivity shell for 100x.bot.",
    },
    content: [
      {
        _type: "sectionHeading",
        _key: "proto-h-context",
        title: "Context",
        subtitle: "V1 product prototype for the 100x agent extension ecosystem.",
      },
      {
        _type: "richTextBlock",
        _key: "proto-rt-context",
        body: [
          textBlock(
            "proto-rt-context-1",
            "100x Agent Extension is a comprehensive React prototype for an AI-powered productivity platform — chat with intelligent mode switching, workflow automation, interactive data exploration, and natural-language app generation in one shell.",
          ),
          {
            _type: "block" as const,
            _key: "proto-rt-context-2",
            style: "normal" as const,
            markDefs: [],
            children: [
              {
                _type: "span" as const,
                _key: "proto-rt-context-2-a",
                marks: [],
                text: "Built from the ",
              },
              {
                _type: "span" as const,
                _key: "proto-rt-context-2-b",
                marks: ["strong"],
                text: "100X-UI Figma system",
              },
              {
                _type: "span" as const,
                _key: "proto-rt-context-2-c",
                marks: [],
                text: " with semantic design tokens, deployed to Vercel with Neon-backed auth and a full API layer for chat, memory, workflows, and data sources.",
              },
            ],
          },
        ],
      },
      {
        _type: "collaborators",
        _key: "proto-collab",
        subtitle: "Design-engineering prototype aligned to 100x product direction.",
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
        _key: "proto-metrics",
        items: [
          { value: "40+", label: "Design system components" },
          { value: "167", label: "React components" },
          { value: "8", label: "Core product surfaces" },
        ],
      },
      {
        _type: "sectionHeading",
        _key: "proto-h-challenge",
        title: "The challenge",
      },
      {
        _type: "richTextBlock",
        _key: "proto-rt-challenge",
        body: [
          textBlock(
            "proto-rt-challenge-1",
            "Agent products need more than a chat box — users expect workflows, data tables, generated apps, memory, and quick actions in one coherent experience. The prototype had to validate mode switching, onboarding, personalization, and production-minded patterns before the full 100x platform shipped.",
          ),
        ],
      },
      {
        _type: "sectionHeading",
        _key: "proto-h-shipped",
        title: "What I shipped",
      },
      {
        _type: "richTextBlock",
        _key: "proto-rt-shipped",
        body: [
          textBlock(
            "proto-rt-shipped-1",
            "A full agent extension shell spanning chat reliability, automation, data exploration, and generative output — not isolated demos.",
          ),
          ...bulletList("proto-rt-shipped-b", [
            "AI chat — multi-mode agent with streaming LLM responses, attachments, and chat-scoped file tracking",
            "Workflow builder — visual workflow creation, browser, and build mode for automation",
            "Data explorer — TanStack Table views with AI-powered configuration, filters, grouping, and D3/Perspective visualizations",
            "App generation — React/JSX apps from natural language with sandbox preview and dynamic rendering",
            "Quick actions — categorized one-click prompts with interest-based personalization",
            "Onboarding — welcome, OTP verification, and interest selection curating the workspace",
            "Memory & history — persistent context, notes, todos, and thread management",
            "Design system — 40+ components, semantic tokens, and light/dark themes",
          ]),
        ],
      },
      {
        _type: "techStack",
        _key: "proto-tech",
        items: V1_100X_PROTO_TECH_STACK_ITEMS.map((item, index) => ({
          ...item,
          _key: `proto-tech-${index}`,
        })),
      },
      {
        _type: "staticImage",
        _key: "proto-img-hero",
        src: "/projects/v1-100x-proto/hero.webp",
        alt: "100x Agent Extension design system overview with tokens and component catalog",
        caption: "Design system — semantic tokens, 40+ components, and theme switching",
        fullBleed: true,
      },
      {
        _type: "staticImageGallery",
        _key: "proto-gallery",
        caption: "Component library and product shell patterns",
        images: [
          {
            src: "/projects/v1-100x-proto/design-system.webp",
            alt: "Design system components page with buttons, inputs, and cards",
          },
          {
            src: "/projects/v1-100x-proto/hero.webp",
            alt: "Design system overview with components, tokens, and themes",
          },
        ],
      },
      {
        _type: "sectionHeading",
        _key: "proto-h-decisions",
        title: "Design decisions",
      },
      {
        _type: "richTextBlock",
        _key: "proto-rt-decisions",
        body: bulletList("proto-rt-decisions-b", [
          "Mode-aware agent shell — chat, build, data, and app surfaces share navigation without context loss",
          "Semantic design tokens — CSS variables for theme compatibility across light and dark modes",
          "Miller's Law in UI — dropdowns capped at seven items to reduce cognitive load",
          "Figma-to-code traceability — components reference Figma node IDs for design-dev alignment",
        ]),
      },
      {
        _type: "sectionHeading",
        _key: "proto-h-outcome",
        title: "Outcome",
      },
      {
        _type: "richTextBlock",
        _key: "proto-rt-outcome",
        body: [
          textBlock(
            "proto-rt-outcome-1",
            "The V1 prototype validates the 100x agent extension UX end to end — from onboarding and personalization through chat, workflows, data tables, and app generation. It ships as an open reference implementation with Neon auth, Vercel serverless APIs, and a documented design system.",
          ),
        ],
      },
      {
        _type: "embed",
        _key: "proto-embed-live",
        url: "https://agent.akshaysaini.xyz/",
        label: "View live prototype",
        embedType: "link",
      },
      {
        _type: "embed",
        _key: "proto-embed-github",
        url: "https://github.com/akssmax/V1-100x-Proto",
        label: "View on GitHub",
        embedType: "link",
      },
    ],
  },
  {
    _id: "fallback-kodo",
    title: "Kodo — Intake-to-Pay Platform",
    slug: "kodo",
    description:
      "YC W21 enterprise fintech marketing site and product UI for procure-to-pay — designed in Figma, built in Framer, and shipped across AP, payments, cards, and reimbursements.",
    tag: "Enterprise Fintech",
    featured: true,
    workSection: "caseStudy",
    buildBadge: "pre-llm",
    coverImageUrl: "/projects/kodo/hero.webp",
    year: "Feb 2024 – Nov 2025",
    role: "Senior Product Designer",
    client: "Kodo",
    tools: ["Figma", "Framer"],
    publishedAt: "2025-11-01T00:00:00.000Z",
    metrics: "Led design solo · 4 enterprise modules shipped · 1 yr 9 months",
    seo: {
      metaTitle: "Kodo — Intake-to-Pay Platform — Case Study",
      metaDescription:
        "How a YC W21 enterprise procure-to-pay fintech got a full marketing site in Framer and end-to-end product design across AP automation, vendor payouts, corporate cards, and reimbursements.",
    },
    content: [
      {
        _type: "sectionHeading",
        _key: "k-h-context",
        title: "Context",
        subtitle: "Product design lead on a YC W21 enterprise intake-to-pay fintech platform.",
      },
      {
        _type: "richTextBlock",
        _key: "k-rt-context",
        body: [
          textBlock(
            "k-rt-context-1",
            "Kodo is a Y Combinator W21 intake-to-pay platform for businesses of all sizes — accounts payable automation, vendor payouts, corporate cards, and reimbursements — trusted by more than 2,000 companies.",
          ),
          {
            _type: "block" as const,
            _key: "k-rt-context-2",
            style: "normal" as const,
            markDefs: [],
            children: [
              {
                _type: "span" as const,
                _key: "k-rt-context-2-a",
                marks: [],
                text: "I led product design across complex finance and compliance workflows, and designed and developed the marketing site in ",
              },
              {
                _type: "span" as const,
                _key: "k-rt-context-2-b",
                marks: ["strong"],
                text: "Framer",
              },
              {
                _type: "span" as const,
                _key: "k-rt-context-2-c",
                marks: [],
                text: " from ",
              },
              {
                _type: "span" as const,
                _key: "k-rt-context-2-d",
                marks: ["strong"],
                text: "Figma",
              },
              {
                _type: "span" as const,
                _key: "k-rt-context-2-e",
                marks: [],
                text: " — from homepage through product storytelling and conversion flows.",
              },
            ],
          },
        ],
      },
      {
        _type: "collaborators",
        _key: "k-collab",
        subtitle: "Solo design lead — product UI and marketing site end to end.",
        items: [
          {
            name: "Akshay Saini",
            role: "Senior Product Designer",
            initials: "AS",
          },
        ],
      },
      {
        _type: "metrics",
        _key: "k-metrics",
        items: [
          { value: "2000+", label: "Companies on platform" },
          { value: "4", label: "Product lines" },
          { value: "21", label: "Months in role" },
        ],
      },
      {
        _type: "sectionHeading",
        _key: "k-h-challenge",
        title: "The challenge",
      },
      {
        _type: "richTextBlock",
        _key: "k-rt-challenge",
        body: [
          textBlock(
            "k-rt-challenge-1",
            "Enterprise procure-to-pay products operate under strict policy, compliance, and approval constraints — every flow must feel intuitive while encoding maker-checker rules, nested workflows, and ERP integrations. At the same time, the marketing site had to explain dense fintech value to startups, mid-market teams, and enterprise buyers without feeling like a feature dump.",
          ),
        ],
      },
      {
        _type: "sectionHeading",
        _key: "k-h-marketing",
        title: "Marketing site",
        subtitle: "Designed in Figma, built and shipped in Framer.",
      },
      {
        _type: "richTextBlock",
        _key: "k-rt-marketing",
        body: [
          textBlock(
            "k-rt-marketing-1",
            "The public site at kodo.com tells the full platform story — hero messaging, four product pillars, segment-based positioning, and deep feature sections for workflows, integrations, and collaboration.",
          ),
          ...bulletList("k-rt-marketing-b", [
            "Animated hero with cycling headline and dual CTAs (Talk to Sales, Book a Demo)",
            "Product cards for AP automation, vendor payments, corporate cards, and reimbursements",
            "Startup, mid-market, and enterprise segment tiers with tailored value props",
            "Feature deep-dives: dynamic workflows, ERP integrations, and team collaboration",
            "Customer testimonials carousel and featured blog content",
          ]),
        ],
      },
      {
        _type: "techStack",
        _key: "k-tech",
        items: KODO_TECH_STACK_ITEMS.map((item, index) => ({
          ...item,
          _key: `k-tech-${index}`,
        })),
      },
      {
        _type: "staticImage",
        _key: "k-img-hero",
        src: "/projects/kodo/hero.webp",
        alt: "Kodo marketing site hero — Spend Smarter, Grow Stronger, Scale Faster",
        caption: "Hero — cycling headline animation with product positioning and CTAs",
        fullBleed: true,
      },
      {
        _type: "staticImageGallery",
        _key: "k-gallery-marketing",
        caption: "Marketing site — product pillars, workflows, and platform features",
        images: [
          {
            src: "/projects/kodo/products.webp",
            alt: "Product cards for AP, vendor payments, corporate cards, and reimbursements",
          },
          {
            src: "/projects/kodo/workflows.webp",
            alt: "Dynamic Workflows feature section with maker-checker approval UI",
          },
          {
            src: "/projects/kodo/integrations.webp",
            alt: "Robust Integrations section with ERP and bank partners",
          },
        ],
      },
      {
        _type: "staticImageGallery",
        _key: "k-gallery-marketing-2",
        caption: "Collaboration, segment tiers, and social proof",
        images: [
          {
            src: "/projects/kodo/collaboration.webp",
            alt: "Seamless Collaboration section with threaded comments",
          },
          {
            src: "/projects/kodo/segments.webp",
            alt: "Startup, mid-market, and enterprise segment positioning",
          },
        ],
      },
      {
        _type: "sectionHeading",
        _key: "k-h-product",
        title: "Product design",
        subtitle: "End-to-end UI across the intake-to-pay platform.",
      },
      {
        _type: "richTextBlock",
        _key: "k-rt-product",
        body: [
          textBlock(
            "k-rt-product-1",
            "Beyond the marketing site, I owned product design across the full Kodo platform — translating finance and compliance requirements into workflows teams could trust and adopt at scale.",
          ),
          ...bulletList("k-rt-product-b", [
            "Accounts Payable Agent — automated invoice processing with speed and accuracy",
            "Vendor Payments — flexible payout flows with real-time controls",
            "Corporate Cards — expense limits, approvals, and on-the-go insights",
            "Reimbursements — policy enforcement with configurable approval chains",
            "Dynamic maker-checker workflows with nested approver levels",
            "ERP integrations with Zoho, Tally, Oracle, and SAP plus mailbox and WhatsApp intake",
          ]),
        ],
      },
      {
        _type: "staticImageGallery",
        _key: "k-gallery-product",
        caption: "In-app product UI — AP, payments, cards, and reimbursements",
        images: [
          {
            src: "/projects/kodo/product/ap-invoices.webp",
            alt: "Accounts Payable invoice processing interface",
          },
          {
            src: "/projects/kodo/product/vendor-payments.webp",
            alt: "Vendor payments dashboard with payout controls",
          },
          {
            src: "/projects/kodo/product/corporate-cards.webp",
            alt: "Corporate cards expense management view",
          },
          {
            src: "/projects/kodo/product/reimbursements.webp",
            alt: "Reimbursements flow with policy enforcement",
          },
        ],
      },
      {
        _type: "sectionHeading",
        _key: "k-h-decisions",
        title: "Design decisions",
      },
      {
        _type: "richTextBlock",
        _key: "k-rt-decisions",
        body: bulletList("k-rt-decisions-b", [
          "Segment-based messaging — startup, mid-market, and enterprise tiers with distinct value props on the marketing site",
          "Workflow visualization for compliance — maker-checker and nested approver patterns surfaced clearly in product UI",
          "Marketing and product visual consistency — shared typography, color, and component language from Figma through Framer to the app",
        ]),
      },
      {
        _type: "sectionHeading",
        _key: "k-h-sitemap",
        title: "Site structure",
      },
      {
        _type: "siteMap",
        _key: "k-sitemap",
        baseUrl: "https://kodo.com",
        groups: [
          {
            title: "Products",
            description:
              "Four core product lines — AP automation, vendor payouts, corporate cards, and reimbursements.",
            routes: [
              { path: "/products/invoices", label: "Invoices (AP)" },
              { path: "/products/vendor-payments", label: "Vendor Payments" },
              { path: "/products/corporate-cards", label: "Corporate Cards" },
              { path: "/products/reimbursements", label: "Reimbursements" },
            ],
          },
          {
            title: "Platform",
            description:
              "Workflow automation, ERP integrations, and team collaboration features.",
            routes: [
              { path: "/platform/integrations", label: "Integrations" },
              { path: "/platform/workflows", label: "Workflows" },
              { path: "/platform/collaboration", label: "Collaboration" },
            ],
          },
          {
            title: "Company",
            description: "About, blog, careers, and contact.",
            routes: [
              { path: "/about", label: "About Us" },
              { path: "/blog", label: "Blog" },
              { path: "/careers", label: "Careers" },
            ],
          },
        ],
      },
      {
        _type: "quote",
        _key: "k-quote",
        text: "Kodo's intuitive UX/UI has streamlined expense management, enabling 10,000+ seamless transactions monthly — far surpassing our previous tool.",
        attribution: "Karthik, Finance Ops Manager",
      },
      {
        _type: "sectionHeading",
        _key: "k-h-outcome",
        title: "Outcome",
      },
      {
        _type: "richTextBlock",
        _key: "k-rt-outcome",
        body: [
          textBlock(
            "k-rt-outcome-1",
            "Over 21 months at Kodo, a YC W21 company, I led design across the full intake-to-pay platform and shipped the marketing site at kodo.com — from Figma exploration through Framer production. The site is live and converting enterprise fintech buyers while the product serves 2,000+ companies with AP automation, payments, cards, and reimbursements.",
          ),
        ],
      },
      {
        _type: "embed",
        _key: "k-embed",
        url: "https://www.kodo.com/",
        label: "View live site",
        embedType: "link",
      },
    ],
  },
  {
    _id: "fallback-unlogged",
    title: "Unlogged — Java DevTools Plugin",
    slug: "unlogged",
    description:
      "YC S22 open-source IntelliJ plugin for record/replay, runtime mocking, and JUnit test generation — plugin UX, marketing site, and branding.",
    tag: "Product UI",
    featured: true,
    workSection: "caseStudy",
    buildBadge: "pre-llm",
    coverImageUrl: "/projects/unlogged/hero.webp",
    year: "Dec 2021 – Jan 2024",
    role: "Product Designer",
    client: "Unlogged",
    tools: ["Figma", "Webflow"],
    publishedAt: "2024-01-15T00:00:00.000Z",
    metrics: "YC S22 · Open source · 0→1 plugin UX + marketing site",
    seo: {
      metaTitle: "Unlogged — Java DevTools Plugin — Case Study",
      metaDescription:
        "How an open-source IntelliJ plugin for Java developers got clear plugin UX, a Webflow marketing site designed in Figma, and cohesive branding — at YC-backed Unlogged.",
    },
    content: [
      {
        _type: "sectionHeading",
        _key: "u-h-context",
        title: "Context",
        subtitle: "Product designer on a YC S22 Java devtools startup.",
      },
      {
        _type: "richTextBlock",
        _key: "u-rt-context",
        body: [
          textBlock(
            "u-rt-context-1",
            "Unlogged is an open-source IntelliJ IDEA plugin that helps Java developers mock, monitor, replay, and test production traffic locally — with one-click JUnit test generation, runtime mocking, direct method invocation, and performance tracking.",
          ),
          textBlock(
            "u-rt-context-2",
            "After the team made Y Combinator's Summer 2022 batch, I joined as the design lead — owning plugin UX inside the IDE, the marketing site at unlogged.io (designed in Figma, built in Webflow), and the product's visual identity and branding.",
          ),
        ],
      },
      {
        _type: "collaborators",
        _key: "u-collab",
        subtitle: "Design partner to the Unlogged founding team.",
        teamUrl: "https://www.unlogged.io/about-us",
        items: [
          {
            name: "Shardul Lavekar",
            role: "Founder / QA",
            initials: "SL",
          },
          {
            name: "Parth Mudgal",
            role: "Founder / Software Engineer",
            initials: "PM",
          },
          {
            name: "Amogh CR",
            role: "Software Engineer",
            initials: "AC",
          },
          {
            name: "Akshay Saini",
            role: "Design",
            initials: "AS",
          },
        ],
      },
      {
        _type: "metrics",
        _key: "u-metrics",
        items: [
          { value: "YC S22", label: "Batch" },
          { value: "Open", label: "Source" },
          { value: "Java", label: "IntelliJ plugin" },
        ],
      },
      {
        _type: "sectionHeading",
        _key: "u-h-challenge",
        title: "The challenge",
      },
      {
        _type: "richTextBlock",
        _key: "u-rt-challenge",
        body: [
          textBlock(
            "u-rt-challenge-1",
            "Developer tools live in two worlds at once — dense IDE surfaces where every pixel competes with code, and a marketing site that has to explain bytecode instrumentation, record/replay, and runtime mocking to skeptical backend engineers. Unlogged needed both to feel trustworthy, fast, and approachable without dumbing down the technical story.",
          ),
        ],
      },
      {
        _type: "sectionHeading",
        _key: "u-h-shipped",
        title: "What I shipped",
        subtitle: "Plugin UX, marketing site, and brand system.",
      },
      {
        _type: "richTextBlock",
        _key: "u-rt-shipped",
        body: [
          textBlock(
            "u-rt-shipped-1",
            "I designed end-to-end across the product surface — from IntelliJ plugin flows to the public site and launch assets.",
          ),
          ...bulletList("u-rt-shipped-b", [
            "IntelliJ IDEA plugin UX — record/replay, runtime mocking, JUnit generation, and method performance tracking",
            "Marketing site designed in Figma and built in Webflow from scratch",
            "Branding, visual identity, investor decks, and UI animations for the launch site",
            "Web dashboard app flows and onboarding for developer workflows",
            "Custom design system adapted from Chakra UI for product surfaces",
            "UX research, user testing, and prototyping with early customers",
          ]),
        ],
      },
      {
        _type: "techStack",
        _key: "u-tech",
        items: UNLOGGED_TECH_STACK_ITEMS.map((item, index) => ({
          ...item,
          _key: `u-tech-${index}`,
        })),
      },
      {
        _type: "staticImage",
        _key: "u-img-hero",
        src: "/projects/unlogged/hero.webp",
        alt: "Unlogged marketing site hero — Mock, Monitor, Replay, and Test with Ease",
        caption: "Marketing site hero — open-source Java devtools positioning",
        fullBleed: true,
      },
      {
        _type: "staticImageGallery",
        _key: "u-gallery",
        caption: "Marketing site and founding team",
        images: [
          {
            src: "/projects/unlogged/features.webp",
            alt: "Unlogged marketing site — Mock, Monitor, Replay, and Test with Ease",
          },
          {
            src: "/projects/unlogged/about.webp",
            alt: "Unlogged about page — YC journey and founding team",
          },
        ],
      },
      {
        _type: "sectionHeading",
        _key: "u-h-plugin",
        title: "Plugin UX",
        subtitle: "Designing inside IntelliJ for complex backend workflows.",
      },
      {
        _type: "richTextBlock",
        _key: "u-rt-plugin",
        body: bulletList("u-rt-plugin-b", [
          "Record and replay — capture method inputs and return values, replay locally without HTTP endpoints",
          "Runtime mocking — inject mocks for APIs, DB calls, and downstream services with recorded data",
          "JUnit generation — one-click unit tests from recorded scenarios with framework and serializer choices",
          "Performance tracking — method-level execution thresholds and bottleneck visibility as you code",
        ]),
      },
      {
        _type: "quote",
        _key: "u-quote",
        text: "We are the early adopters of Unlogged to automatically generate the unit test cases for our Java code. We were pleasantly surprised to see the results of what this plugin provided us that normally used to take manual efforts of ~2-3 hours by our developers.",
        attribution: "Pranav Khambayatkar — VP & Head of Engineering",
      },
      {
        _type: "sectionHeading",
        _key: "u-h-outcome",
        title: "Outcome",
      },
      {
        _type: "richTextBlock",
        _key: "u-rt-outcome",
        body: [
          textBlock(
            "u-rt-outcome-1",
            "Unlogged publicly launched in January 2023 with a cohesive brand, a Webflow marketing site, and plugin UX that made record/replay and automated test generation approachable for Java teams. The product remains open source — helping developers catch regressions early and deploy with more confidence.",
          ),
        ],
      },
      {
        _type: "staticImage",
        _key: "u-img-about",
        src: "/projects/unlogged/about.webp",
        alt: "Unlogged about page — founding team and company story",
        caption: "About page — YC journey, team, and mission",
        fullBleed: true,
      },
      {
        _type: "embed",
        _key: "u-embed-site",
        url: "https://www.unlogged.io/",
        label: "View live site",
        embedType: "link",
      },
      {
        _type: "embed",
        _key: "u-embed-team",
        url: "https://www.unlogged.io/about-us",
        label: "View team",
        embedType: "link",
      },
    ],
  },
  {
    _id: "fallback-tulr",
    title: "Tulr — No-Code Platform",
    slug: "tulr",
    description:
      "Pre-LLM-era no-code platform combining videos, tables, forms, and calendars with automation — designed as a one-shot replacement for Airtable, Typeform, Calendly, and Loom.",
    tag: "Product UI",
    featured: true,
    workSection: "caseStudy",
    buildBadge: "pre-llm",
    coverImageUrl: "/projects/tulr/hero.png",
    year: "May 2020 – Dec 2021",
    role: "UX Designer",
    client: "Tulr",
    tools: ["Figma"],
    publishedAt: "2021-12-01T00:00:00.000Z",
    metrics: "0→1 product design · Replaced 4 tools in one platform",
    seo: {
      metaTitle: "Tulr — No-Code Platform — Case Study",
      metaDescription:
        "How Tulr unified videos, tables, forms, and calendars into a pre-LLM no-code builder — designed and launched on Product Hunt as a replacement for Airtable, Typeform, Calendly, and Loom.",
    },
    content: [
      {
        _type: "sectionHeading",
        _key: "t-h-context",
        title: "Context",
        subtitle: "UX designer on a pre-LLM no-code productivity platform.",
      },
      {
        _type: "richTextBlock",
        _key: "t-rt-context",
        body: [
          textBlock(
            "t-rt-context-1",
            "Tulr.io was a no-code platform that let teams combine videos, tables, forms, and calendars — then layer automation on top to build internal apps without writing code. Positioned as a one-shot replacement for Airtable, Typeform, Calendly, and Loom, it shipped in the early no-code wave — before LLMs made \"describe your app\" the default onboarding pattern.",
          ),
          textBlock(
            "t-rt-context-2",
            "I joined as UX designer at AuthMe Id Services, working with founder Shardul Lavekar and a team of seven developers to design the mobile and web builder, a 700+ component library, brand system, and Product Hunt launch.",
          ),
        ],
      },
      {
        _type: "collaborators",
        _key: "t-collab",
        subtitle: "Design partner to the founder and engineering team.",
        items: [
          {
            name: "Shardul Lavekar",
            role: "Founder",
            initials: "SL",
          },
          {
            name: "Akshay Saini",
            role: "UX Designer",
            initials: "AS",
          },
        ],
      },
      {
        _type: "metrics",
        _key: "t-metrics",
        items: [
          { value: "700+", label: "Custom components" },
          { value: "4", label: "Unified primitives" },
          { value: "7", label: "Developers shipped with" },
        ],
      },
      {
        _type: "sectionHeading",
        _key: "t-h-challenge",
        title: "The challenge",
      },
      {
        _type: "richTextBlock",
        _key: "t-rt-challenge",
        body: [
          textBlock(
            "t-rt-challenge-1",
            "Tulr had to feel approachable to non-technical makers while encoding four distinct product metaphors — spreadsheet, form, scheduler, and async video — inside one composable builder. Every screen needed to teach the mental model fast: pick a primitive, wire automation, ship an app. There was no AI copilot to fall back on; clarity of layout, copy, and component hierarchy had to do the heavy lifting.",
          ),
        ],
      },
      {
        _type: "sectionHeading",
        _key: "t-h-product",
        title: "Product design",
        subtitle: "Mobile and web UI for the no-code builder and launch.",
      },
      {
        _type: "richTextBlock",
        _key: "t-rt-product",
        body: [
          textBlock(
            "t-rt-product-1",
            "I owned end-to-end product design across Tulr's builder surfaces — from empty states and onboarding through complex automation flows — plus brand, motion, social assets, and the Product Hunt launch.",
          ),
          ...bulletList("t-rt-product-b", [
            "Mobile and web product design for the no-code builder",
            "700+ custom component library with a shared base design system",
            "Applicant tracking, email marketing, and video pitch templates",
            "Branding, UI animation, social media, and Product Hunt launch",
            "Collaboration with a team of 7 developers",
          ]),
        ],
      },
      {
        _type: "techStack",
        _key: "t-tech",
        items: TULR_TECH_STACK_ITEMS.map((item, index) => ({
          ...item,
          _key: `t-tech-${index}`,
        })),
      },
      {
        _type: "staticImage",
        _key: "t-img-hero",
        src: "/projects/tulr/hero.png",
        alt: "Tulr marketing — One tool to rule them all",
        caption: "Launch creative — unified no-code positioning",
        fullBleed: true,
      },
      {
        _type: "staticImage",
        _key: "t-img-product",
        src: "/projects/tulr/product.jpg",
        alt: "Tulr no-code builder interface with tables, forms, and automation",
        caption: "Builder UI — tables, forms, calendars, and video in one workspace",
        fullBleed: true,
      },
      {
        _type: "sectionHeading",
        _key: "t-h-decisions",
        title: "Design decisions",
      },
      {
        _type: "richTextBlock",
        _key: "t-rt-decisions",
        body: bulletList("t-rt-decisions-b", [
          "Primitive-first navigation — videos, tables, forms, and calendars as first-class building blocks instead of buried settings",
          "Component library at scale — 700+ variants so engineering could ship fast without one-off UI drift",
          "Pre-LLM onboarding — progressive disclosure and template galleries instead of prompt-based setup",
        ]),
      },
      {
        _type: "sectionHeading",
        _key: "t-h-outcome",
        title: "Outcome",
      },
      {
        _type: "richTextBlock",
        _key: "t-rt-outcome",
        body: [
          textBlock(
            "t-rt-outcome-1",
            "Tulr launched on Product Hunt in April 2022 with a clear consolidation story — one workspace for the tools teams were already duct-taping together. The product demonstrated that thoughtful no-code UX could stand on its own in a pre-LLM world, before chat-native builders rewrote how makers expect to start.",
          ),
        ],
      },
      {
        _type: "embed",
        _key: "t-embed",
        url: "https://www.producthunt.com/products/tulr-io",
        label: "View on Product Hunt",
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

function sortByPublishedAtDesc(projects: ProjectCard[]): ProjectCard[] {
  return [...projects].sort((a, b) => {
    const aTime = a.publishedAt ? Date.parse(a.publishedAt) : 0
    const bTime = b.publishedAt ? Date.parse(b.publishedAt) : 0
    return bTime - aTime
  })
}

export function getFallbackHomeWorkSections(): {
  recentProjects: ProjectCard[]
  caseStudies: ProjectCard[]
} {
  const featured = getFallbackFeaturedProjects()

  return {
    recentProjects: sortByPublishedAtDesc(
      featured.filter((project) => project.workSection === "recentProject"),
    ),
    caseStudies: sortByPublishedAtDesc(
      featured.filter((project) => project.workSection === "caseStudy"),
    ),
  }
}

export function partitionProjectsByWorkSection(projects: ProjectCard[]): {
  recentProjects: ProjectCard[]
  caseStudies: ProjectCard[]
  other: ProjectCard[]
} {
  const recentProjects = sortByPublishedAtDesc(
    projects.filter((project) => project.workSection === "recentProject"),
  )
  const caseStudies = sortByPublishedAtDesc(
    projects.filter((project) => project.workSection === "caseStudy"),
  )
  const other = sortByPublishedAtDesc(
    projects.filter(
      (project) =>
        project.workSection !== "recentProject" && project.workSection !== "caseStudy",
    ),
  )

  return { recentProjects, caseStudies, other }
}

export function getFallbackProjectBySlug(slug: string): Project | null {
  return fallbackProjects.find((project) => project.slug === slug) ?? null
}
