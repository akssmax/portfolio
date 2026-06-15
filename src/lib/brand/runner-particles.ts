import {
  type EraAccentStyle,
} from "@/lib/brand/runner-milestones"

export const PARTICLE_POOL_SIZE = 44
export const AMBIENT_DUST_COUNT = 24
export const AMBIENT_WIND_COUNT = 12
export const AMBIENT_SLOT_COUNT = AMBIENT_DUST_COUNT + AMBIENT_WIND_COUNT
export const EPHEMERAL_SLOT_START = AMBIENT_SLOT_COUNT
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

function findEphemeralSlot(pool: RunnerParticle[]): RunnerParticle | null {
  for (let i = EPHEMERAL_SLOT_START; i < pool.length; i += 1) {
    if (!pool[i].active) return pool[i]
  }
  return null
}

function findOldestEphemeralSlot(pool: RunnerParticle[]): RunnerParticle | null {
  let oldest: RunnerParticle | null = null
  for (let i = EPHEMERAL_SLOT_START; i < pool.length; i += 1) {
    const particle = pool[i]
    if (!particle.active) return particle
    if (!oldest || particle.life < oldest.life) oldest = particle
  }
  return oldest
}

function randomRange(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function ambientColorForTier(effectTier: number, colors: ParticleThemeColors): string {
  if (effectTier <= 0) return colors.foreground
  return eraColorForStyle(getStyleForEffectTier(effectTier), colors)
}

function spawnDust(
  particle: RunnerParticle,
  width: number,
  height: number,
  speed: number,
  color: string,
) {
  particle.active = true
  particle.layer = "dust"
  particle.x = randomRange(0, width)
  particle.y = randomRange(6, height * 0.78)
  particle.vx = -(speed * 0.1 + randomRange(0.15, 0.55))
  particle.vy = randomRange(-0.08, 0.08)
  particle.maxLife = randomRange(220, 420)
  particle.life = particle.maxLife
  particle.sizeW = 2
  particle.sizeH = 2
  particle.alpha = randomRange(0.2, 0.42)
  particle.color = color
}

function spawnWind(
  particle: RunnerParticle,
  width: number,
  height: number,
  speed: number,
  color: string,
) {
  particle.active = true
  particle.layer = "wind"
  particle.x = randomRange(0, width)
  particle.y = randomRange(8, height * 0.72)
  particle.vx = -(speed * 0.28 + randomRange(0.6, 1.6))
  particle.vy = randomRange(-0.04, 0.04)
  particle.maxLife = randomRange(120, 220)
  particle.life = particle.maxLife
  particle.sizeW = 2
  particle.sizeH = randomRange(4, 8)
  particle.alpha = randomRange(0.14, 0.3)
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
  width: number,
  height: number,
  speed: number,
  colors: ParticleThemeColors,
  index: number,
) {
  particle.active = true
  particle.layer = "era"
  particle.color = eraColorForStyle(style, colors)
  particle.x = randomRange(0, width)
  particle.y = randomRange(8, height * 0.75)
  particle.maxLife = randomRange(220, 420)
  particle.life = particle.maxLife
  particle.alpha = randomRange(0.32, 0.58)
  particle.vx = -(speed * 0.35 + randomRange(1.2, 2.8))
  particle.vy = randomRange(-0.2, 0.2)

  switch (style) {
    case "boot":
      particle.sizeW = 2
      particle.sizeH = 2
      break
    case "spark":
      particle.sizeW = 3
      particle.sizeH = 3
      particle.vx = -(speed * 0.45 + randomRange(1.8, 3.2))
      break
    case "stroke":
      particle.sizeW = randomRange(5, 8)
      particle.sizeH = 1
      particle.vx = -(speed * 0.7 + randomRange(2, 4))
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
      break
  }
}

function ensureAmbientPopulation(
  pool: RunnerParticle[],
  width: number,
  height: number,
  speed: number,
  effectTier: number,
  colors: ParticleThemeColors,
) {
  const color = ambientColorForTier(effectTier, colors)

  for (let i = 0; i < AMBIENT_DUST_COUNT; i += 1) {
    const particle = pool[i]
    if (!particle.active || particle.layer !== "dust") {
      spawnDust(particle, width, height, speed, color)
    }
  }

  for (let i = 0; i < AMBIENT_WIND_COUNT; i += 1) {
    const particle = pool[AMBIENT_DUST_COUNT + i]
    if (!particle.active || particle.layer !== "wind") {
      spawnWind(particle, width, height, speed, color)
    }
  }
}

function respawnAmbientParticle(
  particle: RunnerParticle,
  width: number,
  height: number,
  speed: number,
  color: string,
) {
  if (particle.layer === "wind") {
    spawnWind(particle, width, height, speed, color)
  } else {
    spawnDust(particle, width, height, speed, color)
  }
}

export function initAmbientParticles(
  pool: RunnerParticle[],
  width: number,
  height: number,
  speed: number,
  _color: string,
  effectTier: number,
  colors: ParticleThemeColors,
) {
  for (let i = 0; i < AMBIENT_SLOT_COUNT; i += 1) {
    pool[i].active = false
  }
  ensureAmbientPopulation(pool, width, height, speed, effectTier, colors)
}

export function spawnLandingPuff(
  pool: RunnerParticle[],
  x: number,
  groundY: number,
  color: string,
) {
  const count = 4 + Math.floor(Math.random() * 3)
  for (let i = 0; i < count; i += 1) {
    const slot = findEphemeralSlot(pool) ?? findOldestEphemeralSlot(pool)
    if (!slot) break

    slot.active = true
    slot.layer = "burst"
    slot.x = x + randomRange(-4, 4)
    slot.y = groundY - randomRange(2, 8)
    slot.vx = randomRange(-2.8, -0.4)
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
  width: number,
  height: number,
  speed: number,
  colors: ParticleThemeColors,
) {
  const style = getStyleForEffectTier(effectTier)
  const count = Math.min(8, 6 + Math.floor(Math.random() * 3))

  for (let i = 0; i < count; i += 1) {
    const slot = findEphemeralSlot(pool) ?? findOldestEphemeralSlot(pool)
    if (!slot) break
    configureTierAccentParticle(slot, style, width, height, speed, colors, i)
    slot.vx -= randomRange(0.8, 2)
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
  const ambientColor = ambientColorForTier(effectTier, colors)
  const ambientBandBottom = height * 0.82

  for (let i = 0; i < AMBIENT_SLOT_COUNT; i += 1) {
    const particle = pool[i]
    if (!particle.active) continue

    particle.x += particle.vx * dt
    particle.y += particle.vy * dt
    particle.life -= dt * 16.67

    if (particle.layer === "dust") {
      particle.vx = -(speed * 0.1 + Math.abs(particle.vx) * 0.03)
      particle.color = ambientColor
    } else if (particle.layer === "wind") {
      particle.vx = -(speed * 0.28 + 0.9)
      particle.color = ambientColor
    }

    const outOfBounds =
      particle.x < -24 ||
      particle.x > width + 24 ||
      particle.y < 0 ||
      particle.y > ambientBandBottom ||
      particle.life <= 0

    if (outOfBounds) {
      respawnAmbientParticle(particle, width, height, speed, ambientColor)
    }
  }

  for (let i = EPHEMERAL_SLOT_START; i < pool.length; i += 1) {
    const particle = pool[i]
    if (!particle.active) continue

    particle.x += particle.vx * dt
    particle.y += particle.vy * dt
    particle.life -= dt * 16.67

    if (particle.layer === "era") {
      particle.vx = Math.min(particle.vx, -(speed * 0.3 + 1))
      particle.alpha = Math.max(0, (particle.life / particle.maxLife) * 0.6)
    } else if (particle.layer === "burst") {
      particle.vy += 0.08 * dt
      particle.vx = Math.min(particle.vx, -0.2)
      particle.alpha = Math.max(0, (particle.life / particle.maxLife) * 0.45)
    }

    const exitedBounds =
      particle.life <= 0 ||
      particle.x < -24 ||
      particle.x > width + 24 ||
      particle.y < -12 ||
      particle.y > height + 12

    if (exitedBounds) {
      particle.active = false
    }
  }

  if (running) {
    ensureAmbientPopulation(pool, width, height, speed, effectTier, colors)
  }
}

export function drawParticles(ctx: CanvasRenderingContext2D, pool: RunnerParticle[]) {
  let lastColor = ""
  let lastAlpha = -1

  for (const particle of pool) {
    if (!particle.active) continue

    if (particle.color !== lastColor) {
      ctx.fillStyle = particle.color
      lastColor = particle.color
    }
    if (particle.alpha !== lastAlpha) {
      ctx.globalAlpha = particle.alpha
      lastAlpha = particle.alpha
    }
    ctx.fillRect(particle.x | 0, particle.y | 0, particle.sizeW, particle.sizeH)
  }

  if (lastAlpha !== 1) {
    ctx.globalAlpha = 1
  }
}
