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
  {
    id: "modern",
    label: "Modern",
    description: "Two-column branded layout for a compact, structured presentation.",
  },
  {
    id: "minimal",
    label: "Minimal",
    description: "Ultra-clean single column with tight type. Maximum ATS friendliness.",
  },
  {
    id: "executive",
    label: "Executive",
    description: "Strong header band and clear section rules for a senior product feel.",
  },
]
