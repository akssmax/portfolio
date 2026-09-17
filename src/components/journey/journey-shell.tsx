"use client"

import * as React from "react"
import { Link, useNavigate } from "@tanstack/react-router"
import { X } from "lucide-react"

import { JourneyNavHint } from "@/components/journey/journey-nav-hint"
import { JourneyProgressRail } from "@/components/journey/journey-progress-rail"
import { JourneyRoleDetailDialog } from "@/components/journey/journey-role-detail-dialog"
import { JourneyTrackViewport } from "@/components/journey/journey-track-viewport"
import { ThemeCustomizer } from "@/components/theme-customizer"
import { Button } from "@/components/ui/button"
import { useJourneyScroll } from "@/hooks/use-journey-scroll"
import type { JourneyTrack } from "@/lib/journey/types"
import { findStopIndexById } from "@/lib/journey/build-journey-track"

type JourneyShellProps = {
  track: JourneyTrack
  initialStopId?: string
  onStopChange?: (stopId: string | undefined) => void
}

export function JourneyShell({ track, initialStopId, onStopChange }: JourneyShellProps) {
  const navigate = useNavigate()
  const initialStopIndexRef = React.useRef(
    initialStopId ? Math.max(0, findStopIndexById(track.stops, initialStopId)) : 0,
  )
  const lastSyncedStopRef = React.useRef<string | undefined>(initialStopId)

  const [selectedRoleId, setSelectedRoleId] = React.useState<string | null>(null)
  const [selectedProjectSlug, setSelectedProjectSlug] = React.useState<string | undefined>()

  const handleActiveIndexChange = React.useCallback(
    (index: number) => {
      const stop = track.stops[index]
      if (!stop) return

      const stopId = stop.kind === "intro" ? undefined : stop.id
      if (lastSyncedStopRef.current === stopId) return

      lastSyncedStopRef.current = stopId
      onStopChange?.(stopId)

      void navigate({
        to: "/journey",
        search: stopId ? { stop: stopId } : {},
        replace: true,
      })
    },
    [navigate, onStopChange, track.stops],
  )

  const {
    viewportRef,
    setStopRef,
    scrollProgress,
    activeIndex,
    runnerOffsetPx,
    scrollToStop,
    scrollToInitialStop,
  } = useJourneyScroll({
    stopCount: track.stops.length,
    initialStopIndex: initialStopIndexRef.current,
    onActiveIndexChange: handleActiveIndexChange,
  })

  const selectedRoleStop = track.stops.find(
    (stop) => stop.kind === "role" && stop.id === selectedRoleId,
  )
  const selectedRoleItem =
    selectedRoleStop?.kind === "role" ? selectedRoleStop.item : null

  function handleRoleSelect(stopId: string, projectSlug?: string) {
    setSelectedRoleId(stopId)
    setSelectedProjectSlug(projectSlug)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-background text-foreground">
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 bg-border/40"
        aria-hidden
      >
        <div
          className="h-full bg-primary transition-[width] duration-150 ease-out motion-reduce:transition-none"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <span className="rounded-full border border-border/60 bg-background/80 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-sm">
          {activeIndex + 1} / {track.stops.length}
        </span>

        <ThemeCustomizer triggerSize="icon-sm" />

        <Button asChild variant="outline" size="icon-sm" aria-label="Exit journey">
          <Link to="/">
            <X className="size-4" aria-hidden />
          </Link>
        </Button>
      </div>

      <JourneyTrackViewport
        track={track}
        viewportRef={viewportRef}
        setStopRef={setStopRef}
        activeIndex={activeIndex}
        runnerOffsetPx={runnerOffsetPx}
        onRoleSelect={handleRoleSelect}
        onTrackMounted={scrollToInitialStop}
      />

      <JourneyProgressRail
        stops={track.stops}
        activeIndex={activeIndex}
        scrollProgress={scrollProgress}
        onSelect={scrollToStop}
      />

      <JourneyNavHint visible={activeIndex === 0} />

      <JourneyRoleDetailDialog
        item={selectedRoleItem}
        projectSlug={selectedProjectSlug}
        open={selectedRoleId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedRoleId(null)
            setSelectedProjectSlug(undefined)
          }
        }}
      />
    </div>
  )
}
