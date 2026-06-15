const DEFAULT_COLOR_FALLBACK = "#FF354B"
const CANVAS_SENTINEL = "#010101"

function rgbStringToHex(rgb: string, fallback: string): string {
  const rgbaMatch = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (rgbaMatch) {
    return `#${[rgbaMatch[1], rgbaMatch[2], rgbaMatch[3]]
      .map((value) => Number(value).toString(16).padStart(2, "0"))
      .join("")}`
  }

  const srgbMatch = rgb.match(/color\(\s*srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/i)
  if (srgbMatch) {
    return `#${[srgbMatch[1], srgbMatch[2], srgbMatch[3]]
      .map((value) =>
        Math.round(Number(value) * 255)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")}`
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

    context.fillStyle = CANVAS_SENTINEL
    context.fillStyle = color

    const normalized = context.fillStyle
    if (normalized === CANVAS_SENTINEL) return fallback

    if (normalized.startsWith("#")) {
      return normalized.length === 7 ? normalized.toUpperCase() : fallback
    }

    return rgbStringToHex(normalized, fallback)
  } catch {
    return fallback
  }
}

function normalizeComputedColorToHex(color: string, fallback: string): string {
  if (!color.trim()) return fallback

  if (color.startsWith("#")) {
    return color.length === 7 ? color.toUpperCase() : fallback
  }

  const fromRgb = rgbStringToHex(color, "")
  if (fromRgb) return fromRgb

  return canvasColorToHex(color, fallback)
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
  if (typeof document === "undefined") return fallback

  const fromRaw = canvasColorToHex(color, "")
  if (fromRaw) return fromRaw

  const resolved = withColorProbe(color, (computed) =>
    normalizeComputedColorToHex(computed, ""),
  )
  if (resolved) return resolved

  return canvasColorToHex(color, fallback)
}

export function resolveCssVariableToHex(
  variable: string,
  fallback = DEFAULT_COLOR_FALLBACK,
): string {
  if (typeof document === "undefined") return fallback

  const normalizedVariable = variable.startsWith("--") ? variable : `--${variable}`

  const rawValue = readRootCssVariable(normalizedVariable)
  if (rawValue) {
    const fromRaw = canvasColorToHex(rawValue, "")
    if (fromRaw) return fromRaw
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
