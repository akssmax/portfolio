import { createFileRoute } from "@tanstack/react-router"

import { ColorSwatch } from "@/components/design-system/color-swatch"

export const Route = createFileRoute("/design-system/colors")({
  head: () => ({
    meta: [{ title: "Colors — Design System" }],
  }),
  component: ColorsPage,
})

const semanticColors = [
  { name: "Background", variable: "--background" },
  { name: "Foreground", variable: "--foreground" },
  { name: "Card", variable: "--card" },
  { name: "Card foreground", variable: "--card-foreground" },
  { name: "Popover", variable: "--popover" },
  { name: "Primary", variable: "--primary" },
  { name: "Primary foreground", variable: "--primary-foreground" },
  { name: "Secondary", variable: "--secondary" },
  { name: "Muted", variable: "--muted" },
  { name: "Muted foreground", variable: "--muted-foreground" },
  { name: "Accent", variable: "--accent" },
  { name: "Destructive", variable: "--destructive" },
  { name: "Border", variable: "--border" },
  { name: "Input", variable: "--input" },
  { name: "Ring", variable: "--ring" },
] as const

const chartColors = [
  { name: "Chart 1", variable: "--chart-1" },
  { name: "Chart 2", variable: "--chart-2" },
  { name: "Chart 3", variable: "--chart-3" },
  { name: "Chart 4", variable: "--chart-4" },
  { name: "Chart 5", variable: "--chart-5" },
] as const

const sidebarColors = [
  { name: "Sidebar", variable: "--sidebar" },
  { name: "Sidebar foreground", variable: "--sidebar-foreground" },
  { name: "Sidebar primary", variable: "--sidebar-primary" },
  { name: "Sidebar accent", variable: "--sidebar-accent" },
  { name: "Sidebar border", variable: "--sidebar-border" },
] as const

function ColorsPage() {
  return (
    <article className="space-y-10">
      <header className="space-y-3 border-b border-border pb-8">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Foundations
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Colors
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground">
          Semantic OKLCH tokens defined in CSS variables. Toggle light/dark mode
          to preview both themes.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Semantic</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {semanticColors.map((color) => (
            <ColorSwatch key={color.variable} {...color} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Chart</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {chartColors.map((color) => (
            <ColorSwatch key={color.variable} {...color} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Sidebar</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sidebarColors.map((color) => (
            <ColorSwatch key={color.variable} {...color} />
          ))}
        </div>
      </section>
    </article>
  )
}
