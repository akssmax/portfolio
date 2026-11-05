/**
 * Builds src/lib/claude/claude-stats.json from local Claude Code transcripts
 * (~/.claude/projects/**\/*.jsonl). Only daily aggregates are written: no
 * prompt text, code, file paths or project names leave this machine.
 *
 *   npm run stats:claude
 */
import { createReadStream, readdirSync, writeFileSync } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"
import { createInterface } from "node:readline"

import { buildClaudeStats, type ClaudeDay } from "../src/lib/claude/claude-stats"

const PROJECTS_DIR = join(process.env.CLAUDE_CONFIG_DIR ?? join(homedir(), ".claude"), "projects")
const OUT_FILE = join(import.meta.dirname, "../src/lib/claude/claude-stats.json")
const DAYS = 371 // 53 weeks, matching GitHub's calendar width

type DayAccumulator = {
  sessions: Set<string>
  prompts: number
  toolCalls: number
  tokens: number
}

// Local calendar date, so a late-night session lands on the day you worked.
const localKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

const dateKey = (iso: string) => {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? null : localKey(d)
}

function listTranscripts(dir: string): Array<string> {
  const out: Array<string> = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...listTranscripts(path))
    else if (entry.name.endsWith(".jsonl")) out.push(path)
  }
  return out
}

type ContentBlock = { type?: string; id?: string; text?: string }

/** A prompt is something you typed — not tool results, hooks or injected context. */
function isHumanPrompt(entry: Record<string, unknown>): boolean {
  if (entry.isSidechain || entry.isMeta || entry.isCompactSummary) return false
  const content = (entry.message as { content?: unknown } | undefined)?.content
  const text =
    typeof content === "string"
      ? content
      : Array.isArray(content) &&
          !content.some((block: ContentBlock) => block.type === "tool_result")
        ? content
            .filter((block: ContentBlock) => block.type === "text")
            .map((block: ContentBlock) => block.text ?? "")
            .join("")
        : ""
  const trimmed = text.trim()
  return (
    trimmed.length > 0 &&
    !trimmed.startsWith("<local-command") &&
    !trimmed.startsWith("<command-") &&
    !trimmed.startsWith("<system-reminder>") &&
    !trimmed.startsWith("Caveat:") &&
    !trimmed.startsWith("[Request interrupted")
  )
}

async function main() {
  const days = new Map<string, DayAccumulator>()
  const day = (key: string) => {
    let acc = days.get(key)
    if (!acc) {
      acc = { sessions: new Set(), prompts: 0, toolCalls: 0, tokens: 0 }
      days.set(key, acc)
    }
    return acc
  }
  const models = new Map<string, number>()
  const seenMessages = new Set<string>()
  const seenToolUses = new Set<string>()
  let outputTokens = 0
  let earliest = ""

  const files = listTranscripts(PROJECTS_DIR)
  for (const file of files) {
    const isSubagent = file.includes("/subagents/")
    const lines = createInterface({ input: createReadStream(file), crlfDelay: Infinity })

    for await (const line of lines) {
      if (!line.includes('"timestamp"')) continue
      let entry: Record<string, unknown>
      try {
        entry = JSON.parse(line)
      } catch {
        continue
      }
      const key = typeof entry.timestamp === "string" ? dateKey(entry.timestamp) : null
      if (!key) continue

      if (entry.type === "user" && !isSubagent && isHumanPrompt(entry)) {
        const acc = day(key)
        acc.prompts += 1
        if (typeof entry.sessionId === "string") acc.sessions.add(entry.sessionId)
        if (!earliest || key < earliest) earliest = key
      }

      if (entry.type === "assistant") {
        const message = entry.message as {
          id?: string
          model?: string
          content?: Array<ContentBlock>
          usage?: Record<string, number>
        }
        for (const block of message?.content ?? []) {
          if (block.type === "tool_use" && block.id && !seenToolUses.has(block.id)) {
            seenToolUses.add(block.id)
            day(key).toolCalls += 1
          }
        }
        // A response is logged once per content block; count its usage once.
        const usage = message?.usage
        if (!usage || !message.id || seenMessages.has(message.id)) continue
        if (!message.model || message.model === "<synthetic>") continue
        seenMessages.add(message.id)
        const tokens =
          (usage.input_tokens ?? 0) +
          (usage.output_tokens ?? 0) +
          (usage.cache_creation_input_tokens ?? 0) +
          (usage.cache_read_input_tokens ?? 0)
        day(key).tokens += tokens
        outputTokens += usage.output_tokens ?? 0
        models.set(message.model, (models.get(message.model) ?? 0) + tokens)
      }
    }
  }

  const today = new Date()
  const series: Array<Omit<ClaudeDay, "level">> = []
  for (let offset = DAYS - 1; offset >= 0; offset -= 1) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset)
    const key = localKey(d)
    const acc = days.get(key)
    series.push({
      date: key,
      count: acc?.prompts ?? 0,
      sessions: acc?.sessions.size ?? 0,
      toolCalls: acc?.toolCalls ?? 0,
      tokens: acc?.tokens ?? 0,
    })
  }

  const payload = buildClaudeStats(
    series,
    [...models].map(([model, tokens]) => ({ model, tokens })),
    outputTokens,
    earliest,
  )
  writeFileSync(OUT_FILE, `${JSON.stringify(payload, null, 2)}\n`)

  const { totals } = payload
  console.log(
    `[claude-stats] ${files.length} transcripts → ${totals.prompts} prompts, ${totals.sessions} sessions, ` +
      `${totals.toolCalls} tool calls, ${totals.tokens.toLocaleString()} tokens over ${totals.activeDays} active days ` +
      `(since ${earliest}). Wrote ${OUT_FILE}`,
  )
}

void main()
