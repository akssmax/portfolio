"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url"

import { cn } from "@/lib/utils"

/** A4 width at 96 CSS px/in — matches HTML preview column. */
const A4_PREVIEW_MAX_WIDTH_PX = 794

type ResumePdfCanvasPreviewProps = {
  pdfData: ArrayBuffer
  showPageBreaks?: boolean
  className?: string
}

let workerConfigured = false

async function configurePdfWorker() {
  if (workerConfigured) return
  const pdfjs = await import("pdfjs-dist")
  pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker
  workerConfigured = true
}

function getPageDisplaySize(
  containerWidth: number,
  pageWidth: number,
  pageHeight: number,
  pixelRatio: number,
) {
  const displayWidth = Math.min(Math.max(containerWidth, 1), A4_PREVIEW_MAX_WIDTH_PX)
  const layoutScale = displayWidth / pageWidth
  const renderScale = layoutScale * pixelRatio
  const displayHeight = displayWidth * (pageHeight / pageWidth)

  return { displayWidth, displayHeight, renderScale }
}

function waitForLayout(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve())
    })
  })
}

function measureContainerWidth(element: HTMLElement): number {
  const measuredWidth = element.clientWidth
  if (measuredWidth > 0) {
    return Math.min(measuredWidth, A4_PREVIEW_MAX_WIDTH_PX)
  }

  const parentWidth = element.parentElement?.clientWidth ?? A4_PREVIEW_MAX_WIDTH_PX
  return Math.min(parentWidth, A4_PREVIEW_MAX_WIDTH_PX)
}

export function ResumePdfCanvasPreview({
  pdfData,
  showPageBreaks = false,
  className,
}: ResumePdfCanvasPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isRendering, setIsRendering] = useState(true)

  useEffect(() => {
    let cancelled = false
    const containerEl = containerRef.current
    if (!containerEl) return

    containerEl.replaceChildren()
    setError(null)
    setIsRendering(true)

    async function renderPdf() {
      try {
        await waitForLayout()
        if (cancelled) return

        await configurePdfWorker()
        const pdfjs = await import("pdfjs-dist")
        const loadingTask = pdfjs.getDocument({
          data: new Uint8Array(pdfData),
          useWorkerFetch: false,
          isEvalSupported: false,
        })
        const pdf = await loadingTask.promise

        if (cancelled) return

        const pixelRatio = window.devicePixelRatio || 1
        const containerWidth = measureContainerWidth(containerEl)

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          if (cancelled) return

          const page = await pdf.getPage(pageNumber)
          const baseViewport = page.getViewport({ scale: 1 })
          const { displayWidth, displayHeight, renderScale } = getPageDisplaySize(
            containerWidth,
            baseViewport.width,
            baseViewport.height,
            pixelRatio,
          )
          const viewport = page.getViewport({ scale: renderScale })

          const canvas = document.createElement("canvas")
          canvas.width = viewport.width
          canvas.height = viewport.height
          canvas.style.width = `${displayWidth}px`
          canvas.style.height = `${displayHeight}px`
          canvas.className = "block bg-white shadow-sm"

          const pageShell = document.createElement("div")
          pageShell.className = "mx-auto"
          pageShell.style.width = `${displayWidth}px`
          pageShell.appendChild(canvas)

          const context = canvas.getContext("2d")
          if (!context) {
            throw new Error("Unable to initialize PDF canvas.")
          }

          await page.render({ canvasContext: context, viewport }).promise
          if (cancelled) return

          if (showPageBreaks && pageNumber < pdf.numPages) {
            const breakShell = document.createElement("div")
            breakShell.className =
              "mx-auto mb-6 mt-6 flex items-center justify-center bg-muted/50 py-1.5"
            breakShell.style.width = `${displayWidth}px`
            breakShell.setAttribute("aria-hidden", "true")
            const breakLabel = document.createElement("span")
            breakLabel.className =
              "rounded-full bg-background/90 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground shadow-sm"
            breakLabel.textContent = "Page break"
            breakShell.appendChild(breakLabel)
            containerEl.appendChild(pageShell)
            containerEl.appendChild(breakShell)
          } else {
            if (pageNumber < pdf.numPages) {
              pageShell.style.marginBottom = "24px"
            }
            containerEl.appendChild(pageShell)
          }
        }

        if (!cancelled) {
          setIsRendering(false)
        }
      } catch (cause) {
        if (!cancelled) {
          setIsRendering(false)
          setError(
            cause instanceof Error ? cause.message : "Unable to render A4 preview.",
          )
        }
      }
    }

    void renderPdf()

    return () => {
      cancelled = true
    }
  }, [pdfData, showPageBreaks])

  return (
    <div className={cn("relative h-full w-full", className)}>
      {isRendering && !error ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-neutral-200/80 text-muted-foreground dark:bg-neutral-900/80">
          <Loader2 aria-hidden className="size-8 animate-spin" />
          <p className="text-sm">Rendering pages…</p>
        </div>
      ) : null}

      {error ? (
        <div className="flex h-full items-center justify-center p-6">
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="mx-auto h-full w-full max-w-[794px] overflow-y-auto px-4 py-4 sm:px-6"
          aria-label="A4 PDF preview"
        />
      )}
    </div>
  )
}
