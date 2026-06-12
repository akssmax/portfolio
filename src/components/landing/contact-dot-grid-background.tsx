"use client"

import { useReducedMotion } from "motion/react"

import DotGrid from "@/components/DotGrid"
import { tintBrandColor, useBrandColors } from "@/hooks/use-brand-colors"

export function ContactDotGridBackground() {
  const shouldReduceMotion = useReducedMotion()
  const { primary, primaryForeground } = useBrandColors()

  if (shouldReduceMotion) {
    return (
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.55) 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      />
    )
  }

  return (
    <DotGrid
      className="absolute inset-0 h-full w-full p-0"
      dotSize={4}
      gap={24}
      baseColor={tintBrandColor(primary)}
      activeColor={primaryForeground}
      proximity={140}
      speedTrigger={60}
      shockRadius={200}
      shockStrength={5}
    />
  )
}
