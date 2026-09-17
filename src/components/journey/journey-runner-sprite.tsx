"use client"

import { motion, useReducedMotion } from "motion/react"

import {
  MONOGRAM_ACCENT,
  MONOGRAM_MAIN,
  MONOGRAM_VIEWBOX,
} from "@/lib/brand/monogram-mark"
import { useAnimationProfile } from "@/hooks/use-can-animate"
import { cn } from "@/lib/utils"

type JourneyRunnerSpriteProps = {
  offsetPx: number
  className?: string
}

export function JourneyRunnerSprite({ offsetPx, className }: JourneyRunnerSpriteProps) {
  const { fullMotion } = useAnimationProfile()
  const shouldReduceMotion = useReducedMotion()
  const animate = fullMotion && !shouldReduceMotion

  return (
    <motion.div
      className={cn("pointer-events-none absolute bottom-[calc(18%+8px)] z-20", className)}
      style={{ left: 48 }}
      animate={{ x: offsetPx }}
      transition={{ type: "spring", stiffness: 120, damping: 20, mass: 0.6 }}
    >
      <motion.div
        animate={
          animate
            ? {
                y: [0, -4, 0],
                scaleY: [1, 0.94, 1],
              }
            : undefined
        }
        transition={
          animate
            ? {
                duration: 0.45,
                repeat: Infinity,
                ease: "easeInOut",
              }
            : undefined
        }
        className="size-10 text-foreground sm:size-12"
        aria-hidden
      >
        <svg viewBox={MONOGRAM_VIEWBOX} className="size-full" role="img">
          <path d={MONOGRAM_MAIN} fill="currentColor" />
          <path d={MONOGRAM_ACCENT} fill="currentColor" />
        </svg>
      </motion.div>
    </motion.div>
  )
}
