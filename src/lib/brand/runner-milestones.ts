export type MilestoneId =
  | "computer"
  | "terminal"
  | "paint"
  | "html5"
  | "css3"
  | "javascript"
  | "canva"
  | "photoshop"
  | "illustrator"
  | "indesign"
  | "after-effects"
  | "premiere-pro"
  | "sketch"
  | "adobe-xd"
  | "figma"
  | "figjam"
  | "framer"
  | "webflow"
  | "miro"
  | "dribbble"
  | "behance"
  | "jitter"
  | "storybook"
  | "tailwindcss"
  | "react"
  | "notion"
  | "cursor"

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

const MILESTONE_STEP = 180

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
    distanceThreshold: MILESTONE_STEP * 1,
    svgSrc: "/tools/runner/terminal.svg",
  },
  {
    id: "paint",
    label: "MS Paint",
    shortLabel: "Paint",
    tagline: "Saved as bitmap. Proud.",
    era: "boot",
    distanceThreshold: MILESTONE_STEP * 2,
    svgSrc: "/tools/runner/paint.svg",
  },
  {
    id: "html5",
    label: "HTML",
    shortLabel: "HTML",
    tagline: "View Source changed everything",
    era: "code",
    distanceThreshold: MILESTONE_STEP * 3,
    svgSrc: "/tools/runner/html5.svg",
  },
  {
    id: "css3",
    label: "CSS",
    shortLabel: "CSS",
    tagline: "Box model enlightenment",
    era: "code",
    distanceThreshold: MILESTONE_STEP * 4,
    svgSrc: "/tools/runner/css3.svg",
  },
  {
    id: "javascript",
    label: "JavaScript",
    shortLabel: "JS",
    tagline: "console.log('hello world')",
    era: "code",
    distanceThreshold: MILESTONE_STEP * 5,
    svgSrc: "/tools/runner/javascript.svg",
  },
  {
    id: "canva",
    label: "Canva",
    shortLabel: "Canva",
    tagline: "First poster. Instant designer.",
    era: "design",
    distanceThreshold: MILESTONE_STEP * 6,
    svgSrc: "/tools/runner/canva.svg",
  },
  {
    id: "photoshop",
    label: "Photoshop",
    shortLabel: "Ps",
    tagline: "Layers. Masks. Rabbit hole.",
    era: "design",
    distanceThreshold: MILESTONE_STEP * 7,
    svgSrc: "/tools/runner/photoshop.svg",
  },
  {
    id: "illustrator",
    label: "Illustrator",
    shortLabel: "Ai",
    tagline: "Bezier handles my feelings",
    era: "design",
    distanceThreshold: MILESTONE_STEP * 8,
    svgSrc: "/tools/runner/illustrator.svg",
  },
  {
    id: "indesign",
    label: "InDesign",
    shortLabel: "Id",
    tagline: "Grids, guides, and guilt",
    era: "design",
    distanceThreshold: MILESTONE_STEP * 9,
    svgSrc: "/tools/runner/indesign.svg",
  },
  {
    id: "after-effects",
    label: "After Effects",
    shortLabel: "AE",
    tagline: "Keyframes = magic",
    era: "design",
    distanceThreshold: MILESTONE_STEP * 10,
    svgSrc: "/tools/runner/after-effects.svg",
  },
  {
    id: "premiere-pro",
    label: "Premiere Pro",
    shortLabel: "Pr",
    tagline: "Timeline therapy",
    era: "design",
    distanceThreshold: MILESTONE_STEP * 11,
    svgSrc: "/tools/runner/premiere-pro.svg",
  },
  {
    id: "sketch",
    label: "Sketch",
    shortLabel: "Sk",
    tagline: "Symbols changed the game",
    era: "design",
    distanceThreshold: MILESTONE_STEP * 12,
    svgSrc: "/tools/runner/sketch.svg",
  },
  {
    id: "adobe-xd",
    label: "Adobe XD",
    shortLabel: "XD",
    tagline: "Prototype dreams",
    era: "design",
    distanceThreshold: MILESTONE_STEP * 13,
    svgSrc: "/tools/runner/adobe-xd.svg",
  },
  {
    id: "figma",
    label: "Figma",
    shortLabel: "Fig",
    tagline: "Multiplayer design unlocked",
    era: "design",
    distanceThreshold: MILESTONE_STEP * 14,
    svgSrc: "/tools/runner/figma.svg",
  },
  {
    id: "figjam",
    label: "FigJam",
    shortLabel: "Jam",
    tagline: "Sticky notes everywhere",
    era: "design",
    distanceThreshold: MILESTONE_STEP * 15,
    svgSrc: "/tools/figjam.svg",
  },
  {
    id: "framer",
    label: "Framer",
    shortLabel: "Fr",
    tagline: "Motion meets UI",
    era: "design",
    distanceThreshold: MILESTONE_STEP * 16,
    svgSrc: "/tools/framer.svg",
  },
  {
    id: "webflow",
    label: "Webflow",
    shortLabel: "Wf",
    tagline: "Visual dev unlocked",
    era: "ship",
    distanceThreshold: MILESTONE_STEP * 17,
    svgSrc: "/tools/webflow.svg",
  },
  {
    id: "miro",
    label: "Miro",
    shortLabel: "Miro",
    tagline: "Infinite whiteboard energy",
    era: "design",
    distanceThreshold: MILESTONE_STEP * 18,
    svgSrc: "/tools/miro.svg",
  },
  {
    id: "dribbble",
    label: "Dribbble",
    shortLabel: "Db",
    tagline: "Shot posted. Confidence up.",
    era: "design",
    distanceThreshold: MILESTONE_STEP * 19,
    svgSrc: "/tools/runner/dribbble.svg",
  },
  {
    id: "behance",
    label: "Behance",
    shortLabel: "Be",
    tagline: "Found my design crushes",
    era: "design",
    distanceThreshold: MILESTONE_STEP * 20,
    svgSrc: "/tools/runner/behance.svg",
  },
  {
    id: "jitter",
    label: "Jitter",
    shortLabel: "Jit",
    tagline: "Micro-motion obsession",
    era: "design",
    distanceThreshold: MILESTONE_STEP * 21,
    svgSrc: "/tools/jitter.svg",
  },
  {
    id: "storybook",
    label: "Storybook",
    shortLabel: "SB",
    tagline: "Components with stories",
    era: "ship",
    distanceThreshold: MILESTONE_STEP * 22,
    svgSrc: "/tools/runner/storybook.svg",
  },
  {
    id: "tailwindcss",
    label: "Tailwind CSS",
    shortLabel: "TW",
    tagline: "Utility classes forever",
    era: "ship",
    distanceThreshold: MILESTONE_STEP * 23,
    svgSrc: "/tools/runner/tailwindcss.svg",
  },
  {
    id: "react",
    label: "React",
    shortLabel: "Rx",
    tagline: "Component brain online",
    era: "ship",
    distanceThreshold: MILESTONE_STEP * 24,
    svgSrc: "/tools/runner/react.svg",
  },
  {
    id: "notion",
    label: "Notion",
    shortLabel: "Nt",
    tagline: "Docs, specs, and chaos",
    era: "ship",
    distanceThreshold: MILESTONE_STEP * 25,
    svgSrc: "/tools/notion.svg",
  },
  {
    id: "cursor",
    label: "Design Engineer",
    shortLabel: "Cur",
    tagline: "Shipping pixels in prod",
    era: "ship",
    distanceThreshold: MILESTONE_STEP * 26,
    svgSrc: "/tools/cursor.svg",
  },
] as const

export type EraAccentStyle =
  | "boot"
  | "spark"
  | "stroke"
  | "diamond"
  | "blob"
  | "code"

const ACCENT_CYCLE: readonly EraAccentStyle[] = [
  "boot",
  "code",
  "stroke",
  "spark",
  "diamond",
  "blob",
] as const

export const ERA_ACCENT_STYLE = Object.fromEntries(
  RUNNER_MILESTONES.map((milestone, index) => [
    milestone.id,
    ACCENT_CYCLE[index % ACCENT_CYCLE.length],
  ]),
) as Record<MilestoneId, EraAccentStyle>

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
  const tintedSvg = svgMarkup
    .replace(/currentColor/g, color)
    .replace(/fill="#[^"]+"/gi, `fill="${color}"`)
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
