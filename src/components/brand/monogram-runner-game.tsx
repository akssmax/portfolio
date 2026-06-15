"use client"

import { ArrowLeft, RotateCcw } from "lucide-react"
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
  drawMilestoneObstacle,
  getMilestoneByIndex,
  getMilestoneIndex,
  preloadMilestoneIcons,
  type MilestoneId,
} from "@/lib/brand/runner-milestones"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const GRAVITY = 0.72
const GRAVITY_HOLD = 0.28
const JUMP_VELOCITY = 10.5
const GROUND_PADDING = 12
const PLAYER_HEIGHT_RATIO = 0.18
const MAX_JUMP_HEIGHT_RATIO = 0.42
const OBSTACLE_WIDTH = 44
const COLOR_CACHE_FRAMES = 30

type Obstacle = {
  x: number
  width: number
  height: number
  milestoneId: MilestoneId
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
  milestoneLabel: string
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

function spawnObstacle(width: number, distance: number): Obstacle {
  const milestoneIndex = getMilestoneIndex(distance)
  const milestone = getMilestoneByIndex(milestoneIndex)
  const tall = Math.random() > 0.65
  const obstacleHeight = tall ? 58 : 40

  return {
    x: width + OBSTACLE_WIDTH,
    width: OBSTACLE_WIDTH,
    height: obstacleHeight,
    milestoneId: milestone.id,
  }
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
  const uiPhaseRef = useRef<GamePhase>("running")
  const milestoneIconsRef = useRef<Map<MilestoneId, HTMLCanvasElement>>(new Map())
  const iconColorRef = useRef<string | null>(null)
  const lastEffectTierRef = useRef(0)
  const particlePoolRef = useRef(createParticlePool())
  const colorsCacheRef = useRef<CanvasThemeColors | null>(null)
  const colorFrameRef = useRef(0)
  const tabVisibleRef = useRef(true)
  const [gameOverState, setGameOverState] = useState<GameOverState | null>(null)
  const { trigger, isSupported } = useWebHaptics()
  const triggerHapticRef = useRef(trigger)
  triggerHapticRef.current = trigger

  const playHaptic = useCallback(
    (
      input: Parameters<NonNullable<typeof trigger>>[0],
      options?: Parameters<NonNullable<typeof trigger>>[1],
    ) => {
      if (!isSupported) return
      void triggerHapticRef.current?.(input, options)
    },
    [isSupported],
  )
  const playHapticRef = useRef(playHaptic)
  playHapticRef.current = playHaptic

  const restart = useCallback(() => {
    stateRef.current = createInitialState(sizeRef.current.width)
    jumpHeldRef.current = false
    uiPhaseRef.current = "running"
    lastEffectTierRef.current = 0
    resetParticlePool(particlePoolRef.current)
    setGameOverState(null)
    playHaptic("success")
  }, [playHaptic])

  const startJump = useCallback(() => {
    const state = stateRef.current
    if (state.phase === "gameOver") {
      restart()
      return
    }
    if (state.playerY <= 0.5 && state.playerVy <= 0) {
      state.playerVy = JUMP_VELOCITY
      playHaptic(16, { intensity: 0.45 })
    }
  }, [playHaptic, restart])

  const setJumpHeld = useCallback((held: boolean) => {
    jumpHeldRef.current = held
  }, [])

  const exit = useCallback(() => {
    onExit()
  }, [onExit])

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

    const readColors = (): CanvasThemeColors => {
      colorFrameRef.current += 1
      if (!colorsCacheRef.current || colorFrameRef.current >= COLOR_CACHE_FRAMES) {
        colorsCacheRef.current = readCanvasThemeColors(container)
        colorFrameRef.current = 0
      }
      return colorsCacheRef.current
    }

    const ensureIcons = async (color: string) => {
      if (!active || (iconsReady && iconColorRef.current === color)) return
      try {
        const icons = await preloadMilestoneIcons(color)
        if (!active) return
        milestoneIconsRef.current = icons
        iconColorRef.current = color
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
      if (colors.foreground !== iconColorRef.current) {
        iconsReady = false
        void ensureIcons(colors.foreground)
      }
    }

    resize()
    stateRef.current = createInitialState(sizeRef.current.width)
    uiPhaseRef.current = "running"
    lastEffectTierRef.current = 0
    resetParticlePool(particlePoolRef.current)
    setGameOverState(null)
    void ensureIcons(readColors().foreground)
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
        const playerHeight = Math.max(28, Math.min(48, height * PLAYER_HEIGHT_RATIO))
        const maxJumpHeight = Math.min(
          height * MAX_JUMP_HEIGHT_RATIO,
          groundY - playerHeight - 8,
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

        if (state.phase === "running") {
          const targetSpeed = getTargetSpeed(state.distance)
          state.speed = lerpSpeed(state.speed, targetSpeed, dt)
          state.distance += state.speed * dt

          const currentMilestoneIndex = getMilestoneIndex(state.distance)
          if (currentMilestoneIndex > state.maxMilestoneIndex) {
            state.maxMilestoneIndex = currentMilestoneIndex
          }

          const score = getScore(state.distance)
          const effectTier = getScoreEffectTier(score)
          if (effectTier > lastEffectTierRef.current) {
            lastEffectTierRef.current = effectTier
            playHapticRef.current("nudge")
            spawnScoreTierBurst(
              particlePoolRef.current,
              effectTier,
              height,
              state.speed,
              particleColors,
            )
          }

          const gravity =
            jumpHeldRef.current && state.playerVy > 0 ? GRAVITY_HOLD : GRAVITY

          state.playerVy -= gravity * dt
          state.playerY += state.playerVy * dt

          if (state.playerY <= 0) {
            if (wasAirborne) {
              playHapticRef.current(10, { intensity: 0.28 })
              spawnLandingPuff(
                particlePoolRef.current,
                playerX + playerWidth * 0.35,
                groundY,
                colors.foreground,
              )
              wasAirborne = false
            }
            state.playerY = 0
            state.playerVy = 0
          } else {
            wasAirborne = true
            if (state.playerY >= maxJumpHeight) {
              state.playerY = maxJumpHeight
              state.playerVy = Math.min(state.playerVy, 0)
            }
          }

          state.nextObstacleIn -= state.speed * dt
          if (state.nextObstacleIn <= 0) {
            state.obstacles.push(spawnObstacle(width, state.distance))
            state.nextObstacleIn = getNextObstacleGap(state.speed)
          }

          state.obstacles = state.obstacles
            .map((obstacle) => ({ ...obstacle, x: obstacle.x - state.speed * dt }))
            .filter((obstacle) => obstacle.x + obstacle.width > 0)

          const hitboxInset = 6
          const playerBox = {
            x: playerX + hitboxInset,
            y: groundY - playerHeight + hitboxInset - state.playerY,
            w: playerWidth - hitboxInset * 2,
            h: playerHeight - hitboxInset * 2,
          }

          for (const obstacle of state.obstacles) {
            const obstacleBox = {
              x: obstacle.x,
              y: groundY - obstacle.height,
              w: obstacle.width,
              h: obstacle.height,
            }
            if (rectsOverlap(playerBox, obstacleBox)) {
              state.phase = "gameOver"
              if (uiPhaseRef.current !== "gameOver") {
                uiPhaseRef.current = "gameOver"
                const milestone = getMilestoneByIndex(state.maxMilestoneIndex)
                setGameOverState({
                  score: Math.floor(state.distance / 10),
                  milestoneLabel: milestone.label,
                })
                playHapticRef.current("error")
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

        for (const obstacle of state.obstacles) {
          drawMilestoneObstacle(
            ctx,
            obstacle,
            groundY,
            colors.foreground,
            milestoneIconsRef.current,
          )
        }

        const mainPath = mainPathRef.current
        const accentPath = accentPathRef.current
        if (mainPath && accentPath) {
          ctx.save()
          ctx.translate(playerX, groundY - playerHeight - state.playerY)
          ctx.scale(scale, scale)
          ctx.translate(64, 0)
          ctx.fillStyle = colors.foreground
          ctx.fill(mainPath)
          ctx.fill(accentPath)
          ctx.restore()
        }

        ctx.fillStyle = colors.foreground
        ctx.globalAlpha = 0.7
        ctx.font = "12px system-ui, sans-serif"
        ctx.textAlign = "right"
        ctx.textBaseline = "alphabetic"
        ctx.fillText(
          String(Math.floor(state.distance / 10)).padStart(5, "0"),
          width - 12,
          20,
        )
        ctx.globalAlpha = 1
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
        "relative h-32 w-full max-w-4xl shrink-0 cursor-pointer overflow-hidden rounded-lg border border-border/60 bg-background text-foreground outline-none sm:h-40 md:h-48 lg:h-56 xl:max-w-5xl",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
      onPointerDown={(event) => {
        if ((event.target as HTMLElement).closest("[data-runner-exit]")) return
        event.preventDefault()
        containerRef.current?.focus()
        setJumpHeld(true)
        startJump()
      }}
      onPointerUp={() => setJumpHeld(false)}
      onPointerLeave={() => setJumpHeld(false)}
      onPointerCancel={() => setJumpHeld(false)}
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        data-runner-exit
        className="absolute start-2 top-2 z-10 h-7 gap-1 bg-background/90 px-2 text-xs shadow-sm backdrop-blur-sm"
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
          <div className="w-full max-w-[16rem] rounded-xl border border-border bg-card p-4 text-card-foreground shadow-lg ring-1 ring-foreground/10">
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
              <p className="text-xs text-muted-foreground">
                Made it to: {gameOverState.milestoneLabel}
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <Button
                type="button"
                size="sm"
                className="w-full"
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
