import type { ResumeDocument, ResumeLayoutId } from "../../types"
import { ClassicHtmlResume } from "./classic-html-resume"
import { DesignerHtmlResume } from "./designer-html-resume"

type ResumeHtmlDocumentProps = {
  document: ResumeDocument
  brandColor: string
  layout: ResumeLayoutId
}

export function ResumeHtmlDocument({
  document,
  brandColor,
  layout,
}: ResumeHtmlDocumentProps) {
  if (layout === "designer") {
    return <DesignerHtmlResume document={document} brandColor={brandColor} />
  }

  return <ClassicHtmlResume document={document} brandColor={brandColor} />
}
