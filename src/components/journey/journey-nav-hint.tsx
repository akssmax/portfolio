"use client"

import * as React from "react"
import { motion } from "motion/react"

import { EASE_OUT_SMOOTH } from "@/lib/motion-easing"

type JourneyNavHintProps = {
  visible: boolean
}

export function JourneyNavHint({ visible }: JourneyNavHintProps) {
  const [dismissed, setDismissed] = React.useState(false)

  React.useEffect(() => {
    if (!visible) return

    const timer = window.setTimeout(() => setDismissed(true), 5000)
    return () => window.clearTimeout(timer)
  }, [visible])

  if (!visible || dismissed) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: EASE_OUT_SMOOTH }}
      className="pointer-events-none fixed bottom-24 left-1/2 z-40 -translate-x-1/2 rounded-full border border-border/60 bg-background/80 px-4 py-2 text-xs text-muted-foreground shadow-sm backdrop-blur-sm"
    >
      Scroll, swipe, or use arrow keys
    </motion.div>
  )
}
