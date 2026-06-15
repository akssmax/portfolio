type HapticTrigger = (
  input?:
    | string
    | number
    | number[]
    | Array<{ duration: number; delay?: number; intensity?: number }>,
  options?: { intensity?: number },
) => Promise<void> | void

const MOBILE_INTENSITY = 0.38
const DESKTOP_INTENSITY = 0.62
const LAND_MIN_INTERVAL_MS = 300
const SCORE_TIER_AFTER_MILESTONE_MS = 450

function isMobileHapticsDevice() {
  if (typeof window === "undefined") return true
  return window.matchMedia("(pointer: coarse)").matches
}

function intensityScale() {
  return isMobileHapticsDevice() ? MOBILE_INTENSITY : DESKTOP_INTENSITY
}

function scaledIntensity(base: number) {
  return Math.min(1, base * intensityScale())
}

function tap(duration: number, baseIntensity: number) {
  return [{ duration, intensity: scaledIntensity(baseIntensity) }]
}

export function createRunnerHapticsController() {
  let trigger: HapticTrigger | null | undefined = null
  let isSupported = false
  let lastLandAt = 0
  let lastMilestoneAt = 0

  function play(
    pattern:
      | number
      | Array<{ duration: number; delay?: number; intensity?: number }>,
  ) {
    if (!isSupported || !trigger) return
    void trigger(pattern)
  }

  return {
    bind(nextTrigger: HapticTrigger | null | undefined, nextSupported: boolean) {
      trigger = nextTrigger
      isSupported = nextSupported
    },

    reset() {
      lastLandAt = 0
      lastMilestoneAt = 0
    },

    jumpInstant() {
      play(tap(10, 0.32))
    },

    jumpAnticipate() {
      if (isMobileHapticsDevice()) return
      play(tap(8, 0.22))
    },

    land(now = performance.now()) {
      if (now - lastLandAt < LAND_MIN_INTERVAL_MS) return
      lastLandAt = now
      play(tap(8, 0.18))
    },

    milestone(now = performance.now()) {
      lastMilestoneAt = now
      play(tap(42, 0.28))
    },

    scoreTier(now = performance.now()) {
      if (now - lastMilestoneAt < SCORE_TIER_AFTER_MILESTONE_MS) return
      play(tap(28, 0.2))
    },

    restart() {
      play([
        { duration: 32, intensity: scaledIntensity(0.3) },
        { delay: 45, duration: 28, intensity: scaledIntensity(0.22) },
      ])
    },

    gameOver(isNewHighScore: boolean) {
      if (isNewHighScore) {
        play([
          { duration: 38, intensity: scaledIntensity(0.32) },
          { delay: 55, duration: 32, intensity: scaledIntensity(0.26) },
        ])
        return
      }
      play(tap(36, 0.26))
    },
  }
}

export type RunnerHapticsController = ReturnType<typeof createRunnerHapticsController>
