import { createFileRoute } from "@tanstack/react-router"

import { DocPage, DocHeader } from "@/components/design-system/doc-page"
import { DocSection } from "@/components/design-system/doc-section"
import { CodeBlock } from "@/components/design-system/code-block"

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
  { name: "Section", variable: "--section" },
  { name: "Section foreground", variable: "--section-foreground" },
  { name: "Card", variable: "--card" },
  { name: "Card foreground", variable: "--card-foreground" },
  { name: "Popover", variable: "--popover" },
  { name: "Popover foreground", variable: "--popover-foreground" },
  { name: "Primary", variable: "--primary" },
  { name: "Primary foreground", variable: "--primary-foreground" },
  { name: "Secondary", variable: "--secondary" },
  { name: "Secondary foreground", variable: "--secondary-foreground" },
  { name: "Muted", variable: "--muted" },
  { name: "Muted foreground", variable: "--muted-foreground" },
  { name: "Accent", variable: "--accent" },
  { name: "Accent foreground", variable: "--accent-foreground" },
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
  {
    name: "Sidebar primary foreground",
    variable: "--sidebar-primary-foreground",
  },
  { name: "Sidebar accent", variable: "--sidebar-accent" },
  {
    name: "Sidebar accent foreground",
    variable: "--sidebar-accent-foreground",
  },
  { name: "Sidebar ring", variable: "--sidebar-ring" },
  { name: "Sidebar border", variable: "--sidebar-border" },
] as const

function ColorsPage() {
  return (
    <DocPage
      toc={[
        { id: "usage", title: "Using tokens" },
        { id: "semantic", title: "Semantic colors" },
        { id: "chart", title: "Chart colors" },
        { id: "sidebar", title: "Sidebar colors" },
        { id: "theming", title: "Theme behavior" },
      ]}
    >
      <article className="space-y-10">
        <DocHeader
          title="Colors"
          description="Semantic color tokens that adapt to the active theme. Use a token's role, rather than a fixed color, so components follow every appearance preset."
        />
        <DocSection
          id="usage"
          title="Using tokens"
          description="Tailwind utilities and CSS variables reference the same semantic values. Copy a token from any swatch below."
        >
          <CodeBlock
            filename="semantic-colors.tsx"
            code={
              '// Pair a surface with its foreground token.\n<div className="bg-card text-card-foreground border border-border">\n  <p className="text-muted-foreground">Supporting information</p>\n  <button className="bg-primary text-primary-foreground">Continue</button>\n</div>\n\n// For inline styles or a chart configuration:\n<div style={{ backgroundColor: "var(--primary)" }} />'
            }
          />
        </DocSection>
        <DocSection
          id="semantic"
          title="Semantic colors"
          description="Live computed values for surfaces, content, actions, and focus. Change the theme in the header to inspect another preset."
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {semanticColors.map((color) => (
              <ColorSwatch key={color.variable} {...color} />
            ))}
          </div>
        </DocSection>
        <DocSection
          id="chart"
          title="Chart colors"
          description="Use numbered series tokens consistently. Provide labels or patterns alongside color."
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {chartColors.map((color) => (
              <ColorSwatch key={color.variable} {...color} />
            ))}
          </div>
        </DocSection>
        <DocSection
          id="sidebar"
          title="Sidebar colors"
          description="Dedicated tokens for navigation surfaces and their interaction states."
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sidebarColors.map((color) => (
              <ColorSwatch key={color.variable} {...color} />
            ))}
          </div>
        </DocSection>
        <DocSection
          id="theming"
          title="Theme behavior"
          description="Appearance attributes on the document select the active token values."
        >
          <CodeBlock
            filename="appearance.html"
            code={
              '<!-- The theme customizer manages these attributes on <html>. -->\n<html\n  class="dark"\n  data-theme="default"\n  data-neutral="stone"\n  data-font="geist-pixel-square"\n  data-radius="default"\n  data-color-vision="none"\n  data-font-scale="100"\n>'
            }
          />
          <p className="text-sm leading-7 text-muted-foreground">
            Neutral presets define the surface layers. The section token aliases
            the muted surface to keep alternating sections consistent.
            Color-vision presets adapt semantic and chart colors; test custom
            components with those settings too.
          </p>
          <p className="text-xs leading-6 text-muted-foreground">
            Source:{" "}
            <code className="text-foreground">
              src/lib/themes/theme-data.ts
            </code>{" "}
            and <code className="text-foreground">src/lib/themes/themes/</code>.
            Tailwind mappings:{" "}
            <code className="text-foreground">src/styles.css</code>.
          </p>
        </DocSection>
      </article>
    </DocPage>
  )
}
