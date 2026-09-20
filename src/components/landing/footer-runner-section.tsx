"use client"

import { useState } from "react"

import { FooterMonogram } from "@/components/brand/footer-monogram"
import { Switch } from "@/components/ui/switch"
import { setSiteReducedMotion, useReducedMotionSettings } from "@/hooks/use-can-animate"
import { profile } from "@/lib/profile"
import { cn } from "@/lib/utils"

export function FooterRunnerSection() {
  const [runnerActive, setRunnerActive] = useState(false)
  const { siteReducedMotion, systemReducedMotion } = useReducedMotionSettings()

  return (
    <>
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
          runnerActive ? "grid-rows-[0fr]" : "grid-rows-[1fr]",
        )}
        aria-hidden={runnerActive}
      >
        <div className="overflow-hidden">
          <div
            className={cn(
              "flex flex-col gap-3 border-t border-border py-6 text-sm text-muted-foreground transition-opacity duration-300 ease-out motion-reduce:transition-none sm:flex-row sm:items-center sm:justify-between",
              runnerActive && "pointer-events-none opacity-0",
            )}
          >
            <p>© {new Date().getFullYear()} {profile.name}</p>
            <p>{profile.location}</p>
          </div>
        </div>
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

      <FooterMonogram
        animation="loop"
        enableRunnerGame
        runnerActive={runnerActive}
        onRunnerActiveChange={setRunnerActive}
      />
    </>
  )
}
