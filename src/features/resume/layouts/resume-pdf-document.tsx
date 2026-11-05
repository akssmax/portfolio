import { Document, Font } from "@react-pdf/renderer"

import { withLayoutTagline } from "../official-resume-content"
import { ClassicResumeLayout } from "./classic-layout"
import { DesignerResumeLayout } from "./designer-layout"
import { ExecutiveResumeLayout } from "./executive-layout"
import { MinimalResumeLayout } from "./minimal-layout"
import { ModernResumeLayout } from "./modern-layout"
import { OfficialResumeLayout } from "./official-layout"
import { SignatureResumeLayout } from "./signature-layout"
import type { ResumeDocument, ResumeLayoutId } from "../types"
import type { ResumeDisplayPreferences } from "../resume-display-preferences"

// Never split words across lines. Hyphenated keywords ("Post-gres", "Analyt-ics")
// break ATS keyword matching when the PDF text is extracted.
Font.registerHyphenationCallback((word) => [word])

export function ResumePdfDocument({
  document,
  brandColor,
  layout,
  fontFamily,
  display,
  accentImageSrc,
}: {
  document: ResumeDocument
  brandColor: string
  layout: ResumeLayoutId
  fontFamily: string
  display: ResumeDisplayPreferences
  accentImageSrc?: string
}) {
  const layoutProps = {
    document: withLayoutTagline(document, layout),
    brandColor,
    fontFamily,
    display,
  }

  return (
    <Document>
      {layout === "designer" ? (
        <DesignerResumeLayout {...layoutProps} />
      ) : layout === "modern" ? (
        <ModernResumeLayout {...layoutProps} />
      ) : layout === "minimal" ? (
        <MinimalResumeLayout {...layoutProps} accentImageSrc={accentImageSrc} />
      ) : layout === "executive" ? (
        <ExecutiveResumeLayout {...layoutProps} />
      ) : layout === "official" ? (
        <OfficialResumeLayout {...layoutProps} />
      ) : layout === "signature" ? (
        <SignatureResumeLayout {...layoutProps} />
      ) : (
        <ClassicResumeLayout {...layoutProps} />
      )}
    </Document>
  )
}
