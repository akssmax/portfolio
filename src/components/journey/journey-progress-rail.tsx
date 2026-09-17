"use client"

import { ERA_ORDER, getEraConfig } from "@/lib/journey/era-config"
import type { JourneyChapterStop, JourneyRoleStop, JourneyStop } from "@/lib/journey/types"
import { cn } from "@/lib/utils"

type JourneyProgressRailProps = {
  stops: JourneyStop[]
  activeIndex: number
  scrollProgress: number
  onSelect: (index: number) => void
}

export function JourneyProgressRail({
  stops,
  activeIndex,
  scrollProgress,
  onSelect,
}: JourneyProgressRailProps) {
  type NavigableStop = JourneyChapterStop | JourneyRoleStop

  const navigableStops = stops
    .map((stop, index) => ({ stop, index }))
    .filter(
      (entry): entry is { stop: NavigableStop; index: number } =>
        entry.stop.kind === "role" || entry.stop.kind === "chapter",
    )

  const activeStop = stops[activeIndex]
  const activeEra =
    activeStop && activeStop.kind !== "intro" && activeStop.kind !== "outro"
      ? activeStop.era
      : "boot"

  return (
    <div className="fixed inset-x-0 bottom-6 z-50 px-4">
      <div className="mx-auto max-w-3xl space-y-3 rounded-2xl border border-border/60 bg-background/80 px-4 py-3 shadow-sm backdrop-blur-sm">
        <div className="relative h-1 overflow-hidden rounded-full bg-border/60">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 via-primary to-fuchsia-500 transition-[width] duration-150 ease-out motion-reduce:transition-none"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-[10px]">
          {ERA_ORDER.map((era) => {
            const config = getEraConfig(era)
            return (
              <span
                key={era}
                className={cn(
                  "rounded-full px-2 py-0.5 font-medium uppercase tracking-wider transition-colors",
                  activeEra === era
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground/60",
                )}
              >
                {config.label}
              </span>
            )
          })}
        </div>

        {navigableStops.length > 0 ? (
          <div className="flex gap-1 overflow-x-auto pb-0.5">
            {navigableStops.map(({ stop, index }) => {
              const label = stop.kind === "chapter" ? stop.year : stop.item.company
              const ariaLabel =
                stop.kind === "chapter"
                  ? `Go to ${stop.title}`
                  : `Go to ${stop.item.company}`

              return (
                <button
                  key={stop.id}
                  type="button"
                  aria-label={ariaLabel}
                  aria-current={index === activeIndex ? "step" : undefined}
                  onClick={() => onSelect(index)}
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-1 text-[11px] transition-colors",
                    index === activeIndex
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted",
                  )}
                >
                  {label}
                </button>
              )
            })}
          </div>
        ) : null}
      </div>
    </div>
  )
}
