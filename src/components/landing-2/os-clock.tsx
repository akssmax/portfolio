import * as React from "react"

import { OsWindow, type OsWindowTone } from "@/components/landing-2/os-window"
import { cn } from "@/lib/utils"

function formatClock(date: Date) {
  return date.toString().replace(/ GMT.*$/, "")
}

type OsClockProps = {
  className?: string
  style?: React.CSSProperties
  tone?: OsWindowTone
}

export function OsClock({ className, style, tone }: OsClockProps) {
  const [now, setNow] = React.useState(() => new Date())

  React.useEffect(() => {
    const intervalId = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(intervalId)
  }, [])

  return (
    <OsWindow title="Clock Tool 1.1" className={cn("w-[13.5rem]", className)} style={style} tone={tone}>
      <p className="tabular-nums">{formatClock(now)}</p>
    </OsWindow>
  )
}
