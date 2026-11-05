import { getDesignCareerSpanLabel } from "./experience-duration"
import { siteUrl } from "./site-url"

const experience = [
  {
    company: "Freelancing",
    role: "Product Designer / Design Engineer",
    period: "Jul 2026 – Present",
    location: "Bengaluru, India",
    description:
      "Designing and shipping AI-native products end to end, from research and Figma to production, for clients and personal launches.",
    highlights: [
      "Designed and built 4 products end to end: Cue (browser DJ studio), Postforge (social post design tool), Ion Workspace (business email and calendar app), and the Indus Best Mega Food Park website",
      "Built each with Claude Code and Codex; Indus is live in production, and Cue is in public beta",
    ],
  },
  {
    company: "100x.bot",
    logoSrc: "/companies/100x-bot.svg",
    websiteUrl: "https://100x.bot/",
    role: "Design Engineer",
    period: "Dec 2025 – Jun 2026",
    location: "Bengaluru, India · Unlogged Inc, YC S22",
    founderThread: { step: 3, product: "100x.bot", years: "2025–2026", summary: "AI browser agent" },
    description:
      "Designed and built agentic and conversational AI product experiences for a YC-backed browser automation platform: chat agent, extension UI, marketing site, and design system.",
    highlights: [
      "Designed the conversational agent interface: chat, @-mentions for tabs and workflows, and model selection across Claude and Gemini",
      "Redesigned the Chromium extension with shadcn/ui and semantic design tokens",
      "Managed 2 junior developers and built code prototypes for sales demos and new features",
      "Revamped the marketing website, building it in code with Cursor and MCP from the Figma design",
      "Built the design system on shadcn/ui, including AI-native components",
    ],
  },
  {
    company: "Kodo",
    logoSrc: "/companies/kodo.svg",
    websiteUrl: "https://www.kodo.com/",
    role: "Lead Product Designer",
    period: "Feb 2024 – Nov 2025",
    location: "Pune, India · YC W21",
    description:
      "Led design for a YC W21 enterprise fintech across the Kodo ERP procure-to-pay platform and the corporate card product, turning complex finance and compliance requirements into clear workflows.",
    highlights: [
      "Launched v1 of Kodo ERP procure-to-pay (P2P) and onboarded its first 2 enterprise customers, redBus and Brndme",
      "Built 2 design systems with light and dark modes: Tamagui (React Native) to speed up the ERP mobile apps, and MD2-to-MD3 for the corporate card",
      "Built a 1,000+ component library on top of the base design system",
      "Designed NPCI's UPI app demo and NPCI-approved Bharat Connect integration screens",
      "Revamped the corporate card app on Material Design 3",
      "Built the new website in Framer with Framer Motion and custom React components",
      "Built customer demos and prototypes in code and Figma for sales and product",
    ],
  },
  {
    company: "Unlogged",
    logoSrc: "/companies/unlogged.svg",
    websiteUrl: "https://www.producthunt.com/products/unlogged",
    role: "Founding Designer",
    period: "Dec 2021 – Jan 2024",
    location: "Remote · YC S22",
    founderThread: {
      step: 2,
      product: "Videobug → Unlogged",
      years: "2021–2024",
      summary: "YC S22 developer tools",
    },
    description:
      "Joined Videobug, a time-travel debugger for Java, before its YC S22 batch and stayed through the pivot and rebrand to Unlogged, a tool for recording, replaying, and testing Java code.",
    highlights: [
      "Designed Videobug end to end for YC S22: the IntelliJ plugin, website, pitch decks, and marketing materials",
      "Led the rebrand from Videobug to Unlogged after the pivot, carrying the product and visual identity across both",
      "Both launches reached Product Hunt's top 10: Unlogged #4 Product of the Day (638 upvotes), Videobug #10 (104 upvotes)",
      "Designed the Unlogged IntelliJ IDEA plugin and its web dashboard",
      "Built 2 design systems, one per brand, including a modified Chakra UI system",
      "Designed and built the Webflow website from scratch, plus UI animations in Jitter and marketing videos",
      "Ran UX research, user testing, and prototyping",
    ],
  },
  {
    company: "Tulr",
    logoSrc: "/companies/tulr.svg",
    websiteUrl: "https://www.producthunt.com/products/tulr-io",
    role: "Founding Designer",
    period: "Feb 2021 – Dec 2021",
    location: "Gurgaon, India · AuthMe Id Services",
    founderThread: { step: 1, product: "Tulr", years: "2021", summary: "No-code platform" },
    description:
      "Designed Tulr, a no-code “Lego kit” of tables, screen recordings, forms, and calendars with automation, replacing Airtable, Typeform, Calendly, and Loom for internal apps like applicant tracking.",
    highlights: [
      "Sole designer, owning product design and visual identity across web and mobile, working directly with the founders",
      "Launched on Product Hunt as #5 Product of the Day with 175 upvotes; reviewers praised the clean, uncluttered UI",
      "Designed the no-code builder for web and mobile, shaped by feedback from early customers",
      "Built the Tulr design system and a custom library of 700+ components",
      "Shipped with a team of 7 developers",
      "Led branding, launch animations, and social media design",
    ],
  },
  {
    company: "Freelance",
    role: "Product & Graphic Designer",
    period: "May 2020 – Jan 2021",
    location: "Gurgaon, India",
    description:
      "Contract product and graphic design for early-stage startups across web, apps, packaging, and brand assets.",
    highlights: [
      "3–4 months of contract product design for Tulr, which led to the full-time founding designer role in Feb 2021",
      "Strictly4Men website and packaging design",
      "Tenxgeeks website design",
      "App design for a cloud gaming platform",
    ],
  },
  {
    company: "tenxresults",
    role: "Graphic Designer (Intern)",
    period: "Aug 2019 – Nov 2019",
    location: "Gurgaon, India",
    description:
      "Brand and marketing design for a results-driven marketing agency.",
    highlights: [
      "Branding and print media",
      "Social media ads and post design",
      "WordPress development",
      "Video editing",
    ],
  },
  {
    company: "Wallzy",
    logoSrc: "/companies/wallzy.png",
    websiteUrl: "https://chrome-stats.com/d/com.phpmalik.wallzyPro",
    role: "Graphic Designer & Co-founder",
    period: "Jan 2017 – Dec 2018",
    location: "Hisar, Haryana",
    description:
      "Designed and built an Android wallpaper app with custom editing tools.",
    highlights: [
      "Custom wallpapers and in-app editing tools",
      "User analytics in Fabric (now part of Firebase)",
      "Branding and visual identity",
      "100K+ installs on Google Play",
    ],
  },
]

function createProfileBio(periods: string[]) {
  const span = getDesignCareerSpanLabel(periods)
  return `As a self-taught Product Designer and Design Engineer with ${span.toLowerCase()} in design based in Bangalore (Bengaluru), India, I turn ambiguous, high-stakes problems into clear, trustworthy product flows. From Tulr's no-code platform to YC-backed fintech at Kodo (W21) and devtools at Unlogged (S22), I partner closely with product and engineering — with agentic AI experience at 100x.bot. Since July 2026, I work independently as a freelance Product Designer and Design Engineer.`
}

export const profile = {
  name: "Akshay Saini",
  title: "Product Designer / Design Engineer",
  role: "Product Designer / Design Engineer",
  company: "Freelancing",
  location: "Bengaluru (Bangalore), India",
  portrait: {
    src: "/images/portraits/02.png",
    shape: "arch",
  },
  tagline:
    "I design and build product UI for founders and early teams — from Figma to React, so you ship faster with less rework.",
  bio: createProfileBio(experience.map((item) => item.period)),
  contact: {
    email: "akshaysaini.design@gmail.com",
    phone: "+91 8168238248",
  },
  links: {
    website: siteUrl("/"),
    linkedin: "https://www.linkedin.com/in/akssmax/",
    github: "https://github.com/akssmax",
    dribbble: "https://dribbble.com/akssmax",
    medium: "https://medium.com/@akssmax",
    youtube: "https://www.youtube.com/@akshaysainiAK",
  },
  education: {
    degree: "B.Tech, Computer Science",
    school: "Guru Jambheshwar University of Science and Technology",
    years: "2014 – 2018",
    location: "Hisar, Haryana",
  },
  certifications: [
    {
      title: "UX Design Masterclass",
      issuer: "UXDMC",
      date: "Sep 2020",
      credentialId: "23119389",
    },
  ],
  languages: [
    { name: "Hindi", level: "Native" },
    { name: "English", level: "Professional working" },
  ],
  interests: ["Photography", "Interior Design", "Architecture", "DJing", "Gaming"],

  designCapabilities: [
    "Design Systems with Tokens",
    "Figma Variables & Auto Layout",
    "Advanced Prototyping",
    "Design Docs",
    "Web Products",
    "Mobile Apps",
    "Website Design",
    "Responsive Design",
    "UX Research",
    "Design Sprints",
    "Lean UX",
    "Wireframing",
    "UI Animations",
  ],
  tools: [
    { name: "Codex", logoSrc: "/tools/openai.svg", category: "Coding tools", note: "AI-assisted development" },
    { name: "Claude", logoSrc: "/tools/anthropic.svg", category: "Coding tools", note: "AI-assisted workflows" },
    { name: "Blender", logoSrc: "/tools/blender.svg", category: "Design", note: "3D modeling and rendering" },
    { name: "Three.js", logoSrc: "/tools/threejs.svg", category: "Build", note: "Interactive 3D experiences" },
    {
      name: "Figma",
      category: "Design",
      note: "UI design, prototyping",
      logoSrc: "/tools/figma.svg",
    },
    {
      name: "Miro",
      category: "Research",
      note: "UX research",
      logoSrc: "/tools/miro.svg",
    },
    {
      name: "FigJam",
      category: "Research",
      note: "UX research",
      logoSrc: "/tools/figjam.svg",
    },
    {
      name: "SurveyMonkey",
      category: "Research",
      note: "User research",
      logoSrc: "/tools/surveymonkey.svg",
    },
    {
      name: "Maze",
      category: "Research",
      note: "Usability testing",
      logoSrc: "/tools/maze.svg",
    },
    {
      name: "Framer",
      category: "Build",
      note: "Website development",
      logoSrc: "/tools/framer.svg",
    },
    {
      name: "Webflow",
      category: "Build",
      note: "Website development",
      logoSrc: "/tools/webflow.svg",
    },
    {
      name: "Adobe Creative Suite",
      category: "Design",
      note: "Ai, Ae, XD, Premiere, Ps, In",
      logoSrc: "/tools/adobecreativecloud.svg",
    },
    {
      name: "Amplitude",
      category: "Analytics",
      note: "User analytics",
      logoSrc: "/tools/amplitude.svg",
    },
    {
      name: "Google Analytics",
      category: "Analytics",
      note: "User analytics",
      logoSrc: "/tools/googleanalytics.svg",
    },
    {
      name: "PostHog",
      category: "Analytics",
      note: "User analytics",
      logoSrc: "/tools/posthog.svg",
    },
    {
      name: "Notion",
      category: "Ops",
      note: "Project management",
      logoSrc: "/tools/notion.svg",
    },
    {
      name: "Jitter",
      category: "Design",
      note: "UI animation",
      logoSrc: "/tools/jitter.svg",
    },
    {
      name: "Cursor",
      category: "Coding tools",
      note: "AI-native code editor",
      logoSrc: "/tools/cursor.svg",
    },
    {
      name: "Antigravity",
      category: "Coding tools",
      note: "Agentic coding",
      logoSrc: "/tools/antigravity.svg",
    },
    {
      name: "v0",
      category: "Coding tools",
      note: "React UI generation",
      logoSrc: "/tools/v0.svg",
    },
    {
      name: "OpenCode",
      category: "Coding tools",
      note: "Open-source AI coding agent",
      logoSrc: "/tools/opencode.svg",
    },
    {
      name: "Paper",
      category: "Design",
      note: "AI-native design canvas",
      logoSrc: "/tools/paper.svg",
    },
  ],
  experience,
  designSkills: [
    "Figma",
    "Design Systems",
    "Product Design",
    "UX Research",
    "Prototyping",
    "Visual Design",
    "Brand Identity",
  ],
  engineeringSkills: [
    "React",
    "TypeScript",
    "Tailwind CSS",
    "TanStack",
    "Framer Motion",
    "Android",
  ],
  domainSkills: [
    "Fintech",
    "DevTools",
    "Agentic AI",
    "Marketing Design",
    "Amplitude",
  ],
}

export type ProfileExperience = (typeof profile.experience)[number]

/**
 * Tulr, Videobug → Unlogged and 100x.bot were built with the same founder, across
 * two companies. Shown as a linked thread on the site and as a lead sentence on the
 * resume, so the moves read as one path rather than job-hopping.
 */
export const FOUNDER_THREAD = {
  founder: "Shardul Lavekar",
  companies: "AuthMe Id Services and Unlogged Inc",
  total: 3,
} as const

export type FounderThreadStep = {
  step: number
  product: string
  years: string
  summary: string
}

export function getFounderThread(item: ProfileExperience): FounderThreadStep | undefined {
  return "founderThread" in item ? item.founderThread : undefined
}

/** Badge text, e.g. "Product 2 of 3 with founder Shardul Lavekar". Plain text, so parsers read it. */
export function getFounderBadgeLabel(thread: FounderThreadStep): string {
  return `Product ${thread.step} of ${FOUNDER_THREAD.total} with founder ${FOUNDER_THREAD.founder}`
}

/** Founder badge text for an entry, if it is part of the founder thread. */
export function getFounderBadge(item: ProfileExperience): string | undefined {
  const thread = getFounderThread(item)
  return thread ? getFounderBadgeLabel(thread) : undefined
}

/** Description plus the founder badge as a sentence: for llms.txt and chat answers. */
export function getExperienceSummary(item: ProfileExperience): string {
  const badge = getFounderBadge(item)
  return badge ? `${item.description} (${badge}.)` : item.description
}


export type EmployerLogo = {
  name: string
  logoSrc: string
  websiteUrl?: string
  period: string
  role: string
}

const HERO_LOGO_EXCLUDED = new Set(["Wallzy"])

export function getEmployerLogos(): EmployerLogo[] {
  return profile.experience.flatMap((item) =>
    item.logoSrc && !HERO_LOGO_EXCLUDED.has(item.company)
      ? [
          {
            name: item.company,
            logoSrc: item.logoSrc,
            websiteUrl: item.websiteUrl,
            period: item.period,
            role: item.role,
          },
        ]
      : []
  )
}
