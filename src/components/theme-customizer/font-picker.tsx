"use client"

import { FONT_FAMILY_BY_PRESET } from "@/lib/fonts/font-families"
import { cn } from "@/lib/utils"
import { FONT_PRESETS } from "@/lib/themes/registry"
import type { FontPresetId } from "@/lib/themes/types"

type FontPickerProps = {
  activeFont: FontPresetId
  onSelect: (font: FontPresetId) => void
}

export function FontPicker({ activeFont, onSelect }: FontPickerProps) {
  return (
    <div className="space-y-1">
      {FONT_PRESETS.map((preset) => {
        const isActive = preset.id === activeFont

        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelect(preset.id)}
            className={cn(
              "flex w-full items-center justify-between rounded-md border px-3 py-2 text-left transition-colors",
              isActive
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-transparent hover:bg-muted/50",
            )}
            style={{ fontFamily: FONT_FAMILY_BY_PRESET[preset.id] }}
          >
            <span className="text-sm font-medium">{preset.label}</span>
            <span className="truncate text-xs text-muted-foreground">{preset.sample}</span>
          </button>
        )
      })}
    </div>
  )
}
