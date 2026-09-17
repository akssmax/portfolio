import { DitherField } from "@/components/landing-2/dither-field"
import { OsWindow } from "@/components/landing-2/os-window"
import { getDesignCareerSpanLabel } from "@/lib/experience-duration"
import { profile } from "@/lib/profile"

export function Landing2Proof() {
  const span = getDesignCareerSpanLabel(profile.experience.map((item) => item.period))

  return (
    <>
      <section className="relative overflow-hidden border-b-2 border-foreground">
        <DitherField variant="desktop" color="yellow" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-8 sm:py-24">
          <p className="landing-2-ornament mb-4 text-center">::  proof  ::</p>
          <h2 className="landing-2-headline mb-12 text-center text-4xl sm:text-5xl lg:text-6xl">
            Intelligence per hour is off the charts when design ships itself.
          </h2>
          <div className="grid gap-5 sm:grid-cols-3">
            <OsWindow title="Years.Design" tone="yellow" className="w-full">
              <p className="landing-2-headline text-5xl sm:text-6xl">{span.replace("Nearly ", "")}</p>
              <p className="mt-3 text-sm">in product and UX design.</p>
            </OsWindow>
            <OsWindow title="Companies.Ship" tone="orange" className="w-full" bodyClassName="p-0">
              <img
                src="/projects/kodo/hero.webp"
                alt=""
                className="h-24 w-full border-b border-foreground object-cover"
              />
              <div className="p-2">
                <p className="landing-2-headline text-4xl sm:text-5xl">YC + AI</p>
                <p className="mt-3 text-sm">100x.bot, Kodo (W21), Unlogged (S22).</p>
              </div>
            </OsWindow>
            <OsWindow title="Stack.Native" tone="lime" className="w-full" bodyClassName="p-0">
              <img
                src="/projects/100x/apps.webp"
                alt=""
                className="h-24 w-full border-b border-foreground object-cover"
              />
              <div className="p-2">
                <p className="landing-2-headline text-4xl sm:text-5xl">Figma + React</p>
                <p className="mt-3 text-sm">Design systems, prototypes, and production UI.</p>
              </div>
            </OsWindow>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b-2 border-foreground">
        <DitherField variant="desktop" color="lime" />
        <div className="relative z-10 mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-8 sm:py-24 md:grid-cols-2">
          <div>
            <p className="landing-2-ornament mb-3">::  output  ::</p>
            <p className="landing-2-headline text-7xl sm:text-8xl">6 yrs</p>
            <p className="mt-4 max-w-sm text-sm">Designing and shipping product UI, not handing off decks.</p>
          </div>
          <div>
            <p className="landing-2-ornament mb-3">::  companies  ::</p>
            <p className="landing-2-headline text-7xl sm:text-8xl">3× YC</p>
            <p className="mt-4 max-w-sm text-sm">100x.bot, Kodo W21, Unlogged S22 — plus 0→1 products in between.</p>
          </div>
        </div>
      </section>
    </>
  )
}
