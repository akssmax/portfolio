import type { M3FeatureImageItem } from "@/components/m3-shapes/m3-feature-image"
import { m3ShapePaths } from "@/lib/m3-shape-paths"
import type { M3ShapeId } from "@/lib/m3-shapes"

/** Shapes that support SVG path morphing in M3FeatureImage. */
const MORPHABLE_SHAPE_POOL = Object.keys(m3ShapePaths) as M3ShapeId[]

/** Transparent cutout selfies — brand color shows through the M3 shape behind them. */
const HERO_SELFIE_SOURCES = [
  "/images/portraits/01.webp",
  "/images/portraits/02.webp",
  "/images/portraits/03.webp",
  "/images/portraits/04.webp",
] as const

export const HERO_PORTRAIT_SLOT_COUNT = HERO_SELFIE_SOURCES.length

const SHUFFLE_STORAGE_KEY = "hero-portrait-shuffle-v5"

function shuffleInPlace<T>(items: T[]) {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[items[i], items[j]] = [items[j], items[i]]
  }
}

function buildPortraitItems(
  selectedSources: readonly string[],
  selectedShapes: readonly M3ShapeId[],
): M3FeatureImageItem[] {
  return selectedShapes.map((shape, index) => ({
    src: selectedSources[index] ?? HERO_SELFIE_SOURCES[0],
    shape,
  }))
}

/** Picks a random selfie + shape pairing per session, stable until the tab closes. */
export function getRandomizedHeroPortraitItems(): M3FeatureImageItem[] {
  if (typeof sessionStorage !== "undefined") {
    const stored = sessionStorage.getItem(SHUFFLE_STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as M3FeatureImageItem[]
        if (
          parsed.length === HERO_PORTRAIT_SLOT_COUNT &&
          parsed.every((item) => item.src && item.shape)
        ) {
          return parsed
        }
      } catch {
        // fall through to regenerate
      }
    }
  }

  const selfies = [...HERO_SELFIE_SOURCES]
  shuffleInPlace(selfies)

  const shapes = [...MORPHABLE_SHAPE_POOL]
  shuffleInPlace(shapes)

  const items = buildPortraitItems(
    selfies,
    shapes.slice(0, HERO_PORTRAIT_SLOT_COUNT),
  )

  if (typeof sessionStorage !== "undefined") {
    sessionStorage.setItem(SHUFFLE_STORAGE_KEY, JSON.stringify(items))
  }

  return items
}

/** Default non-random set — useful for tests or static previews. */
export const heroPortraitItems = buildPortraitItems(
  HERO_SELFIE_SOURCES,
  MORPHABLE_SHAPE_POOL.slice(0, HERO_PORTRAIT_SLOT_COUNT),
)
