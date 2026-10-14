import { Link2 } from "lucide-react"

export function DocSection({
  id,
  title,
  description,
  children,
}: {
  id?: string
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id ?? title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
      className="scroll-mt-24 space-y-5"
    >
      <div>
        <h2 className="group flex items-center gap-2 text-xl font-semibold tracking-tight text-foreground">
          {title}
          <a
            href={`#${id ?? title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
            aria-label={`Link to ${title}`}
            className="rounded-sm text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
          >
            <Link2 className="size-4" />
          </a>
        </h2>
        {description ? (
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  )
}
