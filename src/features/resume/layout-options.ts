import type { ResumeLayoutId } from "./types"

export const DEFAULT_RESUME_LAYOUT: ResumeLayoutId = "classic"

export const RESUME_LAYOUT_OPTIONS: {
  id: ResumeLayoutId
  label: string
  description: string
}[] = [
  {
    id: "classic",
    label: "Classic",
    description: "Clean single-column layout. ATS-friendly.",
  },
  {
    id: "designer",
    label: "Designer",
    description: "Branded layout with logomark, accent sidebar, and hierarchy.",
  },
]
