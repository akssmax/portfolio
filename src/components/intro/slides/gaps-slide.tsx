"use client"

import { motion } from "motion/react"
import { MinusCircle } from "lucide-react"

import { SectionIntro } from "@/components/marketing/section-intro"
import { useAnimationProfile } from "@/hooks/use-can-animate"
import { EASE_OUT_SMOOTH } from "@/lib/motion-easing"
import type { DeckData } from "@/lib/intro/types"

type GapsSlideProps = {
  data: DeckData["gaps"]
}

export function GapsSlide({ data }: GapsSlideProps) {
  const { fullMotion } = useAnimationProfile()

  return (
    <div className="space-y-10">
      <SectionIntro eyebrow="Current gaps" heading={data.heading} description={data.description} />

      <ul className="space-y-3">
        {data.items.map((item, index) => (
          <motion.li
            key={item.gap}
            initial={fullMotion ? { opacity: 0, y: 12 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              ease: EASE_OUT_SMOOTH,
              delay: 0.08 + index * 0.05,
            }}
            className="grid gap-2 rounded-xl border border-border/70 bg-muted/10 p-4 sm:grid-cols-[1fr_1.2fr] sm:gap-6 sm:p-5"
          >
            <div className="flex items-start gap-2">
              <MinusCircle className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
              <p className="text-sm font-medium text-foreground">{item.gap}</p>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground sm:border-l sm:border-border/60 sm:pl-6">
              {item.impact}
            </p>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
