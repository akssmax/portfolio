import { Link, createFileRoute } from "@tanstack/react-router"

import { ComponentDocPage } from "@/components/design-system/component-doc-page"
import { Button } from "@/components/ui/button"
import { getDocEntry } from "@/lib/design-system-registry"
import { loadComponentReference } from "@/lib/design-system/docs"

export const Route = createFileRoute("/design-system/components/$slug")({
  loader: ({ params }) => loadComponentReference(params.slug),
  head: ({ params }) => {
    const entry = getDocEntry(params.slug)
    return {
      meta: [
        {
          title: entry
            ? `${entry.title} — Design System`
            : "Component — Design System",
        },
      ],
    }
  },
  component: ComponentDocRoute,
})

function ComponentDocRoute() {
  const { slug } = Route.useParams()
  const reference = Route.useLoaderData()
  const entry = getDocEntry(slug)

  if (!entry || !reference) {
    return (
      <div className="space-y-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Component not found</h1>
        <p className="text-muted-foreground">
          No documentation for &quot;{slug}&quot;.
        </p>
        <Button asChild variant="outline">
          <Link to="/design-system">Back to introduction</Link>
        </Button>
      </div>
    )
  }

  return <ComponentDocPage key={slug} entry={entry} reference={reference} />
}
