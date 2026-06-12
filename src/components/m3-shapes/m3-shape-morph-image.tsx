"use client"

import { useId } from "react"

import { M3_SHAPE_VIEWBOX } from "@/lib/m3-shape-paths"
import { cn } from "@/lib/utils"

type M3ShapeMorphImageProps = {
  pathD: string
  src: string
  nextSrc?: string | null
  imageMix?: number
  alt: string
  className?: string
}

/** Portrait clipped to a morphing M3 SVG path. */
export function M3ShapeMorphImage({
  pathD,
  src,
  nextSrc,
  imageMix = 0,
  alt,
  className,
}: M3ShapeMorphImageProps) {
  const clipId = useId().replace(/:/g, "")

  return (
    <svg
      viewBox={`0 0 ${M3_SHAPE_VIEWBOX} ${M3_SHAPE_VIEWBOX}`}
      className={cn("block shrink-0 bg-transparent", className)}
      preserveAspectRatio="none"
      role="img"
      aria-label={alt}
    >
      <defs>
        <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
          <path d={pathD} />
        </clipPath>
      </defs>
      <image
        href={src}
        width={M3_SHAPE_VIEWBOX}
        height={M3_SHAPE_VIEWBOX}
        preserveAspectRatio="xMidYMid slice"
        clipPath={`url(#${clipId})`}
        opacity={1 - imageMix}
      />
      {nextSrc ? (
        <image
          href={nextSrc}
          width={M3_SHAPE_VIEWBOX}
          height={M3_SHAPE_VIEWBOX}
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#${clipId})`}
          opacity={imageMix}
        />
      ) : null}
    </svg>
  )
}
