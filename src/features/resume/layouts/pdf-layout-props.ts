import type { ResumeDisplayPreferences } from "../resume-display-preferences"
import { DEFAULT_RESUME_DISPLAY_PREFERENCES } from "../resume-display-preferences"
import type { ResumeDocument } from "../types"

export type ResumePdfLayoutProps = {
  document: ResumeDocument
  brandColor: string
  fontFamily?: string
  display?: ResumeDisplayPreferences
}

export const DEFAULT_PDF_LAYOUT_PROPS = {
  fontFamily: "Helvetica",
  display: DEFAULT_RESUME_DISPLAY_PREFERENCES,
} as const
