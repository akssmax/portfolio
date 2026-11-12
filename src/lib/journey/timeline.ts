import { FOUNDER_THREAD, profile } from "@/lib/profile"

/** Content for the story-style journey timeline (/journey). Facts follow docs/career-facts.md. */

export type ActId = "spark" | "builder" | "rewind" | "scale" | "agents"

export type TimelineAct = {
  id: ActId
  roman: string
  name: string
  years: string
  line: string
}

type Shot = { img: string; alt: string }

export type TimelineScene =
  | { kind: "tools" }
  | { kind: "tabs"; tabs: Array<{ label: string; caption: string; shot: Shot | { visual: LearningVisual }; link?: SceneLink }>; ms?: number }
  | { kind: "rewind"; shots: Array<Shot> }
  | { kind: "log"; tabs: Array<{ label: string; shot: Shot; lines: Array<string> }>; ms?: number; thinking?: boolean }
  | { kind: "approval"; steps: Array<string>; shots: Array<Shot & { caption: string }> }
  | { kind: "shipped"; items: Array<ShippedItem>; ms?: number }
  | { kind: "none" }

/** A product I designed and built myself, shown on the Independent stop's launch board. */
export type ShippedItem = {
  name: string
  blurb: string
  kind: "Client" | "My product"
  status: "Live" | "Beta"
  /** Shown in the browser frame's address bar */
  host: string
  url?: string
  caseStudy: string
  shot: Shot
}

/** An outside link shown beside a scene caption, opened in a new tab. */
export type SceneLink = { href: string; label: string }

export type LearningVisual = "figma" | "theory" | "sprint" | "lean" | "cert" | "form"

export type TimelineChapter = {
  id: string
  act: ActId
  n: string
  year: string
  period: string
  company: string
  role: string
  brand: string
  logo?: string
  eyebrow: string
  /** Plain text plus an emphasised ending, rendered as `title <em>emphasis</em>`. */
  title: string
  emphasis: string
  story: string
  stat?: { value: number; prefix?: string; suffix?: string; label: string }
  founder?: { step: 1 | 2 | 3; continued?: boolean }
  quote?: { text: string; by: string }
  people?: Array<{ name: string; role?: string }>
  tags: Array<string>
  compact?: boolean
  /** A turning point, flagged on the line in both views. */
  milestone?: string
  /** Outside links (Product Hunt, live apps), opened in a new tab */
  links?: Array<SceneLink>
  /** Slug of the full case study under /projects */
  caseStudy?: string
  /** Skills picked up at this stop, collected by the skills bag */
  picks?: Array<string>
  /** Shown when "Honest notes" is on: what didn't work, and what it taught me */
  honest?: { missed: string; taught: string }
  scene: TimelineScene
}

function job(company: string) {
  const item = profile.experience.find((entry) => entry.company === company)
  if (!item) throw new Error(`Missing experience: ${company}`)
  return item
}

export const founderName = FOUNDER_THREAD.founder
export const founderLine = "One founder. Three products. Five years."
export const founderNote = "Not job-hopping: the same founder kept bringing me back."

export const timelineActs: Array<TimelineAct> = [
  { id: "spark", roman: "I", name: "The Spark", years: "2014 – 2019", line: "Before I knew it was a career." },
  { id: "builder", roman: "II", name: "The Builder", years: "2020 – 2021", line: "Side quests turn into a first founding role." },
  { id: "rewind", roman: "III", name: "Rewind", years: "2022 – 2024", line: "A debugger, YC, and a pivot." },
  { id: "scale", roman: "IV", name: "Scale", years: "2024 – 2025", line: "Making money movement feel clear." },
  { id: "agents", roman: "V", name: "Agents", years: "2025 – now", line: "Design and code, one person." },
]

/** What the Adobe tools turned into during college: a YouTube channel and a photography profile. */
export const collegeOutputs = {
  youtube: {
    url: "https://www.youtube.com/@akshaysainiAK",
    videos: [
      { id: "N4o-SBza7Sw", title: "Audio spectrum for Skrillex – Kyoto", tool: "After Effects" },
      { id: "Gr2mk4ncmPE", title: "How to slice text", tool: "Illustrator tutorial" },
      { id: "V7TclNhHFXA", title: "Line art: a lighthouse", tool: "Illustrator tutorial" },
      { id: "eXVCUAOsHaE", title: "Best wallpaper apps of 2016", tool: "Premiere Pro" },
    ],
  },
  photos: {
    url: "https://500px.com/p/akssmax",
    picks: [
      { slug: "agra-fort", title: "Agra Fort in B/W" },
      { slug: "butterfly", title: "The Thirsty Butterfly" },
      { slug: "rising-flowers", title: "Rising Flowers" },
      { slug: "building", title: "Building" },
      { slug: "road-to-light", title: "The Road To Light" },
      { slug: "sparkling-water", title: "Sparkling Water" },
      { slug: "let-me-rise", title: "Let me Rise" },
      { slug: "shiny-grass", title: "Shiny Grass" },
    ],
  },
}

export type CityMove = {
  from: string
  fromNote: string
  to: string
  toNote: string
  when: string
  seat: string
  gate: string
  brand: string
  text: string
}

/** Boarding passes shown just before the stop they lead to, keyed by chapter id. */
export const cityMoves: Partial<Record<string, CityMove>> = {
  tenxresults: {
    from: "Hisar", fromNote: "GJUST years", to: "Gurgaon", toNote: "First job", when: "Aug 2019",
    seat: "Intern", gate: "TNX", brand: "#c08a2e",
    text: "After college I moved to Gurgaon. It was home base for the next four and a half years: tenxresults, freelance work, then Tulr, Videobug and Unlogged, all remote.",
  },
  kodo: {
    from: "Gurgaon", fromNote: "Remote years", to: "Pune", toNote: "Kodo · YC W21", when: "Feb 2024",
    seat: "Lead PD", gate: "W21", brand: "#ef7a81",
    text: "The remote years in Gurgaon ended. I moved to Pune to join Kodo in person. The founder thread pauses here, and comes back two years later.",
  },
  "100x": {
    from: "Pune", fromNote: "Kodo years", to: "Bangalore", toNote: "100x.bot", when: "Dec 2025",
    seat: "Des. Eng", gate: "100x", brand: "#5fb83a",
    text: "Kodo wrapped up, and the founder thread picked up again. I moved to Bangalore to join 100x.bot, a third product with the same founders.",
  },
}

const wallzy = job("Wallzy")
const tenx = job("tenxresults")
const freelance = job("Freelance")
const tulr = job("Tulr")
const unlogged = job("Unlogged")
const kodo = job("Kodo")
const hundredX = job("100x.bot")
const current = job("Freelancing")

export const timelineChapters: Array<TimelineChapter> = [
  {
    id: "college", act: "spark", n: "01", year: "2014", period: profile.education.years,
    company: "GJUST", role: profile.education.degree, brand: "#8b7cf6",
    eyebrow: "The first spark", title: "I started with the tools,", emphasis: "not a job title.",
    story: "I'm a self-taught designer. VFX hooked me in school, in 11th and 12th, so I started learning After Effects, then Premiere Pro and Illustrator. Through college I ran a YouTube channel, shot photos and posted VFX edits on Instagram, just because I loved making things.",
    stat: { value: 428, label: "YouTube subscribers · 18 videos" },
    links: [{ href: "https://www.instagram.com/akssmax", label: "Instagram" }, { href: "https://www.youtube.com/@akshaysainiAK", label: "YouTube" }, { href: "https://500px.com/p/akssmax", label: "500px" }],
    picks: ["After Effects", "Premiere Pro", "Illustrator", "Photography"],
    tags: ["VFX", "Motion", "YouTube", "Photography", "Vectors"],
    scene: { kind: "tools" },
  },
  {
    id: "wallzy", act: "spark", n: "02", year: "2017", period: wallzy.period,
    company: wallzy.company, role: wallzy.role, brand: "#ee2c75", logo: "/journey/wallzy-logo.png",
    eyebrow: "First thing in the wild", title: "A wallpaper app became my", emphasis: "first real product.",
    story: "Built with a friend during college: an Android app for discovering wallpapers and editing them in place.",
    stat: { value: 100000, suffix: "+", label: "installs" },
    people: [{ name: "Wally (phpmalik)", role: "Co-creator" }],
    picks: ["Mobile UI", "App branding"],
    honest: { missed: "Wallzy is gone from the Play Store now. We built it and launched it, but stopped looking after it.", taught: "Launching is the start. A product needs someone to keep caring for it." },
    tags: ["Co-founded", "Brand", "Editing tools"],
    scene: {
      kind: "tabs",
      tabs: [
        { label: "Daily walls", caption: "A fresh feed every day.", shot: { img: "/journey/wallzy-daily.png", alt: "Wallzy Play Store artwork: daily walls" } },
        { label: "Edit in place", caption: "Text, blur, exposure, fonts.", shot: { img: "/journey/wallzy-editor.png", alt: "Wallzy Play Store artwork: editing tools" } },
        { label: "Favorites", caption: "Collections you keep.", shot: { img: "/journey/wallzy-favorites.png", alt: "Wallzy Play Store artwork: favorites" } },
      ],
    },
  },
  {
    id: "tenxresults", act: "spark", n: "03", year: "2019", period: tenx.period,
    company: tenx.company, role: tenx.role, brand: "#c08a2e", compact: true,
    eyebrow: "The first studio", title: "An internship that was", emphasis: "a bit of everything.",
    story: "Branding, print, social ads, WordPress and video editing taught me to switch mediums quickly.",
    picks: ["Print", "Social ads", "WordPress"],
    tags: ["Branding", "Print", "Social ads", "WordPress", "Video"],
    scene: { kind: "none" },
  },
  {
    id: "freelance", act: "builder", n: "04", year: "2020", period: freelance.period,
    company: freelance.company, role: freelance.role, brand: "#d0743c", milestone: "The UX journey begins",
    eyebrow: "Side quests · learning UX", title: "I made things for early teams,", emphasis: "and learned UX on the way.",
    story: "I taught myself Figma and UX theory, ran design sprints, picked up Lean UX and earned the UXDMC certification. I built Tenxgeeks with a friend, and a few months of contract work for Tulr turned into a founding role.",
    picks: ["Figma", "UX research", "Design sprints", "Lean UX"],
    tags: ["Figma", "UXDMC certified", "Tenxgeeks", "Strictly4Men", "Contract: Tulr"],
    scene: {
      kind: "tabs",
      ms: 4200,
      tabs: [
        { label: "Figma", caption: "Frames, components and auto layout, self-taught", shot: { visual: "figma" } },
        { label: "UX theory", caption: "Research before pixels: discover, define, develop, deliver", shot: { visual: "theory" } },
        { label: "Design sprint", caption: "Five days from a problem to a tested prototype", shot: { visual: "sprint" } },
        { label: "Lean UX", caption: "Think, make, check, and go round again", shot: { visual: "lean" } },
        { label: "UXDMC", caption: "UX Design Masterclass, completed Sep 2020", shot: { visual: "cert" }, link: { href: "https://www.credential.net/0f642f4c-0f1c-40ac-9281-301950541210", label: "View credential" } },
      ],
    },
  },
  {
    id: "tulr", act: "builder", n: "05", year: "2021", period: tulr.period,
    company: tulr.company, role: tulr.role, brand: "#673ee6", logo: "/companies/tulr.svg",
    founder: { step: 1 },
    eyebrow: "The builder era", title: "What if work tools clicked together", emphasis: "like building blocks?",
    story: "Video, tables, forms, calendars and automation in one no-code workspace. Sole designer, seven developers, one founder.",
    stat: { value: 5, prefix: "#", label: "Product of the Day" },
    people: [{ name: "Shardul Lavekar", role: "Founder" }],
    links: [{ href: "https://www.producthunt.com/products/tulr-io", label: "Product Hunt" }],
    caseStudy: "tulr",
    picks: ["Design systems", "Working with developers", "Launch campaigns"],
    honest: { missed: "Tulr never got past 1,000 users. One tool that replaced Airtable, Typeform, Calendly and Loom had to beat all four at once.", taught: "Be the best at one thing before trying to do five." },
    tags: ["700+ components", "Brand", "Launch"],
    scene: {
      kind: "tabs",
      tabs: [
        { label: "▦ Table", caption: "one block instead of Airtable", shot: { img: "/journey/tulr-tables.jpg", alt: "Tulr tables" } },
        { label: "▶ Video", caption: "one block instead of Loom", shot: { img: "/journey/tulr-video.jpg", alt: "Tulr video" } },
        { label: "☰ Form", caption: "one block instead of Typeform", shot: { visual: "form" } },
        { label: "◷ Calendar", caption: "one block instead of Calendly", shot: { img: "/journey/tulr-calendar.jpg", alt: "Tulr calendar" } },
      ],
    },
  },
  {
    id: "videobug", act: "rewind", n: "06", year: "2022", period: "2022",
    company: "Videobug", role: unlogged.role, brand: "#ee524f", logo: "/journey/videobug-logo.webp",
    founder: { step: 2 },
    eyebrow: "Debugging, rewound", title: "We gave developers", emphasis: "a rewind button.",
    story: "A time-travel debugger for the JVM. My designs carried the YC application end to end: product, pitch deck, marketing. We got into YC S22.",
    stat: { value: 22, prefix: "YC S", label: "batch" },
    people: [{ name: "Shardul Lavekar", role: "Co-founder" }, { name: "Parth Mudgal", role: "Co-founder" }, { name: "Amogh CR", role: "Developer" }],
    links: [{ href: "https://www.producthunt.com/products/videobug", label: "Product Hunt" }],
    caseStudy: "unlogged",
    picks: ["Pitch decks", "Developer tools"],
    honest: { missed: "Developers liked the idea of time travel more than they used it. What they kept asking for was mocks and generated tests.", taught: "Follow what users keep asking for, even when it means renaming the company." },
    tags: ["IntelliJ plugin", "YC deck", "Brand"],
    scene: {
      kind: "rewind",
      shots: [
        { img: "/journey/videobug-time-travel.jpg", alt: "Videobug launch artwork: Time travel your code" },
        { img: "/journey/videobug-fix-bugs.jpg", alt: "Videobug launch artwork: find the moment it broke" },
        { img: "/journey/videobug-stop-guessing.jpg", alt: "Videobug launch artwork: stop guessing" },
      ],
    },
  },
  {
    id: "unlogged", act: "rewind", n: "07", year: "2023", period: unlogged.period,
    company: unlogged.company, role: unlogged.role, brand: "#24b8d5", logo: "/companies/unlogged.svg",
    founder: { step: 2, continued: true },
    eyebrow: "The product evolves", title: "From watching a bug", emphasis: "to replaying a fix.",
    story: "Videobug grew into Unlogged: record, replay, mock and generate tests for Java. Two brands, two design systems, one team.",
    stat: { value: 638, label: "upvotes · #4 of the day" },
    quote: { text: "Super hard working, very committed, and loyal.", by: "Shardul Lavekar, co-founder" },
    links: [{ href: "https://www.producthunt.com/products/unlogged", label: "Product Hunt" }],
    caseStudy: "unlogged",
    picks: ["User testing", "Webflow", "Motion in Jitter"],
    honest: { missed: "Unlogged came just before LLMs changed how developers write tests. The team wound it down and moved on to 100x.bot.", taught: "Timing matters as much as craft. A good product can still arrive at the wrong moment." },
    tags: ["2 design systems", "Webflow", "Jitter"],
    scene: {
      kind: "log",
      ms: 4200,
      tabs: [
        { label: "▶ Replay method", shot: { img: "/journey/unlogged-replay.jpg", alt: "Unlogged: replay a method" }, lines: ["capturing OrderService.checkout()", "replaying with recorded inputs", "✓ returned 200 in 41ms"] },
        { label: "◇ Mock a call", shot: { img: "/journey/unlogged-mocks.jpg", alt: "Unlogged: mock a call" }, lines: ["intercepting PaymentClient.charge()", "returning mocked { status: DECLINED }", "✓ fallback path covered"] },
        { label: "✓ Generate test", shot: { img: "/journey/unlogged-tests.jpg", alt: "Unlogged: generate a test" }, lines: ["reading recorded run", "writing CheckoutServiceTest.java", "✓ 4 JUnit tests passing"] },
      ],
    },
  },
  {
    id: "kodo", act: "scale", n: "08", year: "2024", period: kodo.period,
    company: kodo.company, role: kodo.role, brand: "#ef7a81", logo: "/companies/kodo.svg",
    eyebrow: "Design at scale", title: "An ERP that bends to", emphasis: "every company's process.",
    story: "YC W21 fintech. I led design for procure-to-pay v1, from discovery with the first enterprise customers to rollout with redBus and Brndme. Configured, not customised.",
    stat: { value: 1000, suffix: "+", label: "components · 2 design systems" },
    quote: { text: "Strong product and UI thinking, execution speed, and ownership.", by: "Gaurav Thapa, CTO" },
    people: [{ name: "Gaurav Thapa", role: "CTO" }, { name: "Deepti Sanghi", role: "Co-founder" }, { name: "Tumul Roy" }, { name: "Yash Mohite" }],
    links: [{ href: "https://www.kodo.com/", label: "kodo.com" }],
    caseStudy: "kodo",
    picks: ["Enterprise UX", "Tamagui", "Material 3", "Leading design"],
    honest: { missed: "Reimbursements, Travel and the card app revamp were designed but never shipped.", taught: "Ship v1 well before polishing v2. Designs that never ship don't help anyone." },
    tags: ["P2P v1", "Tamagui + MD3", "NPCI Bharat Connect", "Framer site"],
    scene: {
      kind: "approval",
      steps: ["Request", "Manager", "Finance", "PO", "Paid"],
      shots: [
        { img: "/projects/kodo/p2p/approval-detail.webp", alt: "Kodo P2P approval detail", caption: "Approver's view of a purchase requisition" },
        { img: "/projects/kodo/p2p/approval-detail.webp", alt: "Kodo P2P approval detail", caption: "Multi-level approval, maker-checker" },
        { img: "/projects/kodo/p2p/mailbox.webp", alt: "Kodo P2P mailbox", caption: "Invoices captured from email" },
        { img: "/journey/kodo-workflows.avif", alt: "Kodo purchase order workflow builder", caption: "Purchase order workflow builder" },
        { img: "/projects/kodo/p2p/zoho-integration.webp", alt: "Kodo Zoho integration", caption: "Synced to Zoho and Tally ledgers" },
      ],
    },
  },
  {
    id: "100x", act: "agents", n: "09", year: "2025", period: hundredX.period,
    company: hundredX.company, role: hundredX.role, brand: "#5fb83a", logo: "/companies/100x-bot.png",
    founder: { step: 3 },
    eyebrow: "Agentic AI", title: "I designed the work", emphasis: "AI can do with us.",
    story: "Back with the same founders for a third product: a browser agent. I designed in Figma and shipped in code, and managed two junior developers.",
    people: [{ name: "Shardul Lavekar" }, { name: "Parth Mudgal" }, { name: "Samarth RS", role: "Designer" }],
    links: [{ href: "https://100x.bot/", label: "100x.bot" }],
    caseStudy: "v1-100x-proto",
    picks: ["Agent UI", "React + shadcn/ui", "Managing developers"],
    tags: ["Chromium extension", "Agent UI", "shadcn/ui"],
    scene: {
      kind: "log",
      ms: 4400,
      thinking: true,
      tabs: [
        { label: "Record a workflow", shot: { img: "/journey/100x/live-record.webp", alt: "100x.bot home page: automate work with just a screen recording" }, lines: ["Recording your clicks in the browser…", "3,000+ workflows built this way", "✓ Replays on its own"] },
        { label: "Site to table", shot: { img: "/journey/100x/live-tables.webp", alt: "100x.bot Smart Tables: turn websites into living tables" }, lines: ["Scraping the page into rows…", "Ask questions in plain English", "✓ 3.2M rows scraped so far"] },
        { label: "Boost a page", shot: { img: "/journey/100x/live-web.webp", alt: "100x.bot Page Boosters: custom buttons on any site" }, lines: ["Adding a button to x.com…", "Runs locally, even on restricted sites", "✓ Your agent, one click away"] },
        { label: "Dashboard", shot: { img: "/journey/100x/live-dashboards.webp", alt: "100x.bot Smart Apps: dashboards from boring data" }, lines: ["Build a CRM to track your team's leads…", "Charts and tables from the data", "✓ 5,400+ apps generated"] },
        { label: "Design system", shot: { img: "/projects/v1-100x-proto/design-system.webp", alt: "100x design system" }, lines: ["Loading tokens and themes…", "shadcn/ui base, AI-native parts", "✓ 1 system for every surface"] },
      ],
    },
  },
  {
    id: "now", act: "agents", n: "10", year: "Now", period: current.period,
    company: "Independent", role: current.role, brand: "#0f8f84",
    eyebrow: "Independent", title: "Designing products and", emphasis: "shipping them myself.",
    story: "Client work and my own launches, designed and built end to end with Claude Code and Codex.",
    tags: [],
    scene: {
      kind: "shipped",
      ms: 4200,
      items: [
        { name: "Indus", blurb: "Website for a mega food park", kind: "Client", status: "Live", host: "indusbestmegafoodpark.com", url: "https://www.indusbestmegafoodpark.com/", caseStudy: "indus-best-mega-food-park", shot: { img: "/projects/indus/hero.webp", alt: "Indus Best Mega Food Park website" } },
        { name: "Cue", blurb: "A DJ studio in the browser", kind: "My product", status: "Beta", host: "dj-app-kappa.vercel.app", url: "https://dj-app-kappa.vercel.app/", caseStudy: "cue-dj-studio", shot: { img: "/projects/cue/automix.webp", alt: "Cue transition assistant" } },
        { name: "Ion", blurb: "Mail and calendar for teams", kind: "My product", status: "Live", host: "ion-workspace.vercel.app", url: "https://ion-workspace.vercel.app/", caseStudy: "ion-workspace", shot: { img: "/projects/ion/mail.webp", alt: "Ion Workspace mail" } },
        { name: "Postforge", blurb: "Social posts that follow your brand", kind: "My product", status: "Live", host: "postforge-kohl.vercel.app", url: "https://postforge-kohl.vercel.app/", caseStudy: "postforge", shot: { img: "/projects/postforge/tool.webp", alt: "Postforge design tool" } },
      ],
    },
  },
]

export function findTimelineChapter(id: string) {
  return timelineChapters.find((chapter) => chapter.id === id)
}
