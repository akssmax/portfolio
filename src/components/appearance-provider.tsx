"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

import {
  applyAppearanceToDocument,
  readAppearanceFromStorage,
  writeAppearanceToStorage,
} from "@/lib/themes/apply-appearance"
import { DEFAULT_APPEARANCE } from "@/lib/themes/registry"
import type {
  AppearanceState,
  BrandPresetId,
  FontPresetId,
  NeutralPresetId,
  RadiusPresetId,
} from "@/lib/themes/types"

type AppearanceContextValue = {
  appearance: AppearanceState
  setPalette: (palette: BrandPresetId) => void
  setNeutral: (neutral: NeutralPresetId | null) => void
  setFont: (font: FontPresetId) => void
  setRadius: (radius: RadiusPresetId) => void
  mounted: boolean
}

const AppearanceContext = createContext<AppearanceContextValue | null>(null)

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const [appearance, setAppearance] = useState<AppearanceState>(DEFAULT_APPEARANCE)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = readAppearanceFromStorage()
    setAppearance(stored)
    applyAppearanceToDocument(stored)
    setMounted(true)
  }, [])

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
      updateAppearance((prev) => ({ ...prev, palette }))
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

  const value = useMemo(
    () => ({
      appearance,
      setPalette,
      setNeutral,
      setFont,
      setRadius,
      mounted,
    }),
    [appearance, setPalette, setNeutral, setFont, setRadius, mounted],
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
