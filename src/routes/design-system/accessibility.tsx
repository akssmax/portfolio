import { Link, createFileRoute } from "@tanstack/react-router"

import { DocPage, DocHeader } from "@/components/design-system/doc-page"
import { CodeBlock } from "@/components/design-system/code-block"

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
    <DocPage
      toc={[
        { id: "implementation", title: "Implementation basics" },
        { id: "color-vision-adaptation", title: "Color vision" },
        { id: "adapted-tokens-live-preview-", title: "Adapted tokens" },
        { id: "font-scaling", title: "Font scaling" },
        { id: "reduced-motion", title: "Reduced motion" },
        { id: "limitations", title: "Limitations" },
      ]}
    >
      <article className="space-y-10">
        <DocHeader
          title="Accessibility"
          description="Accessible behavior begins with the primitive and continues through the composition. Preserve labels, keyboard interactions, focus, and meaningful content as components evolve."
        />
        <DocSection
          id="implementation"
          title="Implementation basics"
          description="Apply these checks when creating or customizing any component."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              [
                "Name every control",
                "Associate visible labels with form controls. Give icon-only actions an accessible name.",
              ],
              [
                "Preserve keyboard access",
                "Use native controls and primitive composition. Test Tab, Shift + Tab, Enter, Space, and Escape where applicable.",
              ],
              [
                "Keep focus visible",
                "Retain focus-visible styles and restore focus after overlays close. Avoid positive tabIndex values.",
              ],
              [
                "Make state understandable",
                "Expose validation and loading states in text and ARIA. Pair status color with a meaningful label.",
              ],
            ].map(([title, text]) => (
              <div key={title} className="rounded-xl border border-border p-5">
                <h3 className="text-xs font-semibold">{title}</h3>
                <p className="mt-2 text-xs leading-6 text-muted-foreground">
                  {text}
                </p>
              </div>
            ))}
          </div>
          <CodeBlock
            filename="accessible-field.tsx"
            code={
              'import { Input } from "@/components/ui/input"\nimport { Label } from "@/components/ui/label"\n\n<div className="space-y-2">\n  <Label htmlFor="contact-email">Email address</Label>\n  <Input\n    id="contact-email"\n    type="email"\n    autoComplete="email"\n    aria-describedby="email-help"\n  />\n  <p id="email-help" className="text-sm text-muted-foreground">\n    We will only use this to reply to your message.\n  </p>\n</div>'
            }
          />
        </DocSection>

        <DocSection title="Color vision adaptation">
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              Adaptation remaps semantic and chart tokens so multi-color UI
              stays distinguishable. Brand primary colors are preserved; charts,
              accents, and destructive states shift to safe hues.
            </p>
            <ul className="list-disc space-y-1 ps-5">
              {COLOR_VISION_PRESETS.map((preset) => (
                <li key={preset.id}>
                  <span className="font-medium text-foreground">
                    {preset.label}
                  </span>
                  {" — "}
                  {preset.description}
                </li>
              ))}
            </ul>
          </div>
        </DocSection>

        <DocSection title="Adapted tokens (live preview)">
          <p className="mb-4 text-sm text-muted-foreground">
            Toggle color vision in the theme customizer to see these tokens
            update.
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
              Font scale adjusts typography via{" "}
              <code className="text-foreground">--text-scale</code> on Tailwind{" "}
              <code className="text-foreground">text-*</code> tokens. Layout
              spacing, radii, and component sizes stay on a fixed root{" "}
              <code className="text-foreground">rem</code> grid so animations
              stay smooth at 112%, 125%, and 150%.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {FONT_SCALE_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  className="rounded-lg border border-border px-4 py-3"
                >
                  <p className="text-sm font-medium text-foreground">
                    {preset.label}
                  </p>
                  <p className="font-mono text-xs text-muted-foreground">
                    scale: {preset.scale}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </DocSection>

        <DocSection
          id="reduced-motion"
          title="Reduced motion"
          description="Treat motion as an enhancement and keep the state understandable without animation."
        >
          <CodeBlock
            filename="reduced-motion.tsx"
            code={
              '// CSS transitions and animation utilities\n<div className="transition-transform motion-reduce:transition-none" />\n\n// Motion components inherit the application MotionConfig.\n// For custom animation logic, use the local animation hooks:\nimport { useAnimationProfile } from "@/hooks/use-can-animate"\n\nconst { canAnimate } = useAnimationProfile()'
            }
          />
          <p className="text-sm leading-7 text-muted-foreground">
            The application MotionPreferences provider configures Motion and the
            document's reduced-motion setting. New CSS, canvas, and
            requestAnimationFrame effects must also honor the animation
            preference. Verify the final state with animations disabled.
          </p>
          <Link
            to="/design-system/animation"
            className="text-xs font-medium text-primary hover:underline"
          >
            Animation rules, recipes, and motion tiers →
          </Link>
        </DocSection>
        <DocSection title="Limitations">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              Fixed pixel values and arbitrary sizes (for example{" "}
              <code className="text-foreground">text-[10px]</code> or resume
              preview headings) do not respond to font scaling.
            </p>
            <p>
              Resume brand colors are resolved as inline hex and are not
              remapped by color-vision CSS in this version.
            </p>
          </div>
        </DocSection>
      </article>
    </DocPage>
  )
}
