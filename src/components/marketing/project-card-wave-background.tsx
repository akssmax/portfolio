import { Suspense, lazy, useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { useCanAnimate } from "@/hooks/use-can-animate"

const ShapeWaves = lazy(() => import("./ShapeWaves"))

type WavePalette = {
  background: string
  wave: string
  hover: string
  accent: string
}

const lightPalettes: Record<string, WavePalette> = {
  "ion-workspace": {
    background: "#f9faf4",
    wave: "#d7dec2",
    hover: "#a7bf35",
    accent: "rgba(164, 194, 52, 0.18)",
  },
  "indus-best-mega-food-park": {
    background: "#f6f9f2",
    wave: "#b7d0af",
    hover: "#78af45",
    accent: "rgba(89, 139, 76, 0.17)",
  },
  postforge: {
    background: "#fff9f3",
    wave: "#eacbbb",
    hover: "#ef806a",
    accent: "rgba(241, 151, 117, 0.18)",
  },
  rupeelens: {
    background: "#f4fcfb",
    wave: "#abd9d0",
    hover: "#39b49a",
    accent: "rgba(65, 184, 151, 0.17)",
  },
  "100x-landing-page": {
    background: "#fbf8ff",
    wave: "#cbbcdf",
    hover: "#a579ce",
    accent: "rgba(161, 118, 204, 0.17)",
  },
  "resume-builder": {
    background: "#f5fcf8",
    wave: "#b5d9c7",
    hover: "#53b489",
    accent: "rgba(81, 178, 133, 0.16)",
  },
}

const defaultLightPalette: WavePalette = {
  background: "#f8faf9",
  wave: "#bed4c9",
  hover: "#65ae8c",
  accent: "rgba(100, 174, 140, 0.16)",
}

const darkPalette: WavePalette = {
  background: "#111c19",
  wave: "#35574d",
  hover: "#67c6a0",
  accent: "rgba(70, 156, 114, 0.16)",
}

const indusHeroPalette: WavePalette = {
  background: "#173c2c",
  wave: "#65946d",
  hover: "#dbf4aa",
  accent: "rgba(172, 220, 139, 0.16)",
}

/** Same ShapeWaves treatment as the large case-study visuals, sized for a compact card. */
export function ProjectCardWaveBackground({ slug, variant = "card" }: { slug: string; variant?: "card" | "hero" }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [nearViewport, setNearViewport] = useState(false)
  const canAnimate = useCanAnimate()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const palette = variant === "hero"
    ? indusHeroPalette
    : isDark ? darkPalette : lightPalettes[slug] ?? defaultLightPalette

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const observer = new IntersectionObserver(
      ([entry]) => setNearViewport(entry.isIntersecting),
      { rootMargin: "120px" },
    )
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={rootRef} className="pointer-events-none absolute inset-0 overflow-hidden" style={{ backgroundColor: palette.background }} aria-hidden>
      {variant === "hero" ? (
        <div
          className="absolute inset-0"
          style={{ backgroundImage: `radial-gradient(circle at 78% 38%, ${palette.accent}, transparent 58%)` }}
        />
      ) : (
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, ${palette.accent}, transparent 60%), radial-gradient(${palette.wave} 0.5px, transparent 0.5px)`,
            backgroundSize: "100% 100%, 16px 16px",
          }}
        />
      )}
      {nearViewport && canAnimate ? (
        <div className={variant === "hero" ? "absolute inset-0 opacity-50" : "absolute inset-0 opacity-75"}>
          <Suspense fallback={null}>
            <ShapeWaves
              shapes="mixed"
              cellSize={13}
              dotSize={0.66}
              color={palette.wave}
              hoverColor={palette.hover}
              backgroundColor={palette.background}
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
          </Suspense>
        </div>
      ) : null}
      <div className={variant === "hero"
        ? "absolute inset-0 bg-[linear-gradient(90deg,rgba(23,60,44,0.72),rgba(23,60,44,0.32)_70%,rgba(23,60,44,0.08))]"
        : "absolute inset-0 bg-[radial-gradient(ellipse_44%_70%_at_50%_50%,rgba(255,255,255,0.96)_0%,rgba(255,255,255,0.8)_36%,rgba(255,255,255,0)_100%)] dark:bg-[radial-gradient(ellipse_44%_70%_at_50%_50%,rgba(17,28,25,0.9)_0%,rgba(17,28,25,0.65)_36%,rgba(17,28,25,0)_100%)]"} />
      <div className="absolute inset-x-0 top-0 h-px bg-white/90 dark:bg-white/10" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-black/[0.04] dark:bg-white/5" />
    </div>
  )
}
