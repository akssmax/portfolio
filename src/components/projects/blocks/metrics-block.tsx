import type { MetricsBlock } from "@/lib/sanity/types"

export function MetricsBlockComponent({ block }: { block: MetricsBlock }) {
  if (!block.items?.length) return null

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {block.items.map((item) => (
        <div
          key={item._key ?? `${item.value}-${item.label}`}
          className="rounded-xl border border-border bg-muted/30 p-5"
        >
          <p className="text-3xl font-semibold tracking-tight text-foreground">
            {item.value}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
        </div>
      ))}
    </div>
  )
}
