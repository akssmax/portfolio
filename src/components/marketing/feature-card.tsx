import { useEffect, useRef, useState } from "react"
import { Link } from "@tanstack/react-router"
import { ArrowUpRight } from "lucide-react"
import { motion } from "motion/react"

import type { CaseStudyFrom } from "@/components/projects/case-study-back-link"
import { ProjectCardWaveBackground } from "@/components/marketing/project-card-wave-background"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { getProjectVisualTheme } from "@/lib/projects/project-visual-themes"
import { useCanAnimate } from "@/hooks/use-can-animate"
import { cn } from "@/lib/utils"

export type FeatureCardPrimaryLink = "live" | "case-study"

type FeatureCardProps = {
  title: string
  description?: string
  slug: string
  externalHref?: string
  previewSrc?: string | null
  previewAlt?: string
  className?: string
  linkFrom?: CaseStudyFrom
  primaryLink?: FeatureCardPrimaryLink
}

export function FeatureCard({
  title,
  description,
  slug,
  externalHref,
  previewSrc,
  previewAlt,
  className,
  linkFrom,
  primaryLink = "live",
}: FeatureCardProps) {
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reduceMotion = !useCanAnimate()
  const active = hovered || focused

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }, [])

  const openPreview = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = null
    setHovered(true)
  }

  const closePreview = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => {
      setHovered(false)
      closeTimer.current = null
    }, 150)
  }

  const theme = getProjectVisualTheme(slug)
  const Icon = theme.Icon
  const liveHref = externalHref?.startsWith("http") ? externalHref : undefined
  const opensLive = primaryLink === "live" && Boolean(liveHref)
  const caseStudyProps = {
    to: "/projects/$slug" as const,
    params: { slug },
    search: linkFrom ? { from: linkFrom } : undefined,
  }
  const mainContent = (
    <>
      <motion.span
        className={cn("relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-background/85 shadow-sm backdrop-blur-xs sm:size-18", theme.borderColor, theme.glowColor)}
        animate={{ scale: active && !reduceMotion ? 1.06 : 1, y: active && !reduceMotion ? -2 : 0 }}
        transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 340, damping: 22 }}
      >
        <motion.span
          className="absolute inset-0"
          animate={{ backgroundColor: active ? theme.iconHoverBackground : "rgba(0, 0, 0, 0)" }}
          transition={{ duration: reduceMotion ? 0 : 0.22 }}
        />
        <motion.span className="relative" animate={{ opacity: active ? 0 : 1 }} transition={{ duration: reduceMotion ? 0 : 0.14 }}>
          {theme.iconSrc ? (
            <img src={theme.iconSrc} alt="" className="size-10 sm:size-11" aria-hidden />
          ) : (
            <Icon className={cn("size-9 sm:size-10", theme.iconColor)} aria-hidden />
          )}
        </motion.span>
        <motion.span className="absolute" animate={{ opacity: active ? 1 : 0, scale: active && !reduceMotion ? 1 : 0.88 }} transition={{ duration: reduceMotion ? 0 : 0.2 }}>
          {theme.iconInverseSrc ? (
            <img src={theme.iconInverseSrc} alt="" className="size-10 sm:size-11" aria-hidden />
          ) : (
            <Icon className="size-9 text-white sm:size-10" aria-hidden />
          )}
        </motion.span>
      </motion.span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-base font-semibold tracking-tight text-foreground transition-colors group-hover/card:text-primary sm:text-lg">{title}</span>
        </span>
        {description ? <span className="mt-1 block line-clamp-2 text-sm leading-snug text-muted-foreground">{description}</span> : null}
      </span>
      <HoverCardTrigger asChild>
        <span className="shrink-0">
          <ArrowUpRight className="size-4 text-muted-foreground transition-colors group-hover/card:text-primary" aria-hidden />
        </span>
      </HoverCardTrigger>
    </>
  )

  return (
    <HoverCard open={active}>
      <motion.article
        className={cn("group/card relative isolate overflow-hidden rounded-2xl bg-card shadow-sm transition-shadow hover:shadow-md focus-within:shadow-md", className)}
        onHoverStart={openPreview}
        onHoverEnd={closePreview}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={() => setFocused(false)}
      >
        <ProjectCardWaveBackground slug={slug} />
        {opensLive ? (
          <a href={liveHref} target="_blank" rel="noopener noreferrer" className="relative flex min-h-28 items-center gap-4 rounded-2xl p-4 pr-5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:gap-5 sm:p-5" aria-label={`Open ${title} live`}>
            {mainContent}
          </a>
        ) : (
          <Link {...caseStudyProps} className="relative flex min-h-28 items-center gap-4 rounded-2xl p-4 pr-5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:gap-5 sm:p-5" aria-label={`View ${title} case study`}>
            {mainContent}
          </Link>
        )}
      </motion.article>
      {previewSrc ? (
        <HoverCardContent side="right" align="center" sideOffset={18} style={{ animation: "none" }} onPointerEnter={openPreview} onPointerLeave={closePreview} className="hidden w-[min(440px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-border bg-popover p-1.5 shadow-xl sm:block">
          <img src={previewSrc} alt={previewAlt ?? `${title} project screenshot`} loading="lazy" className="aspect-[16/10] w-full rounded-lg bg-muted object-cover object-top" />
          <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">{title} · project preview</p>
        </HoverCardContent>
      ) : null}
    </HoverCard>
  )
}
