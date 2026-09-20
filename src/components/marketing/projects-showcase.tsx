import { BookOpen, Rocket } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import type { ShowcaseProject } from "@/components/marketing/feature-card-grid"
import { FeatureCardGrid } from "@/components/marketing/feature-card-grid"
import { SectionIntro } from "@/components/marketing/section-intro"
import { cn } from "@/lib/utils"

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
          ? "border-t border-border/80 bg-section text-section-foreground dark:bg-background"
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

export function ProjectsShowcase({
  recentProjects,
  caseStudies,
}: ProjectsShowcaseProps) {
  return (
    <div className="border-b border-border/80 bg-background">
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
  )
}
