import {
  endOfMonth,
  intervalToDuration,
  isValid,
  parse,
  startOfMonth,
} from "date-fns"

const PERIOD_SPLIT = /\s*[–-]\s*/

function parseMonthYear(value: string, referenceDate: Date): Date | null {
  const parsed = parse(value.trim(), "MMM yyyy", referenceDate)
  return isValid(parsed) ? parsed : null
}

function formatDurationParts(years: number, months: number): string {
  const parts: string[] = []

  if (years > 0) {
    parts.push(`${years} ${years === 1 ? "year" : "years"}`)
  }

  if (months > 0) {
    parts.push(`${months} ${months === 1 ? "month" : "months"}`)
  }

  if (parts.length === 0) {
    return "Less than 1 month"
  }

  return parts.join(" ")
}

export function getExperienceDuration(
  period: string,
  referenceDate = new Date(),
): string {
  const [startStr, endStr] = period.split(PERIOD_SPLIT)
  if (!startStr || !endStr) return ""

  const start = parseMonthYear(startStr, referenceDate)
  if (!start) return ""

  const end =
    endStr.trim().toLowerCase() === "present"
      ? referenceDate
      : parseMonthYear(endStr, referenceDate)
  if (!end) return ""

  const duration = intervalToDuration({
    start: startOfMonth(start),
    end: endStr.trim().toLowerCase() === "present" ? end : endOfMonth(end),
  })

  return formatDurationParts(duration.years ?? 0, duration.months ?? 0)
}

function parsePeriodStart(period: string, referenceDate: Date): Date | null {
  const [startStr] = period.split(PERIOD_SPLIT)
  if (!startStr) return null
  return parseMonthYear(startStr, referenceDate)
}

export function getEarliestExperienceStart(
  periods: string[],
  referenceDate = new Date(),
): Date | null {
  let earliest: Date | null = null

  for (const period of periods) {
    const start = parsePeriodStart(period, referenceDate)
    if (!start) continue
    if (!earliest || start < earliest) earliest = start
  }

  return earliest
}

/** First UX / product design role — used for the about hero experience tag. */
export const PRODUCT_EXPERIENCE_SINCE = "May 2020"

export function getExperienceTagLabel(referenceDate = new Date()): string {
  const start = parseMonthYear(PRODUCT_EXPERIENCE_SINCE, referenceDate)
  if (!start) return "1 year of experience"

  const duration = intervalToDuration({
    start: startOfMonth(start),
    end: referenceDate,
  })

  const years = Math.max(duration.years ?? 0, 1)
  return `${years} ${years === 1 ? "year" : "years"} of experience`
}

export function getDesignCareerSpanLabel(
  periods: string[],
  referenceDate = new Date(),
): string {
  const start = getEarliestExperienceStart(periods, referenceDate)
  if (!start) return "Nearly 1 year"

  const duration = intervalToDuration({
    start: startOfMonth(start),
    end: referenceDate,
  })

  const years = duration.years ?? 0
  const months = duration.months ?? 0
  const roundedYears = months >= 5 ? years + 1 : Math.max(years, 1)

  return `Nearly ${roundedYears} ${roundedYears === 1 ? "year" : "years"}`
}

export function getExperienceSectionSubtitle(
  periods: string[],
  referenceDate = new Date(),
): string {
  const span = getDesignCareerSpanLabel(periods, referenceDate)
  return `${span} in design across fintech, devtools, and AI — from graphic design to product.`
}
