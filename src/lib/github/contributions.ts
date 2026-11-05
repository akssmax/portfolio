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

/** GitHub's public calendar includes exact counts in the accessible cell tooltips. */
export function parseGithubContributionCalendar(html: string): Array<ContributionDay> {
  const days: Array<ContributionDay> = []
  const cellPattern = /<td\b[^>]*data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="([0-4])"[^>]*><\/td>\s*<tool-tip\b[^>]*>(.*?)<\/tool-tip>/gs

  for (const match of html.matchAll(cellPattern)) {
    const [, date, rawLevel, tooltip] = match
    const countMatch = tooltip.match(/^([\d,]+) contributions? on /)
    const count = tooltip.startsWith("No contributions on ")
      ? 0
      : countMatch
        ? Number(countMatch[1].replaceAll(",", ""))
        : NaN

    if (!date || !Number.isFinite(count)) {
      throw new Error("GitHub contribution calendar format changed")
    }

    days.push({ date, count, level: normalizeLevel(Number(rawLevel)) })
  }

  // Do not silently show a partial or empty year if GitHub changes its markup.
  if (days.length < 350 || new Set(days.map((day) => day.date)).size !== days.length) {
    throw new Error("GitHub contribution calendar is incomplete")
  }

  return days.sort((a, b) => a.date.localeCompare(b.date))
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

const GRAPHQL_LEVELS: Record<string, ContributionDay["level"]> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
}

type GraphqlCalendarResponse = {
  data?: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          weeks: Array<{
            contributionDays: Array<{
              date: string
              contributionCount: number
              contributionLevel: string
            }>
          }>
        }
      }
    } | null
  }
  errors?: Array<{ message: string }>
}

/**
 * Authenticated calendar. When the token belongs to the profile owner, GitHub
 * includes private-repo contributions — the same total you see when logged in.
 */
async function fetchGraphqlContributions(
  username: string,
  token: string,
): Promise<Array<ContributionDay>> {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "design-portfolio",
    },
    body: JSON.stringify({
      query: `query($login: String!) {
        user(login: $login) {
          contributionsCollection {
            contributionCalendar {
              weeks { contributionDays { date contributionCount contributionLevel } }
            }
          }
        }
      }`,
      variables: { login: username },
    }),
  })

  if (!response.ok) {
    throw new Error(`GitHub GraphQL failed (${response.status})`)
  }

  const json = (await response.json()) as GraphqlCalendarResponse
  const weeks =
    json.data?.user?.contributionsCollection.contributionCalendar.weeks
  if (!weeks) {
    throw new Error(json.errors?.[0]?.message ?? "GitHub GraphQL returned no data")
  }

  return weeks
    .flatMap((week) => week.contributionDays)
    .map((day) => ({
      date: day.date,
      count: day.contributionCount,
      level: GRAPHQL_LEVELS[day.contributionLevel] ?? 0,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

async function fetchPublicCalendar(
  username: string,
): Promise<Array<ContributionDay>> {
  const response = await fetch(
    `https://github.com/users/${encodeURIComponent(username)}/contributions`,
    {
      headers: { Accept: "text/html" },
    },
  )

  if (!response.ok) {
    throw new Error(`GitHub contributions upstream failed (${response.status})`)
  }

  return parseGithubContributionCalendar(await response.text())
}

export async function fetchGithubContributions(
  username: string,
  token?: string,
): Promise<GithubContributionsPayload> {
  let contributions: Array<ContributionDay> | null = null
  if (token) {
    try {
      contributions = await fetchGraphqlContributions(username, token)
    } catch (error) {
      console.warn("[github] GraphQL failed, falling back to public calendar", error)
    }
  }
  contributions ??= await fetchPublicCalendar(username)

  return buildPayload(username, contributions)
}

function buildPayload(
  username: string,
  contributions: Array<ContributionDay>,
): GithubContributionsPayload {
  const total = contributions.reduce((sum, day) => sum + day.count, 0)

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
