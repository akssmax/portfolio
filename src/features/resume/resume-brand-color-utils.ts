import {
  isValidHexColor,
  normalizeHex,
} from "@/features/brand-color/derive-brand-tokens"
import {
  BRAND_COLOR_PRESETS,
  DEFAULT_THEME_PRESET,
} from "@/lib/themes/registry"
import { resolveCssColorToHex } from "@/lib/themes/resolve-colors"
import type { BrandPresetId } from "@/lib/themes/types"

export type ResumeBrandColorSelection =
  | { type: "preset"; presetId: BrandPresetId }
  | { type: "custom"; hex: string }

export const RESUME_BRAND_PRESETS = [DEFAULT_THEME_PRESET, ...BRAND_COLOR_PRESETS]

const presetHexCache = new Map<BrandPresetId, string>()

export function getResumeColorSelectionKey(
  selection: ResumeBrandColorSelection,
): string {
  return selection.type === "preset"
    ? `preset:${selection.presetId}`
    : `custom:${selection.hex}`
}

export function resolveResumeBrandColor(
  selection: ResumeBrandColorSelection,
  fallbackColor: string,
): string {
  if (selection.type === "custom") {
    return normalizeHex(selection.hex) ?? fallbackColor
  }

  const cached = presetHexCache.get(selection.presetId)
  if (cached) return cached

  const preset = RESUME_BRAND_PRESETS.find((item) => item.id === selection.presetId)
  if (!preset) return fallbackColor

  if (typeof document === "undefined") return preset.swatch

  const hex = resolveCssColorToHex(preset.swatch, preset.swatch)
  presetHexCache.set(selection.presetId, hex)
  return hex
}

export function isResumeBrandColorValid(
  selection: ResumeBrandColorSelection,
): boolean {
  if (selection.type === "preset") return true
  return isValidHexColor(selection.hex)
}
