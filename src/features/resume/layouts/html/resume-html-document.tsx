import type { ResumeDocument, ResumeLayoutId } from "../../types"
import { ClassicHtmlResume } from "./classic-html-resume"
import { DesignerHtmlResume } from "./designer-html-resume"
import { ExecutiveHtmlResume } from "./executive-html-resume"
import { MinimalHtmlResume } from "./minimal-html-resume"
import { ModernHtmlResume } from "./modern-html-resume"

type ResumeHtmlDocumentProps = {
  document: ResumeDocument
  brandColor: string
  layout: ResumeLayoutId
  onChange?: (updated: ResumeDocument) => void
}

export function ResumeHtmlDocument({
  document,
  brandColor,
  layout,
  onChange,
}: ResumeHtmlDocumentProps) {
  if (layout === "designer") {
    return <DesignerHtmlResume document={document} brandColor={brandColor} onChange={onChange} />
  }

  if (layout === "modern") {
    return <ModernHtmlResume document={document} brandColor={brandColor} onChange={onChange} />
  }

  if (layout === "minimal") {
    return <MinimalHtmlResume document={document} brandColor={brandColor} onChange={onChange} />
  }

  if (layout === "executive") {
    return <ExecutiveHtmlResume document={document} brandColor={brandColor} onChange={onChange} />
  }

  return <ClassicHtmlResume document={document} brandColor={brandColor} onChange={onChange} />
}
