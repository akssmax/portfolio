import { useEffect, useMemo, useRef, useState } from "react"
import { ArrowUpRight } from "lucide-react"

import type {
  ContributionDay,
  GithubContributionsPayload,
} from "@/lib/github/contributions"
import { GithubIcon } from "@/components/icons/social-icons"
import {
  getMonthLabels,
  groupContributionsByWeek,
} from "@/lib/github/contributions"
import { profile } from "@/lib/profile"
import { cn } from "@/lib/utils"

const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""]
const MONTH_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  timeZone: "UTC",
})

const LEVEL_CLASS: Record<ContributionDay["level"], string> = {
  0: "border border-primary/10 bg-primary/[0.045]",
  1: "bg-primary/20",
  2: "bg-primary/40",
  3: "bg-primary/65",
  4: "bg-primary",
}

function ContributionCell({ day }: { day: ContributionDay }) {
  if (!day.date) {
    return <span className="size-2.5 sm:size-3" aria-hidden />
  }

  const label = `${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}`

  return (
    <span
      className={cn(
        "block size-2.5 rounded-[3px] transition-transform duration-150 hover:scale-125 sm:size-3",
        LEVEL_CLASS[day.level]
      )}
      title={label}
      aria-hidden
    />
  )
}

export function GithubActivityCard() {
  const rootRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [data, setData] = useState<GithubContributionsPayload | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const controller = new AbortController()
    let observer: IntersectionObserver | undefined

    async function load() {
      try {
        const response = await fetch("/api/github/contributions", {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error("GitHub activity unavailable")
        const payload = (await response.json()) as GithubContributionsPayload
        if (!controller.signal.aborted) setData(payload)
      } catch {
        if (!controller.signal.aborted) setError(true)
      }
    }

    if (typeof IntersectionObserver === "undefined") {
      void load()
    } else {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return
          observer?.disconnect()
          void load()
        },
        { rootMargin: "240px" }
      )
      observer.observe(root)
    }

    return () => {
      observer?.disconnect()
      controller.abort()
    }
  }, [])

  const weeks = useMemo(
    () => (data ? groupContributionsByWeek(data.contributions) : []),
    [data]
  )
  const months = useMemo(
    () =>
      getMonthLabels(weeks).map((month) => {
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

  useEffect(() => {
    if (!data || !scrollRef.current) return
    scrollRef.current.scrollLeft = scrollRef.current.scrollWidth
  }, [data])

  return (
    <div
      ref={rootRef}
      className="rounded-2xl bg-background p-5 text-foreground shadow-2xl sm:p-7"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary">
            <GithubIcon className="size-5" />
          </span>
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
              Building in public
            </p>
            <h3 className="mt-1 text-lg font-semibold tracking-tight sm:text-xl">
              GitHub activity
            </h3>
          </div>
        </div>
        <a
          href={profile.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
        >
          @{data?.username ?? "akssmax"}
          <ArrowUpRight className="size-3.5" aria-hidden />
        </a>
      </div>

      <div className="mt-6 border-t border-border/70 pt-5">
        {data ? (
          <>
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">
                {new Intl.NumberFormat("en-US").format(data.total)}
              </span>
              <span className="text-sm text-muted-foreground">
                contributions in the last year
              </span>
            </div>

            <div
              ref={scrollRef}
              className="mt-5 overflow-x-auto pb-2 [--step:14px] sm:[--step:16px]"
              role="region"
              aria-label="GitHub contribution calendar; scroll horizontally for earlier months"
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
                  aria-label={`${data.total} GitHub contributions from ${data.range.from} to ${data.range.to}`}
                >
                  <div className="flex w-6 shrink-0 flex-col gap-1 text-[9px] leading-none text-muted-foreground sm:w-7">
                    {DAY_LABELS.map((label, index) => (
                      <span
                        key={index}
                        className="flex h-2.5 items-center sm:h-3"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-1">
                    {weeks.map((week, weekIndex) => (
                      <div key={weekIndex} className="flex flex-col gap-1">
                        {week.map((day, dayIndex) => (
                          <ContributionCell
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

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-4 text-xs text-muted-foreground">
              <span>Public contributions · last 12 months</span>
              <div
                className="flex items-center gap-1.5"
                aria-label="Color scale from fewer to more contributions"
              >
                <span>Less</span>
                {[0, 1, 2, 3, 4].map((level) => (
                  <span
                    key={level}
                    className={cn(
                      "size-2.5 rounded-[3px] sm:size-3",
                      LEVEL_CLASS[level as ContributionDay["level"]]
                    )}
                    aria-hidden
                  />
                ))}
                <span>More</span>
              </div>
            </div>
          </>
        ) : error ? (
          <p className="py-6 text-sm text-muted-foreground">
            Activity is temporarily unavailable. You can view the latest work on{" "}
            <a
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </p>
        ) : (
          <div
            className="animate-pulse space-y-4"
            aria-label="Loading GitHub activity"
          >
            <div className="h-8 w-64 max-w-full rounded-lg bg-primary/10" />
            <div className="h-24 rounded-lg bg-primary/[0.06]" />
          </div>
        )}
      </div>
    </div>
  )
}
