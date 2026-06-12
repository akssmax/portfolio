import { createFileRoute } from "@tanstack/react-router"

import { ScrollbarDemo } from "@/components/design-system/demos/scrollbar-demo"
import { DocSection } from "@/components/design-system/doc-section"
import { CustomScrollbar } from "@/components/ui/custom-scrollbar"

export const Route = createFileRoute("/design-system/scrollbars")({
  head: () => ({
    meta: [{ title: "Scrollbars — Design System" }],
  }),
  component: ScrollbarsPage,
})

const tokens = [
  { name: "Thumb", variable: "--scrollbar-thumb" },
  { name: "Thumb hover", variable: "--scrollbar-thumb-hover" },
  { name: "Track", variable: "--scrollbar-track" },
  { name: "Size", variable: "--scrollbar-size" },
] as const

function ScrollbarsPage() {
  return (
    <article className="space-y-10">
      <header className="space-y-3 border-b border-border pb-8">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Foundations
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Scrollbars
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Global scrollbars use the active brand{" "}
          <code className="text-foreground">--primary</code> token mixed with
          transparency. Tracks stay transparent so content and backgrounds show
          through. Change the accent in the theme customizer to preview live.
        </p>
      </header>

      <DocSection title="Tokens">
        <div className="grid gap-3 sm:grid-cols-2">
          {tokens.map((token) => (
            <div
              key={token.variable}
              className="rounded-lg border border-border px-4 py-3"
            >
              <p className="text-sm font-medium text-foreground">{token.name}</p>
              <p className="font-mono text-xs text-muted-foreground">
                {token.variable}
              </p>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="Usage">
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            Native scrollbars are styled globally via{" "}
            <code className="text-foreground">src/styles/scrollbars.css</code>.
            Wrap overflow regions with{" "}
            <code className="text-foreground">CustomScrollbar</code> when you
            want an explicit scroll container.
          </p>
          <pre className="overflow-x-auto rounded-lg border border-border bg-muted/40 p-4 font-mono text-xs text-foreground">
            {`import { CustomScrollbar } from "@/components/ui/custom-scrollbar"

<CustomScrollbar className="max-h-72">
  {/* long content */}
</CustomScrollbar>`}
          </pre>
        </div>
      </DocSection>

      <DocSection title="Preview">
        <ScrollbarDemo />
      </DocSection>

      <DocSection title="Theme customizer">
        <CustomScrollbar className="max-h-56 rounded-lg border border-border bg-popover p-4">
          <div className="space-y-2">
            {Array.from({ length: 16 }, (_, index) => (
              <p key={index} className="text-sm text-muted-foreground">
                Popover-style scroll region {index + 1}
              </p>
            ))}
          </div>
        </CustomScrollbar>
      </DocSection>
    </article>
  )
}
