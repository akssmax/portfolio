import * as React from "react"

import type { CityMove, TimelineChapter } from "@/lib/journey/timeline"
import { founderName } from "@/lib/journey/timeline"

const fmt = (n: number) => n.toLocaleString("en-US")
const initials = (name: string) =>
  name
    .replace(/\(.*\)/, "")
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

/** Shows the final value until the stop is reached, then counts up once. */
function Stat({
  stat,
  active,
}: {
  stat: NonNullable<TimelineChapter["stat"]>
  active: boolean
}) {
  const [value, setValue] = React.useState(stat.value)
  const done = React.useRef(false)
  React.useEffect(() => {
    if (!active || done.current) return
    done.current = true
    const t0 = performance.now()
    let raf = 0
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / 1500)
      setValue(Math.round(stat.value * (1 - Math.pow(1 - k, 3))))
      if (k < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => {
      cancelAnimationFrame(raf)
      setValue(stat.value)
    }
  }, [active, stat.value])
  return (
    <>
      <b>
        {stat.prefix}
        {fmt(value)}
        {stat.suffix}
      </b>
      <small>{stat.label}</small>
    </>
  )
}

const r = (i: number) => ({
  "data-r": "",
  style: { "--i": i } as React.CSSProperties,
})

export function ChapterCopy({
  chapter: c,
  active,
}: {
  chapter: TimelineChapter
  active: boolean
}) {
  const [flipped, setFlipped] = React.useState(false)
  const frontBtn = React.useRef<HTMLButtonElement>(null)
  const backBtn = React.useRef<HTMLButtonElement>(null)
  const flip = (on: boolean) => {
    setFlipped(on)
    // move focus to the face that just turned up
    requestAnimationFrame(() => (on ? backBtn : frontBtn).current?.focus({ preventScroll: true }))
  }
  let i = 0
  const front = (
    <>
      {c.milestone && (
        <div {...r(i++)}>
          <span className="mbadge">◆ Milestone · {c.milestone}</span>
        </div>
      )}
      <div className="meta" {...r(i++)}>
        {c.logo && <img src={c.logo} alt="" />}
        <span className="co">{c.company}</span>
        <span>{c.period}</span>
      </div>
      <div className="eyebrow" {...r(i++)}>
        {c.n} · {c.eyebrow}
        <span className="role"> · {c.role}</span>
      </div>
      <h3 {...r(i++)}>
        {c.title} <em>{c.emphasis}</em>
      </h3>
      <p className="story" {...r(i++)}>
        {c.story}
      </p>
      {c.stat && (
        <div className="stat" {...r(i++)}>
          <Stat stat={c.stat} active={active} />
        </div>
      )}
      {c.founder && (
        <div {...r(i++)}>
          <span className="fchip">
            <i />
            Product {c.founder.step} of 3 with {founderName}
            {c.founder.continued ? ", continued" : ""}
          </span>
        </div>
      )}
      {c.quote && (
        <blockquote className="quote" {...r(i++)}>
          “{c.quote.text}”<cite>{c.quote.by}</cite>
        </blockquote>
      )}
      {c.people && (
        <div className="people" {...r(i++)}>
          <div className="av">
            {c.people.map((p) => (
              <span
                key={p.name}
                title={`${p.name}${p.role ? ` · ${p.role}` : ""}`}
              >
                {initials(p.name)}
              </span>
            ))}
          </div>
          <small>
            with {c.people.map((p) => p.name.split(" ")[0]).join(", ")}
          </small>
        </div>
      )}
      {c.tags.length > 0 && (
        <div className="tags" {...r(i++)}>
          {c.tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      )}
      {(c.caseStudy || c.links) && (
        <div className="links" {...r(i++)}>
          {c.caseStudy && (
            <a className="cs" href={`/projects/${c.caseStudy}`}>
              Read the case study <span aria-hidden="true">→</span>
            </a>
          )}
          {c.links?.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
              {l.label} <span aria-hidden="true">↗</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ))}
        </div>
      )}
      {c.honest && (
        <div className="honest-cta" {...r(i++)}>
          <button
            ref={frontBtn}
            type="button"
            className="flip-link"
            aria-expanded={flipped}
            onClick={() => flip(true)}
          >
            The honest version <span aria-hidden="true">↻</span>
          </button>
        </div>
      )}
    </>
  )
  const style = { "--b": c.brand } as React.CSSProperties
  if (!c.honest) {
    return (
      <div className="copy" style={style}>
        {front}
      </div>
    )
  }
  return (
    <div className="copy has-flip" style={style}>
      <div className={`flipcard${flipped ? " on" : ""}`}>
        <div className="face front" inert={flipped}>
          {front}
        </div>
        <aside className="face back" aria-label={`${c.company}, the honest version`} inert={!flipped}>
          <div className="tag">{c.company.replace(/\s*\(.*\)/, "")} · the honest version</div>
          <p className="claim">
            {c.title} {c.emphasis}
          </p>
          <div className="lab">What didn’t work</div>
          <p className="missed">{c.honest.missed}</p>
          <div className="lab">What it taught me</div>
          <p className="taught">{c.honest.taught}</p>
          <div className="row">
            <small>Written in hindsight</small>
            <button ref={backBtn} type="button" className="flip-link" onClick={() => flip(false)}>
              <span aria-hidden="true">↺</span> Back to the pitch
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}

export function MovePass({ move: m }: { move?: CityMove }) {
  if (!m) return null
  return (
    <div className="pass-wrap">
      <div
        className="pass"
        data-r=""
        style={{ "--b": m.brand } as React.CSSProperties}
      >
        <div className="pass-l">
          <div className="pass-top">
            <div className="nk">{m.when} · a new city</div>
            <span className="stamp-pune">Arrived · {m.to}</span>
          </div>
          <div className="route">
            <div>
              <small>From</small>
              <b>{m.from}</b>
              <span>{m.fromNote}</span>
            </div>
            <div className="trip">
              <i>✈</i>
            </div>
            <div className="to">
              <small>To</small>
              <b>{m.to}</b>
              <span>{m.toNote}</span>
            </div>
          </div>
          <p>{m.text}</p>
        </div>
        <div className="pass-r">
          <small>Date</small>
          <b>{m.when.toUpperCase()}</b>
          <small>Seat</small>
          <b>{m.seat}</b>
          <small>Gate</small>
          <b>{m.gate}</b>
          <div className="barcode" />
        </div>
      </div>
    </div>
  )
}
