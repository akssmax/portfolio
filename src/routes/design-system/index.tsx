import { Link, createFileRoute } from "@tanstack/react-router"
import { Accessibility, ArrowRight } from "lucide-react"

export const Route = createFileRoute("/design-system/")({
  head: () => ({
    meta: [{ title: "Introduction — Design System" }],
  }),
  component: DesignSystemIntroduction,
})

type CardLink = {
  title: string
  description: string
  to: string
  params?: { slug: string }
  visual: (props: { className?: string }) => React.ReactElement
}

const colors = [
  "--primary",
  "--chart-1",
  "--chart-2",
  "--chart-3",
  "--chart-4",
] as const

function ColorBars({ className }: { className?: string }) {
  return (
    <div className={className}>
      {colors.map((variable) => (
        <span
          key={variable}
          className="h-16 w-2.5 rounded-full"
          style={{ backgroundColor: `var(${variable})` }}
        />
      ))}
    </div>
  )
}

function TypeSpecimen({ className }: { className?: string }) {
  return (
    <div className={className}>
      <span className="text-2xl font-extrabold tracking-tight">Geist Sans</span>
      <span className="font-mono text-lg text-muted-foreground">Geist Mono</span>
    </div>
  )
}

function ComponentMock({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="grid place-items-center rounded-md bg-foreground px-3 h-8 text-xs font-medium text-background w-20">
        Button
      </div>
      <div className="flex h-8 w-fit items-center gap-1 rounded-md border border-border p-1">
        <span className="grid h-6 w-8 place-items-center rounded-[3px] bg-foreground/10 text-xs">
          1
        </span>
        <span className="grid h-6 w-8 place-items-center rounded-[3px] text-xs">
          2
        </span>
      </div>
      <div className="flex h-8 w-24 items-center rounded-md border border-border px-2 text-xs text-muted-foreground">
        Search
      </div>
    </div>
  )
}

function ScrollbarMock({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="relative h-20 w-40 rounded-md border border-border p-3">
        <div className="w-3/4 space-y-2">
          <div className="h-2 rounded bg-foreground/80" />
          <div className="h-2 w-2/3 rounded bg-foreground/50" />
          <div className="h-2 w-4/5 rounded bg-foreground/50" />
        </div>
        <div className="absolute right-1 top-1 h-3/5 w-1 rounded-full bg-foreground/80" />
        <div className="absolute bottom-1 left-1 h-1 w-3/5 rounded-full bg-foreground/30" />
      </div>
    </div>
  )
}

function ShapesMock({ className }: { className?: string }) {
  return (
    <div className={className}>
      {["rounded-full", "rounded-[18px]", "rounded-[8px]", "rounded-sm"].map(
        (radius) => (
          <span
            key={radius}
            className={`h-12 w-12 bg-muted-foreground/30 ${radius}`}
          />
        )
      )}
    </div>
  )
}

function AccChecker({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Accessibility className="size-12" strokeWidth={1} />
      <div className="h-2 w-20 bg-foreground" />
      <div className="h-2 w-14 bg-foreground/50" />
      <div className="h-2 w-8 bg-foreground/25" />
    </div>
  )
}

const cards: Array<CardLink> = [
  {
    title: "Colors",
    description: "Semantic OKLCH tokens mapped to the brand palette.",
    to: "/design-system/colors",
    visual: ({ className }) => <ColorBars className={className} />,
  },
  {
    title: "Typography",
    description: "Geist type scale via Tailwind font tokens.",
    to: "/design-system/typography",
    visual: ({ className }) => <TypeSpecimen className={className} />,
  },
  {
    title: "Components",
    description: "shadcn/ui building blocks for this portfolio.",
    to: "/design-system/components/button",
    params: { slug: "button" },
    visual: ({ className }) => <ComponentMock className={className} />,
  },
  {
    title: "M3 Shapes",
    description: "Expressive radii for icons, masks, and placeholders.",
    to: "/design-system/components/m3-shapes",
    params: { slug: "m3-shapes" },
    visual: ({ className }) => <ShapesMock className={className} />,
  },
  {
    title: "Scrollbars",
    description: "Brand primary thumbs with transparent tracks.",
    to: "/design-system/scrollbars",
    visual: ({ className }) => <ScrollbarMock className={className} />,
  },
  {
    title: "Accessibility",
    description: "Contrast, focus, and reduced-motion guidance.",
    to: "/design-system/accessibility",
    visual: ({ className }) => <AccChecker className={className} />,
  },
] as const

function DesignSystemIntroduction() {
  return (
    <article className="-m-6 flex flex-col sm:-m-10">
      <header className="px-6 pb-10 pt-14 sm:px-10 sm:pb-14 sm:pt-16">
        <p className="mb-3 text-sm font-medium text-muted-foreground">
          Foundations
        </p>
        <h1 className="mb-3 text-4xl font-semibold tracking-tight text-foreground sm:text-[40px] sm:leading-[48px]">
          Design System
        </h1>
        <p className="max-w-2xl text-lg leading-7 text-muted-foreground sm:text-xl sm:leading-relaxed">
          Component library and tokens for this portfolio — built with
          shadcn/ui, Tailwind CSS v4, and OKLCH colors.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-px border-y border-border bg-border md:grid-cols-2">
        {cards.map((card) => {
          const Graphic = card.visual
          return (
            <Link
              key={card.title}
              to={card.to}
              {...(card.params ? { params: card.params } : {})}
              className="group flex flex-col gap-10 bg-section p-6 transition-colors hover:bg-background sm:p-10"
            >
              <Graphic className="flex items-center gap-3" />
              <div className="mt-auto space-y-1.5">
                <p className="text-base font-semibold tracking-tight text-foreground">
                  {card.title}
                </p>
                <p className="text-sm leading-5 text-muted-foreground">
                  {card.description}
                </p>
              </div>
            </Link>
          )
        })}
      </div>

      <nav className="flex items-center justify-end px-6 py-6 sm:px-10">
        <Link
          to="/design-system/colors"
          className="flex items-center gap-1 rounded-md p-1 pr-2 text-sm text-foreground transition-colors hover:bg-accent"
        >
          <span className="text-xs font-medium text-muted-foreground">
            Next
          </span>
          <span className="font-medium">Colors</span>
          <ArrowRight className="size-4" />
        </Link>
      </nav>
    </article>
  )
}