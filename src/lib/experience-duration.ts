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
