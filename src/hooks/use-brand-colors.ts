"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

import { useAppearance } from "@/components/appearance-provider"
import { resolveCssVariableToHex } from "@/lib/themes/resolve-colors"

export type BrandColors = {
  primary: string
  secondary: string
  accent: string
  primaryForeground: string
}

const FALLBACK: BrandColors = {
  primary: "#FF354B",
  secondary: "#7E00FF",
  accent: "#00D061",
  primaryForeground: "#FFFFFF",
}

const STRAND_FALLBACK = ["#FF354B", "#7E00FF", "#00D061"] as const

export function useStrandColors(): [string, string, string] {
  const { appearance, mounted } = useAppearance()
  const { theme, resolvedTheme } = useTheme()
  const [colors, setColors] = useState<[string, string, string]>([
    ...STRAND_FALLBACK,
  ])

  useEffect(() => {
    if (!mounted) return

    const frame = requestAnimationFrame(() => {
      setColors([
        resolveCssVariableToHex("--chart-1", STRAND_FALLBACK[0]),
        resolveCssVariableToHex("--chart-2", STRAND_FALLBACK[1]),
        resolveCssVariableToHex("--chart-3", STRAND_FALLBACK[2]),
      ])
    })

    return () => cancelAnimationFrame(frame)
  }, [
    mounted,
    appearance.palette,
    appearance.neutral,
    appearance.font,
    appearance.radius,
    theme,
    resolvedTheme,
  ])

  return colors
}

export function useBrandColors(): BrandColors {
  const { appearance, mounted } = useAppearance()
  const { theme, resolvedTheme } = useTheme()
  const [colors, setColors] = useState<BrandColors>(FALLBACK)

  useEffect(() => {
    if (!mounted) return

    const frame = requestAnimationFrame(() => {
      setColors({
        primary: resolveCssVariableToHex("--primary"),
        secondary: resolveCssVariableToHex("--secondary"),
        accent: resolveCssVariableToHex("--accent"),
        primaryForeground: resolveCssVariableToHex("--primary-foreground"),
      })
    })

    return () => cancelAnimationFrame(frame)
  }, [
    mounted,
    appearance.palette,
    appearance.neutral,
    appearance.font,
    appearance.radius,
    theme,
    resolvedTheme,
  ])

  return colors
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((value) => value.toString(16).padStart(2, "0")).join("")}`
}

/** Lighter tint of primary for dot grid backgrounds on brand surfaces */
export function tintBrandColor(hex: string, mix = 0.45): string {
  const normalized = hex.replace("#", "")
  if (normalized.length !== 6) return hex

  const r = Number.parseInt(normalized.slice(0, 2), 16)
  const g = Number.parseInt(normalized.slice(2, 4), 16)
  const b = Number.parseInt(normalized.slice(4, 6), 16)

  return rgbToHex(
    Math.round(r + (255 - r) * mix),
    Math.round(g + (255 - g) * mix),
    Math.round(b + (255 - b) * mix),
  )
}
