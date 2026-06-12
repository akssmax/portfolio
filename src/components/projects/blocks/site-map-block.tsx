import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import type { SiteMapBlock } from "@/lib/sanity/types"

const LIVE_BASE = "https://100x.bot"

export function SiteMapBlockComponent({ block }: { block: SiteMapBlock }) {
  if (!block.groups?.length) return null

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
            <div className="flex flex-wrap gap-2">
              {group.routes?.map((route) => (
                <Badge key={route._key ?? route.path} variant="secondary" asChild>
                  <a
                    href={`${LIVE_BASE}${route.path}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:bg-secondary/80"
                  >
                    {route.label}
                  </a>
                </Badge>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
