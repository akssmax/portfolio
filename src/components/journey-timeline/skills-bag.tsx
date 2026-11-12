import * as React from "react"
import { Backpack } from "lucide-react"

import { timelineChapters } from "@/lib/journey/timeline"

const total = timelineChapters.reduce((n, c) => n + (c.picks?.length ?? 0), 0)

/**
 * A bag that fills with the skills picked up at each stop the visitor has reached.
 * Tapping a skill jumps back to the stop where it was learned.
 */
export function SkillsBag({
  reached,
  onJump,
}: {
  /** Index of the furthest stop reached so far, -1 before the first */
  reached: number
  onJump: (id: string) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [toast, setToast] = React.useState<{ key: number; text: string } | null>(null)
  const rootRef = React.useRef<HTMLDivElement>(null)
  const btnRef = React.useRef<HTMLButtonElement>(null)
  const prevReached = React.useRef<number | null>(null)
  // deep links land a moment after mount; stay quiet until then
  const quietUntil = React.useRef(0)
  React.useEffect(() => {
    quietUntil.current = performance.now() + 1500
  }, [])

  const stops = timelineChapters.slice(0, reached + 1).filter((c) => c.picks?.length)
  const count = stops.reduce((n, c) => n + (c.picks?.length ?? 0), 0)

  // Toast the new skills when the visitor reaches a stop (not on first load or a deep link)
  React.useEffect(() => {
    const prev = prevReached.current
    prevReached.current = reached
    // nothing on first load or when a deep link lands mid-line
    if (prev === null || prev < 0 || reached <= prev) return
    if (performance.now() < quietUntil.current) return
    const fresh = timelineChapters
      .slice(prev + 1, reached + 1)
      .flatMap((c) => c.picks ?? [])
    if (!fresh.length) return
    // a big jump (nav click) gets a count, a normal step names the skills
    const text =
      reached - prev > 1 ? `${fresh.length} skills collected` : fresh.join(" · ")
    setToast({ key: Date.now(), text })
    const t = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(t)
  }, [reached])

  React.useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (e.target instanceof Node && !rootRef.current?.contains(e.target))
        setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      e.stopPropagation()
      setOpen(false)
      btnRef.current?.focus()
    }
    document.addEventListener("pointerdown", onDown)
    window.addEventListener("keydown", onKey, true)
    return () => {
      document.removeEventListener("pointerdown", onDown)
      window.removeEventListener("keydown", onKey, true)
    }
  }, [open])

  const jump = (id: string) => {
    setOpen(false)
    onJump(id)
  }

  return (
    <div className="bag" ref={rootRef}>
      <button
        ref={btnRef}
        type="button"
        className="icobtn"
        aria-label={`Skills bag, ${count} of ${total} collected`}
        title="Skills bag"
        aria-expanded={open}
        aria-controls="jt-bag"
        onClick={() => setOpen((o) => !o)}
      >
        <Backpack aria-hidden="true" />
        {count > 0 && (
          <span key={count} className="bag-n" aria-hidden="true">
            {count}
          </span>
        )}
      </button>
      {toast && !open && (
        <div key={toast.key} className="bag-toast" role="status">
          <b>+</b> {toast.text}
        </div>
      )}
      {open && (
        <div className="jt-pop bag-pop" id="jt-bag" role="dialog" aria-label="Skills bag">
          <div className="bag-head">
            <b>Skills bag</b>
            <small>
              {count} of {total} collected
            </small>
          </div>
          <div className="bag-meter" aria-hidden="true">
            <i style={{ width: `${(count / total) * 100}%` }} />
          </div>
          {stops.length === 0 ? (
            <p className="bag-empty">Scroll to the first stop to start collecting.</p>
          ) : (
            <ul className="bag-list">
              {stops.map((c) => (
                <li key={c.id} style={{ "--b": c.brand } as React.CSSProperties}>
                  <button type="button" className="bag-stop" onClick={() => jump(c.id)}>
                    {c.company.replace(/\s*\(.*\)/, "")} <span>{c.year}</span>
                  </button>
                  <div className="bag-chips">
                    {c.picks?.map((p) => (
                      <button key={p} type="button" onClick={() => jump(c.id)}>
                        {p}
                      </button>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )}
          {count < total && (
            <p className="bag-empty">
              {total - count} more to find further along the line.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
