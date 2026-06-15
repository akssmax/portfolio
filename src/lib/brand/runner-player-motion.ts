export type PlayerMotionState = {
  anticipateMs: number
  landRecoverMs: number
  launchOnAnticipateEnd: boolean
  msSinceLand: number
}

export const ANTICIPATE_MS = 52
export const LAND_RECOVER_MS = 95
export const CHAIN_JUMP_WINDOW_MS = 160

export type PlayerMotionVisual = {
  scaleX: number
  scaleY: number
  shouldLaunch: boolean
}

export type JumpStartResult = "anticipate" | "instant" | "blocked"

export function createPlayerMotionState(): PlayerMotionState {
  return {
    anticipateMs: 0,
    landRecoverMs: 0,
    launchOnAnticipateEnd: false,
    msSinceLand: Number.POSITIVE_INFINITY,
  }
}

export function resetPlayerMotionState(motion: PlayerMotionState) {
  motion.anticipateMs = 0
  motion.landRecoverMs = 0
  motion.launchOnAnticipateEnd = false
  motion.msSinceLand = Number.POSITIVE_INFINITY
}

function isChainJump(motion: PlayerMotionState): boolean {
  return motion.landRecoverMs > 0 || motion.msSinceLand < CHAIN_JUMP_WINDOW_MS
}

export function beginJump(motion: PlayerMotionState): JumpStartResult {
  if (motion.anticipateMs > 0) return "blocked"

  motion.landRecoverMs = 0

  if (isChainJump(motion)) {
    return "instant"
  }

  motion.anticipateMs = ANTICIPATE_MS
  motion.launchOnAnticipateEnd = true
  return "anticipate"
}

export function triggerLandRecovery(motion: PlayerMotionState) {
  motion.landRecoverMs = LAND_RECOVER_MS
  motion.msSinceLand = 0
}

export function advanceGroundedTime(motion: PlayerMotionState, dtMs: number, onGround: boolean) {
  if (onGround) {
    motion.msSinceLand = Math.min(motion.msSinceLand + dtMs, CHAIN_JUMP_WINDOW_MS + 1)
  } else {
    motion.msSinceLand = Number.POSITIVE_INFINITY
  }
}

function easeOutQuad(t: number) {
  return 1 - (1 - t) * (1 - t)
}

function easeInQuad(t: number) {
  return t * t
}

function getApexPose(heightRatio: number, playerVy: number) {
  const velocityDamp = Math.exp(-((playerVy / 2.2) ** 2))
  const heightWeight = Math.min(1, heightRatio * 1.15)
  const apexBlend = velocityDamp * heightWeight

  return {
    scaleX: 1 + apexBlend * 0.16,
    scaleY: 1 - apexBlend * 0.2,
    apexBlend,
  }
}

export function updatePlayerMotionVisual(
  motion: PlayerMotionState,
  dtMs: number,
  playerY: number,
  playerVy: number,
  maxJumpHeight: number,
): PlayerMotionVisual {
  let shouldLaunch = false
  const anticipateDuration = ANTICIPATE_MS

  if (dtMs > 0 && motion.anticipateMs > 0) {
    motion.anticipateMs = Math.max(0, motion.anticipateMs - dtMs)
    if (motion.anticipateMs <= 0 && motion.launchOnAnticipateEnd) {
      shouldLaunch = true
      motion.launchOnAnticipateEnd = false
    }
  }

  if (dtMs > 0 && motion.landRecoverMs > 0) {
    motion.landRecoverMs = Math.max(0, motion.landRecoverMs - dtMs)
  }

  if (motion.anticipateMs > 0) {
    const progress = 1 - motion.anticipateMs / anticipateDuration
    const eased = easeInQuad(progress)
    return {
      scaleX: 1 + eased * 0.1,
      scaleY: 1 - eased * 0.13,
      shouldLaunch,
    }
  }

  if (motion.landRecoverMs > 0) {
    const progress = 1 - motion.landRecoverMs / LAND_RECOVER_MS
    const eased = easeOutQuad(progress)
    return {
      scaleX: 1.12 - eased * 0.12,
      scaleY: 0.87 + eased * 0.13,
      shouldLaunch: false,
    }
  }

  if (playerY > 0.5) {
    const speed = Math.min(1, Math.abs(playerVy) / 11)
    const heightRatio = maxJumpHeight > 0 ? playerY / maxJumpHeight : 0
    const apex = getApexPose(heightRatio, playerVy)

    if (apex.apexBlend > 0.35 && Math.abs(playerVy) < 1.6) {
      return {
        scaleX: apex.scaleX,
        scaleY: apex.scaleY,
        shouldLaunch,
      }
    }

    if (playerVy > 0.4) {
      const takeoffWeight = heightRatio < 0.35 ? 1 - heightRatio / 0.35 : 0.12
      const stretch = speed * (0.5 + takeoffWeight * 0.5)
      return {
        scaleX: 1 - stretch * 0.1,
        scaleY: 1 + stretch * 0.17,
        shouldLaunch,
      }
    }

    if (playerVy < -0.4) {
      const fallStretch = speed * (0.4 + Math.min(0.5, heightRatio * 0.7))
      return {
        scaleX: 1 - fallStretch * 0.08,
        scaleY: 1 + fallStretch * 0.14,
        shouldLaunch,
      }
    }

    return { scaleX: apex.scaleX, scaleY: apex.scaleY, shouldLaunch }
  }

  return { scaleX: 1, scaleY: 1, shouldLaunch }
}

export function getDescentGravity(baseGravity: number, playerVy: number): number {
  if (playerVy >= 0) return baseGravity
  const fallSpeed = Math.min(1, Math.abs(playerVy) / 12)
  return baseGravity * (0.9 + fallSpeed * 0.22)
}

export function getApexGravityMultiplier(playerVy: number, heightRatio: number): number {
  if (playerVy <= 0) return 1
  const nearApex = Math.exp(-((playerVy / 3.4) ** 2))
  const highEnough = Math.min(1, heightRatio * 1.1)
  return 1 - nearApex * highEnough * 0.28
}
