"use client"

import { ArrowLeft, RotateCcw } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

import {
  MONOGRAM_ACCENT,
  MONOGRAM_MAIN,
} from "@/lib/brand/monogram-mark"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const GRAVITY = 0.72
const GRAVITY_HOLD = 0.28
const JUMP_VELOCITY = 10.5
const GROUND_PADDING = 12
const PLAYER_HEIGHT_RATIO = 0.18
const MAX_JUMP_HEIGHT_RATIO = 0.42
const INITIAL_SPEED = 5.5
const MAX_SPEED = 13
const MIN_OBSTACLE_GAP = 280
const MAX_OBSTACLE_GAP = 520

type Obstacle = {
  x: number
  width: number
  height: number
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
}

type ThemeColors = {
  foreground: string
}

function readThemeColors(container: HTMLElement): ThemeColors {
  return {
    foreground: getComputedStyle(container).color,
  }
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
  }
}

function spawnObstacle(width: number): Obstacle {
  const tall = Math.random() > 0.65
  const obstacleWidth = tall ? 18 : 14 + Math.random() * 10
  const obstacleHeight = tall ? 52 : 28 + Math.random() * 12

  return {
    x: width + obstacleWidth,
    width: obstacleWidth,
    height: obstacleHeight,
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
  const [gameOverScore, setGameOverScore] = useState<number | null>(null)

  const restart = useCallback(() => {
    stateRef.current = createInitialState(sizeRef.current.width)
    jumpHeldRef.current = false
    uiPhaseRef.current = "running"
    setGameOverScore(null)
  }, [])

  const startJump = useCallback(() => {
    const state = stateRef.current
    if (state.phase === "gameOver") {
      restart()
      return
    }
    if (state.playerY <= 0.5 && state.playerVy <= 0) {
      state.playerVy = JUMP_VELOCITY
    }
  }, [restart])

  const setJumpHeld = useCallback((held: boolean) => {
    jumpHeldRef.current = held
  }, [])

  const exit = useCallback(() => {
    onExit()
  }, [onExit])

  useEffect(() => {
    mainPathRef.current = new Path2D(MONOGRAM_MAIN)
    accentPathRef.current = new Path2D(MONOGRAM_ACCENT)
    containerRef.current?.focus()
  }, [])

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const width = container.clientWidth
      const height = container.clientHeight
      sizeRef.current = { width, height, dpr }
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    stateRef.current = createInitialState(container.clientWidth)
    uiPhaseRef.current = "running"
    setGameOverScore(null)

    const observer = new ResizeObserver(resize)
    observer.observe(container)

    let lastTime = performance.now()

    const tick = (time: number) => {
      const dt = Math.min((time - lastTime) / 16.67, 2.5)
      lastTime = time

      const { width, height } = sizeRef.current
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
      const colors = readThemeColors(container)

      if (state.phase === "running") {
        state.distance += state.speed * dt
        state.speed = Math.min(MAX_SPEED, state.speed + 0.002 * dt)

        const gravity =
          jumpHeldRef.current && state.playerVy > 0 ? GRAVITY_HOLD : GRAVITY

        state.playerVy -= gravity * dt
        state.playerY += state.playerVy * dt

        if (state.playerY <= 0) {
          state.playerY = 0
          state.playerVy = 0
        } else if (state.playerY >= maxJumpHeight) {
          state.playerY = maxJumpHeight
          state.playerVy = Math.min(state.playerVy, 0)
        }

        state.nextObstacleIn -= state.speed * dt
        if (state.nextObstacleIn <= 0) {
          state.obstacles.push(spawnObstacle(width))
          state.nextObstacleIn =
            MIN_OBSTACLE_GAP +
            Math.random() * (MAX_OBSTACLE_GAP - MIN_OBSTACLE_GAP)
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
              setGameOverScore(Math.floor(state.distance / 10))
            }
            break
          }
        }
      }

      ctx.clearRect(0, 0, width, height)

      ctx.strokeStyle = colors.foreground
      ctx.globalAlpha = 0.2
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, groundY + 0.5)
      ctx.lineTo(width, groundY + 0.5)
      ctx.stroke()
      ctx.globalAlpha = 1

      for (const obstacle of state.obstacles) {
        ctx.fillStyle = colors.foreground
        ctx.globalAlpha = 0.45
        ctx.fillRect(
          obstacle.x,
          groundY - obstacle.height,
          obstacle.width,
          obstacle.height,
        )
        ctx.globalAlpha = 1
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
      ctx.fillText(
        String(Math.floor(state.distance / 10)).padStart(5, "0"),
        width - 12,
        20,
      )
      ctx.globalAlpha = 1

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
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
        "relative h-32 w-full max-w-4xl shrink-0 cursor-pointer outline-none sm:h-40 md:h-48 lg:h-56 xl:max-w-5xl",
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
      <canvas ref={canvasRef} className="block size-full touch-none" aria-hidden />

      {gameOverScore !== null ? (
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
                {gameOverScore}
              </p>
              <p className="text-xs text-muted-foreground">points</p>
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
