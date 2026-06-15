import type { ColorVisionPresetId } from "@/lib/themes/types"

export const COLOR_VISION_TOKEN_KEYS = [
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "ring",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "sidebar-primary",
  "sidebar-primary-foreground",
  "sidebar-accent",
  "sidebar-accent-foreground",
  "sidebar-ring",
] as const

type ColorVisionTokenKey = (typeof COLOR_VISION_TOKEN_KEYS)[number]
type ColorVisionTokenMap = Record<ColorVisionTokenKey, string>

const RED_GREEN_SAFE_LIGHT: ColorVisionTokenMap = {
  primary: "oklch(0.55 0.18 250)",
  "primary-foreground": "oklch(1 0 0)",
  secondary: "oklch(0.92 0.04 250)",
  "secondary-foreground": "oklch(0.45 0.12 230)",
  accent: "oklch(0.92 0.04 200)",
  "accent-foreground": "oklch(0.45 0.12 230)",
  destructive: "oklch(0.72 0.17 55)",
  ring: "oklch(0.55 0.18 250)",
  "chart-1": "oklch(0.55 0.18 250)",
  "chart-2": "oklch(0.72 0.17 55)",
  "chart-3": "oklch(0.62 0.14 190)",
  "chart-4": "oklch(0.35 0.04 250)",
  "chart-5": "oklch(0.72 0.01 250)",
  "sidebar-primary": "oklch(0.55 0.18 250)",
  "sidebar-primary-foreground": "oklch(1 0 0)",
  "sidebar-accent": "oklch(0.92 0.04 200)",
  "sidebar-accent-foreground": "oklch(0.45 0.12 230)",
  "sidebar-ring": "oklch(0.55 0.18 250)",
}

const RED_GREEN_SAFE_DARK: ColorVisionTokenMap = {
  primary: "oklch(0.68 0.14 250)",
  "primary-foreground": "oklch(1 0 0)",
  secondary: "oklch(0.32 0.06 250)",
  "secondary-foreground": "oklch(0.82 0.08 230)",
  accent: "oklch(0.32 0.06 230)",
  "accent-foreground": "oklch(0.82 0.08 200)",
  destructive: "oklch(0.78 0.14 55)",
  ring: "oklch(0.68 0.14 250)",
  "chart-1": "oklch(0.68 0.14 250)",
  "chart-2": "oklch(0.78 0.14 55)",
  "chart-3": "oklch(0.72 0.1 190)",
  "chart-4": "oklch(0.55 0.03 250)",
  "chart-5": "oklch(0.45 0.01 250)",
  "sidebar-primary": "oklch(0.68 0.14 250)",
  "sidebar-primary-foreground": "oklch(1 0 0)",
  "sidebar-accent": "oklch(0.32 0.06 230)",
  "sidebar-accent-foreground": "oklch(0.82 0.08 200)",
  "sidebar-ring": "oklch(0.68 0.14 250)",
}

const BLUE_YELLOW_SAFE_LIGHT: ColorVisionTokenMap = {
  primary: "oklch(0.55 0.2 330)",
  "primary-foreground": "oklch(1 0 0)",
  secondary: "oklch(0.92 0.04 330)",
  "secondary-foreground": "oklch(0.48 0.18 330)",
  accent: "oklch(0.92 0.04 330)",
  "accent-foreground": "oklch(0.48 0.18 330)",
  destructive: "oklch(0.58 0.22 15)",
  ring: "oklch(0.55 0.2 330)",
  "chart-1": "oklch(0.55 0.2 330)",
  "chart-2": "oklch(0.62 0.14 200)",
  "chart-3": "oklch(0.72 0.16 45)",
  "chart-4": "oklch(0.58 0.22 15)",
  "chart-5": "oklch(0.72 0.01 250)",
  "sidebar-primary": "oklch(0.55 0.2 330)",
  "sidebar-primary-foreground": "oklch(1 0 0)",
  "sidebar-accent": "oklch(0.92 0.04 330)",
  "sidebar-accent-foreground": "oklch(0.48 0.18 330)",
  "sidebar-ring": "oklch(0.55 0.2 330)",
}

const BLUE_YELLOW_SAFE_DARK: ColorVisionTokenMap = {
  primary: "oklch(0.68 0.16 330)",
  "primary-foreground": "oklch(1 0 0)",
  secondary: "oklch(0.32 0.08 330)",
  "secondary-foreground": "oklch(0.82 0.1 330)",
  accent: "oklch(0.32 0.08 330)",
  "accent-foreground": "oklch(0.82 0.1 330)",
  destructive: "oklch(0.72 0.16 15)",
  ring: "oklch(0.68 0.16 330)",
  "chart-1": "oklch(0.68 0.16 330)",
  "chart-2": "oklch(0.72 0.1 200)",
  "chart-3": "oklch(0.78 0.12 45)",
  "chart-4": "oklch(0.72 0.16 15)",
  "chart-5": "oklch(0.45 0.01 250)",
  "sidebar-primary": "oklch(0.68 0.16 330)",
  "sidebar-primary-foreground": "oklch(1 0 0)",
  "sidebar-accent": "oklch(0.32 0.08 330)",
  "sidebar-accent-foreground": "oklch(0.82 0.1 330)",
  "sidebar-ring": "oklch(0.68 0.16 330)",
}

const GRAYSCALE_LIGHT: ColorVisionTokenMap = {
  primary: "oklch(0.35 0 0)",
  "primary-foreground": "oklch(1 0 0)",
  secondary: "oklch(0.92 0 0)",
  "secondary-foreground": "oklch(0.35 0 0)",
  accent: "oklch(0.92 0 0)",
  "accent-foreground": "oklch(0.35 0 0)",
  destructive: "oklch(0.35 0 0)",
  ring: "oklch(0.45 0 0)",
  "chart-1": "oklch(0.25 0 0)",
  "chart-2": "oklch(0.4 0 0)",
  "chart-3": "oklch(0.55 0 0)",
  "chart-4": "oklch(0.7 0 0)",
  "chart-5": "oklch(0.85 0 0)",
  "sidebar-primary": "oklch(0.35 0 0)",
  "sidebar-primary-foreground": "oklch(1 0 0)",
  "sidebar-accent": "oklch(0.92 0 0)",
  "sidebar-accent-foreground": "oklch(0.35 0 0)",
  "sidebar-ring": "oklch(0.45 0 0)",
}

const GRAYSCALE_DARK: ColorVisionTokenMap = {
  primary: "oklch(0.85 0 0)",
  "primary-foreground": "oklch(0.15 0 0)",
  secondary: "oklch(0.28 0 0)",
  "secondary-foreground": "oklch(0.85 0 0)",
  accent: "oklch(0.28 0 0)",
  "accent-foreground": "oklch(0.85 0 0)",
  destructive: "oklch(0.85 0 0)",
  ring: "oklch(0.75 0 0)",
  "chart-1": "oklch(0.92 0 0)",
  "chart-2": "oklch(0.78 0 0)",
  "chart-3": "oklch(0.62 0 0)",
  "chart-4": "oklch(0.48 0 0)",
  "chart-5": "oklch(0.35 0 0)",
  "sidebar-primary": "oklch(0.85 0 0)",
  "sidebar-primary-foreground": "oklch(0.15 0 0)",
  "sidebar-accent": "oklch(0.28 0 0)",
  "sidebar-accent-foreground": "oklch(0.85 0 0)",
  "sidebar-ring": "oklch(0.75 0 0)",
}

const COLOR_VISION_PALETTES: Record<
  Exclude<ColorVisionPresetId, "none">,
  { light: ColorVisionTokenMap; dark: ColorVisionTokenMap }
> = {
  protanopia: { light: RED_GREEN_SAFE_LIGHT, dark: RED_GREEN_SAFE_DARK },
  deuteranopia: { light: RED_GREEN_SAFE_LIGHT, dark: RED_GREEN_SAFE_DARK },
  tritanopia: { light: BLUE_YELLOW_SAFE_LIGHT, dark: BLUE_YELLOW_SAFE_DARK },
  achromatopsia: { light: GRAYSCALE_LIGHT, dark: GRAYSCALE_DARK },
}

export function getColorVisionTokens(
  mode: ColorVisionPresetId,
  isDark: boolean,
): ColorVisionTokenMap | null {
  if (mode === "none") return null
  return COLOR_VISION_PALETTES[mode][isDark ? "dark" : "light"]
}

export function applyColorVisionTokens(
  root: HTMLElement,
  mode: ColorVisionPresetId,
  isDark: boolean,
) {
  const tokens = getColorVisionTokens(mode, isDark)
  if (!tokens) return

  for (const key of COLOR_VISION_TOKEN_KEYS) {
    root.style.setProperty(`--${key}`, tokens[key])
  }
}

export function clearColorVisionTokens(root: HTMLElement) {
  for (const key of COLOR_VISION_TOKEN_KEYS) {
    root.style.removeProperty(`--${key}`)
  }
}

/** Inline JS for FOUC prevention — keep in sync with COLOR_VISION_PALETTES */
export function buildColorVisionInitScriptFragment(
  storageKey: string,
): string {
  const serialize = (tokens: ColorVisionTokenMap) =>
    COLOR_VISION_TOKEN_KEYS.map((key) => `"${key}":"${tokens[key]}"`).join(",")

  const modes = Object.entries(COLOR_VISION_PALETTES)
    .map(
      ([mode, palette]) =>
        `${mode}:{light:{${serialize(palette.light)}},dark:{${serialize(palette.dark)}}}`,
    )
    .join(",")

  return `var cv=localStorage.getItem("${storageKey}")||"none";if(cv!=="none"){var palettes={${modes}};var palette=palettes[cv];if(palette){var isDark=root.classList.contains("dark");var tokens=isDark?palette.dark:palette.light;Object.keys(tokens).forEach(function(k){root.style.setProperty("--"+k,tokens[k]);});}}`
}
