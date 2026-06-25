import { Link } from "@tanstack/react-router"
import {
  ArrowLeft,
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
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ProjectCoverImage } from "@/components/projects/blocks/block-renderer"
import type { Project } from "@/lib/sanity/types"

type FeaturedProjectLayoutProps = {
  project: Project
}

export function FeaturedProjectLayout({ project }: FeaturedProjectLayoutProps) {
  // Try to find the live site URL from project content embeds or fallback to the hardcoded DaisyUI shell URL
  const liveUrl = "https://llm-daisyui-shell.vercel.app/"

  const techStackList = [
    { name: "React", logo: Cpu },
    { name: "TypeScript", logo: Terminal },
    { name: "Vite", logo: Sparkles },
    { name: "Tailwind CSS", logo: Palette },
    { name: "Konva", logo: Layers },
    { name: "Zustand", logo: Database },
    { name: "Mistral", logo: Brain },
    { name: "Vercel", logo: ExternalLink },
  ]

  const benefits = [
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
  ]

  const features = [
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
    },
  ]

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
            <Button size="lg" asChild className="shadow-lg hover:shadow-primary/20 transition-all">
              <a href={liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2">
                Try Live Workspace <ExternalLink className="size-4" />
              </a>
            </Button>
            {project.slug === "100x-chat-shell" ? (
              <Button size="lg" variant="outline" asChild>
                <Link to="/tools/resume">Explore Resume Tool</Link>
              </Button>
            ) : null}
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
        <Card className="md:col-span-1 border-none shadow-none bg-transparent">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-xl">Project Specs</CardTitle>
            <CardDescription>Key metadata and client details.</CardDescription>
          </CardHeader>
          <CardContent className="px-0 space-y-4">
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
            <CardDescription>The tools and frameworks used to ship this AI workspace.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {techStackList.map((tech) => (
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
          <h2 className="text-3xl font-semibold tracking-tight">Why LLM Chat Shell?</h2>
          <p className="text-muted-foreground text-lg">
            Standard chat platforms output walls of markdown text. LLM Chat Shell redesigns the interface into a canvas-first agent companion.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {benefits.map((benefit, i) => (
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
            Explore the deep architectural modules built into the workspace using our design system.
          </p>
        </div>

        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/60 p-1 rounded-xl">
            {features.map((feat) => (
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

          {features.map((feat) => (
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
                        {feat.id === "chat" ? "40+" : feat.id === "memory" ? "Facts" : feat.id === "knowledge" ? "100%" : feat.id === "studio" ? "35" : "8"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2 font-medium">
                        {feat.id === "chat" ? "Starter Presets Shipped" : feat.id === "memory" ? "Autosummarization Engine" : feat.id === "knowledge" ? "Local File Gating" : feat.id === "studio" ? "Responsive Layouts" : "Visual Config Themes"}
                      </p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-background/30 border border-border/30">
                      <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Engineering Focus</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {feat.id === "chat" ? "Virtualized Streams" : feat.id === "memory" ? "Context Windows" : feat.id === "knowledge" ? "Client-Side RAG" : feat.id === "studio" ? "Konva/CSS Interop" : "Live Viewport Bench"}
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
            The workspace was designed with strict layout guardrails to maintain clarity during generative AI actions:
          </p>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <span className="font-semibold text-primary mt-1">01/</span>
              <div>
                <h4 className="font-semibold text-foreground">360px Fixed Sidebar Column</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Enforces consistent chat logs on the left side while leaving maximum viewport real estate for generative Konva layouts on the right.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-primary mt-1">02/</span>
              <div>
                <h4 className="font-semibold text-foreground">Visible Chain-of-Thought Rendering</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Instead of hiding agent loops, we stream reasoning phases so developers understand what the critic checks at every step.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-primary mt-1">03/</span>
              <div>
                <h4 className="font-semibold text-foreground">Contrast-Safe Token Presets</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Guarantees WCAG AA color accessibility by forcing the generation model to select colors matching predefined brand design parameters.
                </p>
              </div>
            </li>
          </ul>
        </div>

        <div className="space-y-6 bg-muted/30 p-8 rounded-2xl border border-border/80 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Project Outcome</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              LLM Chat Shell was planned, designed, and fully shipped in ten days (May 5–15, 2026). It serves as a proof of concept showing how standard React design system patterns can cooperate with live streaming AI models.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center p-3 rounded-lg bg-background border border-border">
                <p className="text-xl font-bold text-foreground">10</p>
                <p className="text-[10px] text-muted-foreground">Days to Ship</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-background border border-border">
                <p className="text-xl font-bold text-foreground">29</p>
                <p className="text-[10px] text-muted-foreground">Vitest Suites</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-background border border-border">
                <p className="text-xl font-bold text-foreground">35</p>
                <p className="text-[10px] text-muted-foreground">UI Layouts</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border/50">
            <Button className="w-full gap-2 shadow-md hover:shadow-primary/10" size="lg" asChild>
              <a href={liveUrl} target="_blank" rel="noreferrer">
                Open Live Workspace <ExternalLink className="size-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </article>
  )
}
