import type { LucideIcon } from "lucide-react"
import {
  Brain,
  Camera,
  Clapperboard,
  Disc3,
  Film,
  Gamepad2,
  GitBranch,
  HeartHandshake,
  Layers,
  Music,
  Smartphone,
  Sofa,
  Sparkles,
  Users,
  Video,
} from "lucide-react"

const INTEREST_ICONS: Record<string, LucideIcon> = {
  Gaming: Gamepad2,
  "AI Tools": Sparkles,
  "Open Source Tools": GitBranch,
  Android: Smartphone,
  Photography: Camera,
  "Motion Graphics": Clapperboard,
  "UI Animation": Layers,
  "Music Theory": Music,
  DJing: Disc3,
  Movies: Film,
  Mentoring: Users,
  "Human Psychology": Brain,
  "Interior Design": Sofa,
  "Ethical UX": HeartHandshake,
  Cinematography: Video,
}

export function getInterestIcon(interest: string): LucideIcon {
  return INTEREST_ICONS[interest] ?? Sparkles
}
