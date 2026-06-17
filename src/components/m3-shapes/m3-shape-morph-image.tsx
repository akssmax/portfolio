"use client"

import { useId } from "react"

import {
  getM3PortraitImageTransform,
  M3_SHAPE_VIEWBOX,
} from "@/lib/m3-shape-paths"
import { cn } from "@/lib/utils"

type M3ShapeMorphImageProps = {
  pathD: string
  src: string
  nextSrc?: string | null
  imageMix?: number
  alt: string
  className?: string
  priority?: boolean
}

function PortraitImage({
  src,
  opacity,
  priority,
}: {
  src: string
  opacity: number
  priority?: boolean
}) {
  return (
    <g transform={getM3PortraitImageTransform()}>
      <image
        href={src}
        width={M3_SHAPE_VIEWBOX}
        height={M3_SHAPE_VIEWBOX}
        preserveAspectRatio="xMidYMid meet"
        opacity={opacity}
        {...(priority ? { "data-fetchpriority": "high" } : {})}
      />
    </g>
  )
}

/** Portrait clipped to a morphing M3 SVG path. */
export function M3ShapeMorphImage({
  pathD,
  src,
  nextSrc,
  imageMix = 0,
  alt,
  className,
  priority = false,
}: M3ShapeMorphImageProps) {
  const clipId = useId().replace(/:/g, "")

  return (
    <svg
      viewBox={`0 0 ${M3_SHAPE_VIEWBOX} ${M3_SHAPE_VIEWBOX}`}
      className={cn("block shrink-0 text-primary", className)}
      preserveAspectRatio="none"
      role="img"
      aria-label={alt}
    >
      <defs>
        <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
          <path d={pathD} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <path d={pathD} fill="currentColor" />
        <PortraitImage src={src} opacity={1 - imageMix} priority={priority} />
        {nextSrc ? (
          <PortraitImage src={nextSrc} opacity={imageMix} />
        ) : null}
      </g>
    </svg>
  )
}
