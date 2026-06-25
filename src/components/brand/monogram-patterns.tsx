"use client"

import * as React from "react"
import { motion, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"
import {
  MONOGRAM_ACCENT,
  MONOGRAM_MAIN,
  MONOGRAM_VIEWBOX,
} from "@/lib/brand/monogram-mark"

export type MonogramPatternVariant =
  | "grid"
  | "offset"
  | "dots"
  | "diagonal"
  | "concentric"
  | "circuit"
  | "waves"
  | "scatter"

export type MonogramPatternTone = "primary" | "muted" | "foreground" | "accent"

export interface MonogramPatternProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: MonogramPatternVariant
  tone?: MonogramPatternTone
  interactive?: boolean
  isParentHovered?: boolean
}

// Simple Mini Monogram SVG renderer for pattern repetition
export const MiniMonogram = React.forwardRef<
  SVGSVGElement,
  React.ComponentPropsWithoutRef<"svg"> & { mainClassName?: string; accentClassName?: string }
>(({ className, mainClassName, accentClassName, ...props }, ref) => {
  return (
    <svg
      ref={ref}
      viewBox={MONOGRAM_VIEWBOX}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("size-5 fill-current", className)}
      {...props}
    >
      <path d={MONOGRAM_MAIN} className={mainClassName} />
      <path d={MONOGRAM_ACCENT} className={accentClassName} />
    </svg>
  )
})
MiniMonogram.displayName = "MiniMonogram"

// Tone CSS mappings
const toneClasses: Record<MonogramPatternTone, string> = {
  primary: "text-primary/45 dark:text-primary/35",
  muted: "text-muted-foreground/35 dark:text-muted-foreground/25",
  foreground: "text-foreground/35 dark:text-foreground/25",
  accent: "text-accent-foreground/45 dark:text-accent-foreground/35",
}

export const MonogramPattern = React.forwardRef<HTMLDivElement, MonogramPatternProps>(
  (
    {
      variant = "grid",
      tone = "muted",
      interactive = true,
      isParentHovered,
      className,
      ...props
    },
    ref
  ) => {
    const shouldReduceMotion = useReducedMotion()
    const [isSelfHovered, setIsSelfHovered] = React.useState(false)
    const isHovered = isParentHovered !== undefined ? isParentHovered : isSelfHovered

    const toneClass = toneClasses[tone]

    // Render helper for Grid variant
    const renderGrid = () => {
      const cols = 10
      const rows = 6
      const total = cols * rows

      const containerVariants = {
        rest: {},
        hover: {
          transition: {
            staggerChildren: 0.015,
          },
        },
      }

      const itemVariants = {
        rest: { scale: 1, rotate: 0, opacity: 0.35 },
        hover: {
          scale: 1.25,
          rotate: 45,
          opacity: 0.95,
          transition: { type: "spring" as const, stiffness: 220, damping: 12 },
        },
      }

      return (
        <motion.div
          className="grid h-full w-full grid-cols-10 gap-x-6 gap-y-4 p-4"
          variants={shouldReduceMotion ? undefined : containerVariants}
          animate={interactive && isHovered ? "hover" : "rest"}
        >
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} className="flex items-center justify-center">
              <motion.div variants={shouldReduceMotion ? undefined : itemVariants}>
                <MiniMonogram className={toneClass} />
              </motion.div>
            </div>
          ))}
        </motion.div>
      )
    }

    // Render helper for Offset Honeycomb variant
    const renderOffset = () => {
      const rows = 6
      const cols = 9

      const containerVariants = {
        rest: {},
        hover: {
          transition: {
            staggerChildren: 0.02,
          },
        },
      }

      const oddVariants = {
        rest: { scale: 0.9, rotate: 0, opacity: 0.3 },
        hover: {
          scale: 1.15,
          rotate: 30,
          opacity: 0.9,
          transition: { type: "spring" as const, stiffness: 180, damping: 12 },
        },
      }

      const evenVariants = {
        rest: { scale: 0.9, rotate: 0, opacity: 0.3 },
        hover: {
          scale: 1.15,
          rotate: -30,
          opacity: 0.9,
          transition: { type: "spring" as const, stiffness: 180, damping: 12 },
        },
      }

      return (
        <motion.div
          className="flex h-full w-full flex-col justify-between p-4"
          variants={shouldReduceMotion ? undefined : containerVariants}
          animate={interactive && isHovered ? "hover" : "rest"}
        >
          {Array.from({ length: rows }).map((_row, rIdx) => {
            const isOdd = rIdx % 2 !== 0
            return (
              <div
                key={rIdx}
                className={cn(
                  "flex justify-between w-full",
                  isOdd ? "translate-x-4 pr-8" : "pl-4 pr-4"
                )}
              >
                {Array.from({ length: cols }).map((_col, cIdx) => (
                  <motion.div
                    key={cIdx}
                    variants={
                      shouldReduceMotion ? undefined : isOdd ? oddVariants : evenVariants
                    }
                  >
                    <MiniMonogram className={toneClass} />
                  </motion.div>
                ))}
              </div>
            )
          })}
        </motion.div>
      )
    }

    // Render helper for Dots & Monograms variant
    const renderDots = () => {
      const totalDots = 60 // 10x6
      const dotVariants = {
        rest: { scale: 1, opacity: 0.25 },
        hover: { scale: 0.7, opacity: 0.08, transition: { duration: 0.3 } },
      }

      const monogramVariants = {
        rest: { scale: 0.8, rotate: 0, opacity: 0.2 },
        hover: {
          scale: 1.35,
          rotate: 90,
          opacity: 0.95,
          transition: { type: "spring" as const, stiffness: 200, damping: 10 },
        },
      }

      return (
        <motion.div
          className="grid h-full w-full grid-cols-10 gap-x-6 gap-y-4 p-4"
          animate={interactive && isHovered ? "hover" : "rest"}
        >
          {Array.from({ length: totalDots }).map((_, i) => {
            const isMonogram = i % 3 === 0
            return (
              <div key={i} className="flex items-center justify-center">
                {isMonogram ? (
                  <motion.div
                    variants={shouldReduceMotion ? undefined : monogramVariants}
                    className="relative"
                  >
                    <MiniMonogram
                      className={cn(
                        toneClass,
                        "drop-shadow-[0_0_2px_currentColor] transition-shadow duration-300"
                      )}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    variants={shouldReduceMotion ? undefined : dotVariants}
                    className={cn(
                      "size-1.5 rounded-full bg-current",
                      toneClass
                    )}
                  />
                )}
              </div>
            )
          })}
        </motion.div>
      )
    }

    // Render helper for Diagonal Flow variant
    const renderDiagonal = () => {
      const cols = 9
      const rows = 6

      const itemVariants = {
        rest: { y: 0, opacity: 0.25, scale: 0.95 },
        hover: (delayVal: number) => ({
          y: -6,
          opacity: 0.9,
          scale: 1.15,
          transition: {
            delay: delayVal * 0.025,
            type: "spring" as const,
            stiffness: 150,
            damping: 10,
          },
        }),
      }

      return (
        <div className="grid h-full w-full grid-cols-9 gap-x-6 gap-y-4 p-4">
          {Array.from({ length: rows }).map((_row, r) =>
            Array.from({ length: cols }).map((_col, c) => {
              const diagonalIndex = r + c
              return (
                <div key={`${r}-${c}`} className="flex items-center justify-center">
                  <motion.div
                    custom={diagonalIndex}
                    variants={shouldReduceMotion ? undefined : itemVariants}
                    animate={interactive && isHovered ? "hover" : "rest"}
                  >
                    <MiniMonogram className={toneClass} />
                  </motion.div>
                </div>
              )
            })
          )}
        </div>
      )
    }

    // Render helper for Concentric Aperture variant
    const renderConcentric = () => {
      const rings = [
        { radius: 35, count: 4, speed: 1 },
        { radius: 75, count: 8, speed: -0.75 },
        { radius: 115, count: 12, speed: 0.5 },
      ]

      const centerVariants = {
        rest: { scale: 0.9, opacity: 0.3 },
        hover: {
          scale: [1, 1.25, 1],
          opacity: 0.95,
          transition: {
            scale: { repeat: Infinity, duration: 2, ease: "easeInOut" as const },
            opacity: { duration: 0.3 },
          },
        },
      }

      return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
          <motion.div
            variants={shouldReduceMotion ? undefined : centerVariants}
            animate={interactive && isHovered ? "hover" : "rest"}
            className="absolute z-10"
          >
            <MiniMonogram className={cn(toneClass, "size-6")} />
          </motion.div>

          {rings.map((ring, rIdx) => {
            const ringVariants = {
              rest: { rotate: 0, opacity: 0.25 },
              hover: {
                rotate: ring.speed * 360,
                opacity: 0.8,
                transition: {
                  duration: 20,
                  ease: "linear" as const,
                  repeat: Infinity,
                },
              },
            }

            return (
              <motion.div
                key={rIdx}
                className={cn("absolute flex items-center justify-center rounded-full border border-dashed", toneClass)}
                style={{
                  width: ring.radius * 2,
                  height: ring.radius * 2,
                  borderColor: "currentColor",
                  borderStyle: "dashed",
                }}
                variants={shouldReduceMotion ? undefined : ringVariants}
                animate={interactive && isHovered ? "hover" : "rest"}
              >
                {Array.from({ length: ring.count }).map((_, i) => {
                  const angle = (i * 360) / ring.count
                  const rad = (angle * Math.PI) / 180
                  const x = ring.radius * Math.cos(rad)
                  const y = ring.radius * Math.sin(rad)

                  return (
                    <div
                      key={i}
                      className="absolute"
                      style={{
                        transform: `translate(${x}px, ${y}px) rotate(${angle + 90}deg)`,
                      }}
                    >
                      <MiniMonogram className="size-3.5" />
                    </div>
                  )
                })}
              </motion.div>
            )
          })}
        </div>
      )
    }

    // Render helper for Tech Circuit variant
    const renderCircuit = () => {
      const nodes = [
        { id: 1, cx: 60, cy: 50, connections: [2, 3] },
        { id: 2, cx: 160, cy: 190, connections: [4] },
        { id: 3, cx: 220, cy: 70, connections: [4, 5] },
        { id: 4, cx: 320, cy: 170, connections: [] },
        { id: 5, cx: 380, cy: 60, connections: [] },
      ]

      const pathVariants = {
        rest: { pathLength: 0.15, opacity: 0.1 },
        hover: {
          pathLength: 1,
          opacity: 0.65,
          transition: { duration: 1.2, ease: "easeInOut" as const },
        },
      }

      const nodeVariants = {
        rest: { scale: 0.9, opacity: 0.25 },
        hover: {
          scale: [1, 1.2, 1],
          opacity: 0.95,
          transition: {
            scale: { repeat: Infinity, duration: 2.4, ease: "easeInOut" as const },
            opacity: { duration: 0.4 },
          },
        },
      }

      return (
        <svg
          className={cn("absolute inset-0 h-full w-full", toneClass)}
          viewBox="0 0 440 240"
          preserveAspectRatio="xMidYMid slice"
        >
          {nodes.map((node) =>
            node.connections.map((targetId) => {
              const target = nodes.find((n) => n.id === targetId)
              if (!target) return null

              const midX = (node.cx + target.cx) / 2
              const pathD = `M ${node.cx} ${node.cy} L ${midX} ${node.cy} L ${midX} ${target.cy} L ${target.cx} ${target.cy}`

              return (
                <motion.path
                  key={`${node.id}-${targetId}`}
                  d={pathD}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  variants={shouldReduceMotion ? undefined : pathVariants}
                  animate={interactive && isHovered ? "hover" : "rest"}
                />
              )
            })
          )}

          {nodes.map((node) => (
            <motion.g
              key={node.id}
              transform={`translate(${node.cx - 10}, ${node.cy - 10})`}
              variants={shouldReduceMotion ? undefined : nodeVariants}
              animate={interactive && isHovered ? "hover" : "rest"}
            >
              <MiniMonogram className="size-5 drop-shadow-[0_0_3px_currentColor]" />
            </motion.g>
          ))}
        </svg>
      )
    }

    // Render helper for Waves variant
    const renderWaves = () => {
      const rows = 6
      const cols = 10

      const itemVariants = {
        rest: { y: 0, opacity: 0.2, scale: 0.9 },
        hover: (delayVal: number) => ({
          y: [-4, 4, -4],
          opacity: 0.85,
          scale: 1.1,
          transition: {
            y: {
              repeat: Infinity,
              duration: 2.5,
              ease: "easeInOut" as const,
              delay: delayVal * 0.05,
            },
            opacity: { duration: 0.3 },
            scale: { duration: 0.3 },
          },
        }),
      }

      return (
        <div className="flex h-full w-full flex-col justify-between p-4">
          {Array.from({ length: rows }).map((_row, rIdx) => (
            <div key={rIdx} className="flex justify-between w-full">
              {Array.from({ length: cols }).map((_col, cIdx) => {
                const yOffset = Math.sin(cIdx * 0.8) * 6
                const delayVal = rIdx + cIdx
                return (
                  <div
                    key={cIdx}
                    className="flex items-center justify-center"
                    style={{ transform: `translateY(${yOffset}px)` }}
                  >
                    <motion.div
                      custom={delayVal}
                      variants={shouldReduceMotion ? undefined : itemVariants}
                      animate={interactive && isHovered ? "hover" : "rest"}
                    >
                      <MiniMonogram className={toneClass} />
                    </motion.div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      )
    }

    // Render helper for Scatter variant
    const renderScatter = () => {
      const particles = [
        { x: 12, y: 18, r: 45, s: 0.8 },
        { x: 34, y: 12, r: 120, s: 1.1 },
        { x: 56, y: 22, r: 290, s: 0.7 },
        { x: 78, y: 15, r: 15, s: 0.9 },
        { x: 88, y: 32, r: 85, s: 1.2 },
        { x: 22, y: 48, r: 195, s: 1.0 },
        { x: 45, y: 38, r: 60, s: 0.8 },
        { x: 67, y: 52, r: 145, s: 1.1 },
        { x: 15, y: 78, r: 215, s: 0.9 },
        { x: 38, y: 88, r: 340, s: 0.7 },
        { x: 52, y: 72, r: 75, s: 1.3 },
        { x: 72, y: 82, r: 160, s: 0.8 },
        { x: 92, y: 75, r: 25, s: 1.0 },
        { x: 28, y: 62, r: 110, s: 0.95 },
        { x: 62, y: 65, r: 310, s: 1.15 },
        { x: 82, y: 55, r: 180, s: 0.75 },
        { x: 48, y: 55, r: 225, s: 0.85 },
      ]

      const itemVariants = {
        rest: { y: 0, opacity: 0.15, rotate: 0 },
        hover: (custom: { initRotate: number; baseScale: number }) => ({
          y: [-6, 6, -6],
          opacity: 0.75,
          rotate: custom.initRotate + 180,
          scale: custom.baseScale * 1.15,
          transition: {
            y: {
              repeat: Infinity,
              duration: 4,
              ease: "easeInOut" as const,
            },
            rotate: { duration: 1.5, ease: "easeOut" as const },
            opacity: { duration: 0.5 },
          },
        }),
      }

      return (
        <div className="absolute inset-0 h-full w-full">
          {particles.map((p, i) => (
            <div
              key={i}
              className="absolute"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              <motion.div
                custom={{ initRotate: p.r, baseScale: p.s }}
                variants={shouldReduceMotion ? undefined : itemVariants}
                animate={interactive && isHovered ? "hover" : "rest"}
                style={{ rotate: p.r, scale: p.s }}
              >
                <MiniMonogram className={toneClass} />
              </motion.div>
            </div>
          ))}
        </div>
      )
    }

    const renderPattern = () => {
      switch (variant) {
        case "grid":
          return renderGrid()
        case "offset":
          return renderOffset()
        case "dots":
          return renderDots()
        case "diagonal":
          return renderDiagonal()
        case "concentric":
          return renderConcentric()
        case "circuit":
          return renderCircuit()
        case "waves":
          return renderWaves()
        case "scatter":
          return renderScatter()
        default:
          return renderGrid()
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          "absolute inset-0 h-full w-full overflow-hidden select-none pointer-events-none",
          className
        )}
        onMouseEnter={() => !isParentHovered && setIsSelfHovered(true)}
        onMouseLeave={() => !isParentHovered && setIsSelfHovered(false)}
        {...props}
      >
        {renderPattern()}
      </div>
    )
  }
)
MonogramPattern.displayName = "MonogramPattern"
