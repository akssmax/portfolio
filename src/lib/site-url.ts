export const SITE_URL = "https://www.akshaysaini.xyz"

export function siteUrl(path = "/"): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${SITE_URL}${normalizedPath}`
}
