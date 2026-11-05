import { Fragment } from "react"
import {
  ArrowDown,
  ArrowUpRight,
  CircleCheck,
  CircleDashed,
  ImagePlus,
} from "lucide-react"
import type { ReactNode } from "react"

import type {
  KodoChapter,
  KodoMedia,
  KodoPrototype,
} from "@/lib/projects/kodo-case-study"
import { KodoLogo } from "@/components/logos/kodo-logo"
import { CaseStudyBackLink } from "@/components/projects/case-study-back-link"
import { ProjectCardWaveBackground } from "@/components/marketing/project-card-wave-background"
import { kodoCaseStudy } from "@/lib/projects/kodo-case-study"

const sectionClass = "mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10"

function ChapterMedia({ media }: { media: KodoMedia }) {
  return (
    <figure
      data-media-slot={media.id}
      className={media.format === "wide" ? "md:col-span-2" : ""}
    >
      {media.src ? (
        <div className="overflow-hidden rounded-2xl border border-border/70 bg-[#faf5fa] shadow-sm">
          <img
            src={media.src}
            alt={media.alt ?? media.title}
            loading="lazy"
            decoding="async"
            className="block h-auto w-full"
          />
        </div>
      ) : (
        <div className="relative flex min-h-56 flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[#d6bfd0] bg-[#fbf7fa] px-6 py-12 text-center sm:min-h-72 dark:border-[#725d70] dark:bg-[#211d24]">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(#d4c2d0 0.7px, transparent 0.7px)",
              backgroundSize: "16px 16px",
            }}
            aria-hidden="true"
          />
          <div className="relative flex size-12 items-center justify-center rounded-2xl border border-[#decbd8] bg-white text-[#835b7a] shadow-sm dark:border-[#725d70] dark:bg-[#302735] dark:text-[#dfb8d2]">
            <ImagePlus className="size-5" aria-hidden="true" />
          </div>
          <p className="relative mt-5 text-xs font-semibold tracking-[0.18em] text-[#8b6480] uppercase dark:text-[#d5afca]">
            Design file placeholder
          </p>
          <p className="relative mt-2 max-w-sm text-lg font-medium text-[#392b38] dark:text-[#f1e7ef]">
            {media.title}
          </p>
          <p className="relative mt-2 max-w-sm text-sm text-[#756573] dark:text-[#beaebe]">
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

function Chapter({ chapter }: { chapter: KodoChapter }) {
  return (
    <section
      id={chapter.id}
      aria-labelledby={`${chapter.id}-title`}
      className="scroll-mt-32 border-t border-border py-20 sm:py-28"
    >
      <div className={sectionClass}>
        <div className="grid gap-8 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12">
          <div className="text-sm font-semibold tracking-[0.16em] text-[#916783] uppercase dark:text-[#d3a6c4]">
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
              <h3 className="text-xs font-semibold tracking-[0.17em] text-[#916783] uppercase dark:text-[#d3a6c4]">
                {label}
              </h3>
              <p className="mt-4 max-w-prose text-base leading-relaxed text-foreground/80">
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12">
          <h3 className="text-sm font-semibold tracking-[0.16em] text-[#916783] uppercase dark:text-[#d3a6c4]">
            {chapter.decisionLabel ?? "Key decisions"}
          </h3>
          <div>
            <ol className="grid gap-3 md:grid-cols-3">
              {chapter.decisions.map((decision, index) => (
                <li
                  key={decision}
                  className="rounded-2xl border border-border bg-card p-5 text-sm leading-relaxed text-foreground/80"
                >
                  <span className="mb-5 block font-mono text-xs text-[#916783] dark:text-[#d3a6c4]">
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
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#925a7d] underline underline-offset-4 hover:text-[#6d3c5c] dark:text-[#e7bad9]"
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

function KodoPrototypeSection({ prototype }: { prototype: KodoPrototype }) {
  const embedUrl = new URL(prototype.url)
  embedUrl.hostname = "embed.figma.com"
  embedUrl.searchParams.set("embed-host", "akshay-saini-portfolio")

  return (
    <section
      id={prototype.id}
      aria-labelledby={`${prototype.id}-title`}
      className="scroll-mt-32 border-t border-border bg-[#f8f4f7] py-20 sm:py-28 dark:bg-[#211d24]"
    >
      <div className={sectionClass}>
        <div className="grid gap-8 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12">
          <div className="text-sm font-semibold tracking-[0.16em] text-[#916783] uppercase dark:text-[#d3a6c4]">
            Interactive prototype
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
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#925a7d] underline underline-offset-4 hover:text-[#6d3c5c] dark:text-[#e7bad9]"
            >
              Open the prototype in Figma
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="mt-12 overflow-hidden rounded-2xl border border-[#e0cfdb] bg-[#f4edf2] shadow-sm dark:border-[#695667] dark:bg-[#29232d]">
          <iframe
            src={embedUrl.toString()}
            title={`Interactive Kodo ${prototype.previewTitle} prototype in Figma`}
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

function KodoHero() {
  return (
    <header className="relative isolate overflow-hidden bg-[#faf5fa] text-[#211c22] dark:bg-[#1c1920] dark:text-[#f5edf3]">
      <ProjectCardWaveBackground slug="kodo" variant="hero" />
      <div
        className={`relative ${sectionClass} pt-8 pb-18 sm:pt-12 sm:pb-24 lg:pb-32`}
      >
        <CaseStudyBackLink className="text-[#6c5968] hover:bg-white/70 dark:text-[#dfcedb] dark:hover:bg-white/10" />
        <div className="mt-20 flex flex-wrap items-center justify-between gap-8 sm:mt-24">
          <div className="inline-flex items-center gap-4 rounded-2xl border border-[#e9dce5] bg-white/80 px-5 py-4 shadow-sm backdrop-blur-sm dark:border-[#695667] dark:bg-[#29232d]/80">
            <KodoLogo className="h-9 w-auto" />
            <span
              className="h-7 w-px bg-[#e3d4df] dark:bg-[#695667]"
              aria-hidden="true"
            />
            <span className="text-xs font-semibold tracking-[0.18em] text-[#916783] uppercase dark:text-[#d3a6c4]">
              Case study
            </span>
          </div>
          <span className="rounded-full border border-[#e4d3df] bg-white/75 px-4 py-2 font-mono text-xs text-[#674d62] dark:border-[#695667] dark:bg-[#29232d]/80 dark:text-[#e3cce0]">
            Feb 2024 — Nov 2025
          </span>
        </div>
        <h1 className="mt-10 max-w-5xl font-heading text-[clamp(2.5rem,4.5vw,4.5rem)] leading-[1.04] font-semibold tracking-[-0.04em]">
          {kodoCaseStudy.title}
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[#574b56] sm:text-2xl dark:text-[#e0d2dc]">
          {kodoCaseStudy.description}
        </p>
        <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[#e4d3df] bg-[#e4d3df] lg:grid-cols-4 dark:border-[#5e4b5b] dark:bg-[#5e4b5b]">
          {kodoCaseStudy.facts.map((fact) => (
            <div
              key={fact.label}
              className="bg-white/80 p-4 backdrop-blur-sm sm:p-5 dark:bg-[#29232d]/85"
            >
              <dt className="sr-only">{fact.label}</dt>
              <dd>
                <span className="block font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                  {fact.value}
                </span>
                <span className="mt-1 block text-sm text-[#6c5968] dark:text-[#cdbbc9]">
                  {fact.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-10 grid gap-6 border-t border-[#e0cfdb] pt-6 text-sm sm:grid-cols-[1fr_auto] sm:items-end dark:border-[#5e4b5b]">
          <div>
            <p className="text-xs tracking-[0.18em] text-[#916783] uppercase dark:text-[#d3a6c4]">
              Role
            </p>
            <p className="mt-2 text-lg font-semibold">{kodoCaseStudy.role}</p>
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

const accentText = "text-[#916783] dark:text-[#d3a6c4]"
const eyebrowClass = `text-sm font-semibold tracking-[0.16em] uppercase ${accentText}`
const navLinkClass = "font-medium text-muted-foreground hover:text-[#925a7d]"

function SectionIntro({
  eyebrow,
  id,
  title,
  children,
}: {
  eyebrow: string
  id: string
  title: string
  children?: ReactNode
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12">
      <span className={eyebrowClass}>{eyebrow}</span>
      <div>
        <h2
          id={id}
          className="max-w-4xl font-heading text-4xl leading-tight font-semibold tracking-tight sm:text-5xl"
        >
          {title}
        </h2>
        {children}
      </div>
    </div>
  )
}

function ModuleMap() {
  const { shipped, designed } = kodoCaseStudy.modules
  return (
    <section
      id="modules"
      aria-labelledby="modules-title"
      className="scroll-mt-32 border-t border-border bg-[#f8f4f7] py-20 sm:py-28 dark:bg-[#211d24]"
    >
      <div className={sectionClass}>
        <SectionIntro
          eyebrow="Module map"
          id="modules-title"
          title="What P2P v1 covered, and what waited."
        >
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            I designed every module below. Ten shipped in the first release with
            redBus and Brndme; two were fully designed and left for later.
          </p>
        </SectionIntro>
        <div className="mt-12 lg:ml-[16rem]">
          <h3
            className={`text-xs font-semibold tracking-[0.17em] uppercase ${accentText}`}
          >
            Shipped in v1
          </h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {shipped.map((module) => (
              <li
                key={module.name}
                className="flex gap-3 rounded-2xl border border-border bg-card p-5"
              >
                <CircleCheck
                  className="mt-0.5 size-4 shrink-0 text-[#925a7d] dark:text-[#e7bad9]"
                  aria-hidden="true"
                />
                <span>
                  <span className="block font-semibold">{module.name}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                    {module.detail}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <h3
            className={`mt-10 text-xs font-semibold tracking-[0.17em] uppercase ${accentText}`}
          >
            Designed, not shipped
          </h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {designed.map((module) => (
              <li
                key={module.name}
                className="flex gap-3 rounded-2xl border border-dashed border-[#d6bfd0] bg-background/60 p-5 dark:border-[#725d70]"
              >
                <CircleDashed
                  className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <span>
                  <span className="block font-semibold">{module.name}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                    {module.detail}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function ProcessSection() {
  return (
    <section
      id="process"
      aria-labelledby="process-title"
      className="scroll-mt-32 border-t border-border py-20 sm:py-28"
    >
      <div className={sectionClass}>
        <SectionIntro
          eyebrow="How I worked"
          id="process-title"
          title="Fast loops between customers, PMs and engineering."
        >
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            We shipped quickly, mostly before AI design tools were common. Ideas
            moved from customer calls and PM research into rapid prototypes, and
            from there into handoff files engineers could build from.
          </p>
        </SectionIntro>
        <ol className="mt-12 grid gap-3 sm:grid-cols-2 lg:ml-[16rem] xl:grid-cols-3">
          {kodoCaseStudy.process.map((step, index) => (
            <li
              key={step.title}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <span className={`block font-mono text-xs ${accentText}`}>
                0{index + 1}
              </span>
              <span className="mt-4 block font-semibold">{step.title}</span>
              <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                {step.detail}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function KodoCaseStudyLayout() {
  const p2pChapters = kodoCaseStudy.chapters.filter(
    (chapter) => chapter.group === "p2p"
  )
  const beyondChapters = kodoCaseStudy.chapters.filter(
    (chapter) => chapter.group === "beyond"
  )

  return (
    <article>
      <KodoHero />
      <nav
        aria-label="Kodo case study sections"
        className="sticky top-16 z-20 overflow-x-auto border-y border-border bg-background/95 backdrop-blur-md"
      >
        <div
          className={`${sectionClass} flex min-w-max items-center gap-7 py-4 text-sm sm:gap-10`}
        >
          <a
            href="#overview"
            className="font-medium text-foreground hover:text-[#925a7d]"
          >
            Overview
          </a>
          <a href="#modules" className={navLinkClass}>
            Modules
          </a>
          {p2pChapters.map((chapter) => (
            <a
              key={chapter.id}
              href={`#${chapter.id}`}
              className={navLinkClass}
            >
              {chapter.label}
            </a>
          ))}
          <a href="#vendor-portal-prototype" className={navLinkClass}>
            Vendor Portal
          </a>
          <a href="#process" className={navLinkClass}>
            Process
          </a>
          <a href="#design-system" className={navLinkClass}>
            Design systems
          </a>
          {beyondChapters.map((chapter) => (
            <Fragment key={chapter.id}>
              <a href={`#${chapter.id}`} className={navLinkClass}>
                {chapter.label}
              </a>
              {chapter.id === "corporate-cards" ? (
                <a href="#mobile-prototype" className={navLinkClass}>
                  UPI demo
                </a>
              ) : null}
            </Fragment>
          ))}
          <a href="#outcomes" className={navLinkClass}>
            Takeaways
          </a>
        </div>
      </nav>

      <section
        id="overview"
        aria-labelledby="overview-title"
        className="scroll-mt-32 py-20 sm:py-28"
      >
        <div className={sectionClass}>
          <SectionIntro
            eyebrow="The brief"
            id="overview-title"
            title="Procure-to-pay, rebuilt as one workspace."
          >
            <div className="mt-7 grid gap-6 text-lg leading-relaxed text-muted-foreground md:grid-cols-2">
              <p>{kodoCaseStudy.context}</p>
              <p>{kodoCaseStudy.remit}</p>
            </div>
            <div className="mt-12 rounded-2xl border border-[#e0cfdb] bg-[#fbf7fa] p-7 sm:p-9 dark:border-[#5e4b5b] dark:bg-[#241f27]">
              <span
                className={`text-xs font-semibold tracking-[0.17em] uppercase ${accentText}`}
              >
                The bet
              </span>
              <p className="mt-4 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                {kodoCaseStudy.bet.title}
              </p>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-foreground/80 sm:text-lg">
                {kodoCaseStudy.bet.body}
              </p>
            </div>
            <div className="mt-12 grid gap-3 md:grid-cols-3">
              {p2pChapters.map((chapter) => (
                <a
                  key={chapter.id}
                  href={`#${chapter.id}`}
                  className="group rounded-2xl border border-border bg-card p-5 transition-colors hover:border-[#bb92ad] hover:bg-[#fbf7fa] dark:hover:bg-[#2a202a]"
                >
                  <span className={`font-mono text-xs ${accentText}`}>
                    {chapter.number} / {chapter.label}
                  </span>
                  <span className="mt-6 block text-lg leading-snug font-semibold group-hover:text-[#925a7d] dark:group-hover:text-[#e7bad9]">
                    {chapter.title}
                  </span>
                  <ArrowDown
                    className="mt-5 size-4 text-[#916783]"
                    aria-hidden="true"
                  />
                </a>
              ))}
            </div>
          </SectionIntro>
        </div>
      </section>

      <ModuleMap />

      {p2pChapters.map((chapter) => (
        <Chapter key={chapter.id} chapter={chapter} />
      ))}

      <KodoPrototypeSection prototype={kodoCaseStudy.vendorPortalPrototype} />

      <ProcessSection />

      <section
        id="design-system"
        aria-labelledby="system-title"
        className="scroll-mt-32 border-t border-border bg-[#f8f4f7] py-20 sm:py-28 dark:bg-[#211d24]"
      >
        <div className={sectionClass}>
          <SectionIntro
            eyebrow="Design systems"
            id="system-title"
            title="Two systems, 1,000+ components."
          >
            <p className="mt-7 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              {kodoCaseStudy.system}
            </p>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {kodoCaseStudy.systems.map((system) => (
                <div
                  key={system.name}
                  className="rounded-2xl border border-border bg-card p-6 sm:p-7"
                >
                  <p className="font-heading text-2xl font-semibold tracking-tight">
                    {system.name}
                  </p>
                  <p className={`mt-1 text-sm font-medium ${accentText}`}>
                    {system.usedFor}
                  </p>
                  <ul className="mt-5 space-y-2.5 text-sm leading-relaxed text-foreground/80">
                    {system.points.map((point) => (
                      <li key={point} className="flex gap-2.5">
                        <CircleCheck
                          className="mt-0.5 size-4 shrink-0 text-[#925a7d] dark:text-[#e7bad9]"
                          aria-hidden="true"
                        />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div
              data-media-slot="design-system-library"
              className="mt-6 flex min-h-60 flex-col items-center justify-center rounded-2xl border border-dashed border-[#d6bfd0] bg-background/70 p-8 text-center dark:border-[#725d70]"
            >
              <ImagePlus className="size-6 text-[#916783]" aria-hidden="true" />
              <p className="mt-4 font-medium">Design system library</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Original components and patterns will be added with the design
                files.
              </p>
            </div>
            <div className="mt-12 border-t border-border pt-9">
              <h3
                className={`text-xs font-semibold tracking-[0.16em] uppercase ${accentText}`}
              >
                People I worked with
              </h3>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
                Gaurav Thapa and Tumul Roy were direct partners in this work.
                Their recommendations speak to the close collaboration behind
                the product and system decisions.
              </p>
              <div className="mt-7 grid gap-4 md:grid-cols-2">
                {kodoCaseStudy.partners.map((partner) => (
                  <blockquote
                    key={partner.name}
                    className="rounded-2xl border border-border bg-card p-6"
                  >
                    <p className="text-lg leading-relaxed text-foreground">
                      “{partner.excerpt}”
                    </p>
                    <footer className="mt-6 text-sm">
                      <a
                        href={partner.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-[#925a7d] underline underline-offset-4 dark:text-[#e7bad9]"
                      >
                        {partner.name}
                      </a>
                      <span className="mt-1 block text-muted-foreground">
                        {partner.context}
                      </span>
                    </footer>
                  </blockquote>
                ))}
              </div>
              <a
                href="https://in.linkedin.com/in/akssmax"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#925a7d] underline underline-offset-4 dark:text-[#e7bad9]"
              >
                Read LinkedIn recommendations{" "}
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            </div>
          </SectionIntro>
        </div>
      </section>

      {beyondChapters.map((chapter) => (
        <Fragment key={chapter.id}>
          <Chapter chapter={chapter} />
          {chapter.id === "corporate-cards" ? (
            <KodoPrototypeSection prototype={kodoCaseStudy.mobilePrototype} />
          ) : null}
        </Fragment>
      ))}

      <section
        id="outcomes"
        aria-labelledby="outcomes-title"
        className="scroll-mt-32 border-t border-border py-20 sm:py-28"
      >
        <div className={sectionClass}>
          <SectionIntro
            eyebrow="In retrospect"
            id="outcomes-title"
            title="What shipped, and what stayed with me."
          >
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-7">
                <h3
                  className={`text-xs font-semibold tracking-[0.16em] uppercase ${accentText}`}
                >
                  Shipped
                </h3>
                <ul className="mt-5 space-y-4 text-base leading-relaxed text-foreground/80">
                  {kodoCaseStudy.releases.map((release) => (
                    <li key={release}>{release}</li>
                  ))}
                </ul>
                <h3
                  className={`mt-8 text-xs font-semibold tracking-[0.16em] uppercase ${accentText}`}
                >
                  Designed, not shipped
                </h3>
                <ul className="mt-4 space-y-2 text-base leading-relaxed text-muted-foreground">
                  {kodoCaseStudy.notShipped.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-border bg-card p-7">
                <h3
                  className={`text-xs font-semibold tracking-[0.16em] uppercase ${accentText}`}
                >
                  Lessons learned
                </h3>
                <ol className="mt-5 space-y-4 text-base leading-relaxed text-foreground/80">
                  {kodoCaseStudy.lessons.map((lesson) => (
                    <li key={lesson}>{lesson}</li>
                  ))}
                </ol>
              </div>
            </div>
            <p className="mt-7 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              This account focuses on the work I contributed to. Kodo&apos;s
              company-wide customer and transaction figures are separate from
              the outcomes of these projects.
            </p>
          </SectionIntro>
        </div>
      </section>
    </article>
  )
}
