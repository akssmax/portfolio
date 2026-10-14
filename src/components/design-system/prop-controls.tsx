import { useEffect, useId, useState } from "react"
import { ChevronRight, RotateCcw } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import type { PropDoc } from "@/lib/design-system/docs"

function JsonControl({
  value,
  onChange,
  name,
}: {
  value: unknown
  onChange: (value: unknown) => void
  name: string
}) {
  const format = (input: unknown) => {
    try {
      return input === undefined ? "" : JSON.stringify(input, null, 2)
    } catch {
      return ""
    }
  }
  const [draft, setDraft] = useState(() => format(value))
  const [error, setError] = useState("")
  useEffect(() => {
    setDraft(format(value))
    setError("")
  }, [value])
  function apply() {
    try {
      onChange(draft.trim() ? JSON.parse(draft) : undefined)
      setError("")
    } catch {
      setError("Enter valid JSON before applying.")
    }
  }
  return (
    <div className="space-y-2">
      <textarea
        aria-label={`${name} prop JSON`}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="JSON value from the example"
        rows={4}
        spellCheck={false}
        className="w-full resize-y rounded-md border border-input bg-background p-2 font-mono text-[10px] leading-5 outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <div className="flex items-center justify-between">
        <span role="status" className="text-[10px] text-destructive">
          {error}
        </span>
        <button
          type="button"
          onClick={apply}
          className="rounded-md border border-border bg-background px-2 py-1 text-[10px] font-medium hover:bg-muted"
        >
          Apply JSON
        </button>
      </div>
    </div>
  )
}

function parsedDefault(prop: PropDoc) {
  try {
    return prop.defaultValue === null
      ? undefined
      : JSON.parse(prop.defaultValue)
  } catch {
    return undefined
  }
}

function isAdvanced(prop: PropDoc) {
  return (
    ["className", "style", "wrapperClassName"].includes(prop.name) ||
    ["json", "event", "readonly"].includes(prop.control?.kind ?? "readonly")
  )
}

export function PropControls({
  props,
  values,
  observed,
  onChange,
}: {
  props: PropDoc[]
  values: Record<string, unknown>
  observed: Record<string, unknown>
  onChange: (name: string, value: unknown) => void
}) {
  const [filter, setFilter] = useState("")
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const advancedId = useId()
  const primary = props.filter((prop) => !isAdvanced(prop))
  const advanced = props.filter(isAdvanced)
  const showFilter =
    primary.length >= 12 || (advancedOpen && props.length >= 12)
  const query = showFilter ? filter.trim().toLowerCase() : ""
  const matches = (prop: PropDoc) => prop.name.toLowerCase().includes(query)
  const visiblePrimary = primary.filter(matches)
  const visibleAdvanced = advanced.filter(matches)
  const showAdvanced = advancedOpen || (!!query && visibleAdvanced.length > 0)
  const advancedChanges = advanced.filter((prop) =>
    Object.hasOwn(values, prop.name)
  )

  function renderControl(prop: PropDoc) {
    const control = prop.control ?? { kind: "readonly" as const }
    const modified = Object.hasOwn(values, prop.name)
    const value = modified
      ? values[prop.name]
      : (observed[prop.name] ?? parsedDefault(prop))
    const id = `playground-prop-${prop.name}`
    const fieldClass =
      "h-8 w-full min-w-0 rounded-md border border-input bg-background px-2 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
    return (
      <div key={prop.name} className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <label
            htmlFor={id}
            title={prop.description}
            className="truncate font-mono text-[11px] font-medium"
          >
            {prop.name}
            {prop.required && (
              <span className="ml-0.5 text-muted-foreground">*</span>
            )}
          </label>
          {modified ? (
            <button
              type="button"
              aria-label={`Reset ${prop.name} prop`}
              onClick={() => onChange(prop.name, undefined)}
              className="rounded p-1 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="size-3" />
            </button>
          ) : (
            <span className="text-[9px] text-muted-foreground">
              {control.kind === "event"
                ? "Callback"
                : control.kind === "readonly"
                  ? "Code"
                  : observed[prop.name] !== undefined
                    ? "Example"
                    : prop.defaultValue !== null
                      ? "Default"
                      : "Optional"}
            </span>
          )}
        </div>
        {control.kind === "enum" ? (
          <select
            id={id}
            aria-label={`${prop.name} prop`}
            value={modified ? JSON.stringify(value) : "__inherit__"}
            onChange={(event) =>
              onChange(
                prop.name,
                event.target.value === "__inherit__"
                  ? undefined
                  : JSON.parse(event.target.value)
              )
            }
            className={fieldClass}
          >
            <option value="__inherit__">
              {value !== undefined
                ? `${String(value)} · example`
                : "From example"}
            </option>
            {control.options?.map((option) => (
              <option
                key={JSON.stringify(option)}
                value={JSON.stringify(option)}
              >
                {String(option)}
              </option>
            ))}
          </select>
        ) : control.kind === "boolean" ? (
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">
              {value === undefined ? "Not set" : String(value)}
            </span>
            <Switch
              id={id}
              aria-label={`${prop.name} prop`}
              checked={value === true}
              onCheckedChange={(next) => onChange(prop.name, next)}
            />
          </div>
        ) : control.kind === "date" ? (
          <input
            id={id}
            aria-label={`${prop.name} prop`}
            type="date"
            value={
              value instanceof Date
                ? `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`
                : ""
            }
            onChange={(event) =>
              onChange(
                prop.name,
                event.target.value
                  ? new Date(`${event.target.value}T12:00:00`)
                  : undefined
              )
            }
            className={fieldClass}
          />
        ) : control.kind === "number" ? (
          <input
            id={id}
            aria-label={`${prop.name} prop`}
            type="number"
            step="any"
            value={typeof value === "number" ? value : ""}
            placeholder="From example"
            onChange={(event) => {
              const next = event.target.valueAsNumber
              onChange(prop.name, Number.isFinite(next) ? next : undefined)
            }}
            className={fieldClass}
          />
        ) : control.kind === "text" ? (
          <input
            id={id}
            aria-label={`${prop.name} prop`}
            value={typeof value === "string" ? value : ""}
            placeholder={
              prop.name === "children"
                ? "Rendered content from example"
                : "From example"
            }
            onChange={(event) => onChange(prop.name, event.target.value)}
            className={fieldClass}
          />
        ) : control.kind === "json" ? (
          <JsonControl
            name={prop.name}
            value={value}
            onChange={(next) => onChange(prop.name, next)}
          />
        ) : (
          <p className="text-[10px] leading-5 text-muted-foreground">
            {control.reason ?? "Configure this prop in the usage code."}
          </p>
        )}
        {prop.name === "className" && (
          <p className="text-[9px] leading-4 text-muted-foreground">
            Uses classes available in the app stylesheet.
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="min-w-0 space-y-4">
      {showFilter && (
        <input
          aria-label="Filter playground props"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          placeholder="Find a prop…"
          className="h-8 w-full rounded-md border border-input bg-background px-2.5 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      )}
      {visiblePrimary.length > 0 && (
        <div className="space-y-5">{visiblePrimary.map(renderControl)}</div>
      )}
      {advanced.length > 0 && (
        <div className="border-t border-border pt-3">
          <button
            type="button"
            aria-expanded={showAdvanced}
            aria-controls={advancedId}
            onClick={() => {
              setAdvancedOpen(!showAdvanced)
              setFilter("")
            }}
            className="flex w-full items-center gap-1.5 rounded-sm py-1 text-left text-[11px] font-medium text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            <ChevronRight
              aria-hidden="true"
              className={`size-3.5 transition-transform ${showAdvanced ? "rotate-90" : ""}`}
            />
            Advanced
            <span className="ml-auto text-[10px] font-normal">
              {advancedChanges.length
                ? `${advancedChanges.length} changed`
                : advanced.length}
            </span>
          </button>
          <div
            id={advancedId}
            hidden={!showAdvanced}
            className="space-y-5 pt-4"
          >
            {visibleAdvanced.map(renderControl)}
          </div>
        </div>
      )}
      {!primary.length && !showAdvanced && (
        <p className="text-[10px] leading-5 text-muted-foreground">
          Open Advanced for structured data, styling, and composition props.
        </p>
      )}
      {!visiblePrimary.length && !visibleAdvanced.length && query && (
        <p className="py-4 text-xs text-muted-foreground">No matching props.</p>
      )}
    </div>
  )
}
