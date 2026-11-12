import * as React from "react"
import { Maximize2, Minimize2, Settings2 } from "lucide-react"

type Setting = {
  id: string
  label: string
  hint: string
  on: boolean
  toggle: () => void
}

/** Icon buttons in the bar: fullscreen, plus a small popover of on/off settings. */
export function SettingsMenu({
  settings,
  canFs,
  isFs,
  onFullscreen,
  children,
}: {
  settings: Array<Setting>
  /** Extra buttons shown before fullscreen, e.g. the skills bag */
  children?: React.ReactNode
  canFs: boolean
  isFs: boolean
  onFullscreen: () => void
}) {
  const [open, setOpen] = React.useState(false)
  const rootRef = React.useRef<HTMLDivElement>(null)
  const btnRef = React.useRef<HTMLButtonElement>(null)

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

  return (
    <div className="r" ref={rootRef}>
      {children}
      {canFs && (
        <button
          type="button"
          className="icobtn"
          aria-pressed={isFs}
          aria-label={isFs ? "Exit fullscreen (F)" : "Fullscreen (F)"}
          title={isFs ? "Exit fullscreen (F)" : "Fullscreen (F)"}
          onClick={onFullscreen}
        >
          {isFs ? (
            <Minimize2 aria-hidden="true" />
          ) : (
            <Maximize2 aria-hidden="true" />
          )}
        </button>
      )}
      <button
        ref={btnRef}
        type="button"
        className="icobtn"
        aria-label="Settings"
        title="Settings"
        aria-expanded={open}
        aria-controls="jt-settings"
        onClick={() => setOpen((o) => !o)}
      >
        <Settings2 aria-hidden="true" />
      </button>
      {open && (
        <div
          className="jt-pop"
          id="jt-settings"
          role="group"
          aria-label="Settings"
        >
          {settings.map((s) => (
            <button
              key={s.id}
              type="button"
              role="switch"
              aria-checked={s.on}
              className="pop-row"
              onClick={s.toggle}
            >
              <span>
                <b>{s.label}</b>
                <small>{s.hint}</small>
              </span>
              <i className="sw" aria-hidden="true" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
