"use client"

import { cn } from "@/lib/utils"
import {
  BRAND_COLOR_PRESETS,
  DEFAULT_THEME_PRESET,
  NEUTRAL_THEME_PRESETS,
} from "@/lib/themes/registry"
import type {
  BrandPresetId,
  NeutralPresetId,
  ThemePreset,
} from "@/lib/themes/types"

type ColorPresetGridProps = {
  activeBrandPalette: BrandPresetId
  activeNeutralPalette: NeutralPresetId | null
  onBrandSelect: (palette: BrandPresetId) => void
  onNeutralSelect: (palette: NeutralPresetId) => void
}

function PresetButton({
  preset,
  isActive,
  onSelect,
}: {
  preset: ThemePreset
  isActive: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group flex flex-col items-center gap-1.5 rounded-lg border p-2 text-center transition-colors",
        isActive
          ? "border-primary bg-primary/5 ring-1 ring-primary"
          : "border-border hover:border-foreground/20 hover:bg-muted/50",
      )}
      title={preset.description ?? preset.label}
    >
      <span
        className="size-6 shrink-0 rounded-full ring-1 ring-foreground/10"
        style={{ backgroundColor: preset.swatch }}
      />
      <span className="w-full truncate text-[10px] font-medium leading-tight">
        {preset.label}
      </span>
      {preset.isBrand ? (
        <span className="rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-muted-foreground">
          Brand
        </span>
      ) : null}
    </button>
  )
}

function PresetGrid({
  presets,
  activePalette,
  onSelect,
}: {
  presets: ThemePreset[]
  activePalette: string | null
  onSelect: (id: string) => void
}) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {presets.map((preset) => (
        <PresetButton
          key={preset.id}
          preset={preset}
          isActive={preset.id === activePalette}
          onSelect={() => onSelect(preset.id)}
        />
      ))}
    </div>
  )
}

export function ColorPresetGrid({
  activeBrandPalette,
  activeNeutralPalette,
  onBrandSelect,
  onNeutralSelect,
}: ColorPresetGridProps) {
  const brandPresets = [DEFAULT_THEME_PRESET, ...BRAND_COLOR_PRESETS]

  return (
    <div className="max-h-72 space-y-4 overflow-y-auto pr-1">
      <div className="space-y-2">
        <p className="text-[11px] font-medium text-muted-foreground">Brand colors</p>
        <PresetGrid
          presets={brandPresets}
          activePalette={activeBrandPalette}
          onSelect={(id) => onBrandSelect(id as BrandPresetId)}
        />
      </div>

      <div className="space-y-2">
        <p className="text-[11px] font-medium text-muted-foreground">Neutrals</p>
        <PresetGrid
          presets={NEUTRAL_THEME_PRESETS}
          activePalette={activeNeutralPalette}
          onSelect={(id) => onNeutralSelect(id as NeutralPresetId)}
        />
      </div>
    </div>
  )
}
