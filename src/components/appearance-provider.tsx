"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { useTheme } from "next-themes"

import {
  applyAppearanceToDocument,
  readAppearanceFromStorage,
  writeAppearanceToStorage,
} from "@/lib/themes/apply-appearance"
import { loadFontPreset } from "@/lib/themes/font-loader"
import { DEFAULT_APPEARANCE } from "@/lib/themes/registry"
import type {
  AppearanceState,
  BrandPresetId,
  ColorVisionPresetId,
  FontPresetId,
  FontScalePresetId,
  NeutralPresetId,
  RadiusPresetId,
} from "@/lib/themes/types"

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
}

const AppearanceContext = createContext<AppearanceContextValue | null>(null)

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const [appearance, setAppearance] = useState<AppearanceState>(DEFAULT_APPEARANCE)
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const stored = readAppearanceFromStorage()
    setAppearance(stored)
    void loadFontPreset(stored.font).then(() => {
      applyAppearanceToDocument(stored)
      setMounted(true)
    })
  }, [])

  useEffect(() => {
    if (!mounted) return
    applyAppearanceToDocument(appearance)
  }, [appearance, mounted, resolvedTheme])

  const updateAppearance = useCallback(
    (updater: (prev: AppearanceState) => AppearanceState) => {
      setAppearance((prev) => {
        const next = updater(prev)
        writeAppearanceToStorage(next)
        applyAppearanceToDocument(next)
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
