"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { useTheme } from "next-themes"

import type {
  AppearanceState,
  BrandPresetId,
  ColorVisionPresetId,
  FontPresetId,
  FontScalePresetId,
  NeutralPresetId,
  RadiusPresetId,
} from "@/lib/themes/types"
import {
  applyAppearanceToDocument,
  readAppearanceFromStorage,
  writeAppearanceToStorage,
} from "@/lib/themes/apply-appearance"
import { loadFontPreset } from "@/lib/themes/font-loader"
import { DEFAULT_APPEARANCE } from "@/lib/themes/registry"
import { syncDocumentThemeClass } from "@/lib/themes/resolve-theme-mode"

export type FooterGradientType = "none" | "dia" | "peaked" | "dodge" | "fold3d"

type AppearanceContextValue = {
  appearance: AppearanceState
  setPalette: (palette: BrandPresetId) => void
  setNeutral: (neutral: NeutralPresetId | null) => void
  setFont: (font: FontPresetId) => void
  setRadius: (radius: RadiusPresetId) => void
  setColorVision: (colorVision: ColorVisionPresetId) => void
  setFontScale: (fontScale: FontScalePresetId) => void
  setCustomBrandColor: (color: string) => void
  clearCustomBrandColor: () => void
  mounted: boolean
  footerGradient: FooterGradientType
  setFooterGradient: (type: FooterGradientType) => void
}

const AppearanceContext = createContext<AppearanceContextValue | null>(null)

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const [appearance, setAppearance] = useState<AppearanceState>(DEFAULT_APPEARANCE)
  const [footerGradient, setFooterGradientState] = useState<FooterGradientType>("fold3d")
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, theme } = useTheme()
  const resolvedThemeRef = useRef(resolvedTheme)
  resolvedThemeRef.current = resolvedTheme

  const runApplyAppearance = useCallback((state: AppearanceState) => {
    applyAppearanceToDocument(state, {
      resolvedTheme: resolvedThemeRef.current,
    })
  }, [])

  useEffect(() => {
    const stored = readAppearanceFromStorage()
    setAppearance(stored)
    runApplyAppearance(stored)
    setMounted(true)
    void loadFontPreset(stored.font).then(() => {
      runApplyAppearance(stored)
    })
  }, [runApplyAppearance])

  useEffect(() => {
    if (!mounted) return
    runApplyAppearance(appearance)
  }, [appearance, mounted, resolvedTheme, runApplyAppearance])

  useEffect(() => {
    if (!mounted || theme !== "system") return

    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => {
      const mode = media.matches ? "dark" : "light"
      syncDocumentThemeClass(document.documentElement, mode)
      applyAppearanceToDocument(appearance, { resolvedTheme: mode })
    }

    media.addEventListener("change", handleChange)
    return () => media.removeEventListener("change", handleChange)
  }, [appearance, mounted, theme])

  const updateAppearance = useCallback(
    (updater: (prev: AppearanceState) => AppearanceState) => {
      setAppearance((prev) => {
        const next = updater(prev)
        writeAppearanceToStorage(next)
        applyAppearanceToDocument(next, {
          resolvedTheme: resolvedThemeRef.current,
        })
        return next
      })
    },
    [],
  )

  const setPalette = useCallback(
    (palette: BrandPresetId) => {
      updateAppearance((prev) => ({
        ...prev,
        palette,
        customBrandColor: null,
      }))
    },
    [updateAppearance],
  )

  const setNeutral = useCallback(
    (neutral: NeutralPresetId | null) => {
      updateAppearance((prev) => ({ ...prev, neutral }))
    },
    [updateAppearance],
  )

  const setFont = useCallback(
    (font: FontPresetId) => {
      void loadFontPreset(font)
      updateAppearance((prev) => ({ ...prev, font }))
    },
    [updateAppearance],
  )

  const setRadius = useCallback(
    (radius: RadiusPresetId) => {
      updateAppearance((prev) => ({ ...prev, radius }))
    },
    [updateAppearance],
  )

  const setColorVision = useCallback(
    (colorVision: ColorVisionPresetId) => {
      updateAppearance((prev) => ({ ...prev, colorVision }))
    },
    [updateAppearance],
  )

  const setFontScale = useCallback(
    (fontScale: FontScalePresetId) => {
      updateAppearance((prev) => ({ ...prev, fontScale }))
    },
    [updateAppearance],
  )

  const setCustomBrandColor = useCallback(
    (color: string) => {
      updateAppearance((prev) => ({ ...prev, customBrandColor: color }))
    },
    [updateAppearance],
  )

  const clearCustomBrandColor = useCallback(() => {
    updateAppearance((prev) => ({ ...prev, customBrandColor: null }))
  }, [updateAppearance])

  useEffect(() => {
    if (typeof window === "undefined") return
    const stored = localStorage.getItem("appearance-footer-gradient") as FooterGradientType | null
    if (stored && ["none", "dia", "peaked", "dodge", "fold3d"].includes(stored)) {
      setFooterGradientState(stored)
    }
  }, [])

  const setFooterGradient = useCallback((type: FooterGradientType) => {
    setFooterGradientState(type)
    localStorage.setItem("appearance-footer-gradient", type)
  }, [])

  const value = useMemo(
    () => ({
      appearance,
      setPalette,
      setNeutral,
      setFont,
      setRadius,
      setColorVision,
      setFontScale,
      setCustomBrandColor,
      clearCustomBrandColor,
      mounted,
      footerGradient,
      setFooterGradient,
    }),
    [
      appearance,
      setPalette,
      setNeutral,
      setFont,
      setRadius,
      setColorVision,
      setFontScale,
      setCustomBrandColor,
      clearCustomBrandColor,
      mounted,
      footerGradient,
      setFooterGradient,
    ],
  )

  return (
    <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>
  )
}

export function useAppearance() {
  const context = useContext(AppearanceContext)
  if (!context) {
    throw new Error("useAppearance must be used within AppearanceProvider")
  }
  return context
}
