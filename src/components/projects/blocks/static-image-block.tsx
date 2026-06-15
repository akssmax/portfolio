import type { StaticImageBlock } from "@/lib/sanity/types"

export function StaticImageBlockComponent({ block }: { block: StaticImageBlock }) {
  const image = (
    <img
      src={block.src}
      alt={block.alt}
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
