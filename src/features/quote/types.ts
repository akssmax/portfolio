import type { FontPresetId } from "@/lib/themes/types"

export type QuoteMilestone = {
  label: string
  percent: number
}

export type QuoteDocument = {
  quoteNumber: string
  date: string
  clientCompany: string
  projectTitle: string
  overview: string
  scope: Array<string>
  exclusions: Array<string>
  timeline: string
  timelineNote: string
  investmentAmount: string
  investmentGst: boolean
  milestones: Array<QuoteMilestone>
  support: string
  font: FontPresetId
}
