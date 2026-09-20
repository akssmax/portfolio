import * as React from "react"
import { Link, createFileRoute } from "@tanstack/react-router"
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Maximize2,
  Minimize2,
  MousePointer2,
  RotateCcw,
  UsersRound,
} from "lucide-react"

import type { StoryChapter } from "@/lib/journey/story"
import { JourneyPlayground } from "@/components/journey/journey-playground"
import { ThemeCustomizer } from "@/components/theme-customizer"
import { findStoryChapter, storyChapters } from "@/lib/journey/story"
import { siteUrl } from "@/lib/site-url"

import "@/styles/journey-story.css"
import "@/styles/journey-deck.css"

type SceneKind = "opening" | "intro" | "work" | "people" | "finish"
type DeckSlide = {
  key: string
  kind: SceneKind
  chapter?: StoryChapter
}

const deckSlides: Array<DeckSlide> = [
  { key: "opening", kind: "opening" },
  ...storyChapters.flatMap((chapter): Array<DeckSlide> => {
    const scenes: Array<DeckSlide> = [
      { key: chapter.id + "-intro", kind: "intro", chapter },
    ]
    if (chapter.features?.length) {
      scenes.push({ key: chapter.id + "-work", kind: "work", chapter })
    }
    if (chapter.collaborators?.length) {
      scenes.push({ key: chapter.id + "-people", kind: "people", chapter })
    }
    return scenes
  }),
  { key: "finish", kind: "finish" },
]

const chapterStarts = Object.fromEntries(
  storyChapters.map((chapter) => [
    chapter.id,
    deckSlides.findIndex(
      (slide) => slide.chapter?.id === chapter.id && slide.kind === "intro"
    ),
  ])
) as Record<string, number>

function indexFor(stop?: string, scene?: string) {
  if (!stop) return 0
  if (stop === "100x-bot" && scene === "finish") return deckSlides.length - 1
  const match = deckSlides.findIndex(
    (slide) => slide.chapter?.id === stop && slide.kind === (scene || "intro")
  )
  return match >= 0 ? match : (chapterStarts[stop] ?? 0)
}

function searchFor(index: number) {
  const slide = deckSlides[index]
  if (slide.kind === "opening") return {}
  if (slide.kind === "finish") return { stop: "100x-bot", scene: "finish" }
  if (slide.kind === "intro") return { stop: slide.chapter?.id }
  return { stop: slide.chapter?.id, scene: slide.kind }
}

function writeDeckUrl(index: number, mode: "push" | "replace") {
  const url = new URL(window.location.href)
  const search = searchFor(index)
  if (search.stop) url.searchParams.set("stop", search.stop)
  else url.searchParams.delete("stop")
  if (search.scene) url.searchParams.set("scene", search.scene)
  else url.searchParams.delete("scene")
  if (url.href === window.location.href) return
  window.history[mode === "push" ? "pushState" : "replaceState"](
    window.history.state,
    "",
    url
  )
}

export const Route = createFileRoute("/journey")({
  validateSearch: (
    search: Record<string, unknown>
  ): { stop?: string; scene?: string } => {
    const stop = typeof search.stop === "string" ? search.stop.trim() : ""
    if (!stop || !findStoryChapter(stop)) return {}
    const scene = typeof search.scene === "string" ? search.scene : ""
    if (
      (scene === "work" && findStoryChapter(stop)?.features?.length) ||
      (scene === "people" && findStoryChapter(stop)?.collaborators?.length) ||
      (scene === "finish" && stop === "100x-bot")
    ) {
      return { stop, scene }
    }
    return { stop }
  },
  head: () => ({
    meta: [
      { title: "Design Journey — Akshay Saini" },
      {
        name: "description",
        content:
          "An interactive slide journey through Akshay Saini's work, from college and Wallzy to product design, fintech, and AI.",
      },
      { property: "og:title", content: "Design Journey — Akshay Saini" },
      {
        property: "og:description",
        content:
          "Explore the products and people behind Akshay Saini's design career.",
      },
      { property: "og:url", content: siteUrl("/journey") },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: siteUrl("/journey") }],
  }),
  component: JourneyPage,
})

function JourneyPage() {
  const search = Route.useSearch()
  const [activeIndex, setActiveIndex] = React.useState(() =>
    indexFor(search.stop, search.scene)
  )
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const activeRef = React.useRef(activeIndex)
  const directionRef = React.useRef(1)
  const rootRef = React.useRef<HTMLElement>(null)
  const mapRef = React.useRef<HTMLElement>(null)
  const wheelTime = React.useRef(0)
  const touchStart = React.useRef<{ x: number; y: number } | null>(null)

  function goTo(index: number, mode: "push" | "replace" = "push") {
    const next = Math.max(0, Math.min(deckSlides.length - 1, index))
    if (next === activeRef.current) return
    directionRef.current = next > activeRef.current ? 1 : -1
    activeRef.current = next
    setActiveIndex(next)
    writeDeckUrl(next, mode)
  }

  React.useEffect(() => {
    function onPopState() {
      const params = new URL(window.location.href).searchParams
      const next = indexFor(
        params.get("stop") ?? undefined,
        params.get("scene") ?? undefined
      )
      directionRef.current = next > activeRef.current ? 1 : -1
      activeRef.current = next
      setActiveIndex(next)
    }
    window.addEventListener("popstate", onPopState)
    return () => {
      window.removeEventListener("popstate", onPopState)
    }
  }, [])

  React.useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === rootRef.current)
    }
    document.addEventListener("fullscreenchange", onFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange)
    }
  }, [])

  async function toggleFullscreen() {
    if (!rootRef.current) return
    try {
      if (document.fullscreenElement === rootRef.current) {
        await document.exitFullscreen()
      } else {
        await rootRef.current.requestFullscreen()
      }
    } catch {
      // The browser can deny fullscreen; the deck remains usable in-page.
    }
  }

  React.useEffect(() => {
    const map = mapRef.current
    const activeChapter = deckSlides[activeIndex]?.chapter?.id
    const item = activeChapter
      ? map?.querySelector<HTMLElement>(
          '[data-chapter-id="' + activeChapter + '"]'
        )
      : null
    if (!map || !item) return
    map.scrollTo({
      left: item.offsetLeft - map.clientWidth / 2 + item.clientWidth / 2,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    })
  }, [activeIndex])

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement
      if (
        target.closest(
          'input, textarea, select, [contenteditable="true"], [data-deck-arrows="local"], .journey-playground'
        )
      ) {
        return
      }
      if (event.key === "ArrowRight" || event.key === "PageDown") {
        event.preventDefault()
        goTo(activeRef.current + 1)
      } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault()
        goTo(activeRef.current - 1)
      } else if (event.key === "Home") {
        event.preventDefault()
        goTo(0)
      } else if (event.key === "End") {
        event.preventDefault()
        goTo(deckSlides.length - 1)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  function onTrackWheel(event: React.WheelEvent<HTMLDivElement>) {
    if (
      (event.target as HTMLElement).closest(
        ".jd-feature-list, .journey-playground"
      )
    ) {
      return
    }
    const horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY)
    if (!horizontal && window.innerWidth <= 760) return
    const delta = horizontal ? event.deltaX : event.deltaY
    if (Math.abs(delta) < 8) return
    const slide = (event.target as HTMLElement).closest<HTMLElement>(
      ".jd-slide"
    )
    if (!horizontal && slide && slide.scrollHeight > slide.clientHeight + 3) {
      const down = delta > 0
      const moreContent = down
        ? slide.scrollTop + slide.clientHeight < slide.scrollHeight - 3
        : slide.scrollTop > 3
      if (moreContent) return
    }
    event.preventDefault()
    const now = performance.now()
    if (now - wheelTime.current < 520) return
    wheelTime.current = now
    goTo(activeRef.current + (delta > 0 ? 1 : -1))
  }

  const current = deckSlides[activeIndex]
  const activeChapter = current.chapter?.id

  return (
    <main
      ref={rootRef}
      className="jd-root"
      style={
        {
          "--jd-current": current.chapter?.brand ?? "var(--primary)",
        } as React.CSSProperties
      }
    >
      <header className="jd-header">
        <Link to="/" className="jd-home" aria-label="Back to portfolio">
          <ArrowLeft size={18} />
          <span>Portfolio</span>
        </Link>
        <nav
          className="jd-chapter-map"
          ref={mapRef}
          aria-label="Jump to a chapter"
        >
          {storyChapters.map((chapter) => (
            <button
              key={chapter.id}
              type="button"
              className={
                "jd-map-item" +
                (activeChapter === chapter.id ? " is-active" : "")
              }
              data-chapter-id={chapter.id}
              onClick={() => goTo(chapterStarts[chapter.id])}
              aria-current={activeChapter === chapter.id ? "step" : undefined}
              aria-label={"Go to " + chapter.company}
            >
              <span className="jd-map-icon">
                <BrandIcon chapter={chapter} />
              </span>
              <span>{chapter.company}</span>
            </button>
          ))}
        </nav>
        <div className="jd-header-right">
          <ThemeCustomizer triggerSize="icon-sm" />
          <button
            type="button"
            className="jd-fullscreen-button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            aria-pressed={isFullscreen}
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
          </button>
          <span className="jd-header-chapter">
            {String(activeIndex + 1).padStart(2, "0")}
            <span aria-hidden="true"> / </span>
            {String(deckSlides.length).padStart(2, "0")}
          </span>
        </div>
        <div className="jd-progress" aria-hidden="true">
          <span
            style={{
              width: ((activeIndex + 1) / deckSlides.length) * 100 + "%",
            }}
          />
        </div>
      </header>

      <div
        className="jd-track"
        onWheel={onTrackWheel}
        onTouchStart={(event) => {
          if (
            (event.target as HTMLElement).closest(
              ".jd-feature-list, .journey-playground"
            )
          ) {
            touchStart.current = null
            return
          }
          touchStart.current = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY,
          }
        }}
        onTouchEnd={(event) => {
          if (!touchStart.current) return
          const dx = event.changedTouches[0].clientX - touchStart.current.x
          const dy = event.changedTouches[0].clientY - touchStart.current.y
          if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.25) {
            goTo(activeRef.current + (dx < 0 ? 1 : -1))
          }
          touchStart.current = null
        }}
        aria-label="Design journey slides"
      >
        <div
          className={"jd-slide jd-slide--" + current.kind + " is-active"}
          key={current.key}
          data-slide-index={activeIndex}
          style={
            {
              "--chapter-accent":
                current.chapter?.accent ?? "var(--background)",
              "--project-brand": current.chapter?.brand ?? "var(--primary)",
              "--jd-enter-x": directionRef.current > 0 ? "28px" : "-28px",
            } as React.CSSProperties
          }
        >
          {current.kind === "opening" ? (
            <OpeningSlide onStart={() => goTo(1)} />
          ) : current.kind === "finish" ? (
            <FinishSlide onRestart={() => goTo(0)} />
          ) : current.chapter && current.kind === "intro" ? (
            <IntroSlide chapter={current.chapter} index={activeIndex} />
          ) : current.chapter && current.kind === "work" ? (
            <WorkSlide chapter={current.chapter} />
          ) : current.chapter && current.kind === "people" ? (
            <PeopleSlide chapter={current.chapter} />
          ) : null}
        </div>
      </div>
    </main>
  )
}

function BrandIcon({ chapter }: { chapter: StoryChapter }) {
  if (!chapter.logo)
    return (
      <span className="jd-fallback-icon" aria-hidden="true">
        {chapter.company.slice(0, 1)}
      </span>
    )
  return <img src={chapter.logo} alt="" aria-hidden="true" />
}

function BrandMark({ chapter }: { chapter: StoryChapter }) {
  const iconOnly = chapter.id === "wallzy" || chapter.id === "videobug"
  const whiteLogo = chapter.id === "kodo" || chapter.id === "100x-bot"
  if (!chapter.logo) {
    return <span className="jd-brand jd-brand--text">{chapter.company}</span>
  }
  return (
    <span
      className={
        "jd-brand" +
        (iconOnly ? " jd-brand--icon" : "") +
        (whiteLogo ? " jd-brand--dark" : "")
      }
    >
      <img src={chapter.logo} alt={chapter.company + " logo"} />
      {iconOnly ? <strong>{chapter.company}</strong> : null}
    </span>
  )
}

function ProjectLinks({ chapter }: { chapter: StoryChapter }) {
  return (
    <div className="jd-links">
      {chapter.caseStudy ? (
        <Link
          to="/projects/$slug"
          params={{ slug: chapter.caseStudy }}
          search={{ from: "journey" }}
        >
          View case study <ArrowUpRight size={16} />
        </Link>
      ) : null}
      {chapter.source?.href ? (
        <a href={chapter.source.href} target="_blank" rel="noopener noreferrer">
          {chapter.source.label} <ArrowUpRight size={16} />
        </a>
      ) : null}
    </div>
  )
}

function SlideEyebrow({
  chapter,
  scene,
}: {
  chapter: StoryChapter
  scene: string
}) {
  return (
    <div className="jd-slide-eyebrow">
      <span>{chapter.number} / 09</span>
      <span className="jd-eyebrow-line" />
      <span>{chapter.year}</span>
      <span className="jd-eyebrow-dot">●</span>
      <span>{scene}</span>
    </div>
  )
}

function OpeningSlide({ onStart }: { onStart: () => void }) {
  return (
    <section className="jd-opening-content" aria-label="Journey introduction">
      <div className="jd-opening-stamp">
        A CAREER IN MAKING THINGS · 2014—NOW
      </div>
      <div className="jd-opening-main">
        <div className="jd-opening-copy">
          <span className="jd-opening-pretitle">HELLO, I'M AKSHAY.</span>
          <h1>
            It started with <em>curiosity.</em>
            <br />
            Then I kept building<span className="jd-period-mark">.</span>
          </h1>
          <p>
            Nine chapters. Many teams. A growing collection of products and
            things learned along the way.
          </p>
          <button type="button" onClick={onStart} className="jd-primary-cta">
            Start the story <ArrowRight size={18} />
          </button>
          <span className="jd-opening-hint">
            SCROLL TO ADVANCE · USE ARROW KEYS · SWIPE LEFT
          </span>
        </div>
        <div className="jd-opening-art" aria-hidden="true">
          <div className="jd-art-orbit jd-art-orbit-one" />
          <div className="jd-art-orbit jd-art-orbit-two" />
          <span className="jd-art-star">✳</span>
          <div className="jd-art-card jd-art-card-one">
            <BrandIcon chapter={storyChapters[1]} />
          </div>
          <div className="jd-art-card jd-art-card-two">
            <BrandIcon chapter={storyChapters[4]} />
          </div>
          <div className="jd-art-card jd-art-card-three">
            <BrandIcon chapter={storyChapters[6]} />
          </div>
          <div className="jd-art-card jd-art-card-four">
            <BrandIcon chapter={storyChapters[7]} />
          </div>
          <div className="jd-art-center">
            2014 <ArrowRight size={28} /> NOW
          </div>
        </div>
      </div>
      <div className="jd-opening-bottom">
        <span>DESIGN / BRAND / PRODUCT / CODE</span>
        <span>01 — 09</span>
      </div>
    </section>
  )
}

function IntroSlide({
  chapter,
  index,
}: {
  chapter: StoryChapter
  index: number
}) {
  return (
    <section
      className="jd-intro-content"
      aria-label={chapter.company + " introduction"}
    >
      <SlideEyebrow chapter={chapter} scene={chapter.eyebrow} />
      <div className="jd-intro-layout">
        <div className="jd-intro-copy">
          <BrandMark chapter={chapter} />
          <h2>{chapter.title}</h2>
          <p className="jd-story">{chapter.story}</p>
          <div className="jd-role">
            <span>{chapter.role}</span>
            <span>
              {chapter.period}
              {chapter.id === "freelance" ? " · alongside Tulr" : ""}
            </span>
          </div>
          <div className="jd-my-part">
            <span>
              <MousePointer2 size={14} /> MY PART
            </span>
            <p>{chapter.contribution}</p>
          </div>
          <ProjectLinks chapter={chapter} />
          {index === 1 ? (
            <span className="jd-short-stop">FIRST STOP / COLLEGE</span>
          ) : null}
        </div>
        <div className="jd-stage-wrap">
          <div className="jd-stage-label">
            <span>TRY IT YOURSELF</span>
            <span>✳ INTERACTIVE</span>
          </div>
          <JourneyPlayground chapter={chapter} />
        </div>
      </div>
    </section>
  )
}

function WorkSlide({ chapter }: { chapter: StoryChapter }) {
  const features = chapter.features ?? []
  const [selected, setSelected] = React.useState(0)
  const feature = features[selected]

  return (
    <section
      className="jd-work-content"
      aria-label={chapter.company + " product gallery"}
    >
      <SlideEyebrow chapter={chapter} scene="THE PRODUCT" />
      <div className="jd-work-head">
        <div>
          <BrandMark chapter={chapter} />
          <h2>
            See the <em>real work.</em>
          </h2>
        </div>
        <p>{chapter.featureIntro}</p>
      </div>
      <div className="jd-work-layout">
        <figure className="jd-image-frame">
          <img src={feature.image} alt={feature.alt} loading="lazy" />
        </figure>
        <div className="jd-feature-rail">
          <div className="jd-feature-current">
            <span>
              FEATURE {String(selected + 1).padStart(2, "0")} /{" "}
              {String(features.length).padStart(2, "0")}
            </span>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
            <small className="jd-feature-image-label">
              {feature.imageLabel}
            </small>
          </div>
          <div
            className="jd-feature-list"
            role="group"
            aria-label={chapter.company + " feature images"}
            data-deck-arrows="local"
            onKeyDown={(event) => {
              if (event.key !== "ArrowRight" && event.key !== "ArrowLeft")
                return
              event.preventDefault()
              event.stopPropagation()
              const next =
                (selected +
                  (event.key === "ArrowRight" ? 1 : -1) +
                  features.length) %
                features.length
              setSelected(next)
              event.currentTarget
                .querySelectorAll<HTMLButtonElement>("button")
                [next].focus()
            }}
          >
            {features.map((item, itemIndex) => (
              <button
                key={item.title}
                type="button"
                className={selected === itemIndex ? "is-selected" : ""}
                onClick={() => setSelected(itemIndex)}
                aria-pressed={selected === itemIndex}
              >
                <img src={item.image} alt="" loading="lazy" />
                <span>
                  <small>{String(itemIndex + 1).padStart(2, "0")}</small>
                  {item.title}
                </span>
              </button>
            ))}
          </div>
          <div className="jd-feature-actions">
            <button
              type="button"
              onClick={() => setSelected(0)}
              disabled={selected === 0}
              aria-label="Restart feature gallery"
            >
              Reset gallery
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function PeopleSlide({ chapter }: { chapter: StoryChapter }) {
  return (
    <section
      className="jd-people-content"
      aria-label={chapter.company + " team"}
    >
      <SlideEyebrow chapter={chapter} scene="THE PEOPLE" />
      <div className="jd-people-layout">
        <div className="jd-people-copy">
          <BrandMark chapter={chapter} />
          <div className="jd-people-emblem" aria-hidden="true">
            <UsersRound size={50} />
          </div>
          <h2>
            Made with <em>people.</em>
          </h2>
          <p>{chapter.teamNote}</p>
          <div className="jd-people-contribution">
            <span>MY CONTRIBUTION</span>
            <p>{chapter.contribution}</p>
          </div>
          <ProjectLinks chapter={chapter} />
        </div>
        <div className="jd-people-card">
          <div className="jd-people-card-top">
            <span>COLLABORATORS</span>
            <span>
              {String(chapter.collaborators?.length ?? 0).padStart(2, "0")}
            </span>
          </div>
          {chapter.collaborators?.map((person, index) => (
            <div className="jd-person" key={person.name}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{person.name}</strong>
              <small>{person.role ?? "Collaborator"}</small>
            </div>
          ))}
          <div className="jd-people-card-bottom">
            <span>
              {chapter.role} · {chapter.period}
            </span>
            {chapter.teamSource ? (
              <a
                href={chapter.teamSource.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {chapter.teamSource.label} <ArrowUpRight size={14} />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

function FinishSlide({ onRestart }: { onRestart: () => void }) {
  return (
    <section className="jd-finish-content" aria-label="Journey ending">
      <span className="jd-finish-star">✳</span>
      <p className="jd-finish-kicker">THE STORY KEEPS GOING</p>
      <h2>
        What's next is the <em>fun part.</em>
      </h2>
      <p>
        I design and build product experiences with people who care about how
        things work and how they feel.
      </p>
      <div className="jd-finish-actions">
        <a href="mailto:akshaysaini.design@gmail.com">
          Say hello <ArrowUpRight size={18} />
        </a>
        <Link to="/projects">
          Explore the work <ArrowRight size={18} />
        </Link>
      </div>
      <button type="button" onClick={onRestart} className="jd-restart">
        <RotateCcw size={15} /> Back to the beginning
      </button>
    </section>
  )
}
