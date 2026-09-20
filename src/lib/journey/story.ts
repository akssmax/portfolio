import { profile } from "@/lib/profile"

export type JourneyInteraction =
  | "tools"
  | "wallpaper"
  | "studio"
  | "blocks"
  | "trace"
  | "replay"
  | "approval"
  | "agent"

export type StoryChapter = {
  id: string
  number: string
  year: string
  period: string
  company: string
  role: string
  eyebrow: string
  title: string
  story: string
  contribution: string
  details: Array<string>
  interaction: JourneyInteraction
  accent: string
  ink: string
  image?: string
  imageAlt?: string
  logo?: string
  caseStudy?: string
  source?: { label: string; href: string }
  brand?: string
  featureIntro?: string
  features?: Array<{
    title: string
    description: string
    image: string
    alt: string
    imageLabel: string
  }>
  collaborators?: Array<{ name: string; role?: string }>
  teamNote?: string
  teamSource?: { label: string; href: string }
  compact?: boolean
}

function experience(company: string) {
  const item = profile.experience.find((entry) => entry.company === company)
  if (!item) throw new Error(`Missing journey experience: ${company}`)
  return item
}

const wallzy = experience("Wallzy")
const internship = experience("tenxresults")
const freelance = experience("Freelance")
const tulr = experience("Tulr")
const unlogged = experience("Unlogged")
const kodo = experience("Kodo")
const current = experience("100x.bot")

export const storyChapters: Array<StoryChapter> = [
  {
    id: "college",
    number: "01",
    year: "2014",
    period: profile.education.years,
    company: "GJUST",
    role: profile.education.degree,
    eyebrow: "The first spark",
    title: "I started with the tools, not a job title.",
    story: `At ${profile.education.school}, a computer science degree led me to After Effects, Premiere Pro, and Illustrator. I was making motion, video, and graphics before I knew product design was a career.`,
    contribution:
      "A curiosity for making things move became the foundation for everything that followed.",
    details: ["Motion and video", "Vector graphics", "Learning by making"],
    interaction: "tools",
    accent: "color-mix(in oklch, var(--primary) 12%, var(--background))",
    ink: "var(--foreground)",
  },
  {
    id: "wallzy",
    number: "02",
    year: "2017",
    period: wallzy.period,
    company: wallzy.company,
    role: wallzy.role,
    eyebrow: "First thing in the wild",
    title: "A wallpaper app became my first real product.",
    story:
      "I built Wallzy with a friend during college: an Android app for discovering wallpapers and editing them in place. It reached more than 100,000 installs.",
    contribution:
      "I co-founded it and designed the brand, custom wallpapers, and editing tools.",
    details: wallzy.highlights,
    interaction: "wallpaper",
    accent: "color-mix(in srgb, #ee2c75 12%, var(--background))",
    ink: "var(--foreground)",
    image: "/companies/wallzy.png",
    imageAlt: "Wallzy app mark",
    logo: "/journey/wallzy-logo.png",
    source: { label: "Wallzy app archive", href: wallzy.websiteUrl ?? "" },
    brand: "#ee2c75",
    featureIntro:
      "The original Play Store images show the app people actually used: daily discoveries, an editor, and saved collections.",
    features: [
      {
        title: "Fresh walls, every day",
        description:
          "A daily wallpaper feed made finding a new look part of the routine.",
        image: "/journey/wallzy-daily.png",
        alt: "Original Wallzy Play Store artwork showing the Daily Walls feed on Android phones",
        imageLabel: "Archived Android app screenshot",
      },
      {
        title: "Make a wallpaper yours",
        description:
          "Editing controls let people personalize a wallpaper inside the app.",
        image: "/journey/wallzy-editor.png",
        alt: "Original Wallzy Play Store artwork showing wallpaper editing screens",
        imageLabel: "Archived Android app screenshot",
      },
      {
        title: "Keep the good ones",
        description:
          "Favorites and collections kept saved wallpapers within reach.",
        image: "/journey/wallzy-favorites.png",
        alt: "Original Wallzy Play Store artwork showing favorites and saved collections",
        imageLabel: "Archived Android app screenshot",
      },
    ],
    collaborators: [{ name: "Wally (phpmalik)", role: "Co-creator" }],
    teamNote: "My first lesson in making a product with someone else.",
  },
  {
    id: "tenxresults",
    number: "03",
    year: "2019",
    period: internship.period,
    company: internship.company,
    role: internship.role,
    eyebrow: "The first studio",
    title: "My first design internship was a little bit of everything.",
    story: internship.description,
    contribution:
      "Branding, print, social ads, WordPress, and video editing taught me to switch mediums quickly.",
    details: internship.highlights,
    interaction: "studio",
    accent: "var(--section)",
    ink: "var(--foreground)",
    compact: true,
  },
  {
    id: "freelance",
    number: "04",
    year: "2020",
    period: freelance.period,
    company: freelance.company,
    role: freelance.role,
    eyebrow: "Side quests",
    title: "I kept making things for early teams.",
    story:
      "Alongside the start of my Tulr role, I took on freelance work across websites, packaging, and app concepts. These projects overlapped from May 2020 through January 2021.",
    contribution:
      "Work ranged from Strictly4Men packaging and web to Tenxgeeks and a cloud gaming concept.",
    details: freelance.highlights,
    interaction: "studio",
    accent: "color-mix(in oklch, var(--chart-3) 13%, var(--background))",
    ink: "var(--foreground)",
    compact: true,
  },
  {
    id: "tulr",
    number: "05",
    year: "2020",
    period: tulr.period,
    company: tulr.company,
    role: tulr.role,
    eyebrow: "The builder era",
    title: "What if work tools clicked together like building blocks?",
    story:
      "Tulr let teams combine video, tables, forms, calendars, and automation to build their own workflows without code.",
    contribution:
      "As founding designer, I owned branding and product design across web and mobile, from the builder UI to launch assets.",
    details: tulr.highlights,
    interaction: "blocks",
    accent: "color-mix(in srgb, #673ee6 11%, var(--background))",
    ink: "var(--foreground)",
    image: "/projects/tulr/product.jpg",
    imageAlt: "Tulr no-code product interface",
    logo: "/companies/tulr.svg",
    caseStudy: "tulr",
    source: {
      label: "Product Hunt",
      href: "https://www.producthunt.com/products/tulr-io",
    },
    brand: "#673ee6",
    featureIntro:
      "Tulr brought several building blocks into one workspace. These are original images from its Product Hunt launch.",
    features: [
      {
        title: "Structure the work",
        description: "Tables gave teams a flexible home for information.",
        image: "/journey/tulr-tables.jpg",
        alt: "Tulr launch image demonstrating table fields and column types",
        imageLabel: "Original product launch image",
      },
      {
        title: "Explain with video",
        description:
          "Video helped people show a process instead of describing every step.",
        image: "/journey/tulr-video.jpg",
        alt: "Tulr launch image introducing its video feature",
        imageLabel: "Original product launch image",
      },
      {
        title: "Make time part of the flow",
        description:
          "Calendars connected meetings to the rest of the workspace.",
        image: "/journey/tulr-calendar.jpg",
        alt: "Tulr launch image showing calendar and meeting features",
        imageLabel: "Original product launch image",
      },
    ],
    collaborators: [{ name: "Shardul Lavekar", role: "Founder" }],
    teamNote:
      "I partnered with Shardul and a team of seven developers while shaping the brand and product.",
    teamSource: {
      label: "Tulr launch team",
      href: "https://www.producthunt.com/products/tulr-io",
    },
  },
  {
    id: "videobug",
    number: "06",
    year: "2022",
    period: `2022 · within ${unlogged.period} role`,
    company: "Videobug",
    role: "Founding Designer · Videobug → Unlogged",
    eyebrow: "Debugging, rewound",
    title: "We gave developers a rewind button.",
    story:
      "Videobug recorded code execution so developers could inspect earlier Java, Kotlin, and Scala runs line by line in IntelliJ. The product later evolved into Unlogged.",
    contribution:
      "I led branding and product design for the debugger and its developer-facing experience.",
    details: [
      "Time-travel debugging",
      "IntelliJ plugin design",
      "Brand and launch design",
    ],
    interaction: "trace",
    logo: "/journey/videobug-logo.webp",
    accent: "color-mix(in srgb, #ee524f 12%, var(--background))",
    ink: "var(--foreground)",
    source: {
      label: "Videobug on Product Hunt",
      href: "https://www.producthunt.com/products/videobug",
    },
    brand: "#ee524f",
    featureIntro:
      "Before Unlogged, we framed the debugger around a simple promise: travel backward through a recorded execution. This is the original Videobug launch artwork.",
    features: [
      {
        title: "Time travel through code",
        description:
          "A recorded run made earlier values inspectable in the IDE.",
        image: "/journey/videobug-time-travel.jpg",
        alt: "Original Videobug Product Hunt artwork reading Time Travel Your Code",
        imageLabel: "Original launch artwork",
      },
      {
        title: "Find the moment it broke",
        description:
          "The product story focused on tracing a bug back to its source.",
        image: "/journey/videobug-fix-bugs.jpg",
        alt: "Original Videobug Product Hunt feature artwork about fixing bugs",
        imageLabel: "Original launch artwork",
      },
    ],
    collaborators: [
      { name: "Shardul Lavekar", role: "Co-founder" },
      { name: "Parth Mudgal", role: "Co-founder" },
      { name: "Amogh CR", role: "Developer" },
    ],
    teamNote: "The same team carried the product from Videobug into Unlogged.",
    teamSource: {
      label: "Unlogged team",
      href: "https://www.unlogged.io/about-us",
    },
  },
  {
    id: "unlogged",
    number: "07",
    year: "2023",
    period: unlogged.period,
    company: unlogged.company,
    role: unlogged.role,
    eyebrow: "The product evolves",
    title: "From watching a bug to replaying a fix.",
    story:
      "The Videobug work grew into Unlogged: a Java developer tool for recording and replaying methods, mocking calls, generating tests, and monitoring performance.",
    contribution:
      "As founding designer across both phases, I owned product design, branding, the IntelliJ plugin, web dashboard, and marketing site.",
    details: unlogged.highlights,
    interaction: "replay",
    accent: "color-mix(in srgb, #24b8d5 12%, var(--background))",
    ink: "var(--foreground)",
    image: "/journey/unlogged-replay.jpg",
    imageAlt: "Unlogged product image showing test replay in the IDE",
    logo: "/companies/unlogged.svg",
    caseStudy: "unlogged",
    source: {
      label: "Product Hunt",
      href: "https://www.producthunt.com/products/unlogged",
    },
    brand: "#24b8d5",
    featureIntro:
      "The product expanded from observing a run to shaping and testing the next one. These public product images show its tools; my role ended in January 2024.",
    features: [
      {
        title: "Mock a response",
        description: "Replace a dependency at runtime to test a specific path.",
        image: "/journey/unlogged-mocks.jpg",
        alt: "Unlogged product image showing runtime mocking controls in an IDE",
        imageLabel: "Original product image",
      },
      {
        title: "Turn a run into a test",
        description: "Create a repeatable test from observed code behavior.",
        image: "/journey/unlogged-tests.jpg",
        alt: "Unlogged product image showing JUnit test generation",
        imageLabel: "Original product image",
      },
      {
        title: "Replay the method",
        description: "Run the captured method again after making a change.",
        image: "/journey/unlogged-replay.jpg",
        alt: "Unlogged product image showing method replay in the IDE",
        imageLabel: "Original product image",
      },
    ],
    collaborators: [
      { name: "Shardul Lavekar", role: "Co-founder" },
      { name: "Parth Mudgal", role: "Co-founder" },
      { name: "Amogh CR", role: "Developer" },
    ],
    teamNote:
      "I designed across the plugin, dashboard, brand, and site with the founding team.",
    teamSource: {
      label: "Unlogged team",
      href: "https://www.unlogged.io/about-us",
    },
  },
  {
    id: "kodo",
    number: "08",
    year: "2024",
    period: kodo.period,
    company: kodo.company,
    role: kodo.role,
    eyebrow: "Design at scale",
    title: "Making complex money movement feel clear.",
    story:
      "Kodo brings accounts payable, vendor payouts, corporate cards, and reimbursements into one spend platform for businesses.",
    contribution:
      "As lead product designer, I led procure-to-pay workflows, the design system, app experiences, prototypes, and the marketing site.",
    details: kodo.highlights,
    interaction: "approval",
    accent: "color-mix(in srgb, #ef7a81 13%, var(--background))",
    ink: "var(--foreground)",
    image: "/projects/kodo/workflows.webp",
    imageAlt: "Kodo procure-to-pay workflow interface",
    logo: "/companies/kodo.svg",
    caseStudy: "kodo",
    source: { label: "Kodo website", href: "https://www.kodo.com/" },
    brand: "#ef7a81",
    featureIntro:
      "A spend platform has to make every handoff legible. Kodo's own site shows the workflow builder and approval experiences in context.",
    features: [
      {
        title: "Build an approval path",
        description:
          "Teams can set conditions and approvers for purchase requests.",
        image: "/journey/kodo-workflows.avif",
        alt: "Kodo official site image showing its purchase order workflow builder",
        imageLabel: "Kodo product visual",
      },
      {
        title: "Move work forward",
        description:
          "Requests move across finance and procurement with clear steps.",
        image: "/projects/kodo/workflows.webp",
        alt: "Kodo official site image showing procure-to-pay workflow steps",
        imageLabel: "Kodo product visual",
      },
      {
        title: "Keep a shared record",
        description: "Comments give collaborators context beside the request.",
        image: "/projects/kodo/collaboration.webp",
        alt: "Kodo official site image showing collaboration on a purchase request",
        imageLabel: "Kodo product visual",
      },
    ],
    collaborators: [
      { name: "Gaurav Thapa", role: "CTO and co-founder" },
      { name: "Deepti Sanghi", role: "Co-founder" },
      { name: "Tumul Roy" },
      { name: "Yash Mohite" },
    ],
    teamNote:
      "Enterprise product work took close collaboration with the founding, engineering, and product teams.",
    teamSource: { label: "About Kodo", href: "https://www.kodo.com/about-us" },
  },
  {
    id: "100x-bot",
    number: "09",
    year: "Now",
    period: current.period,
    company: current.company,
    role: current.role,
    eyebrow: "The next chapter",
    title: "Now I design the work AI can do with us.",
    story: current.description,
    contribution:
      "I design and build the extension, marketing experiences, prototypes, and an AI-native design system.",
    details: current.highlights,
    interaction: "agent",
    accent: "color-mix(in srgb, #76c94d 12%, var(--background))",
    ink: "var(--foreground)",
    image: "/projects/100x/hero.webp",
    imageAlt: "100x.bot browser automation product",
    logo: "/companies/100x-bot.svg",
    caseStudy: "100x-chat-shell",
    source: { label: "100x.bot", href: "https://100x.bot/" },
    brand: "#76c94d",
    collaborators: [
      { name: "Shardul Lavekar" },
      { name: "Parth Mudgal" },
      { name: "Samarth RS", role: "Designer" },
    ],
    teamNote:
      "The current chapter is shaped with founders, designers, and engineers around me.",
  },
]

export function findStoryChapter(id: string) {
  return storyChapters.find((chapter) => chapter.id === id)
}
