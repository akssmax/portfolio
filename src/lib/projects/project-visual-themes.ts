import type { LucideIcon } from "lucide-react"
import { Cpu, FileUser, IndianRupee, Layout, Sparkles, Terminal } from "lucide-react"

import type {
  MonogramPatternTone,
  MonogramPatternVariant,
} from "@/components/brand/monogram-patterns"

export type ProjectVisualTheme = {
  Icon: LucideIcon
  gradientLight: string
  gradientDark: string
  iconColor: string
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
  borderColor: "border-primary/20",
  glowColor: "shadow-primary/10 dark:shadow-primary/5",
  patternVariant: "dots",
  patternTone: "muted",
}

export const PROJECT_VISUAL_THEMES: Record<string, ProjectVisualTheme> = {
  rupeelens: {
    Icon: IndianRupee,
    gradientLight:
      "from-[#B2F5EA]/45 via-[#99F6E4]/25 to-[#A7D8FF]/20",
    gradientDark:
      "from-[#0F766E]/25 via-[#14B8A6]/12 to-[#021018]/40",
    iconColor: "text-primary",
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
    borderColor: "border-accent/20",
    glowColor: "shadow-accent/10 dark:shadow-accent/5",
    patternVariant: "grid",
    patternTone: "accent",
  },
}

export function getProjectVisualTheme(slug: string): ProjectVisualTheme {
  return PROJECT_VISUAL_THEMES[slug] ?? DEFAULT_THEME
}
