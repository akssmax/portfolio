import * as React from "react"
import { Link } from "@tanstack/react-router"
import { useTheme } from "next-themes"

import { HorizontalView } from "./horizontal-view"
import { SettingsMenu } from "./settings-menu"
import { SfxContext, useJourneySound } from "./sound"
import { VerticalView } from "./vertical-view"
import type { TimelineChapter } from "@/lib/journey/timeline"

export type JourneyView = "vertical" | "horizontal"
const VIEW_KEY = "journey-view"
const THREAD_KEY = "journey-thread"

// Safari still ships parts of the Fullscreen API prefixed, so every member is optional here
type FsDoc = {
  fullscreenElement?: Element | null
  webkitFullscreenElement?: Element
  exitFullscreen?: () => Promise<void>
  webkitExitFullscreen?: () => void
}
type FsEl = {
  requestFullscreen?: () => Promise<void>
  webkitRequestFullscreen?: () => void
}
const fsDoc = () => document as unknown as FsDoc
const fsRoot = () => document.documentElement as unknown as FsEl
const fsElement = () =>
  fsDoc().fullscreenElement ?? fsDoc().webkitFullscreenElement

export function JourneyTimeline({
  initialView,
  initialStop,
}: {
  initialView?: JourneyView
  initialStop?: string
}) {
  const { enabled: soundOn, toggle: toggleSound, sfx } = useJourneySound()
  const { resolvedTheme, setTheme } = useTheme()
  const [view, setView] = React.useState<JourneyView>(initialView ?? "vertical")
  const [startAt, setStartAt] = React.useState<string | null>(
    initialStop ?? null
  )
  const [canFs, setCanFs] = React.useState(false)
  const [isFs, setIsFs] = React.useState(false)
  const [threadOn, setThreadOn] = React.useState(true)

  // The founder thread can be hidden; remembered per visitor
  React.useEffect(() => {
    try {
      if (localStorage.getItem(THREAD_KEY) === "off") setThreadOn(false)
    } catch {
      // storage blocked
    }
  }, [])
  const toggleThread = () => {
    const next = !threadOn
    setThreadOn(next)
    sfx.click()
    try {
      localStorage.setItem(THREAD_KEY, next ? "on" : "off")
    } catch {
      // ignore
    }
  }
  const rootRef = React.useRef<HTMLDivElement>(null)
  const currentStop = React.useRef<string | null>(null)
  const segRef = React.useRef<HTMLDivElement>(null)
  const pillRef = React.useRef<HTMLSpanElement>(null)

  // No ?view= in the URL: fall back to the last view this visitor used
  React.useEffect(() => {
    if (initialView) return
    try {
      const saved = localStorage.getItem(VIEW_KEY)
      if (saved === "horizontal") setView("horizontal")
    } catch {
      // storage blocked
    }
  }, [initialView])

  const onStop = React.useCallback((c: TimelineChapter) => {
    currentStop.current = c.id
    rootRef.current?.style.setProperty("--jt-brand", c.brand)
  }, [])

  const choose = (next: JourneyView) => {
    if (next === view) return
    setStartAt(currentStop.current)
    rootRef.current?.style.setProperty("--jt-brand", "var(--jt-ink)")
    setView(next)
    sfx.whoosh()
    try {
      localStorage.setItem(VIEW_KEY, next)
    } catch {
      // ignore
    }
    const url = new URL(window.location.href)
    url.searchParams.set("view", next)
    url.searchParams.delete("stop")
    window.history.replaceState(window.history.state, "", url)
  }

  // Sliding pill under the active view button
  React.useLayoutEffect(() => {
    const move = () => {
      const btn = segRef.current?.querySelector<HTMLButtonElement>(
        `button[data-view="${view}"]`
      )
      const pill = pillRef.current
      if (!btn || !pill) return
      pill.style.left = `${btn.offsetLeft}px`
      pill.style.width = `${btn.offsetWidth}px`
    }
    move()
    window.addEventListener("resize", move)
    void document.fonts.ready.then(move)
    return () => window.removeEventListener("resize", move)
  }, [view])

  // Fullscreen, hidden where the browser can't do it (iPhone Safari)
  const toggleFs = React.useCallback(() => {
    sfx.click()
    try {
      const d = fsDoc()
      const el = fsRoot()
      if (fsElement())
        void (d.exitFullscreen
          ? d.exitFullscreen()
          : d.webkitExitFullscreen?.())
      else
        void (el.requestFullscreen
          ? el.requestFullscreen()
          : el.webkitRequestFullscreen?.())
    } catch {
      // ignore
    }
  }, [sfx])

  React.useEffect(() => {
    const el = fsRoot()
    const supported = !!(el.requestFullscreen ?? el.webkitRequestFullscreen)
    setCanFs(supported)
    const sync = () => setIsFs(!!fsElement())
    const onKey = (e: KeyboardEvent) => {
      if (
        (e.key === "f" || e.key === "F") &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey &&
        supported &&
        !(
          e.target instanceof HTMLElement &&
          e.target.matches("input, textarea, [contenteditable]")
        )
      )
        toggleFs()
    }
    document.addEventListener("fullscreenchange", sync)
    document.addEventListener("webkitfullscreenchange", sync)
    window.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("fullscreenchange", sync)
      document.removeEventListener("webkitfullscreenchange", sync)
      window.removeEventListener("keydown", onKey)
    }
  }, [toggleFs])

  return (
    <SfxContext.Provider value={sfx}>
      <div
        className="jt"
        ref={rootRef}
        data-thread={threadOn ? undefined : "off"}
      >
        <header className="bar">
          <Link to="/" className="brand">
            <b>Akshay Saini</b> · the journey
          </Link>
          <div className="seg" role="group" aria-label="Layout" ref={segRef}>
            <span className="pill" aria-hidden="true" ref={pillRef} />
            <button
              type="button"
              data-view="vertical"
              aria-pressed={view === "vertical"}
              onClick={() => choose("vertical")}
            >
              <svg
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <path d="M7 1v12M4 10l3 3 3-3" />
              </svg>
              <span className="lbl">Vertical</span>
            </button>
            <button
              type="button"
              data-view="horizontal"
              aria-pressed={view === "horizontal"}
              onClick={() => choose("horizontal")}
            >
              <svg
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <path d="M1 7h12M10 4l3 3-3 3" />
              </svg>
              <span className="lbl">Horizontal</span>
            </button>
          </div>
          <SettingsMenu
            canFs={canFs}
            isFs={isFs}
            onFullscreen={toggleFs}
            settings={[
              {
                id: "sound",
                label: "Sound effects",
                hint: "Small clicks and chimes",
                on: soundOn,
                toggle: toggleSound,
              },
              {
                id: "thread",
                label: "Founder thread",
                hint: "Same founder, three products",
                on: threadOn,
                toggle: toggleThread,
              },
              {
                id: "dark",
                label: "Dark mode",
                hint: "Follows the site theme",
                on: resolvedTheme === "dark",
                toggle: () => {
                  setTheme(resolvedTheme === "dark" ? "light" : "dark")
                  sfx.click()
                },
              },
            ]}
          />
        </header>
        {view === "horizontal" ? (
          <HorizontalView key="h" startAt={startAt} onStop={onStop} />
        ) : (
          <VerticalView key="v" startAt={startAt} onStop={onStop} />
        )}
      </div>
    </SfxContext.Provider>
  )
}
