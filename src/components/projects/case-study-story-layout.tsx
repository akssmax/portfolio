import { Fragment } from "react"
import { ArrowDown, ArrowUpRight, ImagePlus } from "lucide-react"
import type { CSSProperties, ReactNode } from "react"

import type {
  CaseStudyChapter,
  CaseStudyColors,
  CaseStudyMedia,
  CaseStudyPalette,
  CaseStudyPrototype,
  CaseStudyStory,
} from "@/lib/projects/case-study-story"
import { CaseStudyBackLink } from "@/components/projects/case-study-back-link"
import { ProjectCardWaveBackground } from "@/components/marketing/project-card-wave-background"

const sectionClass = "mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10"

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

function ChapterMedia({ media }: { media: CaseStudyMedia }) {
  return (
    <figure
      data-media-slot={media.id}
      className={media.format === "wide" ? "md:col-span-2" : ""}
    >
      {media.src ? (
        <div className="overflow-hidden rounded-2xl border border-border/70 bg-[var(--cs-media-bg)] shadow-sm dark:bg-[var(--cs-media-bg-d)]">
          <img
            src={media.src}
            alt={media.alt ?? media.title}
            loading="lazy"
            decoding="async"
            className="block h-auto w-full"
          />
        </div>
      ) : (
        <div className="relative flex min-h-56 flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[var(--cs-placeholder-border)] bg-[var(--cs-placeholder-bg)] px-6 py-12 text-center sm:min-h-72 dark:border-[var(--cs-placeholder-border-d)] dark:bg-[var(--cs-placeholder-bg-d)]">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(var(--cs-placeholder-border) 0.7px, transparent 0.7px)",
              backgroundSize: "16px 16px",
            }}
            aria-hidden="true"
          />
          <div className="relative flex size-12 items-center justify-center rounded-2xl border border-[var(--cs-placeholder-icon-border)] bg-[var(--cs-placeholder-icon-bg)] text-[var(--cs-placeholder-icon-ink)] shadow-sm dark:border-[var(--cs-placeholder-icon-border-d)] dark:bg-[var(--cs-placeholder-icon-bg-d)] dark:text-[var(--cs-placeholder-icon-ink-d)]">
            <ImagePlus className="size-5" aria-hidden="true" />
          </div>
          <p className="relative mt-5 text-xs font-semibold tracking-[0.18em] text-[var(--cs-placeholder-eyebrow)] uppercase dark:text-[var(--cs-placeholder-eyebrow-d)]">
            Design file placeholder
          </p>
          <p className="relative mt-2 max-w-sm text-lg font-medium text-[var(--cs-placeholder-ink)] dark:text-[var(--cs-placeholder-ink-d)]">
            {media.title}
          </p>
          <p className="relative mt-2 max-w-sm text-sm text-[var(--cs-placeholder-sub)] dark:text-[var(--cs-placeholder-sub-d)]">
            Original screens and process artifacts will be added here.
          </p>
        </div>
      )}
      <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm">
        {media.src ? (
          <span className="font-medium text-foreground">{media.title}</span>
        ) : null}
        <span className="text-muted-foreground">{media.caption}</span>
      </figcaption>
    </figure>
  )
}

function Chapter({ chapter }: { chapter: CaseStudyChapter }) {
  return (
    <section
      id={chapter.id}
      aria-labelledby={`${chapter.id}-title`}
      className="scroll-mt-32 border-t border-border py-20 sm:py-28"
    >
      <div className={sectionClass}>
        <div className="grid gap-8 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12">
          <div className="text-sm font-semibold tracking-[0.16em] text-[var(--cs-accent)] uppercase dark:text-[var(--cs-accent-d)]">
            <span className="mr-3 tabular-nums">{chapter.number}</span>
            {chapter.label}
          </div>
          <div>
            <h2
              id={`${chapter.id}-title`}
              className="max-w-4xl font-heading text-4xl leading-[1.08] font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              {chapter.title}
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              {chapter.introduction}
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2 lg:ml-[16rem]">
          {[
            ["The problem", chapter.problem],
            ["My responsibility", chapter.responsibility],
            ["Design approach", chapter.approach],
            [chapter.shippedLabel ?? "What shipped", chapter.shipped],
          ].map(([label, value]) => (
            <div key={label} className="bg-card p-6 sm:p-8">
              <h3 className="text-xs font-semibold tracking-[0.17em] text-[var(--cs-accent)] uppercase dark:text-[var(--cs-accent-d)]">
                {label}
              </h3>
              <p className="mt-4 max-w-prose text-base leading-relaxed text-foreground/80">
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12">
          <h3 className="text-sm font-semibold tracking-[0.16em] text-[var(--cs-accent)] uppercase dark:text-[var(--cs-accent-d)]">
            {chapter.decisionLabel ?? "Key decisions"}
          </h3>
          <div>
            <ol className="grid gap-3 md:grid-cols-3">
              {chapter.decisions.map((decision, index) => (
                <li
                  key={decision}
                  className="rounded-2xl border border-border bg-card p-5 text-sm leading-relaxed text-foreground/80"
                >
                  <span className="mb-5 block font-mono text-xs text-[var(--cs-accent)] dark:text-[var(--cs-accent-d)]">
                    0{index + 1}
                  </span>
                  {decision}
                </li>
              ))}
            </ol>
            {chapter.publicLink ? (
              <a
                href={chapter.publicLink.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[var(--cs-accent-strong)] underline underline-offset-4 hover:text-[var(--cs-accent-hover)] dark:text-[var(--cs-accent-strong-d)] dark:hover:text-[var(--cs-accent-hover-d)]"
              >
                {chapter.publicLink.label}
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            ) : null}
          </div>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {chapter.media.map((media) => (
            <ChapterMedia key={media.id} media={media} />
          ))}
        </div>
      </div>
    </section>
  )
}

function PrototypeSection({ prototype }: { prototype: CaseStudyPrototype }) {
  const embedUrl = new URL(prototype.url)
  embedUrl.hostname = "embed.figma.com"
  embedUrl.searchParams.set("embed-host", "akshay-saini-portfolio")

  return (
    <section
      id={prototype.id}
      aria-labelledby={`${prototype.id}-title`}
      className="scroll-mt-32 border-t border-border bg-[var(--cs-alt-bg)] py-20 sm:py-28 dark:bg-[var(--cs-alt-bg-d)]"
    >
      <div className={sectionClass}>
        <div className="grid gap-8 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12">
          <div className="text-sm font-semibold tracking-[0.16em] text-[var(--cs-accent)] uppercase dark:text-[var(--cs-accent-d)]">
            {prototype.eyebrow ?? "Interactive prototype"}
          </div>
          <div>
            <h2
              id={`${prototype.id}-title`}
              className="max-w-4xl font-heading text-4xl leading-tight font-semibold tracking-tight sm:text-5xl"
            >
              {prototype.title}
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              {prototype.description}
            </p>
            <a
              href={prototype.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--cs-accent-strong)] underline underline-offset-4 hover:text-[var(--cs-accent-hover)] dark:text-[var(--cs-accent-strong-d)] dark:hover:text-[var(--cs-accent-hover-d)]"
            >
              {prototype.openLabel ?? "Open the prototype in Figma"}
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="mt-12 overflow-hidden rounded-2xl border border-[var(--cs-placeholder-border)] bg-[var(--cs-placeholder-bg)] shadow-sm dark:border-[var(--cs-placeholder-border-d)] dark:bg-[var(--cs-placeholder-bg-d)]">
          <iframe
            src={embedUrl.toString()}
            title={`Interactive ${prototype.previewTitle} prototype in Figma`}
            loading="lazy"
            allow="fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="block h-[640px] w-full sm:h-[720px]"
          />
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Viewing may require a Figma account or file access. Use the link above
          if the embed does not load.
        </p>
      </div>
    </section>
  )
}

function StoryHero({
  study,
  logo,
  waveSlug,
}: {
  study: CaseStudyStory
  logo: ReactNode
  waveSlug: string
}) {
  return (
    <header className="relative isolate overflow-hidden bg-[var(--cs-hero-bg)] text-[var(--cs-hero-ink)] dark:bg-[var(--cs-hero-bg-d)] dark:text-[var(--cs-hero-ink-d)]">
      <ProjectCardWaveBackground slug={waveSlug} variant="hero" />
      <div
        className={`relative ${sectionClass} pt-8 pb-18 sm:pt-12 sm:pb-24 lg:pb-32`}
      >
        <CaseStudyBackLink className="text-[var(--cs-hero-muted)] hover:bg-white/70 dark:text-[var(--cs-hero-muted-d)] dark:hover:bg-white/10" />
        <div className="mt-20 flex flex-wrap items-center justify-between gap-8 sm:mt-24">
          <div className="inline-flex items-center gap-4 rounded-2xl border border-[var(--cs-hero-chip-border)] bg-[var(--cs-hero-chip-bg)] px-5 py-4 shadow-sm backdrop-blur-sm dark:border-[var(--cs-hero-chip-border-d)]">
            <span className="text-[var(--cs-hero-ink)] dark:text-[var(--cs-hero-ink-d)]">
              {logo}
            </span>
            <span
              className="h-7 w-px bg-[var(--cs-divider)] dark:bg-[var(--cs-divider-d)]"
              aria-hidden="true"
            />
            <span className="text-xs font-semibold tracking-[0.18em] text-[var(--cs-accent)] uppercase dark:text-[var(--cs-accent-d)]">
              Case study
            </span>
          </div>
          <span className="rounded-full border border-[var(--cs-chip-border)] bg-[var(--cs-chip-bg)] px-4 py-2 font-mono text-xs text-[var(--cs-chip-ink)] dark:border-[var(--cs-chip-border-d)] dark:text-[var(--cs-chip-ink-d)]">
            {study.period}
          </span>
        </div>
        <h1 className="mt-10 max-w-5xl font-heading text-[clamp(2.5rem,4.5vw,4.5rem)] leading-[1.04] font-semibold tracking-[-0.04em]">
          {study.title}
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--cs-hero-sub)] sm:text-2xl dark:text-[var(--cs-hero-sub-d)]">
          {study.description}
        </p>
        <div className="mt-14 grid gap-6 border-t border-[var(--cs-divider)] pt-6 text-sm sm:grid-cols-[1fr_auto] sm:items-end dark:border-[var(--cs-divider-d)]">
          <div>
            <p className="text-xs tracking-[0.18em] text-[var(--cs-accent)] uppercase dark:text-[var(--cs-accent-d)]">
              Role
            </p>
            <p className="mt-2 text-lg font-semibold">{study.role}</p>
          </div>
          <a
            href="#overview"
            className="inline-flex items-center gap-2 font-medium hover:underline"
          >
            Explore the work <ArrowDown className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </header>
  )
}

export type CaseStudyStoryLayoutProps = {
  study: CaseStudyStory
  palette: CaseStudyPalette
  logo: ReactNode
  waveSlug: string
}

export function CaseStudyStoryLayout({
  study,
  palette,
  logo,
  waveSlug,
}: CaseStudyStoryLayoutProps) {
  const vars = paletteVars(palette)

  return (
    <article style={vars}>
      <StoryHero study={study} logo={logo} waveSlug={waveSlug} />
      <nav
        aria-label={`${study.title} case study sections`}
        className="sticky top-16 z-20 overflow-x-auto border-y border-border bg-background/95 backdrop-blur-md"
      >
        <div
          className={`${sectionClass} flex min-w-max items-center gap-7 py-4 text-sm sm:gap-10`}
        >
          <a
            href="#overview"
            className="font-medium text-foreground hover:text-[var(--cs-accent-strong)] dark:hover:text-[var(--cs-accent-strong-d)]"
          >
            {study.nav.overview}
          </a>
          {study.chapters.map((chapter) => (
            <Fragment key={chapter.id}>
              <a
                href={`#${chapter.id}`}
                className="font-medium text-muted-foreground hover:text-[var(--cs-accent-strong)] dark:hover:text-[var(--cs-accent-strong-d)]"
              >
                {chapter.label}
              </a>
              {chapter.prototype ? (
                <a
                  href={`#${chapter.prototype.id}`}
                  className="font-medium text-muted-foreground hover:text-[var(--cs-accent-strong)] dark:hover:text-[var(--cs-accent-strong-d)]"
                >
                  {chapter.prototype.previewTitle}
                </a>
              ) : null}
            </Fragment>
          ))}
          <a
            href="#design-system"
            className="font-medium text-muted-foreground hover:text-[var(--cs-accent-strong)] dark:hover:text-[var(--cs-accent-strong-d)]"
          >
            {study.nav.system}
          </a>
          <a
            href="#outcomes"
            className="font-medium text-muted-foreground hover:text-[var(--cs-accent-strong)] dark:hover:text-[var(--cs-accent-strong-d)]"
          >
            {study.nav.outcomes}
          </a>
        </div>
      </nav>

      <section
        id="overview"
        aria-labelledby="overview-title"
        className="scroll-mt-32 py-20 sm:py-28"
      >
        <div
          className={`${sectionClass} grid gap-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12`}
        >
          <span className="text-sm font-semibold tracking-[0.16em] text-[var(--cs-accent)] uppercase dark:text-[var(--cs-accent-d)]">
            {study.brief.eyebrow}
          </span>
          <div>
            <h2
              id="overview-title"
              className="max-w-4xl font-heading text-4xl leading-tight font-semibold tracking-tight sm:text-5xl"
            >
              {study.brief.title}
            </h2>
            <div className="mt-7 grid gap-6 text-lg leading-relaxed text-muted-foreground md:grid-cols-2">
              <p>{study.context}</p>
              <p>{study.remit}</p>
            </div>
            <div className="mt-12 grid gap-3 md:grid-cols-3">
              {study.chapters.map((chapter) => (
                <a
                  key={chapter.id}
                  href={`#${chapter.id}`}
                  className="group rounded-2xl border border-border bg-card p-5 transition-colors hover:border-[var(--cs-accent-border)] hover:bg-[var(--cs-card-hover-bg)] dark:hover:bg-[var(--cs-card-hover-bg-d)]"
                >
                  <span className="font-mono text-xs text-[var(--cs-accent)] dark:text-[var(--cs-accent-d)]">
                    {chapter.number} / {chapter.label}
                  </span>
                  <span className="mt-6 block text-lg leading-snug font-semibold group-hover:text-[var(--cs-accent-strong)] dark:group-hover:text-[var(--cs-accent-strong-d)]">
                    {chapter.title}
                  </span>
                  <ArrowDown
                    className="mt-5 size-4 text-[var(--cs-accent)]"
                    aria-hidden="true"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {study.chapters.map((chapter) => (
        <Fragment key={chapter.id}>
          <Chapter chapter={chapter} />
          {chapter.prototype ? (
            <PrototypeSection prototype={chapter.prototype} />
          ) : null}
        </Fragment>
      ))}

      {study.pullQuote ? (
        <section className="scroll-mt-32 border-t border-border py-16 sm:py-20">
          <div className={sectionClass}>
            <blockquote className="mx-auto max-w-4xl text-center">
              <p className="font-heading text-2xl leading-snug font-medium tracking-tight text-foreground sm:text-3xl">
                “{study.pullQuote.text}”
              </p>
              <footer className="mt-6 text-sm text-muted-foreground">
                {study.pullQuote.attribution}
              </footer>
            </blockquote>
          </div>
        </section>
      ) : null}

      <section
        id="design-system"
        aria-labelledby="system-title"
        className="scroll-mt-32 border-t border-border bg-[var(--cs-alt-bg)] py-20 sm:py-28 dark:bg-[var(--cs-alt-bg-d)]"
      >
        <div
          className={`${sectionClass} grid gap-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12`}
        >
          <span className="text-sm font-semibold tracking-[0.16em] text-[var(--cs-accent)] uppercase dark:text-[var(--cs-accent-d)]">
            {study.system.eyebrow}
          </span>
          <div>
            <h2
              id="system-title"
              className="max-w-4xl font-heading text-4xl leading-tight font-semibold tracking-tight sm:text-5xl"
            >
              {study.system.title}
            </h2>
            <p className="mt-7 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              {study.system.body}
            </p>
            <div
              data-media-slot="design-system-library"
              className="mt-10 flex min-h-60 flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--cs-placeholder-border)] bg-background/70 p-8 text-center dark:border-[var(--cs-placeholder-border-d)]"
            >
              <ImagePlus
                className="size-6 text-[var(--cs-accent)] dark:text-[var(--cs-accent-d)]"
                aria-hidden="true"
              />
              <p className="mt-4 font-medium">{study.system.mediaSlot.title}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {study.system.mediaSlot.description}
              </p>
            </div>
            <div className="mt-12 border-t border-border pt-9">
              <h3 className="text-xs font-semibold tracking-[0.16em] text-[var(--cs-accent)] uppercase dark:text-[var(--cs-accent-d)]">
                {study.system.people.eyebrow}
              </h3>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
                {study.system.people.intro}
              </p>
              <div className="mt-7 grid gap-4 md:grid-cols-2">
                {study.system.people.entries.map((person) => (
                  <div
                    key={person.name}
                    className="rounded-2xl border border-border bg-card p-6"
                  >
                    <a
                      href={person.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[var(--cs-accent-strong)] underline underline-offset-4 dark:text-[var(--cs-accent-strong-d)]"
                    >
                      {person.name}
                    </a>
                    <span className="mt-2 block text-sm text-muted-foreground">
                      {person.context}
                    </span>
                  </div>
                ))}
              </div>
              {study.system.people.link ? (
                <a
                  href={study.system.people.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--cs-accent-strong)] underline underline-offset-4 dark:text-[var(--cs-accent-strong-d)]"
                >
                  {study.system.people.link.label}
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section
        id="outcomes"
        aria-labelledby="outcomes-title"
        className="scroll-mt-32 border-t border-border py-20 sm:py-28"
      >
        <div
          className={`${sectionClass} grid gap-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12`}
        >
          <span className="text-sm font-semibold tracking-[0.16em] text-[var(--cs-accent)] uppercase dark:text-[var(--cs-accent-d)]">
            {study.outcomes.eyebrow}
          </span>
          <div>
            <h2
              id="outcomes-title"
              className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl"
            >
              {study.outcomes.title}
            </h2>
            <div className="mt-10 grid gap-8 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-7">
                <h3 className="text-xs font-semibold tracking-[0.16em] text-[var(--cs-accent)] uppercase dark:text-[var(--cs-accent-d)]">
                  {study.outcomes.releasesLabel}
                </h3>
                <ul className="mt-5 space-y-4 text-base leading-relaxed text-foreground/80">
                  {study.outcomes.releases.map((release) => (
                    <li key={release}>{release}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-border bg-card p-7">
                <h3 className="text-xs font-semibold tracking-[0.16em] text-[var(--cs-accent)] uppercase dark:text-[var(--cs-accent-d)]">
                  {study.outcomes.lessonsLabel}
                </h3>
                <ol className="mt-5 space-y-4 text-base leading-relaxed text-foreground/80">
                  {study.outcomes.lessons.map((lesson) => (
                    <li key={lesson}>{lesson}</li>
                  ))}
                </ol>
              </div>
            </div>
            <p className="mt-7 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {study.outcomes.footnote}
            </p>
          </div>
        </div>
      </section>
    </article>
  )
}
