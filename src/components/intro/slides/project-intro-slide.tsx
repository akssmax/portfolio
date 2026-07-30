"use client"

import { motion } from "motion/react"
import { ArrowUpRight, History, Sparkles } from "lucide-react"
import { Link } from "@tanstack/react-router"

import { Badge } from "@/components/ui/badge"
import { DeckMediaGlow } from "@/components/intro/deck-slide-background"
import { useAnimationProfile } from "@/hooks/use-can-animate"
import { getBuildBadgeLabel } from "@/lib/projects/build-badge"
import { EASE_OUT_SMOOTH } from "@/lib/motion-easing"
import type { DeckCaseStudyCard, DeckData } from "@/lib/intro/types"
import { cn } from "@/lib/utils"

type ProjectIntroSlideProps = {
  data: DeckData["projectIntro"]
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.07,
      duration: 0.5,
      ease: EASE_OUT_SMOOTH,
    },
  }),
}

function CaseStudyCard({
  card,
  index,
}: {
  card: DeckCaseStudyCard
  index: number
}) {
  const buildBadgeLabel = getBuildBadgeLabel(card.buildBadge)

  return (
    <motion.div
      custom={5 + index}
      initial="hidden"
      animate="visible"
      variants={itemVariants}
    >
      <Link
        to="/projects/$slug"
        params={{ slug: card.slug }}
        search={{ from: "intro" }}
        onPointerDown={(event) => event.stopPropagation()}
        className="group flex h-full flex-col overflow-hidden rounded-xl border border-border/70 bg-muted/15 transition-colors hover:border-border hover:bg-muted/25"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-muted/30">
          {card.coverImageUrl ? (
            <img
              src={card.coverImageUrl}
              alt=""
              className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        </div>

        <div className="flex flex-1 flex-col gap-2 p-3 sm:p-3.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 space-y-1">
              <p className="truncate font-medium tracking-tight text-foreground">
                {card.title}
              </p>
              <p className="text-[11px] text-muted-foreground">{card.tag}</p>
            </div>
            <ArrowUpRight
              className="mt-0.5 size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
              aria-hidden
            />
          </div>

          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {card.description}
          </p>

          <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
            {buildBadgeLabel ? (
              <Badge
                variant="outline"
                className={cn(
                  "h-5 rounded-full px-2 text-[10px] font-normal",
                  card.buildBadge === "built-with-ai" &&
                    "border-amber-500/30 text-amber-600 dark:text-amber-400",
                )}
              >
                {buildBadgeLabel}
              </Badge>
            ) : null}
            {card.year ? (
              <span className="text-[10px] text-muted-foreground">{card.year}</span>
            ) : null}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function ProjectIntroSlide({ data }: ProjectIntroSlideProps) {
  const { fullMotion } = useAnimationProfile()
  const buildBadgeLabel = getBuildBadgeLabel(data.buildBadge)

  return (
    <div className="relative min-h-[min(72dvh,720px)]">
      <div className="flex h-full flex-col gap-8 lg:gap-10">
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={itemVariants}
          className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-5"
        >
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
              Case studies
            </span>
            <span className="hidden h-px w-12 bg-border sm:block" aria-hidden />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="rounded-full border-primary/30 bg-primary/5 px-3 py-1 text-xs text-primary"
            >
              Presenting today
            </Badge>
            <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
              <Sparkles className="mr-1 size-3" aria-hidden />
              {data.tag}
            </Badge>
            {buildBadgeLabel ? (
              <Badge
                variant="outline"
                className={cn(
                  "gap-1 rounded-full px-3 py-1 text-xs",
                  data.buildBadge === "built-with-ai" &&
                    "border-amber-500/30 text-amber-600 dark:text-amber-400",
                )}
              >
                {data.buildBadge === "built-with-ai" ? (
                  <Sparkles className="size-3" aria-hidden />
                ) : (
                  <History className="size-3" aria-hidden />
                )}
                {buildBadgeLabel}
              </Badge>
            ) : null}
          </div>
        </motion.div>

        <div className="grid flex-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col justify-center space-y-6 lg:col-span-5">
            <motion.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
              className="font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-[3.25rem] lg:leading-[1.05]"
            >
              {data.title}
            </motion.h1>

            <motion.p
              custom={2}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
              className="max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              {data.description}
            </motion.p>

            {data.stats.length > 0 ? (
              <motion.div
                custom={3}
                initial="hidden"
                animate="visible"
                variants={itemVariants}
                className="grid grid-cols-3 gap-2 sm:gap-3"
              >
                {data.stats.map((stat) => (
                  <div
                    key={`${stat.value}-${stat.label}`}
                    className="rounded-xl border border-border/70 bg-muted/20 px-3 py-3 text-center sm:px-4"
                  >
                    <p className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-[10px] leading-tight text-muted-foreground sm:text-xs">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </motion.div>
            ) : null}

            <motion.div
              custom={4}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
              className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground"
            >
              <span>{data.role}</span>
              {data.year ? (
                <>
                  <span aria-hidden className="text-border">
                    ·
                  </span>
                  <span>{data.year}</span>
                </>
              ) : null}
              {data.metrics ? (
                <>
                  <span aria-hidden className="hidden text-border sm:inline">
                    ·
                  </span>
                  <span className="hidden text-xs sm:inline">{data.metrics}</span>
                </>
              ) : null}
            </motion.div>
          </div>

          <motion.div
            initial={fullMotion ? { opacity: 0, y: 28, scale: 0.97 } : false}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.65, ease: EASE_OUT_SMOOTH, delay: 0.12 }}
            className="relative lg:col-span-7"
          >
            <DeckMediaGlow />

            <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-muted/20 shadow-2xl shadow-primary/5 ring-1 ring-white/5">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              <img
                src={data.coverImageUrl}
                alt={`${data.title} hero preview`}
                className="aspect-[16/10] w-full object-cover object-top"
              />
            </div>

            {data.metrics ? (
              <p className="mt-3 text-center text-xs text-muted-foreground sm:hidden">
                {data.metrics}
              </p>
            ) : null}
          </motion.div>
        </div>

        {data.otherCaseStudies.length > 0 ? (
          <div className="space-y-4 border-t border-border/60 pt-6">
            <motion.div
              custom={5}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
              className="flex items-center justify-between gap-3"
            >
              <p className="text-sm font-medium text-foreground">More in portfolio</p>
              <p className="text-xs text-muted-foreground">
                {data.otherCaseStudies.length} other case studies
              </p>
            </motion.div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {data.otherCaseStudies.map((card, index) => (
                <CaseStudyCard key={card.slug} card={card} index={index} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
