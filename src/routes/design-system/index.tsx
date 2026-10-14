import { useState } from "react"
import { Link, createFileRoute } from "@tanstack/react-router"
import {
  ArrowRight,
  ArrowUpRight,
  Box,
  Braces,
  Check,
  Component,
  Layers,
  Play,
  Palette,
  Search,
  ShieldCheck,
  Type,
} from "lucide-react"
import { DocPage, DocHeader } from "@/components/design-system/doc-page"
import { DocSection } from "@/components/design-system/doc-section"
import { CodeBlock } from "@/components/design-system/code-block"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  allDocEntries,
  componentEntries,
  customEntries,
} from "@/lib/design-system-registry"
import { cn } from "@/lib/utils"

export const Route = createFileRoute("/design-system/")({
  head: () => ({ meta: [{ title: "Introduction — Design System" }] }),
  component: DesignSystemIntroduction,
})

const toc = [
  { id: "introduction", title: "Introduction" },
  { id: "start-building", title: "Start building" },
  { id: "foundations", title: "Foundations" },
  { id: "components", title: "Component directory" },
  { id: "architecture", title: "How it fits together" },
]
const foundations = [
  {
    title: "Colors",
    description: "Semantic tokens, live values, and theme-aware usage.",
    href: "/design-system/colors",
    icon: Palette,
  },
  {
    title: "Typography",
    description: "Font families, a responsive type scale, and code styles.",
    href: "/design-system/typography",
    icon: Type,
  },
  {
    title: "Animation",
    description: "Motion rules, easing, live recipes, and custom effects.",
    href: "/design-system/animation",
    icon: Play,
  },
  {
    title: "Accessibility",
    description: "Labels, keyboard behavior, focus, and appearance settings.",
    href: "/design-system/accessibility",
    icon: ShieldCheck,
  },
  {
    title: "Customization",
    description: "A workflow for evolving the shared components.",
    href: "/design-system/customization",
    icon: Braces,
  },
]

function DesignSystemIntroduction() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("all")
  const entries = allDocEntries.filter(
    (entry) =>
      (category === "all" || entry.category === category) &&
      `${entry.title} ${entry.description}`
        .toLowerCase()
        .includes(query.toLowerCase())
  )
  return (
    <DocPage toc={toc}>
      <article className="space-y-12">
        <section id="introduction" className="scroll-mt-24">
          <DocHeader
            category="Get started"
            title="Design system"
            description="The components, tokens, and patterns behind this portfolio. A working reference for designing with consistency and building with confidence."
          >
            <div className="flex flex-wrap gap-2 pt-1">
              {["React 19", "TypeScript", "Tailwind CSS v4", "shadcn/ui"].map(
                (label) => (
                  <span
                    key={label}
                    className="rounded-md border border-border bg-muted/20 px-2.5 py-1 font-mono text-[10px] text-muted-foreground"
                  >
                    {label}
                  </span>
                )
              )}
            </div>
          </DocHeader>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <a href="#components">
                Explore components
                <ArrowRight className="size-3.5" />
              </a>
            </Button>
            <Button asChild variant="outline">
              <Link to="/design-system/customization">Customization guide</Link>
            </Button>
          </div>
          <div className="mt-8 grid grid-cols-3 divide-x divide-border rounded-xl border border-border bg-muted/15 py-5">
            {[
              [componentEntries.length, "UI components"],
              [customEntries.length, "Portfolio patterns"],
              ["100%", "Local source"],
            ].map(([number, label]) => (
              <div key={label} className="px-3 text-center">
                <p className="text-2xl font-semibold tracking-tight">
                  {number}
                </p>
                <p className="mt-1 text-[10px] text-muted-foreground sm:text-xs">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </section>
        <DocSection
          id="start-building"
          title="Start building"
          description="The components already live in this repository. Import the local implementation and compose what you need."
        >
          <CodeBlock
            code={
              'import { Button } from "@/components/ui/button"\nimport { ArrowUpRight } from "lucide-react"\n\nexport function ProjectAction() {\n  return (\n    <Button asChild variant="outline">\n      <a href="/projects">\n        Explore projects\n        <ArrowUpRight aria-hidden="true" />\n      </a>\n    </Button>\n  )\n}'
            }
            filename="project-action.tsx"
          />
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              [
                "01",
                "Find a component",
                "Explore its preview, props, states, and accessibility notes.",
              ],
              [
                "02",
                "Use the local API",
                "Copy a complete example with the imports and supporting state.",
              ],
              [
                "03",
                "Make it yours",
                "Use props for an instance, shared variants for a system change.",
              ],
            ].map(([number, title, description]) => (
              <div key={number}>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {number}
                </span>
                <h3 className="mt-2 text-xs font-semibold">{title}</h3>
                <p className="mt-1.5 text-xs leading-6 text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </DocSection>
        <DocSection
          id="foundations"
          title="Foundations"
          description="A small set of shared decisions that carries across every component."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {foundations.map((item) => (
              <Link
                key={item.title}
                to={item.href}
                className="group flex gap-4 rounded-xl border border-border p-5 transition-colors hover:bg-muted/20"
              >
                <item.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div className="flex-1">
                  <h3 className="flex items-center justify-between gap-2 text-sm font-medium">
                    {item.title}
                    <ArrowUpRight className="size-3.5 text-muted-foreground" />
                  </h3>
                  <p className="mt-2 text-xs leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </DocSection>
        <DocSection
          id="components"
          title="Component directory"
          description="From UI primitives to portfolio patterns. Every page documents the implementation used here."
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-1 rounded-lg bg-muted/50 p-1">
              {[
                ["all", "All"],
                ["components", "Components"],
                ["custom", "Patterns"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={category === value}
                  onClick={() => setCategory(value)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ring",
                    category === value
                      ? "bg-background shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="relative sm:w-52">
              <Search className="pointer-events-none absolute top-2.5 left-3 size-3.5 text-muted-foreground" />
              <Input
                aria-label="Filter component directory"
                placeholder="Filter components…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-9 pl-9 text-xs"
              />
            </div>
          </div>
          <p role="status" className="text-[11px] text-muted-foreground">
            {entries.length} {entries.length === 1 ? "component" : "components"}
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {entries.map((entry) => (
              <Link
                key={entry.slug}
                to="/design-system/components/$slug"
                params={{ slug: entry.slug }}
                className="group flex gap-3 rounded-lg border border-border p-4 transition-colors hover:border-muted-foreground/40 hover:bg-muted/20"
              >
                {entry.category === "custom" ? (
                  <Layers className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                ) : (
                  <Component className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="flex items-center justify-between text-xs font-medium">
                    {entry.title}
                    <ArrowUpRight className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-[11px] leading-5 text-muted-foreground">
                    {entry.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          {!entries.length && (
            <div className="rounded-xl border border-dashed border-border p-8 text-center">
              <p className="text-sm">No matching components</p>
              <button
                type="button"
                onClick={() => {
                  setQuery("")
                  setCategory("all")
                }}
                className="mt-3 text-xs font-medium text-primary hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </DocSection>
        <DocSection
          id="architecture"
          title="How it fits together"
          description="Behavior, appearance, and product composition each have a clear home."
        >
          <div className="divide-y divide-border rounded-xl border border-border">
            {[
              {
                icon: Box,
                title: "UI primitives",
                path: "src/components/ui/",
                description:
                  "Local shadcn components. Radix UI and Base UI supply interaction behavior; local code supplies the public wrapper and styles.",
              },
              {
                icon: Palette,
                title: "Theme tokens",
                path: "src/lib/themes/themes/",
                description:
                  "Semantic color, font, radius, and accessibility settings. Tailwind mappings live in src/styles.css.",
              },
              {
                icon: Layers,
                title: "Portfolio patterns",
                path: "src/components/landing/ · marketing/ · brand/",
                description:
                  "Larger compositions that combine primitives with portfolio-specific content and behavior.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-3 p-5">
                <item.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div>
                  <h3 className="text-xs font-semibold">{item.title}</h3>
                  <code className="mt-1 block text-[10px] break-words text-muted-foreground">
                    {item.path}
                  </code>
                  <p className="mt-2 text-xs leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="flex gap-2 text-xs leading-6 text-muted-foreground">
            <Check className="mt-1 size-3.5 shrink-0" />
            API references and examples are generated from this repository at
            dev startup and build time. Local code takes precedence over
            upstream documentation.
          </p>
        </DocSection>
      </article>
    </DocPage>
  )
}
