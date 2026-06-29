import { Link, createFileRoute, useLoaderData, useNavigate } from "@tanstack/react-router"
import * as React from "react"
import { ClipboardList, Globe, MoreHorizontal, RefreshCw, Sparkles, Star } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { nanoid } from "nanoid"
import { toast } from "sonner"

import type { ProjectCard } from "@/lib/sanity/types"
import { ChatPromptInput } from "@/components/ui/chat-prompt-input"
import { M3FeatureImage } from "@/components/m3-shapes/m3-feature-image"
import { getRandomizedHeroPortraitItems } from "@/lib/hero-portraits"
import { testimonials } from "@/lib/testimonials"
import { getRandomHeroPromptSuggestions } from "@/lib/hero-prompt-suggestions"

const ROTATING_COPY = [
  {
    title: "Looking for a Design Engineer?",
    subtitle: "I design in Figma and ship production-ready React code.",
  },
  {
    title: "Ask my portfolio anything.",
    subtitle: "Use the prompt below to search my projects, case studies, and engineering background.",
  },
  {
    title: "Hire a Product Designer in Bangalore.",
    subtitle: "8+ years experience across fintech, devtools, and agentic AI.",
  },
  {
    title: "Zero handoff friction.",
    subtitle: "I bridge the gap between design systems and frontend code.",
  },
] as const

export const Route = createFileRoute("/landing-1/")({
  component: Landing1IndexPage,
})

function Landing1IndexPage() {
  // Retrieve loader data from the parent route '/landing-1'
  const { recentProjects, caseStudies } = useLoaderData({
    from: "/landing-1",
  })

  const navigate = useNavigate()
  const [prompt, setPrompt] = React.useState("")
  const [copyIndex, setCopyIndex] = React.useState(0)
  const [activeTab, setActiveTab] = React.useState<"tasks" | "deployed">("tasks")
  const [portraitItems] = React.useState(() => getRandomizedHeroPortraitItems())
  const [starterSuggestions] = React.useState(() => getRandomHeroPromptSuggestions())

  // Rotate copy title
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCopyIndex((prev) => (prev + 1) % ROTATING_COPY.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const handleSubmitPrompt = (text: string, mode: "gen-ui" | "chat") => {
    const threadId = nanoid(10)
    
    // Save first message in localStorage to initiate the thread history
    const initialThread = {
      id: threadId,
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: nanoid(),
          role: "user" as const,
          content: text,
          mode,
        },
      ],
    }
    
    localStorage.setItem(`portfolio_thread_${threadId}`, JSON.stringify(initialThread))
    
    navigate({
      to: "/landing-1/chat/$threadId",
      params: { threadId },
    })
  }

  const handleReload = () => {
    toast.info("Refreshed build deployments")
  }

  // Create combined projects list
  const allProjects = React.useMemo(() => {
    const list: Array<ProjectCard & { shortId: string; relativeDate: string }> = []
    recentProjects.forEach((p, idx) => {
      list.push({
        ...p,
        shortId: `EMT - ${p.slug.slice(0, 6).toUpperCase()}`,
        relativeDate: idx === 0 ? "2 days ago" : idx === 1 ? "12 days ago" : "24 days ago",
      })
    })
    caseStudies.forEach((p, idx) => {
      list.push({
        ...p,
        shortId: `EMT - ${p.slug.slice(0, 6).toUpperCase()}`,
        relativeDate: idx === 0 ? "42 days ago" : idx === 1 ? "55 days ago" : "68 days ago",
      })
    })
    return list
  }, [recentProjects, caseStudies])

  // Filter deployed apps
  const deployedApps = React.useMemo(() => {
    const liveUrls: Record<string, string> = {
      "100x-landing-page": "https://100x.bot",
      "100x-chat-shell": "https://100x.bot/chat",
      kodo: "https://kodo.com",
      unlogged: "https://unlogged.io",
      tulr: "https://tulr.io",
    }
    return allProjects
      .filter((p) => liveUrls[p.slug])
      .map((p) => ({
        ...p,
        liveUrl: liveUrls[p.slug],
      }))
  }, [allProjects])

  return (
    <div className="flex-1 flex flex-col w-full">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center py-20 min-h-[500px] border-b border-border">
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 flex flex-col items-center text-center space-y-8">
          {/* Animated Titles */}
          <div className="min-h-[7rem] sm:min-h-[9rem] flex flex-col items-center justify-center w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={copyIndex}
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="space-y-3"
              >
                <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl text-foreground font-heading leading-tight">
                  {ROTATING_COPY[copyIndex].title}
                </h1>
                <p className="max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed text-balance">
                  {ROTATING_COPY[copyIndex].subtitle}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Chat Input wrapper with shared layout id */}
          <motion.div 
            className="w-full pt-4 space-y-4"
            layoutId="chat-prompt-input-container"
            transition={{ type: "spring", stiffness: 220, damping: 28 }}
          >
            <ChatPromptInput
              value={prompt}
              onValueChange={setPrompt}
              onSubmit={handleSubmitPrompt}
              placeholder="Ask about Akshay's projects, design engineering experience, or RAG info..."
            />

            {/* Quick Suggestion Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1.5">
              {starterSuggestions.map((item, idx) => {
                const IconComponent = idx % 3 === 0 ? Sparkles : idx % 3 === 1 ? Star : ClipboardList
                const targetMode = (item.query.toLowerCase().includes("project") || item.query.toLowerCase().includes("experience") || item.query.toLowerCase().includes("timeline") || item.query.toLowerCase().includes("history")) ? "gen-ui" : "chat"
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleSubmitPrompt(item.query, targetMode)}
                    className="rounded-full border border-border bg-card/45 hover:bg-card/85 text-xs text-muted-foreground hover:text-foreground px-4 py-2 flex items-center gap-2 cursor-pointer transition-all duration-200 shadow-sm"
                  >
                    <IconComponent className="size-3.5" />
                    {item.label}
                  </button>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section className="py-20 bg-card/10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab("tasks")}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-all cursor-pointer ${
                  activeTab === "tasks"
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <ClipboardList className="size-4" />
                Recent Tasks
              </button>
              <button
                onClick={() => setActiveTab("deployed")}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-all cursor-pointer ${
                  activeTab === "deployed"
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Globe className="size-4" />
                Deployed Apps
              </button>
            </div>

            <button
              onClick={handleReload}
              className="p-2 text-muted-foreground hover:text-foreground rounded-lg border border-border hover:bg-muted/50 transition-all cursor-pointer"
              title="Reload Tasks"
            >
              <RefreshCw className="size-4" />
            </button>
          </div>

          <div className="rounded-xl border border-border bg-card/50 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30 text-muted-foreground font-medium text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">ID</th>
                    <th className="px-6 py-4 font-semibold">Task / Project</th>
                    <th className="px-6 py-4 font-semibold">Last Modified</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {activeTab === "tasks" ? (
                    allProjects.map((project) => (
                      <tr 
                        key={project._id}
                        className="hover:bg-muted/20 transition-all group cursor-pointer"
                      >
                        <td className="px-6 py-5 font-mono text-xs text-muted-foreground whitespace-nowrap">
                          <Link to="/projects/$slug" params={{ slug: project.slug }}>
                            {project.shortId}
                          </Link>
                        </td>
                        <td className="px-6 py-5">
                          <Link to="/projects/$slug" params={{ slug: project.slug }} className="block">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                {project.title}
                              </span>
                              {project.featured && (
                                <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-500">
                                  <Star className="size-2.5 fill-amber-500" />
                                  Featured
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground line-clamp-1 max-w-xl">
                              {project.description}
                            </p>
                            {project.metrics && (
                              <div className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-primary/80">
                                <Sparkles className="size-3" />
                                <span>{project.metrics}</span>
                              </div>
                            )}
                          </Link>
                        </td>
                        <td className="px-6 py-5 text-muted-foreground whitespace-nowrap">
                          <Link to="/projects/$slug" params={{ slug: project.slug }} className="block">
                            {project.relativeDate}
                          </Link>
                        </td>
                        <td className="px-6 py-5 text-right whitespace-nowrap">
                          <Link to="/projects/$slug" params={{ slug: project.slug }} className="inline-flex p-1.5 rounded-md hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all">
                            <MoreHorizontal className="size-4" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    deployedApps.map((project) => (
                      <tr 
                        key={project._id}
                        className="hover:bg-muted/20 transition-all group cursor-pointer"
                      >
                        <td className="px-6 py-5 font-mono text-xs text-muted-foreground whitespace-nowrap">
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                            {project.shortId}
                          </a>
                        </td>
                        <td className="px-6 py-5">
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="block">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                {project.title}
                              </span>
                              <span className="text-[10px] text-muted-foreground font-mono">
                                ({project.liveUrl.replace("https://", "")})
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground line-clamp-1 max-w-xl">
                              {project.description}
                            </p>
                          </a>
                        </td>
                        <td className="px-6 py-5 text-muted-foreground whitespace-nowrap">
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="block">
                            Active
                          </a>
                        </td>
                        <td className="px-6 py-5 text-right whitespace-nowrap">
                          <a 
                            href={project.liveUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-all"
                          >
                            Open Live ➜
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Designer & Engineer Section */}
      <section className="py-24 border-t border-border/80 bg-background/40 relative z-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] items-center">
            {/* Left Column: Details & Testimonial */}
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <Sparkles className="size-3" />
                  About Akshay Saini
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-heading">
                  A product designer who designs in Figma and writes React code.
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  I operate at the intersection of Figma and production code. Over the past 8+ years, I have helped fast-moving startups and enterprise teams build finance dashboards, configurable SaaS forms, devtools, and agentic AI workspaces.
                </p>
              </div>

              {/* Personal Card Details */}
              <div className="p-5 rounded-xl border border-border bg-card/50 backdrop-blur-md space-y-4 shadow-sm">
                <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Personal Profile</p>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <p className="text-muted-foreground font-medium">Pronouns</p>
                    <p className="text-foreground font-semibold">He/Him</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground font-medium">Age</p>
                    <p className="text-foreground font-semibold">29 years old</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground font-medium">Hometown</p>
                    <p className="text-foreground font-semibold">Gohana, Haryana</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground font-medium">Current Location</p>
                    <p className="text-foreground font-semibold">Bengaluru, India</p>
                  </div>
                </div>
              </div>

              {/* Featured Testimonial Quote */}
              {testimonials.find((t) => t.id === "shardul-lavekar") && (
                <div className="relative p-6 rounded-xl border border-border bg-primary/5 space-y-4">
                  <div className="absolute -top-3 -left-3 bg-primary text-primary-foreground size-7 rounded-full flex items-center justify-center shadow-md font-serif text-lg font-bold">
                    “
                  </div>
                  <p className="text-xs sm:text-sm text-foreground/90 italic leading-relaxed pt-2">
                    &quot;{testimonials.find((t) => t.id === "shardul-lavekar")?.quote.map(q => q.text).join("")}&quot;
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <div className="size-8.5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-mono font-bold text-xs text-primary shrink-0">
                      SL
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">{testimonials.find((t) => t.id === "shardul-lavekar")?.name}</p>
                      <p className="text-[10px] text-muted-foreground">{testimonials.find((t) => t.id === "shardul-lavekar")?.headline}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Morphing Portrait */}
            <div className="flex justify-center">
              <M3FeatureImage
                items={portraitItems}
                alt="Akshay Saini Portrait"
                imageClassName="size-72 sm:size-80 lg:size-[24rem] xl:size-[26rem] hover:scale-[1.01] transition-transform duration-300"
                active={true}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
