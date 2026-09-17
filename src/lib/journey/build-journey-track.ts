import type { MilestoneEra } from "@/lib/brand/runner-milestones"

import {
  buildJourneyChapters,
  buildJourneyRoles,
  getJourneyMeta,
} from "./journey-content"
import type { JourneyEraSpan, JourneyStop, JourneyTrack } from "./types"

function computeEraSpans(stops: JourneyStop[]): JourneyEraSpan[] {
  const spans: JourneyEraSpan[] = []
  let currentEra: MilestoneEra | null = null
  let spanStart = -1

  stops.forEach((stop, index) => {
    if (stop.kind === "intro" || stop.kind === "outro") return

    if (currentEra !== stop.era) {
      if (currentEra !== null && spanStart >= 0) {
        spans.push({ era: currentEra, startIndex: spanStart, endIndex: index - 1 })
      }
      currentEra = stop.era
      spanStart = index
    }
  })

  if (currentEra !== null && spanStart >= 0) {
    spans.push({
      era: currentEra,
      startIndex: spanStart,
      endIndex: stops.length - 2,
    })
  }

  return spans
}

export function buildJourneyTrack(): JourneyTrack {
  const meta = getJourneyMeta()
  const chapters = buildJourneyChapters()
  const roles = buildJourneyRoles()

  const contentStops: JourneyStop[] = [...chapters, ...roles].sort(
    (a, b) => a.sortYear - b.sortYear,
  )

  const stops: JourneyStop[] = [
    { kind: "intro", id: "intro", sortYear: 2013, era: "boot" },
    ...contentStops,
    { kind: "outro", id: "outro", sortYear: 2027, era: "ship" },
  ]

  return {
    heading: meta.heading,
    subtitle: meta.subtitle,
    journeyStart: meta.journeyStart,
    stops,
    eraSpans: computeEraSpans(stops),
  }
}

export function findStopIndexById(stops: JourneyStop[], stopId: string): number {
  return stops.findIndex((stop) => stop.id === stopId)
}
