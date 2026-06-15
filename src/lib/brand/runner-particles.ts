import {
  type EraAccentStyle,
} from "@/lib/brand/runner-milestones"

export const PARTICLE_POOL_SIZE = 44
export const AMBIENT_DUST_COUNT = 24
export const AMBIENT_WIND_COUNT = 8
export const SCORE_EFFECT_INTERVAL = 1000

const SCORE_EFFECT_STYLES: readonly EraAccentStyle[] = [
  "boot",
  "spark",
  "stroke",
  "diamond",
  "blob",
  "code",
] as const

export type ParticleLayer = "dust" | "wind" | "burst" | "era"

export type RunnerParticle = {
  active: boolean
  layer: ParticleLayer
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  sizeW: number
  sizeH: number
  alpha: number
  color: string
}

export type ParticleThemeColors = {
  foreground: string
  muted: string
  primary: string
}

export function getScoreEffectTier(score: number): number {
  return Math.floor(score / SCORE_EFFECT_INTERVAL)
}

export function getStyleForEffectTier(tier: number): EraAccentStyle {
  return SCORE_EFFECT_STYLES[Math.min(tier, SCORE_EFFECT_STYLES.length - 1)]
}

export function createParticlePool(): RunnerParticle[] {
  return Array.from({ length: PARTICLE_POOL_SIZE }, () => ({
    active: false,
    layer: "dust",
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    life: 0,
    maxLife: 1,
    sizeW: 2,
    sizeH: 2,
    alpha: 0.25,
    color: "",
  }))
}

export function resetParticlePool(pool: RunnerParticle[]) {
  for (const particle of pool) {
    particle.active = false
  }
}

function findInactiveSlot(pool: RunnerParticle[]): RunnerParticle | null {
  for (const particle of pool) {
    if (!particle.active) return particle
  }
  return null
}

function randomRange(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function spawnDust(
  particle: RunnerParticle,
  width: number,
  height: number,
  speed: number,
  color: string,
  spawnOffscreen = false,
) {
  particle.active = true
  particle.layer = "dust"
  particle.x = spawnOffscreen ? -randomRange(4, 40) : randomRange(0, width)
  particle.y = randomRange(8, height * 0.7)
  particle.vx = speed * 0.15 + randomRange(0.2, 0.8)
  particle.vy = randomRange(-0.15, 0.15)
  particle.maxLife = randomRange(180, 320)
  particle.life = particle.maxLife
  particle.sizeW = 2
  particle.sizeH = 2
  particle.alpha = randomRange(0.12, 0.28)
  particle.color = color
}

function spawnWind(
  particle: RunnerParticle,
  width: number,
  height: number,
  speed: number,
  color: string,
  spawnOffscreen = false,
) {
  particle.active = true
  particle.layer = "wind"
  particle.x = spawnOffscreen ? -randomRange(8, 60) : randomRange(0, width)
  particle.y = randomRange(12, height * 0.65)
  particle.vx = speed * 0.4 + randomRange(1, 2.5)
  particle.vy = 0
  particle.maxLife = randomRange(90, 160)
  particle.life = particle.maxLife
  particle.sizeW = 1
  particle.sizeH = 4
  particle.alpha = randomRange(0.08, 0.18)
  particle.color = color
}

function eraColorForStyle(
  style: EraAccentStyle,
  colors: ParticleThemeColors,
): string {
  switch (style) {
    case "spark":
    case "diamond":
    case "blob":
      return colors.primary
    case "code":
      return colors.muted
    default:
      return colors.foreground
  }
}

function configureTierAccentParticle(
  particle: RunnerParticle,
  style: EraAccentStyle,
  height: number,
  speed: number,
  colors: ParticleThemeColors,
  index: number,
) {
  particle.active = true
  particle.layer = "era"
  particle.color = eraColorForStyle(style, colors)
  particle.x = -randomRange(8, 48)
  particle.y = randomRange(8, height * 0.72)
  particle.maxLife = randomRange(220, 420)
  particle.life = particle.maxLife
  particle.alpha = randomRange(0.3, 0.55)
  particle.vx = speed * 0.2 + randomRange(0.9, 2.4)
  particle.vy = randomRange(-0.25, 0.25)

  switch (style) {
    case "boot":
      particle.sizeW = 2
      particle.sizeH = 2
      particle.vy = randomRange(-0.5, -0.1)
      break
    case "spark":
      particle.sizeW = 3
      particle.sizeH = 3
      particle.vy = randomRange(-0.6, -0.15)
      break
    case "stroke":
      particle.sizeW = 4
      particle.sizeH = 1
      particle.vy = randomRange(-0.15, 0.15)
      break
    case "diamond":
      particle.sizeW = 2
      particle.sizeH = 2
      break
    case "blob":
      particle.sizeW = 2
      particle.sizeH = 2
      particle.alpha = randomRange(0.4, 0.65)
      break
    case "code":
      particle.sizeW = index % 2 === 0 ? 3 : 2
      particle.sizeH = 2
      particle.vy = randomRange(-0.35, 0.1)
      break
  }
}

function tierAccentTargetCount(effectTier: number): number {
  if (effectTier <= 0) return 0
  return Math.min(4 + effectTier * 2, 14)
}

export function initAmbientParticles(
  pool: RunnerParticle[],
  width: number,
  height: number,
  speed: number,
  color: string,
  effectTier: number,
  colors: ParticleThemeColors,
) {
  let dustCount = 0
  let windCount = 0
  let eraCount = 0

  for (const particle of pool) {
    if (!particle.active) continue
    if (particle.layer === "dust") dustCount += 1
    if (particle.layer === "wind") windCount += 1
    if (particle.layer === "era") eraCount += 1
  }

  for (let i = dustCount; i < AMBIENT_DUST_COUNT; i += 1) {
    const slot = findInactiveSlot(pool)
    if (!slot) break
    spawnDust(slot, width, height, speed, color, false)
  }

  for (let i = windCount; i < AMBIENT_WIND_COUNT; i += 1) {
    const slot = findInactiveSlot(pool)
    if (!slot) break
    spawnWind(slot, width, height, speed, color, false)
  }

  const style = getStyleForEffectTier(effectTier)
  for (let i = eraCount; i < tierAccentTargetCount(effectTier); i += 1) {
    const slot = findInactiveSlot(pool)
    if (!slot) break
    configureTierAccentParticle(slot, style, height, speed, colors, i)
  }
}

function maintainAmbient(
  pool: RunnerParticle[],
  width: number,
  height: number,
  speed: number,
  effectTier: number,
  colors: ParticleThemeColors,
) {
  let dustCount = 0
  let windCount = 0
  let eraCount = 0

  for (const particle of pool) {
    if (!particle.active) continue
    if (particle.layer === "dust") dustCount += 1
    if (particle.layer === "wind") windCount += 1
    if (particle.layer === "era") eraCount += 1
  }

  const ambientColor =
    effectTier > 0 ? eraColorForStyle(getStyleForEffectTier(effectTier), colors) : colors.foreground

  if (dustCount < AMBIENT_DUST_COUNT) {
    const slot = findInactiveSlot(pool)
    if (slot) spawnDust(slot, width, height, speed, ambientColor, true)
  }

  if (windCount < AMBIENT_WIND_COUNT) {
    const slot = findInactiveSlot(pool)
    if (slot) spawnWind(slot, width, height, speed, ambientColor, true)
  }

  const style = getStyleForEffectTier(effectTier)
  const eraTarget = tierAccentTargetCount(effectTier)
  if (eraCount < eraTarget) {
    const slot = findInactiveSlot(pool)
    if (slot) configureTierAccentParticle(slot, style, height, speed, colors, eraCount)
  }
}

export function spawnLandingPuff(
  pool: RunnerParticle[],
  x: number,
  groundY: number,
  color: string,
) {
  const count = 4 + Math.floor(Math.random() * 3)
  for (let i = 0; i < count; i += 1) {
    const slot = findInactiveSlot(pool)
    if (!slot) break

    slot.active = true
    slot.layer = "burst"
    slot.x = x + randomRange(-4, 4)
    slot.y = groundY - randomRange(2, 8)
    slot.vx = randomRange(0.5, 2.4)
    slot.vy = randomRange(-2.5, -0.6)
    slot.maxLife = 300
    slot.life = slot.maxLife
    slot.sizeW = 2
    slot.sizeH = 2
    slot.alpha = 0.45
    slot.color = color
  }
}

export function spawnScoreTierBurst(
  pool: RunnerParticle[],
  effectTier: number,
  height: number,
  speed: number,
  colors: ParticleThemeColors,
) {
  const style = getStyleForEffectTier(effectTier)
  const count = 10 + Math.floor(Math.random() * 3)

  for (let i = 0; i < count; i += 1) {
    const slot = findInactiveSlot(pool)
    if (!slot) break
    configureTierAccentParticle(slot, style, height, speed, colors, i)
    slot.vx += randomRange(0.5, 1.5)
    slot.maxLife = 1500
    slot.life = slot.maxLife
  }
}

export function updateParticles(
  pool: RunnerParticle[],
  dt: number,
  speed: number,
  width: number,
  height: number,
  colors: ParticleThemeColors,
  effectTier: number,
  running: boolean,
) {
  if (!running) return

  for (const particle of pool) {
    if (!particle.active) continue

    particle.x += particle.vx * dt
    particle.y += particle.vy * dt
    particle.life -= dt * 16.67

    if (particle.layer === "dust") {
      particle.vx = speed * 0.15 + Math.abs(particle.vx) * 0.02
    } else if (particle.layer === "wind") {
      particle.vx = speed * 0.4 + 1.2
    } else if (particle.layer === "burst") {
      particle.vy += 0.08 * dt
      particle.alpha = Math.max(0, (particle.life / particle.maxLife) * 0.45)
    } else if (particle.layer === "era") {
      particle.alpha = Math.max(0, (particle.life / particle.maxLife) * 0.6)
    }

    const exitedRight = particle.x > width + 12
    const exitedVertical = particle.y < -12 || particle.y > height + 12

    if (particle.life <= 0 || exitedRight || exitedVertical) {
      particle.active = false
    }
  }

  maintainAmbient(pool, width, height, speed, effectTier, colors)
}

export function drawParticles(ctx: CanvasRenderingContext2D, pool: RunnerParticle[]) {
  for (const particle of pool) {
    if (!particle.active) continue

    ctx.fillStyle = particle.color
    ctx.globalAlpha = particle.alpha
    ctx.fillRect(
      Math.floor(particle.x),
      Math.floor(particle.y),
      particle.sizeW,
      particle.sizeH,
    )
  }
  ctx.globalAlpha = 1
}
