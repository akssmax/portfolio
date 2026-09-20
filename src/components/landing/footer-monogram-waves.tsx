import { useEffect, useRef, useState } from "react"

import { HeroShapeWavesBackground } from "@/components/landing/hero-shape-waves-background"
import { MONOGRAM_ACCENT, MONOGRAM_MAIN } from "@/lib/brand/monogram-mark"

const CAT_PATH = "M-29 145C-42 113-35 72-8 48L-18 4 19 27C34 20 51 20 67 27L104 4 94 48C121 72 128 113 115 145H-29ZM20 83A8 8 0 1 0 20 99 8 8 0 0 0 20 83ZM72 83A8 8 0 1 0 72 99 8 8 0 0 0 72 83ZM32 118C43 125 58 125 69 118"
const PRIDE_FLAG_PATHS = [
  "M-60 8H-51V145H-60Z",
  "M-51 25C-5 7 45 8 103 28V121C45 101-5 102-51 128Z",
]
const MUSIC_PATHS = [
  "M-12 26H91V39H2V100C2 121-17 134-37 128-58 122-61 97-43 86-27 76-12 84-12 101V26Z",
  "M76 39H91V106C91 127 72 139 52 133 31 127 28 102 46 91 61 81 76 89 76 106V39Z",
]
const DJ_PATHS = [
  "M-51 93C-51 45-17 15 41 15S133 45 133 93H116C116 57 90 34 41 34S-34 57-34 93H-51Z",
  "M-48 82H-20V127H-48Z",
  "M102 82H130V127H102Z",
  "M-10 79H92V145H-10ZM41 92A21 21 0 1 0 41 134 21 21 0 0 0 41 92Z",
]
const GAME_PATHS = [
  "M-53 101C-47 67-17 55 13 71H69C99 55 129 67 135 101L144 134C148 151 127 160 114 146L96 126H-14L-32 146C-45 160-66 151-62 134L-53 101Z",
  "M-18 91H-7V102H4V113H-7V124H-18V113H-29V102H-18V91Z",
  "M86 98A8 8 0 1 0 86 114 8 8 0 0 0 86 98ZM109 112A8 8 0 1 0 109 128 8 8 0 0 0 109 112Z",
]

const FORMATIONS = [
  [MONOGRAM_MAIN, MONOGRAM_ACCENT],
  [CAT_PATH],
  PRIDE_FLAG_PATHS,
  MUSIC_PATHS,
  DJ_PATHS,
  GAME_PATHS,
]

/** A full-width ShapeWaves footer where particles gather into the brand monogram on hover. */
export function FooterMonogramWaves() {
  const [isHovered, setIsHovered] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [formationIndex, setFormationIndex] = useState(0)
  const transitionTimerRef = useRef<number | null>(null)

  useEffect(() => () => {
    if (transitionTimerRef.current) window.clearTimeout(transitionTimerRef.current)
  }, [])

  const handlePointerLeave = () => {
    if (transitionTimerRef.current) window.clearTimeout(transitionTimerRef.current)
    transitionTimerRef.current = null
    setIsHovered(false)
    setIsTransitioning(false)
    setFormationIndex(0)
  }

  const advanceFormation = () => {
    if (!isHovered || isTransitioning) return

    setIsTransitioning(true)
    transitionTimerRef.current = window.setTimeout(() => {
      setFormationIndex((index) => (index + 1) % FORMATIONS.length)
      setIsTransitioning(false)
      transitionTimerRef.current = null
    }, 280)
  }

  return (
    <div
      className="relative h-52 overflow-hidden bg-white dark:bg-black sm:h-72"
      aria-hidden="true"
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={handlePointerLeave}
      onClick={advanceFormation}
    >
      <HeroShapeWavesBackground
        surface="footer"
        formation={{
          paths: FORMATIONS[formationIndex],
          value: isHovered && !isTransitioning ? 1 : 0,
        }}
      />
    </div>
  )
}
