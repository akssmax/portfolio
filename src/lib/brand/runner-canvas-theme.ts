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

  const ctx = canvas.getContext("2d", { alpha: false })
  if (ctx) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  return { width, height, dpr }
}
