import type { MilestoneEra } from "@/lib/brand/runner-milestones"
import { buildJourneyTimeline } from "@/lib/intro/journey-timeline"
import type { DeckExperienceItem } from "@/lib/intro/types"
import { profile } from "@/lib/profile"

import type { JourneyChapterStop, JourneyRoleStop } from "./types"

const JOURNEY_START = "2014"

const ROLE_PROJECT_SLUG: Record<string, string | undefined> = {
  "100x.bot": "100x-chat-shell",
  Kodo: "kodo",
  Unlogged: "unlogged",
  Tulr: "tulr",
}

const ROLE_ERA: Record<string, MilestoneEra> = {
  Wallzy: "boot",
  tenxresults: "boot",
  Freelance: "design",
  Tulr: "design",
  Unlogged: "design",
  Kodo: "ship",
  "100x.bot": "ship",
}

const ROLE_EYEBROW: Record<string, string> = {
  tenxresults: "2019 · First design internship",
  Wallzy: "College project",
}

const ROLE_OVERRIDES: Record<
  string,
  Partial<Pick<DeckExperienceItem, "description" | "highlights">>
> = {
  Wallzy: {
    description:
      "Built Wallzy in college with a friend — an Android wallpaper app where I designed custom wallpapers and in-app editing tools. 100K+ installs on Google Play.",
    highlights: [
      "Designed wallpapers and in-app editing tools",
      "Co-founded and shipped while still in college",
      "User analytics in Fabric (acquired by Firebase)",
      "Branding and visual identity",
      "100K+ installs on Google Play",
    ],
  },
  tenxresults: {
    description:
      "First design internship — brand and marketing design for a results-driven marketing agency in Gurgaon.",
    highlights: [
      "First professional design internship",
      "Branding and print media",
      "Social media ads and post design",
      "WordPress development",
      "Video editing",
    ],
  },
}

export const JOURNEY_CHAPTERS: Omit<JourneyChapterStop, "kind">[] = [
  {
    id: "college-2014",
    sortYear: 2014,
    era: "boot",
    year: "2014",
    eyebrow: "College · Year one",
    title: "B.Tech & first creative tools",
    description: `Started ${profile.education.degree} at ${profile.education.school}. In my first year I picked up After Effects, Premiere Pro, and Adobe Illustrator — motion, video, and vector work before product design was even on the radar.`,
  },
]

function slugifyCompany(company: string): string {
  return company
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

function getRoleSortYear(item: DeckExperienceItem): number {
  const year = Number.parseInt(item.startYear ?? JOURNEY_START, 10)
  return Number.isFinite(year) ? year : 2014
}

function applyRoleOverrides(item: DeckExperienceItem): DeckExperienceItem {
  const overrides = ROLE_OVERRIDES[item.company]
  if (!overrides) return item

  return {
    ...item,
    description: overrides.description ?? item.description,
    highlights: overrides.highlights ?? item.highlights,
  }
}

export function buildJourneyChapters(): JourneyChapterStop[] {
  return JOURNEY_CHAPTERS.map((chapter) => ({
    kind: "chapter" as const,
    ...chapter,
  }))
}

export function buildJourneyRoles(): JourneyRoleStop[] {
  const { items } = buildJourneyTimeline()

  return items.map((item) => {
    const enriched = applyRoleOverrides(item)

    return {
      kind: "role" as const,
      id: slugifyCompany(enriched.company),
      sortYear: getRoleSortYear(enriched),
      era: ROLE_ERA[enriched.company] ?? "design",
      item: enriched,
      projectSlug: ROLE_PROJECT_SLUG[enriched.company],
      eyebrow: ROLE_EYEBROW[enriched.company],
    }
  })
}

export function getJourneyMeta() {
  return {
    heading: "From college tools to agentic AI",
    subtitle:
      "A scroll through design — from After Effects in a dorm room to design systems, YC startups, and agentic AI at 100x.bot.",
    journeyStart: JOURNEY_START,
  }
}
