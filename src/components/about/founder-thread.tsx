import { Waypoints } from "lucide-react"

import type { FounderThreadStep } from "@/lib/profile"
import { getFounderBadgeLabel } from "@/lib/profile"

/** Stable anchor for an experience entry, e.g. "exp-100x-bot". */
export function experienceAnchor(company: string): string {
  return `exp-${company.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`
}

/**
 * Chip on Tulr, Unlogged and 100x.bot: "Product 2 of 3 with founder Shardul Lavekar".
 * Shows the three moves were one founder's products, not job-hopping.
 */
export function FounderThreadBadge({ thread }: { thread: FounderThreadStep }) {
  return (
    <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/5 px-2.5 py-0.5 text-xs font-medium text-primary">
      <Waypoints className="size-3" aria-hidden />
      {getFounderBadgeLabel(thread)}
    </span>
  )
}
