"use client"

import { Plus, RotateCcw, Trash2 } from "lucide-react"

import { createDefaultQuoteDocument } from "./default-quote"
import type { QuoteDocument, QuoteMilestone } from "./types"
import { ResumeFontSelect } from "@/features/resume/resume-font-select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"


type QuoteBuilderControlsProps = {
  document: QuoteDocument
  onChange: (document: QuoteDocument) => void
}

function ControlGroup({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3 border-b border-border pb-5">
      <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
        {title}
      </h3>
      {children}
    </section>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  )
}

function StringListEditor({
  label,
  items,
  placeholder,
  onChange,
}: {
  label: string
  items: Array<string>
  placeholder: string
  onChange: (items: Array<string>) => void
}) {
  const updateItem = (index: number, value: string) => {
    onChange(items.map((item, itemIndex) => (itemIndex === index ? value : item)))
  }

  const removeItem = (index: number) => {
    onChange(items.filter((_, itemIndex) => itemIndex !== index))
  }

  return (
    <Field label={label}>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={item}
              placeholder={placeholder}
              onChange={(event) => updateItem(index, event.target.value)}
              className="text-xs"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
              onClick={() => removeItem(index)}
              aria-label={`Remove item ${index + 1}`}
            >
              <Trash2 aria-hidden />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full border-dashed text-xs"
          onClick={() => onChange([...items, ""])}
        >
          <Plus aria-hidden />
          Add item
        </Button>
      </div>
    </Field>
  )
}

export function QuoteBuilderControls({ document, onChange }: QuoteBuilderControlsProps) {
  const patch = (updates: Partial<QuoteDocument>) =>
    onChange({ ...document, ...updates })

  const updateMilestone = (index: number, updates: Partial<QuoteMilestone>) => {
    patch({
      milestones: document.milestones.map((milestone, milestoneIndex) =>
        milestoneIndex === index ? { ...milestone, ...updates } : milestone,
      ),
    })
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-4 py-3">
        <p className="text-sm font-medium text-foreground">Quotation details</p>
        <p className="text-xs text-muted-foreground">
          Edits save automatically and update the preview.
        </p>
      </div>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-5">
        <ControlGroup title="Project">
          <div className="grid grid-cols-2 gap-2">
            <Field label="Quote number">
              <Input
                value={document.quoteNumber}
                onChange={(event) => patch({ quoteNumber: event.target.value })}
                className="text-xs"
              />
            </Field>
            <Field label="Date">
              <Input
                value={document.date}
                onChange={(event) => patch({ date: event.target.value })}
                className="text-xs"
              />
            </Field>
          </div>
          <Field label="Client company">
            <Input
              value={document.clientCompany}
              onChange={(event) => patch({ clientCompany: event.target.value })}
              className="text-xs"
            />
          </Field>
          <Field label="Project title">
            <Input
              value={document.projectTitle}
              onChange={(event) => patch({ projectTitle: event.target.value })}
              className="text-xs"
            />
          </Field>
          <Field label="Font">
            <ResumeFontSelect
              value={document.font}
              onChange={(font) => patch({ font })}
            />
          </Field>
          <Field label="Overview (blank line = new paragraph)">
            <Textarea
              value={document.overview}
              rows={6}
              onChange={(event) => patch({ overview: event.target.value })}
              className="text-xs"
            />
          </Field>
        </ControlGroup>

        <ControlGroup title="Scope of work">
          <StringListEditor
            label="Deliverables"
            items={document.scope}
            placeholder="e.g. UI/UX design — desktop, tablet, mobile"
            onChange={(scope) => patch({ scope })}
          />
        </ControlGroup>

        <ControlGroup title="Exclusions">
          <StringListEditor
            label="Not included"
            items={document.exclusions}
            placeholder="e.g. Hosting/domain"
            onChange={(exclusions) => patch({ exclusions })}
          />
        </ControlGroup>

        <ControlGroup title="Timeline">
          <Field label="Duration">
            <Input
              value={document.timeline}
              onChange={(event) => patch({ timeline: event.target.value })}
              className="text-xs"
            />
          </Field>
          <Field label="Note / conditions">
            <Textarea
              value={document.timelineNote}
              rows={3}
              onChange={(event) => patch({ timelineNote: event.target.value })}
              className="text-xs"
            />
          </Field>
        </ControlGroup>

        <ControlGroup title="Investment">
          <div className="flex items-end gap-3">
            <Field label="Amount">
              <Input
                value={document.investmentAmount}
                onChange={(event) => patch({ investmentAmount: event.target.value })}
                className="text-xs"
              />
            </Field>
            <label className="flex h-8 items-center gap-2 text-xs text-muted-foreground">
              <Checkbox
                checked={document.investmentGst}
                onCheckedChange={(checked) => patch({ investmentGst: checked === true })}
              />
              + GST
            </label>
          </div>

          <Field label="Payment milestones">
            <div className="space-y-2">
              {document.milestones.map((milestone, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={milestone.percent}
                    onChange={(event) =>
                      updateMilestone(index, {
                        percent: Number.parseInt(event.target.value, 10) || 0,
                      })
                    }
                    className="w-16 shrink-0 text-xs"
                    aria-label={`Milestone ${index + 1} percent`}
                  />
                  <span className="shrink-0 text-xs text-muted-foreground">%</span>
                  <Input
                    value={milestone.label}
                    placeholder="On kickoff"
                    onChange={(event) => updateMilestone(index, { label: event.target.value })}
                    className="text-xs"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() =>
                      patch({
                        milestones: document.milestones.filter(
                          (_, milestoneIndex) => milestoneIndex !== index,
                        ),
                      })
                    }
                    aria-label={`Remove milestone ${index + 1}`}
                  >
                    <Trash2 aria-hidden />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full border-dashed text-xs"
                onClick={() =>
                  patch({
                    milestones: [...document.milestones, { label: "", percent: 0 }],
                  })
                }
              >
                <Plus aria-hidden />
                Add milestone
              </Button>
            </div>
          </Field>
        </ControlGroup>

        <ControlGroup title="Post-launch support">
          <Field label="Support terms">
            <Textarea
              value={document.support}
              rows={2}
              onChange={(event) => patch({ support: event.target.value })}
              className="text-xs"
            />
          </Field>
        </ControlGroup>
      </div>

      <div className="border-t border-border px-4 py-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full text-xs"
          onClick={() => onChange(createDefaultQuoteDocument())}
        >
          <RotateCcw aria-hidden />
          Reset to default quote
        </Button>
      </div>
    </div>
  )
}
