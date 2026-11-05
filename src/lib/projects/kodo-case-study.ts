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
  /** "p2p" chapters are the ERP deep dives; "beyond" covers the rest of the remit. */
  group: "p2p" | "beyond"
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

export type KodoModule = {
  name: string
  detail: string
}

export type KodoFact = {
  value: string
  label: string
}

export type KodoProcessStep = {
  title: string
  detail: string
}

export type KodoSystem = {
  name: string
  usedFor: string
  points: Array<string>
}

export const kodoCaseStudy = {
  title: "Kodo: an ERP that bends to every company's process.",
  description:
    "Over 21 months at Kodo (YC W21), I led design for the first release of its procure-to-pay ERP, live with redBus and Brndme, and built the design systems behind it, plus Corporate Cards, NPCI work and the public website.",
  role: "Lead Product Designer",
  period: "Feb 2024 – Nov 2025",
  facts: [
    { value: "P2P v1", label: "Live with redBus and Brndme" },
    { value: "12+ months", label: "From discovery to first rollout" },
    { value: "1,000+", label: "Components across two design systems" },
    { value: "NPCI", label: "Approved Bharat Connect screens" },
  ] satisfies Array<KodoFact>,
  context:
    "Kodo is a YC W21 fintech for business spend. Its new procure-to-pay (P2P) ERP brought purchase requests, approvals, purchase orders, goods receipts, invoices, payments, vendors and accounting into one workspace.",
  remit:
    "I led product design for P2P v1, from discovery with the first enterprise customers through rollout, working with product managers and engineering. Alongside it I built the design systems, worked on Corporate Cards and NPCI screens, and designed and built the public website in Framer.",
  bet: {
    title: "Configured, not customised.",
    body: "No two companies buy the same way. Approval chains, forms, roles and accounting setups differ from one company to the next. Kodo's edge was flexibility: a modular ERP that each customer could shape to its own process, in a clean interface, shipped fast. Every design decision had to keep that flexibility without making the product feel like a settings panel.",
  },
  modules: {
    shipped: [
      {
        name: "Requests and approvals",
        detail:
          "Purchase requests with maker-checker and dynamic multi-level workflows",
      },
      {
        name: "PO and GRN",
        detail: "Purchase orders and goods receipt notes",
      },
      {
        name: "Invoices and payments",
        detail: "Vendor invoices through to payment",
      },
      {
        name: "Vendor portal and master data",
        detail: "Vendor-facing portal and the master datasets behind it",
      },
      {
        name: "Workflow builder",
        detail: "Admins design multi-level approval flows per process",
      },
      {
        name: "Permissions and custom roles",
        detail: "Role-based, per module and action, scoped by entity",
      },
      {
        name: "Form builder",
        detail: "Configurable fields for each company's documents",
      },
      {
        name: "Mailbox",
        detail: "Invoices captured from email into the flow",
      },
      {
        name: "Reports",
        detail: "Spend, status and ageing, custom reports, audit trail",
      },
      {
        name: "Zoho and Tally sync",
        detail: "Accounting entries with ledger and vendor mapping",
      },
    ] satisfies Array<KodoModule>,
    designed: [
      {
        name: "Reimbursements",
        detail: "Employee expense claims inside the same workflows",
      },
      {
        name: "Travel",
        detail: "Travel requests and bookings for employees",
      },
    ] satisfies Array<KodoModule>,
  },
  chapters: [
    {
      id: "workflow-builder",
      number: "01",
      label: "Workflow builder",
      group: "p2p",
      title: "Let every company draw its own approval chain.",
      introduction:
        "Approvals are where procurement slows down or goes wrong. The workflow builder let admins define who approves what, in which order, without asking engineering.",
      problem:
        "redBus and Brndme each had their own approval hierarchy. A fixed approval flow would have forced them to change how they work, or pushed every change onto Kodo's engineers.",
      responsibility:
        "I designed the workflow builder and the approval experience on every document: how admins set up a flow, and how requesters, makers and checkers see where a document is and what they need to do.",
      approach:
        "Treat a workflow as a readable sequence of levels, not a diagram to decode. Admins build multi-level chains with maker-checker steps; everyone else sees the same chain as a status on the document, with the current level and the next person to act.",
      decisions: [
        "Dynamic, multi-level approval chains that admins configure per process.",
        "Maker-checker built in, so the person who creates a document is never the one who signs it off.",
        "One status pattern across requests, POs, GRNs and invoices, so a stuck document looks the same everywhere.",
      ],
      shipped:
        "Shipped in P2P v1: dynamic multi-level workflows with maker-checker, used by redBus and Brndme.",
      media: [
        {
          id: "workflow-builder-canvas",
          title: "Building a multi-level approval flow",
          caption: "Original design export to be added",
          format: "wide",
        },
        {
          id: "workflow-document-status",
          title: "Approval status on a document",
          caption: "Original design export to be added",
          format: "standard",
        },
        {
          id: "workflow-maker-checker",
          title: "Maker-checker review",
          caption: "Original design export to be added",
          format: "standard",
        },
      ],
    },
    {
      id: "permissions",
      number: "02",
      label: "Permissions",
      group: "p2p",
      title: "Make a detailed permission model feel simple.",
      introduction:
        "Finance software has to be strict about who can see and do what. Kodo's permission system had to cover large organisations without becoming a wall of checkboxes.",
      problem:
        "Rights depend on several things at once: the person's role, the module, the action, and which part of the company they work in. Preset roles never fit every customer, so companies also needed their own roles.",
      responsibility:
        "I designed the roles and permissions experience: preset and custom roles, rights per module and action, and scoping by entity, plus how those rules show up for end users.",
      approach:
        "Start from roles people already recognise, then let admins adjust. Rights are grouped by module, actions read as plain verbs, and scope is a separate, clear choice instead of another column in a giant matrix.",
      decisions: [
        "Preset roles as a starting point, with custom roles for anything a company needs beyond them.",
        "Rights set per module and per action, grouped so admins can scan one module at a time.",
        "Scope by entity, such as a department or location, kept as its own step so the matrix stays readable.",
      ],
      shipped:
        "Shipped in P2P v1: role-based permissions with custom roles, per-module and per-action rights, and entity scoping.",
      media: [
        {
          id: "permissions-roles",
          title: "Roles and custom roles",
          caption: "Original design export to be added",
          format: "wide",
        },
        {
          id: "permissions-matrix",
          title: "Module and action rights",
          caption: "Original design export to be added",
          format: "standard",
        },
        {
          id: "permissions-scope",
          title: "Scoping a role to an entity",
          caption: "Original design export to be added",
          format: "standard",
        },
      ],
    },
    {
      id: "mailbox-ledger",
      number: "03",
      label: "Mailbox to ledger",
      group: "p2p",
      title: "From a vendor's email to the books, without retyping.",
      introduction:
        "Invoices arrive by email and end up in accounting software. The mailbox, reports and the Zoho and Tally integration closed the gap between those two ends.",
      problem:
        "Finance teams were copying invoice details out of inboxes and entering approved invoices again in their accounting tools. Every handoff was a chance for a typo or a missed payment.",
      responsibility:
        "I designed the mailbox, the ledger and vendor mapping for Zoho and Tally, and the reporting suite: spend analytics, status and ageing reports, a custom report builder, and the audit trail.",
      approach:
        "Let the invoice enter once and carry its context forward. The mailbox turns an emailed invoice into a document in the flow; one-time mapping links Kodo's vendors and accounts to the ledgers in Zoho or Tally; reports and the audit trail show what happened at each step.",
      decisions: [
        "Invoice capture by email, so vendors keep sending invoices the way they already do.",
        "Map vendors and ledgers once, then reuse that mapping for every accounting entry.",
        "Reports for spend, status and ageing, a custom builder for everything else, and an audit trail on every document.",
      ],
      shipped:
        "Shipped in P2P v1: mailbox invoice capture, Zoho and Tally accounting integration with ledger and vendor mapping, reports and audit trail.",
      media: [
        {
          id: "mailbox-inbox",
          title: "Invoices captured from email",
          caption: "Original design export to be added",
          format: "wide",
        },
        {
          id: "ledger-mapping",
          title: "Zoho and Tally ledger mapping",
          caption: "Original design export to be added",
          format: "standard",
        },
        {
          id: "reports-builder",
          title: "Custom report builder",
          caption: "Original design export to be added",
          format: "standard",
        },
      ],
    },
    {
      id: "corporate-cards",
      number: "04",
      label: "Cards and NPCI",
      group: "beyond",
      title: "Payments work with the rules of India's payment rails.",
      introduction:
        "Beyond P2P, I worked on Kodo's Corporate Cards product and on payment screens built to NPCI's standards.",
      problem:
        "Payment flows on NPCI's rails have to meet its rules before they can go live, and the corporate card app had grown on an older Material Design 2 base.",
      responsibility:
        "I designed the Bharat Connect screens that NPCI approved, a UPI app demo, and a full revamp of the corporate card app on Material Design 3.",
      approach:
        "Keep the payment steps clear enough to pass NPCI review, and move the card app onto MD3 through a new component set rather than screen-by-screen fixes.",
      decisions: [
        "Bharat Connect screens designed to NPCI's requirements, and approved by NPCI.",
        "A UPI app prototype that the team demonstrated at NPCI.",
        "The card app revamp built on an MD2 → MD3 design system, so new screens came from components.",
      ],
      decisionLabel: "What I worked on",
      shipped:
        "Bharat Connect screens shipped with NPCI approval. The UPI app was a demo, and the MD3 card app revamp was designed but not shipped.",
      shippedLabel: "What shipped",
      publicLink: {
        label: "Corporate Cards product context",
        href: "https://www.kodo.com/products/corporate-cards",
      },
      media: [
        {
          id: "cards-md3-before-after",
          title: "Card app: MD2 before, MD3 after",
          caption: "Original design export to be added",
          format: "wide",
        },
        {
          id: "npci-bharat-connect",
          title: "NPCI-approved Bharat Connect screens",
          caption: "Original design export to be added",
          format: "standard",
        },
        {
          id: "cards-md3-components",
          title: "MD3 component set",
          caption: "Original design export to be added",
          format: "standard",
        },
      ],
    },
    {
      id: "website",
      number: "05",
      label: "The website",
      group: "beyond",
      title: "Explain a broad platform without losing the thread.",
      introduction:
        "The public site had to make a wide spend platform understandable to buyers of different sizes.",
      problem:
        "Accounts payable, vendor payments, cards, reimbursements and workflows solve related problems, but a list of features does not explain how they fit together.",
      responsibility:
        "I designed the site in Figma and built it in Framer, including the structure, visual language and motion.",
      approach:
        "Lead with the outcome for the buyer, then open into product pillars, customer segments, workflows, integrations and collaboration.",
      decisions: [
        "Organise the platform around clear product pillars instead of one long feature list.",
        "Give startup, mid-market and enterprise buyers their own entry points.",
        "Use workflow and integration examples to show the platform's depth.",
      ],
      shipped:
        "Live at kodo.com, designed in Figma and built in Framer with custom interactive components.",
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
  ] satisfies Array<KodoChapter>,
  process: [
    {
      title: "Customer calls",
      detail: "Discovery and feedback sessions with redBus and Brndme.",
    },
    {
      title: "Competitor audit",
      detail: "How existing P2P and ERP tools handle the same flows.",
    },
    {
      title: "Research with PMs",
      detail: "Refining requirements and edge cases with product managers.",
    },
    {
      title: "Rapid prototypes",
      detail:
        "Quick prototypes in Figma, and code prototypes in v0 and Figma Make.",
    },
    {
      title: "Dev handoff files",
      detail: "Structured Figma handoff files for each module.",
    },
    {
      title: "Sales prototypes",
      detail: "Clickable prototypes, like the Vendor Portal, for demos.",
    },
  ] satisfies Array<KodoProcessStep>,
  mobilePrototype: {
    id: "mobile-prototype",
    title: "The UPI app demo, shown at NPCI.",
    description:
      "This Mobile UPI App prototype connects the Corporate Cards and payments side of the work. The team demonstrated it at NPCI.",
    previewTitle: "Mobile UPI App",
    url: "https://www.figma.com/proto/tBRP0JxP3MY0PtYwarSzkO/Mobile-UPI-App?node-id=255-20002&t=lxVMhtBdid3BTnqZ-8&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=124%3A9908&hide-ui=1",
  } satisfies KodoPrototype,
  vendorPortalPrototype: {
    id: "vendor-portal-prototype",
    title: "The Vendor Portal, inside procure-to-pay.",
    description:
      "Vendors are the other side of every purchase order and invoice. This prototype of the Vendor Portal, which shipped in P2P v1, was also used in sales demos.",
    previewTitle: "Vendor Portal",
    url: "https://www.figma.com/proto/V8saAJmR7UcyYHuUHqEU9t/2A.-Dev-Handoff---Master-Datasets?node-id=10130-42533&t=7nKNab4rh9NGqOaE-8&scaling=contain&content-scaling=fixed&page-id=3620%3A13650&starting-point-node-id=10130%3A42533&hide-ui=1",
  } satisfies KodoPrototype,
  system:
    "I built two design systems with more than 1,000 components between them. They covered the P2P web workspace, the vendor portal and the corporate card app. Tamagui was the base for the P2P web workspace: one component set ready for web and React Native, tokens mapped one to one with Figma variables, and light and dark themes from the same tokens. A Material Design 2 → 3 system carried the corporate card app.",
  systems: [
    {
      name: "Tamagui",
      usedFor: "P2P web workspace",
      points: [
        "One component set for web and React Native",
        "Tokens mapped one to one with Figma variables",
        "Light and dark themes from the same tokens",
      ],
    },
    {
      name: "Material Design 2 → 3",
      usedFor: "Corporate card app",
      points: [
        "Migrated the card app's base from MD2 to MD3",
        "New screens assembled from components",
        "The foundation for the card app revamp",
      ],
    },
  ] satisfies Array<KodoSystem>,
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
  releases: [
    "P2P v1, live with redBus and Brndme: requests and approvals, PO and GRN, invoices and payments, vendor portal and master data.",
    "Platform modules: workflow builder, permissions with custom roles, form builder, mailbox, reports, and Zoho and Tally sync.",
    "Two design systems with 1,000+ components: Tamagui for P2P web, MD2 → MD3 for the card app.",
    "NPCI-approved Bharat Connect screens, and kodo.com in Framer.",
  ],
  notShipped: [
    "Reimbursements and Travel modules",
    "Corporate card app revamp on Material Design 3",
    "UPI app (demo shown at NPCI)",
  ],
  lessons: [
    "In an ERP, flexibility is the product. The design job is to keep it from turning into complexity.",
    "In financial products, clarity is part of control: people need to see the state of a document before they trust the next step.",
    "Shipping fast with enterprise customers works when prototypes, handoff files and the design system all speak the same language.",
  ],
} as const
