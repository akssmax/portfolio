import type { VisualCaseStudyConfig } from "@/lib/projects/visual-case-study-configs"
import { getExperienceTagLabel } from "@/lib/experience-duration"
import { profile } from "@/lib/profile"
import { getFallbackFeaturedProjects } from "@/lib/sanity/fallback-projects"
import type { Project } from "@/lib/sanity/types"

import type { DeckCaseStudyCard, DeckData } from "./types"
import { buildJourneyTimeline } from "./journey-timeline"

const POSTFORGE_APP = "https://postforge-kohl.vercel.app"

const DECK_CASE_STUDY_SLUGS = ["kodo", "unlogged", "rupeelens", "resume-builder"] as const

function buildOtherCaseStudies(): DeckCaseStudyCard[] {
  const featured = getFallbackFeaturedProjects()

  return DECK_CASE_STUDY_SLUGS.flatMap((slug) => {
    const project = featured.find((item) => item.slug === slug)
    if (!project) return []

    return [
      {
        slug: project.slug,
        title: project.title,
        description: project.description,
        tag: project.tag,
        coverImageUrl: project.coverImageUrl ?? "",
        year: project.year,
        metrics: project.metrics,
        buildBadge: project.buildBadge,
      },
    ]
  })
}

function buildProfileSection(): Pick<DeckData, "aboutMe" | "experience" | "skills"> {
  const toolNames = profile.tools.slice(0, 8).map((tool) => tool.name)

  return {
    aboutMe: {
      name: profile.name,
      title: profile.title,
      tagline: profile.tagline,
      bio: profile.bio,
      role: profile.role,
      company: profile.company,
      location: profile.location,
      experienceLabel: getExperienceTagLabel(),
      portraitSrc: profile.portrait.src,
      email: profile.contact.email,
      education: {
        degree: profile.education.degree,
        school: profile.education.school,
        years: profile.education.years,
      },
    },
    experience: buildJourneyTimeline(),
    skills: {
      design: profile.designSkills,
      engineering: profile.engineeringSkills,
      domains: profile.domainSkills,
      tools: toolNames,
    },
  }
}

export function buildPostforgeDeck(
  project: Project,
  visual: VisualCaseStudyConfig,
): DeckData {
  const editorGallery = visual.galleries[0]
  const editorImage = editorGallery?.images[0]

  return {
    ...buildProfileSection(),
    projectIntro: {
      title: project.title,
      description: project.description,
      tag: project.tag,
      role: project.role ?? "Design Engineer",
      year: project.year ?? "",
      coverImageUrl: project.coverImageUrl ?? visual.heroImageSrc ?? "",
      metrics: project.metrics,
      stats: visual.stats,
      buildBadge: project.buildBadge,
      otherCaseStudies: buildOtherCaseStudies(),
    },
    problem: {
      statement:
        "Marketing and sales teams need on-brand social assets fast — but most tools start from blank templates that ignore brand guidelines.",
      audience: ["Marketing teams", "Sales", "Junior designers"],
      insight: {
        lead:
          "At Swiggy, Airtel, and in client work, I've seen teams ship social assets that quietly break brand guidelines — wrong colors, off-pattern layouts, inconsistent logo usage.",
        painPoints: [
          "Template libraries start from blank frames — brand context is an afterthought, not the default",
          "Marketing needs fast turnaround, but design review loops slow every campaign asset",
          "Junior designers and sales reps export without guardrails — small edits become off-brand posts",
        ],
        closing:
          "Postforge enforces the design system from a single logo upload — before anyone touches a layout.",
      },
    },
    assumptions: {
      heading: "Design hypotheses",
      description: "What I assumed before building — and designed the product around.",
      items: [
        {
          title: "Logo is enough for brand context",
          detail:
            "Uploading a logo can extract palette, backgrounds, and tiled patterns — users shouldn't need a full brand PDF before creating.",
        },
        {
          title: "Exploration beats blank canvas",
          detail:
            "Shuffle through finished compositions is faster than starting from empty frames — especially for junior designers.",
        },
        {
          title: "AI belongs beside the canvas",
          detail:
            "Brief and chat refine copy without replacing visual control — the designer stays in the loop.",
        },
        {
          title: "One editor, two outputs",
          detail:
            "Social posts and slide decks should export from the same brand kit without re-setup.",
        },
        {
          title: "Solo builders are the primary user",
          detail:
            "Founders and small marketing teams need speed over collaboration features in v1.",
        },
      ],
    },
    architecture: {
      heading: "How it's built",
      summary:
        "A Next.js canvas app with a logo-first brand pipeline, layout engine, AI brief layer, and unified export — deployed on Vercel.",
      layers: [
        // {
        //   label: "Surfaces",
        //   items: ["Landing + live hero", "Design tool (/tool)", "Visual library (/visuals)", "Slide decks (/slides)"],
        // },
        {
          label: "Core modules & features",
          items: visual.highlights,
        },
      ],
      flow: [
        "Upload logo → brand kit generated",
        "Pick or shuffle a layout → apply brand",
        "Brief AI in chat → refine copy on canvas",
        "Export PNG or PDF from same session",
      ],
      stack: visual.stack,
      tools: [
        {
          name: "Cursor",
          role: "Building the app — design to React in one loop",
          href: "https://cursor.com/",
          logoSrc: "/tools/cursor.svg",
        },
        {
          name: "Excalidraw",
          role: "Wireframing flows and layout exploration",
          href: "https://excalidraw.com/",
          logoSrc: "/tools/excalidraw.svg",
        },
        {
          name: "ChatGPT / Claude",
          role: "Research, briefs, and product thinking",
          logoSrc: ["/tools/openai.svg", "/tools/anthropic.svg"],
        },
      ],
    },
    liveDemo: {
      heading: "The editor in action",
      description:
        "One canvas for brand kit, layout exploration, AI copy, and export — no tab hopping.",
      features: [
        "Brand kit from logo",
        "Shuffle layouts",
        "AI brief + chat",
        "20+ layout patterns",
        "Visual library",
        "PNG & PDF export",
      ],
      screenshot: {
        src: visual.heroImageSrc ?? "/projects/postforge/hero.webp",
        alt: visual.heroImageAlt ?? "Postforge design tool with brand kit and canvas",
      },
      liveUrl: editorImage?.href ?? `${POSTFORGE_APP}/tool`,
      ctaLabel: "Open live editor",
      secondaryLiveUrl: "https://postforge-1g5t25oxq-akssmaxs-projects.vercel.app/tool",
      secondaryCtaLabel: "Without AI build",
    },
    learnings: {
      heading: "What I'd repeat",
      description: "Takeaways from shipping Postforge end to end as a solo design-engineering build.",
      items: [
        "Logo-first onboarding cuts off-brand output before users touch layouts",
        "Shuffle beats blank canvas for exploration — especially for non-designers",
        "Chat beside the canvas keeps AI useful without breaking the visual system",
        "One export flow for social + decks simplified the product story",
        "Small teams get real value — contrast checker and design critique help non-designers learn design as they ship",
        "On-canvas editing is easier than Claude Design for refining layouts and individual elements",
      ],
    },
    gaps: {
      heading: "Honest limitations",
      description: "What's not solved yet — and why it matters.",
      items: [
        {
          gap: "Brand extraction varies by logo format",
          impact: "Complex or multi-color logos need manual palette tweaks",
        },
        {
          gap: "No team workspaces or shared libraries",
          impact: "Each user rebuilds brand context independently",
        },
        {
          gap: "AI copy quality depends on prompt craft",
          impact: "No fine-tuned brand voice model yet",
        },
        {
          gap: "No review or approval workflow",
          impact: "Marketing teams still need external sign-off outside the tool",
        },
        {
          gap: "Mobile editing not a focus",
          impact: "Built for desktop-first marketing workflows",
        },
      ],
    },
    roadmap: {
      heading: "What's next",
      description: "Planned for the next release — platform, export, collaboration, and AI polish.",
      horizons: [
        {
          label: "Next release",
          items: [
            "Unified Brand Kit",
            "Team Workspaces",
            "Backend and Auth Integration with Neon",
            "Figma & HTML Export",
            "SVG editing tools",
            "Dynamic Layouts",
            "Comments for collaboration",
            "Feedback section for feature requests",
            "Design.md import — full design system from company sites, not just brand colors",
            "Brand Assets library upload",
          ],
        },
        {
          label: "AI & quality",
          items: [
            "Better tool calls",
            "Contrast and design critique feature improvements",
          ],
        },
      ],
      liveUrl: visual.liveUrl,
      ctaLabel: visual.ctaLabel ?? "Open live app",
    },
    thankYou: {
      heading: "Thank you",
      message:
        "Happy to walk through Postforge — questions, feedback, or a deeper dive into any project on the portfolio are always welcome.",
      name: profile.name,
      email: profile.contact.email,
      linkedinUrl: profile.links.linkedin,
    },
  }
}
