import type { ResumeDisplayPreferences } from "../../resume-display-preferences"
import type { ResumeDocument } from "../../types"

export { getResumePreviewFontFamily, preloadResumeFont, resolveResumeFontPreset } from "../../resume-font-utils"

/** Resume preview headings must inherit the selected font, not site `font-sans`. */
export const RESUME_HTML_ROOT_CLASS =
  "[&_h1]:font-[inherit] [&_h2]:font-[inherit] [&_h3]:font-[inherit] [&_h4]:font-[inherit]"

export type ResumeHtmlLayoutProps = {
  document: ResumeDocument
  brandColor: string
  fontFamily: string
  display: ResumeDisplayPreferences
  onChange?: (updated: ResumeDocument) => void
}
