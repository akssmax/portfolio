"use client"

import { motion } from "motion/react"
import {
  Image,
  Layers,
  PanelRight,
  Rocket,
  Shuffle,
  type LucideIcon,
} from "lucide-react"

import { SectionIntro } from "@/components/marketing/section-intro"
import { useAnimationProfile } from "@/hooks/use-can-animate"
import { EASE_OUT_SMOOTH } from "@/lib/motion-easing"
import type { DeckData } from "@/lib/intro/types"

type AssumptionsSlideProps = {
  data: DeckData["assumptions"]
}

const ASSUMPTION_ICONS: LucideIcon[] = [Image, Shuffle, PanelRight, Layers, Rocket]

export function AssumptionsSlide({ data }: AssumptionsSlideProps) {
  const { fullMotion } = useAnimationProfile()

  return (
    <div className="space-y-10">
      <SectionIntro
        eyebrow="Assumptions"
        heading={data.heading}
        description={data.description}
      />

      <ol className="grid gap-4 sm:grid-cols-2">
        {data.items.map((item, index) => {
          const Icon = ASSUMPTION_ICONS[index % ASSUMPTION_ICONS.length]

          return (
            <motion.li
              key={item.title}
              initial={fullMotion ? { opacity: 0, y: 14 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                ease: EASE_OUT_SMOOTH,
                delay: 0.08 + index * 0.06,
              }}
              className="rounded-xl border border-border/70 bg-muted/15 p-5"
            >
              <div className="mb-3 flex items-center gap-3">
                <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4" aria-hidden />
                </span>
                <p className="flex min-h-8 flex-1 items-center text-sm font-semibold leading-snug text-foreground">
                  {item.title}
                </p>
              </div>
              <p className="pl-11 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
            </motion.li>
          )
        })}
      </ol>
    </div>
  )
}
