export type MilestoneId =
  | "computer"
  | "after-effects"
  | "illustrator"
  | "adobe-xd"
  | "figma"
  | "design-engineer"

export type RunnerMilestone = {
  id: MilestoneId
  label: string
  shortLabel: string
  distanceThreshold: number
  svgSrc: string
}

export const RUNNER_MILESTONES: readonly RunnerMilestone[] = [
  {
    id: "computer",
    label: "First computer",
    shortLabel: "PC",
    distanceThreshold: 0,
    svgSrc: "/tools/runner/computer.svg",
  },
  {
    id: "after-effects",
    label: "After Effects",
    shortLabel: "AE",
    distanceThreshold: 400,
    svgSrc: "/tools/runner/after-effects.svg",
  },
  {
    id: "illustrator",
    label: "Illustrator",
    shortLabel: "Ai",
    distanceThreshold: 900,
    svgSrc: "/tools/runner/illustrator.svg",
  },
  {
    id: "adobe-xd",
    label: "Adobe XD",
    shortLabel: "XD",
    distanceThreshold: 1400,
    svgSrc: "/tools/runner/adobe-xd.svg",
  },
  {
    id: "figma",
    label: "Figma",
    shortLabel: "Figma",
    distanceThreshold: 2000,
    svgSrc: "/tools/runner/figma.svg",
  },
  {
    id: "design-engineer",
    label: "Design Engineer",
    shortLabel: "Eng",
    distanceThreshold: 2600,
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
  "after-effects": "spark",
  illustrator: "stroke",
  "adobe-xd": "diamond",
  figma: "blob",
  "design-engineer": "code",
}

const ICON_SIZE = 32

const milestoneById = new Map<MilestoneId, RunnerMilestone>(
  RUNNER_MILESTONES.map((milestone) => [milestone.id, milestone]),
)

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
    ctx.drawImage(image, 0, 0, size, size)
    return canvas
  } finally {
    URL.revokeObjectURL(url)
  }
}

export async function preloadMilestoneIcons(
  color: string,
): Promise<Map<MilestoneId, HTMLCanvasElement>> {
  const icons = new Map<MilestoneId, HTMLCanvasElement>()

  await Promise.all(
    RUNNER_MILESTONES.map(async (milestone) => {
      try {
        const response = await fetch(milestone.svgSrc)
        if (!response.ok) return
        const svgMarkup = await response.text()
        const canvas = await rasterizeSvgMarkup(svgMarkup, color, ICON_SIZE)
        icons.set(milestone.id, canvas)
      } catch {
        // Icon preload failure should not block gameplay.
      }
    }),
  )

  return icons
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
) {
  const milestone = getMilestoneById(obstacle.milestoneId)
  const top = groundY - obstacle.height
  const radius = 6

  ctx.fillStyle = foreground
  ctx.globalAlpha = 0.22
  ctx.beginPath()
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(obstacle.x, top, obstacle.width, obstacle.height, radius)
  } else {
    ctx.rect(obstacle.x, top, obstacle.width, obstacle.height)
  }
  ctx.fill()

  ctx.globalAlpha = 0.75
  ctx.strokeStyle = foreground
  ctx.lineWidth = 1
  ctx.beginPath()
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(obstacle.x + 0.5, top + 0.5, obstacle.width - 1, obstacle.height - 1, radius)
  } else {
    ctx.rect(obstacle.x + 0.5, top + 0.5, obstacle.width - 1, obstacle.height - 1)
  }
  ctx.stroke()
  ctx.globalAlpha = 1

  const icon = icons.get(obstacle.milestoneId)
  const label = milestone.shortLabel
  const labelFontSize = obstacle.height >= 50 ? 8 : 7
  const iconSize = Math.min(22, obstacle.width - 8, obstacle.height * 0.42)
  const labelHeight = labelFontSize + 2
  const contentHeight = iconSize + labelHeight + 4
  const contentTop = top + Math.max(4, (obstacle.height - contentHeight) / 2)

  if (icon) {
    const iconX = obstacle.x + (obstacle.width - iconSize) / 2
    ctx.drawImage(icon, iconX, contentTop, iconSize, iconSize)
  }

  ctx.fillStyle = foreground
  ctx.globalAlpha = 1
  ctx.font = `600 ${labelFontSize}px system-ui, sans-serif`
  ctx.textAlign = "center"
  ctx.textBaseline = "top"
  ctx.fillText(label, obstacle.x + obstacle.width / 2, contentTop + iconSize + 2)
  ctx.globalAlpha = 1
}
