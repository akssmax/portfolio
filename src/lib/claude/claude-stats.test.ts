import { describe, expect, it } from "vitest"

import { assignLevels, buildClaudeStats, prettyModelName } from "./claude-stats"

const day = (date: string, count: number) => ({
  date,
  count,
  sessions: count ? 1 : 0,
  toolCalls: count * 2,
  tokens: count * 100,
})

describe("assignLevels", () => {
  it("keeps empty days at level 0 and puts the busiest day at level 4", () => {
    const levels = assignLevels([
      day("a", 0),
      day("b", 1),
      day("c", 5),
      day("d", 10),
      day("e", 50),
    ]).map((d) => d.level)
    expect(levels[0]).toBe(0)
    expect(levels.at(-1)).toBe(4)
    expect(levels.slice(1)).toEqual([...levels.slice(1)].sort())
  })
})

describe("buildClaudeStats", () => {
  it("sums totals and counts active days", () => {
    const stats = buildClaudeStats(
      [day("2026-01-01", 2), day("2026-01-02", 0), day("2026-01-03", 3)],
      [],
      42,
      "2026-01-01",
      "x"
    )
    expect(stats.totals).toEqual({
      sessions: 2,
      prompts: 5,
      toolCalls: 10,
      tokens: 500,
      outputTokens: 42,
      activeDays: 2,
    })
    expect(stats.range).toEqual({ from: "2026-01-01", to: "2026-01-03" })
  })
})

describe("prettyModelName", () => {
  it("formats model ids", () => {
    expect(prettyModelName("claude-opus-5-5")).toBe("Opus 5.5")
    expect(prettyModelName("claude-haiku-4-5-20251001")).toBe("Haiku 4.5")
    expect(prettyModelName("claude-fable-5")).toBe("Fable 5")
  })
})
