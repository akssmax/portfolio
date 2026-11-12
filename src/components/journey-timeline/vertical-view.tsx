import * as React from "react"

import { ChapterCopy, MovePass } from "./chapter-copy"
import { ChapterScene } from "./scenes"
import { useSfx } from "./sound"
import { useRevealed } from "./use-reveal"
import type { TimelineChapter } from "@/lib/journey/timeline"
import {
  cityMoves,
  founderLine,
  founderNote,
  timelineActs,
  timelineChapters,
} from "@/lib/journey/timeline"

type ViewProps = {
  startAt: string | null
  onStop: (chapter: TimelineChapter) => void
}

const chapterIndex = (id: string | null) =>
  Math.max(
    0,
    timelineChapters.findIndex((c) => c.id === id)
  )

export function VerticalView({ startAt, onStop }: ViewProps) {
  const sfx = useSfx()
  const { seen, reveal } = useRevealed()
  const [cur, setCur] = React.useState<string>(timelineChapters[0].id)
  const [litUpTo, setLitUpTo] = React.useState(-1)

  const storyRef = React.useRef<HTMLElement>(null)
  const svgRef = React.useRef<SVGSVGElement>(null)
  const curRef = React.useRef<string | null>(null)
  const onStopRef = React.useRef(onStop)
  onStopRef.current = onStop

  const goTo = React.useCallback((id: string, smooth = true) => {
    const el = document.getElementById(`v-${id}`)
    if (el)
      window.scrollTo({
        top:
          el.getBoundingClientRect().top +
          window.scrollY -
          window.innerHeight * 0.18,
        behavior: smooth ? "smooth" : "instant",
      })
  }, [])

  // Spine + progress: measured from the DOM, so it is drawn imperatively
  React.useEffect(() => {
    const story = storyRef.current
    const svg = svgRef.current
    if (!story || !svg) return
    const [pBase, pDrawn, pT1, pT2] = Array.from(svg.querySelectorAll("path"))
    let len = 0
    let raf = 0

    const update = () => {
      const box = story.getBoundingClientRect()
      const mid = window.innerHeight * 0.55
      const p = Math.min(1, Math.max(0, (mid - box.top) / story.scrollHeight))
      if (len) pDrawn.style.strokeDashoffset = String(len * (1 - p))
      const rows = Array.from(story.querySelectorAll<HTMLElement>(".v-row"))
      let lit = -1
      rows.forEach((row, i) => {
        const node = row.querySelector(".v-node")
        // a stop counts once its node passes the middle, or once its top is near the top (where nav jumps land)
        if (
          (node && node.getBoundingClientRect().top < mid) ||
          row.getBoundingClientRect().top < window.innerHeight * 0.3
        )
          lit = i
      })
      setLitUpTo(lit)
      const id = timelineChapters[Math.max(0, lit)].id
      if (id !== curRef.current) {
        const first = curRef.current === null
        curRef.current = id
        setCur(id)
        onStopRef.current(timelineChapters[Math.max(0, lit)])
        if (!first && lit >= 0) sfx.stop()
      }
    }

    const layout = () => {
      const box = story.getBoundingClientRect()
      const H = story.scrollHeight
      svg.setAttribute("width", String(box.width))
      svg.setAttribute("height", String(H))
      svg.setAttribute("viewBox", `0 0 ${box.width} ${H}`)
      const pts = Array.from(
        story.querySelectorAll<HTMLElement>(".v-node")
      ).map((n) => {
        const rc = n.getBoundingClientRect()
        return {
          x: rc.left - box.left + rc.width / 2,
          y: rc.top - box.top + rc.height / 2,
          id: n.parentElement?.dataset.id,
        }
      })
      if (!pts.length) return
      const narrow = window.innerWidth <= 860
      const sw = narrow ? 0 : 22
      let d = `M ${pts[0].x} 0 L ${pts[0].x} ${pts[0].y}`
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1]
        const b = pts[i]
        const s = i % 2 ? sw : -sw
        const my = b.y - a.y
        d += ` C ${a.x + s} ${a.y + my * 0.4}, ${b.x - s} ${b.y - my * 0.4}, ${b.x} ${b.y}`
      }
      pBase.setAttribute("d", d)
      pDrawn.setAttribute("d", d)
      len = pDrawn.getTotalLength()
      pDrawn.style.strokeDasharray = String(len)
      // the red thread hugs the spine: solid for the founder stops, faint through Kodo
      const by = Object.fromEntries(pts.map((p) => [p.id, p]))
      const o = narrow ? 12 : 16
      type P = (typeof pts)[number]
      const seg = (a: P, b: P) =>
        `M ${a.x + o} ${a.y} C ${a.x + o + 8} ${a.y + (b.y - a.y) * 0.5}, ${b.x + o - 8} ${b.y - (b.y - a.y) * 0.5}, ${b.x + o} ${b.y}`
      if (by.tulr && by.videobug && by.unlogged && by["100x"]) {
        pT1.setAttribute(
          "d",
          `${seg(by.tulr, by.videobug)} ${seg(by.videobug, by.unlogged).replace("M", "L")}`
        )
        pT2.setAttribute("d", seg(by.unlogged, by["100x"]))
      }
      update()
    }

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", layout)
    const ro = new ResizeObserver(layout)
    ro.observe(story)
    layout()
    void document.fonts.ready.then(layout)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", layout)
      ro.disconnect()
    }
  }, [sfx])

  // Reveal stops as they scroll in
  React.useEffect(() => {
    const story = storyRef.current?.parentElement
    if (!story) return
    const nodes = Array.from(story.querySelectorAll<HTMLElement>("[data-io]"))
    // Reveal what is on screen, plus anything already scrolled past (a jump or a fast scroll can skip stops)
    const sweep = () => {
      const edge = window.innerHeight * 0.92
      nodes.forEach((n) => {
        if (n.dataset.io && n.getBoundingClientRect().top < edge)
          reveal(n.dataset.io)
      })
    }
    const io = new IntersectionObserver(
      (entries) => entries.some((e) => e.isIntersecting) && sweep(),
      {
        threshold: 0,
        rootMargin: "0px 0px -8% 0px",
      }
    )
    nodes.forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [reveal])

  // Start where the other view left off
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
        !["ArrowDown", "ArrowUp"].includes(e.key) ||
        (e.target instanceof HTMLElement && e.target.matches("input, textarea"))
      )
        return
      e.preventDefault()
      const i = chapterIndex(curRef.current)
      const n =
        timelineChapters[
          Math.max(
            0,
            Math.min(
              timelineChapters.length - 1,
              i + (e.key === "ArrowDown" ? 1 : -1)
            )
          )
        ]
      goTo(n.id)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [goTo])

  const curChapter = timelineChapters[chapterIndex(cur)]
  const curAct = timelineActs.find((a) => a.id === curChapter.act)!
  const step = (dir: number) => {
    const i = chapterIndex(cur)
    sfx.click()
    goTo(
      timelineChapters[
        Math.max(0, Math.min(timelineChapters.length - 1, i + dir))
      ].id
    )
  }
  const io = (key: string) => ({ "data-io": key })

  let flip = false
  let rowIndex = -1
  return (
    <div className="v">
      <aside className="v-hud" aria-label="Journey position">
        <div className="yr">
          <span key={curChapter.year}>{curChapter.year}</span>
        </div>
        <div className="hact">
          Act {curAct.roman} · {curAct.name}
        </div>
        <nav>
          {timelineChapters.map((c, i) => (
            <button
              key={c.id}
              type="button"
              className={
                [c.founder && "f", c.milestone && "m"]
                  .filter(Boolean)
                  .join(" ") || undefined
              }
              style={
                c.milestone
                  ? ({ "--b": c.brand } as React.CSSProperties)
                  : undefined
              }
              data-past={i < chapterIndex(cur) ? "" : undefined}
              data-cur={c.id === cur ? "" : undefined}
              aria-current={c.id === cur ? "step" : undefined}
              onClick={() => {
                sfx.click()
                goTo(c.id)
              }}
            >
              <span>{c.n}</span>
              {c.company}
            </button>
          ))}
        </nav>
        <div className="mini">
          <button
            type="button"
            aria-label="Previous stop"
            onClick={() => step(-1)}
          >
            ↑
          </button>
          <button type="button" aria-label="Next stop" onClick={() => step(1)}>
            ↓
          </button>
        </div>
      </aside>

      <header className="hero">
        <div>
          <div className="k">Akshay Saini · a design journey in five acts</div>
          <h1>
            Ten stops.<em>One thread.</em>
          </h1>
          <p>
            From teaching myself VFX in school to AI agents in production.
            Every stop has something to play with. Follow the line, and watch
            the red thread: the founder who kept coming back.
          </p>
          <div className="legend">
            <span>
              <i /> my path
            </span>
            <span>
              <i className="t" /> same founder, three products
            </span>
          </div>
          <div className="cue">scroll</div>
        </div>
      </header>

      <main className="v-story" ref={storyRef}>
        <svg className="v-spine" ref={svgRef} aria-hidden="true">
          <path className="base" />
          <path className="drawn" />
          <path className="thread" />
          <path className="thread dim" />
        </svg>
        {timelineActs.map((act) => (
          <React.Fragment key={act.id}>
            <section
              {...io(`act-${act.id}`)}
              className={`v-act ${seen.has(`act-${act.id}`) ? "in" : ""}`}
            >
              <div className="stamp">
                <div className="roman">{act.roman}</div>
                <div>
                  <div className="lab">
                    Act {act.roman} · {act.years}
                  </div>
                  <h2>{act.name}</h2>
                  <p>{act.line}</p>
                </div>
              </div>
            </section>
            {timelineChapters
              .filter((c) => c.act === act.id)
              .map((c) => {
                rowIndex++
                const isFlip = flip
                flip = !flip
                const shown = seen.has(c.id)
                return (
                  <React.Fragment key={c.id}>
                    {c.milestone && (
                      <aside
                        {...io(`mile-${c.id}`)}
                        className={`v-mile ${seen.has(`mile-${c.id}`) ? "in" : ""}`}
                        style={{ "--b": c.brand } as React.CSSProperties}
                      >
                        <div className="mile" data-r="">
                          <span className="mk">◆ {c.year} · Milestone</span>
                          <strong>{c.milestone}</strong>
                        </div>
                      </aside>
                    )}
                    {cityMoves[c.id] && (
                      <aside
                        {...io(`move-${c.id}`)}
                        className={`v-note ${isFlip ? "left" : ""} ${seen.has(`move-${c.id}`) ? "in" : ""}`}
                      >
                        <div className="card">
                          <MovePass move={cityMoves[c.id]} />
                        </div>
                      </aside>
                    )}
                    <article
                      id={`v-${c.id}`}
                      data-id={c.id}
                      data-io={c.id}
                      data-lit={rowIndex <= litUpTo ? "" : undefined}
                      className={[
                        "v-row",
                        isFlip && "flip",
                        c.compact && "compact",
                        shown && "in",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      style={{ "--b": c.brand } as React.CSSProperties}
                    >
                      <div className="v-node" data-n={c.n} />
                      <ChapterCopy chapter={c} active={shown} />
                      <ChapterScene chapter={c} active={shown} />
                    </article>
                    {c.id === "100x" && (
                      <aside
                        {...io("twist")}
                        className={`v-note ${seen.has("twist") ? "in" : ""}`}
                      >
                        <div className="card ncard" data-r="">
                          <div className="nk">Plot twist</div>
                          <h4>{founderLine}</h4>
                          <p>{founderNote}</p>
                          <div className="nd">
                            <span>Tulr ’21</span>
                            <span>Videobug → Unlogged ’22–’24</span>
                            <span>100x.bot ’25–’26</span>
                          </div>
                        </div>
                      </aside>
                    )}
                  </React.Fragment>
                )
              })}
          </React.Fragment>
        ))}
        <section
          {...io("end")}
          className={`v-end ${seen.has("end") ? "in" : ""}`}
        >
          <div className="v-node" />
          <div className="copy fin">
            <div
              className="eyebrow"
              data-r=""
              style={{ "--b": "var(--jt-ink-3)" } as React.CSSProperties}
            >
              11 · Unwritten
            </div>
            <h3 data-r="">
              Your product?
              <span className="cursor" />
            </h3>
            <p data-r="">
              The next stop is still open. I can design it, and I can build it
              too.
            </p>
            <a href="/#contact" data-r="">
              Start a conversation →
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}
