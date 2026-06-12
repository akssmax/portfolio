import type { TechStackBlock } from "@/lib/sanity/types"

import { TechLogo } from "./tech-logo"

export function TechStackBlockComponent({ block }: { block: TechStackBlock }) {
  if (!block.items?.length) return null

  return (
    <div className="flex flex-wrap gap-3">
      {block.items.map((item) => (
        <div
          key={item._key ?? item.name}
          className="group flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 transition-colors hover:bg-muted/50"
        >
          <TechLogo src={item.logoSrc} name={item.name} />
          <span className="text-sm font-medium text-foreground">{item.name}</span>
        </div>
      ))}
    </div>
  )
}
