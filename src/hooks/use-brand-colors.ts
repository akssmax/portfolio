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

    let frame = 0

    const readColors = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        setColors([
          resolveCssVariableToHex("--chart-1", STRAND_FALLBACK[0]),
          resolveCssVariableToHex("--chart-2", STRAND_FALLBACK[1]),
          resolveCssVariableToHex("--chart-3", STRAND_FALLBACK[2]),
        ])
      })
    }

    readColors()

    const observer = new MutationObserver(readColors)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class", "style"],
    })

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [
    mounted,
    appearance.palette,
    appearance.neutral,
    appearance.font,
    appearance.radius,
    appearance.customBrandColor,
    appearance.colorVision,
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

    let frame = 0

    const readColors = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        setColors({
          primary: resolveCssVariableToHex("--primary", FALLBACK.primary),
          secondary: resolveCssVariableToHex("--secondary", FALLBACK.secondary),
          accent: resolveCssVariableToHex("--accent", FALLBACK.accent),
          primaryForeground: resolveCssVariableToHex(
            "--primary-foreground",
            FALLBACK.primaryForeground,
          ),
        })
      })
    }

    readColors()

    const observer = new MutationObserver(readColors)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class", "style"],
    })

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [
    mounted,
    appearance.palette,
    appearance.neutral,
    appearance.font,
    appearance.radius,
    appearance.customBrandColor,
    appearance.colorVision,
    theme,
    resolvedTheme,
  ])

  return colors
}

function parseHexColor(hex: string) {
  const normalized = hex.replace("#", "").trim()
  if (normalized.length !== 6) return null

  const r = Number.parseInt(normalized.slice(0, 2), 16)
  const g = Number.parseInt(normalized.slice(2, 4), 16)
  const b = Number.parseInt(normalized.slice(4, 6), 16)

  if ([r, g, b].some((value) => Number.isNaN(value))) return null

  return { r, g, b }
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((value) => value.toString(16).padStart(2, "0")).join("")}`
}

/** Lighter tint of a color toward white — used outside primary surfaces */
export function tintBrandColor(hex: string, mix = 0.45): string {
  const rgb = parseHexColor(hex)
  if (!rgb) return hex

  return rgbToHex(
    Math.round(rgb.r + (255 - rgb.r) * mix),
    Math.round(rgb.g + (255 - rgb.g) * mix),
    Math.round(rgb.b + (255 - rgb.b) * mix),
  )
}

/** Blend two resolved brand hex colors */
export function mixBrandColors(
  colorA: string,
  colorB: string,
  weightA = 0.55,
): string {
  const a = parseHexColor(colorA)
  const b = parseHexColor(colorB)
  if (!a) return colorB
  if (!b) return colorA

  const weightB = 1 - weightA

  return rgbToHex(
    Math.round(a.r * weightA + b.r * weightB),
    Math.round(a.g * weightA + b.g * weightB),
    Math.round(a.b * weightA + b.b * weightB),
  )
}

/** Dot colors for interactive grids sitting on `bg-primary` surfaces */
export function getPrimarySurfaceDotColors(
  primary: string,
  primaryForeground: string,
) {
  return {
    baseColor: mixBrandColors(primaryForeground, primary, 0.55),
    activeColor: primaryForeground,
  }
}
