"use client"

import * as React from "react"

import { DeckSlideBackground } from "@/components/intro/deck-slide-background"
import { renderDeckSlide } from "@/components/intro/render-deck-slide"
import { DECK_SLIDE_IDS } from "@/lib/intro/types"
import type { DeckData } from "@/lib/intro/types"

type DeckPrintDocumentProps = {
  deck: DeckData
}

export function DeckPrintDocument({ deck }: DeckPrintDocumentProps) {
  React.useEffect(() => {
    const style = document.createElement("style")
    style.setAttribute("data-deck-print", "")
    style.textContent = "@media print { @page { size: landscape; margin: 0; } }"
    document.head.appendChild(style)

    return () => {
      style.remove()
    }
  }, [])

  return (
    <div className="deck-print-document hidden print:block" aria-hidden>
      {DECK_SLIDE_IDS.map((slideId, index) => (
        <section key={slideId} className="deck-print-page">
          <DeckSlideBackground className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" />
          <div className="deck-print-page-inner">
            {renderDeckSlide(slideId, deck)}
          </div>
          <span className="deck-print-page-index">
            {index + 1} / {DECK_SLIDE_IDS.length}
          </span>
        </section>
      ))}
    </div>
  )
}
