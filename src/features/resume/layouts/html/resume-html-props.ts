import type { ResumeDisplayPreferences } from "../../resume-display-preferences"
import type { ResumeDocument } from "../../types"

export { getResumePreviewFontFamily, preloadResumeFont, resolveResumeFontPreset } from "../../resume-font-utils"

export type ResumeHtmlLayoutProps = {
  document: ResumeDocument
  brandColor: string
  fontFamily: string
  display: ResumeDisplayPreferences
  onChange?: (updated: ResumeDocument) => void
}
