export type ContributionDay = {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

export type ContributionStats = {
  mostActiveMonth: string
  mostActiveDay: string
  longestStreak: number
  currentStreak: number
}

export type GithubContributionsPayload = {
  username: string
  total: number
  range: { from: string; to: string }
  contributions: ContributionDay[]
  stats: ContributionStats
  fetchedAt: string
}

type UpstreamContribution = {
  date: string
  count: number
  level: number
}

type UpstreamResponse = {
  total: { lastYear?: number } & Record<string, number>
  contributions: UpstreamContribution[]
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const

function parseUtcDate(date: string): Date {
  const [year, month, day] = date.split("-").map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}

function formatActiveDay(date: string): string {
  const parsed = parseUtcDate(date)
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed)
}

function normalizeLevel(level: number): ContributionDay["level"] {
  if (level <= 0) return 0
  if (level >= 4) return 4
  return level as ContributionDay["level"]
}

export function computeContributionStats(
  contributions: ContributionDay[],
): ContributionStats {
  if (contributions.length === 0) {
    return {
      mostActiveMonth: "—",
      mostActiveDay: "—",
      longestStreak: 0,
      currentStreak: 0,
    }
  }

  const monthTotals = new Map<string, number>()
  let mostActiveDay = contributions[0]!
  let longestStreak = 0
  let streak = 0

  for (const day of contributions) {
    const monthKey = day.date.slice(0, 7)
    monthTotals.set(monthKey, (monthTotals.get(monthKey) ?? 0) + day.count)

    if (day.count > mostActiveDay.count) {
      mostActiveDay = day
    }

    if (day.count > 0) {
      streak += 1
      longestStreak = Math.max(longestStreak, streak)
    } else {
      streak = 0
    }
  }

  let topMonthKey = contributions[0]!.date.slice(0, 7)
  let topMonthTotal = -1
  for (const [key, total] of monthTotals) {
    if (total > topMonthTotal) {
      topMonthKey = key
      topMonthTotal = total
    }
  }

  let currentStreak = 0
  for (let i = contributions.length - 1; i >= 0; i -= 1) {
    const day = contributions[i]!
    if (day.count > 0) {
      currentStreak += 1
      continue
    }
    // Ignore trailing empty "today" so a quiet current day doesn't reset the streak.
    if (currentStreak === 0 && i === contributions.length - 1) {
      continue
    }
    break
  }

  const monthIndex = Number(topMonthKey.slice(5, 7)) - 1

  return {
    mostActiveMonth: MONTH_NAMES[monthIndex] ?? "—",
    mostActiveDay:
      mostActiveDay.count > 0 ? formatActiveDay(mostActiveDay.date) : "—",
    longestStreak,
    currentStreak,
  }
}

export function githubUsernameFromProfileUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname.replace(/^\/+|\/+$/g, "")
    const [username] = pathname.split("/")
    return username || "akssmax"
  } catch {
    return "akssmax"
  }
}

export async function fetchGithubContributions(
  username: string,
): Promise<GithubContributionsPayload> {
  const response = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`,
    {
      headers: { Accept: "application/json" },
    },
  )

  if (!response.ok) {
    throw new Error(`GitHub contributions upstream failed (${response.status})`)
  }

  const payload = (await response.json()) as UpstreamResponse
  const contributions: ContributionDay[] = (payload.contributions ?? []).map(
    (day) => ({
      date: day.date,
      count: day.count,
      level: normalizeLevel(day.level),
    }),
  )

  const total =
    typeof payload.total?.lastYear === "number"
      ? payload.total.lastYear
      : contributions.reduce((sum, day) => sum + day.count, 0)

  return {
    username,
    total,
    range: {
      from: contributions[0]?.date ?? "",
      to: contributions.at(-1)?.date ?? "",
    },
    contributions,
    stats: computeContributionStats(contributions),
    fetchedAt: new Date().toISOString(),
  }
}

export function groupContributionsByWeek(
  contributions: ContributionDay[],
): ContributionDay[][] {
  if (contributions.length === 0) return []

  const weeks: ContributionDay[][] = []
  let week: ContributionDay[] = []

  // Pad the first week so columns always start on Sunday.
  const firstDow = parseUtcDate(contributions[0]!.date).getUTCDay()
  for (let i = 0; i < firstDow; i += 1) {
    week.push({ date: "", count: 0, level: 0 })
  }

  for (const day of contributions) {
    week.push(day)
    if (week.length === 7) {
      weeks.push(week)
      week = []
    }
  }

  if (week.length > 0) {
    while (week.length < 7) {
      week.push({ date: "", count: 0, level: 0 })
    }
    weeks.push(week)
  }

  return weeks
}

export function getMonthLabels(
  weeks: ContributionDay[][],
): Array<{ label: string; weekIndex: number }> {
  const labels: Array<{ label: string; weekIndex: number }> = []
  let previousMonth = -1

  for (let weekIndex = 0; weekIndex < weeks.length; weekIndex += 1) {
    const firstRealDay = weeks[weekIndex]?.find((day) => day.date)
    if (!firstRealDay) continue

    const month = parseUtcDate(firstRealDay.date).getUTCMonth()
    if (month === previousMonth) continue

    previousMonth = month
    labels.push({
      label: MONTH_NAMES[month]!.charAt(0),
      weekIndex,
    })
  }

  return labels
}
