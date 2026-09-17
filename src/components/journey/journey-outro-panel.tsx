"use client"

import { Link } from "@tanstack/react-router"
import { ArrowRight, Sparkles } from "lucide-react"
import { motion } from "motion/react"

import { Button } from "@/components/ui/button"
import { useAnimationProfile } from "@/hooks/use-can-animate"
import { EASE_OUT_SMOOTH } from "@/lib/motion-easing"

export function JourneyOutroPanel() {
  const { fullMotion } = useAnimationProfile()

  return (
    <section className="flex h-full w-screen shrink-0 snap-start flex-col justify-center px-6 sm:px-12">
      <motion.div
        initial={fullMotion ? { opacity: 0, y: 16 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_OUT_SMOOTH }}
        className="max-w-lg space-y-6"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Sparkles className="size-3" aria-hidden />
          End of track
        </span>

        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl font-heading">
          From first app to agentic AI — and still running.
        </h2>

        <p className="text-base leading-relaxed text-muted-foreground">
          Explore case studies, read the full experience timeline, or ask the portfolio AI
          anything about this journey.
        </p>

        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/projects">
              View projects
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/experience">Full experience</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/">Back home</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  )
}
