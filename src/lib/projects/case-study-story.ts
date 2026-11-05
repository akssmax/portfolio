export type CaseStudyMedia = {
  /** Stable slot for replacing a placeholder with an original design export later. */
  id: string
  title: string
  caption: string
  alt?: string
  src?: string
  format: "wide" | "standard"
}

export type CaseStudyPrototype = {
  id: string
  title: string
  description: string
  previewTitle: string
  url: string
  /** Eg. "Interactive prototype" */
  eyebrow?: string
  /** Eg. "Open the prototype in Figma" */
  openLabel?: string
}

export type CaseStudyChapter = {
  id: string
  number: string
  label: string
  title: string
  introduction: string
  problem: string
  responsibility: string
  approach: string
  decisions: Array<string>
  decisionLabel?: string
  shipped: string
  shippedLabel?: string
  media: Array<CaseStudyMedia>
  publicLink?: { label: string; href: string }
  /** Renders a full-width prototype section directly after this chapter. */
  prototype?: CaseStudyPrototype
}

export type CaseStudyPerson = {
  name: string
  context: string
  href?: string
}

export type CaseStudyFact = {
  value: string
  label: string
  href?: string
}

export type CaseStudySystemCard = {
  name: string
  usedFor: string
  points: Array<string>
}

export type CaseStudyStory = {
  title: string
  description: string
  role: string
  period: string
  /** Short proof points shown under the hero description. */
  facts?: Array<CaseStudyFact>
  /** Optional research section, rendered between the chapters and the system. */
  research?: {
    eyebrow: string
    title: string
    body: string
    items: Array<{ title: string; detail: string }>
  }
  context: string
  remit: string
  brief: {
    eyebrow: string
    title: string
  }
  chapters: Array<CaseStudyChapter>
  pullQuote?: {
    text: string
    attribution: string
  }
  system: {
    eyebrow: string
    title: string
    body: string
    systems?: Array<CaseStudySystemCard>
    mediaSlot: {
      title: string
      description: string
    }
    people: {
      eyebrow: string
      intro: string
      entries: Array<CaseStudyPerson>
      link?: { label: string; href: string }
    }
  }
  outcomes: {
    eyebrow: string
    title: string
    releasesLabel: string
    releases: Array<string>
    lessonsLabel: string
    lessons: Array<string>
    footnote: string
  }
  nav: {
    overview: string
    research?: string
    system: string
    outcomes: string
  }
}

export type CaseStudyColors = {
  heroBg: string
  heroInk: string
  heroSub: string
  heroMuted: string
  heroChipBg: string
  heroChipBorder: string
  chipBg: string
  chipBorder: string
  chipInk: string
  divider: string
  accent: string
  accentStrong: string
  accentHover: string
  accentBorder: string
  cardHoverBg: string
  altBg: string
  placeholderBg: string
  placeholderBorder: string
  placeholderIconBg: string
  placeholderIconBorder: string
  placeholderIconInk: string
  placeholderEyebrow: string
  placeholderInk: string
  placeholderSub: string
  mediaBg: string
  wave: string
  waveHover: string
}

export type CaseStudyPalette = {
  light: CaseStudyColors
  dark: CaseStudyColors
}

export const unloggedCaseStudy = {
  title: "Videobug → Unlogged: from rewinding a bug to replaying a fix.",
  description:
    "As founding designer from before YC to after the pivot, I designed Videobug, a time-travel debugger for Java, and then Unlogged, which recorded and replayed Java code to mock calls and generate tests. Plugin, dashboard, brands, websites and the YC application.",
  role: "Founding Designer",
  period: "Dec 2021 – Jan 2024",
  facts: [
    { value: "YC S22", label: "Accepted as Videobug" },
    {
      value: "#4",
      label: "Unlogged · Product of the Day, 638 upvotes",
      href: "https://www.producthunt.com/products/unlogged",
    },
    {
      value: "#10",
      label: "Videobug · Product of the Day, 104 upvotes",
      href: "https://www.producthunt.com/products/videobug",
    },
    { value: "2 brands", label: "Two products, two design systems" },
  ],
  context:
    "Videobug recorded how Java code ran so developers could step back through an execution inside IntelliJ instead of guessing from logs. Developers found more value in what the recordings made possible next: mocking calls and generating tests. The product pivoted and was rebranded as Unlogged, an open-source IntelliJ plugin with a web dashboard for recording, replaying and testing Java code.",
  remit:
    "I joined in December 2021, before YC, as the founding designer and stayed through January 2024. I designed both products end to end: the IntelliJ plugin, the web dashboard, both brands and design systems, the websites, launch motion and marketing videos, and the product, pitch decks and marketing used in the YC application.",
  brief: {
    eyebrow: "The brief",
    title: "One team, two products, one developer loop.",
  },
  chapters: [
    {
      id: "videobug",
      number: "01",
      label: "Videobug",
      title: "Give Java developers a rewind button.",
      introduction:
        "Videobug's promise was simple: record a run, then travel back through it to find the moment the code broke.",
      problem:
        "Debugging a backend bug usually means adding logs, redeploying and guessing. Time-travel debugging is powerful, but it was a new idea for most Java developers, and it had to fit inside an IDE they already knew well.",
      responsibility:
        "As the only designer, I designed the debugger experience in IntelliJ, the Videobug brand and website, and the product, pitch decks and marketing used end to end in our YC application.",
      approach:
        "Make the idea easy to grasp in one line and one picture: stop guessing, rewind your code, see what went wrong. The same message ran through the plugin, the launch artwork and the pitch.",
      decisions: [
        "Frame the product around one promise, time travel through your code, rather than a list of debugger features.",
        "Keep recorded values inside the editor, next to the code, instead of in a separate tool.",
        "Use one visual language across the product, the YC application and the launch.",
      ],
      shipped:
        "The Videobug IntelliJ plugin, website and brand, the YC S22 application materials, and a Product Hunt launch that reached #10 Product of the Day.",
      publicLink: {
        label: "Videobug on Product Hunt",
        href: "https://www.producthunt.com/products/videobug",
      },
      media: [
        {
          id: "videobug-time-travel",
          title: "Time travel your code",
          caption: "Original Videobug launch artwork",
          src: "/journey/videobug-time-travel.jpg",
          alt: "Original Videobug Product Hunt artwork reading Time Travel Your Code",
          format: "wide",
        },
        {
          id: "videobug-stop-guessing",
          title: "Stop guessing",
          caption: "Original Videobug launch artwork",
          src: "/journey/videobug-stop-guessing.jpg",
          alt: "Videobug artwork reading Stop Guessing: see what's wrong with the code and push the fix in minutes",
          format: "standard",
        },
        {
          id: "videobug-fix-bugs",
          title: "Find the moment it broke",
          caption: "Original Videobug launch artwork",
          src: "/journey/videobug-fix-bugs.jpg",
          alt: "Original Videobug Product Hunt feature artwork about fixing bugs",
          format: "standard",
        },
        {
          id: "videobug-debugger-ui",
          title: "The debugger inside IntelliJ",
          caption: "Original design export to be added",
          format: "wide",
        },
      ],
    },
    {
      id: "pivot",
      number: "02",
      label: "The pivot",
      title: "Follow what developers actually valued.",
      introduction:
        "Talking to developers and watching them use Videobug changed the product. The recordings mattered most for what came after debugging.",
      problem:
        "Developers liked rewinding a bug, but they kept coming back to two things the recordings made possible: mocking downstream calls and turning real runs into tests. This was before the LLM era, so generating tests from real behaviour was a real unlock.",
      responsibility:
        "I took part in the research and testing behind the shift, and then redesigned the product and created a new brand for Unlogged.",
      approach:
        "Keep the core technology, recording how code runs, and change the job it does: from watching a bug to replaying, mocking and testing a fix.",
      decisions: [
        "Rename and rebrand as Unlogged, so the product no longer read as only a debugger.",
        "Reorganise the plugin around record, replay, mock and test.",
        "Release Unlogged as open source.",
      ],
      decisionLabel: "What changed",
      shipped:
        "Unlogged: a new brand, product structure and design system, launched on Product Hunt as an open-source project, reaching #4 Product of the Day.",
      media: [
        {
          id: "pivot-unlogged-replay",
          title: "From watching a bug to replaying a fix",
          caption: "Unlogged product image",
          src: "/journey/unlogged-replay.jpg",
          alt: "Unlogged product image showing test replay in the IDE",
          format: "wide",
        },
      ],
    },
    {
      id: "plugin-ux",
      number: "03",
      label: "Plugin UX",
      title:
        "Bring record, replay and testing into the editor without getting in the way.",
      introduction:
        "Developer tools live where every pixel competes with code. The plugin had to make complex backend workflows readable inside IntelliJ.",
      problem:
        "Capturing method inputs, replaying them, injecting mocks and generating tests are powerful, but the IDE gives them little room and no patience for clutter.",
      responsibility:
        "I designed the plugin flows end to end: record and replay, runtime mocking, JUnit test generation and method performance tracking.",
      approach:
        "Map each capability to a step in the developer's loop, observe, isolate, verify, so a developer can go from a failing request to a passing test without leaving the editor.",
      decisions: [
        "Record and replay captures method inputs and return values, so code can be replayed locally without calling HTTP endpoints.",
        "Runtime mocking injects recorded data for APIs, database calls and downstream services.",
        "JUnit generation turns a recorded scenario into a unit test, with framework and serializer choices.",
        "Performance tracking shows method-level execution times and bottlenecks while you code.",
      ],
      decisionLabel: "What the plugin does",
      shipped:
        "The Unlogged IntelliJ plugin with record and replay, runtime mocking, JUnit generation and performance tracking. The founders reported it reduced debugging time by up to 2 hours per day.",
      media: [
        {
          id: "plugin-mocks",
          title: "Mock a response at runtime",
          caption: "Unlogged product image",
          src: "/journey/unlogged-mocks.jpg",
          alt: "Unlogged product image showing runtime mocking controls in an IDE",
          format: "standard",
        },
        {
          id: "plugin-tests",
          title: "Turn a run into a test",
          caption: "Unlogged product image",
          src: "/journey/unlogged-tests.jpg",
          alt: "Unlogged product image showing a generated test",
          format: "standard",
        },
        {
          id: "plugin-flows",
          title: "Plugin flows in IntelliJ",
          caption: "Original design export to be added",
          format: "wide",
        },
      ],
    },
    {
      id: "dashboard-website",
      number: "04",
      label: "Dashboard & web",
      title: "Explain bytecode instrumentation to skeptical engineers.",
      introduction:
        "Outside the IDE, the web dashboard, the website, launch motion and videos had to earn trust from backend engineers without dumbing the story down.",
      problem:
        "Record and replay, runtime mocking and test generation are technical ideas. Teams evaluating the plugin needed to understand them quickly, and engineers needed to see the depth.",
      responsibility:
        "I designed the web dashboard, designed the website in Figma and built it in Webflow, made UI animations in Jitter, and produced marketing videos.",
      approach:
        "Lead with the developer outcome, mock, monitor, replay and test, then open into features, guides and the open-source story. Motion shows the product working instead of describing it.",
      decisions: [
        "Lead with the four things developers already ask for.",
        "Keep technical depth visible instead of hiding it behind marketing language.",
        "Use the open-source and YC story to build credibility with early adopters.",
      ],
      shipped:
        "The Unlogged web dashboard, the Webflow website, Jitter UI animations and marketing videos. Both the Videobug and Unlogged websites shipped; neither is online today.",
      publicLink: {
        label: "Unlogged on Product Hunt",
        href: "https://www.producthunt.com/products/unlogged",
      },
      media: [
        {
          id: "site-hero",
          title: "Mock, monitor, replay, and test",
          caption: "Website capture · homepage",
          src: "/projects/unlogged/hero.webp",
          alt: "Unlogged website hero with the Mock, Monitor, Replay, and Test message",
          format: "wide",
        },
        {
          id: "site-features",
          title: "Feature storytelling",
          caption: "Website capture · features",
          src: "/projects/unlogged/features.webp",
          alt: "Unlogged website features section",
          format: "standard",
        },
        {
          id: "site-about",
          title: "Company story and team",
          caption: "Website capture · about",
          src: "/projects/unlogged/about.webp",
          alt: "Unlogged about page with the YC journey and founding team",
          format: "standard",
        },
        {
          id: "dashboard",
          title: "The web dashboard",
          caption: "Original design export to be added",
          format: "wide",
        },
      ],
    },
  ] satisfies Array<CaseStudyChapter>,
  pullQuote: {
    text: "We are the early adopters of Unlogged to automatically generate the unit test cases for our Java code. We were pleasantly surprised to see the results of what this plugin provided us that normally used to take manual efforts of ~2-3 hours by our developers.",
    attribution: "Pranav Khambayatkar — VP & Head of Engineering",
  },
  research: {
    eyebrow: "Research",
    title: "Built with developers, not just for them.",
    body: "Research ran through both products. It shaped the details of the plugin, and it was a big part of why Videobug became Unlogged.",
    items: [
      {
        title: "Developer interviews",
        detail:
          "Conversations with Java developers about how they debug and test.",
      },
      {
        title: "Usability tests",
        detail:
          "Watching developers use the plugin and prototypes, then fixing what slowed them down.",
      },
      {
        title: "Early-customer feedback",
        detail: "Regular feedback from early adopters and design partners.",
      },
      {
        title: "Analytics",
        detail:
          "Plugin and dashboard usage data to see which features people relied on.",
      },
    ],
  },
  system: {
    eyebrow: "Design systems",
    title: "Two brands, two systems, one small team.",
    body: "Each product had its own brand and its own design system. A small token set and component base kept the plugin, dashboard and website consistent, so a small team could ship across product and marketing without drift.",
    systems: [
      {
        name: "Videobug",
        usedFor: "Debugger, website and YC materials",
        points: [
          "Brand, logo and launch artwork",
          "Used across the debugger and the website",
          "Carried into the YC application materials",
        ],
      },
      {
        name: "Unlogged",
        usedFor: "Plugin, web dashboard and website",
        points: [
          "New brand after the pivot",
          "Built on a modified Chakra UI",
          "Used across the plugin, dashboard and website",
        ],
      },
    ],
    mediaSlot: {
      title: "Design system library",
      description:
        "Original components and patterns will be added with the design files.",
    },
    people: {
      eyebrow: "People I worked with",
      intro:
        "Shardul Lavekar and Parth Mudgal co-founded the company, and Amogh CR was a developer on the team. The same team carried the product from Videobug to Unlogged.",
      entries: [
        {
          name: "Shardul Lavekar",
          context: "Co-founder",
        },
        {
          name: "Parth Mudgal",
          context: "Co-founder",
        },
        {
          name: "Amogh CR",
          context: "Developer",
        },
      ],
    },
  },
  outcomes: {
    eyebrow: "In retrospect",
    title: "What shipped, and what stayed with me.",
    releasesLabel: "Work and releases",
    releases: [
      "Videobug: IntelliJ debugger plugin, brand, website, and the YC S22 application materials. #10 Product of the Day.",
      "Unlogged: IntelliJ plugin for record and replay, runtime mocking, JUnit generation and performance tracking. #4 Product of the Day, open source.",
      "The Unlogged web dashboard, Webflow website, Jitter UI animations and marketing videos.",
      "Two brands and two design systems, one built on a modified Chakra UI.",
    ],
    lessonsLabel: "Lessons learned",
    lessons: [
      "Listen to what users do with a product, not only what it was built for. That is how Videobug became Unlogged.",
      "Developer tools earn trust through clarity, not simplification.",
      "Designing inside an IDE means respecting a surface that already has no room to spare.",
    ],
    footnote:
      "The reduction in debugging time is the founders' figure, not a measurement of my own. The Videobug and Unlogged websites and the JetBrains plugin listing are no longer online.",
  },
  nav: {
    overview: "Overview",
    research: "Research",
    system: "Design systems",
    outcomes: "Takeaways",
  },
} satisfies CaseStudyStory

export const tulrCaseStudy = {
  title: "Tulr: one workspace for the tools teams duct-taped together.",
  description:
    "At Tulr I designed a pre-LLM no-code builder that combined videos, tables, forms, and calendars with automation—a one-shot replacement for Airtable, Typeform, Calendly, and Loom.",
  role: "UX Designer",
  period: "Feb 2021 – Dec 2021",
  context:
    'Tulr.io let teams combine videos, tables, forms, and calendars, then layer automation on top to build internal apps without writing code. It shipped in the early no-code wave—before LLMs made "describe your app" the default onboarding pattern.',
  remit:
    "I joined as UX designer at AuthMe Id Services, working with founder Shardul Lavekar and a team of seven developers to design the mobile and web builder, a 700+ component library, brand system, and Product Hunt launch.",
  brief: {
    eyebrow: "The brief",
    title: "Four primitives, one composable builder.",
  },
  chapters: [
    {
      id: "builder",
      number: "01",
      label: "The builder",
      title: "Teach four product metaphors inside one canvas.",
      introduction:
        "Spreadsheet, form, scheduler, and async video each carry their own mental model into the same builder.",
      problem:
        "Non-technical makers had to pick a primitive, wire automation, and ship an app—without a copilot to explain the steps.",
      responsibility:
        "I owned end-to-end product design for the mobile and web builder, from empty states and onboarding through automation flows.",
      approach:
        "Primitive-first navigation keeps videos, tables, forms, and calendars visible as first-class building blocks instead of burying them in settings.",
      decisions: [
        "Surface primitives in navigation rather than in buried settings.",
        "Use template galleries and progressive disclosure instead of prompt-based setup.",
        "Keep automation readable so non-technical makers can follow the chain.",
      ],
      shipped:
        "Mobile and web product design for the no-code builder, including onboarding, empty states, and automation flows.",
      shippedLabel: "Work status",
      publicLink: {
        label: "View on Product Hunt",
        href: "https://www.producthunt.com/products/tulr-io",
      },
      media: [
        {
          id: "builder-ui",
          title: "Builder workspace",
          caption: "Product capture · builder",
          src: "/projects/tulr/product.jpg",
          alt: "Tulr no-code builder interface with tables, forms, and automation",
          format: "wide",
        },
        {
          id: "builder-mobile",
          title: "Mobile builder",
          caption: "Product capture · mobile",
          src: "/projects/tulr/mobile.webp",
          alt: "Tulr mobile builder",
          format: "standard",
        },
      ],
    },
    {
      id: "library",
      number: "02",
      label: "Component library",
      title: "700+ components so engineering could ship without drift.",
      introduction:
        "A shared base design system kept a fast-moving team consistent across every screen.",
      problem:
        "Without a component base, seven developers building quickly produce seven versions of the same control.",
      responsibility:
        "I built the component library and base design system alongside the product work.",
      approach:
        "Variants were catalogued so engineering could assemble screens from approved pieces instead of inventing one-off UI.",
      decisions: [
        "Build variants on a shared base instead of bespoke screens.",
        "Document states so non-designers can assemble consistently.",
        "Treat the library as a product, not a one-time deliverable.",
      ],
      shipped:
        "A 700+ component library with a shared base design system across the builder surfaces.",
      shippedLabel: "Work status",
      media: [
        {
          id: "library-overview",
          title: "Component library",
          caption: "Original component sheets to be added",
          format: "wide",
        },
        {
          id: "library-templates",
          title: "Template gallery",
          caption: "Original template screens to be added",
          format: "standard",
        },
      ],
    },
    {
      id: "launch",
      number: "03",
      label: "Launch",
      title: "Give a new category a clear consolidation story.",
      introduction: "Tulr's pitch was subtraction: four tools, one workspace.",
      problem:
        "A new no-code platform had to explain, in one pass, why teams should stop duct-taping separate tools together.",
      responsibility:
        "I designed the branding, UI motion, social assets, and the Product Hunt launch.",
      approach:
        "The one-tool positioning leads the story, with templates for applicant tracking, email marketing, and video pitches showing where it fits.",
      decisions: [
        "Lead with consolidation—one workspace instead of four subscriptions.",
        "Show concrete templates so the promise is easy to picture.",
        "Use motion and social assets to carry the brand through launch.",
      ],
      shipped:
        "Branding, UI animation, social media, and the Product Hunt launch.",
      shippedLabel: "Work status",
      media: [
        {
          id: "launch-hero",
          title: "One tool to rule them all",
          caption: "Launch creative · unified no-code positioning",
          src: "/projects/tulr/hero.png",
          alt: "Tulr marketing creative with the One tool to rule them all message",
          format: "wide",
        },
      ],
    },
  ] satisfies Array<CaseStudyChapter>,
  system: {
    eyebrow: "The connecting thread",
    title: "A design system built for scale.",
    body: "The 700+ component library gave Tulr a consistent base across a fast-moving builder. A shared token and component language let seven developers ship different parts of the product without the interface drifting.",
    mediaSlot: {
      title: "Component library",
      description:
        "Original component sheets and patterns will be added with the design files.",
    },
    people: {
      eyebrow: "People I worked with",
      intro:
        "Shardul Lavekar was the direct partner on this work, alongside the engineering team at AuthMe Id Services.",
      entries: [
        {
          name: "Shardul Lavekar",
          context: "Founder",
          href: "https://www.producthunt.com/products/tulr-io",
        },
      ],
    },
  },
  outcomes: {
    eyebrow: "In retrospect",
    title: "What shipped, and what stayed with me.",
    releasesLabel: "Work and releases",
    releases: [
      "Mobile and web no-code builder design.",
      "A 700+ component library with a shared base design system.",
      "Applicant tracking, email marketing, and video pitch templates.",
      "Branding, UI animation, social media, and Product Hunt launch.",
    ],
    lessonsLabel: "Lessons learned",
    lessons: [
      "Clarity of layout and hierarchy has to carry onboarding when there is no copilot to explain the product.",
      "A component library only pays off when it is treated as a product with states and documentation.",
      "Designing for non-technical makers means making the mental model visible on every screen.",
    ],
    footnote:
      "Tulr shipped in the early no-code wave, before chat-native builders changed how makers expect to start.",
  },
  nav: {
    overview: "Overview",
    system: "Design system",
    outcomes: "Takeaways",
  },
} satisfies CaseStudyStory

export const UNLOGGED_PALETTE: CaseStudyPalette = {
  light: {
    heroBg: "#f4f8fd",
    heroInk: "#1a2230",
    heroSub: "#46566b",
    heroMuted: "#5a6b82",
    heroChipBg: "rgba(255, 255, 255, 0.8)",
    heroChipBorder: "#dbe7f4",
    chipBg: "rgba(255, 255, 255, 0.75)",
    chipBorder: "#d6e2f0",
    chipInk: "#3f5573",
    divider: "#d6e2f0",
    accent: "#4f6b96",
    accentStrong: "#2f5f9e",
    accentHover: "#234a7d",
    accentBorder: "#8fb0d8",
    cardHoverBg: "#f5f9fe",
    altBg: "#eef4fb",
    placeholderBg: "#f5f9fe",
    placeholderBorder: "#c6d8ec",
    placeholderIconBg: "#ffffff",
    placeholderIconBorder: "#cfe0f2",
    placeholderIconInk: "#3d6da8",
    placeholderEyebrow: "#587096",
    placeholderInk: "#222d3d",
    placeholderSub: "#61758d",
    mediaBg: "#f4f8fd",
    wave: "#a9c2df",
    waveHover: "#6ea0d8",
  },
  dark: {
    heroBg: "#171c24",
    heroInk: "#eef4fb",
    heroSub: "#cdd9e6",
    heroMuted: "#c2d2e2",
    heroChipBg: "rgba(23, 28, 36, 0.8)",
    heroChipBorder: "#3a4757",
    chipBg: "rgba(23, 28, 36, 0.8)",
    chipBorder: "#3a4757",
    chipInk: "#cfe0f2",
    divider: "#3a4757",
    accent: "#9ec1e8",
    accentStrong: "#bcd8f5",
    accentHover: "#d3e6fa",
    accentBorder: "#5b7595",
    cardHoverBg: "#1d2530",
    altBg: "#1b212a",
    placeholderBg: "#1b212a",
    placeholderBorder: "#46566b",
    placeholderIconBg: "#232b36",
    placeholderIconBorder: "#46566b",
    placeholderIconInk: "#a9c9ee",
    placeholderEyebrow: "#a9c4e6",
    placeholderInk: "#e8f0fa",
    placeholderSub: "#aebed0",
    mediaBg: "#1b212a",
    wave: "#5b7595",
    waveHover: "#82aede",
  },
}

export const TULR_PALETTE: CaseStudyPalette = {
  light: {
    heroBg: "#fdf6ef",
    heroInk: "#241a12",
    heroSub: "#5b4434",
    heroMuted: "#6d5443",
    heroChipBg: "rgba(255, 255, 255, 0.8)",
    heroChipBorder: "#f0ddc9",
    chipBg: "rgba(255, 255, 255, 0.75)",
    chipBorder: "#eddbc9",
    chipInk: "#7a5636",
    divider: "#eddbc9",
    accent: "#a05a2c",
    accentStrong: "#b4551f",
    accentHover: "#8a3f14",
    accentBorder: "#d9a878",
    cardHoverBg: "#fdf8f1",
    altBg: "#fbf4ec",
    placeholderBg: "#fdf8f1",
    placeholderBorder: "#e8cdb0",
    placeholderIconBg: "#ffffff",
    placeholderIconBorder: "#efd9c2",
    placeholderIconInk: "#b06a33",
    placeholderEyebrow: "#9a6a42",
    placeholderInk: "#33241a",
    placeholderSub: "#7c6653",
    mediaBg: "#fdf6ef",
    wave: "#e0b48c",
    waveHover: "#f0a06a",
  },
  dark: {
    heroBg: "#211a15",
    heroInk: "#f8efe6",
    heroSub: "#e6d5c5",
    heroMuted: "#ddc8b4",
    heroChipBg: "rgba(33, 26, 21, 0.8)",
    heroChipBorder: "#564235",
    chipBg: "rgba(33, 26, 21, 0.8)",
    chipBorder: "#564235",
    chipInk: "#edc9a6",
    divider: "#564235",
    accent: "#f0b489",
    accentStrong: "#f6bb90",
    accentHover: "#ffd0ab",
    accentBorder: "#8a6a4f",
    cardHoverBg: "#2a211a",
    altBg: "#211a15",
    placeholderBg: "#211a15",
    placeholderBorder: "#6b5441",
    placeholderIconBg: "#2e241b",
    placeholderIconBorder: "#6b5441",
    placeholderIconInk: "#eec39a",
    placeholderEyebrow: "#e7bf98",
    placeholderInk: "#f6ece0",
    placeholderSub: "#cfbaa6",
    mediaBg: "#211a15",
    wave: "#8a6a4f",
    waveHover: "#e0a878",
  },
}
