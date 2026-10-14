"use client"

import { useState } from "react"
import { Link } from "@tanstack/react-router"
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Code2,
  ExternalLink,
  FileCode2,
  Info,
  Loader2,
  ShieldCheck,
} from "lucide-react"
import { ComponentPlayground } from "@/components/design-system/component-playground"
import { CodeBlock, CopyButton } from "@/components/design-system/code-block"
import { ComponentSource } from "@/components/design-system/component-source"
import { DocPage, DocHeader } from "@/components/design-system/doc-page"
import { DocSection } from "@/components/design-system/doc-section"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { allDocEntries, getDocEntry } from "@/lib/design-system-registry"
import type { DocEntry } from "@/lib/design-system-registry"
import type { ComponentReference } from "@/lib/design-system/docs"
import { getComponentGuidance } from "@/lib/design-system/guidance"

function ReferenceTable({ reference }: { reference: ComponentReference }) {
  const [partName, setPartName] = useState(reference.parts[0]?.name ?? "")
  const part = reference.parts.find((item) => item.name === partName)
  return (
    <div className="min-w-0 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          Component part
          <select
            aria-label="API component part"
            value={partName}
            onChange={(event) => setPartName(event.target.value)}
            className="h-9 max-w-full rounded-md border border-input bg-background px-3 font-mono text-xs text-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            {reference.parts.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <span className="text-[11px] text-muted-foreground">
          {part?.props.length ?? 0} documented props
        </span>
      </div>
      {part?.props.length ? (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[560px] text-left text-xs">
            <caption className="sr-only">
              {part.name} props, types, defaults, and descriptions
            </caption>
            <thead className="border-b border-border bg-muted/30 text-muted-foreground">
              <tr>
                <th scope="col" className="w-[26%] px-4 py-3 font-medium">
                  Prop
                </th>
                <th scope="col" className="w-[51%] px-4 py-3 font-medium">
                  Type / Description
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Default
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {part.props.map((prop) => (
                <tr key={prop.name} className="align-top">
                  <th scope="row" className="px-4 py-4 font-normal">
                    <code className="font-mono font-medium text-foreground">
                      {prop.name}
                    </code>
                    {prop.required && (
                      <span className="mt-1 block text-[10px] text-primary">
                        Required
                      </span>
                    )}
                  </th>
                  <td className="px-4 py-4">
                    <code className="font-mono text-[11px] leading-5 break-words text-foreground">
                      {prop.type}
                    </code>
                    <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                      {prop.description}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <code className="font-mono text-[11px] break-words">
                      {prop.defaultValue ?? "—"}
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="rounded-lg border border-border p-4 text-sm text-muted-foreground">
          This part has no declared props. See the implementation for its
          composition.
        </p>
      )}
      <details className="rounded-lg border border-border p-4 text-xs">
        <summary className="cursor-pointer font-medium">
          Declared TypeScript contract
        </summary>
        <pre
          tabIndex={0}
          className="mt-3 overflow-x-auto font-mono leading-6 break-words whitespace-pre-wrap text-muted-foreground"
        >
          {part?.contract}
        </pre>
      </details>
      <p className="text-xs leading-6 text-muted-foreground">
        Local overrides and key behavior props are shown. Native element and
        primitive props are also forwarded where declared in the contract. A
        dash means no local default is assigned; the underlying element or
        primitive may supply one.
      </p>
    </div>
  )
}

function AdditionalExamples({ slug }: { slug: string }) {
  const [pending, setPending] = useState(false)
  if (slug === "button")
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-border p-6">
          <h3 className="mb-5 text-sm font-medium">Sizes & icon actions</h3>
          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" size="xs">
              Extra small
            </Button>
            <Button type="button" size="sm">
              Small
            </Button>
            <Button type="button">Default</Button>
            <Button type="button" size="lg">
              Large
            </Button>
            <Button
              type="button"
              size="icon"
              variant="outline"
              aria-label="Continue"
            >
              <ArrowRight />
            </Button>
          </div>
        </div>
        <CodeBlock
          code={
            '<Button size="xs">Extra small</Button>\n<Button size="sm">Small</Button>\n<Button>Default</Button>\n<Button size="lg">Large</Button>\n<Button size="icon" variant="outline" aria-label="Continue">\n  <ArrowRight />\n</Button>'
          }
          filename="sizes.tsx"
        />
        <div className="rounded-xl border border-border p-6">
          <h3 className="mb-2 text-sm font-medium">Pending & disabled</h3>
          <p className="mb-5 text-xs leading-6 text-muted-foreground">
            Loading is composed from native props and a spinner. Try the action
            to see the state.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              disabled={pending}
              aria-busy={pending}
              onClick={() => {
                setPending(true)
                window.setTimeout(() => setPending(false), 1800)
              }}
            >
              {pending ? (
                <Loader2
                  aria-hidden="true"
                  className="animate-spin motion-reduce:animate-none"
                />
              ) : (
                <Check aria-hidden="true" />
              )}
              {pending ? "Saving…" : "Save changes"}
            </Button>
            <Button type="button" variant="outline" disabled>
              Unavailable
            </Button>
            <span role="status" className="sr-only">
              {pending ? "Saving changes" : "Ready"}
            </span>
          </div>
        </div>
        <CodeBlock
          code={
            'import { Loader2 } from "lucide-react"\nimport { Button } from "@/components/ui/button"\n\n// Set isPending from your form or mutation state.\n<Button type="submit" disabled={isPending} aria-busy={isPending}>\n  {isPending && <Loader2 aria-hidden="true" className="animate-spin motion-reduce:animate-none" />}\n  {isPending ? "Saving…" : "Save changes"}\n</Button>'
          }
          filename="pending.tsx"
        />
        <CodeBlock
          code={
            'import { Link } from "@tanstack/react-router"\nimport { Button } from "@/components/ui/button"\n\n<Button asChild variant="outline">\n  <Link to="/projects">View projects</Link>\n</Button>'
          }
          filename="as-link.tsx"
        />
      </div>
    )
  if (slug === "avatar")
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-6 rounded-xl border border-border p-6">
          {(["sm", "default", "lg"] as const).map((size) => (
            <div key={size} className="flex flex-col items-center gap-3">
              <Avatar size={size}>
                <AvatarImage
                  src="/images/portraits/01.webp"
                  alt="Akshay Saini"
                />
                <AvatarFallback>AS</AvatarFallback>
              </Avatar>
              <code className="text-[11px] text-muted-foreground">{size}</code>
            </div>
          ))}
          <div className="ml-4 flex flex-col items-center gap-3">
            <Avatar>
              <AvatarFallback>AS</AvatarFallback>
            </Avatar>
            <span className="text-[11px] text-muted-foreground">Fallback</span>
          </div>
        </div>
        <CodeBlock
          filename="fallback.tsx"
          code={
            'import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"\n\n<Avatar size="lg">\n  <AvatarImage src="/images/portraits/01.webp" alt="Akshay Saini" />\n  <AvatarFallback delayMs={200}>AS</AvatarFallback>\n</Avatar>'
          }
        />
      </div>
    )
  return null
}

export function ComponentDocPage({
  entry,
  reference,
}: {
  entry: DocEntry
  reference: ComponentReference
}) {
  const custom = entry.category === "custom"
  const guidance = getComponentGuidance(entry.slug, custom)
  const hasExamples = ["button", "avatar"].includes(entry.slug)
  const toc = [
    { id: "overview", title: "Overview" },
    { id: "playground", title: "Playground" },
    { id: "usage", title: "Usage" },
    ...(hasExamples ? [{ id: "examples", title: "Examples & states" }] : []),
    { id: "api-reference", title: "API reference" },
    { id: "styling", title: "Tokens & styling" },
    { id: "accessibility", title: "Accessibility" },
    { id: "customization", title: "Customization" },
    { id: "source", title: "Source" },
  ]
  const currentIndex = allDocEntries.findIndex(
    (item) => item.slug === entry.slug
  )
  const previous = allDocEntries[currentIndex - 1]
  const next = allDocEntries[currentIndex + 1]
  const related = guidance.related
    .filter((slug) => slug !== entry.slug)
    .map(getDocEntry)
    .filter((item): item is DocEntry => Boolean(item))
  return (
    <DocPage toc={toc}>
      <article className="min-w-0 space-y-10">
        <div id="overview" className="scroll-mt-24">
          <DocHeader
            category={custom ? "Portfolio patterns" : "Components"}
            title={entry.title}
            description={entry.description}
          >
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/30 px-2 py-1">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Local implementation
              </span>
              <span className="rounded-md border border-border px-2 py-1 text-muted-foreground">
                {reference.primitive}
              </span>
              <a
                href="#source"
                className="ml-1 inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
              >
                <FileCode2 className="size-3.5" />
                View source
                <ArrowUpRight className="size-3" />
              </a>
              {!custom && (
                <a
                  href={`https://ui.shadcn.com/docs/components/${entry.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
                >
                  shadcn/ui
                  <ExternalLink className="size-3" />
                </a>
              )}
            </div>
          </DocHeader>
          <div className="flex min-w-0 items-center justify-between gap-2 rounded-lg border border-border bg-muted/15 px-3 py-1.5">
            <code className="truncate font-mono text-[11px] text-muted-foreground">
              {reference.sourcePath}
            </code>
            <CopyButton value={reference.sourcePath} label="Copy source path" />
          </div>
        </div>
        <DocSection
          id="playground"
          title="Playground"
          description="Explore the real component in the current theme. Switch to Code to take the example with you."
        >
          <ComponentPlayground slug={entry.slug} reference={reference} />
        </DocSection>
        <DocSection
          id="usage"
          title="Usage"
          description="Import from the local component. This complete example includes its imports, state, and supporting data."
        >
          <CodeBlock
            code={reference.example.code}
            filename={reference.example.path.split("/").at(-1)}
            collapsible
          />
          <div className="space-y-3 pt-1">
            {guidance.usage.map((text, index) => (
              <p
                key={text}
                className="flex gap-3 text-sm leading-6 text-muted-foreground"
              >
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border border-border font-mono text-[10px] text-foreground">
                  {index + 1}
                </span>
                <span>{text}</span>
              </p>
            ))}
          </div>
        </DocSection>
        {hasExamples && (
          <DocSection
            id="examples"
            title="Examples & states"
            description="Common compositions using the existing component API."
          >
            <AdditionalExamples slug={entry.slug} />
          </DocSection>
        )}
        <DocSection
          id="api-reference"
          title="API reference"
          description="Generated from the TypeScript implementation in this repository. Select a part to inspect its props and local defaults."
        >
          <ReferenceTable reference={reference} />
        </DocSection>
        <DocSection
          id="styling"
          title="Tokens & styling"
          description="Use semantic tokens for appearance and data-slot attributes for targeting the component's parts."
        >
          {reference.tokens.length ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {reference.tokens.map((token) => (
                <div
                  key={token}
                  className="flex items-center gap-2 rounded-lg border border-border py-1.5 pr-1 pl-3"
                >
                  <span
                    className="size-4 shrink-0 rounded-full border border-border"
                    style={{ backgroundColor: `var(${token})` }}
                  />
                  <code className="min-w-0 flex-1 truncate text-[11px]">
                    {token}
                  </code>
                  <CopyButton value={`var(${token})`} label={`Copy ${token}`} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">
              This module does not directly reference semantic color utility
              tokens. Check composed components and inherited styles before
              changing its appearance.
            </p>
          )}
          {reference.slots.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Data slots</h3>
              <div className="flex flex-wrap gap-2">
                {reference.slots.map((slot) => (
                  <code
                    key={slot}
                    className="rounded-md border border-border bg-muted/20 px-2 py-1 font-mono text-[10px]"
                  >
                    {slot}
                  </code>
                ))}
              </div>
            </div>
          )}
          <Link
            to="/design-system/colors"
            className="inline-flex items-center gap-1 text-xs font-medium hover:underline"
          >
            Explore all color tokens
            <ArrowUpRight className="size-3" />
          </Link>
        </DocSection>
        <DocSection
          id="accessibility"
          title="Accessibility"
          description="Check the component in its surrounding page, including labels, motion, keyboard access, and reading order."
        >
          <div className="space-y-3">
            {guidance.accessibility.map((text) => (
              <p
                key={text}
                className="flex gap-3 text-sm leading-6 text-muted-foreground"
              >
                <ShieldCheck className="mt-1 size-4 shrink-0 text-foreground" />
                <span>{text}</span>
              </p>
            ))}
          </div>
          {guidance.keys && (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-xs">
                <caption className="sr-only">Keyboard interactions</caption>
                <thead className="border-b border-border bg-muted/25">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Key
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Interaction
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {guidance.keys.map(([key, action]) => (
                    <tr key={key}>
                      <td className="min-w-32 px-4 py-3">
                        <kbd className="font-mono text-[11px]">{key}</kbd>
                      </td>
                      <td className="px-4 py-3 leading-5 text-muted-foreground">
                        {action}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Link
            to="/design-system/accessibility"
            className="inline-flex items-center gap-1 text-xs font-medium hover:underline"
          >
            Accessibility guidelines
            <ArrowUpRight className="size-3" />
          </Link>
        </DocSection>
        <DocSection
          id="customization"
          title="Customization"
          description="Keep changes at the right level so the design system can evolve predictably."
        >
          <div className="divide-y divide-border rounded-xl border border-border">
            {[
              [
                "One instance",
                "Use className and existing props for a contextual adjustment. Avoid overriding shared styles in every consumer.",
              ],
              [
                "Shared component",
                `Change ${reference.sourcePath} when a new variant, size, or behavior should be available everywhere. Preserve the existing public contract or update its consumers.`,
              ],
              [
                "Theme-wide",
                "Change semantic tokens in src/lib/themes/themes/ and keep their Tailwind mappings in src/styles.css. Verify every appearance preset.",
              ],
            ].map(([title, text]) => (
              <div key={title} className="flex gap-3 p-4">
                <Code2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div>
                  <h3 className="text-xs font-semibold">{title}</h3>
                  <p className="mt-1 text-xs leading-6 text-muted-foreground">
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-3 rounded-lg border border-border bg-muted/20 p-4">
            <Info className="mt-0.5 size-4 shrink-0" />
            <p className="text-xs leading-6 text-muted-foreground">
              After changing the implementation, run{" "}
              <code className="text-foreground">npm run docs:generate</code> to
              refresh types, defaults, and examples. Dev startup and production
              builds also regenerate the reference.
            </p>
          </div>
          <Link
            to="/design-system/customization"
            className="inline-flex items-center gap-1 text-xs font-medium hover:underline"
          >
            Read the customization workflow
            <ArrowUpRight className="size-3" />
          </Link>
        </DocSection>
        <DocSection
          id="source"
          title="Source"
          description="Inspect or copy the current local implementation before making a shared change."
        >
          <ComponentSource slug={entry.slug} path={reference.sourcePath} />
          {reference.dependencies.length > 0 && (
            <p className="text-xs leading-6 break-words text-muted-foreground">
              Direct dependencies:{" "}
              <span className="font-mono text-foreground">
                {reference.dependencies.join(", ")}
              </span>
            </p>
          )}
        </DocSection>
        <div className="space-y-4 border-t border-border pt-8">
          <h2 className="text-sm font-semibold">Related components</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.slug}
                to="/design-system/components/$slug"
                params={{ slug: item.slug }}
                className="group rounded-lg border border-border p-4 transition-colors hover:bg-muted/30"
              >
                <span className="flex items-center justify-between gap-2 text-xs font-medium">
                  {item.title}
                  <ArrowUpRight className="size-3 text-muted-foreground group-hover:text-foreground" />
                </span>
              </Link>
            ))}
          </div>
        </div>
        <nav
          aria-label="Adjacent component pages"
          className="flex justify-between gap-4 border-t border-border pt-6"
        >
          {previous ? (
            <Link
              to="/design-system/components/$slug"
              params={{ slug: previous.slug }}
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              <span>
                Previous
                <span className="mt-1 block font-medium text-foreground">
                  {previous.title}
                </span>
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              to="/design-system/components/$slug"
              params={{ slug: next.slug }}
              className="flex items-center gap-2 text-right text-xs text-muted-foreground hover:text-foreground"
            >
              <span>
                Next
                <span className="mt-1 block font-medium text-foreground">
                  {next.title}
                </span>
              </span>
              <ArrowRight className="size-3.5" />
            </Link>
          )}
        </nav>
      </article>
    </DocPage>
  )
}
