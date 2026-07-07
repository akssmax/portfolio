import { useSyncExternalStore } from "react"

import type { FontScalePresetId } from "@/lib/themes/types"

export type AnimationTier = "none" | "light" | "full"

export type AnimationProfile = {
  tier: AnimationTier
  /** Motion allowed (false only when prefers-reduced-motion). */
  canAnimate: boolean
  /** Full GPU-heavy effects (layoutId, SVG morph, 3D hero). */
  fullMotion: boolean
  fontScale: FontScalePresetId
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return true
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function subscribeReducedMotion(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
  mediaQuery.addEventListener("change", onStoreChange)
  return () => mediaQuery.removeEventListener("change", onStoreChange)
}

function parseFontScale(value: string | null): FontScalePresetId {
  if (value === "112" || value === "125" || value === "150") return value
  return "100"
}

function getFontScaleSnapshot(): FontScalePresetId {
  if (typeof document === "undefined") return "100"
  return parseFontScale(document.documentElement.getAttribute("data-font-scale"))
}

function subscribeFontScale(onStoreChange: () => void) {
  if (typeof document === "undefined") return () => {}

  const observer = new MutationObserver(onStoreChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-font-scale"],
  })
  return () => observer.disconnect()
}

function isWindowsPlatform() {
  if (typeof navigator === "undefined") return false
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } }
  if (nav.userAgentData?.platform === "Windows") return true
  return /Windows/i.test(navigator.userAgent)
}

/** Downgrade blur/layoutId/SVG morph on low-end devices and typical Windows laptops. */
function prefersLightMotionEffects() {
  if (typeof navigator === "undefined") return false

  const cores = navigator.hardwareConcurrency ?? 8
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory

  if (cores <= 6) return true
  if (memory !== undefined && memory <= 4) return true
  if (isWindowsPlatform() && cores <= 8) return true

  return false
}

/** Animation tier from reduced-motion preference and device capability. */
export function useAnimationProfile(): AnimationProfile {
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => true,
  )

  const fontScale = useSyncExternalStore(
    subscribeFontScale,
    getFontScaleSnapshot,
    () => "100" as FontScalePresetId,
  )

  if (prefersReducedMotion) {
    return { tier: "none", canAnimate: false, fullMotion: false, fontScale }
  }

  if (prefersLightMotionEffects()) {
    return { tier: "light", canAnimate: true, fullMotion: false, fontScale }
  }

  return { tier: "full", canAnimate: true, fullMotion: true, fontScale }
}

/** True when animation is allowed — uses sync media query read (no hydration flip). */
export function useCanAnimate() {
  return useAnimationProfile().canAnimate
}

/** True when layoutId and SVG morph animations are allowed. */
export function useFullMotion() {
  return useAnimationProfile().fullMotion
}
