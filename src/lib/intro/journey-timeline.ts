import { isValid, parse, startOfMonth } from "date-fns"

import { getExperienceDuration, getExperienceSectionSubtitle } from "@/lib/experience-duration"
import { profile, type ProfileExperience } from "@/lib/profile"

import type { DeckExperienceItem } from "./types"

const PERIOD_SPLIT = /\s*[–-]\s/

function getPeriodStart(period: string, referenceDate = new Date()): number {
  const [startStr] = period.split(PERIOD_SPLIT)
  if (!startStr) return 0

  const parsed = parse(startStr.trim(), "MMM yyyy", referenceDate)
  return isValid(parsed) ? startOfMonth(parsed).getTime() : 0
}

function getPeriodStartYear(period: string, referenceDate = new Date()): string {
  const [startStr] = period.split(PERIOD_SPLIT)
  if (!startStr) return ""

  const parsed = parse(startStr.trim(), "MMM yyyy", referenceDate)
  return isValid(parsed) ? String(parsed.getFullYear()) : ""
}

function mapExperienceItem(item: ProfileExperience): DeckExperienceItem {
  return {
    company: item.company,
    role: item.role,
    period: item.period,
    location: item.location,
    description: item.description,
    highlights: item.highlights ?? [],
    logoSrc: item.logoSrc,
    websiteUrl: item.websiteUrl,
    startYear: getPeriodStartYear(item.period),
    duration: getExperienceDuration(item.period),
    isCurrent: item.period.trim().toLowerCase().endsWith("present"),
  }
}

export function buildJourneyTimeline() {
  const items = [...profile.experience]
    .map(mapExperienceItem)
    .sort((a, b) => getPeriodStart(a.period) - getPeriodStart(b.period))

  const journeyStart = items[0]?.startYear ?? "2017"

  return {
    heading: "From first app to agentic AI",
    subtitle: getExperienceSectionSubtitle(profile.experience.map((item) => item.period)),
    journeyStart,
    items,
  }
}
