import type { ContributionDay, ContributionStats } from "@/lib/github/contributions"
import { computeContributionStats } from "@/lib/github/contributions"

/** One calendar day of Claude Code usage. `count` = prompts you sent that day. */
export type ClaudeDay = ContributionDay & {
  sessions: number
  toolCalls: number
  tokens: number
}

export type ClaudeModelShare = { model: string; tokens: number }

/**
 * Aggregate-only snapshot written by `npm run stats:claude`. It never contains
 * prompt text, code, file paths or project names.
 */
export type ClaudeStatsPayload = {
  generatedAt: string
  trackedSince: string
  range: { from: string; to: string }
  totals: {
    sessions: number
    prompts: number
    toolCalls: number
    tokens: number
    outputTokens: number
    activeDays: number
  }
  models: Array<ClaudeModelShare>
  stats: ContributionStats
  days: Array<ClaudeDay>
}

/** GitHub-style quartile levels, relative to this year's busiest days. */
export function assignLevels<T extends { count: number }>(
  days: Array<T>,
): Array<T & { level: ContributionDay["level"] }> {
  const active = days
    .map((day) => day.count)
    .filter((count) => count > 0)
    .sort((a, b) => a - b)
  const quantile = (q: number) =>
    active[Math.min(active.length - 1, Math.floor(q * (active.length - 1)))] ?? 0
  const [q1, q2, q3] = [quantile(0.25), quantile(0.5), quantile(0.75)]

  return days.map((day) => {
    const level: ContributionDay["level"] =
      day.count <= 0 ? 0 : day.count <= q1 ? 1 : day.count <= q2 ? 2 : day.count <= q3 ? 3 : 4
    return { ...day, level }
  })
}

export function buildClaudeStats(
  days: Array<Omit<ClaudeDay, "level">>,
  models: Array<ClaudeModelShare>,
  outputTokens: number,
  trackedSince: string,
  generatedAt = new Date().toISOString(),
): ClaudeStatsPayload {
  const leveled = assignLevels(days)
  const sum = (key: "sessions" | "count" | "toolCalls" | "tokens") =>
    leveled.reduce((total, day) => total + day[key], 0)

  return {
    generatedAt,
    trackedSince,
    range: { from: leveled[0]?.date ?? "", to: leveled.at(-1)?.date ?? "" },
    totals: {
      sessions: sum("sessions"),
      prompts: sum("count"),
      toolCalls: sum("toolCalls"),
      tokens: sum("tokens"),
      outputTokens,
      activeDays: leveled.filter((day) => day.count > 0).length,
    },
    models: [...models].sort((a, b) => b.tokens - a.tokens),
    stats: computeContributionStats(leveled),
    days: leveled,
  }
}

const COMPACT = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
})

export function formatCompact(value: number): string {
  return COMPACT.format(value)
}

/** "claude-opus-5-5-20260101" → "Opus 5.5" */
export function prettyModelName(model: string): string {
  const match = model.match(/claude-([a-z]+)-(\d+)(?:-(\d{1,2}))?(?:-\d{8})?$/)
  if (!match) return model
  const [, family, major, minor] = match
  return `${family.charAt(0).toUpperCase()}${family.slice(1)} ${major}${minor ? `.${minor}` : ""}`
}
