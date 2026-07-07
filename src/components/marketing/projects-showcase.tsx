import { BookOpen, Rocket, type LucideIcon } from "lucide-react"

import { FeatureCardGrid, type ShowcaseProject } from "@/components/marketing/feature-card-grid"
import { SectionIntro } from "@/components/marketing/section-intro"
import { cn } from "@/lib/utils"

type ProjectsShowcaseGroupProps = {
  eyebrow: string
  eyebrowIcon?: LucideIcon
  heading: string
  description: string
  projects: ShowcaseProject[]
  variant?: "default" | "section"
  id?: string
}

function ProjectsShowcaseGroup({
  eyebrow,
  eyebrowIcon,
  heading,
  description,
  projects,
  variant = "default",
  id,
}: ProjectsShowcaseGroupProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative z-10 py-20 sm:py-24 [content-visibility:auto] [contain-intrinsic-size:auto_900px]",
        variant === "section" && "border-t border-border/80 bg-section text-section-foreground"
      )}
    >
      <div className="mx-auto max-w-7xl space-y-10 px-4 sm:space-y-12 sm:px-6">
        <SectionIntro
          eyebrow={eyebrow}
          eyebrowIcon={eyebrowIcon}
          heading={heading}
          description={description}
        />
        <FeatureCardGrid projects={projects} linkFrom="home" />
      </div>
    </section>
  )
}

type ProjectsShowcaseProps = {
  recentProjects: ShowcaseProject[]
  caseStudies: ShowcaseProject[]
}

export function ProjectsShowcase({
  recentProjects,
  caseStudies,
}: ProjectsShowcaseProps) {
  return (
    <div className="border-y border-border/80 bg-background">
      <ProjectsShowcaseGroup
        eyebrow="Recent work"
        eyebrowIcon={Rocket}
        heading="AI-assisted products designed and shipped fast"
        description="Agentic AI products designed and shipped with AI-assisted workflows."
        projects={recentProjects}
      />
      <ProjectsShowcaseGroup
        id="case-studies"
        eyebrow="Case studies"
        eyebrowIcon={BookOpen}
        heading="Deep product design for complex domains"
        description="Deep dives from pre-LLM product design — Figma to shipped UI without AI codegen."
        projects={caseStudies}
        variant="section"
      />
    </div>
  )
}
