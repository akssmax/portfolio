"use client"

import type { ResumeDisplayPreferences } from "./resume-display-preferences"
import {
  MINIMAL_ACCENT_IMAGE_OPTIONS,
  type MinimalAccentImageId,
} from "./minimal-accent-utils"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

type ResumeDisplayControlsProps = {
  display: ResumeDisplayPreferences
  onChange: (display: ResumeDisplayPreferences) => void
}

function IconToggleRow({
  id,
  title,
  description,
  checked,
  onCheckedChange,
}: {
  id: string
  title: string
  description: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background px-3 py-3">
      <div className="min-w-0 space-y-1">
        <Label htmlFor={id} className="text-sm font-medium text-foreground">
          {title}
        </Label>
        <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-label={title}
      />
    </div>
  )
}

export function ResumeDisplayControls({
  display,
  onChange,
}: ResumeDisplayControlsProps) {
  const update = (patch: Partial<ResumeDisplayPreferences>) => {
    onChange({ ...display, ...patch })
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-foreground">Additional controls</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Optional resume chrome — icons and minimal layout accent image.
        </p>
      </div>
      <div className="space-y-3">
        <IconToggleRow
          id="resume-show-contact-icons"
          title="Contact icons"
          description="Show Lucide icons beside email, phone, and links."
          checked={display.showContactIcons}
          onCheckedChange={(checked) => update({ showContactIcons: checked })}
        />
        <IconToggleRow
          id="resume-show-section-icons"
          title="Section icons"
          description="Replace accent dots with icons on section headings."
          checked={display.showSectionIcons}
          onCheckedChange={(checked) => update({ showSectionIcons: checked })}
        />
        <IconToggleRow
          id="resume-show-minimal-accent-image"
          title="Minimal accent image"
          description="Show a faded image in the bottom-right corner on the last page of the minimal layout."
          checked={display.showMinimalAccentImage}
          onCheckedChange={(checked) => update({ showMinimalAccentImage: checked })}
        />

        {display.showMinimalAccentImage ? (
          <div className="space-y-4 rounded-lg border border-border bg-muted/20 px-3 py-3">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Accent image</Label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {(Object.entries(MINIMAL_ACCENT_IMAGE_OPTIONS) as Array<
                  [MinimalAccentImageId, (typeof MINIMAL_ACCENT_IMAGE_OPTIONS)[MinimalAccentImageId]]
                >).map(([id, option]) => {
                  const selected = display.minimalAccentImage === id
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => update({ minimalAccentImage: id })}
                      className={cn(
                        "rounded-lg border px-3 py-2.5 text-left transition-colors",
                        selected
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                          : "border-border bg-background hover:border-primary/30",
                      )}
                    >
                      <span className="block text-sm font-medium text-foreground">
                        {option.label}
                      </span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {option.description}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="resume-minimal-accent-fade" className="text-sm font-medium text-foreground">
                  Gradient fade
                </Label>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {display.minimalAccentFade}%
                </span>
              </div>
              <Slider
                id="resume-minimal-accent-fade"
                min={0}
                max={100}
                step={1}
                value={[display.minimalAccentFade]}
                onValueChange={(value) => update({ minimalAccentFade: value[0] ?? 65 })}
                aria-label="Gradient fade strength"
              />
              <p className="text-xs text-muted-foreground">
                Lower values keep more of the image visible; higher values add a stronger white gradient wash.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
