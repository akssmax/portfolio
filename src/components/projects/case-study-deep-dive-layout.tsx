import { useEffect, useState } from "react"
import {
  ArrowDown,
  ArrowUpRight,
  ChevronDown,
  CircleCheck,
  CircleDashed,
} from "lucide-react"
import type { CSSProperties, ReactNode } from "react"

import type {
  CaseStudyColors,
  CaseStudyMedia,
  CaseStudyPalette,
  CaseStudyPrototype,
} from "@/lib/projects/case-study-story"
import type {
  DeepDiveChapter,
  DeepDiveSection,
  DeepDiveStudy,
} from "@/lib/projects/case-study-deep-dive"
import { CaseStudyBackLink } from "@/components/projects/case-study-back-link"
import { ProjectCardWaveBackground } from "@/components/marketing/project-card-wave-background"
import { cn } from "@/lib/utils"

const shellClass = "mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10"
const accent = "text-[var(--cs-accent)] dark:text-[var(--cs-accent-d)]"
const accentStrong =
  "text-[var(--cs-accent-strong)] dark:text-[var(--cs-accent-strong-d)]"
const eyebrowClass = `text-xs font-semibold tracking-[0.18em] uppercase ${accent}`
const labelClass = `text-[0.7rem] font-semibold tracking-[0.18em] uppercase ${accent}`
const proseClass = "max-w-[42rem]"
const linkClass = `inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4 ${accentStrong} hover:text-[var(--cs-accent-hover)] dark:hover:text-[var(--cs-accent-hover-d)]`

function kebabCase(value: string) {
  return value.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)
}

function paletteVars(palette: CaseStudyPalette): CSSProperties {
  const vars: Record<string, string> = {}
  const entries = Object.entries(palette.light) as Array<
    [keyof CaseStudyColors, string]
  >
  for (const [key, value] of entries) {
    vars[`--cs-${kebabCase(key)}`] = value
    vars[`--cs-${kebabCase(key)}-d`] = palette.dark[key]
  }
  return vars
}

type TocEntry = { id: string; label: string; number?: string }

function tocEntries(sections: Array<DeepDiveSection>): Array<TocEntry> {
  return sections.flatMap((section) => {
    if (section.kind === "quote") return []
    if (section.kind === "chapter") {
      return [
        {
          id: section.id,
          label: section.toc,
          number: section.chapter.number,
        },
      ]
    }
    return [{ id: section.id, label: section.toc }]
  })
}

/** Tracks which section is in view, for the table of contents. */
function useActiveSection(ids: Array<string>) {
  const [active, setActive] = useState(ids[0])
  const key = ids.join("|")

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null)
    if (elements.length === 0) return

    const update = () => {
      const line = window.innerHeight * 0.4
      let current = elements[0].id
      for (const element of elements) {
        if (element.getBoundingClientRect().top <= line) current = element.id
      }
      setActive(current)
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [key])

  return active
}

function useReadingProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const update = () => {
      const article = document.getElementById("case-study-body")
      if (!article) return
      const rect = article.getBoundingClientRect()
      const total = rect.height - window.innerHeight * 0.5
      const read = Math.min(Math.max(-rect.top + 160, 0), Math.max(total, 1))
      setProgress(total > 0 ? read / total : 0)
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])
  return progress
}

function DesktopToc({
  entries,
  active,
  progress,
}: {
  entries: Array<TocEntry>
  active: string
  progress: number
}) {
  return (
    <nav
      aria-label="On this page"
      className="sticky top-28 hidden max-h-[calc(100svh-8rem)] self-start overflow-y-auto pb-10 lg:block"
    >
      <p className={eyebrowClass}>On this page</p>
      <div className="relative mt-5">
        <div
          className="absolute top-0 bottom-0 left-0 w-px bg-border"
          aria-hidden="true"
        />
        <div
          className="absolute top-0 left-0 w-px bg-[var(--cs-accent-strong)] transition-[height] duration-150 dark:bg-[var(--cs-accent-strong-d)]"
          style={{ height: `${Math.round(progress * 100)}%` }}
          aria-hidden="true"
        />
        <ol className="space-y-0.5">
          {entries.map((entry) => {
            const isActive = entry.id === active
            return (
              <li key={entry.id}>
                <a
                  href={`#${entry.id}`}
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "relative flex gap-2.5 py-1.5 pl-4 text-sm leading-snug transition-colors",
                    isActive
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isActive ? (
                    <span
                      className="absolute top-1/2 -left-[3px] size-[7px] -translate-y-1/2 rounded-full bg-[var(--cs-accent-strong)] dark:bg-[var(--cs-accent-strong-d)]"
                      aria-hidden="true"
                    />
                  ) : null}
                  {entry.number ? (
                    <span
                      className={cn("font-mono text-xs tabular-nums", accent)}
                    >
                      {entry.number}
                    </span>
                  ) : null}
                  <span>{entry.label}</span>
                </a>
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}

function MobileToc({
  entries,
  active,
  progress,
}: {
  entries: Array<TocEntry>
  active: string
  progress: number
}) {
  const [open, setOpen] = useState(false)
  const current = entries.find((entry) => entry.id === active) ?? entries[0]

  return (
    <div className="sticky top-16 z-20 border-b border-border bg-background/95 backdrop-blur-md lg:hidden">
      <div className={shellClass}>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-toc-list"
          onClick={() => setOpen((value) => !value)}
          className="flex w-full items-center justify-between gap-3 py-3.5 text-left text-sm"
        >
          <span className="min-w-0 truncate">
            <span className="text-muted-foreground">On this page: </span>
            <span className="font-semibold">
              {current.number ? `${current.number} ` : ""}
              {current.label}
            </span>
          </span>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 transition-transform",
              open && "rotate-180"
            )}
            aria-hidden="true"
          />
        </button>
        {open ? (
          <ol
            id="mobile-toc-list"
            className="max-h-[60svh] overflow-y-auto pb-4"
          >
            {entries.map((entry) => (
              <li key={entry.id}>
                <a
                  href={`#${entry.id}`}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex gap-2.5 rounded-lg px-2 py-2 text-sm",
                    entry.id === active
                      ? "bg-muted font-semibold text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {entry.number ? (
                    <span className={cn("font-mono text-xs", accent)}>
                      {entry.number}
                    </span>
                  ) : null}
                  {entry.label}
                </a>
              </li>
            ))}
          </ol>
        ) : null}
      </div>
      <div
        className="h-0.5 bg-[var(--cs-accent-strong)] transition-[width] duration-150 dark:bg-[var(--cs-accent-strong-d)]"
        style={{ width: `${Math.round(progress * 100)}%` }}
        aria-hidden="true"
      />
    </div>
  )
}

function Hero({
  study,
  logo,
  waveSlug,
}: {
  study: DeepDiveStudy
  logo: ReactNode
  waveSlug: string
}) {
  return (
    <header className="relative isolate overflow-hidden bg-[var(--cs-hero-bg)] text-[var(--cs-hero-ink)] dark:bg-[var(--cs-hero-bg-d)] dark:text-[var(--cs-hero-ink-d)]">
      <ProjectCardWaveBackground slug={waveSlug} variant="hero" />
      <div className={`relative ${shellClass} pt-8 pb-16 sm:pt-12 sm:pb-20`}>
        <CaseStudyBackLink className="text-[var(--cs-hero-muted)] hover:bg-white/70 dark:text-[var(--cs-hero-muted-d)] dark:hover:bg-white/10" />
        <div className="mt-16 flex flex-wrap items-center justify-between gap-6 sm:mt-20">
          <div className="inline-flex items-center gap-4 rounded-2xl border border-[var(--cs-hero-chip-border)] bg-[var(--cs-hero-chip-bg)] px-5 py-4 shadow-sm backdrop-blur-sm dark:border-[var(--cs-hero-chip-border-d)] dark:bg-[var(--cs-hero-chip-bg-d)]">
            <span className="text-[var(--cs-hero-ink)] dark:text-[var(--cs-hero-ink-d)]">
              {logo}
            </span>
            <span
              className="h-7 w-px bg-[var(--cs-divider)] dark:bg-[var(--cs-divider-d)]"
              aria-hidden="true"
            />
            <span className={eyebrowClass}>Case study</span>
          </div>
          <span className="rounded-full border border-[var(--cs-chip-border)] bg-[var(--cs-chip-bg)] px-4 py-2 font-mono text-xs text-[var(--cs-chip-ink)] dark:border-[var(--cs-chip-border-d)] dark:bg-[var(--cs-chip-bg-d)] dark:text-[var(--cs-chip-ink-d)]">
            {study.period}
          </span>
        </div>
        <h1 className="mt-10 max-w-5xl font-heading text-[clamp(2.4rem,4.5vw,4.5rem)] leading-[1.04] font-semibold tracking-[-0.04em]">
          {study.title}
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-relaxed text-[var(--cs-hero-sub)] sm:text-xl dark:text-[var(--cs-hero-sub-d)]">
          {study.description}
        </p>
        {study.facts?.length ? (
          <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--cs-divider)] bg-[var(--cs-divider)] lg:grid-cols-4 dark:border-[var(--cs-divider-d)] dark:bg-[var(--cs-divider-d)]">
            {study.facts.map((fact) => (
              <div
                key={fact.label}
                className="bg-[var(--cs-hero-chip-bg)] p-4 backdrop-blur-sm sm:p-5 dark:bg-[var(--cs-hero-chip-bg-d)]"
              >
                <dt className="sr-only">{fact.label}</dt>
                <dd>
                  <span className="block font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                    {fact.value}
                  </span>
                  {fact.href ? (
                    <a
                      href={fact.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-sm text-[var(--cs-hero-sub)] underline-offset-4 hover:underline dark:text-[var(--cs-hero-sub-d)]"
                    >
                      {fact.label}
                      <ArrowUpRight
                        className="size-3.5 shrink-0"
                        aria-hidden="true"
                      />
                    </a>
                  ) : (
                    <span className="mt-1 block text-sm text-[var(--cs-hero-sub)] dark:text-[var(--cs-hero-sub-d)]">
                      {fact.label}
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
        <div className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t border-[var(--cs-divider)] pt-6 text-sm dark:border-[var(--cs-divider-d)]">
          <div>
            <p className={eyebrowClass}>Role</p>
            <p className="mt-2 text-lg font-semibold">{study.role}</p>
          </div>
          <a
            href="#case-study-body"
            className="inline-flex items-center gap-2 font-medium hover:underline"
          >
            Read the case study{" "}
            <ArrowDown className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </header>
  )
}

function SectionShell({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string
  eyebrow: string
  title: string
  children: ReactNode
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-32 border-t border-border py-16 first:border-t-0 first:pt-0 sm:py-20"
    >
      <p className={eyebrowClass}>{eyebrow}</p>
      <h2
        id={`${id}-title`}
        className="mt-4 max-w-3xl font-heading text-3xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem]"
      >
        {title}
      </h2>
      {children}
    </section>
  )
}

function Figure({ media }: { media: CaseStudyMedia }) {
  return (
    <figure
      data-media-slot={media.id}
      className={media.format === "wide" ? "sm:col-span-2" : ""}
    >
      <div className="overflow-hidden rounded-2xl border border-border/70 bg-[var(--cs-media-bg)] shadow-sm dark:bg-[var(--cs-media-bg-d)]">
        <img
          src={media.src}
          alt={media.alt ?? media.title}
          loading="lazy"
          decoding="async"
          className="block h-auto w-full"
        />
      </div>
      <figcaption className="mt-2.5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm">
        <span className="font-medium text-foreground">{media.title}</span>
        <span className="text-muted-foreground">{media.caption}</span>
      </figcaption>
    </figure>
  )
}

function Chapter({ chapter }: { chapter: DeepDiveChapter }) {
  // Empty slots stay in the data and show up once an export is added.
  const media = chapter.media.filter((item) => item.src)

  return (
    <SectionShell
      id={chapter.id}
      eyebrow={`${chapter.number} · ${chapter.label}`}
      title={chapter.title}
    >
      <p
        className={`mt-6 ${proseClass} text-xl leading-relaxed text-foreground/85`}
      >
        {chapter.introduction}
      </p>

      <div className={`mt-10 ${proseClass} space-y-8`}>
        {[
          ["The problem", chapter.problem],
          ["My role", chapter.responsibility],
          ["Approach", chapter.approach],
        ].map(([label, text]) => (
          <div key={label}>
            <h3 className={labelClass}>{label}</h3>
            <p className="mt-2.5 text-[1.0625rem] leading-relaxed text-foreground/80">
              {text}
            </p>
          </div>
        ))}
      </div>

      {media.length ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {media.map((item) => (
            <Figure key={item.id} media={item} />
          ))}
        </div>
      ) : null}

      <div className={`mt-12 ${proseClass}`}>
        <h3 className={labelClass}>
          {chapter.decisionLabel ?? "Key decisions"}
        </h3>
        <ol className="mt-4 space-y-3">
          {chapter.decisions.map((decision, index) => (
            <li
              key={decision}
              className="flex gap-4 rounded-xl border border-border bg-card p-4 sm:p-5"
            >
              <span
                className={cn(
                  "font-heading text-2xl leading-none font-semibold tabular-nums",
                  accentStrong
                )}
              >
                {index + 1}
              </span>
              <span className="text-base leading-relaxed text-foreground/85">
                {decision}
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex gap-3 rounded-xl border-l-2 border-[var(--cs-accent-strong)] bg-[var(--cs-alt-bg)] py-4 pr-5 pl-4 dark:border-[var(--cs-accent-strong-d)] dark:bg-[var(--cs-alt-bg-d)]">
          <CircleCheck
            className={cn("mt-0.5 size-4 shrink-0", accentStrong)}
            aria-hidden="true"
          />
          <div>
            <p className={labelClass}>
              {chapter.shippedLabel ?? "What shipped"}
            </p>
            <p className="mt-1.5 text-base leading-relaxed text-foreground/85">
              {chapter.shipped}
            </p>
          </div>
        </div>

        {chapter.publicLink ? (
          <a
            href={chapter.publicLink.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-6 ${linkClass}`}
          >
            {chapter.publicLink.label}
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        ) : null}
      </div>
    </SectionShell>
  )
}

function ModuleList({
  label,
  modules,
  shipped,
}: {
  label: string
  modules: ReadonlyArray<{ name: string; detail: string }>
  shipped: boolean
}) {
  const Icon = shipped ? CircleCheck : CircleDashed
  return (
    <div>
      <h3 className={labelClass}>
        {label} · {modules.length}
      </h3>
      <ul className="mt-4 grid gap-x-8 gap-y-1 sm:grid-cols-2">
        {modules.map((module) => (
          <li
            key={module.name}
            className="flex gap-3 border-b border-border py-3.5"
          >
            <Icon
              className={cn(
                "mt-0.5 size-4 shrink-0",
                shipped ? accentStrong : "text-muted-foreground"
              )}
              aria-hidden="true"
            />
            <span>
              <span
                className={cn(
                  "block font-semibold",
                  !shipped && "text-foreground/75"
                )}
              >
                {module.name}
              </span>
              <span className="mt-0.5 block text-sm leading-relaxed text-muted-foreground">
                {module.detail}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function PrototypeBlock({
  id,
  prototype,
}: {
  id: string
  prototype: CaseStudyPrototype
}) {
  const embedUrl = new URL(prototype.url)
  embedUrl.hostname = "embed.figma.com"
  embedUrl.searchParams.set("embed-host", "akshay-saini-portfolio")

  return (
    <SectionShell
      id={id}
      eyebrow={prototype.eyebrow ?? "Interactive prototype"}
      title={prototype.title}
    >
      <p
        className={`mt-6 ${proseClass} text-lg leading-relaxed text-muted-foreground`}
      >
        {prototype.description}
      </p>
      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-[var(--cs-alt-bg)] shadow-sm dark:bg-[var(--cs-alt-bg-d)]">
        <iframe
          src={embedUrl.toString()}
          title={`Interactive ${prototype.previewTitle} prototype in Figma`}
          loading="lazy"
          allow="fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="block h-[560px] w-full sm:h-[680px]"
        />
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
        <span>
          Viewing may need a Figma account. Use the link if it doesn&apos;t
          load.
        </span>
        <a
          href={prototype.url}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          {prototype.openLabel ?? "Open in Figma"}
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </a>
      </div>
    </SectionShell>
  )
}

function Section({ section }: { section: DeepDiveSection }) {
  switch (section.kind) {
    case "prose":
      return (
        <SectionShell
          id={section.id}
          eyebrow={section.eyebrow}
          title={section.title}
        >
          <div className={`mt-6 ${proseClass} space-y-5`}>
            {section.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="text-[1.0625rem] leading-relaxed text-foreground/80 first:text-xl first:text-foreground/85"
              >
                {paragraph}
              </p>
            ))}
          </div>
          {section.callout ? (
            <aside className="mt-10 rounded-2xl border border-[var(--cs-divider)] bg-[var(--cs-alt-bg)] p-6 sm:p-8 dark:border-[var(--cs-divider-d)] dark:bg-[var(--cs-alt-bg-d)]">
              <p className={eyebrowClass}>{section.callout.eyebrow}</p>
              <p className="mt-3 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                {section.callout.title}
              </p>
              <p
                className={`mt-3 ${proseClass} text-base leading-relaxed text-foreground/80 sm:text-lg`}
              >
                {section.callout.body}
              </p>
            </aside>
          ) : null}
        </SectionShell>
      )
    case "chapter":
      return <Chapter chapter={section.chapter} />
    case "modules":
      return (
        <SectionShell
          id={section.id}
          eyebrow={section.eyebrow}
          title={section.title}
        >
          <p
            className={`mt-6 ${proseClass} text-lg leading-relaxed text-muted-foreground`}
          >
            {section.intro}
          </p>
          <div className="mt-10 space-y-10">
            <ModuleList
              label="Shipped in v1"
              modules={section.shipped}
              shipped
            />
            <ModuleList
              label="Designed, not shipped"
              modules={section.designed}
              shipped={false}
            />
          </div>
        </SectionShell>
      )
    case "steps":
      return (
        <SectionShell
          id={section.id}
          eyebrow={section.eyebrow}
          title={section.title}
        >
          <p
            className={`mt-6 ${proseClass} text-lg leading-relaxed text-muted-foreground`}
          >
            {section.intro}
          </p>
          <ol className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
            {section.steps.map((step, index) => (
              <li key={step.title} className="bg-card p-5 sm:p-6">
                <span className={cn("font-mono text-xs", accent)}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="mt-3 block font-semibold">{step.title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                  {step.detail}
                </span>
              </li>
            ))}
          </ol>
        </SectionShell>
      )
    case "systems":
      return (
        <SectionShell
          id={section.id}
          eyebrow={section.eyebrow}
          title={section.title}
        >
          <p
            className={`mt-6 ${proseClass} text-lg leading-relaxed text-muted-foreground`}
          >
            {section.body}
          </p>
          {section.systems.length ? (
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {section.systems.map((system) => (
                <div
                  key={system.name}
                  className="rounded-2xl border border-border bg-card p-6"
                >
                  <p className="font-heading text-2xl font-semibold tracking-tight">
                    {system.name}
                  </p>
                  <p className={cn("mt-1 text-sm font-medium", accent)}>
                    {system.usedFor}
                  </p>
                  <ul className="mt-5 space-y-2.5 text-sm leading-relaxed text-foreground/80">
                    {system.points.map((point) => (
                      <li key={point} className="flex gap-2.5">
                        <CircleCheck
                          className={cn("mt-0.5 size-4 shrink-0", accentStrong)}
                          aria-hidden="true"
                        />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : null}
          {section.people ? (
            <div className="mt-14">
              <h3 className={labelClass}>{section.people.eyebrow}</h3>
              <p
                className={`mt-3 ${proseClass} text-base leading-relaxed text-muted-foreground`}
              >
                {section.people.intro}
              </p>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {section.people.entries.map((person) => (
                  <li
                    key={person.name}
                    className="flex flex-col rounded-2xl border border-border bg-card p-5"
                  >
                    {person.quote ? (
                      <p className="mb-5 text-lg leading-relaxed text-foreground">
                        “{person.quote}”
                      </p>
                    ) : null}
                    {person.href ? (
                      <a
                        href={person.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "mt-auto font-semibold underline underline-offset-4",
                          accentStrong
                        )}
                      >
                        {person.name}
                      </a>
                    ) : (
                      <span className="mt-auto font-semibold">
                        {person.name}
                      </span>
                    )}
                    <span className="mt-1 text-sm text-muted-foreground">
                      {person.context}
                    </span>
                  </li>
                ))}
              </ul>
              {section.people.link ? (
                <a
                  href={section.people.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-5 ${linkClass}`}
                >
                  {section.people.link.label}
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </a>
              ) : null}
            </div>
          ) : null}
        </SectionShell>
      )
    case "prototype":
      return <PrototypeBlock id={section.id} prototype={section.prototype} />
    case "quote":
      return (
        <section
          id={section.id}
          className="border-t border-border py-14 sm:py-16"
        >
          <blockquote className="border-l-2 border-[var(--cs-accent-strong)] pl-6 dark:border-[var(--cs-accent-strong-d)]">
            <p className="max-w-3xl font-heading text-xl leading-snug font-medium tracking-tight text-foreground sm:text-2xl">
              “{section.text}”
            </p>
            <footer className="mt-5 text-sm text-muted-foreground">
              {section.attribution}
            </footer>
          </blockquote>
        </section>
      )
    case "outcomes":
      return (
        <SectionShell
          id={section.id}
          eyebrow={section.eyebrow}
          title={section.title}
        >
          <div className="mt-10 grid gap-10 md:grid-cols-2">
            <div>
              <h3 className={labelClass}>{section.shippedLabel}</h3>
              <ul className="mt-4 space-y-3">
                {section.shipped.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-base leading-relaxed text-foreground/85"
                  >
                    <CircleCheck
                      className={cn("mt-1 size-4 shrink-0", accentStrong)}
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
              {section.notShipped?.length ? (
                <>
                  <h3 className={`mt-8 ${labelClass}`}>
                    {section.notShippedLabel}
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {section.notShipped.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 text-base leading-relaxed text-muted-foreground"
                      >
                        <CircleDashed
                          className="mt-1 size-4 shrink-0"
                          aria-hidden="true"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>
            <div>
              <h3 className={labelClass}>{section.lessonsLabel}</h3>
              <ol className="mt-4 space-y-5">
                {section.lessons.map((lesson, index) => (
                  <li key={lesson} className="flex gap-4">
                    <span
                      className={cn(
                        "font-heading text-2xl leading-none font-semibold",
                        accentStrong
                      )}
                    >
                      {index + 1}
                    </span>
                    <span className="text-base leading-relaxed text-foreground/85">
                      {lesson}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          {section.footnote ? (
            <p
              className={`mt-10 ${proseClass} text-sm leading-relaxed text-muted-foreground`}
            >
              {section.footnote}
            </p>
          ) : null}
        </SectionShell>
      )
  }
}

export type CaseStudyDeepDiveLayoutProps = {
  study: DeepDiveStudy
  palette: CaseStudyPalette
  logo: ReactNode
  waveSlug: string
}

export function CaseStudyDeepDiveLayout({
  study,
  palette,
  logo,
  waveSlug,
}: CaseStudyDeepDiveLayoutProps) {
  const entries = tocEntries(study.sections)
  const active = useActiveSection(entries.map((entry) => entry.id))
  const progress = useReadingProgress()

  return (
    <article style={paletteVars(palette)}>
      <Hero study={study} logo={logo} waveSlug={waveSlug} />
      <MobileToc entries={entries} active={active} progress={progress} />
      <div
        id="case-study-body"
        className={`${shellClass} grid scroll-mt-24 gap-12 pt-14 pb-16 sm:pt-20 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-16 xl:grid-cols-[15rem_minmax(0,1fr)]`}
      >
        <DesktopToc entries={entries} active={active} progress={progress} />
        <div className="max-w-[56rem] min-w-0">
          {study.sections.map((section) => (
            <Section key={section.id} section={section} />
          ))}
        </div>
      </div>
    </article>
  )
}
