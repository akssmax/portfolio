import * as React from "react"
import { Link } from "@tanstack/react-router"
import { ArrowUpRight, History, Sparkles } from "lucide-react"

import { Tag } from "@/components/ui/tag"
import type { CaseStudyFrom } from "@/components/projects/case-study-back-link"
import { getBuildBadgeLabel } from "@/lib/projects/build-badge"
import type { BentoSize } from "@/lib/projects/bento-placements"
import type { BuildBadge } from "@/lib/sanity/types"
import { cn } from "@/lib/utils"

const titleSize: Record<BentoSize, string> = {
  compact: "text-base sm:text-lg",
  default: "text-lg sm:text-xl",
  wide: "text-xl sm:text-2xl lg:text-3xl",
}

type FeatureCardProps = {
  title: string
  description?: string
  slug: string
  externalHref?: string
  tag?: string
  buildBadge?: BuildBadge | null
  metrics?: string | null
  featured?: boolean
  size?: BentoSize
  visual: React.ReactNode
  className?: string
  linkFrom?: CaseStudyFrom
}

function BuildBadgeTag({ badge }: { badge: BuildBadge }) {
  const label = getBuildBadgeLabel(badge)
  if (!label) return null

  const Icon = badge === "built-with-ai" ? Sparkles : History

  return (
    <Tag variant="outline" className="gap-1 text-[10px] py-0.5 px-2 font-medium">
      <Icon className="size-3 text-primary/80" aria-hidden />
      {label}
    </Tag>
  )
}

export function FeatureCard({
  title,
  description,
  slug,
  externalHref,
  tag,
  buildBadge,
  metrics,
  featured,
  size = "default",
  visual,
  className,
  linkFrom,
}: FeatureCardProps) {
  const isCompact = size === "compact"
  const isExternalLiveLink = Boolean(externalHref?.startsWith("http"))
  const projectSearch = linkFrom ? { from: linkFrom } : undefined

  return (
    <article
      className={cn(
        "feature-card group/card relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/50 shadow-xs transition-[transform,box-shadow,border-color] duration-300 hover:border-border hover:shadow-lg",
        className
      )}
    >
      <div className={cn("flex flex-1 flex-col", isCompact ? "p-4 sm:p-5" : "p-5 sm:p-6")}>
        <div className={cn("flex items-start justify-between gap-3", isCompact ? "mb-3" : "mb-4")}>
          <Link
            to="/projects/$slug"
            params={{ slug }}
            search={projectSearch}
            className="min-w-0 flex-1 text-left"
          >
            <h3
              className={cn(
                "font-semibold tracking-tight text-foreground transition-colors group-hover/card:text-primary",
                titleSize[size]
              )}
            >
              {title}
            </h3>
          </Link>

          <div className="flex shrink-0 items-center gap-1.5">
            {externalHref ? (
              isExternalLiveLink ? (
                <a
                  href={externalHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex size-8 items-center justify-center rounded-lg border border-border/60 bg-background/80 text-muted-foreground transition-all duration-200 hover:border-primary/30 hover:bg-primary/5 hover:text-primary lg:opacity-0 lg:group-hover/card:opacity-100"
                  aria-label={`Open ${title} live`}
                >
                  <ArrowUpRight className="size-4" />
                </a>
              ) : (
                <Link
                  to={externalHref}
                  className="inline-flex size-8 items-center justify-center rounded-lg border border-border/60 bg-background/80 text-muted-foreground transition-all duration-200 hover:border-primary/30 hover:bg-primary/5 hover:text-primary lg:opacity-0 lg:group-hover/card:opacity-100"
                  aria-label={`Open ${title}`}
                >
                  <ArrowUpRight className="size-4" />
                </Link>
              )
            ) : (
              <Link
                to="/projects/$slug"
                params={{ slug }}
                search={projectSearch}
                className="inline-flex size-8 items-center justify-center rounded-lg border border-border/60 bg-background/80 text-muted-foreground transition-all duration-200 hover:border-primary/30 hover:bg-primary/5 hover:text-primary lg:opacity-0 lg:group-hover/card:opacity-100"
                aria-label={`View ${title} case study`}
              >
                <ArrowUpRight className="size-4" />
              </Link>
            )}
          </div>
        </div>

        <Link
          to="/projects/$slug"
          params={{ slug }}
          search={projectSearch}
          className="block flex-1 min-h-0"
        >
          {visual}
        </Link>

        {!isCompact ? (
          <>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {tag ? (
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {tag}
                </span>
              ) : null}
              {buildBadge ? <BuildBadgeTag badge={buildBadge} /> : null}
              {featured ? (
                <Tag variant="outline" className="gap-1 text-[10px] py-0.5 px-2 font-medium border-amber-500/30 text-amber-600 dark:text-amber-400">
                  <Sparkles className="size-3" aria-hidden />
                  Featured
                </Tag>
              ) : null}
            </div>

            {description ? (
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            ) : null}

            {metrics ? (
              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-primary bg-primary/5 dark:bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-md w-fit">
                <Sparkles className="size-3" aria-hidden />
                <span>{metrics}</span>
              </div>
            ) : null}
          </>
        ) : (
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {tag ? (
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {tag}
              </span>
            ) : null}
            {buildBadge ? <BuildBadgeTag badge={buildBadge} /> : null}
          </div>
        )}
      </div>
    </article>
  )
}
