import type { FontPresetId } from "./types"

const loadedFonts = new Set<FontPresetId>()

const FONT_LOADERS: Partial<Record<FontPresetId, () => Promise<unknown>>> = {
  geist: () => import("@fontsource-variable/geist"),
  inter: () => import("@fontsource-variable/inter"),
  "dm-sans": () => import("@fontsource-variable/dm-sans"),
  outfit: () => import("@fontsource-variable/outfit"),
  "source-serif": () => import("@fontsource-variable/source-serif-4"),
  "jetbrains-mono": () => import("@fontsource-variable/jetbrains-mono"),
}

const GEIST_PIXEL_FONT_IDS = new Set<FontPresetId>([
  "geist-pixel-square",
  "geist-pixel-grid",
  "geist-pixel-circle",
  "geist-pixel-triangle",
  "geist-pixel-line",
])

export async function loadFontPreset(font: FontPresetId): Promise<void> {
  if (loadedFonts.has(font) || GEIST_PIXEL_FONT_IDS.has(font)) return

  const loader = FONT_LOADERS[font]
  if (!loader) return

  await loader()
  loadedFonts.add(font)
}

export function preloadFontPreset(font: FontPresetId): void {
  void loadFontPreset(font)
}
