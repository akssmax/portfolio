"use client"

import * as React from "react"
import { Link } from "@tanstack/react-router"
import { AnimatePresence } from "motion/react"
import { Expand, Minimize2, Printer, X } from "lucide-react"

import { DeckNavHint } from "@/components/intro/deck-nav-hint"
import { DeckPrintDocument } from "@/components/intro/deck-print-document"
import { DeckProgress } from "@/components/intro/deck-progress"
import { DeckSlide } from "@/components/intro/deck-slide"
import { renderDeckSlide } from "@/components/intro/render-deck-slide"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ThemeCustomizer } from "@/components/theme-customizer"
import { useDeckNavigation } from "@/hooks/use-deck-navigation"
import { DECK_SLIDE_IDS } from "@/lib/intro/types"
import type { DeckData } from "@/lib/intro/types"

type DeckShellProps = {
  deck: DeckData
  initialIndex?: number
  onSlideChange?: (index: number) => void
}

export function DeckShell({ deck, initialIndex = 0, onSlideChange }: DeckShellProps) {
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const totalSlides = DECK_SLIDE_IDS.length

  const navigation = useDeckNavigation({
    totalSlides,
    initialIndex,
    onIndexChange: onSlideChange,
  })

  const { index, goTo, handlePointerDown, handlePointerUp } = navigation
  const activeSlideId = DECK_SLIDE_IDS[index]

  React.useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
        return
      }

      await document.documentElement.requestFullscreen()
    } catch {
      // Fullscreen may be blocked by browser policy.
    }
  }

  function handlePrint() {
    window.print()
  }

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== "f") return
      if (event.metaKey || event.ctrlKey || event.altKey) return

      const target = event.target
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA")
      ) {
        return
      }

      event.preventDefault()
      void toggleFullscreen()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <>
      <div
        className="fixed inset-0 z-50 overflow-hidden bg-background text-foreground print:hidden"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <DeckProgress index={index} total={totalSlides} onSelect={goTo} />

        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          <span className="rounded-full border border-border/60 bg-background/80 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-sm">
            {index + 1} / {totalSlides}
          </span>

          <ThemeCustomizer triggerSize="icon-sm" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label="Print deck as PDF"
                onClick={handlePrint}
              >
                <Printer className="size-4" aria-hidden />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={6}>
              Print as PDF
            </TooltipContent>
          </Tooltip>

          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            onClick={() => void toggleFullscreen()}
          >
            {isFullscreen ? (
              <Minimize2 className="size-4" aria-hidden />
            ) : (
              <Expand className="size-4" aria-hidden />
            )}
          </Button>

          <Button asChild variant="outline" size="icon-sm" aria-label="Exit presentation">
            <Link to="/">
              <X className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>

        <div className="h-dvh overflow-hidden">
          <AnimatePresence mode="wait">
            <DeckSlide key={activeSlideId} slideKey={activeSlideId}>
              {renderDeckSlide(activeSlideId, deck, {
                onEndPresentation: () => goTo(DECK_SLIDE_IDS.indexOf("thank-you")),
              })}
            </DeckSlide>
          </AnimatePresence>
        </div>

        <DeckNavHint visible={index === 0} />
      </div>

      <DeckPrintDocument deck={deck} />
    </>
  )
}
