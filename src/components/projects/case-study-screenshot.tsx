"use client"

import * as React from "react"
import { ExternalLink, ZoomIn } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

type CaseStudyScreenshotProps = {
  src: string
  alt: string
  href?: string
  label?: string
  className?: string
}

function StaticScreenshot({
  src,
  alt,
  className,
}: Pick<CaseStudyScreenshotProps, "src" | "alt" | "className">) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border/80 bg-muted/20 shadow-sm",
        className,
      )}
    >
      <img src={src} alt={alt} className="w-full object-cover object-top" loading="lazy" />
    </div>
  )
}

export function CaseStudyScreenshot({
  src,
  alt,
  href,
  label,
  className,
}: CaseStudyScreenshotProps) {
  const [previewOpen, setPreviewOpen] = React.useState(false)

  if (!href) {
    return <StaticScreenshot src={src} alt={alt} className={className} />
  }

  const title = label ?? alt

  return (
    <>
      <div
        className={cn(
          "group/screenshot relative overflow-hidden rounded-xl border border-border/80 bg-muted/20 shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-border hover:shadow-md",
          className,
        )}
      >
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label={`Open ${title} in live app`}
        >
          <img
            src={src}
            alt={alt}
            className="w-full object-cover object-top transition-transform duration-500 ease-out group-hover/screenshot:scale-[1.02]"
            loading="lazy"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/5 opacity-0 transition-opacity duration-300 group-hover/screenshot:opacity-100"
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-3 opacity-0 transition-opacity duration-300 group-hover/screenshot:opacity-100">
            <span className="text-xs font-medium text-white sm:text-sm">Open live page</span>
            <ExternalLink className="size-4 shrink-0 text-white" aria-hidden />
          </div>
        </a>

        <Button
          type="button"
          variant="secondary"
          size="icon-sm"
          className="absolute top-2.5 right-2.5 z-10 opacity-0 shadow-sm transition-opacity duration-300 group-hover/screenshot:opacity-100 group-focus-within/screenshot:opacity-100"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            setPreviewOpen(true)
          }}
          aria-label={`Preview ${title}`}
        >
          <ZoomIn className="size-4" />
        </Button>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-5xl">
          <DialogHeader className="border-b border-border/80 px-5 py-4 text-left">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{alt}</DialogDescription>
          </DialogHeader>
          <div className="max-h-[min(70vh,720px)] overflow-auto bg-muted/20 p-4 sm:p-5">
            <img
              src={src}
              alt={alt}
              className="mx-auto w-full max-w-full rounded-lg border border-border/80 bg-background shadow-sm"
            />
          </div>
          <DialogFooter className="border-t border-border/80 px-5 py-4">
            <Button asChild>
              <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                Open live page
                <ExternalLink className="size-4" />
              </a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
