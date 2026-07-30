"use client"

import { motion } from "motion/react"
import { AlertCircle, Briefcase, Users } from "lucide-react"

import { SectionIntro } from "@/components/marketing/section-intro"
import { useAnimationProfile } from "@/hooks/use-can-animate"
import { EASE_OUT_SMOOTH } from "@/lib/motion-easing"
import type { DeckData } from "@/lib/intro/types"

type ProblemSlideProps = {
  data: DeckData["problem"]
}

export function ProblemSlide({ data }: ProblemSlideProps) {
  const { fullMotion } = useAnimationProfile()

  return (
    <div className="space-y-10">
      <SectionIntro eyebrow="The problem" heading="On-brand assets, off-brand reality" />

      <motion.blockquote
        initial={fullMotion ? { opacity: 0, y: 20 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_OUT_SMOOTH, delay: 0.08 }}
        className="flex max-w-4xl gap-4 sm:gap-5"
      >
        <div className="flex w-6 shrink-0 flex-col items-center self-stretch pt-0.5">
          <AlertCircle className="size-6 shrink-0 text-primary" aria-hidden />
          <span
            className="mt-3 w-1 min-h-8 flex-1 rounded-full bg-primary"
            aria-hidden
          />
        </div>
        <p className="font-heading text-2xl leading-snug font-medium tracking-tight text-balance sm:text-3xl lg:text-4xl">
          {data.statement}
        </p>
      </motion.blockquote>

      <motion.div
        initial={fullMotion ? { opacity: 0, y: 16 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE_OUT_SMOOTH, delay: 0.14 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Users className="size-4 text-primary" aria-hidden />
          Target audience
        </div>
        <div className="flex flex-wrap gap-2">
          {data.audience.map((group) => (
            <span
              key={group}
              className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-foreground"
            >
              {group}
            </span>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={fullMotion ? { opacity: 0, y: 16 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE_OUT_SMOOTH, delay: 0.2 }}
        className="max-w-3xl space-y-4 rounded-xl border border-border/70 bg-muted/20 p-5 sm:p-6"
      >
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Briefcase className="size-4 text-primary" aria-hidden />
          What I&apos;ve seen in the wild
        </div>

        <p className="text-sm leading-relaxed text-foreground">{data.insight.lead}</p>

        <ul className="space-y-2.5 border-l-2 border-primary/20 pl-4">
          {data.insight.painPoints.map((point) => (
            <li key={point} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
              <span className="mt-2 size-1 shrink-0 rounded-full bg-primary/70" aria-hidden />
              <span>{point}</span>
            </li>
          ))}
        </ul>

        <p className="border-t border-border/60 pt-4 text-sm font-medium leading-relaxed text-foreground">
          {data.insight.closing}
        </p>
      </motion.div>
    </div>
  )
}
