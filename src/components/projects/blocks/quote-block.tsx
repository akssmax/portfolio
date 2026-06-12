import type { QuoteBlock } from "@/lib/sanity/types"

export function QuoteBlockComponent({ block }: { block: QuoteBlock }) {
  return (
    <blockquote className="rounded-xl border border-border bg-muted/30 px-6 py-5">
      <p className="text-lg leading-relaxed text-foreground">&ldquo;{block.text}&rdquo;</p>
      {block.attribution ? (
        <footer className="mt-3 text-sm text-muted-foreground">
          — {block.attribution}
        </footer>
      ) : null}
    </blockquote>
  )
}
