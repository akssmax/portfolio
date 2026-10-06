import { getDesignCareerSpanLabel } from "./experience-duration"
import { siteUrl } from "./site-url"

const experience = [
  {
    company: "Freelancing",
    role: "Product Designer / Design Engineer",
    period: "Jul 2026 – Present",
    location: "Bengaluru, India",
    description:
      "Independent product design and design engineering for apps and production websites.",
    highlights: [
      "Designed and built Postforge, a social media post design tool with brand kits, 20+ layouts, AI-assisted briefs, and export-ready posts and slide decks",
      "Designing and building Ion Workspace, a connected app for business email, calendars, contacts, and files, with a public sample-data demo",
      "Redesigned and built the Indus Best Mega Food Park website, now live in production, with campus and facilities information, investor journeys, enquiry flows, and a private content management workspace",
    ],
  },
  {
    company: "100x.bot",
    logoSrc: "/companies/100x-bot.svg",
    websiteUrl: "https://100x.bot/",
    role: "Design Engineer",
    period: "Dec 2025 – Jun 2026",
    location: "Bengaluru, India",
    description:
      "Designed and built agentic AI product experiences for a browser-native automation platform — extension UI, marketing site, and design system.",
    highlights: [
      "Redesigned the Chromium extension with shadcn/ui and semantic design tokens",
      "Managed and collaborated with 2 junior developers to ship features faster",
      "Revamped website with MCP & Cursor — code-based handoff from initial Figma design",
      "Built design system on shadcn/ui with AI-native components",
      "Built multiple code-based prototypes for the sales team and feature development",
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
      "Led design on procure-to-pay flows for a YC W21 enterprise fintech product — translating complex finance and compliance requirements into intuitive workflows.",
    highlights: [
      "Built two Kodo design systems with native light/dark mode — Tamagui and MD3",
      "Built new website in Framer with Framer Motion and custom React components",
      "Launched Kodo ERP P2P (Procure-to-Pay) v1 with enterprise customers",
      "Designed UPI app demo for NPCI",
      "Bharat Connect integration design screens (NPCI approved)",
      "Revamped Kodo's payment solution app with MD3 guidelines",
      "Built multiple customer demos and prototypes (code-based and Figma)",
      "Built 700+ component library on top of base design system",
    ],
  },
  {
    company: "Unlogged",
    logoSrc: "/companies/unlogged.svg",
    websiteUrl: "https://www.unlogged.io/",
    role: "Founding Designer",
    period: "Dec 2021 – Jan 2024",
    location: "Remote · YC S22",
    description:
      "Led branding and product design as Videobug evolved into Unlogged, a YC S22 developer tool for debugging, testing, and replaying Java code.",
    highlights: [
      "Designed IntelliJ IDEA plugin",
      "Designed and built website from scratch in Webflow",
      "Designed web dashboard app",
      "UX research, user testing, and prototyping",
      "Branding and investor presentations",
      "Led the product and visual identity across both Videobug and Unlogged",
      "Built separate design systems for Videobug and Unlogged, including a modified Chakra UI system",
      "Video editing for YouTube and LinkedIn",
      "UI animations for marketing website",
    ],
  },
  {
    company: "Tulr",
    logoSrc: "/companies/tulr.svg",
    websiteUrl: "https://www.producthunt.com/products/tulr-io",
    role: "Founding Designer",
    period: "May 2020 – Dec 2021",
    location: "Gurgaon, India · AuthMe Id Services",
    description:
      "Designed Tulr — a no-code platform combining videos, tables, forms, and calendars with automation. One-shot replacement for Airtable, Typeform, Calendly, and Loom.",
    highlights: [
      "Mobile and web product design for the no-code builder",
      "Built Tulr design system with a 700+ custom component library",
      "Branding, animation, social media, and Product Hunt launch",
      "Owned founding product design and visual identity across web and mobile",
      "Collaborated with a team of 7 developers",
    ],
  },
  {
    company: "Freelance",
    role: "Graphic Designer",
    period: "May 2020 – Jan 2021",
    location: "Gurgaon, India",
    description:
      "Contract graphic design work across web, packaging, and brand assets for early-stage startups.",
    highlights: [
      "Strictly4Men website and packaging design",
      "Tenxgeeks website design",
      "Cloud-based gaming platform app",
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
      "Built and designed an Android wallpaper app with custom editing tools.",
    highlights: [
      "Custom wallpapers and in-app editing tools",
      "User analytics in Fabric (acquired by Firebase)",
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
