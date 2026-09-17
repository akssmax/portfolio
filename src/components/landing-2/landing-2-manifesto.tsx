import { OsButton } from "@/components/landing-2/os-button"
import { OsWindow } from "@/components/landing-2/os-window"
import { profile } from "@/lib/profile"

const FEATURES = [
  {
    title: "Figma, not decks",
    body: "Shippable UI that software teams can actually build from.",
    tone: "cyan" as const,
    image: "/projects/kodo/products.webp",
  },
  {
    title: "calibrated systems",
    body: "Tokens, components, and flows that stay consistent in production.",
    tone: "lime" as const,
    image: "/projects/100x/apps.webp",
  },
  {
    title: "more like code",
    body: "I design what I write — React, not a handoff graveyard.",
    tone: "orange" as const,
    image: "/projects/postforge/tool.webp",
  },
]

export function Landing2Manifesto() {
  return (
    <section
      id="manifesto"
      className="relative overflow-hidden border-b-2 border-foreground bg-background px-4 py-16 sm:px-8 sm:py-24"
    >
      <p className="pointer-events-none absolute top-1/2 left-3 hidden -translate-y-1/2 -rotate-90 text-[9px] tracking-[0.28em] text-muted-foreground lg:block">
        TYPE.AS.DESIGN.ENGINEER
      </p>
      <OsWindow
        title="Atmosphere 1.1"
        className="absolute top-10 left-8 hidden w-[12rem] xl:block"
        tone="lime"
        bodyClassName="p-0"
      >
        <img
          src="/images/hero-light-forest.webp"
          alt=""
          className="aspect-[5/4] w-full object-cover"
        />
      </OsWindow>
      <OsWindow
        title="Portrait 1.2"
        className="absolute top-10 right-8 hidden w-[9.5rem] xl:block"
        tone="pink"
        bodyClassName="p-0"
      >
        <img
          src="/images/portraits/01.webp"
          alt=""
          className="aspect-[4/5] w-full object-cover object-top"
        />
      </OsWindow>
      <div className="mx-auto max-w-5xl">
        <p className="landing-2-ornament mb-6 text-center">
          Introducing {profile.name} ........................ Designer who ships
        </p>
        <h1 className="landing-2-headline text-center text-5xl sm:text-7xl lg:text-[5.35rem]">
          I design in Figma; I ship React like product code.
        </h1>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xl sm:text-2xl">
          <a href="#work" className="landing-2-text-link">
            View work
          </a>
          <a href="#experience" className="landing-2-text-link">
            Experience
          </a>
          <OsButton href={`mailto:${profile.contact.email}`} inverted>
            Hire me
          </OsButton>
        </div>

        <div className="mt-20 grid gap-10 md:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-medium">not mockups</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Handoff-first design has led to decks that look finished and products that are not.
              I take the opposite direction: design the interface in Figma, then ship it in React
              so engineering can move without translating intent twice.
            </p>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">a new model</p>
            <p className="text-sm leading-relaxed text-muted-foreground">{profile.bio}</p>
          </div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <OsWindow
              key={feature.title}
              title={feature.title}
              tone={feature.tone}
              bodyClassName="p-0"
            >
              <img
                src={feature.image}
                alt=""
                className="h-28 w-full border-b border-foreground object-cover"
              />
              <p className="p-2.5 text-sm leading-relaxed">{feature.body}</p>
            </OsWindow>
          ))}
        </div>
      </div>
    </section>
  )
}
