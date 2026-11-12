import * as React from "react"
import { createPortal } from "react-dom"

import { quietSfx, useSfx, useTimers } from "./sound"
import type { Sfx } from "./sound"
import type {
  LearningVisual,
  SceneLink,
  TimelineChapter,
  TimelineScene,
} from "@/lib/journey/timeline"
import { collegeOutputs } from "@/lib/journey/timeline"

type ShotItem = { img: string; alt: string } | { visual: LearningVisual }
type SceneProps<TKind extends TimelineScene["kind"]> = {
  scene: Extract<TimelineScene, { kind: TKind }>
  active: boolean
}

/** Tabs that autoplay once the stop is on screen, until the viewer picks one. */
/** Whether this stop's scene is on screen; autoplay pauses when it is not. */
const OnScreenContext = React.createContext(true)

/** Autoplaying tabs are silent and pause off screen; only the viewer's clicks make sound. */
function useAutoTabs(count: number, active: boolean, ms: number) {
  const sfx = useSfx()
  const onScreen = React.useContext(OnScreenContext)
  const [index, setIndex] = React.useState(0)
  const [manual, setManual] = React.useState(false)
  React.useEffect(() => {
    if (!active || !onScreen || manual || count < 2) return
    const id = setInterval(() => setIndex((i) => (i + 1) % count), ms)
    return () => clearInterval(id)
  }, [active, onScreen, manual, count, ms])
  const select = (i: number) => {
    setManual(true)
    setIndex(i)
    sfx.click()
  }
  return { index, manual, select }
}

function Shot({
  items,
  index,
  onNext,
}: {
  items: Array<ShotItem>
  index: number
  onNext?: () => void
}) {
  return (
    <div className="shot">
      {items.map((item, i) =>
        "visual" in item ? (
          <div
            key={i}
            className={`alt ${item.visual === "form" ? "mf" : "lv"} ${i === index ? "on" : ""}`}
            aria-hidden={i !== index}
          >
            <LearningVisualView visual={item.visual} />
          </div>
        ) : (
          <img
            key={i}
            src={item.img}
            alt={item.alt}
            decoding="async"
            className={i === index ? "on" : ""}
            aria-hidden={i !== index}
            onClick={onNext}
          />
        )
      )}
    </div>
  )
}

function Pills({
  labels,
  index,
  onSelect,
}: {
  labels: Array<string>
  index: number
  onSelect: (i: number) => void
}) {
  return (
    <div className="pills" role="tablist">
      {labels.map((label, i) => (
        <button
          key={label}
          type="button"
          role="tab"
          aria-selected={i === index}
          className={i === index ? "on" : ""}
          onClick={() => onSelect(i)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

function OutLink({ link }: { link?: SceneLink }) {
  if (!link) return null
  return (
    <>
      {" · "}
      <a href={link.href} target="_blank" rel="noreferrer">
        {link.label} ↗
      </a>
    </>
  )
}

function TabsScene({ scene, active }: SceneProps<"tabs">) {
  const ms = scene.ms ?? 3600
  const { index, manual, select } = useAutoTabs(scene.tabs.length, active, ms)
  return (
    <div
      className={`scene ${manual ? "manual" : ""}`}
      style={{ "--dur": `${ms}ms` } as React.CSSProperties}
    >
      <Shot
        items={scene.tabs.map((t) => t.shot)}
        index={index}
        onNext={() => select((index + 1) % scene.tabs.length)}
      />
      <div className="ui">
        <Pills
          labels={scene.tabs.map((t) => t.label)}
          index={index}
          onSelect={select}
        />
        <span className="cap">
          {scene.tabs[index].caption}
          <OutLink link={scene.tabs[index].link} />
        </span>
      </div>
    </div>
  )
}

/** Tabs whose caption types out a short log (Unlogged actions, 100x agent replies). */
function LogScene({ scene, active }: SceneProps<"log">) {
  const loud = useSfx()
  const { later, clear } = useTimers()
  const ms = scene.ms ?? 4200
  const { index, manual, select } = useAutoTabs(scene.tabs.length, active, ms)
  const [line, setLine] = React.useState("")
  // typing sounds only once the viewer has picked a tab themselves
  const sfx = manual ? loud : quietSfx
  React.useEffect(() => {
    if (!active) return
    clear()
    setLine(scene.thinking ? "● thinking…" : "")
    scene.tabs[index].lines.forEach((ln, k) =>
      later(
        () => {
          setLine(ln)
          if (ln.startsWith("✓")) sfx.chime()
          else for (let n = 0; n < 4; n++) later(() => sfx.type(), n * 40)
        },
        (scene.thinking ? 500 : 0) + k * 700
      )
    )
  }, [active, index, scene, later, clear, sfx])
  return (
    <div
      className={`scene ${manual ? "manual" : ""}`}
      style={{ "--dur": `${ms}ms` } as React.CSSProperties}
    >
      <Shot
        items={scene.tabs.map((t) => t.shot)}
        index={index}
        onNext={() => select((index + 1) % scene.tabs.length)}
      />
      <div className="ui">
        <Pills
          labels={scene.tabs.map((t) => t.label)}
          index={index}
          onSelect={select}
        />
        <span className="cap">
          {line.startsWith("✓") ? (
            <span className="ok">{line}</span>
          ) : line && !line.startsWith("●") ? (
            `› ${line}`
          ) : (
            line
          )}
        </span>
      </div>
    </div>
  )
}

const CODE = [
  "cart = session.cart()",
  "order = cart.checkout()",
  "total = order.sum()",
  "tax = rates.get(region)",
  "pay(total + tax)",
]
const VALUES: Array<React.ReactNode> = [
  "[3 items]",
  "{ id: 1042 }",
  "1240",
  <span key="n" className="bad">
    null
  </span>,
  <span key="e" className="bad">
    NullPointerException
  </span>,
]

/** Videobug: run the recording to the crash, then rewind to the line that caused it. */
function RewindScene({ scene, active }: SceneProps<"rewind">) {
  const sfx = useSfx()
  const { later, clear } = useTimers()
  const [frame, setFrame] = React.useState(0)
  const [cause, setCause] = React.useState(false)
  const run = React.useCallback(
    (s: Sfx) => {
      clear()
      setCause(false)
      setFrame(0)
      s.click()
      ;[1, 2, 3, 4].forEach((k) =>
        later(() => {
          setFrame(k)
          if (k === 4) s.thud()
          else s.tick()
        }, k * 520)
      )
    },
    [clear, later]
  )
  const rewind = React.useCallback(
    (s: Sfx) => {
      clear()
      setCause(false)
      setFrame(4)
      s.rewind()
      later(() => {
        setFrame(3)
        setCause(true)
        s.tick()
        s.chime()
      }, 420)
    },
    [clear, later]
  )
  // the first run plays by itself when the stop arrives, so it stays silent
  React.useEffect(() => {
    if (!active) return
    run(quietSfx)
    later(() => rewind(quietSfx), 3200)
  }, [active, run, rewind, later])
  const shotIndex = cause ? 1 : frame === 4 ? 2 : 0
  return (
    <div className="scene">
      <Shot items={scene.shots} index={shotIndex} onNext={() => rewind(sfx)} />
      <div className="ui">
        <div className="codeline">
          <b>{41 + frame}</b>
          {CODE[frame]}
          <span className="v">{VALUES[frame]}</span>
          {cause && (
            <span className="why"> ◆ root cause: no tax rate for region</span>
          )}
        </div>
        <div className="scrub-row">
          <button type="button" className="btn" onClick={() => run(sfx)}>
            ▶ Run
          </button>
          <input
            type="range"
            min={0}
            max={4}
            value={frame}
            aria-label="Recorded frame"
            onChange={(e) => {
              clear()
              setCause(false)
              setFrame(Number(e.target.value))
              sfx.tick()
            }}
          />
          <button
            type="button"
            className="btn primary"
            onClick={() => rewind(sfx)}
          >
            ◀◀ Rewind to the cause
          </button>
        </div>
      </div>
    </div>
  )
}

const APPROVE_LABELS = [
  "Submit request",
  "Approve as manager",
  "Approve as finance",
  "Raise PO",
  "Release payment",
  "↺ Start over",
]
const APPROVE_STATUS = [
  "Waiting for manager",
  "Waiting for finance",
  "Approved · raising PO",
  "PO sent to vendor",
  "Paid · synced to the ledger",
]
const CONFETTI = ["#ef7a81", "#22a06b", "#f5b942", "#5fc6ff"]

/** Kodo: move a sample purchase request through the real P2P screens. */
function ApprovalScene({ scene, active }: SceneProps<"approval">) {
  const sfx = useSfx()
  const { later } = useTimers()
  const [step, setStep] = React.useState(-1)
  const [burst, setBurst] = React.useState(0)
  React.useEffect(() => {
    if (!active) return
    later(() => setStep((s) => (s < 0 ? 0 : s)), 600)
  }, [active, later])
  const advance = () => {
    const next = step >= 4 ? -1 : step + 1
    setStep(next)
    if (next === 4) {
      sfx.chime()
      setBurst((b) => b + 1)
    } else sfx.pop()
  }
  const shown = Math.max(0, step)
  return (
    <div className="scene">
      <Shot items={scene.shots} index={shown} onNext={advance} />
      <div className="ui">
        <div className="steps">
          {scene.steps.map((s, i) => (
            <span key={s} className={`st ${i <= step ? "done" : ""}`}>
              <i>✓</i>
              {s}
            </span>
          ))}
        </div>
        <button type="button" className="btn primary" onClick={advance}>
          {APPROVE_LABELS[step + 1]}
        </button>
        <span className="cap" style={{ flexBasis: "100%" }}>
          <b>PR-1042 · Design team laptops</b> ·{" "}
          {step < 0 ? (
            "draft"
          ) : (
            <span className={step === 4 ? "ok" : ""}>
              {APPROVE_STATUS[step]}
            </span>
          )}{" "}
          · {scene.shots[shown].caption}
        </span>
      </div>
      <div className="confetti" key={burst} aria-hidden="true">
        {burst > 0 &&
          Array.from({ length: 26 }, (_, i) => {
            const a = (i / 26) * Math.PI * 2 + (i % 3) * 0.4
            const d = 90 + ((i * 37) % 130)
            return (
              <i
                key={i}
                style={
                  {
                    background: CONFETTI[i % 4],
                    "--x": `${Math.cos(a) * d}px`,
                    "--y": `${Math.sin(a) * d}px`,
                    "--rot": `${(i * 97) % 720}deg`,
                  } as React.CSSProperties
                }
              />
            )
          })}
      </div>
    </div>
  )
}

const TOOLS = [
  { k: "ae", label: "Ae", caption: "After Effects · keyframes and easing" },
  { k: "pr", label: "Pr", caption: "Premiere Pro · cutting to the beat" },
  {
    k: "ai",
    label: "Ai",
    caption: "Illustrator · Bézier curves with the pen tool",
  },
  { k: "yt", label: "▶ YouTube", caption: "" },
  { k: "photo", label: "◉ Photography", caption: "" },
] as const
const CURVE = "M30 130 C 90 10, 200 10, 290 110"

/** The YouTube channel the tools turned into: four real uploads. */
function ChannelCard() {
  const { youtube } = collegeOutputs
  return (
    <div className="yt">
      {youtube.videos.map((v, i) => (
        <a
          key={v.id}
          href={`https://www.youtube.com/watch?v=${v.id}`}
          target="_blank"
          rel="noreferrer"
          style={{ "--i": i } as React.CSSProperties}
        >
          <img
            src={`/journey/college/yt-${v.id}.webp`}
            alt=""
            decoding="async"
          />
          <span>
            <small>{v.tool}</small>
            {v.title}
          </span>
        </a>
      ))}
    </div>
  )
}

/** A contact sheet of photos from 500px; one frame at a time is "picked". */
function ContactSheet({
  pick,
  onOpen,
}: {
  pick: number
  onOpen: (i: number) => void
}) {
  return (
    <div className="sheet">
      {collegeOutputs.photos.picks.map((p, i) => (
        <button
          key={p.slug}
          type="button"
          className={i === pick ? "on" : undefined}
          aria-label={`View photo: ${p.title}`}
          onClick={() => onOpen(i)}
          style={{ "--i": i } as React.CSSProperties}
        >
          <img
            src={`/journey/college/photo-${p.slug}.webp`}
            alt=""
            decoding="async"
          />
          <span>{p.title}</span>
        </button>
      ))}
    </div>
  )
}

/**
 * Full-size photo viewer. Portalled to the .jt root (the horizontal track is transformed,
 * which would break position: fixed), and it swallows keys so the timeline stays put.
 */
function PhotoViewer({
  index,
  host,
  onIndex,
  onClose,
}: {
  index: number
  host: Element
  onIndex: (i: number) => void
  onClose: () => void
}) {
  const sfx = useSfx()
  const { photos } = collegeOutputs
  const n = photos.picks.length
  const photo = photos.picks[index]
  const closeRef = React.useRef<HTMLButtonElement>(null)
  const step = React.useCallback(
    (d: number) => {
      onIndex((index + d + n) % n)
      sfx.tick()
    },
    [index, n, onIndex, sfx]
  )
  React.useEffect(() => {
    const before = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const root = document.documentElement
    const overflow = root.style.overflow
    root.style.overflow = "hidden"
    return () => {
      root.style.overflow = overflow
      before?.focus({ preventScroll: true })
    }
  }, [])
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      else if (e.key === "ArrowRight") step(1)
      else if (e.key === "ArrowLeft") step(-1)
      else if (e.key !== "Tab") return
      if (e.key !== "Tab") e.preventDefault()
      e.stopPropagation()
    }
    window.addEventListener("keydown", onKey, true)
    return () => window.removeEventListener("keydown", onKey, true)
  }, [onClose, step])
  return createPortal(
    <div
      className="jt-lb"
      role="dialog"
      aria-modal="true"
      aria-label={`Photo: ${photo.title}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <figure>
        <img
          key={photo.slug}
          src={`/journey/college/photo-${photo.slug}.webp`}
          alt={photo.title}
        />
        <figcaption>
          <b>{photo.title}</b>
          <span>
            {index + 1} / {n}
          </span>
          <a href={photos.url} target="_blank" rel="noreferrer">
            more on 500px ↗
          </a>
        </figcaption>
      </figure>
      <button
        type="button"
        className="lb-prev"
        aria-label="Previous photo"
        onClick={() => step(-1)}
      >
        ←
      </button>
      <button
        type="button"
        className="lb-next"
        aria-label="Next photo"
        onClick={() => step(1)}
      >
        →
      </button>
      <button
        type="button"
        className="lb-close"
        aria-label="Close"
        ref={closeRef}
        onClick={onClose}
      >
        ✕
      </button>
    </div>,
    host
  )
}

function ToolsScene({ active }: SceneProps<"tools">) {
  const sfx = useSfx()
  const { index, manual, select } = useAutoTabs(TOOLS.length, active, 4000)
  const k = TOOLS[index].k
  const photos = collegeOutputs.photos.picks
  const [pick, setPick] = React.useState(0)
  const [viewing, setViewing] = React.useState<number | null>(null)
  const onScreen = React.useContext(OnScreenContext)
  const sceneRef = React.useRef<HTMLDivElement>(null)
  const host = sceneRef.current?.closest(".jt")
  // While the photography tab is open, the loupe walks the contact sheet
  React.useEffect(() => {
    if (!active || !onScreen || k !== "photo" || viewing !== null) return
    const id = setInterval(() => setPick((p) => (p + 1) % photos.length), 1100)
    return () => clearInterval(id)
  }, [active, onScreen, k, photos.length, viewing])
  const caption =
    k === "yt" ? (
      <>
        <b>18 videos · 428 subscribers</b> ·{" "}
        <a href={collegeOutputs.youtube.url} target="_blank" rel="noreferrer">
          channel ↗
        </a>
      </>
    ) : k === "photo" ? (
      <>
        <b>{photos[pick].title}</b> ·{" "}
        <a href={collegeOutputs.photos.url} target="_blank" rel="noreferrer">
          500px ↗
        </a>
      </>
    ) : (
      TOOLS[index].caption
    )
  return (
    <div
      ref={sceneRef}
      className={`scene ${manual ? "manual" : ""}`}
      style={{ "--dur": "4000ms" } as React.CSSProperties}
    >
      <div className="shot">
        <div
          className={`alt ${k === "yt" ? "on" : ""}`}
          aria-hidden={k !== "yt"}
        >
          <ChannelCard />
        </div>
        <div
          className={`alt ${k === "photo" ? "on" : ""}`}
          aria-hidden={k !== "photo"}
        >
          <ContactSheet
            pick={pick}
            onOpen={(i) => {
              select(4)
              setPick(i)
              setViewing(i)
              sfx.pop()
            }}
          />
        </div>
        <div
          className={`alt ${k === "ae" || k === "pr" || k === "ai" ? "on" : ""}`}
        >
          <div className="svgbox" data-k={k}>
            <svg
              viewBox="0 0 320 190"
              preserveAspectRatio="xMidYMid meet"
              aria-label={TOOLS[index].label}
              role="img"
            >
              <g className="g-ae">
                <path d={CURVE} className="guide" />
                <circle r="11" className="ball">
                  <animateMotion
                    dur="2.4s"
                    repeatCount="indefinite"
                    path={CURVE}
                    keyPoints="0;1;0"
                    keyTimes="0;.5;1"
                    calcMode="spline"
                    keySplines=".5 0 .5 1;.5 0 .5 1"
                  />
                </circle>
                <line x1="25" x2="295" y1="168" y2="168" className="trk" />
                {[25, 160, 295].map((x) => (
                  <rect
                    key={x}
                    className="kf"
                    x={x - 5}
                    y="163"
                    width="10"
                    height="10"
                    transform={`rotate(45 ${x} 168)`}
                  />
                ))}
                <rect className="ph" x="24" y="156" width="2" height="24" />
                <text x="25" y="150">
                  position
                </text>
              </g>
              <g className="g-pr">
                {(
                  [
                    [
                      "#ea77ff",
                      40,
                      [
                        [25, 90],
                        [120, 60],
                        [185, 110],
                      ],
                    ],
                    [
                      "#5fc6ff",
                      80,
                      [
                        [25, 140],
                        [170, 125],
                      ],
                    ],
                    ["#7ee08a", 120, [[25, 270]]],
                  ] as Array<[string, number, Array<[number, number]>]>
                ).flatMap(([col, y, clips]) =>
                  clips.map(([x, w]) => (
                    <rect
                      key={`${y}-${x}`}
                      rx="4"
                      x={x}
                      y={y}
                      width={w - 4}
                      height="28"
                      fill={col}
                      opacity=".75"
                    />
                  ))
                )}
                <text x="25" y="30">
                  V1 V2 A1
                </text>
                <rect className="pr-ph" x="24" y="34" width="2" height="122" />
              </g>
              <g className="g-ai">
                <line className="hdl" x1="40" y1="140" x2="60" y2="40" />
                <line className="hdl" x1="160" y1="100" x2="140" y2="40" />
                <line className="hdl" x1="160" y1="100" x2="210" y2="160" />
                <path
                  className="pen"
                  d="M40 140 C 60 40, 140 40, 160 100 S 260 160, 280 50"
                />
                {[
                  [40, 140],
                  [160, 100],
                  [280, 50],
                ].map(([x, y]) => (
                  <rect
                    key={x}
                    className="anc"
                    x={x - 5}
                    y={y - 5}
                    width="10"
                    height="10"
                  />
                ))}
                <text x="40" y="175">
                  pen tool
                </text>
              </g>
            </svg>
          </div>
        </div>
      </div>
      <div className="ui">
        <Pills
          labels={TOOLS.map((t) => t.label)}
          index={index}
          onSelect={select}
        />
        <span className="cap">{caption}</span>
      </div>
      {viewing !== null && host && (
        <PhotoViewer
          index={viewing}
          host={host}
          onIndex={(i) => {
            setViewing(i)
            setPick(i)
          }}
          onClose={() => setViewing(null)}
        />
      )}
    </div>
  )
}

/** Drawn visuals for 2020, when there are no screenshots: learning UX, plus Tulr's form block. */
function LearningVisualView({ visual }: { visual: LearningVisual }) {
  switch (visual) {
    case "figma":
      return (
        <div className="card fg">
          <div className="fg-bar">
            <img src="/tools/figma.svg" alt="" />
            <span>tenxgeeks-landing.fig</span>
          </div>
          <div className="fg-body">
            <div className="fg-layers">
              {["Frame", "Heading", "Button", "Body"].map((l, i) => (
                <i key={l} style={{ "--i": i } as React.CSSProperties}>
                  {l}
                </i>
              ))}
            </div>
            <div className="fg-canvas">
              <div className="fg-frame">
                <b />
                <i />
                <i />
                <span className="btn-d" />
                <span className="fg-sel" />
              </div>
            </div>
          </div>
        </div>
      )
    case "theory":
      return (
        <div className="card">
          <svg
            viewBox="0 0 320 200"
            role="img"
            aria-label="Double diamond: discover, define, develop, deliver"
          >
            <path className="dd" d="M20 100 L85 45 L150 100 L85 155 Z" />
            <path className="dd" d="M170 100 L235 45 L300 100 L235 155 Z" />
            <circle r="6" className="runner">
              <animateMotion
                dur="5s"
                repeatCount="indefinite"
                path="M20 100 L85 45 L150 100 L170 100 L235 45 L300 100 L235 155 L170 100 L150 100 L85 155 Z"
              />
            </circle>
            {(
              [
                ["Discover", 40, 34],
                ["Define", 104, 34],
                ["Develop", 190, 34],
                ["Deliver", 252, 34],
              ] as Array<[string, number, number]>
            ).map(([t, x, y]) => (
              <text key={t} x={x} y={y}>
                {t}
              </text>
            ))}
            <text x="62" y="182">
              problem
            </text>
            <text x="212" y="182">
              solution
            </text>
          </svg>
        </div>
      )
    case "sprint":
      return (
        <div className="card">
          <div className="days">
            {[
              ["Mon", "Map", "🗺"],
              ["Tue", "Sketch", "✏️"],
              ["Wed", "Decide", "◎"],
              ["Thu", "Prototype", "▭"],
              ["Fri", "Test", "✓"],
            ].map(([d, n, ic], i) => (
              <div key={d} style={{ "--i": i } as React.CSSProperties}>
                <small>{d}</small>
                <span>{ic}</span>
                <b>{n}</b>
              </div>
            ))}
          </div>
        </div>
      )
    case "lean":
      return (
        <div className="card">
          <svg
            viewBox="0 0 320 200"
            role="img"
            aria-label="Lean UX loop: think, make, check"
          >
            <circle cx="160" cy="100" r="66" className="loop" />
            <g className="spin">
              <circle cx="160" cy="34" r="6" className="runner" />
            </g>
            {(
              [
                ["Think", 160, 34],
                ["Make", 217, 133],
                ["Check", 103, 133],
              ] as Array<[string, number, number]>
            ).map(([t, x, y]) => (
              <g key={t}>
                <circle cx={x} cy={y} r="18" className="node" />
                <text x={x} y={y + 4} textAnchor="middle">
                  {t}
                </text>
              </g>
            ))}
            <text x="160" y="104" textAnchor="middle">
              learn
            </text>
          </svg>
        </div>
      )
    case "cert":
      return (
        <div className="card cert">
          <div className="cert-in">
            <small>Course completion</small>
            <strong>UXDMC</strong>
            <em>Akshay Saini</em>
            <small>UX Design Masterclass</small>
            <small>Sep 11, 2020</small>
            <span className="seal">UX ✓</span>
            <span className="side-note">+ Tenxgeeks, built with a friend</span>
          </div>
        </div>
      )
    case "form":
      return (
        <div>
          <strong>New form</strong>
          <i />
          <i />
          <i />
          <b>Submit</b>
        </div>
      )
  }
}

export function ChapterScene({
  chapter,
  active,
}: {
  chapter: TimelineChapter
  active: boolean
}) {
  const scene = chapter.scene
  const wrapRef = React.useRef<HTMLDivElement>(null)
  const [onScreen, setOnScreen] = React.useState(true)
  React.useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => setOnScreen(e.isIntersecting),
      { threshold: 0.15 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  let body: React.ReactNode
  switch (scene.kind) {
    case "none":
      return null
    case "tools":
      body = <ToolsScene scene={scene} active={active} />
      break
    case "tabs":
      body = <TabsScene scene={scene} active={active} />
      break
    case "log":
      body = <LogScene scene={scene} active={active} />
      break
    case "rewind":
      body = <RewindScene scene={scene} active={active} />
      break
    case "approval":
      body = <ApprovalScene scene={scene} active={active} />
      break
  }
  return (
    <div
      ref={wrapRef}
      className="scene-wrap"
      style={{ "--b": chapter.brand } as React.CSSProperties}
    >
      <OnScreenContext.Provider value={onScreen}>
        {body}
      </OnScreenContext.Provider>
    </div>
  )
}
