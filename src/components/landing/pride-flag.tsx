"use client"

import { useReducedMotion } from "motion/react"

import styles from "@/components/landing/pride-flag.module.css"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  generatePrideGradient,
  PRIDE_FLAG_COLORS,
} from "@/lib/pride-colors"
import { cn } from "@/lib/utils"

type PrideFlagProps = {
  colors?: readonly string[]
  numOfColumns?: number
  staggeredDelay?: number
  billow?: number
  animated?: boolean
  className?: string
  "aria-label"?: string
}

export function PrideFlag({
  colors = PRIDE_FLAG_COLORS,
  numOfColumns,
  staggeredDelay = 50,
  billow = 1.5,
  animated = true,
  className,
  "aria-label": ariaLabel = "Rainbow pride flag",
}: PrideFlagProps) {
  const shouldReduceMotion = useReducedMotion()
  const isMobile = useIsMobile()
  const columnCount = numOfColumns ?? (isMobile ? 12 : 16)
  const gradient = generatePrideGradient(colors)
  const firstColumnDelay = columnCount * staggeredDelay * -1
  const isStatic = shouldReduceMotion || !animated

  return (
    <div
      className={cn(
        styles.flag,
        isStatic && styles.static,
        "aspect-[3/2]",
        className,
      )}
      role="img"
      aria-label={ariaLabel}
    >
      {Array.from({ length: columnCount }, (_, index) => (
        <div
          key={index}
          className={styles.column}
          style={{
            background: gradient,
            ["--billow" as string]: `${index * billow}px`,
            animationDelay: `${firstColumnDelay + index * staggeredDelay}ms`,
          }}
        />
      ))}
    </div>
  )
}
