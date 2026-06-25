import { Document } from "@react-pdf/renderer"

import type { ResumeDocument, ResumeLayoutId } from "../types"
import { ClassicResumeLayout } from "./classic-layout"
import { DesignerResumeLayout } from "./designer-layout"
import { ModernResumeLayout } from "./modern-layout"

export function ResumePdfDocument({
  document,
  brandColor,
  layout,
}: {
  document: ResumeDocument
  brandColor: string
  layout: ResumeLayoutId
}) {
  return (
    <Document>
      {layout === "designer" ? (
        <DesignerResumeLayout document={document} brandColor={brandColor} />
      ) : layout === "modern" ? (
        <ModernResumeLayout document={document} brandColor={brandColor} />
      ) : (
        <ClassicResumeLayout document={document} brandColor={brandColor} />
      )}
    </Document>
  )
}
