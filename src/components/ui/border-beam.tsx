"use client"

import * as React from "react"
import { animate, motion, useMotionValue } from "motion/react"

interface BorderBeamProps {
  /** Size of the travelling beam segment. */
  size?: number
  /** Animation duration in seconds. */
  duration?: number
  /** Delay before the animation starts. */
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
 * Magic UI BorderBeam — a light that travels along a container's border.
 *
 * The travelling element carries a native `offset-path: rect(... round ...)`
 * and its `offset-distance` is tweened by Framer Motion (a linear numeric
 * tween) rather than a CSS keyframe, which steps less at the rounded corners.
 * The `.border-beam-ring` mask clips the light to the 1px border ring.
 * Parent must be `relative` and `overflow-hidden`.
 */
export function BorderBeam({
  className,
  size = 50,
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
  // `round` is clamped to half the container's shortest side, so an explicit
  // radius (e.g. a pill's `1.75rem`) hugs the real border; otherwise mirror
  // Magic UI and round by the beam size.
  const cornerRadius = radius ?? `${size}px`
  // Framer Motion's `animate` prop does not treat `offsetDistance` as an
  // animatable CSS property (it snaps straight to the target), so drive it with
  // a MotionValue instead.
  const distance = useMotionValue(`${initialOffset}%`)

  React.useEffect(() => {
    const from = reverse ? `${100 - initialOffset}%` : `${initialOffset}%`
    const to = reverse ? `${-initialOffset}%` : `${100 + initialOffset}%`
    const controls = animate(distance, [from, to], {
      duration,
      delay: -delay,
      ease: "linear",
      repeat: Infinity,
    })
    return () => controls.stop()
  }, [distance, duration, delay, initialOffset, reverse])

  return (
    <div
      className={`border-beam-ring pointer-events-none absolute inset-0 rounded-[inherit] border-(length:--border-beam-width) border-transparent ${className ?? ""}`}
      style={
        {
          "--border-beam-width": `${borderWidth}px`,
          ...(radius ? { borderRadius: radius } : null),
          ...style,
        } as React.CSSProperties
      }
      aria-hidden
    >
      <motion.div
        className="absolute aspect-square"
        style={{
          width: size,
          // Native rounded-rect path — smooth corner interpolation.
          offsetPath: `rect(0 auto auto 0 round ${cornerRadius})`,
          offsetDistance: distance,
          willChange: "offset-distance",
          background: `linear-gradient(to left, ${colorFrom}, ${colorTo}, transparent)`,
        }}
      />
    </div>
  )
}
