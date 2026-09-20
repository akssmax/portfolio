import { Cpu, FileUser, IndianRupee, Layout, Palette, Sparkles, Terminal } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import type {
  MonogramPatternTone,
  MonogramPatternVariant,
} from "@/components/brand/monogram-patterns"

export type ProjectVisualTheme = {
  Icon: LucideIcon
  iconSrc?: string
  iconInverseSrc?: string
  gradientLight: string
  gradientDark: string
  iconColor: string
  iconHoverBackground: string
  borderColor: string
  glowColor: string
  patternVariant: MonogramPatternVariant
  patternTone: MonogramPatternTone
}

const DEFAULT_THEME: ProjectVisualTheme = {
  Icon: Sparkles,
  gradientLight:
    "from-primary/20 via-primary/8 to-background",
  gradientDark:
    "from-primary/25 via-primary/10 to-background",
  iconColor: "text-primary",
  iconHoverBackground: "#0b7657",
  borderColor: "border-primary/20",
  glowColor: "shadow-primary/10 dark:shadow-primary/5",
  patternVariant: "dots",
  patternTone: "muted",
}

export const PROJECT_VISUAL_THEMES: Record<string, ProjectVisualTheme> = {
  "ion-workspace": {
    Icon: Sparkles,
    iconSrc: "/projects/ion/mark.svg",
    iconInverseSrc: "/projects/ion/mark-inverse.svg",
    gradientLight: "from-[#e9edda]/70 via-[#f5f7e9]/45 to-[#fafbf4]/55",
    gradientDark: "from-[#222717]/65 via-[#768d2b]/20 to-[#10120d]/60",
    iconColor: "text-[#111111]",
    iconHoverBackground: "#111111",
    borderColor: "border-[#111111]/15",
    glowColor: "shadow-[#111111]/10 dark:shadow-[#d6ff3d]/10",
    patternVariant: "grid",
    patternTone: "muted",
  },
  "indus-best-mega-food-park": {
    Icon: Sparkles,
    iconSrc: "/projects/indus/mark.svg",
    iconInverseSrc: "/projects/indus/mark-inverse.svg",
    gradientLight: "from-[#e6efdb]/65 via-[#d6e8d9]/40 to-[#f8f6e8]/45",
    gradientDark: "from-[#164b35]/45 via-[#78af45]/15 to-[#102d23]/50",
    iconColor: "text-[#164b35]",
    iconHoverBackground: "#164b35",
    borderColor: "border-[#164b35]/20",
    glowColor: "shadow-[#164b35]/10 dark:shadow-[#164b35]/10",
    patternVariant: "grid",
    patternTone: "primary",
  },
  postforge: {
    Icon: Palette,
    gradientLight:
      "from-[#FFD400]/35 via-[#FA3D1D]/20 to-[#FFC0FD]/25",
    gradientDark:
      "from-[#FA3D1D]/22 via-[#FD02F5]/14 to-[#340B05]/35",
    iconColor: "text-accent-foreground",
    iconHoverBackground: "#b93623",
    borderColor: "border-accent/20",
    glowColor: "shadow-accent/10 dark:shadow-accent/5",
    patternVariant: "concentric",
    patternTone: "accent",
  },
  rupeelens: {
    Icon: IndianRupee,
    gradientLight:
      "from-[#B2F5EA]/45 via-[#99F6E4]/25 to-[#A7D8FF]/20",
    gradientDark:
      "from-[#0F766E]/25 via-[#14B8A6]/12 to-[#021018]/40",
    iconColor: "text-primary",
    iconHoverBackground: "#087b65",
    borderColor: "border-primary/20",
    glowColor: "shadow-primary/10 dark:shadow-primary/5",
    patternVariant: "grid",
    patternTone: "primary",
  },
  "100x-landing-page": {
    Icon: Layout,
    gradientLight:
      "from-[#FFB4D0]/40 via-[#C9A8FF]/25 to-[#FFF3B0]/20",
    gradientDark:
      "from-[#FD02F5]/20 via-[#0358F7]/15 to-[#340B05]/30",
    iconColor: "text-secondary-foreground",
    iconHoverBackground: "#6544a7",
    borderColor: "border-secondary/20",
    glowColor: "shadow-secondary/10 dark:shadow-secondary/5",
    patternVariant: "offset",
    patternTone: "accent",
  },
  "100x-chat-shell": {
    Icon: Terminal,
    gradientLight:
      "from-[#A7D8FF]/45 via-[#C9A8FF]/30 to-[#FF7AB6]/20",
    gradientDark:
      "from-[#0358F7]/25 via-[#5092C7]/15 to-[#021018]/40",
    iconColor: "text-primary",
    iconHoverBackground: "#315eae",
    borderColor: "border-primary/20",
    glowColor: "shadow-primary/10 dark:shadow-primary/5",
    patternVariant: "diagonal",
    patternTone: "primary",
  },
  "resume-builder": {
    Icon: FileUser,
    gradientLight:
      "from-[#B2F5EA]/40 via-[#A7D8FF]/25 to-[#FFF3B0]/15",
    gradientDark:
      "from-[#0B6E4F]/20 via-[#1FD18E]/10 to-[#021018]/35",
    iconColor: "text-primary",
    iconHoverBackground: "#087b65",
    borderColor: "border-primary/20",
    glowColor: "shadow-primary/10 dark:shadow-primary/5",
    patternVariant: "grid",
    patternTone: "primary",
  },
  "v1-100x-proto": {
    Icon: Cpu,
    gradientLight:
      "from-[#FFD400]/35 via-[#FA3D1D]/20 to-[#FFC0FD]/25",
    gradientDark:
      "from-[#FA3D1D]/20 via-[#FD02F5]/15 to-[#340B05]/35",
    iconColor: "text-accent-foreground",
    iconHoverBackground: "#a43b27",
    borderColor: "border-accent/20",
    glowColor: "shadow-accent/10 dark:shadow-accent/5",
    patternVariant: "concentric",
    patternTone: "accent",
  },
  kodo: {
    Icon: Sparkles,
    gradientLight:
      "from-[#FF7AB6]/35 via-[#FFA1D2]/20 to-[#C9A8FF]/25",
    gradientDark:
      "from-[#FD02F5]/18 via-[#0358F7]/12 to-[#340B05]/30",
    iconColor: "text-primary",
    iconHoverBackground: "#a74c7d",
    borderColor: "border-primary/20",
    glowColor: "shadow-primary/10 dark:shadow-primary/5",
    patternVariant: "dots",
    patternTone: "primary",
  },
  unlogged: {
    Icon: Sparkles,
    gradientLight:
      "from-[#A7D8FF]/40 via-[#C9A8FF]/25 to-[#FFF3B0]/15",
    gradientDark:
      "from-[#0358F7]/20 via-[#5092C7]/12 to-[#021018]/35",
    iconColor: "text-primary",
    iconHoverBackground: "#3974aa",
    borderColor: "border-primary/20",
    glowColor: "shadow-primary/10 dark:shadow-primary/5",
    patternVariant: "offset",
    patternTone: "muted",
  },
  tulr: {
    Icon: Sparkles,
    gradientLight:
      "from-[#FFD400]/30 via-[#FA3D1D]/15 to-[#FFC0FD]/20",
    gradientDark:
      "from-[#FA3D1D]/18 via-[#FD02F5]/12 to-[#340B05]/30",
    iconColor: "text-accent-foreground",
    iconHoverBackground: "#a43b27",
    borderColor: "border-accent/20",
    glowColor: "shadow-accent/10 dark:shadow-accent/5",
    patternVariant: "grid",
    patternTone: "accent",
  },
}

export function getProjectVisualTheme(slug: string): ProjectVisualTheme {
  return PROJECT_VISUAL_THEMES[slug] ?? DEFAULT_THEME
}
