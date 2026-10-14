import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export type TocItem = { id: string; title: string }

export function DocPage({
  children,
  toc,
}: {
  children: React.ReactNode
  toc: TocItem[]
}) {
  const [active, setActive] = useState(toc[0]?.id ?? "")
  const ids = toc.map((item) => item.id).join(",")
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (visible[0]) setActive(visible[0].target.id)
      },
      {
        root: document.getElementById("documentation-content"),
        rootMargin: "-40px 0px -60% 0px",
      }
    )
    for (const id of ids.split(",")) {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    }
    return () => observer.disconnect()
  }, [ids])
  return (
    <div className="mx-auto grid w-full max-w-[1240px] min-w-0 gap-12 px-5 py-9 sm:px-9 sm:py-12 xl:grid-cols-[minmax(0,1fr)_160px] xl:gap-14 xl:px-12">
      <div className="min-w-0">
        <details className="mb-8 rounded-lg border border-border px-4 py-3 text-sm xl:hidden">
          <summary className="cursor-pointer font-medium">On this page</summary>
          <nav
            aria-label="On this page"
            className="mt-3 grid gap-2 text-muted-foreground"
          >
            {toc.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="rounded-sm py-1 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
              >
                {item.title}
              </a>
            ))}
          </nav>
        </details>
        {children}
      </div>
      <aside className="hidden xl:block">
        <nav aria-label="On this page" className="sticky top-10 space-y-4">
          <p className="text-xs font-semibold">On this page</p>
          <ul className="space-y-1 border-l border-border">
            {toc.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={active === item.id ? "location" : undefined}
                  onClick={() => setActive(item.id)}
                  className={cn(
                    "-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-xs leading-5 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring",
                    active === item.id
                      ? "border-primary font-medium text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
          <p className="pt-5 text-xs leading-5 text-muted-foreground">
            Built here. Documented from the source.
          </p>
        </nav>
      </aside>
    </div>
  )
}

export function DocHeader({
  category = "Foundations",
  title,
  description,
  children,
}: {
  category?: string
  title: string
  description: string
  children?: React.ReactNode
}) {
  return (
    <header className="space-y-4 pb-8">
      <p className="text-xs font-medium text-muted-foreground">
        Documentation <span className="px-2 text-border">/</span> {category}
      </p>
      <h1 className="text-4xl font-semibold tracking-tight sm:text-[44px] sm:leading-tight">
        {title}
      </h1>
      <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
        {description}
      </p>
      {children}
    </header>
  )
}
