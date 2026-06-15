import { getImageSrcSet, getImageUrl } from "@/lib/sanity/image"
import type { ImageGalleryBlock } from "@/lib/sanity/types"

export function ImageGalleryBlockComponent({
  block,
}: {
  block: ImageGalleryBlock
}) {
  const images = block.images ?? []

  if (!images.length) return null

  return (
    <figure className="space-y-3">
      <div
        className={`grid gap-4 ${
          images.length === 2
            ? "sm:grid-cols-2"
            : images.length === 3
              ? "sm:grid-cols-3"
              : "sm:grid-cols-2 lg:grid-cols-4"
        }`}
      >
        {images.map((image, index) => {
          const src = getImageUrl(image, 800)
          const srcSet = getImageSrcSet(image, [400, 640, 800])
          if (!src) return null

          return (
            <img
              key={image.asset._ref ?? index}
              src={src}
              srcSet={srcSet}
              sizes="(min-width: 1024px) 240px, (min-width: 640px) 45vw, 100vw"
              alt={image.alt ?? `Gallery image ${index + 1}`}
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full rounded-lg border border-border object-cover"
            />
          )
        })}
      </div>
      {block.caption ? (
        <figcaption className="text-sm text-muted-foreground">
          {block.caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
