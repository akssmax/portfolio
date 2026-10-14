import { lazy, Suspense, useCallback, useMemo, useState } from "react"
import { ArrowUpRight, Code2, Eye, RotateCcw } from "lucide-react"
import { ErrorBoundary } from "@/components/error-boundary"
import { CodeBlock, CopyButton } from "@/components/design-system/code-block"
import { PropControls } from "@/components/design-system/prop-controls"
import { PlaygroundContext } from "@/components/design-system/playground-context"
import type { PlaygroundValues } from "@/components/design-system/playground-context"
import type { ComponentReference } from "@/lib/design-system/docs"
import { cn } from "@/lib/utils"

const interactiveModules = import.meta.glob<{ default: React.ComponentType }>(
  "./generated-playgrounds/*.tsx"
)
function codeValue(value: unknown, depth = 0): string {
  if (value instanceof Date)
    return `new Date(${JSON.stringify(value.toISOString())})`
  if (Array.isArray(value))
    return `[${value.map((item) => codeValue(item, depth + 1)).join(", ")}]`
  if (value && typeof value === "object")
    return `{${Object.entries(value)
      .map(
        ([key, item]) =>
          `\n${"  ".repeat(depth + 1)}${JSON.stringify(key)}: ${codeValue(item, depth + 1)}`
      )
      .join(",")}\n${"  ".repeat(depth)}}`
  return JSON.stringify(value) ?? "undefined"
}
export function ComponentPlayground({
  slug,
  reference,
}: {
  slug: string
  reference: ComponentReference
}) {
  const parts = reference.parts.filter((part) =>
    reference.playground.parts.includes(part.name)
  )
  const [partName, setPartName] = useState(parts[0]?.name ?? "")
  const [tab, setTab] = useState("preview")
  const [resetKey, setResetKey] = useState(0)
  const [allValues, setAllValues] = useState<Record<string, PlaygroundValues>>(
    {}
  )
  const [observed, setObserved] = useState<Record<string, PlaygroundValues>>({})
  const [events, setEvents] = useState<string[]>([])
  const part = parts.find((item) => item.name === partName)
  const values = allValues[partName] ?? {}
  const update = useCallback(
    (name: string, value: unknown) =>
      setAllValues((previous) => {
        const next = { ...previous[partName] }
        if (value === undefined) delete next[name]
        else next[name] = value
        return { ...previous, [partName]: next }
      }),
    [partName]
  )
  const observe = useCallback(
    (name: string, props: PlaygroundValues) =>
      setObserved((previous) =>
        previous[name] ? previous : { ...previous, [name]: props }
      ),
    []
  )
  const event = useCallback((name: string, value: unknown) => {
    let summary =
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
        ? JSON.stringify(value)
        : value && typeof value === "object" && "type" in value
          ? String((value as { type: unknown }).type)
          : "…"
    summary = summary.length > 70 ? summary.slice(0, 70) + "…" : summary
    setEvents((previous) => [`${name}(${summary})`, ...previous].slice(0, 5))
  }, [])
  const Demo = useMemo(
    () =>
      lazy(async () => {
        const load = interactiveModules[`./generated-playgrounds/${slug}.tsx`]
        if (!load) throw new Error(`Missing generated playground: ${slug}`)
        return load()
      }),
    [slug]
  )
  const template = reference.playground.templates[partName]
  const code = template
    ? template.replace("/*__DS_PROPS__*/ {}", codeValue(values))
    : reference.playground.example.code
  const reset = () => {
    setAllValues({})
    setObserved({})
    setEvents([])
    setResetKey((key) => key + 1)
  }
  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-border">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/15 px-4 py-2">
        <div role="tablist" aria-label="Example view" className="flex gap-1">
          {[
            { value: "preview", title: "Preview", icon: Eye },
            { value: "code", title: "Code", icon: Code2 },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              role="tab"
              id={`${slug}-${item.value}-tab`}
              aria-controls={`${slug}-${item.value}-panel`}
              aria-selected={tab === item.value}
              tabIndex={tab === item.value ? 0 : -1}
              onKeyDown={(event) => {
                if (
                  ["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
                ) {
                  event.preventDefault()
                  const next =
                    event.key === "Home"
                      ? "preview"
                      : event.key === "End"
                        ? "code"
                        : tab === "preview"
                          ? "code"
                          : "preview"
                  setTab(next)
                  document.getElementById(`${slug}-${next}-tab`)?.focus()
                }
              }}
              onClick={() => setTab(item.value)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ring",
                tab === item.value
                  ? "bg-background text-foreground shadow-xs ring-1 ring-border"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="size-3.5" />
              {item.title}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={reset}
            aria-label="Reset example"
            className="rounded-md p-2 text-muted-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
          >
            <RotateCcw className="size-3.5" />
          </button>
          <CopyButton value={code} />
        </div>
      </div>
      {tab === "preview" ? (
        <div
          id={`${slug}-preview-panel`}
          role="tabpanel"
          aria-labelledby={`${slug}-preview-tab`}
          className={cn(
            "grid min-w-0",
            part && "lg:grid-cols-[minmax(0,1fr)_220px]"
          )}
        >
          <div className="min-w-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-[size:16px_16px]">
            <PlaygroundContext.Provider
              value={{
                part: partName,
                values,
                events:
                  part?.props
                    .filter((prop) => prop.control?.kind === "event")
                    .map((prop) => prop.name) ?? [],
                resetKey,
                observe,
                event,
                update,
              }}
            >
              <ErrorBoundary
                key={`${resetKey}-${partName}`}
                title="Preview needs a valid prop value"
                variant="panel"
                showHeader={false}
              >
                <div
                  key={resetKey}
                  className="flex min-h-72 min-w-0 items-center justify-center overflow-hidden p-6 sm:p-8"
                >
                  <div className="max-h-[640px] w-full min-w-0 [scrollbar-width:thin] overflow-auto">
                    <div className="flex min-h-48 w-full items-center justify-center">
                      <Suspense
                        fallback={
                          <div className="py-12 text-sm text-muted-foreground">
                            Loading preview…
                          </div>
                        }
                      >
                        <Demo />
                      </Suspense>
                    </div>
                  </div>
                </div>
              </ErrorBoundary>
            </PlaygroundContext.Provider>
            {events.length > 0 && (
              <div className="border-t border-border bg-background/90 px-4 py-3">
                <div className="mb-2 flex justify-between text-[10px] text-muted-foreground">
                  <span>Event log</span>
                  <button
                    type="button"
                    onClick={() => setEvents([])}
                    className="hover:text-foreground"
                  >
                    Clear
                  </button>
                </div>
                <ol aria-live="polite" className="space-y-1">
                  {events.map((entry, index) => (
                    <li
                      key={`${entry}-${index}`}
                      className="font-mono text-[10px] break-words text-muted-foreground"
                    >
                      {entry}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
          {part && (
            <aside
              aria-label="Playground prop controls"
              className="flex min-w-0 [scrollbar-width:thin] flex-col gap-4 border-t border-border bg-muted/15 p-4 lg:max-h-[680px] lg:overflow-y-auto lg:border-t-0 lg:border-l"
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                  Props
                </p>
                <span className="text-[10px] text-muted-foreground">
                  {part.props.length}
                </span>
              </div>
              {parts.length > 1 ? (
                <label className="space-y-1.5 text-[10px] text-muted-foreground">
                  <span>Component part</span>
                  <select
                    aria-label="Playground component part"
                    value={partName}
                    onChange={(event) => {
                      setPartName(event.target.value)
                      setEvents([])
                    }}
                    className="h-8 w-full min-w-0 rounded-md border border-input bg-background px-2 font-mono text-[11px] text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {parts.map((item) => (
                      <option key={item.name} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <p className="truncate font-mono text-[11px] text-muted-foreground">
                  {partName}
                </p>
              )}
              {part.props.length ? (
                <PropControls
                  key={partName}
                  props={part.props}
                  values={values}
                  observed={observed[partName] ?? {}}
                  onChange={update}
                />
              ) : (
                <p className="text-xs leading-6 text-muted-foreground">
                  This component has no declared props. Use the live example to
                  explore its behavior.
                </p>
              )}
              <p className="text-[10px] leading-5 text-muted-foreground">
                Edits update the preview and code.
              </p>
            </aside>
          )}
        </div>
      ) : (
        <div
          id={`${slug}-code-panel`}
          role="tabpanel"
          aria-labelledby={`${slug}-code-tab`}
        >
          <CodeBlock
            code={code}
            filename="interactive-example.tsx"
            className="rounded-none border-0"
            collapsible
          />
        </div>
      )}
      <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-2.5 text-[11px] text-muted-foreground">
        <span>Live local component · inherits your theme</span>
        <a
          href="#api-reference"
          className="flex shrink-0 items-center gap-1 hover:text-foreground"
        >
          View API
          <ArrowUpRight className="size-3" />
        </a>
      </div>
    </div>
  )
}
