"use client"

import * as React from "react"

import { JourneyChapterCard } from "@/components/journey/journey-chapter-card"
import { JourneyEraZone } from "@/components/journey/journey-era-zone"
import { JourneyIntroPanel } from "@/components/journey/journey-intro-panel"
import { JourneyOutroPanel } from "@/components/journey/journey-outro-panel"
import { JourneyRoleCard } from "@/components/journey/journey-role-card"
import { JourneyRunnerSprite } from "@/components/journey/journey-runner-sprite"
import { JOURNEY_GRID_BG_CLASS } from "@/lib/journey/era-config"
import type { JourneyTrack } from "@/lib/journey/types"
import { cn } from "@/lib/utils"

type JourneyTrackViewportProps = {
  track: JourneyTrack
  viewportRef: React.RefObject<HTMLDivElement | null>
  setStopRef: (index: number, node: HTMLElement | null) => void
  activeIndex: number
  runnerOffsetPx: number
  onRoleSelect: (stopId: string, projectSlug?: string) => void
  onTrackMounted?: () => void
}

const STOP_GAP = "gap-8 sm:gap-12"

export function JourneyTrackViewport({
  track,
  viewportRef,
  setStopRef,
  activeIndex,
  runnerOffsetPx,
  onRoleSelect,
  onTrackMounted,
}: JourneyTrackViewportProps) {
  const trackInnerRef = React.useRef<HTMLDivElement>(null)
  const hasNotifiedMountRef = React.useRef(false)
  const [eraLayouts, setEraLayouts] = React.useState<
    { era: (typeof track.eraSpans)[number]["era"]; left: number; width: number }[]
  >([])

  React.useEffect(() => {
    const inner = trackInnerRef.current
    const viewport = viewportRef.current
    if (!inner || !viewport) return

    function measureEraZones() {
      const trackInner = trackInnerRef.current
      if (!trackInner) return

      const innerRect = trackInner.getBoundingClientRect()
      const nextLayouts = track.eraSpans.map((span) => {
        const startNode = trackInner.querySelector<HTMLElement>(
          `[data-stop-index="${span.startIndex}"]`,
        )
        const endNode = trackInner.querySelector<HTMLElement>(`[data-stop-index="${span.endIndex}"]`)

        if (!startNode || !endNode) {
          return { era: span.era, left: 0, width: 0 }
        }

        const startRect = startNode.getBoundingClientRect()
        const endRect = endNode.getBoundingClientRect()
        const left = startRect.left - innerRect.left - 24
        const width = endRect.right - startRect.left + 48

        return { era: span.era, left: Math.max(0, left), width: Math.max(0, width) }
      })

      setEraLayouts(nextLayouts)
    }

    measureEraZones()

    const resizeObserver = new ResizeObserver(measureEraZones)
    resizeObserver.observe(inner)
    resizeObserver.observe(viewport)

    return () => resizeObserver.disconnect()
  }, [track.eraSpans, track.stops.length, viewportRef])

  React.useLayoutEffect(() => {
    if (hasNotifiedMountRef.current) return
    hasNotifiedMountRef.current = true
    onTrackMounted?.()
  }, [onTrackMounted])

  return (
    <div className="relative h-full min-h-0 flex-1">
      <div
        ref={viewportRef}
        className="h-full touch-pan-x overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:thin] [scroll-snap-type:x_proximity]"
      >
        <div ref={trackInnerRef} className="relative flex h-full min-w-max items-end pb-28 pt-24">
          <div
            className={cn("pointer-events-none absolute inset-0", JOURNEY_GRID_BG_CLASS)}
            aria-hidden
          />

          {eraLayouts.map((layout) =>
            layout.width > 0 && layout.era !== "boot" ? (
              <JourneyEraZone
                key={layout.era}
                era={layout.era}
                className="rounded-3xl opacity-80"
                style={{
                  left: layout.left,
                  width: layout.width,
                }}
              />
            ) : null,
          )}

          <div className={cn("relative flex h-full items-end", STOP_GAP)}>
            {track.stops.map((stop, index) => {
              const active = index === activeIndex

              if (stop.kind === "intro") {
                return (
                  <div
                    key={stop.id}
                    ref={(node) => setStopRef(index, node)}
                    data-stop-index={index}
                    className="h-full shrink-0 snap-start"
                  >
                    <JourneyIntroPanel
                      heading={track.heading}
                      subtitle={track.subtitle}
                      journeyStart={track.journeyStart}
                    />
                  </div>
                )
              }

              if (stop.kind === "outro") {
                return (
                  <div
                    key={stop.id}
                    ref={(node) => setStopRef(index, node)}
                    data-stop-index={index}
                    className="h-full shrink-0 snap-start"
                  >
                    <JourneyOutroPanel />
                  </div>
                )
              }

              if (stop.kind === "chapter") {
                return (
                  <div
                    key={stop.id}
                    ref={(node) => setStopRef(index, node)}
                    data-stop-index={index}
                    className="flex h-full shrink-0 snap-center items-center pb-16"
                  >
                    <JourneyChapterCard stop={stop} active={active} />
                  </div>
                )
              }

              return (
                <div
                  key={stop.id}
                  ref={(node) => setStopRef(index, node)}
                  data-stop-index={index}
                  className="group/stop flex h-full shrink-0 snap-center items-center pb-16"
                >
                  <JourneyRoleCard
                    stop={stop}
                    active={active}
                    onSelect={() => onRoleSelect(stop.id, stop.projectSlug)}
                  />
                </div>
              )
            })}
          </div>

          <div
            className="pointer-events-none absolute inset-x-0 bottom-[18%] z-10 h-px bg-border/80"
            aria-hidden
          />
        </div>
      </div>

      <JourneyRunnerSprite offsetPx={runnerOffsetPx} />
    </div>
  )
}
