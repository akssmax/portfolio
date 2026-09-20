import { Suspense, lazy, useEffect, useRef, useState } from "react"

import { ErrorBoundary } from "@/components/error-boundary"
import { mixBrandColors, tintBrandColor, useBrandColors } from "@/hooks/use-brand-colors"
import { useDeferredMount } from "@/hooks/use-deferred-mount"
import { useCanAnimate } from "@/hooks/use-can-animate"
import { useInView } from "@/hooks/use-in-view"
import { MONOGRAM_VIEWBOX } from "@/lib/brand/monogram-mark"

const ShapeWaves = lazy(() => import("@/components/marketing/ShapeWaves"))

type ColorMode = "light" | "dark"

function readDocumentColorMode(): ColorMode {
  if (typeof window === "undefined") return "light"

  const root = document.documentElement
  if (root.classList.contains("dark")) return "dark"
  if (root.classList.contains("light")) return "light"

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

/**
 * next-themes applies the system class after hydration. Reading and observing the
 * document keeps WebGPU surfaces aligned during that initial handoff as well.
 */
function useDocumentColorMode(): ColorMode {
  const [mode, setMode] = useState<ColorMode>(readDocumentColorMode)

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const sync = () => setMode(readDocumentColorMode())
    const observer = new MutationObserver(sync)

    sync()
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    media.addEventListener("change", sync)

    return () => {
      observer.disconnect()
      media.removeEventListener("change", sync)
    }
  }, [])

  return mode
}

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
  const isDark = useDocumentColorMode() === "dark"
  const waveColor = isDark
    ? mixBrandColors(primary, secondary, 0.7)
    : tintBrandColor(mixBrandColors(primary, secondary, 0.55), 0.68)
  const hoverColor = isDark ? primary : tintBrandColor(primary, 0.3)
  const backgroundColor = surface === "footer" ? (isDark ? "#000000" : "#ffffff") : isDark ? "#101113" : "#fbfdfc"
  const overlayColor = surface === "footer" ? (isDark ? "0,0,0" : "255,255,255") : isDark ? "16,17,19" : "255,255,255"

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
                maskPaths={formation?.paths as Array<never> | undefined}
                maskViewBox={MONOGRAM_VIEWBOX.split(" ").map(Number)}
                formation={formation?.value ?? 0}
              />
            </div>
          </Suspense>
        </ErrorBoundary>
      ) : null}
      <div
        className="absolute inset-0"
        style={{ backgroundImage: `radial-gradient(ellipse 45% 60% at 50% 50%, rgba(${overlayColor}, 0.94) 0%, rgba(${overlayColor}, 0.76) 38%, rgba(${overlayColor}, 0) 100%)` }}
      />
      <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(to bottom, rgba(${overlayColor}, 0.05), transparent, rgba(${overlayColor}, 0.65))` }} />
    </div>
  )
}
