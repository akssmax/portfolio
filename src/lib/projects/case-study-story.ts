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
  href: string
}

export type CaseStudyStory = {
  title: string
  description: string
  role: string
  period: string
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
  title: "Unlogged: making a Java devtools plugin feel native to the IDE.",
  description:
    "Across two years at Unlogged, I owned plugin UX inside IntelliJ IDEA, the marketing site, and the product's visual identity—making record/replay, runtime mocking, and automated test generation approachable for Java teams.",
  role: "Product Designer",
  period: "Dec 2021 – Jan 2024",
  context:
    "Unlogged is an open-source IntelliJ IDEA plugin that helps Java developers mock, monitor, replay, and test production traffic locally—with one-click JUnit test generation, runtime mocking, direct method invocation, and performance tracking.",
  remit:
    "After the team made Y Combinator's Summer 2022 batch, I joined as the design lead—owning plugin UX inside the IDE, the marketing site at unlogged.io (designed in Figma, built in Webflow), and the product's visual identity and branding.",
  brief: {
    eyebrow: "The brief",
    title: "Two surfaces, one developer story.",
  },
  chapters: [
    {
      id: "plugin-ux",
      number: "01",
      label: "Plugin UX",
      title:
        "Bring record and replay into the editor without getting in the way.",
      introduction:
        "Developer tools live where every pixel competes with code. The plugin had to make complex backend workflows readable inside IntelliJ.",
      problem:
        "Capturing method inputs, replaying traffic, injecting runtime mocks, and generating tests are powerful capabilities—but the IDE gives them little room and no patience for clutter.",
      responsibility:
        "I designed the plugin flows end to end: record and replay, runtime mocking, JUnit generation, and method performance tracking.",
      approach:
        "Each capability maps to a step in the debugging loop—observe, isolate, verify—so a developer can move from a failing request to a passing test without leaving the editor.",
      decisions: [
        "Record and replay captures method inputs and return values so work can be replayed locally without HTTP endpoints.",
        "Runtime mocking injects recorded data for APIs, database calls, and downstream services.",
        "JUnit generation turns a recorded scenario into a unit test with framework and serializer choices.",
        "Performance tracking surfaces method-level execution thresholds and bottlenecks as you code.",
      ],
      decisionLabel: "What the plugin does",
      shipped:
        "IntelliJ IDEA plugin UX for record/replay, runtime mocking, JUnit generation, and method performance tracking.",
      shippedLabel: "Work status",
      publicLink: {
        label: "Visit Unlogged's website",
        href: "https://www.unlogged.io/",
      },
      media: [
        {
          id: "plugin-overview",
          title: "Record and replay inside IntelliJ",
          caption: "Original plugin screens to be added",
          format: "wide",
        },
        {
          id: "plugin-tests",
          title: "One-click JUnit generation",
          caption: "Original plugin screens to be added",
          format: "standard",
        },
      ],
    },
    {
      id: "website",
      number: "02",
      label: "The website",
      title: "Explain bytecode instrumentation to skeptical engineers.",
      introduction:
        "The public site had to earn trust from backend engineers while still feeling approachable to the teams evaluating the plugin.",
      problem:
        "Record/replay, runtime mocking, and automated test generation are technical ideas. The site had to explain them without dumbing the story down.",
      responsibility:
        "I designed the site in Figma and built it in Webflow, carrying the structure, copy hierarchy, and brand through to launch.",
      approach:
        "The homepage leads with the developer outcome—mock, monitor, replay, and test—then opens into features, guidance, and the open-source story.",
      decisions: [
        "Lead with the four capabilities developers already ask for.",
        "Keep technical depth visible instead of hiding it behind marketing language.",
        "Use the open-source and YC story to build credibility with early adopters.",
      ],
      shipped:
        "unlogged.io, designed in Figma and built in Webflow from scratch, plus launch assets and UI motion.",
      media: [
        {
          id: "site-hero",
          title: "Mock, monitor, replay, and test",
          caption: "Marketing site capture · homepage",
          src: "/projects/unlogged/hero.webp",
          alt: "Unlogged marketing site hero with the Mock, Monitor, Replay, and Test message",
          format: "wide",
        },
        {
          id: "site-features",
          title: "Feature storytelling",
          caption: "Marketing site capture · features",
          src: "/projects/unlogged/features.webp",
          alt: "Unlogged marketing site features section",
          format: "standard",
        },
      ],
    },
    {
      id: "brand-system",
      number: "03",
      label: "Brand & system",
      title: "Give product and marketing one visual language.",
      introduction:
        "Plugin UI, web dashboard, investor decks, and marketing site needed a shared identity that a small team could keep consistent.",
      problem:
        "An early-stage startup ships fast. Without shared components and brand rules, every surface drifts in a different direction.",
      responsibility:
        "I built the visual identity and adapted a design system from Chakra UI for the product surfaces.",
      approach:
        "A small token set and component base kept the plugin, dashboard, and marketing site consistent as the product evolved.",
      decisions: [
        "Adapt Chakra UI primitives rather than designing one-off components.",
        "Carry the brand through the website, investor decks, and launch animation.",
        "Use prototypes and user testing with early customers to validate flows.",
      ],
      shipped:
        "Branding, visual identity, investor decks, UI animation, and a Chakra-based design system for product surfaces.",
      shippedLabel: "Work status",
      media: [
        {
          id: "brand-about",
          title: "Company story and team",
          caption: "About page capture",
          src: "/projects/unlogged/about.webp",
          alt: "Unlogged about page with the YC journey and founding team",
          format: "standard",
        },
        {
          id: "brand-mobile",
          title: "Product surfaces",
          caption: "Product capture",
          src: "/projects/unlogged/mobile.webp",
          alt: "Unlogged product surface",
          format: "standard",
        },
      ],
    },
  ] satisfies Array<CaseStudyChapter>,
  pullQuote: {
    text: "We are the early adopters of Unlogged to automatically generate the unit test cases for our Java code. We were pleasantly surprised to see the results of what this plugin provided us that normally used to take manual efforts of ~2-3 hours by our developers.",
    attribution: "Pranav Khambayatkar — VP & Head of Engineering",
  },
  system: {
    eyebrow: "The connecting thread",
    title: "A small system for a young devtools brand.",
    body: "Adapting a Chakra-based system gave the plugin, dashboard, and marketing site a shared base without slowing a small team down. One set of tokens and components carried the brand from inside the IDE through to launch.",
    mediaSlot: {
      title: "Design system library",
      description:
        "Original components and patterns will be added with the design files.",
    },
    people: {
      eyebrow: "People I worked with",
      intro:
        "Shardul Lavekar, Parth Mudgal, and Amogh CR were direct partners in this work, from plugin flows to the public launch.",
      entries: [
        {
          name: "Shardul Lavekar",
          context: "Founder / QA",
          href: "https://www.unlogged.io/about-us",
        },
        {
          name: "Parth Mudgal",
          context: "Founder / Software Engineer",
          href: "https://www.unlogged.io/about-us",
        },
        {
          name: "Amogh CR",
          context: "Software Engineer",
          href: "https://www.unlogged.io/about-us",
        },
      ],
      link: {
        label: "View the team",
        href: "https://www.unlogged.io/about-us",
      },
    },
  },
  outcomes: {
    eyebrow: "In retrospect",
    title: "What shipped, and what stayed with me.",
    releasesLabel: "Work and releases",
    releases: [
      "unlogged.io, designed in Figma and built in Webflow.",
      "IntelliJ plugin UX for record/replay, runtime mocking, JUnit generation, and performance tracking.",
      "Web dashboard flows and onboarding for developer workflows.",
      "Branding, visual identity, investor decks, and launch animation.",
    ],
    lessonsLabel: "Lessons learned",
    lessons: [
      "Developer tools earn trust through clarity, not simplification.",
      "Designing inside an IDE means respecting a surface that already has no room to spare.",
      "A small shared system matters most when a small team ships across product and marketing.",
    ],
    footnote:
      "This account focuses on the work I contributed to. Unlogged remains an open-source project.",
  },
  nav: {
    overview: "Overview",
    system: "Design system",
    outcomes: "Takeaways",
  },
} satisfies CaseStudyStory

export const tulrCaseStudy = {
  title: "Tulr: one workspace for the tools teams duct-taped together.",
  description:
    "At Tulr I designed a pre-LLM no-code builder that combined videos, tables, forms, and calendars with automation—a one-shot replacement for Airtable, Typeform, Calendly, and Loom.",
  role: "UX Designer",
  period: "May 2020 – Dec 2021",
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
