import { useEffect } from "react"
import { MotionConfig } from "motion/react"

import { useAnimationProfile, useReducedMotionSettings } from "@/hooks/use-can-animate"

export function MotionPreferences({ children }: { children: React.ReactNode }) {
  const { canAnimate } = useAnimationProfile()
  const { reduceMotion } = useReducedMotionSettings()

  useEffect(() => {
    document.documentElement.dataset.siteReducedMotion = String(reduceMotion)
  }, [reduceMotion])

  return <MotionConfig reducedMotion={canAnimate ? "never" : "always"}>{children}</MotionConfig>
}
