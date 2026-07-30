"use client"

import { motion } from "motion/react"

import { MetricsBlockComponent } from "@/components/projects/blocks/metrics-block"
import { SectionIntro } from "@/components/marketing/section-intro"
import { useAnimationProfile } from "@/hooks/use-can-animate"
import { EASE_OUT_SMOOTH } from "@/lib/motion-easing"
import type { DeckData } from "@/lib/intro/types"

type ContextSlideProps = {
  data: DeckData["context"]
}

export function ContextSlide({ data }: ContextSlideProps) {
  const { fullMotion } = useAnimationProfile()

  return (
    <div className="space-y-10">
      <SectionIntro
        eyebrow="Context"
        heading="Brand-first social design"
        description={data.subtitle}
      />

      <motion.div
        initial={fullMotion ? { opacity: 0, y: 16 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE_OUT_SMOOTH, delay: 0.1 }}
        className="max-w-3xl space-y-4"
      >
        {data.paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-base leading-7 text-muted-foreground">
            {paragraph}
          </p>
        ))}
      </motion.div>

      <motion.div
        initial={fullMotion ? { opacity: 0, y: 16 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE_OUT_SMOOTH, delay: 0.2 }}
      >
        <MetricsBlockComponent
          block={{
            _type: "metrics",
            _key: "deck-context-metrics",
            items: data.stats.map((stat, index) => ({
              ...stat,
              _key: `deck-stat-${index}`,
            })),
          }}
        />
      </motion.div>
    </div>
  )
}
