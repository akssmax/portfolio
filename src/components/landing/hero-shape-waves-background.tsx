import { Suspense, lazy, useRef } from "react"

import { ErrorBoundary } from "@/components/error-boundary"
import { mixBrandColors, tintBrandColor, useBrandColors } from "@/hooks/use-brand-colors"
import { useDeferredMount } from "@/hooks/use-deferred-mount"
import { useDocumentColorMode } from "@/hooks/use-document-color-mode"
import { useCanAnimate } from "@/hooks/use-can-animate"
import { useInView } from "@/hooks/use-in-view"
import { MONOGRAM_VIEWBOX } from "@/lib/brand/monogram-mark"

const ShapeWaves = lazy(() => import("@/components/marketing/ShapeWaves"))

/** Full-bleed version of the ShapeWaves surface used by project and case-study cards. */
type ShapeFormation = {
  paths: Array<string>
  value: number
}

export function HeroShapeWavesBackground({
  active = true,
  formation,
  surface = "hero",
}: {
  active?: boolean
  formation?: ShapeFormation
  surface?: "hero" | "footer"
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef, { rootMargin: "160px", initialInView: true })
  const canAnimate = useCanAnimate()
  const { primary, secondary } = useBrandColors()
  const mounted = useDeferredMount(active && inView && canAnimate)
  const colorMode = useDocumentColorMode()
  const isDark = colorMode === "dark"
  const waveColor = isDark
    ? mixBrandColors(primary, secondary, 0.7)
    : tintBrandColor(mixBrandColors(primary, secondary, 0.55), 0.68)
  const hoverColor = isDark ? primary : tintBrandColor(primary, 0.3)
  const backgroundColor = surface === "footer" ? (isDark ? "#000000" : "#ffffff") : isDark ? "#101113" : "#fbfdfc"
  const overlayColor = surface === "footer" ? (isDark ? "0,0,0" : "255,255,255") : isDark ? "16,17,19" : "255,255,255"

  return (
    <div
      ref={rootRef}
      className="pointer-events-none absolute inset-0 overflow-hidden bg-[#fbfdfc] dark:bg-[#101113]"
      style={colorMode ? { backgroundColor } : undefined}
      aria-hidden
    >
      {colorMode ? (
        <div
          className="absolute inset-0 opacity-35"
          style={{ backgroundImage: `radial-gradient(${waveColor} 0.6px, transparent 0.6px)`, backgroundSize: "16px 16px" }}
        />
      ) : null}
      {mounted && colorMode ? (
        <ErrorBoundary title="Background animation failed" showHeader={false}>
          <Suspense fallback={null}>
            <div className="absolute inset-0 opacity-75">
              <ShapeWaves
                key={`${surface}-${colorMode}`}
                shapes="mixed"
                cellSize={16}
                dotSize={0.66}
                color={waveColor}
                hoverColor={hoverColor}
                backgroundColor={backgroundColor}
                speed={0.35}
                scale={1.35}
                contrast={1.15}
                brightness={0.48}
                fade={0.62}
                interactive
                splashRadius={48}
                splashStrength={0.42}
                glow={0}
                intro
                introDuration={1.5}
                maskPaths={formation?.paths as Array<never> | undefined}
                maskViewBox={MONOGRAM_VIEWBOX.split(" ").map(Number)}
                formation={formation?.value ?? 0}
              />
            </div>
          </Suspense>
        </ErrorBoundary>
      ) : null}
      {colorMode ? (
        <>
          <div
            className="absolute inset-0"
            style={{ backgroundImage: `radial-gradient(ellipse 45% 60% at 50% 50%, rgba(${overlayColor}, 0.94) 0%, rgba(${overlayColor}, 0.76) 38%, rgba(${overlayColor}, 0) 100%)` }}
          />
          <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(to bottom, rgba(${overlayColor}, 0.05), transparent, rgba(${overlayColor}, 0.65))` }} />
        </>
      ) : null}
    </div>
  )
}
