import { BookOpen, Rocket } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import type { ShowcaseProject } from "@/components/marketing/feature-card-grid"
import { FeatureCardGrid } from "@/components/marketing/feature-card-grid"
import { SectionIntro } from "@/components/marketing/section-intro"
import { cn } from "@/lib/utils"

/** Matches CtaSection dub-notch width. */
const CUTOUT_WIDTH = 320
const CUTOUT_HEIGHT = 36

type ProjectsShowcaseGroupProps = {
  eyebrow: string
  eyebrowIcon?: LucideIcon
  heading: string
  description: string
  projects: Array<ShowcaseProject>
  variant?: "default" | "section"
  id?: string
  /** Tighter top padding so the intro peeks below the hero fold. */
  compactTop?: boolean
  /** When "case-study", card click opens the project page instead of the live URL. */
  primaryLink?: "live" | "case-study"
}

function ProjectsShowcaseGroup({
  eyebrow,
  eyebrowIcon,
  heading,
  description,
  projects,
  variant = "default",
  id,
  compactTop = false,
  primaryLink = "live",
}: ProjectsShowcaseGroupProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative z-10 pb-20 sm:pb-24 [content-visibility:auto] [contain-intrinsic-size:auto_900px]",
        compactTop ? "pt-8 sm:pt-10" : "pt-20 sm:pt-24",
        variant === "section"
          ? "border-t border-border/80 bg-section text-section-foreground"
          : "bg-muted/30"
      )}
    >
      <div className="mx-auto max-w-7xl space-y-10 px-4 sm:space-y-12 sm:px-6">
        <SectionIntro
          eyebrow={eyebrow}
          eyebrowIcon={eyebrowIcon}
          heading={heading}
          description={description}
        />
        <FeatureCardGrid projects={projects} linkFrom="home" primaryLink={primaryLink} layout={primaryLink === "case-study" ? "case-study" : "compact"} />
      </div>
    </section>
  )
}

type ProjectsShowcaseProps = {
  recentProjects: Array<ShowcaseProject>
  caseStudies: Array<ShowcaseProject>
}

/**
 * Inverted CTA dub-notch on the top edge.
 * Side bars + SVG fill with evenodd punch a hole so the hero shows through.
 */
function TopDubNotchCutout() {
  const w = CUTOUT_WIDTH
  const notch = `M24 -1 C 40 -1, 40 35, 56 35 H${w - 56} C ${w - 40} 35, ${w - 40} -1, ${w - 24} -1 Z`

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start"
      aria-hidden
    >
      <div className="h-[36px] flex-1 bg-background" />
      <svg
        style={{ width: `${w}px` }}
        className="h-[36px] shrink-0"
        viewBox={`0 0 ${w} 36`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d={`M0 0 H${w} V36 H0 Z ${notch}`}
          className="fill-background"
        />
      </svg>
      <div className="h-[36px] flex-1 bg-background" />
    </div>
  )
}

export function ProjectsShowcase({
  recentProjects,
  caseStudies,
}: ProjectsShowcaseProps) {
  return (
    <div className="relative" style={{ marginTop: `-${CUTOUT_HEIGHT - 1}px` }}>
      <TopDubNotchCutout />
      {/* Content starts below the cutout band so the notch hole stays open to the hero */}
      <div
        className="border-b border-border/80 bg-background"
        style={{ marginTop: `${CUTOUT_HEIGHT - 1}px` }}
      >
        <ProjectsShowcaseGroup
          eyebrow="Recent work"
          eyebrowIcon={Rocket}
          heading="Recent products and websites, designed and shipped"
          description="Independent builds and freelance client work, from design to production."
          projects={recentProjects}
          compactTop
        />
        <ProjectsShowcaseGroup
          id="case-studies"
          eyebrow="Case studies"
          eyebrowIcon={BookOpen}
          heading="Deep product design for complex domains"
          description="Deep dives from pre-LLM product design — Figma to shipped UI without AI codegen."
          projects={caseStudies}
          variant="section"
          primaryLink="case-study"
        />
      </div>
    </div>
  )
}
