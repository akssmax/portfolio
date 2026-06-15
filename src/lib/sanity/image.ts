import { createImageUrlBuilder, type ImageUrlBuilder } from "@sanity/image-url"

import { getSanityClient, isSanityConfigured } from "./client"

let cachedBuilder: ImageUrlBuilder | null = null

function getBuilder(): ImageUrlBuilder {
  if (!isSanityConfigured()) {
    throw new Error("Sanity is not configured")
  }
  if (!cachedBuilder) {
    cachedBuilder = createImageUrlBuilder(getSanityClient())
  }
  return cachedBuilder
}

export function urlFor(source: Parameters<ImageUrlBuilder["image"]>[0]) {
  return getBuilder().image(source)
}

export function getImageUrl(
  source: Parameters<ImageUrlBuilder["image"]>[0] | null | undefined,
  width = 1200,
): string | undefined {
  if (!source || !isSanityConfigured()) return undefined

  return urlFor(source).width(width).auto("format").quality(85).url()
}

export function getImageSrcSet(
  source: Parameters<ImageUrlBuilder["image"]>[0] | null | undefined,
  widths: number[] = [640, 960, 1200, 1600],
): string | undefined {
  if (!source || !isSanityConfigured()) return undefined

  return widths
    .map((width) => {
      const url = urlFor(source).width(width).auto("format").quality(85).url()
      return `${url} ${width}w`
    })
    .join(", ")
}
