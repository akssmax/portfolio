import { createFileRoute } from "@tanstack/react-router"

import { ColorSwatch } from "@/components/design-system/color-swatch"
import { DocSection } from "@/components/design-system/doc-section"
import { COLOR_VISION_PRESETS, FONT_SCALE_PRESETS } from "@/lib/themes/registry"

export const Route = createFileRoute("/design-system/accessibility")({
  head: () => ({
    meta: [{ title: "Accessibility — Design System" }],
  }),
  component: AccessibilityPage,
})

const adaptedTokens = [
  { name: "Destructive", variable: "--destructive" },
  { name: "Accent", variable: "--accent" },
  { name: "Accent foreground", variable: "--accent-foreground" },
  { name: "Ring", variable: "--ring" },
  { name: "Chart 1", variable: "--chart-1" },
  { name: "Chart 2", variable: "--chart-2" },
  { name: "Chart 3", variable: "--chart-3" },
  { name: "Chart 4", variable: "--chart-4" },
  { name: "Chart 5", variable: "--chart-5" },
] as const

function AccessibilityPage() {
  return (
    <article className="space-y-10">
      <header className="space-y-3 border-b border-border pb-8">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Foundations
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Accessibility
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground">
          Color-vision adaptation and font scaling live in the theme customizer
          (palette icon). Settings persist in{" "}
          <code className="text-foreground">localStorage</code> and apply site-wide
          via <code className="text-foreground">data-color-vision</code> and{" "}
          <code className="text-foreground">data-font-scale</code> on{" "}
          <code className="text-foreground">&lt;html&gt;</code>.
        </p>
      </header>

      <DocSection title="Color vision adaptation">
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            Adaptation remaps semantic and chart tokens so multi-color UI stays
            distinguishable. Brand primary colors are preserved; charts, accents,
            and destructive states shift to safe hues.
          </p>
          <ul className="list-disc space-y-1 ps-5">
            {COLOR_VISION_PRESETS.map((preset) => (
              <li key={preset.id}>
                <span className="font-medium text-foreground">{preset.label}</span>
                {" — "}
                {preset.description}
              </li>
            ))}
          </ul>
        </div>
      </DocSection>

      <DocSection title="Adapted tokens (live preview)">
        <p className="mb-4 text-sm text-muted-foreground">
          Toggle color vision in the theme customizer to see these tokens update.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {adaptedTokens.map((token) => (
            <ColorSwatch key={token.variable} {...token} />
          ))}
        </div>
      </DocSection>

      <DocSection title="Font scaling">
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            Font scale adjusts typography via <code className="text-foreground">--text-scale</code>{" "}
            on Tailwind <code className="text-foreground">text-*</code> tokens. Layout spacing,
            radii, and component sizes stay on a fixed root{" "}
            <code className="text-foreground">rem</code> grid so animations stay smooth at 112%,
            125%, and 150%.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {FONT_SCALE_PRESETS.map((preset) => (
              <div
                key={preset.id}
                className="rounded-lg border border-border px-4 py-3"
              >
                <p className="text-sm font-medium text-foreground">{preset.label}</p>
                <p className="font-mono text-xs text-muted-foreground">
                  scale: {preset.scale}
                </p>
              </div>
            ))}
          </div>
        </div>
      </DocSection>

      <DocSection title="Limitations">
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            Fixed pixel values and arbitrary sizes (for example{" "}
            <code className="text-foreground">text-[10px]</code> or resume preview headings)
            do not respond to font scaling.
          </p>
          <p>
            Resume brand colors are resolved as inline hex and are not remapped by
            color-vision CSS in this version.
          </p>
        </div>
      </DocSection>
    </article>
  )
}
