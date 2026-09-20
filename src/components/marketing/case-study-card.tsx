import { Link } from "@tanstack/react-router"
import { ArrowUpRight, History, Sparkles } from "lucide-react"

import type { CaseStudyFrom } from "@/components/projects/case-study-back-link"
import type { BentoSize } from "@/lib/projects/bento-placements"
import type { ProjectCard } from "@/lib/sanity/types"
import { FeatureCardVisual } from "@/components/marketing/feature-card-visual"
import { Tag } from "@/components/ui/tag"
import { getBuildBadgeLabel } from "@/lib/projects/build-badge"
import { cardHoverTransition, cardTitleTransition } from "@/lib/motion-easing"
import { cn } from "@/lib/utils"

const titleSize: Record<BentoSize, string> = {
  compact: "text-base sm:text-lg",
  default: "text-lg sm:text-xl",
  wide: "text-xl sm:text-2xl lg:text-3xl",
}

export function CaseStudyCard({
  project,
  size,
  className,
  linkFrom,
}: {
  project: ProjectCard
  size: BentoSize
  className?: string
  linkFrom?: CaseStudyFrom
}) {
  const BadgeIcon = project.buildBadge === "built-with-ai" ? Sparkles : History
  const badgeLabel = project.buildBadge ? getBuildBadgeLabel(project.buildBadge) : null

  return (
    <article
      className={cn(
        "feature-card group/card relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border/80 bg-background shadow-xs hover:-translate-y-0.5 hover:border-border hover:shadow-lg",
        cardHoverTransition,
        className,
      )}
    >
      <Link
        to="/projects/$slug"
        params={{ slug: project.slug }}
        search={linkFrom ? { from: linkFrom } : undefined}
        className="absolute inset-0 z-[1] rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        aria-label={`View ${project.title} case study`}
      />
      <div className={cn("pointer-events-none relative flex flex-1 flex-col", size === "compact" ? "p-4 sm:p-5" : "p-5 sm:p-6")}>
        <div className={cn("flex items-start justify-between gap-3", size === "compact" ? "mb-3" : "mb-4")}>
          <h3 className={cn("font-semibold tracking-tight text-foreground group-hover/card:text-primary", cardTitleTransition, titleSize[size])}>
            {project.title}
          </h3>
          <ArrowUpRight className="size-5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover/card:opacity-100 group-focus-within/card:opacity-100" aria-hidden />
        </div>
        <FeatureCardVisual project={project} size={size} caseStudy />
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{project.tag}</span>
          {badgeLabel ? (
            <Tag variant="outline" className="gap-1 px-2 py-0.5 text-[10px] font-medium">
              <BadgeIcon className="size-3 text-primary/80" aria-hidden />
              {badgeLabel}
            </Tag>
          ) : null}
        </div>
        {size !== "compact" && project.description ? (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{project.description}</p>
        ) : null}
        {size !== "compact" && project.metrics ? (
          <div className="mt-3 flex w-fit items-center gap-1.5 rounded-md border border-primary/20 bg-primary/5 px-2.5 py-1 text-[11px] font-semibold text-primary dark:bg-primary/10">
            <Sparkles className="size-3" aria-hidden />
            {project.metrics}
          </div>
        ) : null}
      </div>
    </article>
  )
}
