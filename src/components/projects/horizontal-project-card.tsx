import * as React from "react"
import { Link } from "@tanstack/react-router"
import { motion, useReducedMotion } from "motion/react"
import { Cpu, FileUser, History, Layout, Sparkles, Star, Terminal, ExternalLink, ArrowRight } from "lucide-react"

import type { ProjectCard as ProjectCardType } from "@/lib/sanity/types"
import { getImageUrl } from "@/lib/sanity/image"
import { usesAvatarCardCover } from "@/lib/projects/project-card-placeholder"
import { Tag } from "@/components/ui/tag"
import { getBuildBadgeLabel } from "@/lib/projects/build-badge"

const PROJECT_ICON_CONFIG: Record<
  string,
  | {
      Icon: React.ComponentType<{ className?: string }>
      bgGradient: string
      iconColor: string
      glowColor: string
      borderColor: string
    }
  | undefined
> = {
  "100x-landing-page": {
    Icon: Layout,
    bgGradient: "from-secondary/15 via-secondary/5 to-transparent",
    iconColor: "text-secondary-foreground",
    glowColor: "shadow-secondary/10 dark:shadow-secondary/5",
    borderColor: "border-secondary/20",
  },
  "100x-chat-shell": {
    Icon: Terminal,
    bgGradient: "from-primary/15 via-primary/5 to-transparent",
    iconColor: "text-primary",
    glowColor: "shadow-primary/10 dark:shadow-primary/5",
    borderColor: "border-primary/20",
  },
  "resume-builder": {
    Icon: FileUser,
    bgGradient: "from-primary/15 via-primary/5 to-transparent",
    iconColor: "text-primary",
    glowColor: "shadow-primary/10 dark:shadow-primary/5",
    borderColor: "border-primary/20",
  },
  "v1-100x-proto": {
    Icon: Cpu,
    bgGradient: "from-accent/15 via-accent/5 to-transparent",
    iconColor: "text-accent-foreground",
    glowColor: "shadow-accent/10 dark:shadow-accent/5",
    borderColor: "border-accent/20",
  },
}

const cardHoverVariants = {
  rest: { y: 0 },
  hover: {
    y: -3,
    transition: { type: "spring" as const, stiffness: 400, damping: 30 },
  },
}

const imageHoverVariants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.04,
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as const },
  },
}

const iconContainerVariants = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.05,
    y: -2,
    transition: { type: "spring" as const, stiffness: 300, damping: 15 },
  },
}

type HorizontalProjectCardProps = {
  project: ProjectCardType & { shortId?: string; relativeDate?: string; liveUrl?: string }
}

function BuildBadgeTag({ badge }: { badge: NonNullable<ProjectCardType["buildBadge"]> }) {
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

export function HorizontalProjectCard({ project }: HorizontalProjectCardProps) {
  const shouldReduceMotion = useReducedMotion()

  const hoverProps = shouldReduceMotion
    ? {}
    : {
        variants: cardHoverVariants,
        initial: "rest" as const,
        whileHover: "hover" as const,
      }

  // Cover image URL resolution
  const coverUrl = project.coverImageUrl ?? getImageUrl(project.coverImage, 600)
  const isAvatarCover = usesAvatarCardCover(project.workSection)

  const renderThumbnail = () => {
    if (isAvatarCover) {
      const config = PROJECT_ICON_CONFIG[project.slug] || {
        Icon: Sparkles,
        bgGradient: "from-primary/10 via-primary/5 to-transparent",
        iconColor: "text-primary",
        glowColor: "shadow-primary/10",
        borderColor: "border-primary/20",
      }

      const { Icon, bgGradient, iconColor, glowColor, borderColor } = config

      return (
        <div className={`relative flex aspect-[16/10] sm:aspect-video w-full sm:w-44 items-center justify-center bg-gradient-to-b ${bgGradient} overflow-hidden rounded-lg border border-border/60 shrink-0`}>
          <motion.div
            variants={iconContainerVariants}
            className={`relative z-10 flex size-14 sm:size-16 items-center justify-center rounded-2xl border bg-card/85 shadow-sm ${borderColor} ${glowColor} backdrop-blur-xs`}
          >
            <Icon className={`size-6 sm:size-7 ${iconColor}`} />
          </motion.div>
        </div>
      )
    }

    if (coverUrl) {
      return (
        <div className="overflow-hidden rounded-lg border border-border/60 aspect-[16/10] sm:aspect-video w-full sm:w-44 shrink-0 bg-muted/20">
          <motion.img
            src={coverUrl}
            alt={project.coverImage?.alt ?? project.title}
            className="w-full h-full object-cover"
            variants={shouldReduceMotion ? undefined : imageHoverVariants}
          />
        </div>
      )
    }

    return (
      <div className="flex aspect-[16/10] sm:aspect-video w-full sm:w-44 items-center justify-center rounded-lg border border-border/60 bg-muted/30 shrink-0">
        <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          {project.tag}
        </span>
      </div>
    )
  }

  return (
    <motion.div
      {...hoverProps}
      className="group/card relative block rounded-xl border border-border bg-card/45 hover:bg-card/75 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300"
    >
      {/* Primary detail link wraps content, keeping layout clean */}
      <Link
        to="/projects/$slug"
        params={{ slug: project.slug }}
        className="flex flex-col sm:flex-row gap-5 p-5 text-left"
      >
        {renderThumbnail()}

        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div className="space-y-2">
            {/* Meta header (ID, Tag, Badges) */}
            <div className="flex flex-wrap items-center gap-2 text-[10px]">
              {project.shortId && (
                <span className="font-mono text-muted-foreground bg-muted/65 px-1.5 py-0.5 rounded border border-border/40 shrink-0">
                  {project.shortId}
                </span>
              )}
              <span className="font-semibold text-muted-foreground uppercase tracking-wider shrink-0">
                {project.tag}
              </span>
              {project.buildBadge && <BuildBadgeTag badge={project.buildBadge} />}
            </div>

            {/* Title & Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base sm:text-lg font-semibold text-foreground group-hover/card:text-primary transition-colors truncate">
                {project.title}
              </h3>
              {project.featured && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-amber-500 border border-amber-500/20 shadow-xs shrink-0">
                  <Star className="size-2.5 fill-amber-500" />
                  Featured
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {project.description}
            </p>

            {/* Metrics */}
            {project.metrics && (
              <div className="mt-1 flex items-center gap-1.5 text-[10px] font-semibold text-primary bg-primary/5 dark:bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md w-fit shadow-2xs">
                <Sparkles className="size-3" />
                <span>{project.metrics}</span>
              </div>
            )}
          </div>

          {/* Footer Metadata & Action Info */}
          <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3 text-[11px] text-muted-foreground">
            <div>
              {project.liveUrl ? (
                <span className="inline-flex items-center gap-1 font-medium text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Deployment
                </span>
              ) : (
                project.relativeDate && (
                  <span>
                    Last modified: <strong className="text-foreground/95">{project.relativeDate}</strong>
                  </span>
                )
              )}
            </div>

            {/* Action Indicators */}
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 text-primary group-hover/card:underline font-medium">
                View case study
                <ArrowRight className="size-3.5 transition-transform group-hover/card:translate-x-0.5" />
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Floating CTA specifically for external deployment inside deployed apps tab */}
      {project.liveUrl && (
        <div className="absolute top-5 right-5 z-20">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-foreground text-background dark:bg-card dark:text-foreground dark:border dark:border-border hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary dark:hover:text-primary-foreground dark:hover:border-primary shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
          >
            Open Live <ExternalLink className="size-3" />
          </a>
        </div>
      )}
    </motion.div>
  )
}
