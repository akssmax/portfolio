const DEFAULT_COLOR_FALLBACK = "#FF354B"

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
  if (typeof document === "undefined") return fallback

  try {
    const canvas = document.createElement("canvas")
    canvas.width = 1
    canvas.height = 1
    const context = canvas.getContext("2d")
    if (!context) return fallback

    context.fillStyle = "#010101"
    context.fillStyle = color

    const normalized = context.fillStyle
    if (normalized.startsWith("#")) {
      return normalized.length === 7 ? normalized.toUpperCase() : fallback
    }

    return rgbStringToHex(normalized, fallback)
  } catch {
    return fallback
  }
}

function normalizeComputedColorToHex(color: string, fallback: string): string {
  if (color.startsWith("#")) {
    return color.length === 7 ? color.toUpperCase() : fallback
  }

  const fromRgb = rgbStringToHex(color, "")
  if (fromRgb) return fromRgb

  return canvasColorToHex(color, fallback)
}

export function resolveCssColorToHex(
  color: string,
  fallback = DEFAULT_COLOR_FALLBACK,
): string {
  if (typeof document === "undefined") return fallback

  const probe = document.createElement("span")
  probe.style.color = color
  probe.style.position = "absolute"
  probe.style.visibility = "hidden"
  probe.style.pointerEvents = "none"
  document.body.appendChild(probe)

  const computed = getComputedStyle(probe).color
  document.body.removeChild(probe)

  const resolved = normalizeComputedColorToHex(computed, "")
  if (resolved) return resolved

  return canvasColorToHex(color, fallback)
}

export function resolveCssVariableToHex(
  variable: string,
  fallback = DEFAULT_COLOR_FALLBACK,
): string {
  if (typeof document === "undefined") return fallback

  const probe = document.createElement("span")
  probe.style.color = `var(${variable})`
  probe.style.position = "absolute"
  probe.style.visibility = "hidden"
  probe.style.pointerEvents = "none"
  document.body.appendChild(probe)

  const computed = getComputedStyle(probe).color
  document.body.removeChild(probe)

  const resolved = normalizeComputedColorToHex(computed, "")
  if (resolved) return resolved

  return fallback
}
