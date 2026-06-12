"use client"

import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

type HeroRotatingTextProps = {
  lines: readonly string[]
  index: number
  variant: "headline" | "tagline"
  className?: string
}

export function HeroRotatingHeadline({
  lines,
  index,
  className,
}: Omit<HeroRotatingTextProps, "variant">) {
  return (
    <HeroRotatingText
      lines={lines}
      index={index}
      variant="headline"
      className={className}
    />
  )
}

export function HeroRotatingTagline({
  lines,
  index,
  className,
}: Omit<HeroRotatingTextProps, "variant">) {
  return (
    <HeroRotatingText
      lines={lines}
      index={index}
      variant="tagline"
      className={className}
    />
  )
}

function HeroRotatingText({
  lines,
  index,
  variant,
  className,
}: HeroRotatingTextProps) {
  const shouldReduceMotion = useReducedMotion()
  const safeIndex = lines.length > 0 ? ((index % lines.length) + lines.length) % lines.length : 0
  const line = lines[safeIndex] ?? ""
  const isHeadline = variant === "headline"

  const Tag = isHeadline ? "h1" : "p"

  return (
    <Tag
      className={cn(
        isHeadline
          ? "text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl"
          : "max-w-xl text-base text-balance text-muted-foreground sm:text-lg",
        className,
      )}
    >
      <span
        className={cn(
          "relative block overflow-hidden",
          isHeadline
            ? "min-h-[1.15em] sm:min-h-[1.1em] lg:min-h-[1.05em]"
            : "min-h-[3.25rem] sm:min-h-[3rem]",
        )}
      >
        <span className="grid [&>*]:col-start-1 [&>*]:row-start-1">
          <AnimatePresence initial={false}>
            <motion.span
              key={safeIndex}
              className={cn(
                "block will-change-[transform,opacity,filter]",
                isHeadline && "origin-left",
              )}
              initial={
                shouldReduceMotion
                  ? false
                  : isHeadline
                    ? { opacity: 0, x: 32, filter: "blur(8px)" }
                    : { opacity: 0, y: 14 }
              }
              animate={
                isHeadline
                  ? {
                      opacity: 1,
                      x: 0,
                      filter: "blur(0px)",
                      transition: {
                        type: "spring",
                        stiffness: 400,
                        damping: 32,
                        mass: 0.8,
                      },
                    }
                  : {
                      opacity: 1,
                      y: 0,
                      transition: {
                        type: "spring",
                        stiffness: 320,
                        damping: 36,
                        mass: 0.9,
                        delay: 0.08,
                      },
                    }
              }
              exit={
                shouldReduceMotion
                  ? undefined
                  : isHeadline
                    ? {
                        opacity: 0,
                        x: -32,
                        filter: "blur(8px)",
                        transition: {
                          duration: 0.22,
                          ease: [0.55, 0, 1, 0.45],
                        },
                      }
                    : {
                        opacity: 0,
                        y: -10,
                        transition: {
                          duration: 0.18,
                          ease: [0.55, 0, 1, 0.45],
                        },
                      }
              }
            >
              {line}
            </motion.span>
          </AnimatePresence>
        </span>
      </span>
    </Tag>
  )
}
