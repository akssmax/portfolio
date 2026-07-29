"use client"

import { useEffect, useRef, useState } from "react"

/** A4 width at 96 CSS px/in — matches HTML preview column. */
const A4_PREVIEW_MAX_WIDTH_PX = 794

type ResumePdfCanvasPreviewProps = {
  pdfUrl: string
  showPageBreaks?: boolean
}

let workerConfigured = false

async function configurePdfWorker() {
  if (workerConfigured) return
  const pdfjs = await import("pdfjs-dist")
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString()
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

export function ResumePdfCanvasPreview({
  pdfUrl,
  showPageBreaks = false,
}: ResumePdfCanvasPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const host = containerRef.current
    if (!host) return
    const containerEl = host

    containerEl.replaceChildren()
    setError(null)

    async function renderPdf() {
      try {
        await configurePdfWorker()
        const pdfjs = await import("pdfjs-dist")
        const loadingTask = pdfjs.getDocument(pdfUrl)
        const pdf = await loadingTask.promise

        if (cancelled) return

        const pixelRatio = window.devicePixelRatio || 1
        const containerWidth = containerEl.clientWidth || A4_PREVIEW_MAX_WIDTH_PX

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

          const context = canvas.getContext("2d")
          if (!context) {
            throw new Error("Unable to initialize PDF canvas.")
          }

          await page.render({ canvasContext: context, viewport }).promise
        }
      } catch (cause) {
        if (!cancelled) {
          setError(
            cause instanceof Error ? cause.message : "Unable to render A4 preview.",
          )
        }
      }
    }

    void renderPdf()

    let resizeTimer: number | undefined
    const observer = new ResizeObserver(() => {
      if (cancelled) return
      if (resizeTimer !== undefined) window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        containerEl.replaceChildren()
        void renderPdf()
      }, 150)
    })
    observer.observe(containerEl)

    return () => {
      cancelled = true
      if (resizeTimer !== undefined) window.clearTimeout(resizeTimer)
      observer.disconnect()
    }
  }, [pdfUrl, showPageBreaks])

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="mx-auto w-full max-w-[794px] overflow-y-auto py-4"
      aria-label="A4 PDF preview"
    />
  )
}
