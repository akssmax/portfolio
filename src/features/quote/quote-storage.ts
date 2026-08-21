import { DEFAULT_QUOTE_FONT, createDefaultQuoteDocument } from "./default-quote"
import { resolveQuoteFontPreset } from "./quote-fonts"
import type { QuoteDocument, QuoteMilestone } from "./types"

const STORAGE_KEY = "quote-builder-document"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function parseStringArray(value: unknown): Array<string> | null {
  if (!Array.isArray(value)) return null
  if (!value.every((item) => typeof item === "string")) return null
  return value
}

function parseMilestones(value: unknown): Array<QuoteMilestone> | null {
  if (!Array.isArray(value)) return null

  const milestones: Array<QuoteMilestone> = []

  for (const item of value) {
    if (!isRecord(item)) return null
    if (typeof item.label !== "string") return null
    if (typeof item.percent !== "number" || Number.isNaN(item.percent)) return null
    milestones.push({ label: item.label, percent: item.percent })
  }

  return milestones
}

export function parseQuoteDocument(value: unknown): QuoteDocument | null {
  if (!isRecord(value)) return null

  const defaults = createDefaultQuoteDocument()

  const scope = parseStringArray(value.scope)
  const exclusions = parseStringArray(value.exclusions)
  const milestones = parseMilestones(value.milestones)

  if (!scope || !exclusions || !milestones) return null

  return {
    quoteNumber:
      typeof value.quoteNumber === "string" ? value.quoteNumber : defaults.quoteNumber,
    date: typeof value.date === "string" ? value.date : defaults.date,
    clientCompany:
      typeof value.clientCompany === "string"
        ? value.clientCompany
        : defaults.clientCompany,
    projectTitle:
      typeof value.projectTitle === "string" ? value.projectTitle : defaults.projectTitle,
    overview: typeof value.overview === "string" ? value.overview : defaults.overview,
    scope,
    exclusions,
    timeline: typeof value.timeline === "string" ? value.timeline : defaults.timeline,
    timelineNote:
      typeof value.timelineNote === "string" ? value.timelineNote : defaults.timelineNote,
    investmentAmount:
      typeof value.investmentAmount === "string"
        ? value.investmentAmount
        : defaults.investmentAmount,
    investmentGst:
      typeof value.investmentGst === "boolean" ? value.investmentGst : defaults.investmentGst,
    milestones,
    support: typeof value.support === "string" ? value.support : defaults.support,
    font:
      typeof value.font === "string"
        ? resolveQuoteFontPreset(value.font as QuoteDocument["font"])
        : DEFAULT_QUOTE_FONT,
  }
}

export function loadQuoteDocument(): QuoteDocument | null {
  if (typeof window === "undefined") return null

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return parseQuoteDocument(JSON.parse(raw) as unknown)
  } catch {
    return null
  }
}

export function saveQuoteDocument(document: QuoteDocument): void {
  if (typeof window === "undefined") return

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(document))
  } catch {
    // Ignore quota or privacy mode errors.
  }
}
