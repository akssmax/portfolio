"use client"

import * as React from "react"
import { animate, motion, useMotionTemplate, useMotionValue } from "motion/react"
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
  const angle = useMotionValue(startAngle)
  const arc = Math.min(359, Math.max(1, size))
  const background = useMotionTemplate`conic-gradient(from ${angle}deg, transparent 0deg, ${colorTo} ${arc * 0.35}deg, ${colorFrom} ${arc * 0.7}deg, transparent ${arc}deg)`

  React.useEffect(() => {
    angle.set(startAngle)
    if (!canAnimate || duration <= 0) return

    const controls = animate(angle, [startAngle, startAngle + (reverse ? -360 : 360)], {
      duration,
      delay: -delay,
      ease: "linear",
      repeat: Infinity,
    })
    return () => controls.stop()
  }, [angle, canAnimate, duration, delay, startAngle, reverse])

  return (
    <motion.div
      className={`border-beam-ring pointer-events-none absolute inset-0 rounded-[inherit] ${className ?? ""}`}
      style={{
        padding: borderWidth,
        background,
        ...(radius ? { borderRadius: radius } : null),
        ...style,
      }}
      aria-hidden
    />
  )
}
