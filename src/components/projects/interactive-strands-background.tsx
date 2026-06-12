import { useCallback, useRef } from "react"
import {
  useMotionValue,
  useMotionValueEvent,
  useSpring,
} from "motion/react"

import Strands from "@/components/Strands"
import { useStrandColors } from "@/hooks/use-brand-colors"

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
  amplitude: 1.0,
  speed: 0.62,
  glow: 1.85,
  intensity: 0.52,
  spread: 2.55,
  scale: 2.3,
  hueShift: 0.64,
  waviness: 3.0,
  thickness: 0.76,
  saturation: 1.8,
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
      lerp(IDLE.hueShift, HOVER.hueShift, hoverT) + (mouseX - 0.5) * 0.14,
  }
}

export function useInteractiveStrands() {
  const hover = useMotionValue(0)
  const smoothHover = useSpring(hover, { stiffness: 55, damping: 28 })
  const mouseX = useMotionValue(0.5)
  const smoothMouseX = useSpring(mouseX, { stiffness: 80, damping: 36 })

  const dynamicPropsRef = useRef<DynamicStrandsProps>(computeProps(0, 0.5))

  const syncProps = useCallback(() => {
    dynamicPropsRef.current = computeProps(
      smoothHover.get(),
      smoothMouseX.get(),
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
    dynamicPropsRef,
    mouseHandlers: { onMouseEnter, onMouseLeave, onMouseMove },
  }
}

type InteractiveStrandsBackgroundProps = {
  dynamicPropsRef: React.RefObject<DynamicStrandsProps>
  className?: string
  colors?: string[]
}

export function InteractiveStrandsBackground({
  dynamicPropsRef,
  className,
  colors: colorsProp,
}: InteractiveStrandsBackgroundProps) {
  const [primary, secondary, accent] = useStrandColors()
  const colors = colorsProp ?? [primary, secondary, accent]
  const idleProps = dynamicPropsRef.current

  return (
    <div className={className} aria-hidden>
      <Strands
        colors={colors}
        count={6}
        opacity={1}
        glass={false}
        refraction={1}
        dispersion={1}
        glassSize={1}
        taper={1.9}
        livePropsRef={dynamicPropsRef}
        {...idleProps}
      />
    </div>
  )
}
