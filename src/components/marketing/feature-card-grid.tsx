import { FeatureCard } from "@/components/marketing/feature-card"
import { FeatureCardVisual } from "@/components/marketing/feature-card-visual"
import type { CaseStudyFrom } from "@/components/projects/case-study-back-link"
import {
  getBentoGridClass,
  getBentoPlacementsForProjects,
  type BentoSize,
} from "@/lib/projects/bento-placements"
import type { ProjectCard } from "@/lib/sanity/types"
import { cn } from "@/lib/utils"

export type ShowcaseProject = ProjectCard & { liveUrl?: string }

type FeatureCardGridProps = {
  projects: ShowcaseProject[]
  className?: string
  linkFrom?: CaseStudyFrom
}

function ProjectFeatureCard({
  project,
  size,
  className,
  linkFrom,
}: {
  project: ShowcaseProject
  size: BentoSize
  className?: string
  linkFrom?: CaseStudyFrom
}) {
  return (
    <FeatureCard
      title={project.title}
      description={project.description}
      slug={project.slug}
      externalHref={project.liveUrl}
      tag={project.tag}
      buildBadge={project.buildBadge}
      metrics={project.metrics}
      featured={project.featured}
      size={size}
      className={className}
      linkFrom={linkFrom}
      visual={<FeatureCardVisual project={project} size={size} />}
    />
  )
}

export function FeatureCardGrid({ projects, className, linkFrom }: FeatureCardGridProps) {
  if (projects.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/30 py-16 text-center">
        <p className="text-sm text-muted-foreground">No projects to show yet.</p>
      </div>
    )
  }

  const placements = getBentoPlacementsForProjects(projects)

  return (
    <div
      className={cn(
        "grid gap-4 sm:gap-5 lg:gap-6",
        getBentoGridClass(projects.length),
        className
      )}
    >
      {projects.map((project, index) => {
        const placement = placements[index] ?? {
          colSpan: "col-span-full lg:col-span-1",
          size: "default" as BentoSize,
        }

        return (
          <ProjectFeatureCard
            key={project._id}
            project={project}
            size={placement.size}
            className={placement.colSpan}
            linkFrom={linkFrom}
          />
        )
      })}
    </div>
  )
}
