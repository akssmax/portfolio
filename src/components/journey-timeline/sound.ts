import * as React from "react"

/** Tiny synthesized sound cues for the journey. Off until the viewer turns them on. */
export type Sfx = {
  tick: () => void
  click: () => void
  pop: () => void
  type: () => void
  whoosh: () => void
  rewind: () => void
  thud: () => void
  chime: () => void
  stop: () => void
}

const STORAGE_KEY = "journey-sound"

function createEngine(isOn: () => boolean): Sfx {
  let ctx: AudioContext | null = null
  let master: GainNode | null = null

  function ready() {
    if (!isOn() || typeof window === "undefined") return null
    if (!ctx) {
      const w = window as unknown as {
        AudioContext?: typeof AudioContext
        webkitAudioContext?: typeof AudioContext
      }
      const AC = w.AudioContext ?? w.webkitAudioContext
      if (!AC) return null
      ctx = new AC()
      master = ctx.createGain()
      master.gain.value = 0.55
      master.connect(ctx.destination)
    }
    if (ctx.state === "suspended") void ctx.resume()
    return ctx
  }

  function tone(
    freq: number,
    dur: number,
    opts: {
      type?: OscillatorType
      gain?: number
      at?: number
      to?: number
    } = {}
  ) {
    const c = ready()
    if (!c || !master) return
    const { type = "sine", gain = 0.05, at = 0, to } = opts
    const t = c.currentTime + at
    const o = c.createOscillator()
    const g = c.createGain()
    o.type = type
    o.frequency.setValueAtTime(freq, t)
    if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur)
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(gain, t + 0.008)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    o.connect(g)
    g.connect(master)
    o.start(t)
    o.stop(t + dur + 0.02)
  }

  function noise(dur: number, { from = 400, to = 2400, gain = 0.03 } = {}) {
    const c = ready()
    if (!c || !master) return
    const t = c.currentTime
    const buf = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
    const src = c.createBufferSource()
    const f = c.createBiquadFilter()
    const g = c.createGain()
    src.buffer = buf
    f.type = "bandpass"
    f.Q.value = 1.2
    f.frequency.setValueAtTime(from, t)
    f.frequency.exponentialRampToValueAtTime(to, t + dur)
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(gain, t + dur * 0.3)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    src.connect(f)
    f.connect(g)
    g.connect(master)
    src.start(t)
  }

  return {
    tick: () => tone(2200, 0.025, { type: "square", gain: 0.012 }),
    click: () => tone(640, 0.06, { type: "triangle", gain: 0.04 }),
    pop: () => tone(380, 0.1, { gain: 0.05, to: 820 }),
    type: () =>
      tone(2400 + Math.random() * 600, 0.012, { type: "square", gain: 0.006 }),
    whoosh: () => noise(0.35),
    rewind: () => noise(0.45, { from: 2600, to: 300, gain: 0.035 }),
    thud: () => tone(140, 0.25, { gain: 0.08, to: 60 }),
    chime: () => {
      tone(880, 0.3, { gain: 0.035 })
      tone(1320, 0.45, { gain: 0.028, at: 0.09 })
    },
    stop: () => {
      tone(660, 0.12, { type: "triangle", gain: 0.025 })
      tone(990, 0.16, { type: "triangle", gain: 0.02, at: 0.06 })
    },
  }
}

export function useJourneySound() {
  const [enabled, setEnabled] = React.useState(false)
  const enabledRef = React.useRef(false)
  const sfx = React.useMemo(() => createEngine(() => enabledRef.current), [])

  React.useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "on") {
        enabledRef.current = true
        setEnabled(true)
      }
    } catch {
      // storage can be blocked; sound simply stays off
    }
  }, [])

  const toggle = React.useCallback(() => {
    const next = !enabledRef.current
    enabledRef.current = next
    setEnabled(next)
    try {
      localStorage.setItem(STORAGE_KEY, next ? "on" : "off")
    } catch {
      // ignore
    }
    if (next) sfx.chime()
  }, [sfx])

  return { enabled, toggle, sfx }
}

const noop = () => {}
/** A silent stand-in, for anything that animates on its own (sounds only answer the viewer). */
export const quietSfx: Sfx = {
  tick: noop,
  click: noop,
  pop: noop,
  type: noop,
  whoosh: noop,
  rewind: noop,
  thud: noop,
  chime: noop,
  stop: noop,
}
export const SfxContext = React.createContext<Sfx>({
  tick: noop,
  click: noop,
  pop: noop,
  type: noop,
  whoosh: noop,
  rewind: noop,
  thud: noop,
  chime: noop,
  stop: noop,
})
export const useSfx = () => React.useContext(SfxContext)

/** setTimeout/setInterval that are all cleared on unmount (or when `clear` is called). */
export function useTimers() {
  const ids = React.useRef(new Set<ReturnType<typeof setTimeout>>())
  const later = React.useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      ids.current.delete(id)
      fn()
    }, ms)
    ids.current.add(id)
    return id
  }, [])
  const clear = React.useCallback(() => {
    ids.current.forEach(clearTimeout)
    ids.current.clear()
  }, [])
  React.useEffect(() => clear, [clear])
  return { later, clear }
}
