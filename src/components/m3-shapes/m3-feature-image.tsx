"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { animate, useMotionValue, useReducedMotion } from "motion/react"

import { M3ShapeMorphImage } from "@/components/m3-shapes/m3-shape-morph-image"
import { M3ShapeImage } from "@/components/m3-shapes/m3-shape"
import { getM3ShapePath } from "@/lib/m3-shape-paths"
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

const MORPH_DURATION = 0.75
const IMAGE_FADE_DELAY = 0.28
const IMAGE_FADE_DURATION = 0.45
const AUTO_CYCLE_INTERVAL_MS = 6000
const INDEX_STORAGE_KEY = "hero-portrait-index"

function readStoredIndex(length: number) {
  if (typeof sessionStorage === "undefined" || length < 1) return 0

  const stored = sessionStorage.getItem(INDEX_STORAGE_KEY)
  if (stored === null) return 0

  const parsed = Number.parseInt(stored, 10)
  if (!Number.isFinite(parsed)) return 0

  return ((parsed % length) + length) % length
}

function writeStoredIndex(index: number) {
  if (typeof sessionStorage === "undefined") return
  sessionStorage.setItem(INDEX_STORAGE_KEY, String(index))
}

export function M3FeatureImage({
  items,
  alt,
  className,
  imageClassName,
}: M3FeatureImageProps) {
  const shouldReduceMotion = useReducedMotion()
  const isMorphing = useRef(false)
  const cycleRef = useRef<() => Promise<void>>(async () => {})
  const autoCycleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isVisibleRef = useRef(true)
  const indexRef = useRef(readStoredIndex(items.length))
  const shapeProgress = useMotionValue(0)
  const imageProgress = useMotionValue(0)
  const rootRef = useRef<HTMLButtonElement>(null)
  const [index, setIndex] = useState(() => indexRef.current)
  const [pathD, setPathD] = useState(
    () => getM3ShapePath(items[indexRef.current]?.shape ?? "circle") ?? "",
  )
  const [nextSrc, setNextSrc] = useState<string | null>(null)
  const [imageMix, setImageMix] = useState(0)

  useEffect(() => {
    void import("@/lib/m3-shape-morph")
  }, [])

  const applyItem = useCallback(
    (nextIndex: number) => {
      const nextItem = items[nextIndex]
      if (!nextItem) return

      const nextPath = getM3ShapePath(nextItem.shape)
      if (!nextPath) return

      indexRef.current = nextIndex
      writeStoredIndex(nextIndex)
      setIndex(nextIndex)
      setPathD(nextPath)
      setNextSrc(null)
      setImageMix(0)
      shapeProgress.set(0)
      imageProgress.set(0)
    },
    [imageProgress, items, shapeProgress],
  )

  const cycle = useCallback(async () => {
    if (isMorphing.current || items.length < 2 || !isVisibleRef.current) return

    const fromIndex = indexRef.current
    const nextIndex = (fromIndex + 1) % items.length
    const fromItem = items[fromIndex]
    const nextItem = items[nextIndex]
    if (!fromItem || !nextItem) return

    const nextPath = getM3ShapePath(nextItem.shape)
    if (!nextPath) return

    if (shouldReduceMotion) {
      applyItem(nextIndex)
      return
    }

    isMorphing.current = true

    try {
      const { createShapeMorphInterpolator } = await import(
        "@/lib/m3-shape-morph"
      )
      const interpolator = createShapeMorphInterpolator(
        fromItem.shape,
        nextItem.shape,
      )

      if (!interpolator) {
        applyItem(nextIndex)
        return
      }

      setNextSrc(nextItem.src)
      setImageMix(0)
      shapeProgress.set(0)
      imageProgress.set(0)

      const shapeAnimation = animate(shapeProgress, 1, {
        duration: MORPH_DURATION,
        ease: [0.45, 0, 0.2, 1],
        onUpdate: (t) => setPathD(interpolator(t)),
      })
      const imageAnimation = animate(imageProgress, 1, {
        duration: IMAGE_FADE_DURATION,
        delay: IMAGE_FADE_DELAY,
        ease: "easeInOut",
        onUpdate: setImageMix,
      })

      await Promise.all([shapeAnimation.finished, imageAnimation.finished])
      applyItem(nextIndex)
    } catch (error) {
      console.error("M3 shape morph failed:", error)
      applyItem(nextIndex)
    } finally {
      isMorphing.current = false
    }
  }, [applyItem, imageProgress, items, shapeProgress, shouldReduceMotion])

  cycleRef.current = cycle

  const clearAutoCycle = useCallback(() => {
    if (autoCycleTimeoutRef.current) {
      clearTimeout(autoCycleTimeoutRef.current)
      autoCycleTimeoutRef.current = null
    }
  }, [])

  const scheduleAutoCycle = useCallback(() => {
    clearAutoCycle()
    if (items.length < 2 || !isVisibleRef.current || shouldReduceMotion) return

    autoCycleTimeoutRef.current = setTimeout(() => {
      void cycleRef.current().finally(() => {
        if (isVisibleRef.current) {
          scheduleAutoCycle()
        }
      })
    }, AUTO_CYCLE_INTERVAL_MS)
  }, [clearAutoCycle, items.length, shouldReduceMotion])

  useEffect(() => {
    if (shouldReduceMotion === null) return

    scheduleAutoCycle()
    return clearAutoCycle
  }, [scheduleAutoCycle, clearAutoCycle, shouldReduceMotion])

  useEffect(() => {
    const node = rootRef.current
    if (!node || typeof IntersectionObserver === "undefined") return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry?.isIntersecting ?? false
        isVisibleRef.current = visible

        if (visible) {
          scheduleAutoCycle()
          return
        }

        clearAutoCycle()
      },
      { threshold: 0.15 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [clearAutoCycle, scheduleAutoCycle])

  const handleClick = useCallback(() => {
    clearAutoCycle()
    void cycleRef.current().finally(() => {
      scheduleAutoCycle()
    })
  }, [clearAutoCycle, scheduleAutoCycle])

  const current = items[index]
  if (!current) return null

  const prefersReducedMotion = shouldReduceMotion === true

  return (
    <button
      ref={rootRef}
      type="button"
      onClick={handleClick}
      className={cn(
        "relative cursor-pointer rounded-lg transition-transform hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
      aria-label={`${alt}. Cycles shape and photo automatically. Click to advance.`}
    >
      <div className="relative inline-block">
        {prefersReducedMotion ? (
          <M3ShapeImage
            shape={current.shape}
            src={current.src}
            alt={alt}
            className={imageClassName}
          />
        ) : (
          <M3ShapeMorphImage
            pathD={pathD}
            src={current.src}
            nextSrc={nextSrc}
            imageMix={imageMix}
            alt={alt}
            className={imageClassName}
          />
        )}
      </div>
    </button>
  )
}
