import { Fragment, Suspense, lazy, useState } from "react"
import {
  ArrowDown,
  ArrowUpRight,
  ImagePlus,
} from "lucide-react"
import { useTheme } from "next-themes"

import type {
  KodoChapter,
  KodoMedia,
  KodoPrototype,
} from "@/lib/projects/kodo-case-study"
import { KodoLogo } from "@/components/logos/kodo-logo"
import { CaseStudyBackLink } from "@/components/projects/case-study-back-link"
import { useAnimationProfile } from "@/hooks/use-can-animate"
import { kodoCaseStudy } from "@/lib/projects/kodo-case-study"

const ShapeWaves = lazy(() => import("@/components/marketing/ShapeWaves"))

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
  const { fullMotion } = useAnimationProfile()
  const { resolvedTheme } = useTheme()
  const [gpuFailed, setGpuFailed] = useState(false)
  const dark = resolvedTheme === "dark"

  return (
    <header className="relative isolate overflow-hidden bg-[#faf5fa] text-[#211c22] dark:bg-[#1c1920] dark:text-[#f5edf3]">
      <div
        className="pointer-events-none absolute inset-0 opacity-25 dark:opacity-15"
        style={{
          backgroundImage: "radial-gradient(#d7c6d3 0.8px, transparent 0.8px)",
          backgroundSize: "17px 17px",
        }}
        aria-hidden="true"
      />
      {fullMotion && !gpuFailed ? (
        <div
          className="pointer-events-none absolute inset-0 opacity-15 sm:opacity-20 dark:opacity-15"
          aria-hidden="true"
        >
          <Suspense fallback={null}>
            <ShapeWaves
              color={dark ? "#826c80" : "#bca5b8"}
              hoverColor={dark ? "#b983a5" : "#d486ac"}
              backgroundColor={dark ? "#1c1920" : "#faf5fa"}
              shapes="mixed"
              cellSize={15}
              dotSize={0.65}
              speed={0.28}
              scale={1.25}
              contrast={0.85}
              brightness={0.4}
              fade={0.65}
              interactive={false}
              glow={0}
              intro={false}
              onError={() => setGpuFailed(true)}
            />
          </Suspense>
        </div>
      ) : null}
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
        <h1 className="mt-10 max-w-5xl font-heading text-[clamp(3.3rem,7vw,7rem)] leading-[0.98] font-semibold tracking-[-0.06em]">
          {kodoCaseStudy.title}
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[#574b56] sm:text-2xl dark:text-[#e0d2dc]">
          {kodoCaseStudy.description}
        </p>
        <div className="mt-14 grid gap-6 border-t border-[#e0cfdb] pt-6 text-sm sm:grid-cols-[1fr_auto] sm:items-end dark:border-[#5e4b5b]">
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

export function KodoCaseStudyLayout() {
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
          {kodoCaseStudy.chapters.map((chapter) => (
            <Fragment key={chapter.id}>
              <a
                href={`#${chapter.id}`}
                className="font-medium text-muted-foreground hover:text-[#925a7d]"
              >
                {chapter.label}
              </a>
              {chapter.id === "corporate-cards" ? (
                <a
                  href="#mobile-prototype"
                  className="font-medium text-muted-foreground hover:text-[#925a7d]"
                >
                  Mobile prototype
                </a>
              ) : null}
              {chapter.id === "erp-workspace" ? (
                <a
                  href="#vendor-portal-prototype"
                  className="font-medium text-muted-foreground hover:text-[#925a7d]"
                >
                  Vendor Portal
                </a>
              ) : null}
            </Fragment>
          ))}
          <a
            href="#design-system"
            className="font-medium text-muted-foreground hover:text-[#925a7d]"
          >
            Design system
          </a>
          <a
            href="#outcomes"
            className="font-medium text-muted-foreground hover:text-[#925a7d]"
          >
            Takeaways
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
          <span className="text-sm font-semibold tracking-[0.16em] text-[#916783] uppercase dark:text-[#d3a6c4]">
            The brief
          </span>
          <div>
            <h2
              id="overview-title"
              className="max-w-4xl font-heading text-4xl leading-tight font-semibold tracking-tight sm:text-5xl"
            >
              One platform. Three connected surfaces.
            </h2>
            <div className="mt-7 grid gap-6 text-lg leading-relaxed text-muted-foreground md:grid-cols-2">
              <p>{kodoCaseStudy.context}</p>
              <p>{kodoCaseStudy.remit}</p>
            </div>
            <div className="mt-12 grid gap-3 md:grid-cols-3">
              {kodoCaseStudy.chapters.map((chapter) => (
                <a
                  key={chapter.id}
                  href={`#${chapter.id}`}
                  className="group rounded-2xl border border-border bg-card p-5 transition-colors hover:border-[#bb92ad] hover:bg-[#fbf7fa] dark:hover:bg-[#2a202a]"
                >
                  <span className="font-mono text-xs text-[#916783] dark:text-[#d3a6c4]">
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
          </div>
        </div>
      </section>

      {kodoCaseStudy.chapters.map((chapter) => (
        <Fragment key={chapter.id}>
          <Chapter chapter={chapter} />
          {chapter.id === "corporate-cards" ? (
            <KodoPrototypeSection prototype={kodoCaseStudy.mobilePrototype} />
          ) : null}
          {chapter.id === "erp-workspace" ? (
            <KodoPrototypeSection
              prototype={kodoCaseStudy.vendorPortalPrototype}
            />
          ) : null}
        </Fragment>
      ))}

      <section
        id="design-system"
        aria-labelledby="system-title"
        className="scroll-mt-32 border-t border-border bg-[#f8f4f7] py-20 sm:py-28 dark:bg-[#211d24]"
      >
        <div
          className={`${sectionClass} grid gap-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12`}
        >
          <span className="text-sm font-semibold tracking-[0.16em] text-[#916783] uppercase dark:text-[#d3a6c4]">
            The connecting thread
          </span>
          <div>
            <h2
              id="system-title"
              className="max-w-4xl font-heading text-4xl leading-tight font-semibold tracking-tight sm:text-5xl"
            >
              A design system for the spaces between.
            </h2>
            <p className="mt-7 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              {kodoCaseStudy.system}
            </p>
            <div
              data-media-slot="design-system-library"
              className="mt-10 flex min-h-60 flex-col items-center justify-center rounded-2xl border border-dashed border-[#d6bfd0] bg-background/70 p-8 text-center dark:border-[#725d70]"
            >
              <ImagePlus className="size-6 text-[#916783]" aria-hidden="true" />
              <p className="mt-4 font-medium">Design system library</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Original components and patterns will be added with the design
                files.
              </p>
            </div>
            <div className="mt-12 border-t border-border pt-9">
              <h3 className="text-xs font-semibold tracking-[0.16em] text-[#916783] uppercase dark:text-[#d3a6c4]">
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
          <span className="text-sm font-semibold tracking-[0.16em] text-[#916783] uppercase dark:text-[#d3a6c4]">
            In retrospect
          </span>
          <div>
            <h2
              id="outcomes-title"
              className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl"
            >
              What shipped, and what stayed with me.
            </h2>
            <div className="mt-10 grid gap-8 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-7">
                <h3 className="text-xs font-semibold tracking-[0.16em] text-[#916783] uppercase dark:text-[#d3a6c4]">
                  Work and releases
                </h3>
                <ul className="mt-5 space-y-4 text-base leading-relaxed text-foreground/80">
                  <li>
                    Kodo&apos;s public website, designed in Figma and built in
                    Framer.
                  </li>
                  <li>
                    Corporate Cards product design work; original artifacts are
                    pending.
                  </li>
                  <li>
                    The first release of the new procure-to-pay workspace with
                    enterprise customers.
                  </li>
                  <li>
                    A shared design system across the web and product work.
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl border border-border bg-card p-7">
                <h3 className="text-xs font-semibold tracking-[0.16em] text-[#916783] uppercase dark:text-[#d3a6c4]">
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
          </div>
        </div>
      </section>
    </article>
  )
}
