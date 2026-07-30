"use client"

import { motion } from "motion/react"

import { SectionIntro } from "@/components/marketing/section-intro"
import { useAnimationProfile } from "@/hooks/use-can-animate"
import { EASE_OUT_SMOOTH } from "@/lib/motion-easing"
import type { DeckData } from "@/lib/intro/types"

type DesignDecisionsSlideProps = {
  decisions: DeckData["designDecisions"]
}

export function DesignDecisionsSlide({ decisions }: DesignDecisionsSlideProps) {
  const { fullMotion } = useAnimationProfile()

  return (
    <div className="space-y-10">
      <SectionIntro
        eyebrow="Design decisions"
        heading="Principles that shaped the product"
      />

      <ol className="grid gap-4 sm:grid-cols-2">
        {decisions.map((decision, index) => (
          <motion.li
            key={decision}
            initial={fullMotion ? { opacity: 0, y: 14 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              ease: EASE_OUT_SMOOTH,
              delay: 0.08 + index * 0.07,
            }}
            className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-violet-500/5 to-transparent p-5"
          >
            <span className="mb-3 inline-flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {index + 1}
            </span>
            <p className="text-sm leading-relaxed text-foreground">{decision}</p>
          </motion.li>
        ))}
      </ol>
    </div>
  )
}
