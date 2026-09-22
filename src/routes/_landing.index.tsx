import { createFileRoute, useLoaderData } from "@tanstack/react-router"
import * as React from "react"
import { Quote, Sparkles } from "lucide-react"
import { HeroMinimalCenter } from "@/components/landing/hero-variations"
import { useAnimationProfile } from "@/hooks/use-can-animate"
import { motion } from "motion/react"

import { M3FeatureImage, M3ShapeImage, readStoredHeroPortraitIndex } from "@/components/m3-shapes"
import { ProjectsShowcase } from "@/components/marketing/projects-showcase"
import { useInView } from "@/hooks/use-in-view"
import { getRandomizedHeroPortraitItems, heroPortraitItems, HERO_PORTRAIT_SLOT_COUNT } from "@/lib/hero-portraits"
import { testimonials } from "@/lib/testimonials"
import { EASE_OUT_SMOOTH, surfaceHoverTransition } from "@/lib/motion-easing"
import type { Testimonial } from "@/lib/testimonials"
import { cn } from "@/lib/utils"

const LazyContactSection = React.lazy(() =>
  import("@/components/landing/contact-section").then((module) => ({
    default: module.ContactSection,
  })),
)

function getProjectLiveUrl(slug: string): string | null {
  switch (slug) {
    case "ion-workspace":
      return "https://ion-workspace.vercel.app/"
    case "postforge":
      return "https://postforge-kohl.vercel.app/"
    case "rupeelens":
      return "https://rupeelens-coral.vercel.app/"
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

function FeaturedTestimonial({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div
      className={cn(
        "relative p-6 sm:p-7 rounded-2xl border border-border/80 bg-card/60 shadow-xs hover:border-primary/20 space-y-5",
        surfaceHoverTransition,
      )}
    >
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
  const { fullMotion } = useAnimationProfile()
  const { ref: contactRef, inView: contactInView } = useInView({ rootMargin: "240px", once: true })
  // Retrieve loader data from the parent route '/_landing'
  const { recentProjects, caseStudies } = useLoaderData({
    from: "/_landing",
  })

  const [portraitItems, setPortraitItems] = React.useState(heroPortraitItems)
  const [testimonialIndex, setTestimonialIndex] = React.useState(0)

  React.useEffect(() => {
    setPortraitItems(getRandomizedHeroPortraitItems())
    setTestimonialIndex(
      readStoredHeroPortraitIndex(HERO_PORTRAIT_SLOT_COUNT) % testimonials.length,
    )
  }, [])

  const handlePortraitMorphEnd = React.useCallback((nextIndex: number) => {
    setTestimonialIndex(nextIndex % testimonials.length)
  }, [])

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

  return (
    <div className="flex-1 flex flex-col w-full">
      <HeroMinimalCenter />

      <ProjectsShowcase
        recentProjects={recentProjectsList}
        caseStudies={caseStudiesList}
      />

      {/* Meet the Designer & Engineer Section */}
      <section className="relative z-10 bg-background py-24 border-t border-border/80 [content-visibility:auto] [contain-intrinsic-size:auto_720px]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] items-center">
            {/* Left Column: Details & Testimonial */}
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-transparent px-3 py-1 text-xs font-semibold text-primary">
                  <Sparkles className="size-3" />
                  About Akshay Saini
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-heading">
                  A design engineer who takes designs to production.
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  Over 6+ years I&apos;ve helped fast-moving startups and enterprise teams ship finance dashboards, configurable SaaS forms, devtools, and agentic AI workspaces. I stay hands-on from research and systems thinking through to accessible, production-ready React.
                </p>
              </div>

              {/* Featured Testimonial Quote — all quotes share one grid cell so the
                  tallest reserves height and switching never shifts the layout. */}
              <div className="grid">
                {testimonials.map((testimonial, index) => {
                  const isActive = index === testimonialIndex
                  return (
                    <motion.div
                      key={testimonial.id}
                      aria-hidden={!isActive}
                      className={cn(
                        "col-start-1 row-start-1",
                        isActive ? "pointer-events-auto" : "pointer-events-none",
                      )}
                      initial={false}
                      animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }}
                      transition={{
                        duration: fullMotion ? 0.4 : 0,
                        ease: EASE_OUT_SMOOTH,
                      }}
                    >
                      <FeaturedTestimonial testimonial={testimonial} />
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Right Column: Morphing Portrait */}
            <div className="flex justify-center">
              <M3FeatureImage
                items={portraitItems}
                alt="Akshay Saini Portrait"
                imageClassName={cn(
                  "size-72 sm:size-80 lg:size-[24rem] xl:size-[26rem]",
                  fullMotion &&
                    "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.015] motion-reduce:transition-none",
                )}
                onMorphEnd={handlePortraitMorphEnd}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section — lazy-loaded when near viewport */}
      <div id="contact" ref={contactRef} className="min-h-[60svh]">
        {contactInView ? (
          <React.Suspense fallback={null}>
            <LazyContactSection bottomCutout={true} showBorders={false} showGithubActivity />
          </React.Suspense>
        ) : null}
      </div>
    </div>
  )
}
