import type { ResumeLayoutId } from "../../types"
import { ClassicHtmlResume } from "./classic-html-resume"
import { DesignerHtmlResume } from "./designer-html-resume"
import { ExecutiveHtmlResume } from "./executive-html-resume"
import { MinimalHtmlResume } from "./minimal-html-resume"
import { ModernHtmlResume } from "./modern-html-resume"
import type { ResumeHtmlLayoutProps } from "./resume-html-props"

type ResumeHtmlDocumentProps = ResumeHtmlLayoutProps & {
  layout: ResumeLayoutId
}

export function ResumeHtmlDocument({
  document,
  brandColor,
  fontFamily,
  display,
  layout,
  onChange,
}: ResumeHtmlDocumentProps) {
  const layoutProps = { document, brandColor, fontFamily, display, onChange }

  if (layout === "designer") return <DesignerHtmlResume {...layoutProps} />
  if (layout === "modern") return <ModernHtmlResume {...layoutProps} />
  if (layout === "minimal") return <MinimalHtmlResume {...layoutProps} />
  if (layout === "executive") return <ExecutiveHtmlResume {...layoutProps} />
  return <ClassicHtmlResume {...layoutProps} />
}
