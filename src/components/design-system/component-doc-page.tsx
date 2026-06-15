"use client"

import { lazy, Suspense } from "react"

import { DocPreview } from "@/components/design-system/doc-preview"
import { DocSection } from "@/components/design-system/doc-section"
import { loadDemo } from "@/components/design-system/demos"
import type { DocEntry } from "@/lib/design-system-registry"

function DemoPreview({ slug }: { slug: string }) {
  const Demo = lazy(() => loadDemo(slug).then((component) => ({ default: component })))

  return (
    <Suspense
      fallback={
        <div className="flex min-h-32 items-center justify-center text-sm text-muted-foreground">
          Loading preview…
        </div>
      }
    >
      <Demo />
    </Suspense>
  )
}

export function ComponentDocPage({ entry }: { entry: DocEntry }) {
  return (
    <article className="space-y-10">
      <header className="space-y-3 border-b border-border pb-8">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          {entry.category === "custom" ? "Custom" : "Components"}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {entry.title}
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground">
          {entry.description}
        </p>
      </header>

      <DocSection title="Preview" description="Live component example.">
        <DocPreview>
          <DemoPreview slug={entry.slug} />
        </DocPreview>
      </DocSection>
    </article>
  )
}
