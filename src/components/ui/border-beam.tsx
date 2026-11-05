"use client"

import * as React from "react"
import { useAnimationProfile } from "@/hooks/use-can-animate"

interface BorderBeamProps {
  /** Angular length of the lit arc, in degrees. */
  size?: number
  /** Animation duration in seconds. */
  duration?: number
  /** Phase offset in seconds. */
  delay?: number
  colorFrom?: string
  colorTo?: string
  className?: string
  style?: React.CSSProperties
  reverse?: boolean
  /** Initial offset position (0-100). */
  initialOffset?: number
  borderWidth?: number
  /** Border radius of the container the beam hugs (CSS length). Defaults to `inherit`. */
  radius?: string
}

/**
 * A sweeping arc of light, masked to the parent's rounded border.
 * Animate the gradient's angle rather than rotating a square along a path,
 * so the arc stays continuous through tight corners and container resizing.
 * The angle is a registered CSS custom property animated by a CSS keyframe,
 * so the sweep runs without per-frame JavaScript or DOM writes.
 * Parent must be `relative`; its border radius is inherited by default.
 */
export function BorderBeam({
  className,
  size = 120,
  delay = 0,
  duration = 6,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
  style,
  reverse = false,
  initialOffset = 0,
  borderWidth = 1,
  radius,
}: BorderBeamProps) {
  const { canAnimate } = useAnimationProfile()
  const startAngle = (reverse ? 100 - initialOffset : initialOffset) * 3.6
  const arc = Math.min(359, Math.max(1, size))
  const animated = canAnimate && duration > 0

  return (
    <div
      className={`border-beam-ring pointer-events-none absolute inset-0 rounded-[inherit] ${className ?? ""}`}
      data-animated={animated ? "true" : undefined}
      style={
        {
          "--beam-start": `${startAngle}deg`,
          "--beam-duration": `${duration}s`,
          "--beam-delay": `${-delay}s`,
          "--beam-direction": reverse ? "reverse" : "normal",
          padding: borderWidth,
          background: `conic-gradient(from var(--beam-angle), transparent 0deg, ${colorTo} ${arc * 0.35}deg, ${colorFrom} ${arc * 0.7}deg, transparent ${arc}deg)`,
          ...(radius ? { borderRadius: radius } : null),
          ...style,
        } as React.CSSProperties
      }
      aria-hidden
    />
  )
}
