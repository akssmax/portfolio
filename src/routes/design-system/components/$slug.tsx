import { Link, createFileRoute } from "@tanstack/react-router"

import { ComponentDocPage } from "@/components/design-system/component-doc-page"
import { Button } from "@/components/ui/button"
import { getDocEntry } from "@/lib/design-system-registry"

export const Route = createFileRoute("/design-system/components/$slug")({
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
  const entry = getDocEntry(slug)

  if (!entry) {
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

  return <ComponentDocPage entry={entry} />
}
