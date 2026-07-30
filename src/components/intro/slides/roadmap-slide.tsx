"use client"

import { motion } from "motion/react"
import { ExternalLink, Map, X } from "lucide-react"

import { SectionIntro } from "@/components/marketing/section-intro"
import { Button } from "@/components/ui/button"
import { useAnimationProfile } from "@/hooks/use-can-animate"
import { EASE_OUT_SMOOTH } from "@/lib/motion-easing"
import type { DeckData } from "@/lib/intro/types"
import { cn } from "@/lib/utils"

type RoadmapSlideProps = {
  data: DeckData["roadmap"]
  onEndPresentation?: () => void
}

const HORIZON_ACCENT = [
  "border-primary/30 bg-primary/5",
  "border-violet-500/30 bg-violet-500/5",
  "border-fuchsia-500/30 bg-fuchsia-500/5",
]

export function RoadmapSlide({ data, onEndPresentation }: RoadmapSlideProps) {
  const { fullMotion } = useAnimationProfile()

  return (
    <div className="space-y-10">
      <SectionIntro eyebrow="Roadmap" heading={data.heading} description={data.description} />

      <div
        className={cn(
          "grid gap-4",
          data.horizons.length > 2 ? "lg:grid-cols-3" : "lg:grid-cols-[1.4fr_0.6fr]",
        )}
      >
        {data.horizons.map((horizon, index) => (
          <motion.div
            key={horizon.label}
            initial={fullMotion ? { opacity: 0, y: 16 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.45,
              ease: EASE_OUT_SMOOTH,
              delay: 0.1 + index * 0.08,
            }}
            className={cn(
              "rounded-xl border p-5",
              HORIZON_ACCENT[index % HORIZON_ACCENT.length],
            )}
          >
            <div className="mb-4 flex items-center gap-2">
              <Map className="size-4 text-primary" aria-hidden />
              <p className="text-xs font-semibold tracking-wider text-primary uppercase">
                {horizon.label}
              </p>
            </div>
            <ul
              className={cn(
                "space-y-2",
                horizon.items.length > 5 && "sm:columns-2 sm:gap-x-6 sm:space-y-2",
              )}
            >
              {horizon.items.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 break-inside-avoid text-sm text-foreground"
                >
                  <span className="mt-2 size-1 shrink-0 rounded-full bg-primary/60" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={fullMotion ? { opacity: 0, y: 16 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE_OUT_SMOOTH, delay: 0.34 }}
        className="flex flex-wrap items-center gap-3"
      >
        <Button asChild size="lg">
          <a href={data.liveUrl} target="_blank" rel="noopener noreferrer">
            {data.ctaLabel}
            <ExternalLink className="size-4" aria-hidden />
          </a>
        </Button>

        {onEndPresentation ? (
          <Button type="button" variant="outline" size="lg" onClick={onEndPresentation}>
            End presentation
            <X className="size-4" aria-hidden />
          </Button>
        ) : null}
      </motion.div>
    </div>
  )
}
