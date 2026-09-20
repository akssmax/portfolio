import { useState } from "react"

import { HeroShapeWavesBackground } from "@/components/landing/hero-shape-waves-background"
import { MONOGRAM_ACCENT, MONOGRAM_MAIN } from "@/lib/brand/monogram-mark"

/** A full-width ShapeWaves footer where particles gather into the brand monogram on hover. */
export function FooterMonogramWaves() {
  const [isFormed, setIsFormed] = useState(false)

  return (
    <div
      className="relative h-52 overflow-hidden bg-background sm:h-72"
      aria-hidden="true"
      onPointerEnter={() => setIsFormed(true)}
      onPointerLeave={() => setIsFormed(false)}
    >
      <HeroShapeWavesBackground formation={{ paths: [MONOGRAM_MAIN, MONOGRAM_ACCENT], value: isFormed ? 1 : 0 }} />
    </div>
  )
}
