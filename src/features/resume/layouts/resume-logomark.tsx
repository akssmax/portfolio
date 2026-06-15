import { Image } from "@react-pdf/renderer"

import {
  BRAND_NAVY,
  LOGOMARK_ACCENT,
  LOGOMARK_MAIN,
  LOGOMARK_VIEWBOX,
} from "@/lib/brand/logo-paths"

type ResumeLogomarkProps = {
  brandColor: string
  width?: number
  mainColor?: string
}

function buildLogomarkSrc(brandColor: string, mainColor: string) {
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${LOGOMARK_VIEWBOX}">`,
    `<path d="${LOGOMARK_MAIN}" fill="${mainColor}"/>`,
    `<path d="${LOGOMARK_ACCENT}" fill="${brandColor}"/>`,
    `</svg>`,
  ].join("")

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export function ResumeLogomark({
  brandColor,
  width = 28,
  mainColor = BRAND_NAVY,
}: ResumeLogomarkProps) {
  const height = width * (208 / 278)

  return (
    <Image
      src={buildLogomarkSrc(brandColor, mainColor)}
      style={{ width, height }}
    />
  )
}
