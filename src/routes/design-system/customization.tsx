import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowUpRight, Check, GitBranch, Info } from "lucide-react"
import { DocPage, DocHeader } from "@/components/design-system/doc-page"
import { DocSection } from "@/components/design-system/doc-section"
import { CodeBlock } from "@/components/design-system/code-block"

export const Route = createFileRoute("/design-system/customization")({
  head: () => ({ meta: [{ title: "Customization — Design System" }] }),
  component: CustomizationPage,
})
const toc = [
  { id: "ownership", title: "Ownership" },
  { id: "choose-a-layer", title: "Choose a layer" },
  { id: "extend-a-component", title: "Extend a component" },
  { id: "tokens", title: "Change tokens" },
  { id: "workflow", title: "Change workflow" },
  { id: "upstream", title: "Upstream updates" },
]

function CustomizationPage() {
  return (
    <DocPage toc={toc}>
      <article className="space-y-10">
        <div id="ownership" className="scroll-mt-24">
          <DocHeader
            title="Built to evolve"
            description="These components are owned by this portfolio. Extend the local source with clear contracts, reusable variants, and documentation that changes alongside the code."
          />
          <div className="flex gap-3 rounded-xl border border-border bg-muted/20 p-5">
            <GitBranch className="mt-0.5 size-4 shrink-0" />
            <p className="text-sm leading-6 text-muted-foreground">
              shadcn/ui provides the starting point. The implementation in{" "}
              <code className="text-foreground">src/components/ui/</code>{" "}
              defines the API used by the portfolio.
            </p>
          </div>
        </div>
        <DocSection
          id="choose-a-layer"
          title="Choose the right layer"
          description="Start with the smallest shared surface that expresses the change."
        >
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[480px] text-left text-xs">
              <thead className="border-b border-border bg-muted/25">
                <tr>
                  {["Change", "Where", "Example"].map((title) => (
                    <th
                      scope="col"
                      key={title}
                      className="px-4 py-3 font-medium"
                    >
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  [
                    "One composition",
                    "Consumer props / className",
                    "A full-width button in a form",
                  ],
                  [
                    "Reusable appearance",
                    "Local component variants",
                    "A new button treatment",
                  ],
                  [
                    "System appearance",
                    "Semantic theme tokens",
                    "Primary color or shared radius",
                  ],
                  [
                    "Reusable behavior",
                    "Wrapper + primitive",
                    "A pending action pattern",
                  ],
                  [
                    "Product content",
                    "Portfolio pattern",
                    "A new project-card composition",
                  ],
                ].map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell) => (
                      <td
                        key={cell}
                        className="px-4 py-4 leading-6 text-muted-foreground"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DocSection>
        <DocSection
          id="extend-a-component"
          title="Extend a component"
          description="Add a variant where it belongs, then let TypeScript carry the API through to consumers."
        >
          <CodeBlock
            filename="src/components/ui/button.tsx · illustrative addition"
            code={
              '// Add to buttonVariants → variants → variant.\n// This is an example extension, not a currently available variant.\nquiet: "bg-muted text-foreground hover:bg-muted/80",\n\n// Button already uses VariantProps<typeof buttonVariants>.\n// After adding the variant, consumers can use:\n<Button variant="quiet">Save draft</Button>'
            }
          />
          <ul className="space-y-3 text-sm leading-6 text-muted-foreground">
            {[
              "Keep existing variants and defaults unless intentionally changing the shared contract.",
              "Use semantic tokens so the variant follows light, dark, and alternative themes.",
              "Preserve the primitive's ref, event, ARIA, data attribute, and composition behavior.",
              "Add a useful example for the new state, including its disabled and keyboard behavior.",
            ].map((text) => (
              <li key={text} className="flex gap-3">
                <Check className="mt-1 size-3.5 shrink-0 text-foreground" />
                {text}
              </li>
            ))}
          </ul>
          <Link
            to="/design-system/components/$slug"
            params={{ slug: "button" }}
            className="inline-flex items-center gap-1 text-xs font-medium hover:underline"
          >
            Inspect the current Button API
            <ArrowUpRight className="size-3" />
          </Link>
        </DocSection>
        <DocSection
          id="tokens"
          title="Change tokens with intent"
          description="CSS variables describe meaning; Tailwind utilities consume them."
        >
          <CodeBlock
            filename="token flow.css"
            code={
              '/* Theme source: src/lib/themes/themes/default.css */\n--primary: oklch(0.653 0.234 21.609);\n--primary-foreground: oklch(1 0 0);\n\n/* Tailwind mapping: src/styles.css → @theme inline */\n--color-primary: var(--primary);\n--color-primary-foreground: var(--primary-foreground);\n\n/* Consumer */\n/* className="bg-primary text-primary-foreground" */'
            }
          />
          <p className="text-sm leading-7 text-muted-foreground">
            Colors live in generated presets as well as the default theme. When
            changing a palette preset, update its source in{" "}
            <code className="text-foreground">
              src/lib/themes/theme-data.ts
            </code>{" "}
            and run{" "}
            <code className="text-foreground">npm run generate:themes</code>.
            Check foreground/background pairs together in every affected theme.
          </p>
          <Link
            to="/design-system/colors"
            className="inline-flex items-center gap-1 text-xs font-medium hover:underline"
          >
            Explore semantic tokens
            <ArrowUpRight className="size-3" />
          </Link>
        </DocSection>
        <DocSection
          id="workflow"
          title="The change workflow"
          description="A shared component change is complete when its implementation, consumers, and reference agree."
        >
          <ol className="space-y-5">
            {[
              [
                "Inspect",
                "Read the local source, current API table, and consumers before changing behavior.",
              ],
              [
                "Implement",
                "Make the change at the appropriate layer. Keep the API typed and defaults explicit.",
              ],
              [
                "Document",
                "Update the demo in src/components/design-system/demos/ and any usage or accessibility guidance in src/lib/design-system/guidance.ts.",
              ],
              [
                "Regenerate",
                "Run npm run docs:generate. The generator reads local TypeScript, defaults, data slots, tokens, and the demo's supporting code.",
              ],
              [
                "Verify",
                "Run typecheck and a production build. Exercise changed states in the playground, then inspect real consumers on desktop and mobile.",
              ],
            ].map(([title, text], index) => (
              <li key={title} className="flex gap-4">
                <span className="grid size-7 shrink-0 place-items-center rounded-lg border border-border bg-muted/20 font-mono text-xs">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-sm font-medium">{title}</h3>
                  <p className="mt-1 text-xs leading-6 text-muted-foreground">
                    {text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <CodeBlock
            filename="terminal"
            code={"npm run docs:generate\nnpm run typecheck\nnpm run build"}
          />
          <div className="flex gap-3 rounded-lg border border-border bg-muted/20 p-4">
            <Info className="mt-0.5 size-4 shrink-0" />
            <p className="text-xs leading-6 text-muted-foreground">
              Generated references live in{" "}
              <code className="text-foreground">
                src/lib/design-system/generated/
              </code>
              . Edit the component or demo source, then regenerate. Avoid
              editing the JSON directly.
            </p>
          </div>
        </DocSection>
        <DocSection
          id="upstream"
          title="Review upstream updates"
          description="Compare upstream changes with local decisions before adopting them."
        >
          <p className="text-sm leading-7 text-muted-foreground">
            Keep local customizations visible in source control. Review an
            upstream change for useful bug fixes, accessibility improvements,
            and API differences, then merge the relevant changes deliberately.
            Replacing a customized file from a CLI can remove local variants and
            behavior.
          </p>
          <div className="flex flex-wrap gap-4 text-xs">
            <a
              href="https://ui.shadcn.com/docs"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:underline"
            >
              shadcn/ui documentation
              <ArrowUpRight className="size-3" />
            </a>
            <a
              href="https://primer.style/product/components/button/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:underline"
            >
              Primer reference
              <ArrowUpRight className="size-3" />
            </a>
            <a
              href="https://www.radix-ui.com/themes/docs/components/avatar"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:underline"
            >
              Radix reference
              <ArrowUpRight className="size-3" />
            </a>
          </div>
        </DocSection>
      </article>
    </DocPage>
  )
}
