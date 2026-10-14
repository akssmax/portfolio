import { createFileRoute } from "@tanstack/react-router"

import { DocPage, DocHeader } from "@/components/design-system/doc-page"
import { CodeBlock } from "@/components/design-system/code-block"

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
    <DocPage
      toc={[
        { id: "tokens", title: "Tokens" },
        { id: "usage", title: "Usage" },
        { id: "preview", title: "Preview" },
        { id: "theme-customizer", title: "Theme customizer" },
      ]}
    >
      <article className="space-y-10">
        <DocHeader
          title="Scrollbars"
          description="Theme-aware scrollbars with transparent tracks. Use native overflow by default and a shared wrapper when a region needs explicit scroll behavior."
        />

        <DocSection title="Tokens">
          <div className="grid gap-3 sm:grid-cols-2">
            {tokens.map((token) => (
              <div
                key={token.variable}
                className="rounded-lg border border-border px-4 py-3"
              >
                <p className="text-sm font-medium text-foreground">
                  {token.name}
                </p>
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
              <code className="text-foreground">src/styles/scrollbars.css</code>
              . Wrap overflow regions with{" "}
              <code className="text-foreground">CustomScrollbar</code> when you
              want an explicit scroll container.
            </p>
            <CodeBlock
              filename="scroll-region.tsx"
              code={
                'import { CustomScrollbar } from "@/components/ui/custom-scrollbar"\n\n<CustomScrollbar\n  className="max-h-72"\n  tabIndex={0}\n  role="region"\n  aria-label="Project updates"\n>\n  {/* Long content */}\n</CustomScrollbar>'
              }
            />
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
    </DocPage>
  )
}
