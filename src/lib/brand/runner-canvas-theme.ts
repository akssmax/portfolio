export type CanvasThemeColors = {
  foreground: string
  background: string
  muted: string
  primary: string
}

let colorProbe: HTMLSpanElement | null = null

function getColorProbe(): HTMLSpanElement {
  if (!colorProbe) {
    colorProbe = document.createElement("span")
    colorProbe.style.position = "absolute"
    colorProbe.style.visibility = "hidden"
    colorProbe.style.pointerEvents = "none"
  }
  return colorProbe
}

function resolveThemeColor(
  container: HTMLElement,
  cssVar: "--foreground" | "--background" | "--muted-foreground" | "--primary",
): string {
  const probe = getColorProbe()
  probe.style.color = `var(${cssVar})`
  container.appendChild(probe)
  const resolved = getComputedStyle(probe).color
  probe.remove()
  return resolved || "rgb(255, 255, 255)"
}

export type ThemeRgb = readonly [number, number, number]

let colorConvertCtx: CanvasRenderingContext2D | null = null

export function parseCssRgb(color: string): ThemeRgb {
  const match = color.match(
    /rgba?\(\s*([\d.]+)(?:\s*,\s*|\s+)([\d.]+)(?:\s*,\s*|\s+)([\d.]+)/,
  )
  if (match) {
    return [
      clamp01(Number(match[1]) / 255),
      clamp01(Number(match[2]) / 255),
      clamp01(Number(match[3]) / 255),
    ]
  }

  if (typeof document === "undefined") return [0, 0, 0]
  if (!colorConvertCtx) {
    const probe = document.createElement("canvas")
    probe.width = 1
    probe.height = 1
    colorConvertCtx = probe.getContext("2d", { willReadFrequently: true })
  }
  if (!colorConvertCtx) return [0, 0, 0]
  colorConvertCtx.fillStyle = "#000"
  colorConvertCtx.fillStyle = color
  colorConvertCtx.fillRect(0, 0, 1, 1)
  const [r, g, b] = colorConvertCtx.getImageData(0, 0, 1, 1).data
  return [r / 255, g / 255, b / 255]
}

export function readThemeRgb(
  container: HTMLElement,
  cssVar: "--foreground" | "--background" | "--muted-foreground" | "--primary",
): ThemeRgb {
  return parseCssRgb(resolveThemeColor(container, cssVar))
}

export function themeLuminance(rgb: ThemeRgb): number {
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]
}

function clamp01(value: number) {
  if (!Number.isFinite(value)) return 0
  return Math.min(1, Math.max(0, value))
}

export function readCanvasThemeColors(container: HTMLElement): CanvasThemeColors {
  return {
    foreground: resolveThemeColor(container, "--foreground"),
    background: resolveThemeColor(container, "--background"),
    muted: resolveThemeColor(container, "--muted-foreground"),
    primary: resolveThemeColor(container, "--primary"),
  }
}

export function syncCanvasSize(
  canvas: HTMLCanvasElement,
  container: HTMLElement,
): { width: number; height: number; dpr: number } {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const rect = container.getBoundingClientRect()
  const width = Math.max(1, Math.floor(rect.width))
  const height = Math.max(1, Math.floor(rect.height))

  canvas.width = Math.floor(width * dpr)
  canvas.height = Math.floor(height * dpr)
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`

  const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true })
  if (ctx) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  return { width, height, dpr }
}
