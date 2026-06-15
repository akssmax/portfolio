"use client"

import {
  FooterMonogram,
  MONOGRAM_ANIMATIONS,
  type MonogramAnimation,
  type MonogramSize,
} from "@/components/brand/footer-monogram"

const sizes: { id: MonogramSize; label: string }[] = [
  { id: "sm", label: "Small" },
  { id: "md", label: "Medium" },
  { id: "lg", label: "Large" },
]

function VariantCard({
  animation,
  label,
  description,
}: {
  animation: MonogramAnimation
  label: string
  description: string
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background">
      <div className="border-b border-border px-4 py-3">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="flex min-h-40 items-end justify-center px-4 pb-4 pt-2">
        <FooterMonogram
          animation={animation}
          size="md"
          wrapperClassName="pt-0 pb-0"
        />
      </div>
      <p className="border-t border-border px-4 py-2 text-center text-[11px] text-muted-foreground">
        {animation === "loop" ? "Plays continuously" : "Hover to preview"}
      </p>
    </div>
  )
}

export function FooterMonogramDemo() {
  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Animation variants</h3>
          <p className="text-sm text-muted-foreground">
            Large footer watermark with Framer Motion presets. Hover each card to
            compare draw, trace, glow, pulse, shift, reveal, and loop styles.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {MONOGRAM_ANIMATIONS.map((variant) => (
            <VariantCard
              key={variant.id}
              animation={variant.id}
              label={variant.label}
              description={variant.description}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Sizes</h3>
          <p className="text-sm text-muted-foreground">
            Scale presets from compact marks to full-width footer watermarks.
          </p>
        </div>
        <div className="space-y-6 rounded-xl border border-border p-4 sm:p-6">
          {sizes.map((size) => (
            <div key={size.id} className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {size.label}
              </p>
              <FooterMonogram
                animation="draw"
                size={size.id}
                wrapperClassName="justify-start pt-0 pb-0"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Footer usage</h3>
          <p className="text-sm text-muted-foreground">
            Default configuration used beneath the site copyright bar.
          </p>
        </div>
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="flex items-center justify-between border-b border-border px-4 py-4 text-sm text-muted-foreground">
            <span>© {new Date().getFullYear()} Akshay Saini</span>
            <span>Bengaluru, India</span>
          </div>
          <FooterMonogram animation="draw" size="footer" />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Props</h3>
        </div>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border bg-muted/40">
              <tr>
                <th className="px-4 py-3 font-medium">Prop</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Default</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="px-4 py-3 font-mono text-xs">animation</td>
                <td className="px-4 py-3 text-muted-foreground">
                  draw | trace | glow | pulse | shift | reveal | loop | none
                </td>
                <td className="px-4 py-3 text-muted-foreground">draw</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs">size</td>
                <td className="px-4 py-3 text-muted-foreground">sm | md | lg | footer</td>
                <td className="px-4 py-3 text-muted-foreground">footer</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs">fillTone</td>
                <td className="px-4 py-3 text-muted-foreground">muted | subtle | foreground</td>
                <td className="px-4 py-3 text-muted-foreground">muted</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs">strokeTone</td>
                <td className="px-4 py-3 text-muted-foreground">primary | foreground | accent</td>
                <td className="px-4 py-3 text-muted-foreground">primary</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs">trigger</td>
                <td className="px-4 py-3 text-muted-foreground">hover | always</td>
                <td className="px-4 py-3 text-muted-foreground">hover</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs">strokeWidth</td>
                <td className="px-4 py-3 text-muted-foreground">number</td>
                <td className="px-4 py-3 text-muted-foreground">2.5</td>
              </tr>
            </tbody>
          </table>
        </div>
        <pre className="overflow-x-auto rounded-lg border border-border bg-muted/40 p-4 font-mono text-xs text-foreground">
          {`import { FooterMonogram } from "@/components/brand/footer-monogram"

<FooterMonogram animation="trace" size="footer" />
<FooterMonogram animation="glow" fillTone="subtle" strokeTone="primary" />
<FooterMonogram animation="loop" size="md" />`}
        </pre>
      </section>
    </div>
  )
}
