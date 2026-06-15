const ALLOWED_EMBED_HOSTS = new Set([
  "figma.com",
  "www.figma.com",
  "youtube.com",
  "www.youtube.com",
  "youtu.be",
  "vimeo.com",
  "player.vimeo.com",
  "loom.com",
  "www.loom.com",
])

function parseUrl(value: string): URL | null {
  try {
    return new URL(value)
  } catch {
    return null
  }
}

export function isSafeHttpUrl(value: string | null | undefined): boolean {
  if (!value?.trim()) return false

  const parsed = parseUrl(value)
  if (!parsed) return false

  const isDev = typeof import.meta !== "undefined" && import.meta.env?.DEV

  if (isDev) {
    return parsed.protocol === "https:" || parsed.protocol === "http:"
  }

  return parsed.protocol === "https:"
}

export function isSafeRelativePath(value: string | null | undefined): boolean {
  if (!value?.trim()) return false
  return value.startsWith("/") && !value.startsWith("//")
}

export function isAllowedEmbedUrl(value: string | null | undefined): boolean {
  if (!isSafeHttpUrl(value)) return false
  const parsed = parseUrl(value!)
  if (!parsed) return false
  return ALLOWED_EMBED_HOSTS.has(parsed.hostname)
}

export function sanitizeExternalHref(value: string | null | undefined): string | undefined {
  if (!value?.trim()) return undefined
  if (isSafeRelativePath(value)) return value
  if (isSafeHttpUrl(value)) return value
  return undefined
}
