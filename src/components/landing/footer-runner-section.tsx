"use client"

import { Switch } from "@/components/ui/switch"
import { setSiteReducedMotion, useReducedMotionSettings } from "@/hooks/use-can-animate"
import { profile } from "@/lib/profile"

export function FooterRunnerSection() {
  const { siteReducedMotion, systemReducedMotion } = useReducedMotionSettings()

  return (
    <>
      <div className="flex flex-col gap-3 border-t border-border py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} {profile.name}</p>
        <p>{profile.location}</p>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-border/60 py-4 text-sm">
        <div>
          <label htmlFor="footer-reduced-motion" className="font-medium text-foreground">Reduce motion</label>
          <p className="text-xs text-muted-foreground">
            {systemReducedMotion ? "Enabled by your device settings" : "Pause decorative animations"}
          </p>
        </div>
        <Switch
          id="footer-reduced-motion"
          checked={siteReducedMotion || systemReducedMotion}
          disabled={systemReducedMotion}
          onCheckedChange={setSiteReducedMotion}
          aria-label="Reduce motion"
        />
      </div>

    </>
  )
}
