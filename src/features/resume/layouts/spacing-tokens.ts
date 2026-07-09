import type { ResumeLayoutId } from "../types"

/** Shared spacing tokens — keep PDF StyleSheet and HTML preview in sync. */

export type ResumePageMargins = {
  paddingTop: number
  paddingBottom: number
  paddingLeft: number
  paddingRight: number
}

export type ResumeLayoutSpacing = {
  page: ResumePageMargins
  lineHeight: number
  fontSize: number
  sectionGap: number
  headerGap: number
  jobGap: number
  /** Space reserved for fixed footer chrome (modern/designer/executive). */
  footerReserve: number
  footerBottom: number
  /** Modern two-column left rail width (PDF + HTML). */
  leftColumnWidth?: number
  columnGap?: number
}

export const RESUME_SPACING: Record<ResumeLayoutId, ResumeLayoutSpacing> = {
  classic: {
    page: {
      paddingTop: 32,
      paddingBottom: 28,
      paddingLeft: 40,
      paddingRight: 40,
    },
    lineHeight: 1.45,
    fontSize: 10,
    sectionGap: 8,
    headerGap: 12,
    jobGap: 7,
    footerReserve: 0,
    footerBottom: 0,
  },
  modern: {
    page: {
      paddingTop: 28,
      paddingBottom: 40,
      paddingLeft: 36,
      paddingRight: 36,
    },
    lineHeight: 1.45,
    fontSize: 10,
    sectionGap: 10,
    headerGap: 14,
    jobGap: 8,
    footerReserve: 40,
    footerBottom: 18,
    leftColumnWidth: 150,
    columnGap: 18,
  },
  designer: {
    page: {
      paddingTop: 28,
      paddingBottom: 40,
      paddingLeft: 52,
      paddingRight: 36,
    },
    lineHeight: 1.45,
    fontSize: 10,
    sectionGap: 12,
    headerGap: 12,
    jobGap: 10,
    footerReserve: 40,
    footerBottom: 18,
  },
  minimal: {
    page: {
      paddingTop: 32,
      paddingBottom: 28,
      paddingLeft: 44,
      paddingRight: 44,
    },
    lineHeight: 1.4,
    fontSize: 10,
    sectionGap: 8,
    headerGap: 12,
    jobGap: 7,
    footerReserve: 0,
    footerBottom: 0,
  },
  executive: {
    page: {
      paddingTop: 28,
      paddingBottom: 36,
      paddingLeft: 40,
      paddingRight: 40,
    },
    lineHeight: 1.45,
    fontSize: 10,
    sectionGap: 8,
    headerGap: 14,
    jobGap: 7,
    footerReserve: 40,
    footerBottom: 18,
  },
}

/** Tailwind-friendly page padding classes derived from tokens (approx px ≈ pt). */
export function getHtmlPagePaddingClass(layout: ResumeLayoutId): string {
  const { page } = RESUME_SPACING[layout]
  // Map common token sets to Tailwind utilities used in HTML previews
  if (layout === "classic") return "px-11 py-10"
  if (layout === "modern") return "px-10 pt-[34px] pb-14"
  if (layout === "designer") return "pt-[34px] pr-10 pb-14 pl-[52px]"
  if (layout === "minimal") return "px-12 py-9"
  if (layout === "executive") return "px-11 pt-8 pb-14"
  return `px-[${page.paddingLeft}px] pt-[${page.paddingTop}px] pb-[${page.paddingBottom}px]`
}
