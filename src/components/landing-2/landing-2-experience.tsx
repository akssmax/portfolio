import { DitherField } from "@/components/landing-2/dither-field"
import { OsWindow, type OsWindowTone } from "@/components/landing-2/os-window"
import { profile } from "@/lib/profile"

const TONES: OsWindowTone[] = ["cyan", "yellow", "lime", "orange"]

export function Landing2Experience() {
  const roles = profile.experience.slice(0, 4)

  return (
    <section id="experience" className="relative overflow-hidden border-b-2 border-foreground">
      <DitherField variant="desktop" color="cyan" />
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-8 sm:py-24">
        <p className="landing-2-ornament mb-4 text-center">::  selected roles  ::</p>
        <h2 className="landing-2-headline mb-6 text-center text-4xl sm:text-5xl lg:text-6xl">
          I took the opposite handoff direction
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-center text-sm leading-relaxed">
          Not decks for engineering to interpret. Product UI designed and shipped with the people
          building it — from YC fintech to agentic AI.
        </p>

        <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
          {roles.map((role) =>
            role.logoSrc ? (
              <OsWindow
                key={role.company}
                title={role.company}
                href={role.websiteUrl}
                tone="yellow"
                className="w-auto"
                bodyClassName="p-2"
              >
                <img
                  src={role.logoSrc}
                  alt={role.company}
                  className="h-10 w-24 object-contain"
                />
              </OsWindow>
            ) : null,
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {roles.map((role, index) => (
            <OsWindow
              key={`${role.company}-${role.period}`}
              title={role.company}
              href={role.websiteUrl}
              tone={TONES[index] ?? "cyan"}
              className="w-full"
            >
              <div className="flex items-start gap-3">
                {role.logoSrc ? (
                  <img
                    src={role.logoSrc}
                    alt=""
                    className="size-10 shrink-0 border border-foreground bg-background object-contain p-1"
                  />
                ) : null}
                <div className="min-w-0">
                  <p className="text-sm font-medium">{role.role}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {role.period} · {role.location}
                  </p>
                </div>
              </div>
              <p className="mt-3 leading-relaxed">{role.description}</p>
              <ul className="mt-3 space-y-1 text-muted-foreground">
                {role.highlights.slice(0, 3).map((item) => (
                  <li key={item}>+ {item}</li>
                ))}
              </ul>
            </OsWindow>
          ))}
        </div>
      </div>
    </section>
  )
}
