/** Gilbert Baker rainbow flag — six official stripes, top to bottom. */
export const PRIDE_FLAG_COLORS = [
  "#E40303", // red
  "#FF8C00", // orange
  "#FFED00", // yellow
  "#008026", // green
  "#004DFF", // blue
  "#750787", // violet
] as const

/** Pride palette streak colors for the hero Lightfall background. */
export const HERO_LIGHTFALL_COLORS = [...PRIDE_FLAG_COLORS] as string[]

/** Lightfall hero background — streak tints + ambient glow from the pride palette. */
export const PRIDE_LIGHTFALL_PROPS = {
  colors: HERO_LIGHTFALL_COLORS,
  backgroundColor: PRIDE_FLAG_COLORS[5],
} as const

/** Full Lightfall tuning for the homepage hero. */
export const HERO_LIGHTFALL_CONFIG = {
  colors: HERO_LIGHTFALL_COLORS,
  backgroundColor: PRIDE_FLAG_COLORS[5],
  speed: 0.85,
  streakCount: 8,
  streakWidth: 1,
  streakLength: 1,
  glow: 0.9,
  density: 0.75,
  twinkle: 0.85,
  zoom: 2.4,
  backgroundGlow: 0.55,
  opacity: 1,
  mouseInteraction: true,
  mouseStrength: 0.65,
  mouseRadius: 0.6,
  mouseDampening: 0.15,
} as const
