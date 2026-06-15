export const MONOGRAM_MAIN =
  "M34.9006 153H-64L38.4806 0L64.9829 39.5669L15.5068 113.433H61.4801L34.9006 153Z"

export const MONOGRAM_ACCENT =
  "M79.9728 153L106.462 113.433H61.4805L87.9441 73.8148L141 153H79.9728Z"

export const MONOGRAM_VIEWBOX = "-64 0 205 153"

/** Square crop for favicons and app icons — centers the mark with even padding. */
export const MONOGRAM_SQUARE_VIEWBOX = "-64 -26 205 205"

export const MONOGRAM_BRAND_NAVY = "#0F1923"
export const MONOGRAM_LIGHT_MARK = "#FAFAFA"

export const FAVICON_PATHS = {
  light: "/favicon-light.svg",
  dark: "/favicon-dark.svg",
} as const

type FaviconVariant = keyof typeof FAVICON_PATHS

export function buildFaviconSvg(variant: FaviconVariant): string {
  const isDark = variant === "dark"

  return `<svg viewBox="${MONOGRAM_SQUARE_VIEWBOX}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Akshay Saini monogram">
  <rect x="-64" y="-26" width="205" height="205" fill="${isDark ? MONOGRAM_BRAND_NAVY : "#FFFFFF"}"/>
  <path d="${MONOGRAM_MAIN}" fill="${isDark ? MONOGRAM_LIGHT_MARK : MONOGRAM_BRAND_NAVY}"/>
  <path d="${MONOGRAM_ACCENT}" fill="${isDark ? MONOGRAM_LIGHT_MARK : MONOGRAM_BRAND_NAVY}"/>
</svg>`
}

export function getFaviconHref(isDark: boolean): string {
  return isDark ? FAVICON_PATHS.dark : FAVICON_PATHS.light
}

export function syncFavicon(isDark: boolean) {
  if (typeof document === "undefined") return

  const href = getFaviconHref(isDark)
  let link = document.querySelector<HTMLLinkElement>('link[data-favicon="dynamic"]')

  if (!link) {
    link = document.createElement("link")
    link.rel = "icon"
    link.type = "image/svg+xml"
    link.setAttribute("data-favicon", "dynamic")
    document.head.appendChild(link)
  }

  if (link.getAttribute("href") !== href) {
    link.setAttribute("href", href)
  }
}

export function buildFaviconInitScriptFragment(): string {
  return `var fav=root.classList.contains("dark")?"${FAVICON_PATHS.dark}":"${FAVICON_PATHS.light}";var fl=document.querySelector('link[data-favicon="dynamic"]');if(!fl){fl=document.createElement("link");fl.rel="icon";fl.type="image/svg+xml";fl.setAttribute("data-favicon","dynamic");document.head.appendChild(fl);}fl.setAttribute("href",fav);`
}
