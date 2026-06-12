import { getImageUrl } from "@/lib/sanity/image"
import type { BeforeAfterBlock } from "@/lib/sanity/types"

export function BeforeAfterBlockComponent({
  block,
}: {
  block: BeforeAfterBlock
}) {
  const beforeSrc = getImageUrl(block.before, 900)
  const afterSrc = getImageUrl(block.after, 900)

  if (!beforeSrc || !afterSrc) return null

  return (
    <figure className="space-y-3">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Before
          </p>
          <img
            src={beforeSrc}
            alt={block.before.alt ?? "Before"}
            className="aspect-[4/3] w-full rounded-lg border border-border object-cover"
          />
        </div>
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            After
          </p>
          <img
            src={afterSrc}
            alt={block.after.alt ?? "After"}
            className="aspect-[4/3] w-full rounded-lg border border-border object-cover"
          />
        </div>
      </div>
      {block.caption ? (
        <figcaption className="text-sm text-muted-foreground">
          {block.caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
