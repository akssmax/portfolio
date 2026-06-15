import { Path, Svg } from "@react-pdf/renderer"

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

export function ResumeLogomark({
  brandColor,
  width = 28,
  mainColor = BRAND_NAVY,
}: ResumeLogomarkProps) {
  const height = width * (208 / 278)

  return (
    <Svg viewBox={LOGOMARK_VIEWBOX} width={width} height={height}>
      <Path d={LOGOMARK_MAIN} fill={mainColor} />
      <Path d={LOGOMARK_ACCENT} fill={brandColor} />
    </Svg>
  )
}
