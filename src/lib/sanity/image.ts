import { createImageUrlBuilder } from "@sanity/image-url"

import { sanityClient } from "./client"

const builder = createImageUrlBuilder(sanityClient)

export function urlFor(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source)
}

export function getImageUrl(
  source: Parameters<typeof builder.image>[0] | null | undefined,
  width = 1200,
): string | undefined {
  if (!source) return undefined

  return urlFor(source).width(width).auto("format").quality(85).url()
}
