import {
  BRAND_NAVY,
  LOGOMARK_ACCENT,
  LOGOMARK_MAIN,
  LOGOMARK_VIEWBOX,
} from "@/lib/brand/logo-paths"

type HtmlLogomarkProps = {
  brandColor: string
  width?: number
  mainColor?: string
  className?: string
}

export function HtmlLogomark({
  brandColor,
  width = 28,
  mainColor = BRAND_NAVY,
  className,
}: HtmlLogomarkProps) {
  const height = width * (208 / 278)

  return (
    <svg
      viewBox={LOGOMARK_VIEWBOX}
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
    >
      <path d={LOGOMARK_MAIN} fill={mainColor} />
      <path d={LOGOMARK_ACCENT} fill={brandColor} />
    </svg>
  )
}
