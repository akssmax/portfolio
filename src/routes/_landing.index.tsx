import { createFileRoute, useLoaderData, useNavigate } from "@tanstack/react-router"
import * as React from "react"
import { ClipboardList, Sparkles, Star, Quote } from "lucide-react"
import { LandingHeroRotatingCopy } from "@/components/landing/landing-hero-rotating-copy"
import { AnimatePresence, motion } from "motion/react"
import { nanoid } from "nanoid"

import { ChatPromptInput } from "@/components/ui/chat-prompt-input"
import { M3FeatureImage, M3ShapeImage, readStoredHeroPortraitIndex } from "@/components/m3-shapes"
import { ProjectsShowcase } from "@/components/marketing/projects-showcase"
import { useAnimationProfile } from "@/hooks/use-can-animate"
import { useInView } from "@/hooks/use-in-view"
import { getRandomizedHeroPortraitItems, HERO_PORTRAIT_SLOT_COUNT } from "@/lib/hero-portraits"
import { testimonials } from "@/lib/testimonials"
import { getRandomHeroPromptSuggestions } from "@/lib/hero-prompt-suggestions"
import { LANDING_HERO_COPY } from "@/lib/hero-headlines"
import type { Testimonial } from "@/lib/testimonials"
import { cn } from "@/lib/utils"

const LazyContactSection = React.lazy(() =>
  import("@/components/landing/contact-section").then((module) => ({
    default: module.ContactSection,
  })),
)

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

function HeroPromptSuggestions({
  suggestions,
  onSelect,
}: {
  suggestions: ReturnType<typeof getRandomHeroPromptSuggestions>
  onSelect: (query: string, mode: "gen-ui" | "chat") => void
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1.5">
      {suggestions.map((item, idx) => {
        const IconComponent = idx % 3 === 0 ? Sparkles : idx % 3 === 1 ? Star : ClipboardList
        const targetMode =
          item.query.toLowerCase().includes("project") ||
          item.query.toLowerCase().includes("experience") ||
          item.query.toLowerCase().includes("timeline") ||
          item.query.toLowerCase().includes("history")
            ? "gen-ui"
            : "chat"

        return (
          <button
            key={item.label}
            type="button"
            onClick={() => onSelect(item.query, targetMode)}
            className={cn(
              "rounded-full border px-4 py-2 flex items-center gap-2 cursor-pointer transition-all duration-200 text-xs",
              "border-border/80 bg-card text-foreground/85 shadow-sm ring-1 ring-black/[0.05]",
              "hover:border-primary/30 hover:bg-card hover:text-foreground hover:shadow-md",
              "dark:border-border dark:bg-card/45 dark:text-muted-foreground dark:ring-0",
              "dark:hover:bg-card/85 dark:hover:text-foreground dark:shadow-sm",
            )}
          >
            <IconComponent className="size-3.5" />
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

function FeaturedTestimonial({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="relative p-6 sm:p-7 rounded-2xl border border-border/80 bg-card/60 shadow-xs hover:border-primary/20 transition-[border-color,box-shadow] duration-300 space-y-5">
      <div className="absolute -top-3.5 -left-3.5 bg-primary text-primary-foreground size-8 rounded-full flex items-center justify-center shadow-lg transform -rotate-12 select-none z-10">
        <Quote className="size-3.5 fill-current" />
      </div>
      <blockquote className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed pt-1.5 italic">
        &quot;
        {testimonial.quote.map((part, index) =>
          part.bold ? (
            <strong key={index} className="font-semibold text-foreground not-italic">
              {part.text}
            </strong>
          ) : (
            part.text
          ),
        )}
        &quot;
      </blockquote>
      <div className="flex items-center gap-3.5 pt-1.5 border-t border-border/40">
        <M3ShapeImage
          shape="arch"
          src={testimonial.avatarSrc}
          alt={testimonial.name}
          className="size-9.5 shrink-0 bg-primary/10"
        />
        <div className="min-w-0">
          <p className="text-xs font-bold text-foreground truncate">{testimonial.name}</p>
          <p className="text-[10px] text-muted-foreground truncate">{testimonial.headline}</p>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute("/_landing/")({
  component: Landing1IndexPage,
})

function Landing1IndexPage() {
  const { canAnimate, fullMotion } = useAnimationProfile()
  const { ref: aboutRef, inView: aboutInView } = useInView({ rootMargin: "120px" })
  const { ref: contactRef, inView: contactInView } = useInView({ rootMargin: "240px", once: true })
  // Retrieve loader data from the parent route '/_landing'
  const { recentProjects, caseStudies } = useLoaderData({
    from: "/_landing",
  })

  const navigate = useNavigate()
  const [prompt, setPrompt] = React.useState("")
  const [portraitItems] = React.useState(() => getRandomizedHeroPortraitItems())
  const [starterSuggestions] = React.useState(() => getRandomHeroPromptSuggestions())
  const [testimonialIndex, setTestimonialIndex] = React.useState(
    () => readStoredHeroPortraitIndex(HERO_PORTRAIT_SLOT_COUNT) % testimonials.length,
  )

  const handlePortraitMorphStart = React.useCallback((nextIndex: number) => {
    setTestimonialIndex(nextIndex % testimonials.length)
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

  // Map recent projects with live URLs
  const recentProjectsList = React.useMemo(() => {
    return recentProjects.map((p) => {
      const liveUrl = getProjectLiveUrl(p.slug)
      return {
        ...p,
        liveUrl: liveUrl ?? undefined,
      }
    })
  }, [recentProjects])

  // Map case studies with live URLs
  const caseStudiesList = React.useMemo(() => {
    return caseStudies.map((p) => {
      const liveUrl = getProjectLiveUrl(p.slug)
      return {
        ...p,
        liveUrl: liveUrl ?? undefined,
      }
    })
  }, [caseStudies])

  const activeTestimonial = testimonials[testimonialIndex]
  const PromptShell = fullMotion ? motion.div : "div"
  const promptShellProps = fullMotion
    ? {
        layoutId: "chat-prompt-input-container",
        transition: { type: "spring" as const, stiffness: 220, damping: 28 },
      }
    : {}

  return (
    <div className="flex-1 flex flex-col w-full">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center py-20 min-h-[500px] border-b border-border">
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 flex flex-col items-center text-center space-y-8">
          <LandingHeroRotatingCopy slides={LANDING_HERO_COPY} intervalMs={7500} />

          {/* Chat Input wrapper with shared layout id */}
          <PromptShell className="w-full pt-4 space-y-4" {...promptShellProps}>
            <ChatPromptInput
              value={prompt}
              onValueChange={setPrompt}
              onSubmit={handleSubmitPrompt}
              placeholder="Ask about Akshay's projects, product design experience, or RAG info..."
            />
            <HeroPromptSuggestions suggestions={starterSuggestions} onSelect={handleSubmitPrompt} />
          </PromptShell>
        </div>
      </section>

      <ProjectsShowcase
        recentProjects={recentProjectsList}
        caseStudies={caseStudiesList}
      />

      {/* Meet the Designer & Engineer Section */}
      <section
        ref={aboutRef}
        className="py-24 border-t border-border/80 bg-background/40 relative z-10 [content-visibility:auto] [contain-intrinsic-size:auto_720px]"
      >
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
              <div className="p-5 rounded-xl border border-border bg-card/60 space-y-4 shadow-sm">
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
                {canAnimate && fullMotion && activeTestimonial ? (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTestimonial.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.45, ease: "easeInOut" }}
                    >
                      <FeaturedTestimonial testimonial={activeTestimonial} />
                    </motion.div>
                  </AnimatePresence>
                ) : activeTestimonial ? (
                  <FeaturedTestimonial testimonial={activeTestimonial} />
                ) : null}
              </div>
            </div>

            {/* Right Column: Morphing Portrait */}
            <div className="flex justify-center">
              <M3FeatureImage
                items={portraitItems}
                alt="Akshay Saini Portrait"
                imageClassName={cn(
                  "size-72 sm:size-80 lg:size-[24rem] xl:size-[26rem]",
                  fullMotion && "hover:scale-[1.01] transition-transform duration-300",
                )}
                active={fullMotion && aboutInView}
                onMorphStart={handlePortraitMorphStart}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section — lazy-loaded when near viewport */}
      <div ref={contactRef}>
        {contactInView ? (
          <React.Suspense fallback={null}>
            <LazyContactSection bottomCutout={true} />
          </React.Suspense>
        ) : null}
      </div>
    </div>
  )
}
