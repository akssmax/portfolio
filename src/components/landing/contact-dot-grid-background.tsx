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

/** CSS-only dots — always works, no canvas or color-mix required. */
const STATIC_DOT_GRID_STYLE = {
  backgroundImage:
    "radial-gradient(circle, rgba(255, 255, 255, 0.45) 1.5px, transparent 1.5px)",
  backgroundSize: "24px 24px",
} as const

function StaticDotGrid() {
  return (
    <div className="absolute inset-0" style={STATIC_DOT_GRID_STYLE} aria-hidden />
  )
}

export function ContactDotGridBackground() {
  const shouldReduceMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const { appearance, mounted } = useAppearance()
  const { primary, primaryForeground } = useBrandColors()
  const inView = useInView(containerRef, {
    threshold: 0.05,
    initialInView: true,
    rootMargin: "120px 0px",
    enabled: mounted,
  })

  const showInteractive = mounted && !shouldReduceMotion && inView

  const { baseColor, activeColor } = getPrimarySurfaceDotColors(
    primary,
    primaryForeground,
  )
  const dotGridKey = `${appearance.palette}-${baseColor}-${activeColor}`

  return (
    <div ref={containerRef} className="absolute inset-0">
      {!showInteractive ? <StaticDotGrid /> : null}
      {showInteractive ? (
        <Suspense fallback={<StaticDotGrid />}>
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
