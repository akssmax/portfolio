import { getImageSrcSet, getImageUrl } from "@/lib/sanity/image"
import type { ImageBlock } from "@/lib/sanity/types"

export function ImageBlockComponent({ block }: { block: ImageBlock }) {
  const width = block.fullBleed ? 1800 : 1200
  const src = getImageUrl(block.image, width)
  const srcSet = getImageSrcSet(block.image, block.fullBleed ? [960, 1400, 1800] : [640, 960, 1200])
  const alt = block.image.alt ?? block.caption ?? "Project image"

  if (!src) return null

  const image = (
    <img
      src={src}
      srcSet={srcSet}
      sizes={block.fullBleed ? "(min-width: 1024px) 90vw, 100vw" : "(min-width: 768px) 720px, 100vw"}
      alt={alt}
      loading="lazy"
      decoding="async"
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
