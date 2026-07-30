"use client"

import { motion } from "motion/react"
import {
  Bot,
  Download,
  LayoutGrid,
  Palette,
  Shuffle,
  Sparkles,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { SectionIntro } from "@/components/marketing/section-intro"
import { useAnimationProfile } from "@/hooks/use-can-animate"
import { EASE_OUT_SMOOTH } from "@/lib/motion-easing"
import type { DeckData } from "@/lib/intro/types"
import { cn } from "@/lib/utils"

type SolutionSlideProps = {
  data: DeckData["solution"]
}

const HIGHLIGHT_ICONS: LucideIcon[] = [
  Palette,
  Shuffle,
  Bot,
  LayoutGrid,
  Sparkles,
  Download,
]

export function SolutionSlide({ data }: SolutionSlideProps) {
  const { fullMotion } = useAnimationProfile()

  return (
    <div className="space-y-10">
      <SectionIntro
        eyebrow="What I shipped"
        heading="One canvas from logo to export"
        description={data.summary}
      />

      <ul className="grid gap-3 sm:grid-cols-2">
        {data.highlights.map((highlight, index) => {
          const Icon = HIGHLIGHT_ICONS[index % HIGHLIGHT_ICONS.length]

          return (
            <motion.li
              key={highlight}
              initial={fullMotion ? { opacity: 0, x: -12 } : false}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.4,
                ease: EASE_OUT_SMOOTH,
                delay: 0.08 + index * 0.06,
              }}
              className={cn(
                "flex items-start gap-3 rounded-xl border border-border/70 bg-muted/20 p-4",
                "transition-colors hover:border-primary/30 hover:bg-primary/5",
              )}
            >
              <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-4" aria-hidden />
              </span>
              <span className="text-sm leading-relaxed text-foreground">{highlight}</span>
            </motion.li>
          )
        })}
      </ul>
    </div>
  )
}
