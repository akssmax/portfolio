"use client"

import {  useLayoutEffect, useRef, useState } from "react"
import type {ReactNode} from "react";

import { cn } from "@/lib/utils"

/** A4 width at 96 CSS px/in (210 mm). */
export const A4_PREVIEW_WIDTH_PX = 794

/** A4 height at 96 CSS px/in (297 mm). */
export const A4_PREVIEW_HEIGHT_PX = 1123

/** Visual gap between stacked pages in the builder preview. */
const A4_PREVIEW_PAGE_GAP_PX = 24

/** Distance from one page's top edge to the next one's. */
const PAGE_PERIOD_PX = A4_PREVIEW_HEIGHT_PX + A4_PREVIEW_PAGE_GAP_PX

/** Page margin used on pages 2+ when the layout's own top padding can't be read. */
const DEFAULT_PAGE_MARGIN_PX = 48
const MIN_PAGE_MARGIN_PX = 32
const MAX_PAGE_MARGIN_PX = 72

/** A heading this close to a page bottom moves down with the content it introduces. */
const KEEP_WITH_NEXT_PX = 56

/**
 * Every PDF layout is set in Helvetica (see register-resume-fonts.ts), so the
 * preview uses it too: same metrics, same line wraps, same page count.
 */
export const RESUME_PREVIEW_FONT_FAMILY = "Helvetica, Arial, sans-serif"

function getPagedPreviewHeight(pageCount: number): number {
  return pageCount * A4_PREVIEW_HEIGHT_PX + (pageCount - 1) * A4_PREVIEW_PAGE_GAP_PX
}

function getPageMask(): string {
  const band = A4_PREVIEW_HEIGHT_PX
  return `linear-gradient(to bottom, #000 0px, #000 ${band}px, transparent ${band}px, transparent ${PAGE_PERIOD_PX}px)`
}

const BLOCK_DISPLAYS = new Set(["block", "flex", "grid", "list-item", "table", "flow-root"])

function isBlockLevel(element: Element): boolean {
  return BLOCK_DISPLAYS.has(getComputedStyle(element).display)
}

/**
 * The smallest block-level elements that hold text: lines, bullets, headings,
 * tags. These are the units that must never be cut by a page break.
 */
function collectBreakUnits(root: HTMLElement): Array<HTMLElement> {
  const units: Array<HTMLElement> = []

  const visit = (element: HTMLElement) => {
    const blockChildren = Array.from(element.children).filter(
      (child): child is HTMLElement => child instanceof HTMLElement && isBlockLevel(child),
    )
    const hasText = Boolean(element.textContent.trim())

    if (!blockChildren.length) {
      if (hasText && element !== root && isBlockLevel(element)) units.push(element)
      return
    }
    // A flex row of chips or a short stat strip: keep it together as one unit.
    const style = getComputedStyle(element)
    const isRow = style.display.includes("flex") && !style.flexDirection.startsWith("column")
    if (isRow && hasText && element !== root && element.offsetHeight < 140) {
      units.push(element)
      return
    }
    blockChildren.forEach(visit)
  }

  visit(root)
  return units
}

function isHeading(element: HTMLElement): boolean {
  if (/^H[1-6]$/.test(element.tagName)) return true
  const style = getComputedStyle(element)
  // Section labels in these layouts are short, bold, often uppercase lines.
  return (
    element.textContent.trim().length < 40 &&
    (style.textTransform === "uppercase" || Number(style.fontWeight) >= 700) &&
    element.tagName !== "LI"
  )
}

/** Top of `element` relative to `root` (positioned), in unscaled CSS px. */
function offsetWithin(element: HTMLElement, root: HTMLElement): number {
  let top = 0
  let node: HTMLElement | null = element
  while (node && node !== root) {
    top += node.offsetTop
    const parent = node.offsetParent as HTMLElement | null
    if (parent && parent !== root && !root.contains(parent)) break
    node = parent
  }
  return top
}

type Paginated = { pageCount: number }

/**
 * Pushes any unit that would cross a page's bottom margin down to the next
 * page's top margin, the way the PDF renderer flows text. Pushes are applied as
 * an extra inline margin-top, recorded so the next pass can undo them first.
 */
function paginate(root: HTMLElement, pushed: Map<HTMLElement, string>): Paginated {
  for (const [element, original] of pushed) element.style.marginTop = original
  pushed.clear()

  const units = collectBreakUnits(root)
  if (!units.length) return { pageCount: 1 }

  // The layout's own top padding is the margin the PDF repeats on every page.
  const firstTop = offsetWithin(units[0], root)
  const margin = Math.min(
    MAX_PAGE_MARGIN_PX,
    Math.max(MIN_PAGE_MARGIN_PX, Number.isFinite(firstTop) ? firstTop : DEFAULT_PAGE_MARGIN_PX),
  )

  for (const unit of units) {
    const top = offsetWithin(unit, root)
    const height = unit.offsetHeight
    if (height > A4_PREVIEW_HEIGHT_PX - margin * 2) continue

    const page = Math.floor(top / PAGE_PERIOD_PX)
    const contentBottom = page * PAGE_PERIOD_PX + A4_PREVIEW_HEIGHT_PX - margin
    const nextTop = (page + 1) * PAGE_PERIOD_PX + margin

    const crosses = top + height > contentBottom
    const strandedHeading =
      !crosses && isHeading(unit) && top + height > contentBottom - KEEP_WITH_NEXT_PX
    // A unit sitting in the bottom margin or the gap also moves down.
    const inBottomZone = top >= contentBottom && top < nextTop

    if (crosses || strandedHeading || inBottomZone) {
      const shift = nextTop - top
      if (shift <= 0) continue
      pushed.set(unit, unit.style.marginTop)
      const current = parseFloat(getComputedStyle(unit).marginTop) || 0
      unit.style.marginTop = `${current + shift}px`
    }
  }

  const height = root.scrollHeight
  return { pageCount: Math.max(1, Math.ceil((height - margin) / PAGE_PERIOD_PX)) }
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
  const frameRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const pushedRef = useRef(new Map<HTMLElement, string>())
  const [pageCount, setPageCount] = useState(1)
  const [scale, setScale] = useState(1)

  // Always lay the page out at true A4 width (like the PDF), then scale it down
  // to fit a narrow pane, so columns never reflow and break in other places.
  useLayoutEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    const measure = () => {
      const next = Math.min(1, frame.clientWidth / A4_PREVIEW_WIDTH_PX) || 1
      setScale((current) => (Math.abs(current - next) < 0.001 ? current : next))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(frame)
    return () => observer.disconnect()
  }, [])

  useLayoutEffect(() => {
    const element = contentRef.current
    if (!element) return

    let frame = 0
    let applying = false
    const update = () => {
      if (applying) return
      applying = true
      try {
        const next = paginate(element, pushedRef.current).pageCount
        setPageCount((current) => (current === next ? current : next))
      } finally {
        applying = false
      }
    }
    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }

    update()
    // Fonts and logos change heights after first paint.
    void document.fonts.ready.then(schedule)

    const resizeObserver = new ResizeObserver(schedule)
    resizeObserver.observe(element)
    // Typing in an editable field changes text without always resizing the root.
    const mutationObserver = new MutationObserver(schedule)
    mutationObserver.observe(element, { characterData: true, childList: true, subtree: true })

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      mutationObserver.disconnect()
    }
  }, [children])

  const totalHeight = getPagedPreviewHeight(pageCount)
  const pageMask = getPageMask()

  return (
    <div
      ref={frameRef}
      className={cn("mx-auto w-full", className)}
      style={{ maxWidth: A4_PREVIEW_WIDTH_PX, height: totalHeight * scale }}
      aria-label={label}
    >
      <div
        className="relative origin-top-left"
        style={{
          width: A4_PREVIEW_WIDTH_PX,
          height: totalHeight,
          transform: scale < 1 ? `scale(${scale})` : undefined,
        }}
      >
        {Array.from({ length: pageCount }).map((_, pageIndex) => (
          <div
            key={`a4-page-${pageIndex}`}
            aria-hidden
            className="pointer-events-none absolute inset-x-0 rounded-sm border border-border bg-white shadow-sm"
            style={{
              top: pageIndex * PAGE_PERIOD_PX,
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
                  top: (gapIndex + 1) * A4_PREVIEW_HEIGHT_PX + gapIndex * A4_PREVIEW_PAGE_GAP_PX,
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
            // Backgrounds (sidebars, bands) still run through the gaps; text never does.
            WebkitMaskImage: pageMask,
            maskImage: pageMask,
            WebkitMaskSize: `100% ${PAGE_PERIOD_PX}px`,
            maskSize: `100% ${PAGE_PERIOD_PX}px`,
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
