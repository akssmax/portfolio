export type KodoMedia = {
  /** Stable slot for replacing a placeholder with an original design export later. */
  id: string
  title: string
  caption: string
  alt?: string
  src?: string
  format: "wide" | "standard"
}

export type KodoChapter = {
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
  media: Array<KodoMedia>
  publicLink?: { label: string; href: string }
}

export type KodoPrototype = {
  id: string
  title: string
  description: string
  previewTitle: string
  url: string
}

export const kodoCaseStudy = {
  title: "Kodo: making complex money movement feel clear.",
  description:
    "Across 21 months at Kodo, I led design work on the public website, Corporate Cards, and a new procure-to-pay workspace—connecting dense financial workflows through a consistent design language.",
  role: "Lead Product Designer",
  period: "Feb 2024 – Nov 2025",
  context:
    "Kodo brings procurement, accounts payable, payments, corporate cards, and reimbursements into one spend platform. The work stretched from explaining that platform to prospective customers to helping teams move requests and money through it with confidence.",
  remit:
    "My remit crossed marketing, product, and systems work. I designed and built the new website in Framer, worked on the Corporate Cards platform, and led design for the first release of Kodo's new procure-to-pay workspace. Product and engineering partners helped turn evolving requirements into a working product.",
  chapters: [
    {
      id: "website",
      number: "01",
      label: "The website",
      title: "Explain a broad platform without losing the thread.",
      introduction:
        "The public site needed to make a complex spend platform understandable to buyers with different levels of financial and operational maturity.",
      problem:
        "Accounts payable, vendor payments, corporate cards, reimbursements, and workflows solve related problems, but a simple list of features does not explain how they work together.",
      responsibility:
        "I designed the site in Figma and built it in Framer, carrying the structure, visual language, and motion through to the live experience.",
      approach:
        "The story starts with the outcome for the buyer, then opens into product pillars, customer segments, workflows, integrations, and collaboration. This gives visitors a way into the platform before asking them to parse individual features.",
      decisions: [
        "Organize the platform around clear product pillars instead of one dense feature inventory.",
        "Give startup, mid-market, and enterprise buyers distinct entry points.",
        "Use workflow and integration examples to make the depth of the platform tangible.",
      ],
      shipped:
        "A live marketing site at kodo.com, designed in Figma and built in Framer with custom interactive components.",
      publicLink: {
        label: "Visit Kodo's website",
        href: "https://www.kodo.com/",
      },
      media: [
        {
          id: "website-homepage",
          title: "A clear entry into the platform",
          caption: "Public website capture · homepage",
          src: "/projects/kodo/hero.webp",
          alt: "Kodo marketing site homepage with the Spend Smarter, Scale Faster message",
          format: "wide",
        },
        {
          id: "website-segments",
          title: "Distinct audience entry points",
          caption: "Public website capture · customer segments",
          src: "/projects/kodo/segments.webp",
          alt: "Kodo website section with cards for startups, mid-market teams, and enterprises",
          format: "standard",
        },
        {
          id: "website-workflows",
          title: "Platform depth",
          caption: "Public website capture · workflow story",
          src: "/projects/kodo/workflows.webp",
          alt: "Kodo website section explaining configurable approval workflows",
          format: "standard",
        },
      ],
    },
    {
      id: "corporate-cards",
      number: "02",
      label: "Corporate Cards",
      title: "Make control feel usable in everyday spending.",
      introduction:
        "Corporate Cards sits between the person making a purchase and the finance team responsible for policy, visibility, and reconciliation.",
      problem:
        "Employees need a straightforward way to spend, while finance teams need limits, visibility into activity, and reporting they can trust. The product has to hold both needs at once.",
      responsibility:
        "I worked on the Corporate Cards platform as part of Kodo's broader product design remit. Original screens and the exact evolution of this work will be added when the design files are available.",
      approach:
        "The chapter is organized around the documented product capabilities: card controls, real-time spend tracking, and reporting. It gives the design work context without treating a public marketing illustration as an original product screen.",
      decisions: [
        "How did the work explain limits and restrictions where they were set?",
        "Which card activity views helped finance teams monitor spend?",
        "How did daily card use connect to reporting and reconciliation?",
      ],
      decisionLabel: "Questions for the design files",
      shipped:
        "Work on Kodo's Corporate Cards experience. The original files will identify which changes shipped and document any measured outcomes.",
      shippedLabel: "Work status",
      publicLink: {
        label: "Corporate Cards product context",
        href: "https://www.kodo.com/products/corporate-cards",
      },
      media: [
        {
          id: "cards-overview",
          title: "Corporate Cards overview",
          caption: "Original design export to be added",
          format: "wide",
        },
        {
          id: "cards-controls",
          title: "Controls and card activity",
          caption: "Original design export to be added",
          format: "standard",
        },
      ],
    },
    {
      id: "erp-workspace",
      number: "03",
      label: "New P2P workspace",
      title: "Give every handoff a place in the flow.",
      introduction:
        "Kodo's new procure-to-pay workspace brought requests, approvals, purchasing, invoices, and payments into a connected enterprise flow.",
      problem:
        "A finance workflow needs to make the next action clear without losing policy, approval history, or the context attached to a request. Those constraints become harder as teams and approval levels grow.",
      responsibility:
        "I led product design from early discovery through the first enterprise rollout, working closely with product and engineering partners as requirements and edge cases evolved.",
      approach:
        "The work centered on making the states and handoffs in a procure-to-pay journey understandable. Configurable forms, maker-checker approvals, and integrations had to read as one coherent workspace rather than unrelated screens.",
      decisions: [
        "How were the current state and next owner shown in a multi-step process?",
        "Where did approval rules and nested levels become visible to users?",
        "What context carried across request, order, invoice, and payment?",
      ],
      decisionLabel: "Questions for the design files",
      shipped:
        "The first version of Kodo's new procure-to-pay workspace launched with enterprise customers. Original screens and verified outcome measures will be added alongside the design files.",
      publicLink: {
        label: "Explore Kodo's workflow product",
        href: "https://www.kodo.com/products/workflows",
      },
      media: [
        {
          id: "erp-workflow-map",
          title: "End-to-end workflow",
          caption: "Original design export to be added",
          format: "wide",
        },
        {
          id: "erp-request-details",
          title: "Request and approval detail",
          caption: "Original design export to be added",
          format: "standard",
        },
        {
          id: "erp-system-patterns",
          title: "System patterns and edge cases",
          caption: "Original design export to be added",
          format: "standard",
        },
      ],
    },
  ] satisfies Array<KodoChapter>,
  mobilePrototype: {
    id: "mobile-prototype",
    title: "A mobile prototype across cards and procure-to-pay.",
    description:
      "This Mobile UPI App prototype connects the Corporate Cards and procure-to-pay sides of the work. Deepti demonstrated it at NPCI.",
    previewTitle: "Mobile UPI App",
    url: "https://www.figma.com/proto/tBRP0JxP3MY0PtYwarSzkO/Mobile-UPI-App?node-id=255-20002&t=lxVMhtBdid3BTnqZ-8&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=124%3A9908&hide-ui=1",
  } satisfies KodoPrototype,
  vendorPortalPrototype: {
    id: "vendor-portal-prototype",
    title: "The Vendor Portal, inside procure-to-pay.",
    description:
      "This Vendor Portal prototype is part of Kodo's procure-to-pay platform. It is an original design artifact from the P2P work.",
    previewTitle: "Vendor Portal",
    url: "https://www.figma.com/proto/V8saAJmR7UcyYHuUHqEU9t/2A.-Dev-Handoff---Master-Datasets?node-id=10130-42533&t=7nKNab4rh9NGqOaE-8&scaling=contain&content-scaling=fixed&page-id=3620%3A13650&starting-point-node-id=10130%3A42533&hide-ui=1",
  } satisfies KodoPrototype,
  system:
    "Across the work, I built a shared component library and a consistent visual language for web and app experiences. The Kodo system included native light and dark patterns, with Tamagui and Material Design 3 explorations. It helped complex forms and workflows stay coherent as the platform expanded.",
  partners: [
    {
      name: "Gaurav Thapa",
      excerpt: "iterate quickly without becoming superficial",
      context: "On complex workflows, configurable UI, and design systems",
      href: "https://www.linkedin.com/in/gaurav-thapa/",
    },
    {
      name: "Tumul Roy",
      excerpt:
        "We partnered day-to-day from early discovery through enterprise rollout",
      context: "On the procure-to-pay product at Kodo",
      href: "https://www.linkedin.com/in/tumul-roy/",
    },
  ],
  lessons: [
    "In financial products, clarity is part of control: people need to understand the state of work before they can trust the next step.",
    "A system earns its value when it makes repeated decisions easier across very different surfaces.",
    "Close collaboration with product and engineering mattered most when requirements were changing and edge cases were still emerging.",
  ],
} as const
