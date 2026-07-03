import { Link } from "@tanstack/react-router"
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Calendar,
  Layers,
  Settings,
  MessageSquare,
  Database,
  Search,
  Palette,
  Terminal,
  Brain,
  CheckCircle2,
  Cpu,
  Bookmark,
  Globe,
  Shield,
  User,
} from "lucide-react"


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { usePortfolioChat } from "@/components/landing/portfolio-chat-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ProjectCoverImage } from "@/components/projects/blocks/block-renderer"
import type { Project } from "@/lib/sanity/types"

type FeaturedProjectLayoutProps = {
  project: Project
}

type TechItem = {
  name: string
  logo: React.ComponentType<any>
}

type BenefitItem = {
  title: string
  description: string
  icon: React.ComponentType<any>
}

type FeatureTab = {
  id: string
  label: string
  icon: React.ComponentType<any>
  title: string
  description: string
  points: string[]
  badge: string
  metricValue: string
  metricLabel: string
  focus: string
}

type DesignDecision = {
  title: string
  description: string
}

type OutcomeMetric = {
  value: string
  label: string
}

type ProjectConfig = {
  liveUrl: string
  secondaryUrl?: string
  secondaryLabel?: string
  ctaLabel?: string
  techStackList: TechItem[]
  benefits: BenefitItem[]
  features: FeatureTab[]
  designDecisions: DesignDecision[]
  outcomeDescription: string
  outcomeMetrics: OutcomeMetric[]
}

const PROJECT_CONFIGS: Record<string, ProjectConfig> = {
  "100x-chat-shell": {
    liveUrl: "https://llm-daisyui-shell.vercel.app/",
    techStackList: [
      { name: "React", logo: Cpu },
      { name: "TypeScript", logo: Terminal },
      { name: "Vite", logo: Sparkles },
      { name: "Tailwind CSS", logo: Palette },
      { name: "Konva", logo: Layers },
      { name: "Zustand", logo: Database },
      { name: "Mistral", logo: Brain },
      { name: "Vercel", logo: ExternalLink },
    ],
    benefits: [
      {
        title: "Interactive Generative Studio",
        description:
          "Goes beyond text-only chats by generating real-time visual layouts (like slide decks, social cards, documents) directly onto a Konva canvas.",
        icon: Sparkles,
      },
      {
        title: "Context-Aware Memory System",
        description:
          "Keeps track of user facts and design choices across threads, ensuring consistent formatting and less repetition during long design sessions.",
        icon: Brain,
      },
      {
        title: "Zero-Latency Local RAG",
        description:
          "Grounds layout generation in custom docs or CSV assets via client-side search without complex server roundtrips.",
        icon: Search,
      },
      {
        title: "Layout Scoring & Fitting",
        description:
          "Intelligent canvas placement scoring maps the LLM's raw suggestions to 35+ verified responsive viewport designs.",
        icon: Layers,
      },
    ],
    features: [
      {
        id: "chat",
        label: "New Chat",
        icon: MessageSquare,
        title: "Mistral-Powered Conversational Engine",
        description:
          "Features streaming answers, virtualized logs for speed, code highlighting, and structured system configurations.",
        points: [
          "Mistral-streamed conversational output with reasoning tags",
          "40+ starter presets to trigger design systems, copywriters, or RAG indexers",
          "Virtualized thread history capable of rendering thousands of tokens smoothly",
        ],
        badge: "Fast & Snappy",
        metricValue: "40+",
        metricLabel: "Starter Presets Shipped",
        focus: "Virtualized Streams",
      },
      {
        id: "memory",
        label: "Memory Systems",
        icon: Brain,
        title: "Persistent Knowledge & Style Preferences",
        description:
          "Injects global user criteria (e.g., brand guidelines, fonts, roles) automatically into active AI prompts.",
        points: [
          "Memory bank summarizing user's design rules and guidelines",
          "Fact extractor extracting preferences from chat messages automatically",
          "Thread-specific context gating to keep chats clean and focused",
        ],
        badge: "Context Gated",
        metricValue: "Facts",
        metricLabel: "Autosummarization Engine",
        focus: "Context Windows",
      },
      {
        id: "knowledge",
        label: "Knowledge & RAG",
        icon: Database,
        title: "Client-Side Asset Grounding",
        description:
          "Allows direct file uploads to anchor layout content based on local information.",
        points: [
          "Client-side RAG parser for text and structured file formats",
          "Keyword search retrieval system running in the browser",
          "Grounded prompt rendering providing document context to Mistral",
        ],
        badge: "Private & Local",
        metricValue: "100%",
        metricLabel: "Local File Gating",
        focus: "Client-Side RAG",
      },
      {
        id: "studio",
        label: "Design Studio",
        icon: Layers,
        title: "Visual Layout & Canvas Workspace",
        description:
          "A resizable split screen matching chat logs with a Konva canvas, complete with export-ready layouts.",
        points: [
          "Interactive canvas with 35 pre-designed layouts (cards, grids, carousels)",
          "25+ aspect ratio viewports (Mobile, Instagram, Banner, Slide, Document)",
          "HTML code editor side-by-side with PDF and SVG vector downloads",
        ],
        badge: "WYSIWYG",
        metricValue: "35",
        metricLabel: "Responsive Layouts",
        focus: "Konva/CSS Interop",
      },
      {
        id: "playground",
        label: "UI Playground",
        icon: Settings,
        title: "System Instruction Benchmarking",
        description:
          "A developer testing sandbox to live-configure and test chat parameters.",
        points: [
          "Interactive theme selectors (Retro, Forest, Cyberpunk, Emerald, etc.)",
          "Configurable token limits, reasoning details, and system prompts",
          "Split viewport simulation representing actual device widths",
        ],
        badge: "Dev Sandboxed",
        metricValue: "8",
        metricLabel: "Visual Config Themes",
        focus: "Live Viewport Bench",
      },
    ],
    designDecisions: [
      {
        title: "360px Fixed Sidebar Column",
        description:
          "Enforces consistent chat logs on the left side while leaving maximum viewport real estate for generative Konva layouts on the right.",
      },
      {
        title: "Visible Chain-of-Thought Rendering",
        description:
          "Instead of hiding agent loops, we stream reasoning phases so developers understand what the critic checks at every step.",
      },
      {
        title: "Contrast-Safe Token Presets",
        description:
          "Guarantees WCAG AA color accessibility by forcing the generation model to select colors matching predefined brand design parameters.",
      },
    ],
    outcomeDescription:
      "LLM Chat Shell was planned, designed, and fully shipped in ten days (May 5–15, 2026). It serves as a proof of concept showing how standard React design system patterns can cooperate with live streaming AI models.",
    outcomeMetrics: [
      { value: "10", label: "Days to Ship" },
      { value: "29", label: "Vitest Suites" },
      { value: "35", label: "UI Layouts" },
    ],
  },
  "v1-100x-proto": {
    liveUrl: "https://agent.akshaysaini.xyz/",
    ctaLabel: "Try App",
    techStackList: [
      { name: "React", logo: Cpu },
      { name: "TypeScript", logo: Terminal },
      { name: "Vite", logo: Sparkles },
      { name: "Tailwind CSS", logo: Palette },
      { name: "Framer Motion", logo: Layers },
      { name: "Zustand", logo: Database },
      { name: "Neon", logo: Brain },
      { name: "Vercel", logo: ExternalLink },
    ],
    benefits: [
      {
        title: "Cohesive Product Shell",
        description:
          "Unifies chat, automation, data explorer, app generation, and onboarding into one AI productivity workspace.",
        icon: Sparkles,
      },
      {
        title: "Semantic Design Tokens",
        description:
          "Builds from the 100X-UI Figma system with custom tokens supporting full native light and dark modes.",
        icon: Palette,
      },
      {
        title: "Advanced Data Tables",
        description:
          "Implements TanStack Table with AI grouping, custom filters, and interactive D3/Perspective charts.",
        icon: Database,
      },
      {
        title: "Real-time Sandboxed Apps",
        description:
          "Compiles and executes React/JSX code generated from natural language in a secure, sandboxed container.",
        icon: Layers,
      },
    ],
    features: [
      {
        id: "chat",
        label: "Multi-mode Chat",
        icon: MessageSquare,
        title: "Context-Aware Agent Chat",
        description:
          "AI chat capable of multi-mode reasoning with smart attachments and active thread-scoped file tracking.",
        points: [
          "Smart mode-switching triggers matching LLM models",
          "File attachment parsing supporting multiple developer code types",
          "Thread management and notes catalog integrated with active memory",
        ],
        badge: "Context Aware",
        metricValue: "8",
        metricLabel: "Core Surfaces Shipped",
        focus: "Model Routing",
      },
      {
        id: "workflows",
        label: "Workflows",
        icon: Settings,
        title: "Visual Automation Builder",
        description:
          "Design, preview, and build automated browser agent scripts via visual flows.",
        points: [
          "Drag-and-drop workflow visual creator",
          "Browser simulation playground representing automation runs",
          "Script compilation outputting vanilla automation code",
        ],
        badge: "Automation",
        metricValue: "100%",
        metricLabel: "Visual Automation",
        focus: "Script Gen",
      },
      {
        id: "data",
        label: "Data Explorer",
        icon: Database,
        title: "TanStack Table Views",
        description:
          "Data visualizations and explorers powered by AI-generated custom filters and grouping.",
        points: [
          "Advanced grid views supporting massive record sets",
          "AI-powered sorting, filtering, and columns picker",
          "Embedded D3 and Perspective graphics engines",
        ],
        badge: "Data Engine",
        metricValue: "167",
        metricLabel: "React components",
        focus: "Table Gating",
      },
      {
        id: "apps",
        label: "App Gen",
        icon: Layers,
        title: "Natural Language Sandbox",
        description:
          "Instantly compiles natural language specifications into fully functional React JSX code.",
        points: [
          "Sandbox environment displaying dynamic components safely",
          "Real-time React JSX parsing and compiler pipeline",
          "Fully responsive preview matching target devices",
        ],
        badge: "JSX Preview",
        metricValue: "40+",
        metricLabel: "Design System UI",
        focus: "Sandboxing",
      },
      {
        id: "onboarding",
        label: "Onboarding UI",
        icon: User,
        title: "Workspace Personalization Onboarding",
        description:
          "OTP verification and interest selection curating custom categories for startup teams.",
        points: [
          "Smooth animation onboarding screens",
          "Secure OTP verification flows",
          "Tag-based interest selectors customization engine",
        ],
        badge: "Onboarding",
        metricValue: "3",
        metricLabel: "Personalization flows",
        focus: "OTP Auth",
      },
    ],
    designDecisions: [
      {
        title: "100X-UI Figma Sync",
        description:
          "Built directly on top of the 100x Figma design system, maintaining strict token naming conventions.",
      },
      {
        title: "Inline Automation Controls",
        description:
          "Workflow script actions are presented inline, so users can verify script execution without navigating away.",
      },
      {
        title: "Contextual Quick Prompts",
        description:
          "Category chips change dynamically based on user onboarding tags, providing shortcuts for typical developer tasks.",
      },
    ],
    outcomeDescription:
      "The v1 agent extension prototype successfully validated multi-mode chat, onboarding pipelines, and react app sandboxing for 100x.bot, creating a design system foundation of 40+ components.",
    outcomeMetrics: [
      { value: "167", label: "React Components" },
      { value: "40+", label: "UI Components" },
      { value: "8", label: "Core Surfaces" },
    ],
  },
  "100x-landing-page": {
    liveUrl: "https://100x-landing-page.vercel.app/",
    secondaryUrl: "https://100x.bot/",
    secondaryLabel: "Open Shipped Production Site",
    techStackList: [
      { name: "React", logo: Cpu },
      { name: "TypeScript", logo: Terminal },
      { name: "Vite", logo: Sparkles },
      { name: "Tailwind CSS", logo: Palette },
      { name: "Framer Motion", logo: Layers },
      { name: "Three.js", logo: Globe },
      { name: "shadcn/ui", logo: Settings },
      { name: "TipTap", logo: Terminal },
    ],
    benefits: [
      {
        title: "High-Fidelity Product Demos",
        description:
          "Replaces static screenshots with interactive, scripted browser walkthroughs demonstrating actual automation.",
        icon: Sparkles,
      },
      {
        title: "Dedicated Feature Pillars",
        description: "Communicates browser automations clearly through 5 distinct capability product stories.",
        icon: Layers,
      },
      {
        title: "Conversion-Focused Funnels",
        description: "Features comparison matrices, integrations catalogs, and pricing sliders to guide developers.",
        icon: ArrowLeft,
      },
      {
        title: "Design System Foundation",
        description: "Guarantees pixel-perfect compliance across 13 core homepage segments and competitor landing routes.",
        icon: Palette,
      },
    ],
    features: [
      {
        id: "home",
        label: "Homepage",
        icon: MessageSquare,
        title: "Interactive Scripted Walkthrough",
        description:
          "Hero section featuring animated text lines and a scripted browser demo with interactive pause/play controls.",
        points: [
          "Vibrant WebGL gradient particle background simulation",
          "Scripted visual steps walking through a browser scrape run",
          "One-click action to try the script yourself",
        ],
        badge: "WebGL Driven",
        metricValue: "13",
        metricLabel: "Core Page Sections",
        focus: "Performance",
      },
      {
        id: "product",
        label: "Product Pillars",
        icon: Layers,
        title: "Deep-Dive Feature Sections",
        description: "Separate routes for each core workflow capability, using unified proof-and-mock layouts.",
        points: [
          "Dedicated layout sections for Workflows, Apps, and Smart Tables",
          "Consistent copy formula: Label → Headline → Proof → Mock → CTA",
          "Responsive grid adjusting to multiple display viewports",
        ],
        badge: "Feature Rich",
        metricValue: "5",
        metricLabel: "Capability Pillars",
        focus: "Copy Formula",
      },
      {
        id: "compare",
        label: "Competitor Compare",
        icon: Search,
        title: "Funnels against Competitors",
        description: "Custom compare pages positioning 100x.Bot against Manus, Lovable, ChatGPT, Grok, and Merlin.",
        points: [
          "Direct feature comparison checklists",
          "Positioning copywriting highlighting performance and local data wins",
          "Specific comparative benchmarks and speed tests",
        ],
        badge: "SEO Optimized",
        metricValue: "5",
        metricLabel: "Competitor Matrices",
        focus: "Funnel Gating",
      },
      {
        id: "catalog",
        label: "Integrations",
        icon: Database,
        title: "Searchable Integrations Database",
        description: "A 799-entry searchable directory complete with custom category lookup pages.",
        points: [
          "Faceted sidebar search filters indexing 799 tools",
          "Individual detail layout pages explaining automation use cases",
          "Fast search parsing running client-side with virtual list support",
        ],
        badge: "799 Items",
        metricValue: "799",
        metricLabel: "Catalog Integrations",
        focus: "Client Search",
      },
      {
        id: "platform",
        label: "Platform UI",
        icon: Settings,
        title: "Pricing & Customizer Page",
        description: "Features pricing tiers, self-hosted deployment guides, and a design customization editor.",
        points: [
          "Interactive price slider calculating tier costs based on runs",
          "Detailed deployment guide explaining docker and cloud options",
          "Theme preview panel demonstrating design-system presets",
        ],
        badge: "Flexible Tiers",
        metricValue: "8",
        metricLabel: "Compare matrices",
        focus: "Customizers",
      },
    ],
    designDecisions: [
      {
        title: "1200px Grid Border Rails",
        description: "Draws subtle vertical rails on both sides of the screen to give the layout an editorial print publication look.",
      },
      {
        title: "Scripted Walkthrough Engine",
        description: "Avoids generic video embeds by rendering HTML components that animate as if controlled by a user.",
      },
      {
        title: "Alternating Surface Colors",
        description: "Shifts section background colors between deep dark and border gray to keep the long scrolling homepage engaging.",
      },
    ],
    outcomeDescription:
      "The production marketing site is live at 100x.bot, serving as a primary acquisition channel and displaying interactive browser capabilities that built trust with YC-backed buyers.",
    outcomeMetrics: [
      { value: "13", label: "Page Sections" },
      { value: "5", label: "Competitor Pages" },
      { value: "799", label: "Integrations" },
    ],
  },
  "resume-builder": {
    liveUrl: "/tools/resume",
    techStackList: [
      { name: "Mistral", logo: Brain },
      { name: "Brave Search", logo: Search },
      { name: "React", logo: Cpu },
      { name: "TypeScript", logo: Terminal },
      { name: "TanStack Start", logo: Sparkles },
      { name: "@react-pdf/renderer", logo: Layers },
      { name: "Vercel", logo: ExternalLink },
      { name: "Tailwind CSS", logo: Palette },
    ],
    benefits: [
      {
        title: "Unified Document Schema",
        description: "One core JSON schema powers the owner workspace editor and the public import workflow.",
        icon: Database,
      },
      {
        title: "Live HTML Preview",
        description: "Displays real-time styling changes as you edit facts or import LinkedIn summaries.",
        icon: Sparkles,
      },
      {
        title: "High-Fidelity PDF Engine",
        description: "Compiles document structure directly into vector PDFs via @react-pdf/renderer client-side.",
        icon: Layers,
      },
      {
        title: "Secure Owner Gating",
        description: "Protects personal workspaces with secure authentication while exposing rate-limited tools to visitors.",
        icon: Shield,
      },
    ],
    features: [
      {
        id: "workspace",
        label: "Owner Workspace",
        icon: Settings,
        title: "Personal Resume Manager",
        description: "Password-protected administrative space seeded from static profile records, with live editing fields.",
        points: [
          "Interactive forms mapping all standard resume structures",
          "Styling selectors editing fonts, spacing, and column designs",
          "Instant PDF compiler generating print-ready assets",
        ],
        badge: "Admin Workspace",
        metricValue: "100%",
        metricLabel: "Client-side PDF compilation",
        focus: "HTML Preview",
      },
      {
        id: "import",
        label: "Visitor Tool",
        icon: Sparkles,
        title: "LinkedIn AI Import",
        description: "A public visitor tool compiling LinkedIn URLs or text summaries into a resume.",
        points: [
          "Mistral parsing mapping text descriptions to document schemas",
          "Brave Search web search validating details about companies",
          "Fast client-side PDF generation for visitor downloads",
        ],
        badge: "AI Assisted",
        metricValue: "3 / 24h",
        metricLabel: "Visitor IP Rate Limit",
        focus: "Mistral Schema",
      },
      {
        id: "search",
        label: "Web Search",
        icon: Search,
        title: "Brave Search Integration",
        description: "A shared search tool providing LLM models with verified context regarding company profiles.",
        points: [
          "Brave API integration feeding real-time context to prompts",
          "Abuse-prevention caps limiting tool loops per user",
          "Fallback indexers caching standard tech stacks and company sites",
        ],
        badge: "Live Grounded",
        metricValue: "1",
        metricLabel: "Unified PDF schema",
        focus: "Tool Gating",
      },
    ],
    designDecisions: [
      {
        title: "Double-Col Profile",
        description: "Optimizes desktop space by placing data inputs on the left and the active PDF compilation page on the right.",
      },
      {
        title: "Grounded AI Inputs",
        description: "Inputs parsed by Mistral are displayed with diff markers so users can review AI changes before saving.",
      },
      {
        title: "Clean Typography Scale",
        description: "Enforces strict margins and system sans-serif fonts inside the PDF to ensure high parser readability by ATS scanners.",
      },
    ],
    outcomeDescription:
      "Exposes the AI capabilities of the portfolio via a hands-on tool. Visitor rate limits keep API costs stable while maintaining reliable PDF compiling services.",
    outcomeMetrics: [
      { value: "1", label: "PDF Schema" },
      { value: "3 / 24h", label: "Generation Cap" },
      { value: "29", label: "Vitest Suites" },
    ],
  },
}

export function FeaturedProjectLayout({ project }: FeaturedProjectLayoutProps) {
  // Retrieve config dynamically based on slug. Fall back to chat shell config if not found.
  const config = PROJECT_CONFIGS[project.slug] || PROJECT_CONFIGS["100x-chat-shell"]
  const ctaLabel = config.ctaLabel ?? (config.liveUrl.startsWith("/") ? "Try App" : "Try Live Workspace")

  const { openChatWithMessage } = usePortfolioChat()
  const handleSummarize = () => {
    openChatWithMessage(
      `Summarize the project "${project.title}". Give me a breakdown of what it is, the key design decisions, and the technical implementation/tech stack.`
    )
  }

  return (
    <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      {/* Back button */}
      <div className="mb-10">
        <Button asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground hover:text-foreground">
          <Link to="/projects">
            <ArrowLeft className="mr-2 size-4" />
            Back to projects
          </Link>
        </Button>
      </div>

      {/* Hero Section */}
      <header className="grid gap-10 lg:grid-cols-12 lg:items-center pb-12">
        <div className="space-y-6 lg:col-span-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
              Featured Project
            </Badge>
            {project.buildBadge === "built-with-ai" ? (
              <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20">
                <Sparkles className="mr-1 size-3" /> Built with AI
              </Badge>
            ) : null}
            <Badge variant="outline">{project.year ?? "2026"}</Badge>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {project.title}
          </h1>

          <p className="text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            {config.liveUrl.startsWith("/") ? (
              <Button size="lg" asChild className="shadow-lg hover:shadow-primary/20 transition-all">
                <Link to={config.liveUrl} className="inline-flex items-center gap-2">
                  {ctaLabel} <ArrowRight className="size-4" />
                </Link>
              </Button>
            ) : (
              <Button size="lg" asChild className="shadow-lg hover:shadow-primary/20 transition-all">
                <a href={config.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2">
                  {ctaLabel}{" "}
                  {config.liveUrl.includes("akshaysaini.xyz") || ctaLabel === "Try App" ? (
                    <ArrowRight className="size-4" />
                  ) : (
                    <ExternalLink className="size-4" />
                  )}
                </a>
              </Button>
            )}
            {config.secondaryUrl && (
              <Button size="lg" variant="outline" asChild className="shadow-xs transition-all">
                <a href={config.secondaryUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2">
                  {config.secondaryLabel || "Open Secondary Link"} <ExternalLink className="size-4" />
                </a>
              </Button>
            )}
            <Button size="lg" variant="outline" onClick={handleSummarize} className="inline-flex items-center gap-2">
              Summarize with AI <Sparkles className="size-4" />
            </Button>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="relative group overflow-hidden rounded-2xl border border-border bg-muted/30 shadow-2xl transition-transform duration-300 hover:scale-[1.01]">
            <ProjectCoverImage
              image={project.coverImage}
              imageUrl={project.coverImageUrl}
              alt={project.coverImage?.alt ?? project.title}
              className="w-full aspect-[16/10] object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
          </div>
        </div>
      </header>

      <Separator className="my-0" />

      {/* Project Specs & Tech Stack */}
      <section className="grid gap-8 md:grid-cols-3 py-12">
        <Card className="md:col-span-1 border border-border bg-card/50">
          <CardHeader>
            <CardTitle className="text-xl">Project Specs</CardTitle>
            <CardDescription>Key metadata and client details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                <Bookmark className="size-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Client</p>
                <p className="text-sm font-medium text-foreground">{project.client ?? "Self-Initiated"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                <Calendar className="size-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Timeline</p>
                <p className="text-sm font-medium text-foreground">{project.year ?? "May 2026"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                <Layers className="size-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Role</p>
                <p className="text-sm font-medium text-foreground">{project.role ?? "Design Engineer"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border border-border bg-card/50">
          <CardHeader>
            <CardTitle className="text-xl">Engineering & Design Stack</CardTitle>
            <CardDescription>The tools and frameworks used to ship this project.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {config.techStackList.map((tech) => (
                <div
                  key={tech.name}
                  className="flex items-center gap-2.5 p-3 rounded-xl border border-border bg-background/50 hover:bg-muted/40 transition-colors"
                >
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                    <tech.logo className="size-4" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{tech.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator className="my-0" />

      {/* Core Benefits */}
      <section className="py-12 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-3xl font-semibold tracking-tight">Key Value Propositions</h2>
          <p className="text-muted-foreground text-lg">
            How this featured build solves challenging design and engineering requirements.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {config.benefits.map((benefit, i) => (
            <Card key={i} className="border border-border/80 bg-card/40 hover:bg-card/75 transition-all">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <benefit.icon className="size-5" />
                </div>
                <CardTitle className="text-lg">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-sm">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="my-0" />

      {/* Tabs Features Section */}
      <section className="py-12 space-y-8">
        <div className="max-w-2xl space-y-3">
          <h2 className="text-3xl font-semibold tracking-tight">Interactive Feature Breakdown</h2>
          <p className="text-muted-foreground">
            Explore the deep architectural modules built into this project using our design system.
          </p>
        </div>

        <Tabs defaultValue={config.features[0]?.id || "chat"} className="w-full">
          <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/60 p-1 rounded-xl">
            {config.features.map((feat) => (
              <TabsTrigger
                key={feat.id}
                value={feat.id}
                className="flex items-center gap-2 py-2 px-3 text-sm transition-all"
              >
                <feat.icon className="size-4" />
                <span>{feat.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {config.features.map((feat) => (
            <TabsContent key={feat.id} value={feat.id} className="pt-6">
              <Card className="border border-border bg-card/60 overflow-hidden shadow-sm">
                <div className="grid md:grid-cols-12">
                  <div className="p-6 md:p-8 md:col-span-8 space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="w-fit bg-primary/15 text-primary hover:bg-primary/20">
                          {feat.badge}
                        </Badge>
                      </div>
                      <h3 className="text-2xl font-semibold text-foreground tracking-tight">{feat.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{feat.description}</p>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground/80">Key Highlights</h4>
                      <ul className="space-y-2.5">
                        {feat.points.map((point, index) => (
                          <li key={index} className="flex items-start gap-2.5 text-sm text-muted-foreground leading-normal">
                            <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-6 bg-muted/20 md:col-span-4 flex flex-col justify-center border-t md:border-t-0 md:border-l border-border space-y-4">
                    <div className="text-center p-6 rounded-xl bg-background/50 border border-border/50">
                      <p className="text-4xl font-bold tracking-tight text-primary">
                        {feat.metricValue}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2 font-medium">
                        {feat.metricLabel}
                      </p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-background/30 border border-border/30">
                      <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Engineering Focus</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {feat.focus}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      <Separator className="my-0" />

      {/* Design Decisions & Outcomes */}
      <section className="grid gap-10 md:grid-cols-2 py-12">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Design Decisions</h2>
          <p className="text-muted-foreground leading-relaxed">
            Specific layout guardrails and choices implemented to maintain consistency and compliance:
          </p>
          <ul className="space-y-4">
            {config.designDecisions.map((decision, index) => (
              <li key={index} className="flex gap-3">
                <span className="font-semibold text-primary mt-1">0{index + 1}/</span>
                <div>
                  <h4 className="font-semibold text-foreground">{decision.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {decision.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6 bg-muted/30 p-8 rounded-2xl border border-border/80 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Project Outcome</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {config.outcomeDescription}
            </p>
            <div className="grid grid-cols-3 gap-4 pt-4">
              {config.outcomeMetrics.map((metric, index) => (
                <div key={index} className="text-center p-3 rounded-lg bg-background border border-border">
                  <p className="text-xl font-bold text-foreground">{metric.value}</p>
                  <p className="text-[10px] text-muted-foreground">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-border/50 flex flex-col sm:flex-row gap-3">
            {config.liveUrl.startsWith("/") ? (
              <Button className="flex-1 gap-2 shadow-md hover:shadow-primary/10" size="lg" asChild>
                <Link to={config.liveUrl}>
                  {ctaLabel} <ArrowRight className="size-4" />
                </Link>
              </Button>
            ) : (
              <Button className="flex-1 gap-2 shadow-md hover:shadow-primary/10" size="lg" asChild>
                <a href={config.liveUrl} target="_blank" rel="noreferrer">
                  {ctaLabel === "Try App" ? "Open App" : "Open Live Workspace"}{" "}
                  {config.liveUrl.includes("akshaysaini.xyz") || ctaLabel === "Try App" ? (
                    <ArrowRight className="size-4" />
                  ) : (
                    <ExternalLink className="size-4" />
                  )}
                </a>
              </Button>
            )}
            {config.secondaryUrl && (
              <Button className="flex-1 gap-2" variant="outline" size="lg" asChild>
                <a href={config.secondaryUrl} target="_blank" rel="noreferrer">
                  {config.secondaryLabel || "Open Secondary Link"} <ExternalLink className="size-4" />
                </a>
              </Button>
            )}
            <Button className="flex-1 gap-2" variant="outline" size="lg" onClick={handleSummarize}>
              Summarize with AI <Sparkles className="size-4" />
            </Button>
          </div>
        </div>
      </section>
    </article>
  )
}
