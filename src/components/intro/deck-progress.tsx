"use client"

import { cn } from "@/lib/utils"

type DeckProgressProps = {
  index: number
  total: number
  onSelect: (index: number) => void
}

export function DeckProgress({ index, total, onSelect }: DeckProgressProps) {
  const progress = total > 0 ? ((index + 1) / total) * 100 : 0

  return (
    <>
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 bg-border/40"
        aria-hidden
      >
        <div
          className="h-full bg-primary transition-[width] duration-300 ease-out motion-reduce:transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>

      <nav
        className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
        aria-label="Slide navigation"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-2 shadow-sm backdrop-blur-sm">
          {Array.from({ length: total }, (_, slideIndex) => (
            <button
              key={slideIndex}
              type="button"
              aria-label={`Go to slide ${slideIndex + 1}`}
              aria-current={slideIndex === index ? "step" : undefined}
              onClick={() => onSelect(slideIndex)}
              className={cn(
                "size-2 rounded-full transition-all duration-200 motion-reduce:transition-none",
                slideIndex === index
                  ? "scale-125 bg-primary"
                  : "bg-muted-foreground/35 hover:bg-muted-foreground/60",
              )}
            />
          ))}
        </div>
      </nav>
    </>
  )
}
