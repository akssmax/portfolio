"use client"

import { Palette } from "lucide-react"

import { useAppearance } from "@/components/appearance-provider"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CustomScrollbar } from "@/components/ui/custom-scrollbar"
import { Separator } from "@/components/ui/separator"

import { ColorPresetGrid } from "./theme-customizer/color-preset-grid"
import { ColorVisionPicker } from "./theme-customizer/color-vision-picker"
import { FontPicker } from "./theme-customizer/font-picker"
import { FontScalePicker } from "./theme-customizer/font-scale-picker"
import { ModePicker } from "./theme-customizer/mode-picker"
import { RadiusPicker } from "./theme-customizer/radius-picker"

export function ThemeCustomizer() {
  const {
    appearance,
    setPalette,
    setNeutral,
    setFont,
    setRadius,
    setColorVision,
    setFontScale,
    mounted,
  } = useAppearance()

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

        <Accordion type="multiple" className="space-y-0">
          <AccordionItem value="font" className="border-none">
            <AccordionTrigger className="py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground hover:no-underline">
              Font
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              <FontPicker activeFont={appearance.font} onSelect={setFont} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="radius" className="border-none">
            <AccordionTrigger className="py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground hover:no-underline">
              Radius
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              <RadiusPicker activeRadius={appearance.radius} onSelect={setRadius} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="accessibility" className="border-none">
            <AccordionTrigger className="py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground hover:no-underline">
              Accessibility
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pb-2">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Color vision</p>
                <ColorVisionPicker
                  activeColorVision={appearance.colorVision}
                  onSelect={setColorVision}
                />
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Text size</p>
                <FontScalePicker
                  activeFontScale={appearance.fontScale}
                  onSelect={setFontScale}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

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
