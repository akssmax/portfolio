"use client"

import { lazy, Suspense, useRef } from "react"
import { useReducedMotion } from "motion/react"

import { useAppearance } from "@/components/appearance-provider"
import { useInView } from "@/hooks/use-in-view"
import {
  getPrimarySurfaceDotColors,
  useBrandColors,
} from "@/hooks/use-brand-colors"

const DotGrid = lazy(() => import("@/components/DotGrid"))

const DOT_GRID_CLASS = "absolute inset-0 h-full w-full p-0"
const STATIC_DOT_GRID_STYLE = {
  backgroundImage:
    "radial-gradient(circle, color-mix(in oklch, var(--primary-foreground) 55%, var(--primary)) 1.5px, transparent 1.5px)",
  backgroundSize: "24px 24px",
} as const

export function ContactDotGridBackground() {
  const shouldReduceMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(containerRef, { threshold: 0.05, initialInView: false })
  const { appearance, mounted } = useAppearance()
  const { primary, primaryForeground } = useBrandColors()

  if (shouldReduceMotion) {
    return (
      <div
        className="absolute inset-0"
        style={STATIC_DOT_GRID_STYLE}
      />
    )
  }

  if (!mounted) {
    return <div className="absolute inset-0" style={STATIC_DOT_GRID_STYLE} />
  }

  const { baseColor, activeColor } = getPrimarySurfaceDotColors(
    primary,
    primaryForeground,
  )
  const dotGridKey = `${appearance.palette}-${baseColor}-${activeColor}`

  return (
    <div ref={containerRef} className="absolute inset-0">
      {inView ? (
        <Suspense fallback={<div className={DOT_GRID_CLASS} style={STATIC_DOT_GRID_STYLE} />}>
          <DotGrid
            key={dotGridKey}
            className={DOT_GRID_CLASS}
            dotSize={4}
            gap={24}
            baseColor={baseColor}
            activeColor={activeColor}
            proximity={140}
            speedTrigger={60}
            shockRadius={200}
            shockStrength={5}
          />
        </Suspense>
      ) : null}
    </div>
  )
}
