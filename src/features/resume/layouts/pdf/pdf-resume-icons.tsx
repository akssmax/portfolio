import { Path, Svg } from "@react-pdf/renderer"

import type { ResumeIconName } from "../../resume-display-preferences"

type PdfResumeIconProps = {
  name: ResumeIconName
  color?: string
  size?: number
}

/** Simplified Lucide-style paths for PDF export. */
export function PdfResumeIcon({
  name,
  color = "#525252",
  size = 8,
}: PdfResumeIconProps) {
  const common = { width: size, height: size, viewBox: "0 0 24 24" as const }

  switch (name) {
    case "mail":
      return (
        <Svg {...common}>
          <Path
            d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6"
            stroke={color}
            strokeWidth={2}
            fill="none"
          />
        </Svg>
      )
    case "phone":
      return (
        <Svg {...common}>
          <Path
            d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
            stroke={color}
            strokeWidth={2}
            fill="none"
          />
        </Svg>
      )
    case "globe":
      return (
        <Svg {...common}>
          <Path
            d="M12 22a10 10 0 100-20 10 10 0 000 20z M2 12h20 M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"
            stroke={color}
            strokeWidth={2}
            fill="none"
          />
        </Svg>
      )
    case "linkedin":
      return (
        <Svg {...common}>
          <Path
            d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-13h4v2 M2 9h4v13H2z M4 6a2 2 0 100-4 2 2 0 000 4z"
            stroke={color}
            strokeWidth={2}
            fill="none"
          />
        </Svg>
      )
    case "github":
      return (
        <Svg {...common}>
          <Path
            d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"
            stroke={color}
            strokeWidth={2}
            fill="none"
          />
        </Svg>
      )
    case "briefcase":
      return (
        <Svg {...common}>
          <Path
            d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"
            stroke={color}
            strokeWidth={2}
            fill="none"
          />
        </Svg>
      )
    case "graduation-cap":
      return (
        <Svg {...common}>
          <Path
            d="M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c0 2 4 3 6 3s6-1 6-3v-5"
            stroke={color}
            strokeWidth={2}
            fill="none"
          />
        </Svg>
      )
    default:
      return (
        <Svg {...common}>
          <Path
            d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6"
            stroke={color}
            strokeWidth={2}
            fill="none"
          />
        </Svg>
      )
  }
}
