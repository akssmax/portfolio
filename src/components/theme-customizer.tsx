"use client"

import { Palette } from "lucide-react"

import { useAppearance } from "@/components/appearance-provider"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CustomScrollbar } from "@/components/ui/custom-scrollbar"
import { Separator } from "@/components/ui/separator"

import { ColorPresetGrid } from "./theme-customizer/color-preset-grid"
import { FontPicker } from "./theme-customizer/font-picker"
import { ModePicker } from "./theme-customizer/mode-picker"
import { RadiusPicker } from "./theme-customizer/radius-picker"

export function ThemeCustomizer() {
  const { appearance, setPalette, setNeutral, setFont, setRadius, mounted } =
    useAppearance()

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled aria-label="Customize theme">
        <Palette className="size-4" />
      </Button>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Customize theme">
          <Palette className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <CustomScrollbar className="flex max-h-[min(85vh,640px)] flex-col gap-4 p-4">
        <div className="space-y-1">
          <p className="text-sm font-semibold">Theme</p>
          <p className="text-xs text-muted-foreground">
            Preview branding across colors, fonts, and radius.
          </p>
        </div>

        <Separator />

        <section className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Colors
          </p>
          <ColorPresetGrid
            activeBrandPalette={appearance.palette}
            activeNeutralPalette={appearance.neutral}
            onBrandSelect={setPalette}
            onNeutralSelect={setNeutral}
          />
        </section>

        <Separator />

        <section className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Font
          </p>
          <FontPicker activeFont={appearance.font} onSelect={setFont} />
        </section>

        <Separator />

        <section className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Radius
          </p>
          <RadiusPicker activeRadius={appearance.radius} onSelect={setRadius} />
        </section>

        <Separator />

        <section className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Mode
          </p>
          <ModePicker />
        </section>
        </CustomScrollbar>
      </PopoverContent>
    </Popover>
  )
}
