import * as React from "react"

import { useAnimationProfile } from "@/hooks/use-can-animate"

const SWIPE_THRESHOLD_PX = 48

type UseDeckNavigationOptions = {
  totalSlides: number
  initialIndex?: number
  onIndexChange?: (index: number) => void
}

export function useDeckNavigation({
  totalSlides,
  initialIndex = 0,
  onIndexChange,
}: UseDeckNavigationOptions) {
  const { canAnimate } = useAnimationProfile()
  const [index, setIndex] = React.useState(() =>
    clampIndex(initialIndex, totalSlides),
  )
  const touchStartX = React.useRef<number | null>(null)

  const goTo = React.useCallback(
    (nextIndex: number) => {
      setIndex((current) => {
        const clamped = clampIndex(nextIndex, totalSlides)
        if (clamped !== current) onIndexChange?.(clamped)
        return clamped
      })
    },
    [onIndexChange, totalSlides],
  )

  const goNext = React.useCallback(() => {
    setIndex((current) => {
      const clamped = clampIndex(current + 1, totalSlides)
      if (clamped !== current) onIndexChange?.(clamped)
      return clamped
    })
  }, [onIndexChange, totalSlides])

  const goPrev = React.useCallback(() => {
    setIndex((current) => {
      const clamped = clampIndex(current - 1, totalSlides)
      if (clamped !== current) onIndexChange?.(clamped)
      return clamped
    })
  }, [onIndexChange, totalSlides])

  React.useEffect(() => {
    setIndex(clampIndex(initialIndex, totalSlides))
  }, [initialIndex, totalSlides])

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT")
      ) {
        return
      }

      switch (event.key) {
        case "ArrowRight":
        case " ":
        case "PageDown":
          event.preventDefault()
          goNext()
          break
        case "ArrowLeft":
        case "PageUp":
          event.preventDefault()
          goPrev()
          break
        case "Home":
          event.preventDefault()
          goTo(0)
          break
        case "End":
          event.preventDefault()
          goTo(totalSlides - 1)
          break
        default:
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [goNext, goPrev, goTo, totalSlides])

  const handlePointerDown = React.useCallback((event: React.PointerEvent) => {
    if (event.target instanceof Element && event.target.closest("[data-deck-nested-nav]")) {
      return
    }
    touchStartX.current = event.clientX
  }, [])

  const handlePointerUp = React.useCallback(
    (event: React.PointerEvent) => {
      if (event.target instanceof Element && event.target.closest("[data-deck-nested-nav]")) {
        touchStartX.current = null
        return
      }
      if (touchStartX.current === null) return

      const deltaX = event.clientX - touchStartX.current
      touchStartX.current = null

      if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return

      if (deltaX < 0) goNext()
      else goPrev()
    },
    [goNext, goPrev],
  )

  return {
    index,
    totalSlides,
    canAnimate,
    isFirst: index === 0,
    isLast: index === totalSlides - 1,
    goTo,
    goNext,
    goPrev,
    handlePointerDown,
    handlePointerUp,
  }
}

function clampIndex(index: number, totalSlides: number) {
  if (totalSlides <= 0) return 0
  return Math.max(0, Math.min(index, totalSlides - 1))
}
