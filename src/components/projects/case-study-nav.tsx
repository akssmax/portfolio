import { useEffect, useMemo, useState } from "react"

import { cn } from "@/lib/utils"
import { slugifyHeading } from "@/lib/sanity/slugify-heading"
import type { SectionHeadingBlock } from "@/lib/sanity/types"

type CaseStudyNavProps = {
  headings: SectionHeadingBlock[]
}

export function CaseStudyNav({ headings }: CaseStudyNavProps) {
  const [activeId, setActiveId] = useState<string | null>(null)

  const items = useMemo(
    () =>
      headings.map((heading) => ({
        id: slugifyHeading(heading.title),
        title: heading.title,
      })),
    [headings],
  )

  useEffect(() => {
    if (items.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    )

    for (const item of items) {
      const element = document.getElementById(item.id)
      if (element) observer.observe(element)
    }

    return () => observer.disconnect()
  }, [items])

  if (items.length < 2) return null

  return (
    <nav
      aria-label="Case study sections"
      className="sticky top-20 z-10 -mx-4 mb-10 hidden border-b border-border bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:block"
    >
      <ul className="flex flex-wrap gap-x-6 gap-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                "text-sm transition-colors hover:text-foreground",
                activeId === item.id
                  ? "font-medium text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
