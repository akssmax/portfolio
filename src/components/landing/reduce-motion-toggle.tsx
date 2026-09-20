"use client"

import { Switch } from "@/components/ui/switch"
import { setSiteReducedMotion, useReducedMotionSettings } from "@/hooks/use-can-animate"

export function ReduceMotionToggle() {
  const { siteReducedMotion, systemReducedMotion } = useReducedMotionSettings()

  return (
    <div className="flex items-center gap-2 pt-1">
      <Switch
        id="footer-reduced-motion"
        checked={siteReducedMotion || systemReducedMotion}
        disabled={systemReducedMotion}
        onCheckedChange={setSiteReducedMotion}
        aria-label="Reduce motion"
      />
      <label
        htmlFor="footer-reduced-motion"
        title={
          systemReducedMotion
            ? "Enabled by your device settings"
            : "Pause decorative animations"
        }
        className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        Reduce motion
      </label>
    </div>
  )
}
