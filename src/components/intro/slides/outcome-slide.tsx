"use client"

import { Link } from "@tanstack/react-router"
import { motion } from "motion/react"
import { ArrowUpRight, ExternalLink } from "lucide-react"

import { MetricsBlockComponent } from "@/components/projects/blocks/metrics-block"
import { SectionIntro } from "@/components/marketing/section-intro"
import { Button } from "@/components/ui/button"
import { useAnimationProfile } from "@/hooks/use-can-animate"
import { EASE_OUT_SMOOTH } from "@/lib/motion-easing"
import type { DeckData } from "@/lib/intro/types"

type OutcomeSlideProps = {
  data: DeckData["outcome"]
}

export function OutcomeSlide({ data }: OutcomeSlideProps) {
  const { fullMotion } = useAnimationProfile()

  return (
    <div className="space-y-10">
      <SectionIntro eyebrow="Outcome" heading="Shipped end to end" description={data.statement} />

      <motion.div
        initial={fullMotion ? { opacity: 0, y: 16 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE_OUT_SMOOTH, delay: 0.1 }}
      >
        <MetricsBlockComponent
          block={{
            _type: "metrics",
            _key: "deck-outcome-metrics",
            items: data.stats.map((stat, index) => ({
              ...stat,
              _key: `outcome-stat-${index}`,
            })),
          }}
        />
      </motion.div>

      <motion.div
        initial={fullMotion ? { opacity: 0, y: 16 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE_OUT_SMOOTH, delay: 0.18 }}
        className="flex flex-wrap items-center gap-3"
      >
        <Button asChild size="lg">
          <a href={data.liveUrl} target="_blank" rel="noopener noreferrer">
            {data.ctaLabel}
            <ExternalLink className="size-4" aria-hidden />
          </a>
        </Button>

        <Button asChild variant="outline" size="lg">
          <Link to="/projects/$slug" params={{ slug: "postforge" }}>
            Full case study
            <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </motion.div>

      <motion.p
        initial={fullMotion ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.26 }}
        className="text-sm text-muted-foreground"
      >
        Built with {data.stack.join(" · ")}
      </motion.p>
    </div>
  )
}
