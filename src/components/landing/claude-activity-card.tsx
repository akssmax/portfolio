import { useEffect, useMemo, useRef } from "react"
import { Asterisk } from "lucide-react"
import type { ReactNode } from "react"

import type { ContributionDay } from "@/lib/github/contributions"
import type { ClaudeDay, ClaudeStatsPayload } from "@/lib/claude/claude-stats"
import {
  getMonthLabels,
  groupContributionsByWeek,
} from "@/lib/github/contributions"
import { formatCompact, prettyModelName } from "@/lib/claude/claude-stats"
import rawStats from "@/lib/claude/claude-stats.json"
import { cn } from "@/lib/utils"

const data = rawStats as ClaudeStatsPayload

const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""]
const MONTH_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  timeZone: "UTC",
})
const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
})

const LEVEL_CLASS: Record<ContributionDay["level"], string> = {
  0: "border border-primary/10 bg-primary/[0.045]",
  1: "bg-primary/20",
  2: "bg-primary/40",
  3: "bg-primary/65",
  4: "bg-primary",
}

function formatDate(date: string): string {
  return date ? DATE_FORMATTER.format(new Date(`${date}T00:00:00Z`)) : "—"
}

function ActivityCell({ day }: { day: ClaudeDay }) {
  if (!day.date) {
    return <span className="size-2.5 sm:size-3" aria-hidden />
  }

  const label =
    day.count > 0
      ? `${day.count} prompt${day.count === 1 ? "" : "s"} · ${day.sessions} session${day.sessions === 1 ? "" : "s"} · ${day.toolCalls} tool calls on ${day.date}`
      : `No Claude Code sessions on ${day.date}`

  return (
    <span
      className={cn(
        "block size-2.5 rounded-[3px] transition-transform duration-150 hover:scale-125 sm:size-3",
        LEVEL_CLASS[day.level],
      )}
      title={label}
      aria-hidden
    />
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold tabular-nums text-foreground sm:text-base">
        {value}
      </p>
    </div>
  )
}

export function ClaudeActivityCard({ toggle }: { toggle?: ReactNode } = {}) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const weeks = useMemo(
    () => groupContributionsByWeek(data.days) as Array<Array<ClaudeDay>>,
    [],
  )
  const months = useMemo(
    () =>
      getMonthLabels(weeks)
        // A partial leading month would collide with the next label.
        .filter((month, index, all) => {
          const next = all[index + 1]
          return index > 0 || !next || next.weekIndex - month.weekIndex >= 3
        })
        .map((month) => {
        const firstDay = weeks[month.weekIndex]?.find((day) => day.date)?.date
        return {
          ...month,
          label: firstDay
            ? MONTH_FORMATTER.format(new Date(`${firstDay}T00:00:00Z`))
            : month.label,
        }
      }),
    [weeks],
  )

  // Start scrolled to the most recent weeks, like the GitHub card.
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollLeft = el.scrollWidth
  }, [])

  const topModels = data.models.slice(0, 3)
  const modelTotal = data.models.reduce((sum, model) => sum + model.tokens, 0)

  return (
    <div className="rounded-2xl bg-background p-5 text-foreground shadow-2xl sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary">
            <Asterisk className="size-5" aria-hidden />
          </span>
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
              Building with AI
            </p>
            <h3 className="mt-1 text-lg font-semibold tracking-tight sm:text-xl">
              Claude Code activity
            </h3>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {toggle}
          <span className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
            Updated {formatDate(data.generatedAt.slice(0, 10))}
          </span>
        </div>
      </div>

      <div className="mt-6 border-t border-border/70 pt-5">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">
            {new Intl.NumberFormat("en-US").format(data.totals.prompts)}
          </span>
          <span className="text-sm text-muted-foreground">
            prompts across {data.totals.sessions} sessions
          </span>
        </div>

        <div
          ref={scrollRef}
          className="mt-5 overflow-x-auto pb-2 [--step:14px] sm:[--step:16px]"
          role="region"
          aria-label="Claude Code activity calendar; scroll horizontally for earlier months"
          tabIndex={0}
        >
          <div className="w-max min-w-full">
            <div className="relative ml-8 h-5 text-[10px] font-medium text-muted-foreground sm:ml-10">
              {months.map((month) => (
                <span
                  key={`${month.label}-${month.weekIndex}`}
                  className="absolute top-0 whitespace-nowrap"
                  style={{ left: `calc(${month.weekIndex} * var(--step))` }}
                >
                  {month.label}
                </span>
              ))}
            </div>
            <div
              className="flex gap-2 sm:gap-3"
              role="img"
              aria-label={`${data.totals.prompts} Claude Code prompts over ${data.totals.activeDays} active days from ${data.range.from} to ${data.range.to}`}
            >
              <div className="flex w-6 shrink-0 flex-col gap-1 text-[9px] leading-none text-muted-foreground sm:w-7">
                {DAY_LABELS.map((label, index) => (
                  <span key={index} className="flex h-2.5 items-center sm:h-3">
                    {label}
                  </span>
                ))}
              </div>
              <div className="flex gap-1">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {week.map((day, dayIndex) => (
                      <ActivityCell
                        key={day.date || `${weekIndex}-${dayIndex}`}
                        day={day}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-border/70 pt-4 sm:grid-cols-4">
          <Stat label="Tool calls" value={formatCompact(data.totals.toolCalls)} />
          <Stat
            label="Tokens generated"
            value={formatCompact(data.totals.outputTokens)}
          />
          <Stat label="Active days" value={String(data.totals.activeDays)} />
          <Stat
            label="Longest streak"
            value={`${data.stats.longestStreak}d`}
          />
        </div>

        {topModels.length > 0 && (
          <div className="mt-4 border-t border-border/70 pt-4">
            <p className="text-xs text-muted-foreground">Models</p>
            <div
              className="mt-2 flex h-2 overflow-hidden rounded-full bg-primary/[0.06]"
              aria-hidden
            >
              {topModels.map((model, index) => (
                <span
                  key={model.model}
                  className={cn(
                    index === 0 ? "bg-primary" : index === 1 ? "bg-primary/55" : "bg-primary/30",
                  )}
                  style={{ width: `${(model.tokens / modelTotal) * 100}%` }}
                />
              ))}
            </div>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {topModels.map((model) => (
                <li key={model.model} className="tabular-nums">
                  <span className="font-medium text-foreground">
                    {prettyModelName(model.model)}
                  </span>{" "}
                  {Math.max(1, Math.round((model.tokens / modelTotal) * 100))}%
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="mt-4 border-t border-border/70 pt-4 text-xs text-muted-foreground">
          From local Claude Code session logs · tracked since{" "}
          {formatDate(data.trackedSince)}. Aggregates only, no prompts or code.
        </p>
      </div>
    </div>
  )
}
