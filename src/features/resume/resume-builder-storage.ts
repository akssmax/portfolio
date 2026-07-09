
import { DEFAULT_RESUME_SECTIONS } from "./default-sections"
import { DEFAULT_RESUME_LAYOUT } from "./layout-options"
import {
  DEFAULT_RESUME_DISPLAY_PREFERENCES,
  parseResumeDisplayPreferences,
} from "./resume-display-preferences"
import {
  isResumeBrandColorValid
} from "./resume-brand-color-utils"
import type {ResumeBrandColorSelection} from "./resume-brand-color-utils";
import type { BrandPresetId } from "@/lib/themes/types"
import type { CoverLetterDocument, ResumeDocument, ResumeLayoutId, ResumeSectionConfig, ResumeSectionId  } from "./types"
import type { ResumeDisplayPreferences } from "./resume-display-preferences"

import {
  BRAND_COLOR_PRESETS,
  DEFAULT_THEME_PRESET,
} from "@/lib/themes/registry"

const STORAGE_KEY = "resume-builder-settings"
const DOCUMENT_STORAGE_KEY = "resume-builder-document"

const RESUME_SECTION_IDS: Array<ResumeSectionId> = [
  "summary",
  "experience",
  "education",
  "skills",
  "contact",
  "certifications",
  "languages",
  "interests",
]

const VALID_LAYOUTS: Array<ResumeLayoutId> = [
  "classic",
  "designer",
  "modern",
  "minimal",
  "executive",
]

const VALID_PRESET_IDS = new Set<BrandPresetId>([
  DEFAULT_THEME_PRESET.id as BrandPresetId,
  ...BRAND_COLOR_PRESETS.map((preset) => preset.id as BrandPresetId),
])

export type ResumeBuilderSettings = {
  layout: ResumeLayoutId
  sections: ResumeSectionConfig
  colorSelection: ResumeBrandColorSelection
  display: ResumeDisplayPreferences
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function parseSections(value: unknown): ResumeSectionConfig | null {
  if (!isRecord(value)) return null

  const sections = {} as ResumeSectionConfig

  for (const sectionId of RESUME_SECTION_IDS) {
    if (typeof value[sectionId] !== "boolean") return null
    sections[sectionId] = value[sectionId]
  }

  return sections
}

function parseColorSelection(value: unknown): ResumeBrandColorSelection | null {
  if (!isRecord(value) || typeof value.type !== "string") return null

  if (value.type === "preset") {
    if (typeof value.presetId !== "string") return null
    if (!VALID_PRESET_IDS.has(value.presetId as BrandPresetId)) return null
    return { type: "preset", presetId: value.presetId as BrandPresetId }
  }

  if (value.type === "custom") {
    if (typeof value.hex !== "string") return null
    const selection: ResumeBrandColorSelection = { type: "custom", hex: value.hex }
    if (!isResumeBrandColorValid(selection)) return null
    return selection
  }

  return null
}

function parseResumeBuilderSettings(value: unknown): ResumeBuilderSettings | null {
  if (!isRecord(value)) return null
  if (typeof value.layout !== "string" || !VALID_LAYOUTS.includes(value.layout as ResumeLayoutId)) {
    return null
  }

  const sections = parseSections(value.sections)
  const colorSelection = parseColorSelection(value.colorSelection)
  const display =
    parseResumeDisplayPreferences(value.display) ?? DEFAULT_RESUME_DISPLAY_PREFERENCES

  if (!sections || !colorSelection) return null

  return {
    layout: value.layout as ResumeLayoutId,
    sections,
    colorSelection,
    display,
  }
}

export function loadResumeBuilderSettings(): ResumeBuilderSettings | null {
  if (typeof window === "undefined") return null

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    return parseResumeBuilderSettings(JSON.parse(raw) as unknown)
  } catch {
    return null
  }
}

export function saveResumeBuilderSettings(settings: ResumeBuilderSettings): void {
  if (typeof window === "undefined") return

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // Ignore quota or privacy mode errors.
  }
}

export function createDefaultResumeBuilderSettings(appearance: {
  palette: BrandPresetId
  customBrandColor: string | null
}): ResumeBuilderSettings {
  return {
    layout: DEFAULT_RESUME_LAYOUT,
    sections: DEFAULT_RESUME_SECTIONS,
    colorSelection: appearance.customBrandColor
      ? { type: "custom", hex: appearance.customBrandColor }
      : { type: "preset", presetId: appearance.palette },
    display: DEFAULT_RESUME_DISPLAY_PREFERENCES,
  }
}

export function loadResumeDocument(): ResumeDocument | null {
  if (typeof window === "undefined") return null

  try {
    const raw = window.localStorage.getItem(DOCUMENT_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as ResumeDocument
  } catch {
    return null
  }
}

export function saveResumeDocument(document: ResumeDocument): void {
  if (typeof window === "undefined") return

  try {
    window.localStorage.setItem(DOCUMENT_STORAGE_KEY, JSON.stringify(document))
  } catch {
    // Ignore storage issues.
  }
}

const COVER_LETTER_STORAGE_KEY = "resume-builder-cover-letter"

export function loadCoverLetterDocument(): CoverLetterDocument | null {
  if (typeof window === "undefined") return null

  try {
    const raw = window.localStorage.getItem(COVER_LETTER_STORAGE_KEY)
    if (!raw) return null

    return JSON.parse(raw) as CoverLetterDocument
  } catch {
    return null
  }
}

export function saveCoverLetterDocument(document: CoverLetterDocument): void {
  if (typeof window === "undefined") return

  try {
    window.localStorage.setItem(COVER_LETTER_STORAGE_KEY, JSON.stringify(document))
  } catch {
    // Ignore storage issues.
  }
}
