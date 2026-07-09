import { describe, expect, it } from "vitest"

import {
  computeContributionStats,
  getMonthLabels,
  groupContributionsByWeek,
  type ContributionDay,
} from "./contributions"

function day(date: string, count: number, level: ContributionDay["level"] = 1): ContributionDay {
  return { date, count, level: count === 0 ? 0 : level }
}

describe("computeContributionStats", () => {
  it("computes month, peak day, and streaks", () => {
    const contributions = [
      day("2026-01-01", 2),
      day("2026-01-02", 3),
      day("2026-01-03", 0),
      day("2026-02-01", 1),
      day("2026-02-02", 5),
      day("2026-02-03", 4),
      day("2026-02-04", 0),
    ]

    expect(computeContributionStats(contributions)).toEqual({
      mostActiveMonth: "February",
      mostActiveDay: "Feb 2, 2026",
      longestStreak: 3,
      currentStreak: 3,
    })
  })

  it("keeps current streak when the last day is empty", () => {
    const contributions = [
      day("2026-03-01", 1),
      day("2026-03-02", 2),
      day("2026-03-03", 0),
    ]

    expect(computeContributionStats(contributions).currentStreak).toBe(2)
  })

  it("resets current streak after a quiet day before today", () => {
    const contributions = [
      day("2026-03-01", 1),
      day("2026-03-02", 0),
      day("2026-03-03", 2),
      day("2026-03-04", 0),
      day("2026-03-05", 0),
    ]

    expect(computeContributionStats(contributions).currentStreak).toBe(0)
  })
})

describe("groupContributionsByWeek", () => {
  it("pads the first week to start on Sunday", () => {
    // 2026-07-06 is a Monday
    const contributions = [
      day("2026-07-06", 1),
      day("2026-07-07", 0),
      day("2026-07-08", 2),
      day("2026-07-09", 0),
      day("2026-07-10", 0),
      day("2026-07-11", 1),
      day("2026-07-12", 0),
    ]

    const weeks = groupContributionsByWeek(contributions)
    expect(weeks).toHaveLength(2)
    expect(weeks[0]?.[0]?.date).toBe("")
    expect(weeks[0]?.[1]?.date).toBe("2026-07-06")
  })
})

describe("getMonthLabels", () => {
  it("emits a label when the month changes", () => {
    const weeks = groupContributionsByWeek([
      day("2026-01-04", 1),
      day("2026-01-05", 0),
      day("2026-01-06", 0),
      day("2026-01-07", 0),
      day("2026-01-08", 0),
      day("2026-01-09", 0),
      day("2026-01-10", 0),
      day("2026-02-01", 1),
      day("2026-02-02", 0),
      day("2026-02-03", 0),
      day("2026-02-04", 0),
      day("2026-02-05", 0),
      day("2026-02-06", 0),
      day("2026-02-07", 0),
    ])

    const labels = getMonthLabels(weeks)
    expect(labels.map((item) => item.label)).toEqual(["J", "F"])
  })
})
