"use client"

import { motion } from "motion/react"

import { CaseStudyScreenshot } from "@/components/projects/case-study-screenshot"
import { DeckMediaGlow } from "@/components/intro/deck-slide-background"
import { SectionIntro } from "@/components/marketing/section-intro"
import { useAnimationProfile } from "@/hooks/use-can-animate"
import { EASE_OUT_SMOOTH } from "@/lib/motion-easing"
import type { DeckData } from "@/lib/intro/types"

type ProductEditorSlideProps = {
  data: DeckData["productEditor"]
}

export function ProductEditorSlide({ data }: ProductEditorSlideProps) {
  const { fullMotion } = useAnimationProfile()

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Product"
        heading={data.title}
        description={data.description}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_220px] lg:items-start">
        <motion.div
          initial={fullMotion ? { opacity: 0, y: 16 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE_OUT_SMOOTH, delay: 0.1 }}
          className="relative"
        >
          <DeckMediaGlow />
          <CaseStudyScreenshot
            src={data.image.src}
            alt={data.image.alt}
            href={data.image.href}
            label={data.image.label}
          />
        </motion.div>

        <motion.ul
          initial={fullMotion ? { opacity: 0, x: 12 } : false}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: EASE_OUT_SMOOTH, delay: 0.2 }}
          className="space-y-3"
          aria-label="Editor feature callouts"
        >
          {data.callouts.map((callout, index) => (
            <li
              key={callout}
              className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-medium text-foreground"
            >
              <span className="mr-2 text-primary">{String(index + 1).padStart(2, "0")}</span>
              {callout}
            </li>
          ))}
        </motion.ul>
      </div>
    </div>
  )
}
