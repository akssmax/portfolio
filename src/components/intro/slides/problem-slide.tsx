"use client"

import { motion } from "motion/react"
import { AlertCircle } from "lucide-react"

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
      <SectionIntro eyebrow="The challenge" heading="Design without brand context" />

      <motion.blockquote
        initial={fullMotion ? { opacity: 0, y: 20 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_OUT_SMOOTH, delay: 0.12 }}
        className="relative max-w-4xl border-l-4 border-primary pl-6 sm:pl-8"
      >
        <AlertCircle
          className="absolute -left-3 top-0 size-6 rounded-full bg-background text-primary sm:-left-4"
          aria-hidden
        />
        <p className="font-heading text-2xl leading-snug font-medium tracking-tight text-balance sm:text-3xl lg:text-4xl">
          {data.statement}
        </p>
      </motion.blockquote>
    </div>
  )
}
