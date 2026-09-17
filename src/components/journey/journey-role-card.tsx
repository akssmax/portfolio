"use client"

import type * as React from "react"

import { CompanyLogo } from "@/components/shared/company-logo"
import type { JourneyRoleStop } from "@/lib/journey/types"
import { cn } from "@/lib/utils"

type JourneyRoleCardProps = {
  stop: JourneyRoleStop
  active: boolean
  onSelect: () => void
}

export function JourneyRoleCard({ stop, active, onSelect }: JourneyRoleCardProps) {
  const { item } = stop

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      onSelect()
    }
  }

  return (
    <article className="w-[min(85vw,360px)] shrink-0 snap-center sm:w-[380px]">
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={onSelect}
        onKeyDown={handleKeyDown}
        className={cn(
          "flex w-full gap-4 rounded-2xl border p-4 text-left transition-all duration-300 motion-reduce:transition-none sm:p-5",
          active
            ? "border-primary/50 bg-primary/5 shadow-lg shadow-primary/10"
            : "border-border/70 bg-background/80 hover:border-primary/30 hover:bg-muted/20",
        )}
      >
        <CompanyLogo src={item.logoSrc} name={item.company} className="size-12 p-2" />

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
            {stop.eyebrow ?? "Role milestone"}
          </p>
          <h3 className="mt-1 text-lg font-semibold">{item.company}</h3>
          <p className="text-sm font-medium text-muted-foreground">{item.role}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            {item.period}
            {item.duration ? ` · ${item.duration}` : ""}
          </p>
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-foreground/85">
            {item.description}
          </p>
          {item.highlights.length > 0 ? (
            <p className="mt-2 text-[11px] text-muted-foreground">
              {item.highlights.length} highlights · click to expand
            </p>
          ) : null}
        </div>
      </button>
    </article>
  )
}
