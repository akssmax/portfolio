export type MilestoneId =
  | "computer"
  | "terminal"
  | "paint"
  | "html5"
  | "photoshop"
  | "after-effects"
  | "illustrator"
  | "behance"
  | "figma"
  | "design-engineer"

export type MilestoneEra = "boot" | "code" | "design" | "ship"

export type RunnerMilestone = {
  id: MilestoneId
  label: string
  shortLabel: string
  tagline: string
  era: MilestoneEra
  distanceThreshold: number
  svgSrc: string
}

export const RUNNER_MILESTONES: readonly RunnerMilestone[] = [
  {
    id: "computer",
    label: "First PC",
    shortLabel: "PC",
    tagline: "Boot sequence: curiosity.exe",
    era: "boot",
    distanceThreshold: 0,
    svgSrc: "/tools/runner/computer.svg",
  },
  {
    id: "terminal",
    label: "Terminal",
    shortLabel: "CLI",
    tagline: "C:\\> dir /w",
    era: "boot",
    distanceThreshold: 250,
    svgSrc: "/tools/runner/terminal.svg",
  },
  {
    id: "paint",
    label: "MS Paint",
    shortLabel: "Paint",
    tagline: "Saved as bitmap. Proud.",
    era: "boot",
    distanceThreshold: 550,
    svgSrc: "/tools/runner/paint.svg",
  },
  {
    id: "html5",
    label: "HTML",
    shortLabel: "HTML",
    tagline: "View Source changed everything",
    era: "code",
    distanceThreshold: 850,
    svgSrc: "/tools/runner/html5.svg",
  },
  {
    id: "photoshop",
    label: "Photoshop",
    shortLabel: "Ps",
    tagline: "Layers. Masks. Rabbit hole.",
    era: "design",
    distanceThreshold: 1150,
    svgSrc: "/tools/runner/photoshop.svg",
  },
  {
    id: "after-effects",
    label: "After Effects",
    shortLabel: "AE",
    tagline: "Keyframes = magic",
    era: "design",
    distanceThreshold: 1450,
    svgSrc: "/tools/runner/after-effects.svg",
  },
  {
    id: "illustrator",
    label: "Illustrator",
    shortLabel: "Ai",
    tagline: "Bezier handles my feelings",
    era: "design",
    distanceThreshold: 1750,
    svgSrc: "/tools/runner/illustrator.svg",
  },
  {
    id: "behance",
    label: "Behance",
    shortLabel: "Be",
    tagline: "Found my design crushes",
    era: "design",
    distanceThreshold: 2050,
    svgSrc: "/tools/runner/behance.svg",
  },
  {
    id: "figma",
    label: "Figma",
    shortLabel: "Figma",
    tagline: "Multiplayer design unlocked",
    era: "design",
    distanceThreshold: 2350,
    svgSrc: "/tools/runner/figma.svg",
  },
  {
    id: "design-engineer",
    label: "Design Engineer",
    shortLabel: "Eng",
    tagline: "Shipping pixels in prod",
    era: "ship",
    distanceThreshold: 2650,
    svgSrc: "/tools/runner/design-engineer.svg",
  },
] as const

export type EraAccentStyle =
  | "boot"
  | "spark"
  | "stroke"
  | "diamond"
  | "blob"
  | "code"

export const ERA_ACCENT_STYLE: Record<MilestoneId, EraAccentStyle> = {
  computer: "boot",
  terminal: "boot",
  paint: "boot",
  html5: "code",
  photoshop: "stroke",
  "after-effects": "spark",
  illustrator: "stroke",
  behance: "diamond",
  figma: "blob",
  "design-engineer": "code",
}

export type IconResolutionTier = "normal" | "hi"

const ICON_BASE_NORMAL = 32
const ICON_BASE_HI = 96
const ICON_MAX_SIZE = 128
const HI_RES_LAYOUT_SCALE = 1.2

const milestoneById = new Map<MilestoneId, RunnerMilestone>(
  RUNNER_MILESTONES.map((milestone) => [milestone.id, milestone]),
)

const svgMarkupCache = new Map<MilestoneId, string>()
const rasterIconCache = new Map<string, HTMLCanvasElement>()

export function getMilestoneById(id: MilestoneId): RunnerMilestone {
  return milestoneById.get(id) ?? RUNNER_MILESTONES[0]
}

export function getMilestoneIndex(distance: number): number {
  let index = 0
  for (let i = 0; i < RUNNER_MILESTONES.length; i += 1) {
    if (distance >= RUNNER_MILESTONES[i].distanceThreshold) {
      index = i
    }
  }
  return index
}

export function getMilestoneByIndex(index: number): RunnerMilestone {
  return RUNNER_MILESTONES[Math.min(index, RUNNER_MILESTONES.length - 1)]
}

export function getMilestoneFlavor(id: MilestoneId): { label: string; tagline: string } {
  const milestone = getMilestoneById(id)
  return { label: milestone.label, tagline: milestone.tagline }
}

export function getIconResolutionTier(layoutScale: number): IconResolutionTier {
  return layoutScale > HI_RES_LAYOUT_SCALE ? "hi" : "normal"
}

function getRasterSize(tier: IconResolutionTier, dpr: number): number {
  const base = tier === "hi" ? ICON_BASE_HI : ICON_BASE_NORMAL
  return Math.min(ICON_MAX_SIZE, Math.ceil(base * dpr))
}

function iconCacheKey(id: MilestoneId, color: string, tier: IconResolutionTier, dpr: number) {
  return `${id}:${color}:${tier}:${dpr}`
}

async function fetchSvgMarkup(id: MilestoneId, svgSrc: string): Promise<string | null> {
  const cached = svgMarkupCache.get(id)
  if (cached) return cached

  try {
    const response = await fetch(svgSrc)
    if (!response.ok) return null
    const svgMarkup = await response.text()
    svgMarkupCache.set(id, svgMarkup)
    return svgMarkup
  } catch {
    return null
  }
}

async function rasterizeSvgMarkup(
  svgMarkup: string,
  color: string,
  size: number,
): Promise<HTMLCanvasElement> {
  const tintedSvg = svgMarkup.replace(/currentColor/g, color)
  const blob = new Blob([tintedSvg], { type: "image/svg+xml" })
  const url = URL.createObjectURL(blob)

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = url
    })

    const canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      throw new Error("Could not create milestone icon canvas context")
    }
    ctx.imageSmoothingEnabled = true
    ctx.drawImage(image, 0, 0, size, size)
    return canvas
  } finally {
    URL.revokeObjectURL(url)
  }
}

export async function ensureMilestoneIcons(
  color: string,
  layoutScale: number,
  dpr: number,
): Promise<Map<MilestoneId, HTMLCanvasElement>> {
  const tier = getIconResolutionTier(layoutScale)
  const size = getRasterSize(tier, dpr)
  const icons = new Map<MilestoneId, HTMLCanvasElement>()

  await Promise.all(
    RUNNER_MILESTONES.map(async (milestone) => {
      const key = iconCacheKey(milestone.id, color, tier, dpr)
      const cached = rasterIconCache.get(key)
      if (cached) {
        icons.set(milestone.id, cached)
        return
      }

      const svgMarkup = await fetchSvgMarkup(milestone.id, milestone.svgSrc)
      if (!svgMarkup) return

      try {
        const canvas = await rasterizeSvgMarkup(svgMarkup, color, size)
        rasterIconCache.set(key, canvas)
        icons.set(milestone.id, canvas)
      } catch {
        // Icon rasterization failure should not block gameplay.
      }
    }),
  )

  return icons
}

/** @deprecated Use ensureMilestoneIcons instead */
export async function preloadMilestoneIcons(
  color: string,
): Promise<Map<MilestoneId, HTMLCanvasElement>> {
  return ensureMilestoneIcons(color, 1, 1)
}

export function drawMilestoneObstacles(
  ctx: CanvasRenderingContext2D,
  obstacles: ReadonlyArray<{
    x: number
    width: number
    height: number
    milestoneId: MilestoneId
  }>,
  groundY: number,
  foreground: string,
  icons: Map<MilestoneId, HTMLCanvasElement>,
  layoutScale = 1,
) {
  if (obstacles.length === 0) return

  ctx.fillStyle = foreground
  ctx.strokeStyle = foreground

  for (const obstacle of obstacles) {
    const width = obstacle.width * layoutScale
    const height = obstacle.height * layoutScale
    const top = groundY - height
    const radius = 6 * layoutScale

    ctx.globalAlpha = 0.22
    ctx.beginPath()
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(obstacle.x, top, width, height, radius)
    } else {
      ctx.rect(obstacle.x, top, width, height)
    }
    ctx.fill()

    ctx.globalAlpha = 0.75
    ctx.lineWidth = Math.max(1, layoutScale)
    ctx.beginPath()
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(obstacle.x + 0.5, top + 0.5, width - 1, height - 1, radius)
    } else {
      ctx.rect(obstacle.x + 0.5, top + 0.5, width - 1, height - 1)
    }
    ctx.stroke()
  }

  ctx.globalAlpha = 1

  const tallLabelSize = 8 * layoutScale
  const shortLabelSize = 7 * layoutScale

  for (const obstacle of obstacles) {
    const milestone = getMilestoneById(obstacle.milestoneId)
    const width = obstacle.width * layoutScale
    const height = obstacle.height * layoutScale
    const top = groundY - height
    const icon = icons.get(obstacle.milestoneId)
    const labelFontSize = obstacle.height >= 50 ? tallLabelSize : shortLabelSize
    const iconSize = Math.min(22 * layoutScale, width - 8 * layoutScale, height * 0.48)
    const labelHeight = labelFontSize + 2 * layoutScale
    const contentHeight = iconSize + labelHeight + 4 * layoutScale
    const contentTop = top + Math.max(4 * layoutScale, (height - contentHeight) / 2)

    if (icon) {
      const iconX = obstacle.x + (width - iconSize) / 2
      ctx.imageSmoothingEnabled = true
      ctx.drawImage(icon, iconX, contentTop, iconSize, iconSize)
    }

    ctx.fillStyle = foreground
    ctx.globalAlpha = 1
    ctx.font = `600 ${labelFontSize}px system-ui, sans-serif`
    ctx.textAlign = "center"
    ctx.textBaseline = "top"
    ctx.fillText(milestone.shortLabel, obstacle.x + width / 2, contentTop + iconSize + 2 * layoutScale)
  }

  ctx.globalAlpha = 1
}

export function drawMilestoneObstacle(
  ctx: CanvasRenderingContext2D,
  obstacle: {
    x: number
    width: number
    height: number
    milestoneId: MilestoneId
  },
  groundY: number,
  foreground: string,
  icons: Map<MilestoneId, HTMLCanvasElement>,
  layoutScale = 1,
) {
  drawMilestoneObstacles(ctx, [obstacle], groundY, foreground, icons, layoutScale)
}

export function drawMilestoneIcon(
  ctx: CanvasRenderingContext2D,
  id: MilestoneId,
  x: number,
  y: number,
  size: number,
  icons: Map<MilestoneId, HTMLCanvasElement>,
  options?: { alpha?: number; muted?: boolean },
) {
  const icon = icons.get(id)
  if (!icon) return

  ctx.save()
  ctx.globalAlpha = options?.muted ? 0.28 : (options?.alpha ?? 1)
  ctx.imageSmoothingEnabled = true
  ctx.drawImage(icon, x, y, size, size)
  ctx.restore()
}
