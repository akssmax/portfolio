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

export type ColorVisionPresetId =
  | "none"
  | "protanopia"
  | "deuteranopia"
  | "tritanopia"
  | "achromatopsia"

export type FontScalePresetId = "100" | "112" | "125" | "150"

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

export type ColorVisionPreset = {
  id: ColorVisionPresetId
  label: string
  description: string
}

export type FontScalePreset = {
  id: FontScalePresetId
  label: string
  scale: number
}

export type AppearanceState = {
  palette: BrandPresetId
  neutral: NeutralPresetId | null
  font: FontPresetId
  radius: RadiusPresetId
  customBrandColor: string | null
  colorVision: ColorVisionPresetId
  fontScale: FontScalePresetId
}

export const APPEARANCE_STORAGE_KEYS = {
  palette: "appearance-palette",
  neutral: "appearance-neutral",
  font: "appearance-font",
  radius: "appearance-radius",
  customBrandColor: "appearance-custom-brand-color",
  colorVision: "appearance-color-vision",
  fontScale: "appearance-font-scale",
} as const

export const DEFAULT_APPEARANCE: AppearanceState = {
  palette: "default",
  neutral: "stone",
  font: "geist-pixel-square",
  radius: "default",
  customBrandColor: null,
  colorVision: "none",
  fontScale: "100",
}
