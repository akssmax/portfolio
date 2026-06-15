"use client"

import { cn } from "@/lib/utils"
import { FONT_SCALE_PRESETS } from "@/lib/themes/registry"
import type { FontScalePresetId } from "@/lib/themes/types"

type FontScalePickerProps = {
  activeFontScale: FontScalePresetId
  onSelect: (fontScale: FontScalePresetId) => void
}

export function FontScalePicker({ activeFontScale, onSelect }: FontScalePickerProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {FONT_SCALE_PRESETS.map((preset) => {
        const isActive = preset.id === activeFontScale

        return (
          <button
            key={preset.id}
            type="button"
            aria-pressed={isActive}
            aria-label={`Text size ${preset.label}`}
            onClick={() => onSelect(preset.id)}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-lg border p-2 transition-colors",
              isActive
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-border hover:bg-muted/50",
            )}
          >
            <span
              className="font-medium leading-none text-foreground"
              style={{ fontSize: `${0.875 * preset.scale}rem` }}
            >
              Aa
            </span>
            <span className="text-xs font-medium">{preset.label}</span>
          </button>
        )
      })}
    </div>
  )
}
