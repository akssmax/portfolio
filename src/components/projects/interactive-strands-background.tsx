import { useCallback, useState } from "react"
import {
  useMotionValue,
  useMotionValueEvent,
  useSpring,
} from "motion/react"

import Strands from "@/components/Strands"

const BASE_COLORS = ["#F97316", "#7C3AED", "#06B6D4"] as const

const IDLE = {
  amplitude: 0.7,
  speed: 0.5,
  glow: 1.55,
  intensity: 0.4,
  spread: 2.3,
  scale: 2.4,
  hueShift: 0.58,
  waviness: 2.8,
  thickness: 0.7,
  saturation: 1.7,
} as const

const HOVER = {
  amplitude: 1.4,
  speed: 0.9,
  glow: 2.4,
  intensity: 0.72,
  spread: 2.9,
  scale: 2.05,
  hueShift: 0.72,
  waviness: 3.4,
  thickness: 0.85,
  saturation: 1.9,
} as const

function lerp(from: number, to: number, t: number) {
  return from + (to - from) * t
}

type DynamicStrandsProps = {
  amplitude: number
  speed: number
  glow: number
  intensity: number
  spread: number
  scale: number
  hueShift: number
  waviness: number
  thickness: number
  saturation: number
}

function computeProps(hoverT: number, mouseX: number): DynamicStrandsProps {
  return {
    amplitude: lerp(IDLE.amplitude, HOVER.amplitude, hoverT),
    speed: lerp(IDLE.speed, HOVER.speed, hoverT),
    glow: lerp(IDLE.glow, HOVER.glow, hoverT),
    intensity: lerp(IDLE.intensity, HOVER.intensity, hoverT),
    spread: lerp(IDLE.spread, HOVER.spread, hoverT),
    scale: lerp(IDLE.scale, HOVER.scale, hoverT),
    waviness: lerp(IDLE.waviness, HOVER.waviness, hoverT),
    thickness: lerp(IDLE.thickness, HOVER.thickness, hoverT),
    saturation: lerp(IDLE.saturation, HOVER.saturation, hoverT),
    hueShift:
      lerp(IDLE.hueShift, HOVER.hueShift, hoverT) + (mouseX - 0.5) * 0.28,
  }
}

export function useInteractiveStrands() {
  const hover = useMotionValue(0)
  const smoothHover = useSpring(hover, { stiffness: 140, damping: 24 })
  const mouseX = useMotionValue(0.5)
  const smoothMouseX = useSpring(mouseX, { stiffness: 220, damping: 32 })

  const [dynamicProps, setDynamicProps] = useState<DynamicStrandsProps>(() =>
    computeProps(0, 0.5),
  )

  const syncProps = useCallback(() => {
    setDynamicProps(
      computeProps(smoothHover.get(), smoothMouseX.get()),
    )
  }, [smoothHover, smoothMouseX])

  useMotionValueEvent(smoothHover, "change", syncProps)
  useMotionValueEvent(smoothMouseX, "change", syncProps)

  const onMouseEnter = useCallback(() => {
    hover.set(1)
  }, [hover])

  const onMouseLeave = useCallback(() => {
    hover.set(0)
    mouseX.set(0.5)
  }, [hover, mouseX])

  const onMouseMove = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const rect = event.currentTarget.getBoundingClientRect()
      mouseX.set((event.clientX - rect.left) / rect.width)
    },
    [mouseX],
  )

  return {
    dynamicProps,
    mouseHandlers: { onMouseEnter, onMouseLeave, onMouseMove },
  }
}

type InteractiveStrandsBackgroundProps = {
  dynamicProps: DynamicStrandsProps
  className?: string
}

export function InteractiveStrandsBackground({
  dynamicProps,
  className,
}: InteractiveStrandsBackgroundProps) {
  return (
    <div className={className} aria-hidden>
      <Strands
        colors={[...BASE_COLORS]}
        count={6}
        opacity={1}
        glass={false}
        refraction={1}
        dispersion={1}
        glassSize={1}
        taper={1.9}
        {...dynamicProps}
      />
    </div>
  )
}
