import { Document } from "@react-pdf/renderer"

import type { ResumeDisplayPreferences } from "../resume-display-preferences"
import type { ResumeDocument, ResumeLayoutId } from "../types"
import { ClassicResumeLayout } from "./classic-layout"
import { DesignerResumeLayout } from "./designer-layout"
import { ExecutiveResumeLayout } from "./executive-layout"
import { MinimalResumeLayout } from "./minimal-layout"
import { ModernResumeLayout } from "./modern-layout"

export function ResumePdfDocument({
  document,
  brandColor,
  layout,
  fontFamily,
  display,
}: {
  document: ResumeDocument
  brandColor: string
  layout: ResumeLayoutId
  fontFamily: string
  display: ResumeDisplayPreferences
}) {
  const layoutProps = { document, brandColor, fontFamily, display }

  return (
    <Document>
      {layout === "designer" ? (
        <DesignerResumeLayout {...layoutProps} />
      ) : layout === "modern" ? (
        <ModernResumeLayout {...layoutProps} />
      ) : layout === "minimal" ? (
        <MinimalResumeLayout {...layoutProps} />
      ) : layout === "executive" ? (
        <ExecutiveResumeLayout {...layoutProps} />
      ) : (
        <ClassicResumeLayout {...layoutProps} />
      )}
    </Document>
  )
}
