"use client"

import { ChevronRight } from "lucide-react"
import { motion } from "motion/react"

import { SectionIntro } from "@/components/marketing/section-intro"
import { useAnimationProfile } from "@/hooks/use-can-animate"
import { EASE_OUT_SMOOTH } from "@/lib/motion-easing"

type JourneyIntroPanelProps = {
  heading: string
  subtitle: string
  journeyStart: string
}

export function JourneyIntroPanel({ heading, subtitle, journeyStart }: JourneyIntroPanelProps) {
  const { fullMotion } = useAnimationProfile()

  return (
    <section className="flex h-full w-screen shrink-0 snap-start flex-col justify-center px-6 sm:px-12">
      <motion.div
        initial={fullMotion ? { opacity: 0, y: 16 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_OUT_SMOOTH }}
        className="max-w-xl space-y-8"
      >
        <SectionIntro eyebrow="Design journey" heading={heading} description={subtitle} />

        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="rounded-full border border-border/60 bg-muted/30 px-3 py-1 font-mono text-xs">
            {journeyStart}
          </span>
          <span aria-hidden>→</span>
          <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-xs text-primary">
            Now
          </span>
        </div>

        <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
          <motion.span
            animate={fullMotion ? { x: [0, 6, 0] } : undefined}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronRight className="size-4" aria-hidden />
          </motion.span>
          Scroll to begin the run
        </div>
      </motion.div>
    </section>
  )
}
