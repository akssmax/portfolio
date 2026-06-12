import type { StaticImageGalleryBlock } from "@/lib/sanity/types"

export function StaticImageGalleryBlockComponent({
  block,
}: {
  block: StaticImageGalleryBlock
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
        {images.map((image, index) => (
          <img
            key={image._key ?? image.src ?? index}
            src={image.src}
            alt={image.alt}
            className="aspect-[4/3] w-full rounded-lg border border-border object-cover object-top"
          />
        ))}
      </div>
      {block.caption ? (
        <figcaption className="text-sm text-muted-foreground">
          {block.caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
