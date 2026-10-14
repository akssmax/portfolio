import { useEffect, useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { DocPage, DocHeader } from "@/components/design-system/doc-page"
import { DocSection } from "@/components/design-system/doc-section"
import { CodeBlock } from "@/components/design-system/code-block"
import { FONT_PRESETS } from "@/lib/themes/registry"

export const Route = createFileRoute("/design-system/typography")({
  head: () => ({ meta: [{ title: "Typography — Design System" }] }),
  component: TypographyPage,
})
const typeScale = [
  { token: "text-xs", size: "12px", use: "Metadata and supporting labels" },
  { token: "text-sm", size: "14px", use: "Controls and compact body copy" },
  { token: "text-base", size: "16px", use: "Body text" },
  { token: "text-lg", size: "18px", use: "Lead paragraphs" },
  { token: "text-xl", size: "20px", use: "Section headings" },
  { token: "text-2xl", size: "24px", use: "Subpage headings" },
  { token: "text-3xl", size: "30px", use: "Page titles" },
  { token: "text-4xl", size: "36px", use: "Large page titles" },
  { token: "text-5xl", size: "48px", use: "Display text" },
  { token: "text-6xl", size: "60px", use: "Large display text" },
]
function TypographyPage() {
  const [font, setFont] = useState("geist-pixel-square")
  useEffect(() => {
    const update = () =>
      setFont(document.documentElement.dataset.font ?? "geist-pixel-square")
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-font"],
    })
    return () => observer.disconnect()
  }, [])
  const preset = FONT_PRESETS.find((item) => item.id === font)
  return (
    <DocPage
      toc={[
        { id: "font-family", title: "Font family" },
        { id: "type-scale", title: "Type scale" },
        { id: "weights", title: "Weights & hierarchy" },
        { id: "implementation", title: "Implementation" },
      ]}
    >
      <article className="space-y-10">
        <DocHeader
          title="Typography"
          description="A shared type scale with appearance-aware font families. Use the theme customizer to preview another font or increase the text scale."
        />
        <DocSection
          id="font-family"
          title="Font family"
          description="The default portfolio font is Geist Pixel Square. The active family follows the document's data-font setting."
        >
          <div className="space-y-4 rounded-xl border border-border p-6">
            <p className="font-mono text-[10px] text-muted-foreground">
              CURRENT FONT · {font}
            </p>
            <p className="text-3xl leading-snug break-words">
              {preset?.label ?? font}
            </p>
            <p className="text-base leading-8">
              Good typography makes the interface feel clear, considered, and
              easy to use.
            </p>
            <div className="border-t border-border pt-4">
              <p className="font-mono text-xs">
                const designSystem = &#123; builtToEvolve: true &#125;
              </p>
              <p className="mt-2 text-[10px] text-muted-foreground">
                font-mono · for code, tokens, and technical values
              </p>
            </div>
          </div>
        </DocSection>
        <DocSection
          id="type-scale"
          title="Type scale"
          description="Base values at 100% font scale. The live specimens below reflect your current appearance settings."
        >
          <div className="divide-y divide-border overflow-hidden rounded-xl border border-border">
            {typeScale.map((row) => (
              <div key={row.token} className="space-y-3 p-5">
                <div className="flex flex-wrap justify-between gap-2 font-mono text-[10px] text-muted-foreground">
                  <span>
                    {row.token} · {row.size}
                  </span>
                  <span className="font-sans">{row.use}</span>
                </div>
                <p className={`${row.token} truncate leading-snug`}>
                  Made to be useful.
                </p>
              </div>
            ))}
          </div>
        </DocSection>
        <DocSection
          id="weights"
          title="Weights & hierarchy"
          description="Give content a clear hierarchy before increasing size or weight."
        >
          <div className="space-y-5 rounded-xl border border-border p-6">
            <div>
              <p className="text-lg font-normal">Regular · 400</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Body copy and descriptions.
              </p>
            </div>
            <div>
              <p className="text-lg font-medium">Medium · 500</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Labels, navigation, and interactive controls.
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold">Semibold · 600</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Titles and section headings.
              </p>
            </div>
          </div>
          <p className="text-xs leading-6 text-muted-foreground">
            Weight availability depends on the selected font. Pixel font presets
            may render multiple weights with the same visual appearance.
          </p>
        </DocSection>
        <DocSection
          id="implementation"
          title="Implementation"
          description="Use shared tokens and relative units to preserve font scaling."
        >
          <CodeBlock
            filename="typography.tsx"
            code={'<h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">\\n  Page title\\n</h1>\\n<p className="text-base leading-7 text-muted-foreground">\\n  A clear description of what comes next.\\n</p>\\n<code className="font-mono text-xs">variant="outline"</code>'.replaceAll(
              "\\n",
              "\n"
            )}
          />
          <CodeBlock
            filename="src/styles.css · token mapping"
            code={
              "@theme inline {\n  --font-sans: var(--font-family-sans);\n  --text-base: calc(1rem * var(--text-scale, 1));\n  --text-xl: calc(1.25rem * var(--text-scale, 1));\n}"
            }
          />
          <p className="text-sm leading-7 text-muted-foreground">
            Prefer <code className="text-foreground">text-*</code> scale
            utilities over fixed pixel font sizes for content. Font scaling
            updates the text tokens while the layout stays on its existing rem
            grid. Test wrapping and controls at 150% text scale.
          </p>
        </DocSection>
      </article>
    </DocPage>
  )
}
