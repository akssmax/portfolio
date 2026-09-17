import { DitherField } from "@/components/landing-2/dither-field"
import { OsButton } from "@/components/landing-2/os-button"
import { OsWindow } from "@/components/landing-2/os-window"
import { profile } from "@/lib/profile"
import { testimonials } from "@/lib/testimonials"

export function Landing2About() {
  const quotes = testimonials.slice(0, 2)

  return (
    <section id="about" className="relative overflow-hidden border-b-2 border-foreground">
      <DitherField variant="desktop" color="violet" />
      <div className="relative z-10 mx-auto grid max-w-6xl items-start gap-10 px-4 py-16 sm:px-8 sm:py-24 md:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="landing-2-ornament mb-3">not just mockups</p>
          <h2 className="landing-2-headline text-4xl sm:text-5xl lg:text-6xl">
            Come build with a designer who writes the UI.
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-relaxed">{profile.bio}</p>
          <div className="relative mt-8 max-w-sm">
            <OsWindow title="Portrait 1.1" className="w-full" tone="violet" bodyClassName="p-0">
              <img
                src="/images/portraits/02.webp"
                alt={profile.name}
                className="aspect-[4/5] w-full object-cover object-top"
              />
            </OsWindow>
            <OsWindow
              title="Portrait 1.2"
              className="absolute -right-10 -bottom-8 hidden w-[8.5rem] rotate-3 sm:block"
              tone="pink"
              bodyClassName="p-0"
            >
              <img
                src="/images/portraits/04.webp"
                alt=""
                className="aspect-[4/5] w-full object-cover object-top"
              />
            </OsWindow>
          </div>
          <div className="mt-16 flex flex-wrap gap-3">
            <OsButton inverted href={`mailto:${profile.contact.email}`}>
              Email Akshay
            </OsButton>
            <OsButton href={profile.links.linkedin}>LinkedIn</OsButton>
            <OsButton href="/resume">Resume</OsButton>
          </div>
        </div>

        <div className="grid gap-4">
          <OsWindow title="Atmosphere 1.2" tone="cyan" bodyClassName="p-0" className="w-full">
            <img
              src="/images/hero-atmosphere.webp"
              alt=""
              className="h-36 w-full object-cover"
            />
          </OsWindow>
          {quotes.map((quote) => {
            const quoteText = quote.quote.map((part) => part.text).join("")
            return (
              <OsWindow
                key={quote.id}
                title={`${quote.date} · Recommendation`}
                href={quote.linkedInUrl}
                tone="pink"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={quote.avatarSrc}
                    alt=""
                    className="size-10 border border-foreground object-cover"
                  />
                  <div>
                    <p className="font-medium">{quote.name}</p>
                    <p className="text-[10px] text-muted-foreground">{quote.headline}</p>
                  </div>
                </div>
                <p className="mt-3 line-clamp-6 leading-relaxed">{quoteText}</p>
                <p className="mt-2 underline">Read More</p>
              </OsWindow>
            )
          })}
        </div>
      </div>
    </section>
  )
}
