import * as React from "react"
import { Link } from "@tanstack/react-router"
import { ArrowUpRight, History, Sparkles } from "lucide-react"

import { Tag } from "@/components/ui/tag"
import type { CaseStudyFrom } from "@/components/projects/case-study-back-link"
import { getBuildBadgeLabel } from "@/lib/projects/build-badge"
import type { BentoSize } from "@/lib/projects/bento-placements"
import type { BuildBadge } from "@/lib/sanity/types"
import {
  cardActionTransition,
  cardHoverTransition,
  cardTitleTransition,
} from "@/lib/motion-easing"
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
  size = "default",
  visual,
  className,
  linkFrom,
}: FeatureCardProps) {
  const isCompact = size === "compact"
  const isExternalLiveLink = Boolean(externalHref?.startsWith("http"))
  const projectSearch = linkFrom ? { from: linkFrom } : undefined

  const caseStudyLinkProps = {
    to: "/projects/$slug" as const,
    params: { slug },
    search: projectSearch,
  }

  const hoverActionClassName = cn(
    "translate-y-0.5 opacity-0 pointer-events-none",
    "group-hover/card:translate-y-0 group-hover/card:opacity-100 group-hover/card:pointer-events-auto",
    cardActionTransition,
  )

  const titleElement = (
    <h3
      className={cn(
        "font-semibold tracking-tight text-foreground group-hover/card:text-primary",
        cardTitleTransition,
        titleSize[size],
      )}
    >
      {title}
    </h3>
  )

  return (
    <article
      className={cn(
        "feature-card group/card relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/50 shadow-xs",
        "hover:-translate-y-0.5 hover:border-border hover:shadow-lg",
        cardHoverTransition,
        className,
      )}
    >
      <div className={cn("flex flex-1 flex-col", isCompact ? "p-4 sm:p-5" : "p-5 sm:p-6")}>
        <div className={cn("flex items-start justify-between gap-3", isCompact ? "mb-3" : "mb-4")}>
          {isExternalLiveLink ? (
            <a
              href={externalHref}
              target="_blank"
              rel="noopener noreferrer"
              className="min-w-0 flex-1 text-left"
            >
              {titleElement}
            </a>
          ) : (
            <Link {...caseStudyLinkProps} className="min-w-0 flex-1 text-left">
              {titleElement}
            </Link>
          )}

          <div
            className={cn(
              "flex shrink-0 items-center gap-1.5",
              isExternalLiveLink && hoverActionClassName,
            )}
          >
            {isExternalLiveLink ? (
              <>
                <Link
                  {...caseStudyLinkProps}
                  className={cn(
                    "inline-flex items-center rounded-full border border-border/60 bg-background/80 px-2.5 py-1 text-xs font-medium text-muted-foreground",
                    "hover:border-primary/30 hover:bg-primary/5 hover:text-primary",
                  )}
                >
                  View details
                </Link>
                <a
                  href={externalHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex size-8 items-center justify-center rounded-full border border-border/60 bg-background/80 text-muted-foreground",
                    "hover:border-primary/30 hover:bg-primary/5 hover:text-primary",
                  )}
                  aria-label={`Open ${title} live`}
                >
                  <ArrowUpRight className="size-4" aria-hidden />
                </a>
              </>
            ) : externalHref ? (
              <Link
                to={externalHref}
                className={cn(
                  "inline-flex size-8 items-center justify-center rounded-lg border border-border/60 bg-background/80 text-muted-foreground",
                  "hover:border-primary/30 hover:bg-primary/5 hover:text-primary",
                  hoverActionClassName,
                )}
                aria-label={`Open ${title}`}
              >
                <ArrowUpRight className="size-4" />
              </Link>
            ) : (
              <Link
                {...caseStudyLinkProps}
                className={cn(
                  "inline-flex size-8 items-center justify-center rounded-lg border border-border/60 bg-background/80 text-muted-foreground",
                  "hover:border-primary/30 hover:bg-primary/5 hover:text-primary",
                  hoverActionClassName,
                )}
                aria-label={`View ${title} case study`}
              >
                <ArrowUpRight className="size-4" />
              </Link>
            )}
          </div>
        </div>

        {isExternalLiveLink ? (
          <a
            href={externalHref}
            target="_blank"
            rel="noopener noreferrer"
            className="block flex-1 min-h-0"
          >
            {visual}
          </a>
        ) : (
          <Link {...caseStudyLinkProps} className="block flex-1 min-h-0">
            {visual}
          </Link>
        )}

        {!isCompact ? (
          <>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {tag ? (
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {tag}
                </span>
              ) : null}
              {buildBadge ? <BuildBadgeTag badge={buildBadge} /> : null}
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
