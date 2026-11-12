import * as React from "react"

import { ChapterCopy, MovePass } from "./chapter-copy"
import { ChapterScene } from "./scenes"
import { useSfx } from "./sound"
import { useRevealed } from "./use-reveal"
import type { TimelineChapter } from "@/lib/journey/timeline"
import {
  cityMoves,
  founderLine,
  timelineActs,
  timelineChapters,
} from "@/lib/journey/timeline"

type ViewProps = {
  startAt: string | null
  onStop: (chapter: TimelineChapter) => void
  /** Filled with this view's jump-to-stop function, for the skills bag */
  navRef?: React.MutableRefObject<((id: string) => void) | null>
}

const NS = "http://www.w3.org/2000/svg"
const isMobile = () => window.innerWidth <= 760
const chapterIndex = (id: string | null) =>
  Math.max(
    0,
    timelineChapters.findIndex((c) => c.id === id)
  )

export function HorizontalView({ startAt, onStop, navRef }: ViewProps) {
  const sfx = useSfx()
  const { seen, reveal } = useRevealed()
  const [cur, setCur] = React.useState<string>(timelineChapters[0].id)
  const [litUpTo, setLitUpTo] = React.useState(-1)
  const [progress, setProgress] = React.useState(0)
  const [dotLefts, setDotLefts] = React.useState<Record<string, number>>({})

  const pinRef = React.useRef<HTMLElement>(null)
  const stageRef = React.useRef<HTMLDivElement>(null)
  const trackRef = React.useRef<HTMLDivElement>(null)
  const worldRef = React.useRef<SVGSVGElement>(null)
  const barRef = React.useRef<HTMLDivElement>(null)
  const curRef = React.useRef<string | null>(null)
  const onStopRef = React.useRef(onStop)
  onStopRef.current = onStop

  const maxShift = React.useCallback(
    () => Math.max(0, (trackRef.current?.scrollWidth ?? 0) - window.innerWidth),
    []
  )

  const goTo = React.useCallback(
    (id: string, smooth = true) => {
      const el = document.getElementById(`h-${id}`)
      const stage = stageRef.current
      const pin = pinRef.current
      if (!el || !stage || !pin) return
      const behavior = smooth ? "smooth" : "instant"
      if (isMobile()) return stage.scrollTo({ left: el.offsetLeft, behavior })
      window.scrollTo({
        top:
          pin.offsetTop +
          Math.min(
            maxShift(),
            Math.max(0, el.offsetLeft - window.innerWidth * 0.02)
          ),
        behavior,
      })
    },
    [maxShift]
  )

  const goShare = React.useCallback(
    (share: number) => {
      const stage = stageRef.current
      const pin = pinRef.current
      if (!stage || !pin) return
      if (isMobile())
        return stage.scrollTo({
          left: share * (stage.scrollWidth - stage.clientWidth),
          behavior: "instant",
        })
      window.scrollTo({
        top: pin.offsetTop + share * maxShift(),
        behavior: "instant",
      })
    },
    [maxShift]
  )

  // The pinned stage, the ground line and the stations are all measured, so they are driven imperatively
  React.useEffect(() => {
    const pin = pinRef.current
    const stage = stageRef.current
    const track = trackRef.current
    const world = worldRef.current
    if (!pin || !stage || !track || !world) return
    let stations: Array<{ c: TimelineChapter; x: number; y: number }> = []
    let W = 0
    let raf = 0
    const panels = () => Array.from(track.querySelectorAll<HTMLElement>(".hp"))

    const readProgress = () => {
      if (isMobile())
        return (
          stage.scrollLeft / Math.max(1, stage.scrollWidth - stage.clientWidth)
        )
      return Math.min(
        1,
        Math.max(0, -pin.getBoundingClientRect().top / Math.max(1, maxShift()))
      )
    }

    const update = () => {
      const p = readProgress()
      const mobile = isMobile()
      const shift = mobile ? stage.scrollLeft : p * maxShift()
      const vw = window.innerWidth
      track.style.transform = mobile ? "" : `translate3d(${-shift}px,0,0)`
      setProgress(p)
      const ground = world.querySelector<SVGPathElement>("[data-ground]")
      if (ground)
        ground.style.strokeDashoffset = String(
          Number(ground.dataset.len) *
            (1 - Math.min(1, (shift + vw * 0.7) / Math.max(1, W)))
        )
      panels().forEach((pn) => {
        const l = pn.offsetLeft - shift
        if (l < vw * 0.96 && pn.dataset.key) reveal(pn.dataset.key)
      })
      // on phones each panel is one screen and its station sits mid-panel
      const cursor = shift + vw * (mobile ? 0.62 : 0.45)
      let lit = 0
      stations.forEach((s, i) => {
        if (s.x <= cursor) lit = i
        world
          .querySelector(`[data-st="${s.c.id}"]`)
          ?.setAttribute("fill", s.x <= cursor ? s.c.brand : "var(--jt-paper)")
      })
      setLitUpTo(stations.length && stations[0].x <= cursor ? lit : -1)
      const c = stations.length ? stations[lit].c : null
      if (c && c.id !== curRef.current) {
        const first = curRef.current === null
        curRef.current = c.id
        setCur(c.id)
        onStopRef.current(c)
        if (!first) sfx.stop()
      }
    }

    const layout = () => {
      const mobile = isMobile()
      W = track.scrollWidth
      const H = stage.clientHeight
      world.setAttribute("width", String(W))
      world.setAttribute("height", String(H))
      world.setAttribute("viewBox", `0 0 ${W} ${H}`)
      const scrubTop = H - 64
      const base = mobile ? H - 108 : H * 0.84
      const climb = mobile ? 0 : H * 0.015
      const actIndex = Object.fromEntries(timelineActs.map((a, i) => [a.id, i]))
      stations = timelineChapters.flatMap((c) => {
        const el = document.getElementById(`h-${c.id}`)
        return el
          ? [
              {
                c,
                x: el.offsetLeft + el.clientWidth * (mobile ? 0.5 : 0.03) + 24,
                y: base - actIndex[c.act] * climb,
              },
            ]
          : []
      })
      const all = panels()
      const last = all[all.length - 1]
      const endX = last.offsetLeft + 80
      const endY = base - timelineActs.length * climb
      let d = `M 0 ${base}`
      let prev = { x: 0, y: base }
      ;[...stations, { x: endX, y: endY }].forEach((s) => {
        const m = (prev.x + s.x) / 2
        d += ` L ${Math.max(prev.x, m - 90)} ${prev.y} C ${m} ${prev.y}, ${m} ${s.y}, ${Math.min(s.x, m + 90)} ${s.y} L ${s.x} ${s.y}`
        prev = s
      })
      d += ` L ${W} ${endY}`

      world.replaceChildren()
      const el = (
        tag: string,
        attrs: Record<string, string | number>,
        text?: string
      ) => {
        const n = document.createElementNS(NS, tag)
        for (const k in attrs) n.setAttribute(k, String(attrs[k]))
        if (text) n.textContent = text
        world.append(n)
        return n
      }
      el("path", { d: `${d} L ${W} ${H} L 0 ${H} Z`, class: "soil" })
      el("path", { d, class: "ghost" })
      const g = el("path", {
        d,
        class: "ground",
        "data-ground": "",
      }) as SVGPathElement
      const gl = g.getTotalLength()
      g.style.strokeDasharray = String(gl)
      g.dataset.len = String(gl)
      // the founder thread hangs below the ground like a rope, so it never crosses a scene
      const by: Partial<Record<string, (typeof stations)[number]>> =
        Object.fromEntries(stations.map((s) => [s.c.id, s]))
      const room = Math.max(14, Math.min(64, scrubTop - base - 10))
      type S = { x: number; y: number }
      const sag = (a: S, b: S, k: number) =>
        ` C ${a.x + (b.x - a.x) * 0.25} ${a.y + room * k}, ${a.x + (b.x - a.x) * 0.75} ${b.y + room * k}, ${b.x} ${b.y}`
      if (by.tulr && by.videobug && by.unlogged && by["100x"]) {
        el("path", {
          class: "thread",
          d: `M ${by.tulr.x} ${by.tulr.y}${sag(by.tulr, by.videobug, 0.7)}${sag(by.videobug, by.unlogged, 0.5)}${sag(by.unlogged, by["100x"], 1.25)}`,
        })
      }
      stations.forEach((s) => {
        el("text", { x: s.x + 14, y: s.y - 10, class: "yl" }, s.c.year)
        if (s.c.milestone) {
          // a small flag planted at the turning point
          el("line", {
            x1: s.x,
            y1: s.y - 8,
            x2: s.x,
            y2: s.y - 46,
            class: "mpole",
            stroke: s.c.brand,
          })
          el("path", {
            d: `M ${s.x} ${s.y - 46} l 12 5 l -12 5 Z`,
            fill: s.c.brand,
          })
          el(
            "text",
            { x: s.x + 58, y: s.y - 10, class: "ml", fill: s.c.brand },
            s.c.milestone
          )
        }
        el("circle", {
          cx: s.x,
          cy: s.y,
          r: 8,
          class: "stn",
          "data-st": s.c.id,
          stroke: s.c.brand,
        })
      })
      el("circle", {
        cx: endX,
        cy: endY,
        r: 8,
        class: "stn",
        stroke: "var(--jt-ink-3)",
        "stroke-dasharray": "3 3",
      })

      const shareFor = (x: number) =>
        Math.min(
          1,
          Math.max(0, (x - window.innerWidth * 0.3) / Math.max(1, maxShift()))
        )
      setDotLefts(
        Object.fromEntries(stations.map((s) => [s.c.id, shareFor(s.x) * 100]))
      )
      pin.style.height = mobile
        ? "auto"
        : `${maxShift() + window.innerHeight}px`
      update()
    }

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    stage.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", layout)
    layout()
    let alive = true
    void document.fonts.ready.then(() => alive && layout())
    return () => {
      alive = false
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", onScroll)
      stage.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", layout)
    }
  }, [maxShift, reveal, sfx])

  React.useEffect(() => {
    if (!navRef) return
    navRef.current = (id: string) => goTo(id)
    return () => {
      navRef.current = null
    }
  }, [navRef, goTo])

  React.useEffect(() => {
    if (!startAt) {
      window.scrollTo(0, 0)
      return
    }
    // the router can reset scroll after the first paint, so land again once the page settles
    const raf = requestAnimationFrame(() => goTo(startAt, false))
    const t = setTimeout(() => goTo(startAt, false), 350)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(t)
    }
  }, [startAt, goTo])

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        !["ArrowRight", "ArrowLeft"].includes(e.key) ||
        (e.target instanceof HTMLElement && e.target.matches("input, textarea"))
      )
        return
      e.preventDefault()
      const i = chapterIndex(curRef.current)
      const n =
        timelineChapters[
          Math.min(
            timelineChapters.length - 1,
            Math.max(0, i + (e.key === "ArrowRight" ? 1 : -1))
          )
        ]
      sfx.click()
      goTo(n.id)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [goTo, sfx])

  // Scrubber drag
  const dragging = React.useRef(false)
  const shareAt = (e: React.PointerEvent) => {
    const r = barRef.current!.getBoundingClientRect()
    return Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
  }

  const curChapter = timelineChapters[chapterIndex(cur)]
  const cls = (base: string, key: string) =>
    `hp ${base} ${seen.has(key) ? "in" : ""}`

  return (
    <div className="h">
      <section className="h-pin" ref={pinRef}>
        <div className="h-stage" ref={stageRef}>
          <div className="h-track" ref={trackRef}>
            <svg className="h-world" ref={worldRef} aria-hidden="true" />
            <section className={cls("h-intro", "intro")} data-key="intro">
              <div className="intro">
                <div className="k">Akshay Saini · self-taught, still curious</div>
                <h1>
                  Same kid,<em>bigger toys.</em>
                </h1>
                <p>
                  From After Effects in school to AI agents in production. The
                  ground climbs with every act, and every stop has something to
                  play with.
                  <span className="thread-copy">
                    {" "}
                    The red thread underneath is a founder I built three
                    products with.
                  </span>
                </p>
                <div className="go">keep scrolling</div>
              </div>
            </section>
            {timelineActs.map((act) => (
              <React.Fragment key={act.id}>
                <section
                  className={cls("h-act", `act-${act.id}`)}
                  data-key={`act-${act.id}`}
                >
                  <div className="roman">{act.roman}</div>
                  <div className="lab">
                    Act {act.roman} · {act.years}
                  </div>
                  <h2>{act.name}</h2>
                  <p>{act.line}</p>
                </section>
                {timelineChapters
                  .filter((c) => c.act === act.id)
                  .map((c) => (
                    <React.Fragment key={c.id}>
                      {cityMoves[c.id] && (
                        <section
                          className={cls("h-post", `move-${c.id}`)}
                          data-key={`move-${c.id}`}
                        >
                          <MovePass move={cityMoves[c.id]} />
                        </section>
                      )}
                      <section
                        id={`h-${c.id}`}
                        data-id={c.id}
                        data-key={c.id}
                        className={`${cls("h-ch", c.id)} ${c.compact ? "compact" : ""}`}
                        style={{ "--b": c.brand } as React.CSSProperties}
                      >
                        <div className="in-wrap">
                          <ChapterCopy chapter={c} active={seen.has(c.id)} />
                          <ChapterScene chapter={c} active={seen.has(c.id)} />
                        </div>
                      </section>
                    </React.Fragment>
                  ))}
              </React.Fragment>
            ))}
            <section className={cls("h-fin", "fin")} data-key="fin">
              <div className="copy fin">
                <div
                  className="eyebrow"
                  data-r=""
                  style={{ "--b": "var(--jt-ink-3)" } as React.CSSProperties}
                >
                  11 · The next stop
                </div>
                <h3 data-r="">
                  Your product?
                  <span className="cursor" />
                </h3>
                <p data-r="">
                  {founderLine} Ten stops so far, and the line keeps going.
                </p>
                <a href="/#contact" data-r="">
                  Start a conversation →
                </a>
              </div>
            </section>
          </div>

          <div className="h-scrub">
            <div className="syr">{curChapter.year}</div>
            <div
              className="sbar"
              ref={barRef}
              onPointerDown={(e) => {
                if ((e.target as HTMLElement).closest(".sdot")) return
                dragging.current = true
                e.currentTarget.setPointerCapture(e.pointerId)
                goShare(shareAt(e))
              }}
              onPointerMove={(e) => dragging.current && goShare(shareAt(e))}
              onPointerUp={() => (dragging.current = false)}
              onPointerCancel={() => (dragging.current = false)}
            >
              <div className="sfill" style={{ width: `${progress * 100}%` }} />
              {timelineChapters.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  className={`sdot ${c.founder ? "f" : ""} ${c.milestone ? "m" : ""}`}
                  data-on={i <= litUpTo ? "" : undefined}
                  data-cur={c.id === cur ? "" : undefined}
                  aria-label={`${c.company}, ${c.year}`}
                  style={
                    {
                      left: `${dotLefts[c.id] ?? 0}%`,
                      "--m": c.brand,
                    } as React.CSSProperties
                  }
                  onClick={(e) => {
                    e.stopPropagation()
                    sfx.click()
                    goTo(c.id)
                  }}
                >
                  <span>
                    {c.company} · {c.year}
                    {c.milestone ? ` · ${c.milestone}` : ""}
                  </span>
                </button>
              ))}
            </div>
            <div className="hint">
              scroll, drag or <kbd>←</kbd> <kbd>→</kbd>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
