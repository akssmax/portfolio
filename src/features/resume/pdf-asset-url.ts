export function resolvePdfAssetUrl(src: string): string {
  if (/^https?:\/\//.test(src)) return src

  const normalized = src.startsWith("/") ? src : `/${src}`

  if (typeof window !== "undefined") {
    return `${window.location.origin}${normalized}`
  }

  return normalized
}
