export type PlayerMotionState = {
  anticipateMs: number
  landRecoverMs: number
  launchOnAnticipateEnd: boolean
  msSinceLand: number
}

export const ANTICIPATE_MS = 52
export const LAND_RECOVER_MS = 100
export const CHAIN_JUMP_WINDOW_MS = 160

export type PlayerMotionVisual = {
  scaleX: number
  scaleY: number
  rotation: number
  shouldLaunch: boolean
}

export type JumpStartResult = "anticipate" | "instant" | "blocked"

const TRI_POSE = {
  idle: { scaleX: 1, scaleY: 1, rotation: 0 },
} as const

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

function easeInQuad(t: number) {
  return t * t
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function makeVisual(
  scaleX: number,
  scaleY: number,
  rotation: number,
  shouldLaunch = false,
): PlayerMotionVisual {
  return { scaleX, scaleY, rotation, shouldLaunch }
}

/** Triangle loads weight into its base before takeoff. */
function getAnticipationPose(progress: number): PlayerMotionVisual {
  const eased = easeInQuad(progress)
  return makeVisual(
    lerp(1, 1.16, eased),
    lerp(1, 0.74, eased),
    lerp(0, -0.055, eased),
  )
}

/** Base widens and flattens on impact, then springs back. */
function getLandingPose(progress: number): PlayerMotionVisual {
  const eased = easeOutCubic(progress)
  const impact = 1 - eased
  return makeVisual(
    lerp(1, 1.22, impact),
    lerp(1, 0.72, impact),
    lerp(0, 0.04, impact * (1 - eased)),
  )
}

/** Point stretches up on launch; tip leads on the way down. */
function getAirborneTrianglePose(
  playerY: number,
  playerVy: number,
  maxJumpHeight: number,
): PlayerMotionVisual {
  const heightRatio = maxJumpHeight > 0 ? Math.min(1, playerY / maxJumpHeight) : 0
  const speed = Math.min(1, Math.abs(playerVy) / 12)
  const vyNorm = Math.max(-1, Math.min(1, playerVy / 12))

  const nearApex = Math.exp(-((playerVy / 2.4) ** 2)) * Math.min(1, heightRatio * 1.2 + 0.15)

  if (nearApex > 0.45 && Math.abs(playerVy) < 1.4) {
    return makeVisual(
      lerp(1, 1.04, nearApex),
      lerp(1, 0.95, nearApex),
      lerp(0, -0.025, nearApex),
    )
  }

  if (playerVy > 0.35) {
    const launchStrength = speed * (heightRatio < 0.3 ? 1 : 0.35)
    return makeVisual(
      lerp(1, 0.88, launchStrength),
      lerp(1, 1.2, launchStrength),
      lerp(0, -0.09, launchStrength * (0.6 + (1 - heightRatio) * 0.4)),
    )
  }

  if (playerVy < -0.35) {
    const fallStrength = speed * (0.55 + heightRatio * 0.45)
    const tipLead = lerp(0.1, 0.22, fallStrength)
    return makeVisual(
      lerp(1, 0.9, fallStrength * 0.7),
      lerp(1, 1.14, fallStrength),
      lerp(0, tipLead, fallStrength) * (playerVy < 0 ? 1 : -1),
    )
  }

  return makeVisual(1, 1, vyNorm * -0.03)
}

function resolvePlayerMotionPose(
  motion: PlayerMotionState,
  playerY: number,
  playerVy: number,
  maxJumpHeight: number,
  shouldLaunch = false,
): PlayerMotionVisual {
  if (motion.anticipateMs > 0) {
    const progress = 1 - motion.anticipateMs / ANTICIPATE_MS
    const pose = getAnticipationPose(progress)
    return { ...pose, shouldLaunch }
  }

  if (motion.landRecoverMs > 0) {
    const progress = 1 - motion.landRecoverMs / LAND_RECOVER_MS
    return getLandingPose(progress)
  }

  if (playerY > 0.5) {
    return getAirborneTrianglePose(playerY, playerVy, maxJumpHeight)
  }

  return { ...TRI_POSE.idle, shouldLaunch }
}

/** Read pose after physics without advancing anticipation or landing timers. */
export function getPlayerMotionPose(
  motion: PlayerMotionState,
  playerY: number,
  playerVy: number,
  maxJumpHeight: number,
): PlayerMotionVisual {
  return resolvePlayerMotionPose(motion, playerY, playerVy, maxJumpHeight)
}

export function updatePlayerMotionVisual(
  motion: PlayerMotionState,
  dtMs: number,
  playerY: number,
  playerVy: number,
  maxJumpHeight: number,
): PlayerMotionVisual {
  let shouldLaunch = false

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

  return resolvePlayerMotionPose(motion, playerY, playerVy, maxJumpHeight, shouldLaunch)
}

export function getDescentGravity(baseGravity: number, playerVy: number): number {
  if (playerVy >= 0) return baseGravity
  const fallSpeed = Math.min(1, Math.abs(playerVy) / 12)
  return baseGravity * (0.88 + fallSpeed * 0.24)
}

export function getApexGravityMultiplier(playerVy: number, heightRatio: number): number {
  if (playerVy <= 0) return 1
  const nearApex = Math.exp(-((playerVy / 3.2) ** 2))
  const highEnough = Math.min(1, heightRatio * 1.1)
  return 1 - nearApex * highEnough * 0.32
}
