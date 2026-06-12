import { Link, createFileRoute } from "@tanstack/react-router"
import { Palette, ScrollText, Shapes, Type } from "lucide-react"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const Route = createFileRoute("/design-system/")({
  head: () => ({
    meta: [{ title: "Introduction — Design System" }],
  }),
  component: DesignSystemIntroduction,
})

const foundationCards = [
  {
    title: "Colors",
    description: "OKLCH semantic tokens for light and dark themes.",
    to: "/design-system/colors" as const,
    icon: Palette,
  },
  {
    title: "Typography",
    description: "Geist type scale using Tailwind font tokens.",
    to: "/design-system/typography" as const,
    icon: Type,
  },
  {
    title: "M3 Shapes",
    description:
      "Material Design 3 expressive shapes for icons, masks, and placeholders.",
    to: "/design-system/components/$slug" as const,
    params: { slug: "m3-shapes" },
    icon: Shapes,
  },
  {
    title: "Scrollbars",
    description:
      "Brand primary thumb with transparent track — global and component usage.",
    to: "/design-system/scrollbars" as const,
    icon: ScrollText,
  },
] as const

const featuredComponents = [
  { title: "Button", slug: "button" },
  { title: "Card", slug: "card" },
  { title: "Badge", slug: "badge" },
  { title: "Dialog", slug: "dialog" },
] as const

function DesignSystemIntroduction() {
  return (
    <article className="space-y-12">
      <header className="space-y-4 border-b border-border pb-10">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Foundations
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Design System
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
          Component library and tokens for this portfolio — built with shadcn/ui,
          Tailwind CSS v4, and OKLCH colors.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Foundations</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {foundationCards.map((card) => (
            <Link
              key={card.to}
              to={card.to}
              {...("params" in card ? { params: card.params } : {})}
            >
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <card.icon className="size-5 text-muted-foreground" />
                  <CardTitle className="text-lg">{card.title}</CardTitle>
                  <CardDescription className="text-base">
                    {card.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          Featured components
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredComponents.map((item) => (
            <Link
              key={item.slug}
              to="/design-system/components/$slug"
              params={{ slug: item.slug }}
            >
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-base">{item.title}</CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </article>
  )
}
