import { Path, Svg } from "@react-pdf/renderer"

import {
  BRAND_NAVY,
  LOGOMARK_ACCENT,
  LOGOMARK_MAIN,
  LOGOMARK_VIEWBOX,
} from "@/lib/brand/logo-paths"

type QuotePdfLogomarkProps = {
  brandColor: string
  width?: number
  mainColor?: string
}

export function QuotePdfLogomark({
  brandColor,
  width = 28,
  mainColor = BRAND_NAVY,
}: QuotePdfLogomarkProps) {
  const height = width * (208 / 278)

  return (
    <Svg viewBox={LOGOMARK_VIEWBOX} style={{ width, height }}>
      <Path d={LOGOMARK_MAIN} fill={mainColor} />
      <Path d={LOGOMARK_ACCENT} fill={brandColor} />
    </Svg>
  )
}
