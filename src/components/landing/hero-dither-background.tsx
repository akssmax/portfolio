import * as React from "react"
import { useTheme } from "next-themes"

import { mixBrandColors, useBrandColors } from "@/hooks/use-brand-colors"
import { useAnimationProfile } from "@/hooks/use-can-animate"
import { useDeferredMount } from "@/hooks/use-deferred-mount"

const Dither = React.lazy(() => import("./Dither"))

function toRgbUnit(hex: string): [number, number, number] {
  const value = hex.replace("#", "")
  if (!/^[\da-f]{6}$/i.test(value)) return [1, 0.21, 0.29]
  return [0, 2, 4].map(
    (offset) => Number.parseInt(value.slice(offset, offset + 2), 16) / 255
  ) as [number, number, number]
}

export function HeroDitherBackground() {
  const { canAnimate, fullMotion } = useAnimationProfile()
  const { resolvedTheme } = useTheme()
  const { primary, secondary } = useBrandColors()
  const mounted = useDeferredMount(true)
  const dark = resolvedTheme === "dark"
  const waveColor = React.useMemo(
    () => toRgbUnit(mixBrandColors(primary, secondary, 0.75)),
    [primary, secondary]
  )
  const backgroundColor = React.useMemo<[number, number, number]>(
    () => (dark ? [0, 0, 0] : [1, 1, 1]),
    [dark]
  )

  return (
    <div
      className="pointer-events-none absolute inset-0 w-full overflow-hidden bg-background"
      aria-hidden="true"
    >
      {mounted ? (
        <React.Suspense fallback={null}>
          <div className="absolute inset-0 w-full opacity-20 dark:opacity-30">
            <Dither
              waveColor={waveColor}
              backgroundColor={backgroundColor}
              waveSpeed={0.05}
              waveFrequency={2.5}
              waveAmplitude={0.52}
              colorNum={4}
              pixelSize={2}
              disableAnimation={!canAnimate}
              enableMouseInteraction={canAnimate}
              mouseRadius={0.2}
              fullMotion={fullMotion}
            />
          </div>
        </React.Suspense>
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-b from-background/5 via-background/15 to-background/80" />
    </div>
  )
}
