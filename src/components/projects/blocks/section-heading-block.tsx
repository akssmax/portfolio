import type { SectionHeadingBlock } from "@/lib/sanity/types"
import { slugifyHeading } from "@/lib/sanity/slugify-heading"

export function SectionHeadingBlockComponent({
  block,
}: {
  block: SectionHeadingBlock
}) {
  const id = slugifyHeading(block.title)

  return (
    <div id={id} className="scroll-mt-24 space-y-2 border-b border-border pb-4">
      <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {block.title}
      </h2>
      {block.subtitle ? (
        <p className="max-w-prose text-base text-muted-foreground">{block.subtitle}</p>
      ) : null}
    </div>
  )
}
