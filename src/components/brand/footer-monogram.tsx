"use client"

import {
  motion,
  useReducedMotion,
  type Transition,
  type Variants,
} from "motion/react"

import { cn } from "@/lib/utils"

export const MONOGRAM_VIEWBOX = "-64 0 205 153"

export const MONOGRAM_MAIN =
  "M34.9006 153H-64L38.4806 0L64.9829 39.5669L15.5068 113.433H61.4801L34.9006 153Z"

export const MONOGRAM_ACCENT =
  "M79.9728 153L106.462 113.433H61.4805L87.9441 73.8148L141 153H79.9728Z"

export const MONOGRAM_ANIMATIONS = [
  {
    id: "draw",
    label: "Draw",
    description: "Primary stroke traces the mark on hover while the fill softens.",
  },
  {
    id: "trace",
    label: "Trace",
    description: "Fast simultaneous stroke trace with a snappy ease.",
  },
  {
    id: "glow",
    label: "Glow",
    description: "Stroke draw with a primary glow and lifted fill.",
  },
  {
    id: "pulse",
    label: "Pulse",
    description: "Spring scale pulse on the filled mark — no stroke layer.",
  },
  {
    id: "shift",
    label: "Shift",
    description: "Accent piece slides and rotates into place on hover.",
  },
  {
    id: "reveal",
    label: "Reveal",
    description: "Mark scales up from the baseline with a fade-in.",
  },
  {
    id: "loop",
    label: "Loop",
    description: "Continuous stroke loop for loading or decorative states.",
  },
  {
    id: "none",
    label: "None",
    description: "Static watermark with no motion.",
  },
] as const

export type MonogramAnimation = (typeof MONOGRAM_ANIMATIONS)[number]["id"]
export type MonogramSize = "sm" | "md" | "lg" | "footer"
export type MonogramTrigger = "hover" | "always"

const containerVariants: Variants = {
  rest: {},
  hover: {},
  active: {},
}

const sizeClasses: Record<MonogramSize, string> = {
  sm: "h-16 w-full max-w-xs",
  md: "h-24 w-full max-w-md",
  lg: "h-32 w-full max-w-2xl",
  footer:
    "h-32 w-full max-w-4xl sm:h-40 md:h-48 lg:h-56 xl:max-w-5xl",
}

const fillToneClasses = {
  muted: "text-muted-foreground/20",
  subtle: "text-muted-foreground/30",
  foreground: "text-foreground/10",
} as const

const strokeToneClasses = {
  primary: "text-primary",
  foreground: "text-foreground",
  accent: "text-accent-foreground",
} as const

type AnimationConfig = {
  showStroke: boolean
  svgVariants?: Variants
  fillVariants?: Variants
  mainStrokeVariants?: Variants
  accentStrokeVariants?: Variants
  mainFillVariants?: Variants
  accentFillVariants?: Variants
  strokeTransition?: Transition
  accentStrokeTransition?: Transition
  svgClassName?: string
}

function getAnimationConfig(animation: MonogramAnimation): AnimationConfig {
  switch (animation) {
    case "draw":
      return {
        showStroke: true,
        fillVariants: {
          rest: { opacity: 1 },
          hover: { opacity: 0.55, transition: { duration: 0.35, ease: "easeOut" } },
        },
        mainStrokeVariants: {
          rest: { pathLength: 0, opacity: 0 },
          hover: { pathLength: 1, opacity: 1 },
        },
        accentStrokeVariants: {
          rest: { pathLength: 0, opacity: 0 },
          hover: { pathLength: 1, opacity: 1 },
        },
        strokeTransition: { duration: 0.9, ease: [0.42, 0, 0.2, 1] },
        accentStrokeTransition: { duration: 0.9, ease: [0.42, 0, 0.2, 1], delay: 0.2 },
      }

    case "trace":
      return {
        showStroke: true,
        fillVariants: {
          rest: { opacity: 0.85 },
          hover: { opacity: 0.4, transition: { duration: 0.25 } },
        },
        mainStrokeVariants: {
          rest: { pathLength: 0, opacity: 0 },
          hover: { pathLength: 1, opacity: 1 },
        },
        accentStrokeVariants: {
          rest: { pathLength: 0, opacity: 0 },
          hover: { pathLength: 1, opacity: 1 },
        },
        strokeTransition: { duration: 0.45, ease: "easeOut" },
        accentStrokeTransition: { duration: 0.45, ease: "easeOut", delay: 0.08 },
      }

    case "glow":
      return {
        showStroke: true,
        svgVariants: {
          rest: { filter: "drop-shadow(0 0 0 transparent)" },
          hover: {
            filter: "drop-shadow(0 0 18px color-mix(in oklch, var(--primary) 45%, transparent))",
            transition: { duration: 0.4 },
          },
        },
        fillVariants: {
          rest: { opacity: 1 },
          hover: { opacity: 0.7, transition: { duration: 0.35 } },
        },
        mainStrokeVariants: {
          rest: { pathLength: 0, opacity: 0 },
          hover: { pathLength: 1, opacity: 1 },
        },
        accentStrokeVariants: {
          rest: { pathLength: 0, opacity: 0 },
          hover: { pathLength: 1, opacity: 1 },
        },
        strokeTransition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
        accentStrokeTransition: { duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.12 },
        svgClassName: "transition-[filter]",
      }

    case "pulse":
      return {
        showStroke: false,
        svgVariants: {
          rest: { scale: 1 },
          hover: {
            scale: [1, 1.04, 1.02],
            transition: { duration: 0.55, ease: "easeOut" },
          },
        },
        fillVariants: {
          rest: { opacity: 1 },
          hover: {
            opacity: [1, 0.55, 0.75],
            transition: { duration: 0.55, ease: "easeOut" },
          },
        },
      }

    case "shift":
      return {
        showStroke: false,
        mainFillVariants: {
          rest: { x: 0, rotate: 0 },
          hover: {
            x: -2,
            rotate: -1.5,
            transition: { type: "spring", stiffness: 320, damping: 22 },
          },
        },
        accentFillVariants: {
          rest: { x: 0, y: 0, rotate: 0, opacity: 1 },
          hover: {
            x: 6,
            y: -4,
            rotate: 3,
            opacity: 0.9,
            transition: { type: "spring", stiffness: 360, damping: 20, delay: 0.04 },
          },
        },
      }

    case "reveal":
      return {
        showStroke: false,
        svgVariants: {
          rest: { scale: 0.94, y: 8, opacity: 0.65 },
          hover: {
            scale: 1,
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 260, damping: 24 },
          },
        },
        fillVariants: {
          rest: { opacity: 0.7 },
          hover: { opacity: 1, transition: { duration: 0.35 } },
        },
      }

    case "loop":
      return {
        showStroke: true,
      }

    case "none":
    default:
      return { showStroke: false }
  }
}

export type FooterMonogramProps = {
  animation?: MonogramAnimation
  size?: MonogramSize
  fillTone?: keyof typeof fillToneClasses
  strokeTone?: keyof typeof strokeToneClasses
  trigger?: MonogramTrigger
  strokeWidth?: number
  wrapperClassName?: string
  className?: string
}

export function FooterMonogram({
  animation = "draw",
  size = "footer",
  fillTone = "muted",
  strokeTone = "primary",
  trigger = "hover",
  strokeWidth = 2.5,
  wrapperClassName,
  className,
}: FooterMonogramProps) {
  const shouldReduceMotion = useReducedMotion()
  const config = getAnimationConfig(animation)
  const useMotion = !shouldReduceMotion && animation !== "none"
  const isLoop = animation === "loop" && useMotion

  const containerMotionProps = useMotion
    ? isLoop
      ? {}
      : trigger === "always"
        ? { initial: "hover", animate: "hover" as const }
        : {
            initial: "rest" as const,
            whileHover: "hover" as const,
            animate: "rest" as const,
          }
    : {}

  const interactionVariant = trigger === "always" ? "hover" : undefined

  const loopStrokeTransition: Transition = {
    duration: 2.2,
    ease: "easeInOut",
    repeat: Infinity,
  }

  return (
    <motion.div
      className={cn(
        "group/monogram flex w-full justify-center overflow-hidden",
        size === "footer" && "pt-4 pb-10 sm:pt-6 sm:pb-12",
        wrapperClassName,
      )}
      variants={useMotion ? containerVariants : undefined}
      {...containerMotionProps}
    >
      <motion.svg
        viewBox={MONOGRAM_VIEWBOX}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className={cn(
          sizeClasses[size],
          fillToneClasses[fillTone],
          config.svgClassName,
          className,
        )}
        variants={useMotion ? config.svgVariants : undefined}
        style={{ originX: 0.5, originY: 1 }}
      >
        <motion.path
          d={MONOGRAM_MAIN}
          fill="currentColor"
          variants={useMotion ? (config.mainFillVariants ?? config.fillVariants) : undefined}
          animate={interactionVariant}
          style={{ originX: "0.2", originY: "0.5" }}
        />
        <motion.path
          d={MONOGRAM_ACCENT}
          fill="currentColor"
          variants={useMotion ? (config.accentFillVariants ?? config.fillVariants) : undefined}
          animate={interactionVariant}
          style={{ originX: "0.75", originY: "0.75" }}
        />

        {useMotion && config.showStroke ? (
          <>
            <motion.path
              d={MONOGRAM_MAIN}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
              strokeLinecap="round"
              className={strokeToneClasses[strokeTone]}
              variants={isLoop ? undefined : config.mainStrokeVariants}
              transition={isLoop ? loopStrokeTransition : config.strokeTransition}
              animate={
                isLoop
                  ? { pathLength: [0, 1, 0], opacity: [0.15, 1, 0.15] }
                  : trigger === "always"
                    ? { pathLength: 1, opacity: 1 }
                    : interactionVariant
              }
            />
            <motion.path
              d={MONOGRAM_ACCENT}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
              strokeLinecap="round"
              className={strokeToneClasses[strokeTone]}
              variants={isLoop ? undefined : config.accentStrokeVariants}
              transition={
                isLoop
                  ? { ...loopStrokeTransition, delay: 0.35 }
                  : (config.accentStrokeTransition ?? config.strokeTransition)
              }
              animate={
                isLoop
                  ? { pathLength: [0, 1, 0], opacity: [0.15, 1, 0.15] }
                  : trigger === "always"
                    ? { pathLength: 1, opacity: 1 }
                    : interactionVariant
              }
            />
          </>
        ) : null}
      </motion.svg>
    </motion.div>
  )
}
