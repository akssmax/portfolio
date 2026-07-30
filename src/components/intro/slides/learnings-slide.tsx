"use client"

import { motion } from "motion/react"
import { CheckCircle2 } from "lucide-react"

import { SectionIntro } from "@/components/marketing/section-intro"
import { useAnimationProfile } from "@/hooks/use-can-animate"
import { EASE_OUT_SMOOTH } from "@/lib/motion-easing"
import type { DeckData } from "@/lib/intro/types"

type LearningsSlideProps = {
  data: DeckData["learnings"]
}

export function LearningsSlide({ data }: LearningsSlideProps) {
  const { fullMotion } = useAnimationProfile()

  return (
    <div className="space-y-10">
      <SectionIntro
        eyebrow="Learnings"
        heading={data.heading}
        description={data.description}
      />

      <ul className="grid gap-3 sm:grid-cols-2">
        {data.items.map((item, index) => (
          <motion.li
            key={item}
            initial={fullMotion ? { opacity: 0, x: -12 } : false}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.4,
              ease: EASE_OUT_SMOOTH,
              delay: 0.08 + index * 0.05,
            }}
            className="flex items-start gap-3 rounded-xl border border-border/70 bg-muted/15 p-4"
          >
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
            <span className="text-sm leading-relaxed text-foreground">{item}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
