import type { MilestoneEra } from "@/lib/brand/runner-milestones"

export type EraVisualConfig = {
  era: MilestoneEra
  label: string
  description: string
  className: string
}

/** Grid layout used as the base journey track background. */
export const JOURNEY_GRID_BG_CLASS =
  "bg-muted/20 [background-image:linear-gradient(rgba(128,128,128,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(128,128,128,0.08)_1px,transparent_1px)] [background-size:24px_24px]"

export const ERA_VISUAL_CONFIG: Record<MilestoneEra, EraVisualConfig> = {
  boot: {
    era: "boot",
    label: "College years",
    description: "After Effects, Premiere, Illustrator",
    className: JOURNEY_GRID_BG_CLASS,
  },
  code: {
    era: "code",
    label: "View source",
    description: "HTML, CSS, JavaScript",
    className:
      "bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent [background-image:repeating-linear-gradient(0deg,transparent,transparent_11px,rgba(255,255,255,0.04)_11px,rgba(255,255,255,0.04)_12px)]",
  },
  design: {
    era: "design",
    label: "Design craft",
    description: "Figma, motion, systems",
    className:
      "bg-gradient-to-br from-violet-500/[0.06] via-transparent to-fuchsia-500/[0.06]",
  },
  ship: {
    era: "ship",
    label: "Ship in prod",
    description: "React, Tailwind, Cursor",
    className: "bg-gradient-to-b from-primary/[0.08] via-transparent to-primary/[0.04]",
  },
}

export const ERA_ORDER: readonly MilestoneEra[] = ["boot", "code", "design", "ship"] as const

export function getEraConfig(era: MilestoneEra): EraVisualConfig {
  return ERA_VISUAL_CONFIG[era]
}
