export type NeutralPresetId = "zinc" | "slate" | "stone" | "gray" | "neutral"

export type BrandPresetId =
  | "default"
  | "red"
  | "rose"
  | "orange"
  | "amber"
  | "yellow"
  | "lime"
  | "green"
  | "emerald"
  | "teal"
  | "cyan"
  | "sky"
  | "blue"
  | "indigo"
  | "violet"
  | "purple"
  | "fuchsia"
  | "pink"
  | "claude"
  | "vercel"

export type ThemePresetId = BrandPresetId | NeutralPresetId

export type FontPresetId =
  | "geist"
  | "geist-pixel-square"
  | "geist-pixel-grid"
  | "geist-pixel-circle"
  | "geist-pixel-triangle"
  | "geist-pixel-line"
  | "inter"
  | "dm-sans"
  | "outfit"
  | "source-serif"
  | "jetbrains-mono"

export type RadiusPresetId = "default" | "soft" | "sharp"

export type ThemePresetCategory = "brand" | "neutral"

export type ThemePreset = {
  id: ThemePresetId
  label: string
  swatch: string
  category: ThemePresetCategory
  description?: string
  isBrand?: boolean
}

export type FontPreset = {
  id: FontPresetId
  label: string
  preview: string
  sample: string
}

export type RadiusPreset = {
  id: RadiusPresetId
  label: string
  value: string
}

export type AppearanceState = {
  palette: BrandPresetId
  neutral: NeutralPresetId | null
  font: FontPresetId
  radius: RadiusPresetId
}

export const APPEARANCE_STORAGE_KEYS = {
  palette: "appearance-palette",
  neutral: "appearance-neutral",
  font: "appearance-font",
  radius: "appearance-radius",
} as const

export const DEFAULT_APPEARANCE: AppearanceState = {
  palette: "default",
  neutral: "stone",
  font: "geist-pixel-square",
  radius: "default",
}
