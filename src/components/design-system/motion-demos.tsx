import { useEffect, useMemo, useState } from "react"
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useTransform,
} from "motion/react"
import { Check, PanelLeft, RotateCcw, Sparkles } from "lucide-react"
import { useAnimationProfile } from "@/hooks/use-can-animate"
import { Button } from "@/components/ui/button"
import { BorderBeam } from "@/components/ui/border-beam"
import { Shimmer } from "@/components/ai-elements/shimmer"
import { motionCurves } from "@/lib/design-system/motion-catalog"
import { EASE_OUT_SMOOTH, SIDEBAR_TRANSITION } from "@/lib/motion-easing"
import { createShapeMorphInterpolator } from "@/lib/m3-shape-morph"
import { getM3ShapePath } from "@/lib/m3-shape-paths"

export function EasingPreview() {
  const { canAnimate } = useAnimationProfile()
  const [replay, setReplay] = useState(0)
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          A 1s preview to compare the curves. Production timings vary by recipe.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setReplay((value) => value + 1)}
          disabled={!canAnimate}
        >
          <RotateCcw aria-hidden="true" /> Replay curves
        </Button>
      </div>
      <div className="space-y-3">
        {motionCurves.map((curve) => (
          <div key={curve.name} className="rounded-xl border border-border p-5">
            <div className="flex items-center gap-5">
              <svg
                aria-hidden="true"
                viewBox="0 0 100 100"
                className="size-16 shrink-0 overflow-visible text-primary"
              >
                <path
                  d="M 0 0 V 100 H 100"
                  fill="none"
                  className="stroke-border"
                />
                <path
                  d={`M 0 100 C ${curve.value[0] * 100} ${100 - curve.value[1] * 100}, ${curve.value[2] * 100} ${100 - curve.value[3] * 100}, 100 0`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
              </svg>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[11px] font-medium break-all">
                  {curve.name}
                </p>
                <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                  [{curve.value.join(", ")}]
                </p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  {curve.use}
                </p>
              </div>
            </div>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
              <motion.div
                key={replay}
                className="h-full origin-left rounded-full bg-primary"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: canAnimate ? 1 : 0, ease: curve.value }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function NavigationMotionPreview() {
  const { canAnimate } = useAnimationProfile()
  const [open, setOpen] = useState(true)
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <span className="text-xs font-medium">
          Panel resize · {SIDEBAR_TRANSITION.duration * 1000}ms
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Toggle demo sidebar"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <PanelLeft aria-hidden="true" />
        </Button>
      </div>
      <div className="flex h-44 min-w-0">
        <motion.div
          initial={false}
          animate={{ width: open ? 112 : 0, opacity: open ? 1 : 0 }}
          transition={canAnimate ? SIDEBAR_TRANSITION : { duration: 0 }}
          aria-hidden="true"
          className="shrink-0 overflow-hidden"
        >
          <div className="h-full w-28 space-y-3 border-r border-border bg-muted/40 p-4">
            <div className="h-2 w-14 rounded bg-foreground/20" />
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-5 rounded bg-foreground/5" />
            ))}
          </div>
        </motion.div>
        <div
          className="flex min-w-0 flex-1 flex-col justify-center gap-3 p-5"
          aria-hidden="true"
        >
          <div className="h-3 w-2/3 rounded bg-primary/30" />
          <div className="h-2 w-full rounded bg-muted" />
          <div className="h-2 w-4/5 rounded bg-muted" />
        </div>
      </div>
    </div>
  )
}

export function PresenceMotionPreview() {
  const { canAnimate } = useAnimationProfile()
  const [visible, setVisible] = useState(true)
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <span className="text-xs font-medium">Enter & exit · 240ms</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setVisible((value) => !value)}
        >
          {visible ? "Hide card" : "Show card"}
        </Button>
      </div>
      <div className="grid h-44 place-items-center overflow-hidden bg-muted/10 p-4">
        <AnimatePresence initial={false}>
          {visible && (
            <motion.div
              key="card"
              initial={canAnimate ? { opacity: 0, y: 12 } : false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: canAnimate ? -8 : 0 }}
              transition={canAnimate ? SIDEBAR_TRANSITION : { duration: 0 }}
              className="flex items-center gap-3 rounded-xl border border-border bg-background px-5 py-4 shadow-sm"
            >
              <Check aria-hidden="true" className="size-4 text-primary" />
              <span className="text-xs">Changes saved</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export function SpringMotionPreview() {
  const { canAnimate } = useAnimationProfile()
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-4 rounded-xl border border-border bg-muted/10 p-6">
      <motion.button
        type="button"
        whileHover={canAnimate ? { scale: 1.06, y: -2 } : undefined}
        whileFocus={canAnimate ? { scale: 1.06, y: -2 } : undefined}
        whileTap={canAnimate ? { scale: 0.98, y: 0 } : undefined}
        transition={
          canAnimate
            ? { type: "spring", stiffness: 340, damping: 22 }
            : { duration: 0 }
        }
        className="flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-xs font-medium shadow-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      >
        <Sparkles aria-hidden="true" className="size-4 text-primary" /> Hover,
        focus, or press
      </motion.button>
      <p className="text-center font-mono text-[10px] text-muted-foreground">
        stiffness: 340 · damping: 22
      </p>
    </div>
  )
}

export function SvgMotionPreview() {
  const { canAnimate, fullMotion } = useAnimationProfile()
  const [replay, setReplay] = useState(0)
  const [flower, setFlower] = useState(false)
  const progress = useMotionValue(0)
  const interpolator = useMemo(
    () => createShapeMorphInterpolator("circle", "flower"),
    []
  )
  const path = useTransform(
    progress,
    (value) => interpolator?.(value) ?? getM3ShapePath("circle") ?? ""
  )
  useEffect(() => {
    const target = flower ? 1 : 0
    if (!fullMotion) {
      progress.set(target)
      return
    }
    const controls = animate(progress, target, {
      duration: 1.2,
      ease: [0.45, 0, 0.25, 1],
    })
    return () => controls.stop()
  }, [flower, fullMotion, progress])
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="flex flex-col items-center gap-5 rounded-xl border border-border p-6">
        <svg
          viewBox="0 0 80 80"
          aria-hidden="true"
          className="size-24 text-primary"
        >
          <motion.path
            key={replay}
            d="M 14 42 L 32 59 L 66 22"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: canAnimate ? 0 : 1 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: canAnimate ? 0.75 : 0,
              ease: EASE_OUT_SMOOTH,
            }}
          />
        </svg>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setReplay((value) => value + 1)}
          disabled={!canAnimate}
        >
          Replay SVG draw
        </Button>
        <p className="text-center text-[10px] text-muted-foreground">
          pathLength · 750ms
        </p>
      </div>
      <div className="flex flex-col items-center gap-5 rounded-xl border border-border p-6">
        <svg
          viewBox="0 0 1000 1000"
          aria-hidden="true"
          className="size-24 text-primary"
        >
          <motion.path d={path} fill="currentColor" />
        </svg>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFlower((value) => !value)}
        >
          {flower ? "Switch to circle" : "Switch to flower"}
        </Button>
        <p className="text-center text-[10px] text-muted-foreground">
          {fullMotion
            ? "Flubber + animate() · 1.2s"
            : "Direct shape swap · morph disabled for this profile"}
        </p>
      </div>
    </div>
  )
}

export function AmbientMotionPreview() {
  const { canAnimate } = useAnimationProfile()
  const [running, setRunning] = useState(false)
  const playing = running && canAnimate
  useEffect(() => {
    if (!playing) return
    const timer = window.setTimeout(() => setRunning(false), 8000)
    return () => window.clearTimeout(timer)
  }, [playing])
  useEffect(() => {
    if (!canAnimate) setRunning(false)
  }, [canAnimate])
  return (
    <div className="space-y-4 rounded-xl border border-border p-5">
      <div className="relative grid min-h-28 place-items-center overflow-hidden rounded-xl border border-border bg-background px-5">
        {playing ? (
          <>
            <BorderBeam
              duration={6}
              colorFrom="var(--primary)"
              colorTo="var(--foreground)"
            />
            <Shimmer as="span" duration={2}>
              Working on your request
            </Shimmer>
          </>
        ) : (
          <span className="text-xs text-muted-foreground">
            Working on your request
          </span>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Beam + shimmer. Preview stops after 8 seconds.
        </p>
        <Button
          variant="outline"
          size="sm"
          disabled={!canAnimate}
          onClick={() => setRunning((value) => !value)}
        >
          {playing ? "Pause effects" : "Play effects"}
        </Button>
      </div>
    </div>
  )
}
