import type { CaseStudyFrom } from "@/components/projects/case-study-back-link"
import type { FeatureCardPrimaryLink } from "@/components/marketing/feature-card"
import type { ProjectCard } from "@/lib/sanity/types"
import { CaseStudyCard } from "@/components/marketing/case-study-card"
import { FeatureCard } from "@/components/marketing/feature-card"
import { getProjectPreview } from "@/lib/projects/project-preview"
import { getBentoGridClass, getBentoPlacementsForProjects } from "@/lib/projects/bento-placements"
import { cn } from "@/lib/utils"

export type ShowcaseProject = ProjectCard & { liveUrl?: string }

type FeatureCardGridProps = {
  projects: Array<ShowcaseProject>
  className?: string
  linkFrom?: CaseStudyFrom
  primaryLink?: FeatureCardPrimaryLink
  layout?: "compact" | "case-study"
}

export function FeatureCardGrid({ projects, className, linkFrom, primaryLink = "live", layout = "compact" }: FeatureCardGridProps) {
  if (projects.length === 0) {
    return <div className="rounded-2xl border border-dashed border-border bg-card/30 py-16 text-center text-sm text-muted-foreground">No projects to show yet.</div>
  }

  if (layout === "case-study") {
    const placements = getBentoPlacementsForProjects(projects)
    return (
      <div className={cn("grid gap-4 sm:gap-5 lg:gap-6", getBentoGridClass(projects.length, projects), className)}>
        {projects.map((project, index) => {
          const placement = placements[index] ?? { colSpan: "col-span-full", size: "default" as const }
          return <CaseStudyCard key={project._id} project={project} size={placement.size} className={placement.colSpan} linkFrom={linkFrom} />
        })}
      </div>
    )
  }

  return (
    <div className={cn("grid gap-3", className)}>
      {projects.map((project) => {
        const preview = getProjectPreview(project)
        return (
          <FeatureCard
            key={project._id}
            title={project.title}
            description={project.description}
            slug={project.slug}
            externalHref={project.liveUrl}
            previewSrc={preview.src}
            previewAlt={preview.alt}
            linkFrom={linkFrom}
            primaryLink={primaryLink}
          />
        )
      })}
    </div>
  )
}
