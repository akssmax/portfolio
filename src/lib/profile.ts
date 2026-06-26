import { getDesignCareerSpanLabel } from "./experience-duration"

const experience = [
  {
    company: "100x.bot",
    logoSrc: "/companies/100x-bot.svg",
    websiteUrl: "https://100x.bot/",
    role: "Design Engineer",
    period: "Dec 2025 – Present",
    location: "Bengaluru, India",
    description:
      "Designing agentic AI workflows — scraping, automation, and data visualization tools that turn raw web data into structured insights.",
  },
  {
    company: "Kodo",
    logoSrc: "/companies/kodo.svg",
    websiteUrl: "https://www.kodo.com/",
    role: "Senior Product Designer",
    period: "Feb 2024 – Nov 2025",
    location: "Pune, India",
    description:
      "Led design on procure-to-pay flows for an enterprise fintech product — translating complex finance and compliance requirements into intuitive workflows.",
    highlights: [
      "Built unified Kodo design system (native light/dark mode) — Tamagui and MD3 versions",
      "New website in Framer with Framer Motion and custom React components",
      "Kodo ERP P2P (Procure-to-Pay) v1 launch with enterprise customers",
      "UPI app demo for NPCI",
      "Bharat Connect integration design screens (NPCI approved)",
      "Revamped Kodo's payment solution app with MD3 guidelines",
      "Multiple customer demos and prototypes (code-based and Figma)",
      "700+ custom component library with base design system",
    ],
  },
  {
    company: "Unlogged",
    logoSrc: "/companies/unlogged.svg",
    websiteUrl: "https://www.unlogged.io/",
    role: "Product Designer",
    period: "Dec 2021 – Jan 2024",
    location: "Remote · YC S22",
    description:
      "Designed developer tooling experiences for a YC S22 open-source Java debugging platform — from onboarding to real-time performance monitoring.",
    highlights: [
      "Plugin design for IntelliJ IDEA",
      "Website design & development built from scratch in Webflow",
      "Web dashboard app",
      "UX research, user testing, and prototyping",
      "Branding and investor presentations",
      "Custom design system (modified Chakra UI)",
      "Video editing for YouTube and LinkedIn",
      "UI animations for marketing website",
    ],
  },
  {
    company: "Tulr",
    logoSrc: "/companies/tulr.svg",
    websiteUrl: "https://www.producthunt.com/products/tulr-io",
    role: "UX Designer",
    period: "May 2020 – Dec 2021",
    location: "Gurgaon, India · AuthMe Id Services",
    description:
      "Designed Tulr — a no-code platform combining videos, tables, forms, and calendars with automation. One-shot replacement for Airtable, Typeform, Calendly, and Loom.",
    highlights: [
      "Mobile and web product design for the no-code builder",
      "Built 700+ custom component library",
      "Branding, animation, social media, and Product Hunt launch",
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
    websiteUrl: "https://play.google.com/store/apps/details?id=com.wallzy.app",
    role: "Graphic Designer & Founder",
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
  return `As a self-taught Product Designer and Design Engineer with ${span.toLowerCase()} in design based in Bangalore (Bengaluru), India, I turn ambiguous, high-stakes problems into clear, trustworthy product flows. From Tulr's no-code platform and YC-backed devtools to enterprise fintech, I partner closely with product and engineering — and now design agentic AI experiences at 100x.bot.`
}

export const profile = {
  name: "Akshay Saini",
  title: "Design Engineer",
  role: "Design Engineer",
  company: "100x.bot",
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
    website: "https://akshaysaini.xyz/",
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
  interests: [
    "Gaming",
    "AI Tools",
    "Open Source Tools",
    "Android",
    "Photography",
    "Motion Graphics",
    "UI Animation",
    "Music Theory",
    "DJing",
    "Movies",
    "Mentoring",
    "Human Psychology",
    "Interior Design",
    "Ethical UX",
    "Cinematography",
  ],
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
      : [],
  )
}
