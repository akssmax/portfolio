const DEFAULT_COLOR_FALLBACK = "#FF354B"

function rgbStringToHex(rgb: string, fallback: string): string {
  const rgbaMatch = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (rgbaMatch) {
    return `#${[rgbaMatch[1], rgbaMatch[2], rgbaMatch[3]]
      .map((value) => Number(value).toString(16).padStart(2, "0"))
      .join("")}`.toUpperCase()
  }

  const srgbMatch = rgb.match(/color\(\s*srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/i)
  if (srgbMatch) {
    return `#${[srgbMatch[1], srgbMatch[2], srgbMatch[3]]
      .map((value) =>
        Math.round(Number(value) * 255)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")}`.toUpperCase()
  }

  return fallback
}

function canvasColorToHex(color: string, fallback: string): string {
  if (typeof document === "undefined" || !color.trim()) return fallback

  try {
    const canvas = document.createElement("canvas")
    canvas.width = 1
    canvas.height = 1
    const context = canvas.getContext("2d")
    if (!context) return fallback

    // Set first sentinel
    context.fillStyle = "rgb(1, 2, 3)"
    context.fillStyle = color
    // If the color was invalid, fillStyle is ignored and remains rgb(1, 2, 3)
    if (context.fillStyle === "rgb(1, 2, 3)" || context.fillStyle === "#010203") {
      // Try second sentinel to be sure color wasn't actually rgb(1, 2, 3)
      context.fillStyle = "rgb(4, 5, 6)"
      context.fillStyle = color
      if (context.fillStyle === "rgb(4, 5, 6)" || context.fillStyle === "#040506") {
        return fallback
      }
    }

    context.fillRect(0, 0, 1, 1)
    const [r, g, b] = context.getImageData(0, 0, 1, 1).data
    return `#${[r, g, b]
      .map((value) => value.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()}`
  } catch {
    return fallback
  }
}

function normalizeComputedColorToHex(color: string, fallback: string): string {
  const trimmed = color.trim()
  if (!trimmed) return fallback

  if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(trimmed)) {
    if (trimmed.length === 4) {
      const [, r, g, b] = trimmed
      return `#${r}${r}${g}${g}${b}${b}`.toUpperCase()
    }
    return trimmed.toUpperCase()
  }

  const fromRgb = rgbStringToHex(trimmed, "")
  if (fromRgb) return fromRgb

  return canvasColorToHex(trimmed, fallback)
}

function readRootCssVariable(variable: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim()
}

function withColorProbe(
  styleColor: string,
  callback: (computedColor: string) => string,
  property: "color" | "backgroundColor" = "color",
): string {
  const probe = document.createElement("span")
  probe.style[property] = styleColor
  probe.style.position = "absolute"
  probe.style.visibility = "hidden"
  probe.style.pointerEvents = "none"
  document.documentElement.appendChild(probe)

  const computed = getComputedStyle(probe)[property]
  document.documentElement.removeChild(probe)

  return callback(computed)
}

export function resolveCssColorToHex(
  color: string,
  fallback = DEFAULT_COLOR_FALLBACK,
): string {
  const trimmed = color.trim()
  if (!trimmed) return fallback

  // Fast path for Hex
  if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(trimmed)) {
    if (trimmed.length === 4) {
      const [, r, g, b] = trimmed
      return `#${r}${r}${g}${g}${b}${b}`.toUpperCase()
    }
    return trimmed.toUpperCase()
  }

  // Fast path for RGB/RGBA
  const fromRgb = rgbStringToHex(trimmed, "")
  if (fromRgb) return fromRgb

  if (typeof document === "undefined") return fallback

  const fromRaw = canvasColorToHex(trimmed, "")
  if (fromRaw) return fromRaw

  const resolved = withColorProbe(trimmed, (computed) =>
    normalizeComputedColorToHex(computed, ""),
  )
  if (resolved) return resolved

  return canvasColorToHex(trimmed, fallback)
}

export function resolveCssVariableToHex(
  variable: string,
  fallback = DEFAULT_COLOR_FALLBACK,
): string {
  if (typeof document === "undefined") return fallback

  const normalizedVariable = variable.startsWith("--") ? variable : `--${variable}`

  const rawValue = readRootCssVariable(normalizedVariable)
  if (rawValue) {
    const trimmedRaw = rawValue.trim()
    if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(trimmedRaw)) {
      if (trimmedRaw.length === 4) {
        const [, r, g, b] = trimmedRaw
        return `#${r}${r}${g}${g}${b}${b}`.toUpperCase()
      }
      return trimmedRaw.toUpperCase()
    }
    const fromRawRgb = rgbStringToHex(trimmedRaw, "")
    if (fromRawRgb) return fromRawRgb

    const fromRawCanvas = canvasColorToHex(trimmedRaw, "")
    if (fromRawCanvas) return fromRawCanvas
  }

  const fromComputed = withColorProbe(`var(${normalizedVariable})`, (computed) =>
    normalizeComputedColorToHex(computed, ""),
  )
  if (fromComputed) return fromComputed

  const fromBackground = withColorProbe(
    `var(${normalizedVariable})`,
    (computed) => normalizeComputedColorToHex(computed, ""),
    "backgroundColor",
  )
  if (fromBackground) return fromBackground

  return resolveCssColorToHex(`var(${normalizedVariable})`, fallback)
}
