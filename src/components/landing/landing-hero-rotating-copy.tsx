"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"

import { useAnimationProfile } from "@/hooks/use-can-animate"
import { useHydrated } from "@/hooks/use-hydrated"
import { cn } from "@/lib/utils"

export type HeroCopySlide = {
  title: string
  subtitle: string
}

type LandingHeroRotatingCopyProps = {
  slides: readonly HeroCopySlide[]
  intervalMs?: number
  className?: string
}

const DEFAULT_INTERVAL_MS = 7500

const blockVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.04,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.06,
      staggerDirection: -1,
    },
  },
}

const fullTitleVariants = {
  hidden: {
    opacity: 0,
    y: 28,
    rotateX: -14,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 260,
      damping: 28,
      mass: 0.85,
    },
  },
  exit: {
    opacity: 0,
    y: -22,
    rotateX: 10,
    scale: 0.98,
    transition: {
      duration: 0.45,
      ease: [0.55, 0.06, 0.22, 1] as const,
    },
  },
}

const fullSubtitleVariants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 32,
      mass: 0.75,
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: {
      duration: 0.32,
      ease: [0.55, 0.06, 0.22, 1] as const,
    },
  },
}

const lightTitleVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.28, ease: [0.55, 0.06, 0.22, 1] as const },
  },
}

const lightSubtitleVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const, delay: 0.06 },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.24, ease: [0.55, 0.06, 0.22, 1] as const },
  },
}

export function LandingHeroRotatingCopy({
  slides,
  intervalMs = DEFAULT_INTERVAL_MS,
  className,
}: LandingHeroRotatingCopyProps) {
  const hydrated = useHydrated()
  const { canAnimate, fullMotion } = useAnimationProfile()
  const shouldAnimate = hydrated && canAnimate && slides.length > 1

  const titleVariants = fullMotion ? fullTitleVariants : lightTitleVariants
  const subtitleVariants = fullMotion ? fullSubtitleVariants : lightSubtitleVariants

  const [index, setIndex] = React.useState(0)
  const safeIndex = slides.length > 0 ? index % slides.length : 0
  const slide = slides[safeIndex]

  React.useEffect(() => {
    if (!shouldAnimate) return
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length)
    }, intervalMs)
    return () => window.clearInterval(timer)
  }, [intervalMs, shouldAnimate, slides.length])

  if (!slide) return null

  return (
    <div
      className={cn(
        "flex min-h-[112px] w-full flex-col items-center justify-center sm:min-h-[144px]",
        className,
      )}
    >
      <div className={cn("w-full", fullMotion && "[perspective:1200px]")}>
        {shouldAnimate ? (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={safeIndex}
              className="space-y-3"
              variants={blockVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.h1
                variants={titleVariants}
                className={cn(
                  "origin-bottom text-4xl font-semibold tracking-tight text-balance text-foreground font-heading leading-tight sm:text-5xl lg:text-6xl",
                  fullMotion && "[transform-style:preserve-3d]",
                )}
              >
                {slide.title}
              </motion.h1>
              <motion.p
                variants={subtitleVariants}
                className="mx-auto max-w-2xl text-base text-muted-foreground leading-relaxed text-balance sm:text-lg"
              >
                {slide.subtitle}
              </motion.p>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight text-balance text-foreground font-heading leading-tight sm:text-5xl lg:text-6xl">
              {slide.title}
            </h1>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground leading-relaxed text-balance sm:text-lg">
              {slide.subtitle}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
