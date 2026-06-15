"use client"

import { ArrowLeft, Maximize2, Minimize2, RotateCcw } from "lucide-react"
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { useWebHaptics } from "web-haptics/react"

import {
  MONOGRAM_ACCENT,
  MONOGRAM_MAIN,
} from "@/lib/brand/monogram-mark"
import {
  readCanvasThemeColors,
  syncCanvasSize,
  type CanvasThemeColors,
} from "@/lib/brand/runner-canvas-theme"
import {
  getNextObstacleGap,
  getScore,
  getTargetSpeed,
  INITIAL_SPEED,
  lerpSpeed,
} from "@/lib/brand/runner-difficulty"
import {
  createParticlePool,
  drawParticles,
  getScoreEffectTier,
  initAmbientParticles,
  resetParticlePool,
  spawnLandingPuff,
  spawnScoreTierBurst,
  updateParticles,
} from "@/lib/brand/runner-particles"
import {
  drawMilestoneObstacles,
  ensureMilestoneIcons,
  getIconResolutionTier,
  getMilestoneById,
  getMilestoneByIndex,
  getMilestoneIndex,
  type IconResolutionTier,
  type MilestoneId,
} from "@/lib/brand/runner-milestones"
import {
  advanceGroundedTime,
  beginJump,
  createPlayerMotionState,
  getApexGravityMultiplier,
  getDescentGravity,
  resetPlayerMotionState,
  triggerLandRecovery,
  updatePlayerMotionVisual,
} from "@/lib/brand/runner-player-motion"
import {
  createRunnerHapticsController,
  type RunnerHapticsController,
} from "@/lib/brand/runner-haptics"
import {
  recordRunnerHighScore,
} from "@/lib/brand/runner-high-score"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const GRAVITY = 0.72
const GRAVITY_HOLD = 0.26
const JUMP_VELOCITY = 12
const COYOTE_MS = 90
const JUMP_BUFFER_MS = 130
const GROUND_PADDING = 12
const PLAYER_HEIGHT_RATIO = 0.18
const FULLSCREEN_PLAYER_HEIGHT_RATIO = 0.12
const FULLSCREEN_PLAYER_MAX_HEIGHT = 88
const MAX_JUMP_HEIGHT_RATIO = 0.58
const HEADROOM_JUMP_RATIO = 0.68
const MAX_JUMP_TOP_PADDING = 5
const MIN_JUMP_HEIGHT = 70
const OBSTACLE_WIDTH = 44
const OBSTACLE_HEIGHT_SHORT = 40
const OBSTACLE_HEIGHT_TALL = 58
const BASELINE_PLAYER_HEIGHT = 48
const COLOR_CACHE_FRAMES = 30
const SCORE_SYNC_MS = 250

type Obstacle = {
  x: number
  width: number
  height: number
  milestoneId: MilestoneId
  cleared: boolean
}

type GamePhase = "running" | "gameOver"

type GameState = {
  phase: GamePhase
  playerY: number
  playerVy: number
  obstacles: Obstacle[]
  distance: number
  speed: number
  nextObstacleIn: number
  maxMilestoneIndex: number
}

type GameOverState = {
  score: number
  highScore: number
  isNewHighScore: boolean
  milestoneLabel: string
  milestoneTagline: string
}

function getInitialUpcomingLabels() {
  const milestone = getMilestoneByIndex(0)
  return { label: milestone.label, shortLabel: milestone.shortLabel }
}

function createInitialState(width: number): GameState {
  return {
    phase: "running",
    playerY: 0,
    playerVy: 0,
    obstacles: [],
    distance: 0,
    speed: INITIAL_SPEED,
    nextObstacleIn: width * 0.6,
    maxMilestoneIndex: 0,
  }
}

function spawnObstacle(width: number, distance: number, layoutScale: number): Obstacle {
  const milestoneIndex = getMilestoneIndex(distance)
  const milestone = getMilestoneByIndex(milestoneIndex)
  const tall = Math.random() > 0.65
  const obstacleHeight = tall ? OBSTACLE_HEIGHT_TALL : OBSTACLE_HEIGHT_SHORT

  return {
    x: width + OBSTACLE_WIDTH * layoutScale,
    width: OBSTACLE_WIDTH,
    height: obstacleHeight,
    milestoneId: milestone.id,
    cleared: false,
  }
}

function getLayoutScale(playerHeight: number) {
  return playerHeight / BASELINE_PLAYER_HEIGHT
}

function getObstacleSize(
  obstacle: Obstacle,
  layoutScale: number,
): { width: number; height: number } {
  return {
    width: obstacle.width * layoutScale,
    height: obstacle.height * layoutScale,
  }
}

function advanceObstacles(
  obstacles: Obstacle[],
  speed: number,
  dt: number,
  layoutScale: number,
) {
  let writeIndex = 0
  for (let i = 0; i < obstacles.length; i += 1) {
    const obstacle = obstacles[i]
    obstacle.x -= speed * dt
    const { width: obstacleWidth } = getObstacleSize(obstacle, layoutScale)
    if (obstacle.x + obstacleWidth > 0) {
      obstacles[writeIndex] = obstacle
      writeIndex += 1
    }
  }
  obstacles.length = writeIndex
}

function findNextUnclearedObstacleAhead(
  obstacles: Obstacle[],
  playerPassX: number,
  layoutScale: number,
): Obstacle | null {
  let candidate: Obstacle | null = null

  for (const obstacle of obstacles) {
    if (obstacle.cleared) continue
    const { width: obstacleWidth } = getObstacleSize(obstacle, layoutScale)
    if (obstacle.x + obstacleWidth < playerPassX) continue

    if (!candidate || obstacle.x < candidate.x) {
      candidate = obstacle
    }
  }

  return candidate
}

function getUpcomingObstacleLabels(
  state: GameState,
  playerPassX: number,
  layoutScale: number,
): { label: string; shortLabel: string } {
  const next = findNextUnclearedObstacleAhead(state.obstacles, playerPassX, layoutScale)
  const milestone = next
    ? getMilestoneById(next.milestoneId)
    : getMilestoneByIndex(getMilestoneIndex(state.distance))

  return { label: milestone.label, shortLabel: milestone.shortLabel }
}

function getPlayerHeightForContainer(height: number, fullscreen: boolean) {
  return fullscreen
    ? Math.max(40, Math.min(FULLSCREEN_PLAYER_MAX_HEIGHT, height * FULLSCREEN_PLAYER_HEIGHT_RATIO))
    : Math.max(28, Math.min(48, height * PLAYER_HEIGHT_RATIO))
}

function rectsOverlap(
  a: { x: number; y: number; w: number; h: number },
  b: { x: number; y: number; w: number; h: number },
) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  )
}

type MonogramRunnerGameProps = {
  onExit: () => void
  className?: string
}

export function MonogramRunnerGame({ onExit, className }: MonogramRunnerGameProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef<GameState>(createInitialState(800))
  const rafRef = useRef<number>(0)
  const mainPathRef = useRef<Path2D | null>(null)
  const accentPathRef = useRef<Path2D | null>(null)
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 })
  const jumpHeldRef = useRef(false)
  const jumpBufferRef = useRef(0)
  const coyoteTimeRef = useRef(0)
  const uiPhaseRef = useRef<GamePhase>("running")
  const milestoneIconsRef = useRef<Map<MilestoneId, HTMLCanvasElement>>(new Map())
  const iconColorRef = useRef<string | null>(null)
  const lastEffectTierRef = useRef(0)
  const particlePoolRef = useRef(createParticlePool())
  const playerMotionRef = useRef(createPlayerMotionState())
  const colorsCacheRef = useRef<CanvasThemeColors | null>(null)
  const colorFrameRef = useRef(0)
  const tabVisibleRef = useRef(true)
  const isFullscreenRef = useRef(false)
  const displayScoreRef = useRef(0)
  const lastUpcomingLabelRef = useRef("")
  const lastUpcomingShortLabelRef = useRef("")
  const iconTierRef = useRef<IconResolutionTier>("normal")
  const setUpcomingObstacleLabelRef = useRef<(label: string) => void>(() => {})
  const setUpcomingObstacleShortLabelRef = useRef<(label: string) => void>(() => {})
  const setDisplayScoreRef = useRef<(score: number) => void>(() => {})
  const [gameOverState, setGameOverState] = useState<GameOverState | null>(null)
  const [displayScore, setDisplayScore] = useState(0)
  const [upcomingObstacleLabel, setUpcomingObstacleLabel] = useState(
    () => getInitialUpcomingLabels().label,
  )
  const [upcomingObstacleShortLabel, setUpcomingObstacleShortLabel] = useState(
    () => getInitialUpcomingLabels().shortLabel,
  )
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [canFullscreen, setCanFullscreen] = useState(false)
  const { trigger, isSupported } = useWebHaptics()
  const hapticsRef = useRef<RunnerHapticsController>(createRunnerHapticsController())
  hapticsRef.current.bind(trigger, isSupported)
  setUpcomingObstacleLabelRef.current = setUpcomingObstacleLabel
  setUpcomingObstacleShortLabelRef.current = setUpcomingObstacleShortLabel
  setDisplayScoreRef.current = setDisplayScore

  const syncUpcomingObstacleLabels = useCallback((label: string, shortLabel: string) => {
    if (label !== lastUpcomingLabelRef.current) {
      lastUpcomingLabelRef.current = label
      setUpcomingObstacleLabelRef.current(label)
    }
    if (shortLabel !== lastUpcomingShortLabelRef.current) {
      lastUpcomingShortLabelRef.current = shortLabel
      setUpcomingObstacleShortLabelRef.current(shortLabel)
    }
  }, [])
  const syncUpcomingObstacleLabelsRef = useRef(syncUpcomingObstacleLabels)
  syncUpcomingObstacleLabelsRef.current = syncUpcomingObstacleLabels

  const restart = useCallback(() => {
    stateRef.current = createInitialState(sizeRef.current.width)
    jumpHeldRef.current = false
    jumpBufferRef.current = 0
    coyoteTimeRef.current = 0
    uiPhaseRef.current = "running"
    lastEffectTierRef.current = 0
    resetParticlePool(particlePoolRef.current)
    resetPlayerMotionState(playerMotionRef.current)
    displayScoreRef.current = 0
    setDisplayScore(0)
    const initialLabels = getInitialUpcomingLabels()
    lastUpcomingLabelRef.current = initialLabels.label
    lastUpcomingShortLabelRef.current = initialLabels.shortLabel
    setUpcomingObstacleLabel(initialLabels.label)
    setUpcomingObstacleShortLabel(initialLabels.shortLabel)
    setGameOverState(null)
    hapticsRef.current.reset()
    hapticsRef.current.restart()
  }, [])

  const launchJump = useCallback(() => {
    const result = beginJump(playerMotionRef.current)
    if (result === "instant") {
      stateRef.current.playerVy = JUMP_VELOCITY
      hapticsRef.current.jumpInstant()
    } else if (result === "anticipate") {
      hapticsRef.current.jumpAnticipate()
    }
    return result !== "blocked"
  }, [])

  const canJumpNow = useCallback((state: GameState, coyoteMs: number) => {
    if (state.phase !== "running") return false
    const grounded = state.playerY <= 0.5 && state.playerVy <= 0
    const coyote = coyoteMs > 0 && state.playerVy <= 0.5
    return grounded || coyote
  }, [])

  const startJump = useCallback(() => {
    const state = stateRef.current
    if (state.phase === "gameOver") {
      restart()
      return
    }
    if (canJumpNow(state, coyoteTimeRef.current)) {
      launchJump()
    } else {
      jumpBufferRef.current = JUMP_BUFFER_MS
    }
  }, [canJumpNow, launchJump, restart])

  const setJumpHeld = useCallback((held: boolean) => {
    jumpHeldRef.current = held
  }, [])

  const exit = useCallback(async () => {
    const container = containerRef.current
    const doc = document as Document & {
      webkitFullscreenElement?: Element | null
      webkitExitFullscreen?: () => Promise<void>
    }
    const activeElement = doc.fullscreenElement ?? doc.webkitFullscreenElement
    if (container && activeElement === container) {
      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen()
        } else {
          await doc.webkitExitFullscreen?.()
        }
      } catch {
        // Continue exiting the game even if fullscreen fails to close.
      }
    }
    onExit()
  }, [onExit])

  const toggleFullscreen = useCallback(async () => {
    const container = containerRef.current
    if (!container) return

    try {
      const doc = document as Document & {
        webkitFullscreenElement?: Element | null
        webkitExitFullscreen?: () => Promise<void>
      }
      const activeElement = doc.fullscreenElement ?? doc.webkitFullscreenElement

      if (activeElement === container) {
        if (document.exitFullscreen) {
          await document.exitFullscreen()
        } else {
          await doc.webkitExitFullscreen?.()
        }
        return
      }

      if (container.requestFullscreen) {
        await container.requestFullscreen()
        return
      }

      const containerWithWebkit = container as HTMLDivElement & {
        webkitRequestFullscreen?: () => Promise<void>
      }
      await containerWithWebkit.webkitRequestFullscreen?.()
    } catch {
      // Fullscreen can fail if the browser blocks the request.
    }
  }, [])

  useEffect(() => {
    isFullscreenRef.current = isFullscreen
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const size = syncCanvasSize(canvas, container)
    sizeRef.current = size
    const playerHeight = getPlayerHeightForContainer(size.height, isFullscreen)
    const layoutScale = getLayoutScale(playerHeight)
    const colors = readCanvasThemeColors(container)
    void ensureMilestoneIcons(colors.foreground, layoutScale, size.dpr).then((icons) => {
      milestoneIconsRef.current = icons
      iconColorRef.current = colors.foreground
      iconTierRef.current = getIconResolutionTier(layoutScale)
    })
  }, [isFullscreen])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const doc = document as Document & {
      webkitFullscreenElement?: Element | null
    }

    const syncFullscreen = () => {
      const activeElement = doc.fullscreenElement ?? doc.webkitFullscreenElement
      setIsFullscreen(activeElement === container)
    }

    setCanFullscreen(
      typeof container.requestFullscreen === "function" ||
        typeof (container as HTMLDivElement & { webkitRequestFullscreen?: () => void })
          .webkitRequestFullscreen === "function",
    )

    document.addEventListener("fullscreenchange", syncFullscreen)
    document.addEventListener("webkitfullscreenchange", syncFullscreen)
    syncFullscreen()

    return () => {
      document.removeEventListener("fullscreenchange", syncFullscreen)
      document.removeEventListener("webkitfullscreenchange", syncFullscreen)
    }
  }, [])

  useLayoutEffect(() => {
    mainPathRef.current = new Path2D(MONOGRAM_MAIN)
    accentPathRef.current = new Path2D(MONOGRAM_ACCENT)
    containerRef.current?.focus()
  }, [])

  useLayoutEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let iconsReady = false
    let active = true
    let lastTime = performance.now()
    let wasAirborne = false

    let lastScoreSyncTime = 0

    const readColors = (): CanvasThemeColors => {
      colorFrameRef.current += 1
      if (!colorsCacheRef.current || colorFrameRef.current >= COLOR_CACHE_FRAMES) {
        colorsCacheRef.current = readCanvasThemeColors(container)
        colorFrameRef.current = 0
      }
      return colorsCacheRef.current
    }

    const ensureIcons = async (color: string, layoutScale: number, dpr: number) => {
      const tier = getIconResolutionTier(layoutScale)
      if (iconsReady && iconColorRef.current === color && iconTierRef.current === tier) return
      try {
        const icons = await ensureMilestoneIcons(color, layoutScale, dpr)
        if (!active) return
        milestoneIconsRef.current = icons
        iconColorRef.current = color
        iconTierRef.current = tier
        iconsReady = true
      } catch {
        // Icons are optional; labels still render.
      }
    }

    const resize = () => {
      const size = syncCanvasSize(canvas, container)
      sizeRef.current = size
      colorsCacheRef.current = readCanvasThemeColors(container)
      colorFrameRef.current = 0
      const colors = colorsCacheRef.current
      const playerHeight = getPlayerHeightForContainer(size.height, isFullscreenRef.current)
      const layoutScale = getLayoutScale(playerHeight)
      iconsReady = false
      void ensureIcons(colors.foreground, layoutScale, size.dpr)
    }

    resize()
    stateRef.current = createInitialState(sizeRef.current.width)
    uiPhaseRef.current = "running"
    lastEffectTierRef.current = 0
    resetParticlePool(particlePoolRef.current)
    resetPlayerMotionState(playerMotionRef.current)
    jumpBufferRef.current = 0
    coyoteTimeRef.current = COYOTE_MS
    displayScoreRef.current = 0
    lastScoreSyncTime = 0
    setDisplayScoreRef.current(0)
    const initialLabels = getInitialUpcomingLabels()
    lastUpcomingLabelRef.current = initialLabels.label
    lastUpcomingShortLabelRef.current = initialLabels.shortLabel
    syncUpcomingObstacleLabelsRef.current(initialLabels.label, initialLabels.shortLabel)
    setGameOverState(null)
    void ensureIcons(
      readColors().foreground,
      getLayoutScale(getPlayerHeightForContainer(sizeRef.current.height, isFullscreenRef.current)),
      sizeRef.current.dpr,
    )
    const initialColors = readColors()
    initAmbientParticles(
      particlePoolRef.current,
      sizeRef.current.width,
      sizeRef.current.height,
      INITIAL_SPEED,
      initialColors.foreground,
      0,
      {
        foreground: initialColors.foreground,
        muted: initialColors.muted,
        primary: initialColors.primary,
      },
    )

    const observer = new ResizeObserver(resize)
    observer.observe(container)

    const tick = (time: number) => {
      if (!active || !tabVisibleRef.current) return

      try {
        const dt = Math.min((time - lastTime) / 16.67, 2.5)
        lastTime = time

        let { width, height } = sizeRef.current
        if (width <= 0 || height <= 0) {
          const size = syncCanvasSize(canvas, container)
          sizeRef.current = size
          width = size.width
          height = size.height
        }

        if (width <= 0 || height <= 0) {
          rafRef.current = requestAnimationFrame(tick)
          return
        }

        const groundY = height - GROUND_PADDING
        const playerHeight = getPlayerHeightForContainer(height, isFullscreenRef.current)
        const layoutScale = getLayoutScale(playerHeight)
        const jumpHeadroom = groundY - playerHeight - MAX_JUMP_TOP_PADDING
        const maxJumpHeight = Math.max(
          MIN_JUMP_HEIGHT,
          Math.min(height * MAX_JUMP_HEIGHT_RATIO, jumpHeadroom * HEADROOM_JUMP_RATIO),
        )
        const playerX = width * 0.1
        const scale = playerHeight / 153
        const playerWidth = 205 * scale
        const state = stateRef.current
        const colors = readColors()
        const particleColors = {
          foreground: colors.foreground,
          muted: colors.muted,
          primary: colors.primary,
        }

        let playerScaleX = 1
        let playerScaleY = 1
        let playerRotation = 0

        if (state.phase === "running") {
          const targetSpeed = getTargetSpeed(state.distance)
          state.speed = lerpSpeed(state.speed, targetSpeed, dt)
          state.distance += state.speed * dt

          const currentMilestoneIndex = getMilestoneIndex(state.distance)
          if (currentMilestoneIndex > state.maxMilestoneIndex) {
            state.maxMilestoneIndex = currentMilestoneIndex
          }

          const score = getScore(state.distance)
          const scoreValue = Math.floor(state.distance / 10)
          if (scoreValue !== displayScoreRef.current) {
            displayScoreRef.current = scoreValue
            if (time - lastScoreSyncTime >= SCORE_SYNC_MS) {
              lastScoreSyncTime = time
              setDisplayScoreRef.current(scoreValue)
            }
          }

          const effectTier = getScoreEffectTier(score)
          if (effectTier > lastEffectTierRef.current) {
            lastEffectTierRef.current = effectTier
            hapticsRef.current.scoreTier(time)
            spawnScoreTierBurst(
              particlePoolRef.current,
              effectTier,
              width,
              height,
              state.speed,
              particleColors,
            )
          }

          const dtMs = dt * 16.67
          const onGround = state.playerY <= 0.5 && state.playerVy <= 0

          if (onGround) {
            coyoteTimeRef.current = COYOTE_MS
          } else {
            coyoteTimeRef.current = Math.max(0, coyoteTimeRef.current - dtMs)
          }

          advanceGroundedTime(playerMotionRef.current, dtMs, onGround)

          if (jumpBufferRef.current > 0) {
            jumpBufferRef.current = Math.max(0, jumpBufferRef.current - dtMs)
            const bufferedGrounded = state.playerY <= 0.5 && state.playerVy <= 0
            const bufferedCoyote = coyoteTimeRef.current > 0 && state.playerVy <= 0.5
            if (
              jumpBufferRef.current > 0 &&
              (bufferedGrounded || bufferedCoyote) &&
              playerMotionRef.current.anticipateMs <= 0
            ) {
              const bufferedResult = beginJump(playerMotionRef.current)
              if (bufferedResult === "instant") {
                state.playerVy = JUMP_VELOCITY
                hapticsRef.current.jumpInstant()
                jumpBufferRef.current = 0
              } else if (bufferedResult === "anticipate") {
                hapticsRef.current.jumpAnticipate()
                jumpBufferRef.current = 0
              }
            }
          }

          const motion = updatePlayerMotionVisual(
            playerMotionRef.current,
            dtMs,
            state.playerY,
            state.playerVy,
            maxJumpHeight,
          )

          if (motion.shouldLaunch) {
            state.playerVy = JUMP_VELOCITY
          }

          const isAnticipating = playerMotionRef.current.anticipateMs > 0

          if (!isAnticipating) {
            const baseGravity =
              jumpHeldRef.current && state.playerVy > 0 ? GRAVITY_HOLD : GRAVITY
            let gravity =
              state.playerVy < 0 ? getDescentGravity(baseGravity, state.playerVy) : baseGravity

            if (state.playerVy > 0) {
              const heightRatio = maxJumpHeight > 0 ? state.playerY / maxJumpHeight : 0
              gravity *= getApexGravityMultiplier(state.playerVy, heightRatio)
            }

            state.playerVy -= gravity * dt
            state.playerY += state.playerVy * dt
          } else {
            state.playerY = 0
            state.playerVy = 0
          }

          if (state.playerY <= 0) {
            if (wasAirborne) {
              hapticsRef.current.land(time)
              triggerLandRecovery(playerMotionRef.current)
              spawnLandingPuff(
                particlePoolRef.current,
                playerX + playerWidth * 0.35,
                groundY,
                colors.foreground,
              )
              wasAirborne = false
            }
            state.playerY = 0
            if (!isAnticipating) {
              state.playerVy = 0
            }
          } else {
            wasAirborne = true
            if (state.playerY >= maxJumpHeight) {
              state.playerY = maxJumpHeight
              state.playerVy = Math.min(state.playerVy, 0)
            }
          }

          const playerMotion = updatePlayerMotionVisual(
            playerMotionRef.current,
            0,
            state.playerY,
            state.playerVy,
            maxJumpHeight,
          )
          playerScaleX = playerMotion.scaleX
          playerScaleY = playerMotion.scaleY
          playerRotation = playerMotion.rotation

          const hitboxInset = 6 * layoutScale
          const playerPassX = playerX + hitboxInset

          state.nextObstacleIn -= state.speed * dt
          if (state.nextObstacleIn <= 0) {
            state.obstacles.push(spawnObstacle(width, state.distance, layoutScale))
            state.nextObstacleIn = getNextObstacleGap(state.speed) * layoutScale
            const spawnedLabels = getUpcomingObstacleLabels(state, playerPassX, layoutScale)
            syncUpcomingObstacleLabelsRef.current(
              spawnedLabels.label,
              spawnedLabels.shortLabel,
            )
          }

          advanceObstacles(state.obstacles, state.speed, dt, layoutScale)

          let clearedAnyObstacle = false
          for (const obstacle of state.obstacles) {
            if (obstacle.cleared) continue
            const { width: obstacleWidth } = getObstacleSize(obstacle, layoutScale)
            if (obstacle.x + obstacleWidth < playerPassX) {
              obstacle.cleared = true
              clearedAnyObstacle = true
            }
          }

          if (clearedAnyObstacle) {
            hapticsRef.current.milestone(time)
            const nextObstacle = findNextUnclearedObstacleAhead(
              state.obstacles,
              playerPassX,
              layoutScale,
            )
            if (nextObstacle) {
              const milestone = getMilestoneById(nextObstacle.milestoneId)
              syncUpcomingObstacleLabelsRef.current(milestone.label, milestone.shortLabel)
            }
          }

          const playerBox = {
            x: playerPassX,
            y: groundY - playerHeight + hitboxInset - state.playerY,
            w: playerWidth - hitboxInset * 2,
            h: playerHeight - hitboxInset * 2,
          }

          for (const obstacle of state.obstacles) {
            const { width: obstacleWidth, height: obstacleHeight } = getObstacleSize(
              obstacle,
              layoutScale,
            )
            const obstacleBox = {
              x: obstacle.x,
              y: groundY - obstacleHeight,
              w: obstacleWidth,
              h: obstacleHeight,
            }
            if (rectsOverlap(playerBox, obstacleBox)) {
              state.phase = "gameOver"
              if (uiPhaseRef.current !== "gameOver") {
                uiPhaseRef.current = "gameOver"
                const milestone = getMilestoneByIndex(state.maxMilestoneIndex)
                const finalScore = Math.floor(state.distance / 10)
                const { highScore, isNewHighScore } = recordRunnerHighScore(finalScore)
                displayScoreRef.current = finalScore
                setDisplayScoreRef.current(finalScore)
                setGameOverState({
                  score: finalScore,
                  highScore,
                  isNewHighScore,
                  milestoneLabel: milestone.label,
                  milestoneTagline: milestone.tagline,
                })
                hapticsRef.current.gameOver(isNewHighScore)
              }
              break
            }
          }

          updateParticles(
            particlePoolRef.current,
            dt,
            state.speed,
            width,
            height,
            particleColors,
            effectTier,
            true,
          )
        } else {
          const score = getScore(state.distance)
          updateParticles(
            particlePoolRef.current,
            dt,
            state.speed,
            width,
            height,
            particleColors,
            getScoreEffectTier(score),
            false,
          )
        }

        ctx.clearRect(0, 0, width, height)

        ctx.fillStyle = colors.background
        ctx.fillRect(0, 0, width, height)

        drawParticles(ctx, particlePoolRef.current)

        ctx.strokeStyle = colors.foreground
        ctx.globalAlpha = 0.35
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(0, groundY + 0.5)
        ctx.lineTo(width, groundY + 0.5)
        ctx.stroke()
        ctx.globalAlpha = 1

        drawMilestoneObstacles(
          ctx,
          state.obstacles,
          groundY,
          colors.foreground,
          milestoneIconsRef.current,
          layoutScale,
        )

        const mainPath = mainPathRef.current
        const accentPath = accentPathRef.current
        if (mainPath && accentPath) {
          const drawY = groundY - playerHeight - state.playerY
          const feetY = groundY - state.playerY
          const pivotX = playerX + playerWidth * 0.42

          ctx.save()
          ctx.translate(pivotX, feetY)
          ctx.rotate(playerRotation)
          ctx.scale(playerScaleX, playerScaleY)
          ctx.translate(-pivotX, -feetY)
          ctx.translate(playerX, drawY)
          ctx.scale(scale, scale)
          ctx.translate(64, 0)
          ctx.fillStyle = colors.foreground
          ctx.fill(mainPath)
          ctx.fill(accentPath)
          ctx.restore()
        }
      } catch {
        // Keep the loop alive even if a frame fails.
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    const onVisibilityChange = () => {
      tabVisibleRef.current = document.visibilityState === "visible"
      if (tabVisibleRef.current && active) {
        lastTime = performance.now()
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    document.addEventListener("visibilitychange", onVisibilityChange)

    return () => {
      active = false
      document.removeEventListener("visibilitychange", onVisibilityChange)
      observer.disconnect()
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        const doc = document as Document & {
          webkitFullscreenElement?: Element | null
        }
        if (doc.fullscreenElement ?? doc.webkitFullscreenElement) {
          return
        }
        event.preventDefault()
        exit()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [exit])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== " " && event.key !== "ArrowUp") return
      event.preventDefault()
      setJumpHeld(true)
      if (!event.repeat) {
        startJump()
      }
    }

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === " " || event.key === "ArrowUp") {
        setJumpHeld(false)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
    }
  }, [setJumpHeld, startJump])

  return (
    <div
      ref={containerRef}
      role="application"
      aria-label="Monogram runner game"
      tabIndex={0}
      className={cn(
        "relative size-full w-full cursor-pointer overflow-hidden rounded-lg border border-border/60 bg-background text-foreground outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isFullscreen &&
          "fixed inset-0 z-[100] h-screen w-screen max-w-none rounded-none border-0 shadow-none",
        className,
      )}
      onPointerDown={(event) => {
        if ((event.target as HTMLElement).closest("[data-runner-ui]")) return
        event.preventDefault()
        containerRef.current?.focus()
        setJumpHeld(true)
        startJump()
      }}
      onPointerUp={() => setJumpHeld(false)}
      onPointerLeave={() => setJumpHeld(false)}
      onPointerCancel={() => setJumpHeld(false)}
    >
      <div
        data-runner-ui
        className={cn(
          "absolute start-2 top-2 z-10 flex max-w-[min(100%,24rem)] flex-nowrap items-center gap-2",
          isFullscreen && "start-4 top-4 gap-3",
        )}
      >
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 shrink-0 gap-1 bg-background/90 px-2 text-xs shadow-sm backdrop-blur-sm"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation()
            exit()
          }}
          aria-label="Exit monogram runner game"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          Back
        </Button>

        {!gameOverState ? (
          <div className="pointer-events-none min-w-0 leading-tight" aria-live="polite">
            <p className="truncate text-[10px] font-medium text-foreground/70">
              {upcomingObstacleLabel}
            </p>
          </div>
        ) : null}
      </div>

      <div
        data-runner-ui
        className={cn(
          "absolute top-2 end-2 z-10 flex flex-col items-end gap-1",
          isFullscreen && "top-4 end-4",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-1.5 rounded-md border border-border/60 bg-background/90 px-2 py-1 shadow-sm backdrop-blur-sm",
            isFullscreen && "gap-2 px-3 py-1.5",
          )}
        >
          <div className="flex flex-col items-end leading-none">
            <span
              className={cn(
                "pointer-events-none font-mono text-xs tabular-nums text-foreground/80",
                isFullscreen && "text-sm text-foreground",
              )}
              aria-live="polite"
              aria-label={`Score ${displayScore}`}
            >
              {String(displayScore).padStart(5, "0")}
            </span>
            <span
              className={cn(
                "pointer-events-none mt-0.5 text-[10px] font-medium text-muted-foreground",
                isFullscreen && "text-[11px]",
              )}
            >
              {upcomingObstacleShortLabel}
            </span>
          </div>
          {canFullscreen ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-6 shrink-0 text-foreground/80 hover:text-foreground"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation()
                void toggleFullscreen()
              }}
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 className="size-3.5" aria-hidden />
              ) : (
                <Maximize2 className="size-3.5" aria-hidden />
              )}
            </Button>
          ) : null}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 block h-full w-full touch-none"
        aria-hidden
      />

      {gameOverState !== null ? (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 p-3 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="runner-game-over-title"
        >
          <div className="w-full max-w-[18rem] rounded-xl border border-border bg-card p-4 text-card-foreground shadow-lg ring-1 ring-foreground/10">
            <div className="space-y-1 text-center">
              <p
                id="runner-game-over-title"
                className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
              >
                Game over
              </p>
              <p className="text-3xl font-semibold tabular-nums tracking-tight text-foreground">
                {gameOverState.score}
              </p>
              <p className="text-xs text-muted-foreground">points</p>
              {gameOverState.isNewHighScore ? (
                <p className="text-xs font-semibold text-primary">New high score!</p>
              ) : gameOverState.highScore > 0 ? (
                <p className="text-xs text-muted-foreground">
                  High score ·{" "}
                  <span className="font-medium tabular-nums text-foreground">
                    {gameOverState.highScore}
                  </span>
                </p>
              ) : null}
              <p className="text-sm font-medium text-foreground">
                Made it to: {gameOverState.milestoneLabel}
              </p>
              <p className="text-xs italic text-muted-foreground">
                {gameOverState.milestoneTagline}
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <Button
                type="button"
                size="sm"
                className="w-full"
                data-runner-ui
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation()
                  restart()
                }}
              >
                <RotateCcw className="size-3.5" aria-hidden />
                Play again
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full"
                data-runner-ui
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation()
                  exit()
                }}
              >
                Exit
              </Button>
            </div>

            <p className="mt-3 text-center text-[11px] leading-relaxed text-muted-foreground">
              Or press Space · tap anywhere to retry
            </p>
          </div>
        </div>
      ) : null}

      <span className="sr-only">
        Press and hold space or tap and hold to jump higher. Press escape or the back button to exit.
      </span>
    </div>
  )
}
