"use client"

import { useState } from "react"
import { motion, useReducedMotion } from "motion/react"

import { M3ShapeImage } from "@/components/m3-shapes/m3-shape"
import type { M3ShapeId } from "@/lib/m3-shapes"
import { cn } from "@/lib/utils"

export type M3FeatureImageItem = {
  src: string
  shape: M3ShapeId
}

type M3FeatureImageProps = {
  items: readonly M3FeatureImageItem[]
  alt: string
  className?: string
  imageClassName?: string
}

export function M3FeatureImage({
  items,
  alt,
  className,
  imageClassName,
}: M3FeatureImageProps) {
  const shouldReduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)
  const current = items[index]

  if (!current) return null

  function cycle() {
    setIndex((value) => (value + 1) % items.length)
  }

  return (
    <button
      type="button"
      onClick={cycle}
      className={cn(
        "relative cursor-pointer rounded-lg transition-transform hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
      aria-label={`${alt}. Click to change photo and shape.`}
    >
      <motion.div
        key={`${current.shape}-${current.src}`}
        className="relative inline-block"
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
      >
        <M3ShapeImage
          shape={current.shape}
          src={current.src}
          alt={alt}
          className={imageClassName}
        />
      </motion.div>
    </button>
  )
}
