"use client"

import * as React from "react"

import { useAnimationProfile } from "@/hooks/use-can-animate"

type UseJourneyScrollOptions = {
  stopCount: number
  initialStopIndex?: number
  onActiveIndexChange?: (index: number) => void
}

function getStopScrollLeft(viewport: HTMLElement, node: HTMLElement): number {
  const viewportRect = viewport.getBoundingClientRect()
  const nodeRect = node.getBoundingClientRect()
  const nodeCenter = nodeRect.left + nodeRect.width / 2
  const viewportCenter = viewportRect.left + viewportRect.width / 2

  return viewport.scrollLeft + (nodeCenter - viewportCenter)
}

export function useJourneyScroll({
  stopCount,
  initialStopIndex = 0,
  onActiveIndexChange,
}: UseJourneyScrollOptions) {
  const { canAnimate } = useAnimationProfile()
  const viewportRef = React.useRef<HTMLDivElement>(null)
  const stopRefs = React.useRef<(HTMLElement | null)[]>([])
  const hasInitializedRef = React.useRef(false)
  const isProgrammaticScrollRef = React.useRef(false)
  const wheelCooldownRef = React.useRef(false)

  const [scrollProgress, setScrollProgress] = React.useState(0)
  const [activeIndex, setActiveIndex] = React.useState(initialStopIndex)
  const [runnerOffsetPx, setRunnerOffsetPx] = React.useState(0)

  const setStopRef = React.useCallback((index: number, node: HTMLElement | null) => {
    stopRefs.current[index] = node
  }, [])

  const updateScrollMetrics = React.useCallback(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const maxScroll = viewport.scrollWidth - viewport.clientWidth
    const progress = maxScroll <= 0 ? 0 : viewport.scrollLeft / maxScroll
    setScrollProgress(Math.min(1, Math.max(0, progress)))
    setRunnerOffsetPx(viewport.scrollLeft)
  }, [])

  const scrollToStop = React.useCallback(
    (index: number, behavior: ScrollBehavior = canAnimate ? "smooth" : "auto") => {
      const viewport = viewportRef.current
      const node = stopRefs.current[index]
      if (!viewport || !node) return

      const targetLeft = getStopScrollLeft(viewport, node)
      isProgrammaticScrollRef.current = true

      viewport.scrollTo({
        left: Math.max(0, targetLeft),
        behavior,
      })

      window.setTimeout(() => {
        isProgrammaticScrollRef.current = false
      }, behavior === "smooth" ? 450 : 0)
    },
    [canAnimate],
  )

  React.useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    viewport.addEventListener("scroll", updateScrollMetrics, { passive: true })
    updateScrollMetrics()

    const resizeObserver = new ResizeObserver(updateScrollMetrics)
    resizeObserver.observe(viewport)

    return () => {
      viewport.removeEventListener("scroll", updateScrollMetrics)
      resizeObserver.disconnect()
    }
  }, [updateScrollMetrics, stopCount])

  React.useLayoutEffect(() => {
    const viewport = viewportRef.current
    if (!viewport || stopCount === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScrollRef.current) return

        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        const top = visible[0]
        if (!top?.target) return

        const index = Number.parseInt(top.target.getAttribute("data-stop-index") ?? "-1", 10)
        if (index < 0) return

        setActiveIndex((current) => {
          if (current === index) return current
          onActiveIndexChange?.(index)
          return index
        })
      },
      {
        root: viewport,
        rootMargin: "-20% 0px -20% 0px",
        threshold: [0.25, 0.5, 0.75],
      },
    )

    stopRefs.current.forEach((node) => {
      if (node) observer.observe(node)
    })

    return () => observer.disconnect()
  }, [onActiveIndexChange, stopCount])

  const scrollToInitialStop = React.useCallback(() => {
    if (hasInitializedRef.current) return
    hasInitializedRef.current = true

    if (initialStopIndex > 0) {
      setActiveIndex(initialStopIndex)
      scrollToStop(initialStopIndex, "auto")
    }
  }, [initialStopIndex, scrollToStop])

  React.useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    function handleWheel(event: WheelEvent) {
      const root = viewportRef.current
      if (!root) return

      const absY = Math.abs(event.deltaY)
      const absX = Math.abs(event.deltaX)

      if (absY === 0 && absX === 0) return

      if (absX > absY) {
        return
      }

      event.preventDefault()

      if (wheelCooldownRef.current) return

      const delta = event.deltaY
      const atStart = root.scrollLeft <= 1
      const atEnd = root.scrollLeft >= root.scrollWidth - root.clientWidth - 1

      if ((delta < 0 && atStart) || (delta > 0 && atEnd)) return

      root.scrollBy({
        left: delta,
        behavior: "auto",
      })

      wheelCooldownRef.current = true
      window.requestAnimationFrame(() => {
        wheelCooldownRef.current = false
      })
    }

    viewport.addEventListener("wheel", handleWheel, { passive: false })
    return () => viewport.removeEventListener("wheel", handleWheel)
  }, [])

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA")
      ) {
        return
      }

      if (event.key === "ArrowRight") {
        event.preventDefault()
        scrollToStop(Math.min(activeIndex + 1, stopCount - 1))
      } else if (event.key === "ArrowLeft") {
        event.preventDefault()
        scrollToStop(Math.max(activeIndex - 1, 0))
      } else if (event.key === "Home") {
        event.preventDefault()
        scrollToStop(0)
      } else if (event.key === "End") {
        event.preventDefault()
        scrollToStop(stopCount - 1)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeIndex, scrollToStop, stopCount])

  return {
    viewportRef,
    setStopRef,
    scrollProgress,
    activeIndex,
    runnerOffsetPx,
    scrollToStop,
    scrollToInitialStop,
  }
}
