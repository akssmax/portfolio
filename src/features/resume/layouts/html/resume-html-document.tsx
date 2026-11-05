import { withLayoutTagline } from "../../official-resume-content"
import { ClassicHtmlResume } from "./classic-html-resume"
import { DesignerHtmlResume } from "./designer-html-resume"
import { ExecutiveHtmlResume } from "./executive-html-resume"
import { MinimalHtmlResume } from "./minimal-html-resume"
import { ModernHtmlResume } from "./modern-html-resume"
import { OfficialHtmlResume } from "./official-html-resume"
import { SignatureHtmlResume } from "./signature-html-resume"
import type { ResumeHtmlLayoutProps } from "./resume-html-props"
import type { ResumeLayoutId } from "../../types"

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
  const layoutProps = {
    document: withLayoutTagline(document, layout),
    brandColor,
    fontFamily,
    display,
    onChange,
  }

  if (layout === "designer") return <DesignerHtmlResume {...layoutProps} />
  if (layout === "modern") return <ModernHtmlResume {...layoutProps} />
  if (layout === "minimal") return <MinimalHtmlResume {...layoutProps} />
  if (layout === "executive") return <ExecutiveHtmlResume {...layoutProps} />
  if (layout === "official") return <OfficialHtmlResume {...layoutProps} />
  if (layout === "signature") return <SignatureHtmlResume {...layoutProps} />
  return <ClassicHtmlResume {...layoutProps} />
}
