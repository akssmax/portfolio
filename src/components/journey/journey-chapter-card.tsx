"use client"

import type { JourneyChapterStop } from "@/lib/journey/types"
import { cn } from "@/lib/utils"

type JourneyChapterCardProps = {
  stop: JourneyChapterStop
  active: boolean
}

export function JourneyChapterCard({ stop, active }: JourneyChapterCardProps) {
  return (
    <article
      className={cn(
        "w-[min(85vw,340px)] shrink-0 snap-center sm:w-[360px]",
        active && "z-10",
      )}
    >
      <div
        className={cn(
          "rounded-2xl border p-5 transition-all duration-300 motion-reduce:transition-none sm:p-6",
          active
            ? "border-primary/50 bg-primary/5 shadow-lg shadow-primary/10"
            : "border-border/70 bg-background/80",
        )}
      >
        <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
          {stop.eyebrow}
        </p>
        <p className="mt-2 font-mono text-2xl font-semibold tabular-nums">{stop.year}</p>
        <h3 className="mt-3 text-lg font-semibold leading-snug">{stop.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{stop.description}</p>
      </div>
    </article>
  )
}
