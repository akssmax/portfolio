import type { FontPresetId } from "@/lib/themes/types"

export const FONT_FAMILY_BY_PRESET: Record<FontPresetId, string> = {
  geist: '"Geist Variable", sans-serif',
  "geist-pixel-square": '"Geist Pixel Square", monospace',
  "geist-pixel-grid": '"Geist Pixel Grid", monospace',
  "geist-pixel-circle": '"Geist Pixel Circle", monospace',
  "geist-pixel-triangle": '"Geist Pixel Triangle", monospace',
  "geist-pixel-line": '"Geist Pixel Line", monospace',
  inter: '"Inter Variable", sans-serif',
  "dm-sans": '"DM Sans Variable", sans-serif',
  outfit: '"Outfit Variable", sans-serif',
  "source-serif": '"Source Serif 4 Variable", serif',
  "jetbrains-mono": '"JetBrains Mono Variable", monospace',
}
