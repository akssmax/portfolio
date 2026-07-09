import { useEffect, useMemo, useState } from "react"
import { motion, useReducedMotion } from "motion/react"

import {
  getMonthLabels,
  groupContributionsByWeek,
  type ContributionDay,
  type GithubContributionsPayload,
} from "@/lib/github/contributions"
import { profile } from "@/lib/profile"
import { cn } from "@/lib/utils"

const DAY_LABELS = ["", "M", "", "W", "", "F", ""] as const

const LEVEL_CLASS: Record<ContributionDay["level"], string> = {
  0: "bg-muted",
  1: "bg-emerald-200 dark:bg-emerald-950",
  2: "bg-emerald-300 dark:bg-emerald-800",
  3: "bg-emerald-500 dark:bg-emerald-600",
  4: "bg-emerald-600 dark:bg-emerald-500",
}

function formatTotal(value: number): string {
  return new Intl.NumberFormat("en-US").format(value)
}

function Cell({ day }: { day: ContributionDay }) {
  if (!day.date) {
    return <div className="size-2.5 rounded-[3px] bg-transparent sm:size-3" aria-hidden />
  }

  const label = `${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}`

  return (
    <div
      title={label}
      aria-label={label}
      className={cn(
        "size-2.5 rounded-[3px] sm:size-3",
        LEVEL_CLASS[day.level],
      )}
    />
  )
}

function HeatmapSkeleton() {
  return (
    <div className="animate-pulse space-y-4" aria-hidden>
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="h-3 w-28 rounded bg-muted" />
          <div className="h-8 w-36 rounded bg-muted" />
        </div>
        <div className="h-8 w-40 rounded-lg bg-muted" />
      </div>
      <div className="h-[108px] rounded-lg bg-muted/60" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-3 w-24 rounded bg-muted" />
            <div className="h-5 w-20 rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function GithubActivitySection() {
  const shouldReduceMotion = useReducedMotion()
  const [data, setData] = useState<GithubContributionsPayload | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/github/contributions")
        if (!response.ok) {
          throw new Error("Could not load GitHub activity")
        }
        const payload = (await response.json()) as GithubContributionsPayload
        if (!cancelled) setData(payload)
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Could not load GitHub activity",
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const weeks = useMemo(
    () => (data ? groupContributionsByWeek(data.contributions) : []),
    [data],
  )
  const monthLabels = useMemo(() => getMonthLabels(weeks), [weeks])

  return (
    <section className="border-b border-border py-24">
      <motion.div
        className="mx-auto max-w-6xl px-4 sm:px-6"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-12 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            GitHub activity
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            A live contribution heatmap synced with{" "}
            <a
              href={profile.links.github}
              target="_blank"
              rel="noreferrer"
              className="underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
            >
              @{data?.username ?? "akssmax"}
            </a>
            .
          </p>
        </div>

        <motion.div
          className="rounded-2xl border border-border bg-card p-5 sm:p-6"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.05 }}
        >
          {loading ? <HeatmapSkeleton /> : null}

          {!loading && error ? (
            <div className="space-y-2 py-8 text-center">
              <p className="text-sm font-medium text-foreground">
                GitHub activity unavailable
              </p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          ) : null}

          {!loading && data ? (
            <div className="space-y-5">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total contributions
                  </p>
                  <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground tabular-nums">
                    {formatTotal(data.total)}
                  </p>
                </div>
                <a
                  href={profile.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  View on GitHub →
                </a>
              </div>

              <div className="overflow-x-auto pb-1">
                <div className="inline-flex min-w-full flex-col gap-1.5">
                  <div
                    className="relative ml-5 h-4 text-[10px] text-muted-foreground sm:ml-6"
                    style={{
                      width: `calc(${weeks.length} * 0.75rem + ${(weeks.length - 1) * 0.2}rem)`,
                    }}
                  >
                    {monthLabels.map((month) => (
                      <span
                        key={`${month.label}-${month.weekIndex}`}
                        className="absolute top-0"
                        style={{
                          left: `calc(${month.weekIndex} * 0.95rem)`,
                        }}
                      >
                        {month.label}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-1.5">
                    <div className="flex flex-col justify-between py-px text-[10px] leading-none text-muted-foreground">
                      {DAY_LABELS.map((label, index) => (
                        <span
                          key={`${label}-${index}`}
                          className="flex h-2.5 items-center sm:h-3"
                        >
                          {label}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-[0.2rem]">
                      {weeks.map((week, weekIndex) => (
                        <div
                          key={weekIndex}
                          className="flex flex-col gap-[0.2rem]"
                        >
                          {week.map((day, dayIndex) => (
                            <Cell
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

              <div className="grid grid-cols-2 gap-4 border-t border-border pt-5 sm:grid-cols-4">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Most Active Month
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {data.stats.mostActiveMonth}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Most Active Day
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {data.stats.mostActiveDay}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Longest Streak</p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {data.stats.longestStreak}d
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Current Streak</p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {data.stats.currentStreak}d
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </motion.div>
      </motion.div>
    </section>
  )
}
