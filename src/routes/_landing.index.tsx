import { createFileRoute, useLoaderData, useNavigate } from "@tanstack/react-router"
import * as React from "react"
import { ClipboardList, Globe, RefreshCw, Sparkles, Star, Quote } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { nanoid } from "nanoid"
import { toast } from "sonner"

import { ChatPromptInput } from "@/components/ui/chat-prompt-input"
import { M3FeatureImage, M3ShapeImage } from "@/components/m3-shapes"
import { ContactSection } from "@/components/landing/contact-section"
import { getRandomizedHeroPortraitItems } from "@/lib/hero-portraits"
import { testimonials } from "@/lib/testimonials"
import { getRandomHeroPromptSuggestions } from "@/lib/hero-prompt-suggestions"
import { HorizontalProjectCard } from "@/components/projects/horizontal-project-card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

function getProjectLiveUrl(slug: string): string | null {
  switch (slug) {
    case "100x-landing-page":
      return "https://100x-landing-page.vercel.app/"
    case "100x-chat-shell":
      return "https://llm-daisyui-shell.vercel.app/"
    case "v1-100x-proto":
      return "https://agent.akshaysaini.xyz/"
    case "resume-builder":
      return "/tools/resume"
    case "kodo":
      return "https://www.kodo.com/"
    case "unlogged":
      return "https://www.unlogged.io/"
    case "tulr":
      return "https://www.producthunt.com/products/tulr-io"
    default:
      return null
  }
}

const ROTATING_COPY = [
  {
    title: "Product designer who ships",
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

export const Route = createFileRoute("/_landing/")({
  component: Landing1IndexPage,
})

function Landing1IndexPage() {
  // Retrieve loader data from the parent route '/_landing'
  const { recentProjects, caseStudies } = useLoaderData({
    from: "/_landing",
  })

  const navigate = useNavigate()
  const [prompt, setPrompt] = React.useState("")
  const [copyIndex, setCopyIndex] = React.useState(0)
  const [portraitItems] = React.useState(() => getRandomizedHeroPortraitItems())
  const [starterSuggestions] = React.useState(() => getRandomHeroPromptSuggestions())
  const [testimonialIndex, setTestimonialIndex] = React.useState(2) // Start with Shardul Lavekar

  // Rotate copy title
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCopyIndex((prev) => (prev + 1) % ROTATING_COPY.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  // Rotate testimonials
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length)
    }, 7000)
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
      to: "/chat/$threadId",
      params: { threadId },
    })
  }

  const handleReload = () => {
    toast.info("Refreshed build deployments")
  }

  // Map recent projects with IDs, dates, and live URLs
  const recentProjectsList = React.useMemo(() => {
    return recentProjects.map((p, idx) => {
      const liveUrl = getProjectLiveUrl(p.slug)
      return {
        ...p,
        shortId: `EMT - ${p.slug.slice(0, 6).toUpperCase()}`,
        relativeDate: idx === 0 ? "2 days ago" : idx === 1 ? "12 days ago" : "24 days ago",
        liveUrl: liveUrl ?? undefined,
      }
    })
  }, [recentProjects])

  // Map case studies with IDs, dates, and live URLs
  const caseStudiesList = React.useMemo(() => {
    return caseStudies.map((p, idx) => {
      const liveUrl = getProjectLiveUrl(p.slug)
      return {
        ...p,
        shortId: `EMT - ${p.slug.slice(0, 6).toUpperCase()}`,
        relativeDate: idx === 0 ? "42 days ago" : idx === 1 ? "55 days ago" : "68 days ago",
        liveUrl: liveUrl ?? undefined,
      }
    })
  }, [caseStudies])

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
              placeholder="Ask about Akshay's projects, product design experience, or RAG info..."
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
          <Tabs defaultValue="recent" className="w-full">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
              <TabsList className="bg-muted/60 border border-border/40 p-1 rounded-xl">
                <TabsTrigger value="recent" className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold cursor-pointer transition-all">
                  <ClipboardList className="size-3.5" />
                  Recent Projects
                </TabsTrigger>
                <TabsTrigger value="case-studies" className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold cursor-pointer transition-all">
                  <Globe className="size-3.5" />
                  Case Studies
                </TabsTrigger>
              </TabsList>

              <button
                onClick={handleReload}
                className="p-2 text-muted-foreground hover:text-foreground rounded-lg border border-border hover:bg-muted/50 transition-all cursor-pointer"
                title="Reload Projects"
              >
                <RefreshCw className="size-4" />
              </button>
            </div>

            <TabsContent value="recent" className="space-y-4 outline-none">
              {recentProjectsList.length > 0 ? (
                recentProjectsList.map((project) => (
                  <HorizontalProjectCard
                    key={project._id}
                    project={project}
                  />
                ))
              ) : (
                <div className="text-center py-12 border border-dashed border-border rounded-xl bg-card/30">
                  <p className="text-sm text-muted-foreground">No recent projects found</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="case-studies" className="space-y-4 outline-none">
              {caseStudiesList.length > 0 ? (
                caseStudiesList.map((project) => (
                  <HorizontalProjectCard
                    key={project._id}
                    project={project}
                  />
                ))
              ) : (
                <div className="text-center py-12 border border-dashed border-border rounded-xl bg-card/30">
                  <p className="text-sm text-muted-foreground">No case studies found</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
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
              <div className="relative min-h-[220px]">
                <AnimatePresence mode="wait">
                  {(() => {
                    const t = testimonials[testimonialIndex]
                    if (!t) return null
                    return (
                      <motion.div
                        key={t.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="relative p-6 sm:p-7 rounded-2xl border border-border/80 bg-card/45 backdrop-blur-md shadow-xs hover:border-primary/20 transition-all duration-300 space-y-5"
                      >
                        {/* Quotation icon decoration */}
                        <div className="absolute -top-3.5 -left-3.5 bg-primary text-primary-foreground size-8 rounded-full flex items-center justify-center shadow-lg transform -rotate-12 select-none z-10">
                          <Quote className="size-3.5 fill-current" />
                        </div>
                        <blockquote className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed pt-1.5 italic">
                          &quot;
                          {t.quote.map((part, index) =>
                            part.bold ? (
                              <strong key={index} className="font-semibold text-foreground not-italic">
                                {part.text}
                              </strong>
                            ) : (
                              part.text
                            )
                          )}
                          &quot;
                        </blockquote>
                        <div className="flex items-center gap-3.5 pt-1.5 border-t border-border/40">
                          <M3ShapeImage
                            shape="arch"
                            src={t.avatarSrc}
                            alt={t.name}
                            className="size-9.5 shrink-0 bg-primary/10"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-foreground truncate">{t.name}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{t.headline}</p>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })()}
                </AnimatePresence>
              </div>
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

      {/* Contact CTA Section */}
      <ContactSection bottomCutout={false} />
    </div>
  )
}
