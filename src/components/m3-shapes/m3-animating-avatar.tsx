"use client"

import * as React from "react"
import { animate, useReducedMotion } from "motion/react"
import { Bot } from "lucide-react"

import { getM3ShapePath, M3_SHAPE_VIEWBOX } from "@/lib/m3-shape-paths"
import type { M3ShapeId } from "@/lib/m3-shapes"
import { createShapeMorphInterpolator } from "@/lib/m3-shape-morph"
import { cn } from "@/lib/utils"

const AVATAR_SHAPES: M3ShapeId[] = [
  "circle",
  "puffy",
  "flower",
  "arch",
  "very-sunny",
  "bun",
  "12-sided-cookie"
]

type M3AnimatingAvatarProps = {
  className?: string
}

export function M3AnimatingAvatar({ className }: M3AnimatingAvatarProps) {
  const shouldReduceMotion = useReducedMotion()
  const indexRef = React.useRef(0)
  const isMorphing = React.useRef(false)
  const [pathD, setPathD] = React.useState(
    () => getM3ShapePath(AVATAR_SHAPES[0]) ?? ""
  )

  const triggerMorph = React.useCallback(async () => {
    if (isMorphing.current || AVATAR_SHAPES.length < 2 || shouldReduceMotion) return

    const fromIndex = indexRef.current
    const toIndex = (fromIndex + 1) % AVATAR_SHAPES.length
    const fromShape = AVATAR_SHAPES[fromIndex]
    const toShape = AVATAR_SHAPES[toIndex]

    isMorphing.current = true

    try {
      const interpolator = createShapeMorphInterpolator(fromShape, toShape)
      if (interpolator) {
        await animate(0, 1, {
          duration: 1.2,
          ease: [0.45, 0, 0.25, 1],
          onUpdate: (latest) => {
            setPathD(interpolator(latest))
          }
        }).finished
      } else {
        const nextPath = getM3ShapePath(toShape)
        if (nextPath) setPathD(nextPath)
      }
      indexRef.current = toIndex
    } catch (e) {
      console.error("Avatar shape morph failed:", e)
      const nextPath = getM3ShapePath(toShape)
      if (nextPath) setPathD(nextPath)
    } finally {
      isMorphing.current = false
    }
  }, [shouldReduceMotion])

  React.useEffect(() => {
    if (shouldReduceMotion) return

    const interval = setInterval(() => {
      void triggerMorph()
    }, 4500)

    return () => clearInterval(interval)
  }, [triggerMorph, shouldReduceMotion])

  return (
    <div className={cn("relative flex items-center justify-center shrink-0 select-none", className)}>
      <svg 
        viewBox={`0 0 ${M3_SHAPE_VIEWBOX} ${M3_SHAPE_VIEWBOX}`} 
        className="size-full text-primary/15 hover:text-primary/25 transition-colors transform-gpu"
        role="presentation"
        aria-hidden
      >
        <path d={pathD} fill="currentColor" />
      </svg>
      <Bot className="absolute size-4.5 text-primary animate-pulse" />
    </div>
  )
}
