"use client"

import type * as React from "react"

import { getEraConfig } from "@/lib/journey/era-config"
import type { MilestoneEra } from "@/lib/brand/runner-milestones"
import { cn } from "@/lib/utils"

type JourneyEraZoneProps = {
  era: MilestoneEra
  className?: string
  style?: React.CSSProperties
}

export function JourneyEraZone({ era, className, style }: JourneyEraZoneProps) {
  const config = getEraConfig(era)

  return (
    <div
      className={cn("pointer-events-none absolute inset-y-8", config.className, className)}
      style={style}
      aria-hidden
    />
  )
}
