import { Suspense, lazy, useEffect, useRef, useState } from "react"
import { useCanAnimate } from "@/hooks/use-can-animate"
import { useDocumentColorMode } from "@/hooks/use-document-color-mode"

const ShapeWaves = lazy(() => import("./ShapeWaves"))

type WavePalette = {
  background: string
  wave: string
  hover: string
  accent: string
}

const lightPalettes: Record<string, WavePalette | undefined> = {
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

const darkPalettes: Record<string, WavePalette | undefined> = {
  "ion-workspace": {
    background: "#151a11",
    wave: "#60783c",
    hover: "#c6f33d",
    accent: "rgba(167, 191, 53, 0.2)",
  },
  "indus-best-mega-food-park": {
    background: "#111b14",
    wave: "#52834b",
    hover: "#a9d96c",
    accent: "rgba(120, 175, 69, 0.2)",
  },
  postforge: {
    background: "#211411",
    wave: "#905347",
    hover: "#ff9e86",
    accent: "rgba(239, 128, 106, 0.2)",
  },
  rupeelens: {
    background: "#101d1d",
    wave: "#347b70",
    hover: "#7ae2ca",
    accent: "rgba(57, 180, 154, 0.2)",
  },
  "100x-landing-page": {
    background: "#1a1422",
    wave: "#75528c",
    hover: "#d9adff",
    accent: "rgba(165, 121, 206, 0.2)",
  },
  "resume-builder": {
    background: "#101a14",
    wave: "#3d846b",
    hover: "#8be0b7",
    accent: "rgba(83, 180, 137, 0.2)",
  },
}

const defaultDarkPalette: WavePalette = {
  background: "#141817",
  wave: "#477463",
  hover: "#9ed7c1",
  accent: "rgba(101, 174, 140, 0.18)",
}

const heroPalettes: Record<string, WavePalette | undefined> = {
  kodo: {
    background: "#faf5fa",
    wave: "#cab9cd",
    hover: "#df78ac",
    accent: "rgba(219, 118, 169, 0.2)",
  },
  unlogged: {
    background: "#f4f8fd",
    wave: "#a9c2df",
    hover: "#6ea0d8",
    accent: "rgba(110, 160, 216, 0.16)",
  },
  tulr: {
    background: "#fdf6ef",
    wave: "#e0b48c",
    hover: "#f0a06a",
    accent: "rgba(240, 160, 106, 0.16)",
  },
  "ion-workspace": {
    background: "#191d16",
    wave: "#59664a",
    hover: "#d6ff3d",
    accent: "rgba(214, 255, 61, 0.14)",
  },
  "indus-best-mega-food-park": {
    background: "#173c2c",
    wave: "#65946d",
    hover: "#dbf4aa",
    accent: "rgba(172, 220, 139, 0.16)",
  },
  postforge: {
    background: "#622d28",
    wave: "#a86e59",
    hover: "#ffdd55",
    accent: "rgba(255, 221, 85, 0.16)",
  },
  rupeelens: {
    background: "#103c3e",
    wave: "#498d88",
    hover: "#a3f0d3",
    accent: "rgba(163, 240, 211, 0.15)",
  },
  "100x-landing-page": {
    background: "#30254e",
    wave: "#77649b",
    hover: "#ffc5df",
    accent: "rgba(255, 197, 223, 0.16)",
  },
  "100x-chat-shell": {
    background: "#1b3d69",
    wave: "#6486aa",
    hover: "#c6e0ff",
    accent: "rgba(198, 224, 255, 0.16)",
  },
  "resume-builder": {
    background: "#254b42",
    wave: "#649784",
    hover: "#d7f4d3",
    accent: "rgba(215, 244, 211, 0.15)",
  },
  "v1-100x-proto": {
    background: "#3a294a",
    wave: "#836a91",
    hover: "#ffd2aa",
    accent: "rgba(255, 210, 170, 0.16)",
  },
}

const defaultHeroPalette: WavePalette = {
  background: "#263e63",
  wave: "#627d9f",
  hover: "#d8e8ff",
  accent: "rgba(216, 232, 255, 0.15)",
}

/** Optional dark-mode override for hero variants that use a light palette. */
const darkHeroPalettes: Record<string, WavePalette | undefined> = {
  kodo: {
    background: "#111113",
    wave: "#4a4650",
    hover: "#ffffff",
    accent: "rgba(255, 255, 255, 0.12)",
  },
  unlogged: {
    background: "#171c24",
    wave: "#4a5f78",
    hover: "#82aede",
    accent: "rgba(130, 174, 222, 0.18)",
  },
  tulr: {
    background: "#211a15",
    wave: "#6b5038",
    hover: "#e0a878",
    accent: "rgba(224, 168, 120, 0.18)",
  },
}

/** Same ShapeWaves treatment as the large case-study visuals, sized for a compact card. */
export function ProjectCardWaveBackground({
  slug,
  variant = "card",
}: {
  slug: string
  variant?: "card" | "hero"
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [nearViewport, setNearViewport] = useState(false)
  const canAnimate = useCanAnimate()
  const colorMode = useDocumentColorMode()
  const isDark = colorMode === "dark"
  const palette =
    variant === "hero"
      ? isDark
        ? (darkHeroPalettes[slug] ?? heroPalettes[slug] ?? defaultHeroPalette)
        : (heroPalettes[slug] ?? defaultHeroPalette)
      : isDark
        ? (darkPalettes[slug] ?? defaultDarkPalette)
        : (lightPalettes[slug] ?? defaultLightPalette)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const observer = new IntersectionObserver(
      ([entry]) => setNearViewport(entry.isIntersecting),
      { rootMargin: "120px" }
    )
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={rootRef}
      className="pointer-events-none absolute inset-0 overflow-hidden bg-[#f8faf9] dark:bg-[#141817]"
      style={colorMode ? { backgroundColor: palette.background } : undefined}
      aria-hidden
    >
      {colorMode && variant === "hero" ? (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 78% 38%, ${palette.accent}, transparent 58%)`,
          }}
        />
      ) : colorMode ? (
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, ${palette.accent}, transparent 60%), radial-gradient(${palette.wave} 0.5px, transparent 0.5px)`,
            backgroundSize: "100% 100%, 16px 16px",
          }}
        />
      ) : null}
      {nearViewport && canAnimate && colorMode ? (
        <div
          className={
            variant === "hero"
              ? "absolute inset-0 opacity-50"
              : "absolute inset-0 opacity-75"
          }
        >
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
      <div
        className={
          variant === "hero"
            ? "absolute inset-0"
            : "absolute inset-0 bg-[radial-gradient(ellipse_44%_70%_at_50%_50%,rgba(255,255,255,0.96)_0%,rgba(255,255,255,0.8)_36%,rgba(255,255,255,0)_100%)] dark:bg-[radial-gradient(ellipse_44%_70%_at_50%_50%,rgba(18,19,21,0.9)_0%,rgba(18,19,21,0.65)_36%,rgba(18,19,21,0)_100%)]"
        }
        style={
          variant === "hero"
            ? {
                backgroundImage: `linear-gradient(90deg, ${palette.background}d9, ${palette.background}80 70%, ${palette.background}26)`,
              }
            : undefined
        }
      />
      <div className="absolute inset-x-0 top-0 h-px bg-white/90 dark:bg-white/10" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-black/[0.04] dark:bg-white/5" />
    </div>
  )
}
