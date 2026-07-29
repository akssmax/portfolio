"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

import { cn } from "@/lib/utils"

/** A4 width at 96 CSS px/in (210 mm). */
export const A4_PREVIEW_WIDTH_PX = 794

/** A4 height at 96 CSS px/in (297 mm). */
export const A4_PREVIEW_HEIGHT_PX = 1123

/** Visual gap between stacked pages in the builder preview. */
const A4_PREVIEW_PAGE_GAP_PX = 24

function getPagedPreviewHeight(pageCount: number): number {
  return pageCount * A4_PREVIEW_HEIGHT_PX + (pageCount - 1) * A4_PREVIEW_PAGE_GAP_PX
}

function getPageMask(): string {
  const band = A4_PREVIEW_HEIGHT_PX
  const period = band + A4_PREVIEW_PAGE_GAP_PX
  return `linear-gradient(to bottom, #000 0px, #000 ${band}px, transparent ${band}px, transparent ${period}px)`
}

type ResumeA4PagedHtmlPreviewProps = {
  children: ReactNode
  className?: string
  label?: string
}

export function ResumeA4PagedHtmlPreview({
  children,
  className,
  label = "Resume preview",
}: ResumeA4PagedHtmlPreviewProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [pageCount, setPageCount] = useState(1)

  useEffect(() => {
    const element = contentRef.current
    if (!element) return

    const updatePageCount = () => {
      const nextCount = Math.max(1, Math.ceil(element.scrollHeight / A4_PREVIEW_HEIGHT_PX))
      setPageCount((current) => (current === nextCount ? current : nextCount))
    }

    updatePageCount()

    const observer = new ResizeObserver(updatePageCount)
    observer.observe(element)
    return () => observer.disconnect()
  }, [children])

  const totalHeight = getPagedPreviewHeight(pageCount)
  const pageMask = getPageMask()

  return (
    <div
      className={cn("mx-auto w-full", className)}
      style={{ maxWidth: A4_PREVIEW_WIDTH_PX }}
      aria-label={label}
    >
      <div className="relative" style={{ height: totalHeight }}>
        {Array.from({ length: pageCount }).map((_, pageIndex) => (
          <div
            key={`a4-page-${pageIndex}`}
            aria-hidden
            className="pointer-events-none absolute inset-x-0 rounded-sm border border-border bg-white shadow-sm"
            style={{
              top: pageIndex * (A4_PREVIEW_HEIGHT_PX + A4_PREVIEW_PAGE_GAP_PX),
              height: A4_PREVIEW_HEIGHT_PX,
            }}
          />
        ))}

        {pageCount > 1
          ? Array.from({ length: pageCount - 1 }).map((_, gapIndex) => (
              <div
                key={`a4-gap-${gapIndex}`}
                aria-hidden
                className="pointer-events-none absolute inset-x-0 flex items-center justify-center bg-muted/50"
                style={{
                  top:
                    (gapIndex + 1) * A4_PREVIEW_HEIGHT_PX +
                    gapIndex * A4_PREVIEW_PAGE_GAP_PX,
                  height: A4_PREVIEW_PAGE_GAP_PX,
                }}
              >
                <span className="rounded-full bg-background/90 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground shadow-sm">
                  Page break
                </span>
              </div>
            ))
          : null}

        <div
          ref={contentRef}
          className="relative z-10 w-full"
          style={{
            WebkitMaskImage: pageMask,
            maskImage: pageMask,
            WebkitMaskSize: `100% ${A4_PREVIEW_HEIGHT_PX + A4_PREVIEW_PAGE_GAP_PX}px`,
            maskSize: `100% ${A4_PREVIEW_HEIGHT_PX + A4_PREVIEW_PAGE_GAP_PX}px`,
            WebkitMaskRepeat: "repeat-y",
            maskRepeat: "repeat-y",
            minHeight: A4_PREVIEW_HEIGHT_PX,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
