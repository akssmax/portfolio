"use client"

import { motion } from "motion/react"
import type { ReactNode } from "react"

import { DeckSlideBackground } from "@/components/intro/deck-slide-background"
import { useAnimationProfile } from "@/hooks/use-can-animate"
import { EASE_OUT_SMOOTH } from "@/lib/motion-easing"
import { cn } from "@/lib/utils"

type DeckSlideProps = {
  children: ReactNode
  className?: string
  slideKey: string
}

export function DeckSlide({ children, className, slideKey }: DeckSlideProps) {
  const { fullMotion } = useAnimationProfile()

  return (
    <motion.section
      key={slideKey}
      initial={fullMotion ? { opacity: 0, y: 24 } : false}
      animate={{ opacity: 1, y: 0 }}
      exit={fullMotion ? { opacity: 0, y: -16 } : { opacity: 0 }}
      transition={
        fullMotion
          ? { duration: 0.45, ease: EASE_OUT_SMOOTH }
          : { duration: 0.01 }
      }
      className={cn(
        "relative isolate flex min-h-dvh w-full flex-col justify-center overflow-y-auto overflow-x-hidden px-6 py-20 sm:px-12 lg:px-20",
        className,
      )}
    >
      <DeckSlideBackground className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" />
      <div className="relative mx-auto w-full max-w-6xl">{children}</div>
    </motion.section>
  )
}
