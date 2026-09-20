import { Suspense, lazy, useRef } from "react"
import { useTheme } from "next-themes"

import { ErrorBoundary } from "@/components/error-boundary"
import { mixBrandColors, tintBrandColor, useBrandColors } from "@/hooks/use-brand-colors"
import { useDeferredMount } from "@/hooks/use-deferred-mount"
import { useCanAnimate } from "@/hooks/use-can-animate"
import { useInView } from "@/hooks/use-in-view"

const ShapeWaves = lazy(() => import("@/components/marketing/ShapeWaves"))

/** Full-bleed version of the ShapeWaves surface used by project and case-study cards. */
export function HeroShapeWavesBackground({ active = true }: { active?: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef, { rootMargin: "160px", initialInView: true })
  const canAnimate = useCanAnimate()
  const { primary, secondary } = useBrandColors()
  const { resolvedTheme } = useTheme()
  const mounted = useDeferredMount(active && inView && canAnimate)
  const isDark = resolvedTheme === "dark"
  const waveColor = isDark
    ? mixBrandColors(primary, secondary, 0.7)
    : tintBrandColor(mixBrandColors(primary, secondary, 0.55), 0.68)
  const hoverColor = isDark ? primary : tintBrandColor(primary, 0.3)
  const backgroundColor = isDark ? "#0c1412" : "#fbfdfc"

  return (
    <div ref={rootRef} className="pointer-events-none absolute inset-0 overflow-hidden" style={{ backgroundColor }} aria-hidden>
      <div
        className="absolute inset-0 opacity-35"
        style={{ backgroundImage: `radial-gradient(${waveColor} 0.6px, transparent 0.6px)`, backgroundSize: "16px 16px" }}
      />
      {mounted ? (
        <ErrorBoundary title="Background animation failed" showHeader={false}>
          <Suspense fallback={null}>
            <div className="absolute inset-0 opacity-75">
              <ShapeWaves
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
              />
            </div>
          </Suspense>
        </ErrorBoundary>
      ) : null}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_60%_at_50%_50%,rgba(255,255,255,0.94)_0%,rgba(255,255,255,0.76)_38%,rgba(255,255,255,0)_100%)] dark:bg-[radial-gradient(ellipse_45%_60%_at_50%_50%,rgba(12,20,18,0.9)_0%,rgba(12,20,18,0.65)_38%,rgba(12,20,18,0)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/5 via-transparent to-background/65" />
    </div>
  )
}
