import { getImageUrl } from "@/lib/sanity/image"
import type { ImageBlock } from "@/lib/sanity/types"

export function ImageBlockComponent({ block }: { block: ImageBlock }) {
  const src = getImageUrl(block.image, block.fullBleed ? 1800 : 1200)
  const alt = block.image.alt ?? block.caption ?? "Project image"

  if (!src) return null

  const image = (
    <img
      src={src}
      alt={alt}
      className={`w-full rounded-xl border border-border object-cover ${
        block.fullBleed ? "aspect-[21/9]" : "aspect-[16/10]"
      }`}
    />
  )

  return (
    <figure className={block.fullBleed ? "-mx-4 sm:-mx-8" : undefined}>
      {image}
      {block.caption ? (
        <figcaption className="mt-3 text-sm text-muted-foreground">
          {block.caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
