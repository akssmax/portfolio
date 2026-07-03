"use client"

import {  useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import type {CSSProperties} from "react";

import { cn } from "@/lib/utils"

export type FooterGradientVariant = "dia" | "peaked" | "dodge" | "fold3d"

export type Stop = { offset: number; color: string }

// --- Color Palettes ---

export const DIA_STOPS_DARK: Array<Stop> = [
  { offset: 0, color: "#340B05" },
  { offset: 0.1827, color: "#0358F7" },
  { offset: 0.2837, color: "#5092C7" },
  { offset: 0.4135, color: "#E1ECFE" },
  { offset: 0.5866, color: "#FFD400" },
  { offset: 0.6827, color: "#FA3D1D" },
  { offset: 0.8029, color: "#FD02F5" },
  { offset: 1, color: "#FFC0FD00" },
]

export const DIA_STOPS_LIGHT: Array<Stop> = [
  { offset: 0, color: "#FF7AB6" },
  { offset: 0.26, color: "#FFA1D2" },
  { offset: 0.5, color: "#C9A8FF" },
  { offset: 0.7, color: "#A7D8FF" },
  { offset: 0.86, color: "#FFF3B0" },
  { offset: 1, color: "#FFFFFF00" },
]

export const AURORA_STOPS_DARK: Array<Stop> = [
  { offset: 0, color: "#021018" },
  { offset: 0.22, color: "#0B6E4F" },
  { offset: 0.44, color: "#1FD18E" },
  { offset: 0.64, color: "#9CF6C8" },
  { offset: 0.82, color: "#56D6E8" },
  { offset: 1, color: "#CFFAF200" },
]

export const AURORA_STOPS_LIGHT: Array<Stop> = [
  { offset: 0, color: "#E6FFFA" },
  { offset: 0.25, color: "#B2F5EA" },
  { offset: 0.5, color: "#81E6D9" },
  { offset: 0.75, color: "#4FD1C5" },
  { offset: 0.9, color: "#319795" },
  { offset: 1, color: "#31979500" },
]

export const PEAKED_COLORS_DARK = [
  "#E1ECFE",
  "#FFD400",
  "#FA3D1D",
  "#FD02F5",
  "#0358F7",
  "#340B05",
]

export const PEAKED_COLORS_LIGHT = [
  "#FFFFFF",
  "#FFF3B0",
  "#FFA1D2",
  "#C9A8FF",
  "#A7D8FF",
  "#FCE7F3",
]

export const DODGE_RAINBOW_DARK = [
  "#FF0000",
  "#FFFF00",
  "#00FF00",
  "#00FFFF",
  "#0000FF",
  "#FF00FF",
]

export const DODGE_RAINBOW_LIGHT = [
  "#FFA1D2",
  "#FFF3B0",
  "#A7D8FF",
  "#C9A8FF",
  "#FFA1D2",
]

const VBW = 1271
const VBH = 599

// --- Helper Functions ---

function bellHeights(n: number, peak: number, valley: number): Array<number> {
  const out: Array<number> = []
  const mid = (n - 1) / 2
  for (let i = 0; i < n; i++) {
    const t = mid === 0 ? 0 : Math.abs(i - mid) / mid // 0 center -> 1 edge
    const eased = 1 - Math.pow(t, 1.24) // 1 center -> 0 edge
    out.push(peak * VBH * (valley + (1 - valley) * eased))
  }
  return out
}

function peakPath(widthFrac: number, heightFrac: number, pointiness: number): string {
  const w = widthFrac * VBW
  const startX = (VBW - w) / 2
  const endX = startX + w
  const peakX = VBW / 2
  const peakY = VBH - heightFrac * VBH
  const spread = (1 - pointiness) * (w / 2) // wide control pts = rounder
  const ext = VBH * 0.6 // extend bottom past the viewBox
  return [
    `M ${startX} ${VBH}`,
    `Q ${peakX - spread} ${peakY}, ${peakX} ${peakY}`,
    `Q ${peakX + spread} ${peakY}, ${endX} ${VBH}`,
    `L ${endX} ${VBH + ext}`,
    `L ${startX} ${VBH + ext}`,
    "Z",
  ].join(" ")
}

// --- Custom Hook for Reveal Animation ---

function useGradientReveal({
  reveal = "scroll",
  replayKey = 0,
  ref,
}: {
  reveal?: "mount" | "scroll" | "none"
  riseMs?: number
  replayKey?: number
  ref: React.RefObject<HTMLDivElement | null>
}) {
  const [scaleY, setScaleY] = useState(reveal === "none" ? 1 : 0)

  useEffect(() => {
    if (typeof window === "undefined") return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reveal === "none" || reduced) {
      setScaleY(1)
      return
    }

    if (reveal === "mount") {
      setScaleY(0)
      const id = requestAnimationFrame(() =>
        requestAnimationFrame(() => setScaleY(1))
      )
      return () => cancelAnimationFrame(id)
    }

    let ticking = false
    const measure = () => {
      ticking = false
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight || 1
      // Scale from 0 to 1 based on how close the element is to entering the bottom 65% of screen
      const fraction = Math.max(0, Math.min(1, (vh - r.top) / (vh * 0.65)))
      setScaleY(fraction)
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(measure)
      }
    }

    measure()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [reveal, replayKey, ref])

  return scaleY
}

// --- Component Implementations ---

export function DiaGradient({
  bars = 9,
  blur = 15,
  peak = 0.98,
  valley = 0.55,
  stops,
  riseMs = 1100,
  reveal = "scroll",
  replayKey = 0,
  className,
  style,
}: {
  bars?: number
  blur?: number
  peak?: number
  valley?: number
  stops?: Array<Stop>
  riseMs?: number
  reveal?: "mount" | "scroll" | "none"
  replayKey?: number
  className?: string
  style?: CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const scaleY = useGradientReveal({ reveal, riseMs, replayKey, ref })
  const { resolvedTheme } = useTheme()
  
  const activeStops = stops || (resolvedTheme === "light" ? DIA_STOPS_LIGHT : DIA_STOPS_DARK)
  const heights = bellHeights(bars, peak, valley)
  const colW = VBW / bars

  const uniqueId = `dia-grad-${replayKey}`

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("w-full h-full", className)}
      style={{
        transformOrigin: "bottom",
        transform: `scaleY(${scaleY})`,
        transition:
          reveal === "mount"
            ? `transform ${riseMs}ms cubic-bezier(0.16, 1, 0.3, 1)`
            : undefined,
        willChange: "transform",
        ...style,
      }}
    >
      <svg
        className="w-full h-full"
        viewBox={`0 0 ${VBW} ${VBH}`}
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={uniqueId} x1="0" y1="1" x2="0" y2="0">
            {activeStops.map((s, i) => (
              <stop key={i} offset={s.offset} stopColor={s.color} />
            ))}
          </linearGradient>
          <filter id={`dia-blur-${uniqueId}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={blur} />
          </filter>
        </defs>
        {heights.map((h, i) => (
          <g key={i} filter={`url(#dia-blur-${uniqueId})`}>
            <rect
              x={i * colW}
              y={VBH - h}
              width={colW * 1.23}
              height={h}
              fill={`url(#${uniqueId})`}
            />
          </g>
        ))}
      </svg>
    </div>
  )
}

export function PeakedGradient({
  colors,
  peak = 0.92,
  pointiness = 0.5,
  blur = 26,
  reveal = "scroll",
  riseMs = 1100,
  replayKey = 0,
  className,
  style,
}: {
  colors?: Array<string>
  peak?: number
  pointiness?: number
  blur?: number
  reveal?: "mount" | "scroll" | "none"
  riseMs?: number
  replayKey?: number
  className?: string
  style?: CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const scaleY = useGradientReveal({ reveal, riseMs, replayKey, ref })
  const { resolvedTheme } = useTheme()

  const activeColors = colors || (resolvedTheme === "light" ? PEAKED_COLORS_LIGHT : PEAKED_COLORS_DARK)
  const fid = `peak-blur-${replayKey}`

  // back (darkest, widest, lowest) -> front (lightest, narrowest, tallest)
  const layers = activeColors
    .slice()
    .reverse()
    .map((color, i, arr) => {
      const t = arr.length === 1 ? 1 : i / (arr.length - 1)
      const heightFrac = peak * (0.55 + 0.45 * t)
      const widthFrac = 1.05 - 0.45 * t
      return { color, d: peakPath(widthFrac, heightFrac, pointiness) }
    })

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("w-full h-full", className)}
      style={{
        transformOrigin: "bottom",
        transform: `scaleY(${scaleY})`,
        transition:
          reveal === "mount"
            ? `transform ${riseMs}ms cubic-bezier(0.16, 1, 0.3, 1)`
            : undefined,
        willChange: "transform",
        ...style,
      }}
    >
      <svg
        className="h-full w-full"
        viewBox={`0 0 ${VBW} ${VBH}`}
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id={fid} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={blur} />
          </filter>
        </defs>
        <g filter={`url(#${fid})`}>
          {layers.map((l, i) => (
            <path key={i} d={l.d} fill={l.color} />
          ))}
        </g>
      </svg>
    </div>
  )
}

export function DodgeGradient({
  colors,
  reveal = "scroll",
  riseMs = 1100,
  replayKey = 0,
  className,
  style,
}: {
  colors?: Array<string>
  reveal?: "mount" | "scroll" | "none"
  riseMs?: number
  replayKey?: number
  className?: string
  style?: CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const scaleY = useGradientReveal({ reveal, riseMs, replayKey, ref })
  const { resolvedTheme } = useTheme()

  const activeColors = colors || (resolvedTheme === "light" ? DODGE_RAINBOW_LIGHT : DODGE_RAINBOW_DARK)
  const band = activeColors.concat(activeColors[0] || "#FF0000")
  
  // In light mode, a soft screen blend is sometimes more pleasing, but we'll use color-dodge/normal for standard implementation
  const blendMode = resolvedTheme === "light" ? "color-dodge, normal" : "color-dodge, normal"
  
  const BACKGROUND =
    "linear-gradient(0deg, #000000 0%, #f7f7f7 100%), " +
    `linear-gradient(90deg, ${band.join(", ")})`

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("w-full h-full", className)}
      style={{
        transformOrigin: "bottom",
        transform: `scaleY(${scaleY})`,
        transition:
          reveal === "mount"
            ? `transform ${riseMs}ms cubic-bezier(0.16, 1, 0.3, 1)`
            : undefined,
        willChange: "transform",
        ...style,
      }}
    >
      <div
        className="h-full w-full"
        style={{
          background: BACKGROUND,
          backgroundBlendMode: blendMode,
          WebkitMaskImage:
            "radial-gradient(75% 170% at 50% 100%, #000 38%, transparent 78%)",
          maskImage:
            "radial-gradient(75% 170% at 50% 100%, #000 38%, transparent 78%)",
        }}
      />
    </div>
  )
}

export function Fold3DGradient({
  bars = 9,
  blur = 15,
  peak = 0.98,
  valley = 0.55,
  stops,
  riseMs = 1100,
  reveal = "scroll",
  replayKey = 0,
  className,
  style,
  foldAngle = 74,
  depth = 620,
}: {
  bars?: number
  blur?: number
  peak?: number
  valley?: number
  stops?: Array<Stop>
  riseMs?: number
  reveal?: "mount" | "scroll" | "none"
  replayKey?: number
  className?: string
  style?: CSSProperties
  foldAngle?: number
  depth?: number
}) {
  const { resolvedTheme } = useTheme()
  const activeStops = stops || (resolvedTheme === "light" ? AURORA_STOPS_LIGHT : AURORA_STOPS_DARK)

  return (
    <div
      className={cn("relative overflow-hidden w-full h-full", className)}
      style={{
        perspective: `${depth}px`,
        ...style,
      }}
    >
      <div
        className="absolute left-0 top-0 w-full"
        style={{
          height: "175%",
          transform: `rotateX(${foldAngle}deg)`,
          transformOrigin: "50% 0%",
          willChange: "transform",
        }}
      >
        <DiaGradient
          bars={bars}
          blur={blur}
          peak={peak}
          valley={valley}
          stops={activeStops}
          riseMs={riseMs}
          reveal={reveal}
          replayKey={replayKey}
        />
      </div>
    </div>
  )
}

// --- Unified Component ---

export interface FooterGradientsProps {
  activeVariant?: FooterGradientVariant
  bars?: number
  blur?: number
  peak?: number
  valley?: number
  stops?: Array<Stop>
  colors?: Array<string>
  pointiness?: number
  reveal?: "mount" | "scroll" | "none"
  riseMs?: number
  replayKey?: number
  className?: string
  style?: CSSProperties
  foldAngle?: number
  depth?: number
}

export function FooterGradients({
  activeVariant = "fold3d",
  reveal = "scroll",
  bars,
  blur,
  peak,
  valley,
  stops,
  colors,
  pointiness,
  riseMs,
  replayKey = 0,
  className,
  style,
  foldAngle,
  depth,
}: FooterGradientsProps) {
  switch (activeVariant) {
    case "dia":
      return (
        <DiaGradient
          bars={bars}
          blur={blur}
          peak={peak}
          valley={valley}
          stops={stops}
          reveal={reveal}
          riseMs={riseMs}
          replayKey={replayKey}
          className={className}
          style={style}
        />
      )
    case "peaked":
      return (
        <PeakedGradient
          colors={colors}
          peak={peak}
          pointiness={pointiness}
          blur={blur}
          reveal={reveal}
          riseMs={riseMs}
          replayKey={replayKey}
          className={className}
          style={style}
        />
      )
    case "dodge":
      return (
        <DodgeGradient
          colors={colors}
          reveal={reveal}
          riseMs={riseMs}
          replayKey={replayKey}
          className={className}
          style={style}
        />
      )
    case "fold3d":
    default:
      return (
        <Fold3DGradient
          bars={bars}
          blur={blur}
          peak={peak}
          valley={valley}
          stops={stops}
          reveal={reveal}
          riseMs={riseMs}
          replayKey={replayKey}
          className={className}
          style={style}
          foldAngle={foldAngle}
          depth={depth}
        />
      )
  }
}
