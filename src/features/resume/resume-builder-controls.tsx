"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useBrandColors } from "@/hooks/use-brand-colors"
import type { BrandPresetId } from "@/lib/themes/types"
import { cn } from "@/lib/utils"

import { cssColorWithAlpha } from "./color-utils"
import { DEFAULT_RESUME_SECTIONS } from "./default-sections"
import {
  DEFAULT_RESUME_LAYOUT,
  RESUME_LAYOUT_OPTIONS,
} from "./layout-options"
import {
  ResumeBrandColorPicker,
  type ResumeBrandColorSelection,
} from "./resume-brand-color-picker"
import { RESUME_SECTION_OPTIONS } from "./resume-section-options"
import type { ResumeLayoutId, ResumeSectionConfig, ResumeSectionId } from "./types"

function LayoutPreview({
  layout,
  brandColor,
}: {
  layout: ResumeLayoutId
  brandColor: string
}) {
  if (layout === "designer") {
    return (
      <div className="relative h-16 overflow-hidden rounded-md border border-border bg-background">
        <div
          className="absolute inset-y-0 left-0 w-1.5"
          style={{ backgroundColor: brandColor }}
        />
        <div
          className="ml-3 mt-2 h-7 rounded-sm px-2"
          style={{ backgroundColor: cssColorWithAlpha(brandColor, 0.09), width: "78%" }}
        >
          <div className="flex items-center gap-1.5 pt-1.5">
            <div
              className="size-2.5 rounded-[2px]"
              style={{ backgroundColor: brandColor }}
            />
            <div className="h-1.5 w-10 rounded-full bg-foreground/70" />
          </div>
        </div>
        <div className="ml-3 mt-2 space-y-1.5">
          <div className="flex items-center gap-1">
            <div
              className="h-0.5 w-2 rounded-full"
              style={{ backgroundColor: brandColor }}
            />
            <div className="h-1 w-8 rounded-full bg-foreground/40" />
          </div>
          <div className="h-1 w-14 rounded-full bg-foreground/20" />
        </div>
      </div>
    )
  }

  return (
    <div className="h-16 rounded-md border border-border bg-background px-3 py-2">
      <div
        className="h-1 w-12 rounded-full"
        style={{ backgroundColor: brandColor }}
      />
      <div className="mt-2 h-1 w-16 rounded-full bg-foreground/50" />
      <div className="mt-3 h-0.5 w-full bg-border" />
      <div className="mt-2 h-1 w-10 rounded-full bg-foreground/30" />
      <div className="mt-1.5 h-1 w-14 rounded-full bg-foreground/20" />
    </div>
  )
}

export type ResumeBuilderControlsProps = {
  layout: ResumeLayoutId
  onLayoutChange: (layout: ResumeLayoutId) => void
  sections: ResumeSectionConfig
  onSectionsChange: (sections: ResumeSectionConfig) => void
  colorSelection: ResumeBrandColorSelection
  onColorSelectionChange: (selection: ResumeBrandColorSelection) => void
  brandColor: string
}

export function hasEnabledSection(sections: ResumeSectionConfig) {
  return Object.values(sections).some(Boolean)
}

export function ResumeBuilderControls({
  layout,
  onLayoutChange,
  sections,
  onSectionsChange,
  colorSelection,
  onColorSelectionChange,
  brandColor,
}: ResumeBuilderControlsProps) {
  const { primary } = useBrandColors()

  const toggleSection = (sectionId: ResumeSectionId, checked: boolean) => {
    onSectionsChange({ ...sections, [sectionId]: checked })
  }

  return (
    <div className="flex h-full min-w-0 w-full flex-col">
      <div className="border-b border-border px-5 py-5">
        <h1 className="text-lg font-semibold text-foreground">Resume builder</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tune layout, sections, and brand color. Preview updates live on the
          right.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        <section className="space-y-3">
          <div>
            <p className="text-sm font-medium text-foreground">Layout</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Classic for ATS scans. Designer for branded applications.
            </p>
          </div>
          <RadioGroup
            value={layout}
            onValueChange={(value) => onLayoutChange(value as ResumeLayoutId)}
            className="grid gap-3"
          >
            {RESUME_LAYOUT_OPTIONS.map((option) => (
              <label
                key={option.id}
                htmlFor={`resume-builder-layout-${option.id}`}
                className={cn(
                  "cursor-pointer rounded-lg border bg-background p-3 transition-colors",
                  layout === option.id
                    ? "border-primary ring-1 ring-primary/30"
                    : "border-border hover:border-primary/40",
                )}
              >
                <div className="flex items-start gap-3">
                  <RadioGroupItem
                    id={`resume-builder-layout-${option.id}`}
                    value={option.id}
                    className="mt-0.5"
                  />
                  <span className="min-w-0 flex-1 space-y-2">
                    <span className="block space-y-1">
                      <span className="block text-sm font-medium text-foreground">
                        {option.label}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {option.description}
                      </span>
                    </span>
                    <LayoutPreview layout={option.id} brandColor={brandColor} />
                  </span>
                </div>
              </label>
            ))}
          </RadioGroup>
        </section>

        <Separator className="my-5" />

        <section className="space-y-3">
          <div>
            <p className="text-sm font-medium text-foreground">Sections</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Include only what fits the role or company.
            </p>
          </div>
          <div className="grid gap-3">
            {RESUME_SECTION_OPTIONS.map((section) => (
              <label
                key={section.id}
                htmlFor={`resume-builder-section-${section.id}`}
                className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-background px-3 py-3"
              >
                <Checkbox
                  id={`resume-builder-section-${section.id}`}
                  checked={sections[section.id]}
                  onCheckedChange={(checked) =>
                    toggleSection(section.id, checked === true)
                  }
                />
                <span className="min-w-0 space-y-1">
                  <span className="block text-sm font-medium text-foreground">
                    {section.label}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {section.description}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </section>

        <Separator className="my-5" />

        <section className="space-y-3">
          <div>
            <Label>Brand color</Label>
            <p className="mt-1 text-xs text-muted-foreground">
              Preset accents from the theme system, or a custom color for this
              resume.
            </p>
          </div>
          <ResumeBrandColorPicker
            value={colorSelection}
            onChange={onColorSelectionChange}
            fallbackColor={primary}
          />
        </section>
      </div>
    </div>
  )
}

export function createInitialResumeBuilderState(appearance: {
  palette: BrandPresetId
  customBrandColor: string | null
}): {
  layout: ResumeLayoutId
  sections: ResumeSectionConfig
  colorSelection: ResumeBrandColorSelection
} {
  return {
    layout: DEFAULT_RESUME_LAYOUT,
    sections: DEFAULT_RESUME_SECTIONS,
    colorSelection: appearance.customBrandColor
      ? { type: "custom", hex: appearance.customBrandColor }
      : { type: "preset", presetId: appearance.palette },
  }
}
