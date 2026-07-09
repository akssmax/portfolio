import { THEME_PRESET_DATA, NEUTRAL_THEME_PRESET_IDS } from "./theme-data"
import type {
  AppearanceState,
  BrandPresetId,
  ColorVisionPreset,
  ColorVisionPresetId,
  FontPreset,
  FontPresetId,
  FontScalePreset,
  FontScalePresetId,
  NeutralPresetId,
  RadiusPreset,
  RadiusPresetId,
  ThemePreset,
  ThemePresetId,
} from "./types"
import { DEFAULT_APPEARANCE } from "./types"

export const DEFAULT_THEME_LIGHT_SWATCH = "oklch(0.696 0.17 162.48)"
export const DEFAULT_THEME_DARK_SWATCH = "oklch(0.653 0.234 21.609)"

export const DEFAULT_THEME_PRESET: ThemePreset = {
  id: "default",
  label: "Default",
  swatch: DEFAULT_THEME_LIGHT_SWATCH,
  category: "brand",
  description: "Emerald in light mode, brand accent in dark mode",
  isBrand: true,
}

export const NEUTRAL_THEME_PRESETS: ThemePreset[] = [
  { id: "zinc", label: "Zinc", swatch: "oklch(0.552 0.016 285.938)", category: "neutral" },
  { id: "slate", label: "Slate", swatch: "oklch(0.554 0.046 257.417)", category: "neutral" },
  { id: "stone", label: "Stone", swatch: "oklch(0.553 0.013 58.071)", category: "neutral" },
  { id: "gray", label: "Gray", swatch: "oklch(0.551 0.027 264.364)", category: "neutral" },
  { id: "neutral", label: "Neutral", swatch: "oklch(0.556 0 0)", category: "neutral" },
]

export const BRAND_COLOR_PRESETS: ThemePreset[] = [
  ...THEME_PRESET_DATA.filter((preset) => !NEUTRAL_THEME_PRESET_IDS.has(preset.id)).map(
    (preset) => ({
      id: preset.id as ThemePresetId,
      label: preset.label,
      swatch: preset.swatch,
      category: "brand" as const,
      description: preset.description,
    }),
  ),
]

export const THEME_PRESETS: ThemePreset[] = [
  DEFAULT_THEME_PRESET,
  ...BRAND_COLOR_PRESETS,
  ...NEUTRAL_THEME_PRESETS,
]

export const FONT_PRESETS: FontPreset[] = [
  {
    id: "geist",
    label: "Geist",
    preview: "Geist Variable",
    sample: "The quick brown fox",
  },
  {
    id: "geist-pixel-square",
    label: "Geist Pixel Square",
    preview: "Geist Pixel Square",
    sample: "Pixel type",
  },
  {
    id: "geist-pixel-grid",
    label: "Geist Pixel Grid",
    preview: "Geist Pixel Grid",
    sample: "Pixel type",
  },
  {
    id: "geist-pixel-circle",
    label: "Geist Pixel Circle",
    preview: "Geist Pixel Circle",
    sample: "Pixel type",
  },
  {
    id: "geist-pixel-triangle",
    label: "Geist Pixel Triangle",
    preview: "Geist Pixel Triangle",
    sample: "Pixel type",
  },
  {
    id: "geist-pixel-line",
    label: "Geist Pixel Line",
    preview: "Geist Pixel Line",
    sample: "Pixel type",
  },
  {
    id: "inter",
    label: "Inter",
    preview: "Inter Variable",
    sample: "The quick brown fox",
  },
  {
    id: "dm-sans",
    label: "DM Sans",
    preview: "DM Sans Variable",
    sample: "The quick brown fox",
  },
  {
    id: "outfit",
    label: "Outfit",
    preview: "Outfit Variable",
    sample: "The quick brown fox",
  },
  {
    id: "source-serif",
    label: "Source Serif 4",
    preview: "Source Serif 4 Variable",
    sample: "The quick brown fox",
  },
  {
    id: "jetbrains-mono",
    label: "JetBrains Mono",
    preview: "JetBrains Mono Variable",
    sample: "const theme = true",
  },
]

export const RADIUS_PRESETS: RadiusPreset[] = [
  { id: "default", label: "Default", value: "0.625rem" },
  { id: "soft", label: "Soft", value: "0.875rem" },
  { id: "sharp", label: "Sharp", value: "0.375rem" },
]

export const COLOR_VISION_PRESETS: ColorVisionPreset[] = [
  {
    id: "none",
    label: "None",
    description: "Default theme colors",
  },
  {
    id: "protanopia",
    label: "Protanopia",
    description: "Red–green safe palette",
  },
  {
    id: "deuteranopia",
    label: "Deuteranopia",
    description: "Red–green safe palette",
  },
  {
    id: "tritanopia",
    label: "Tritanopia",
    description: "Blue–yellow safe palette",
  },
  {
    id: "achromatopsia",
    label: "Achromatopsia",
    description: "High-contrast grayscale charts",
  },
]

export const FONT_SCALE_PRESETS: FontScalePreset[] = [
  { id: "100", label: "100%", scale: 1 },
  { id: "112", label: "112%", scale: 1.12 },
  { id: "125", label: "125%", scale: 1.25 },
  { id: "150", label: "150%", scale: 1.5 },
]

export function isThemePresetId(value: string): value is ThemePresetId {
  return THEME_PRESETS.some((preset) => preset.id === value)
}

export function isBrandPresetId(value: string): value is BrandPresetId {
  return BRAND_COLOR_PRESETS.some((preset) => preset.id === value) || value === "default"
}

export function isNeutralPresetId(value: string): value is NeutralPresetId {
  return NEUTRAL_THEME_PRESETS.some((preset) => preset.id === value)
}

export function isFontPresetId(value: string): value is FontPresetId {
  return FONT_PRESETS.some((preset) => preset.id === value)
}

export function isRadiusPresetId(value: string): value is RadiusPresetId {
  return RADIUS_PRESETS.some((preset) => preset.id === value)
}

export function isColorVisionPresetId(value: string): value is ColorVisionPresetId {
  return COLOR_VISION_PRESETS.some((preset) => preset.id === value)
}

export function isFontScalePresetId(value: string): value is FontScalePresetId {
  return FONT_SCALE_PRESETS.some((preset) => preset.id === value)
}

export function parseAppearanceState(
  partial?: {
    palette?: string | null
    neutral?: string | null
    font?: string | null
    radius?: string | null
    customBrandColor?: string | null
    colorVision?: string | null
    fontScale?: string | null
  },
): AppearanceState {
  const storedNeutral =
    partial?.neutral && isNeutralPresetId(partial.neutral) ? partial.neutral : null

  let palette: BrandPresetId = DEFAULT_APPEARANCE.palette
  let neutral: NeutralPresetId | null =
    storedNeutral ?? DEFAULT_APPEARANCE.neutral

  if (partial?.palette && isThemePresetId(partial.palette)) {
    if (isNeutralPresetId(partial.palette)) {
      neutral = storedNeutral ?? partial.palette
    } else if (isBrandPresetId(partial.palette)) {
      palette = partial.palette
    }
  }

  const customBrandColor =
    partial?.customBrandColor &&
    /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(partial.customBrandColor.trim())
      ? partial.customBrandColor.trim().length === 4
        ? `#${partial.customBrandColor[1]}${partial.customBrandColor[1]}${partial.customBrandColor[2]}${partial.customBrandColor[2]}${partial.customBrandColor[3]}${partial.customBrandColor[3]}`.toUpperCase()
        : partial.customBrandColor.trim().toUpperCase()
      : null

  return {
    palette,
    neutral,
    font:
      partial?.font && isFontPresetId(partial.font)
        ? partial.font
        : DEFAULT_APPEARANCE.font,
    radius:
      partial?.radius && isRadiusPresetId(partial.radius)
        ? partial.radius
        : DEFAULT_APPEARANCE.radius,
    customBrandColor,
    colorVision:
      partial?.colorVision && isColorVisionPresetId(partial.colorVision)
        ? partial.colorVision
        : DEFAULT_APPEARANCE.colorVision,
    fontScale:
      partial?.fontScale && isFontScalePresetId(partial.fontScale)
        ? partial.fontScale
        : DEFAULT_APPEARANCE.fontScale,
  }
}

export { DEFAULT_APPEARANCE }
