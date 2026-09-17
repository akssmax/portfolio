import * as React from "react"

import { OsWindow } from "@/components/landing-2/os-window"
import { useAnimationProfile } from "@/hooks/use-can-animate"
import { useHydrated } from "@/hooks/use-hydrated"

const BOOT_MS = 1200

export function OsBootDialog() {
  const hydrated = useHydrated()
  const { canAnimate } = useAnimationProfile()
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    if (!hydrated || !canAnimate) return

    setVisible(true)
    const timeoutId = window.setTimeout(() => setVisible(false), BOOT_MS)
    return () => window.clearTimeout(timeoutId)
  }, [hydrated, canAnimate])

  React.useEffect(() => {
    if (!visible) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" || event.key === "Enter" || event.key === " ") {
        setVisible(false)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [visible])

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/70"
      onClick={() => setVisible(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Starting AkshayOS"
    >
      <div onClick={(event) => event.stopPropagation()}>
        <OsWindow title="AkshayOS 1.1" className="w-[min(18rem,calc(100vw-2rem))]" showClose>
        <p className="mb-2">Loading …</p>
        <p className="mb-3 text-muted-foreground">Image Assets, Copy</p>
        <div className="os-progress">
          <div
            className="os-progress-bar"
            style={{ animation: "landing2Boot 1200ms linear forwards", width: "0%" }}
          />
        </div>
        <p className="mt-2 text-[10px] text-muted-foreground">Click or press Esc to skip</p>
        </OsWindow>
      </div>
    </div>
  )
}
