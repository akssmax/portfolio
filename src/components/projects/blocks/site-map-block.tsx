import { ExternalLink } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import type { SiteMapBlock } from "@/lib/sanity/types"

const LIVE_BASE = "https://100x.bot"

function routeHref(baseUrl: string, path: string) {
  const base = baseUrl.replace(/\/$/, "")
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${base}${normalizedPath}`
}

export function SiteMapBlockComponent({ block }: { block: SiteMapBlock }) {
  if (!block.groups?.length) return null

  const baseUrl = block.baseUrl ?? LIVE_BASE
  const linkRoutes = baseUrl.length > 0

  return (
    <Accordion type="multiple" className="w-full">
      {block.groups.map((group) => (
        <AccordionItem key={group._key ?? group.title} value={group.title}>
          <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
            {group.title}
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            {group.description ? (
              <p className="text-sm leading-relaxed text-muted-foreground">
                {group.description}
              </p>
            ) : null}
            {group.screenshotSrc ? (
              <img
                src={group.screenshotSrc}
                alt={`${group.title} screenshot`}
                className="w-full rounded-lg border border-border object-cover object-top"
              />
            ) : null}
            {group.routes?.length ? (
              <div className="flex flex-wrap gap-2">
                {group.routes.map((route) =>
                  linkRoutes ? (
                    <Badge key={route._key ?? route.path} variant="outline" asChild>
                      <a
                        href={routeHref(baseUrl, route.path)}
                        target="_blank"
                        rel="noreferrer"
                        className="gap-1.5 hover:bg-muted/50"
                      >
                        {route.label}
                        <ExternalLink className="size-3" />
                      </a>
                    </Badge>
                  ) : (
                    <Badge key={route._key ?? route.path} variant="secondary">
                      {route.label}
                    </Badge>
                  ),
                )}
              </div>
            ) : null}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
