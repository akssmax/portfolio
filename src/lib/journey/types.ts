import type { MilestoneEra } from "@/lib/brand/runner-milestones"
import type { DeckExperienceItem } from "@/lib/intro/types"

export type JourneyStopKind = "intro" | "outro" | "chapter" | "role"

export type JourneyStopBase = {
  id: string
  sortYear: number
  era: MilestoneEra
}

export type JourneyIntroStop = JourneyStopBase & {
  kind: "intro"
}

export type JourneyOutroStop = JourneyStopBase & {
  kind: "outro"
}

export type JourneyChapterStop = JourneyStopBase & {
  kind: "chapter"
  year: string
  eyebrow: string
  title: string
  description: string
}

export type JourneyRoleStop = JourneyStopBase & {
  kind: "role"
  item: DeckExperienceItem
  projectSlug?: string
  eyebrow?: string
}

export type JourneyStop =
  | JourneyIntroStop
  | JourneyOutroStop
  | JourneyChapterStop
  | JourneyRoleStop

export type JourneyEraSpan = {
  era: MilestoneEra
  startIndex: number
  endIndex: number
}

export type JourneyTrack = {
  heading: string
  subtitle: string
  journeyStart: string
  stops: JourneyStop[]
  eraSpans: JourneyEraSpan[]
}

export function isRoleStop(stop: JourneyStop): stop is JourneyRoleStop {
  return stop.kind === "role"
}

export function isChapterStop(stop: JourneyStop): stop is JourneyChapterStop {
  return stop.kind === "chapter"
}
