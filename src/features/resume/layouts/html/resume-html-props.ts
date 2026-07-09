import type { FontPresetId } from "@/lib/themes/types"
import { FONT_FAMILY_BY_PRESET } from "@/lib/fonts/font-families"

import type { ResumeDisplayPreferences } from "../../resume-display-preferences"
import type { ResumeDocument } from "../../types"

export type ResumeHtmlLayoutProps = {
  document: ResumeDocument
  brandColor: string
  fontFamily: string
  display: ResumeDisplayPreferences
  onChange?: (updated: ResumeDocument) => void
}

export function getResumePreviewFontFamily(font: FontPresetId): string {
  return FONT_FAMILY_BY_PRESET[font] ?? FONT_FAMILY_BY_PRESET.geist
}
