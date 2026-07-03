export type DocCategory = "components" | "custom"

export type DocEntry = {
  slug: string
  title: string
  description: string
  category: DocCategory
}

function titleFromSlug(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function entry(
  slug: string,
  description: string,
  category: DocCategory = "components"
): DocEntry {
  return {
    slug,
    title: titleFromSlug(slug),
    description,
    category,
  }
}

const componentSlugs = [
  "accordion",
  "alert",
  "alert-dialog",
  "aspect-ratio",
  "avatar",
  "badge",
  "breadcrumb",
  "button",
  "button-group",
  "calendar",
  "card",
  "carousel",
  "chart",
  "checkbox",
  "collapsible",
  "combobox",
  "command",
  "context-menu",
  "dialog",
  "drawer",
  "dropdown-menu",
  "empty",
  "field",
  "hover-card",
  "input",
  "input-group",
  "input-otp",
  "item",
  "kbd",
  "label",
  "menubar",
  "native-select",
  "navigation-menu",
  "pagination",
  "popover",
  "progress",
  "radio-group",
  "resizable",
  "scroll-area",
  "select",
  "separator",
  "sheet",
  "sidebar",
  "skeleton",
  "slider",
  "sonner",
  "spinner",
  "switch",
  "table",
  "tabs",
  "textarea",
  "toggle",
  "toggle-group",
  "tooltip",
] as const

const componentDescriptions: Record<string, string> = {
  accordion: "Vertically stacked sections that expand and collapse.",
  alert: "Displays a callout for important information.",
  "alert-dialog": "Modal dialog for destructive or critical actions.",
  avatar: "Image element with a fallback for representing users.",
  badge: "Small status descriptor for UI elements.",
  button: "Triggers an action or event when clicked.",
  card: "Container for grouped content and actions.",
  carousel: "Slideshow for cycling through content with prev/next controls.",
  chart: "Recharts wrapper with theme-aware colors and tooltips.",
  checkbox: "Control for selecting multiple options.",
  combobox: "Searchable select input with filterable dropdown items.",
  command: "Command palette for searchable actions and navigation.",
  "context-menu": "Menu triggered by right-click on a target area.",
  dialog: "Modal window overlaid on the primary content.",
  "dropdown-menu": "Menu triggered by a button.",
  "hover-card": "Preview card shown when hovering a trigger element.",
  input: "Text input field for forms.",
  "input-otp": "One-time password input with grouped character slots.",
  item: "Flexible list row with media, content, and actions.",
  menubar: "Horizontal menu bar with nested dropdown menus.",
  "navigation-menu": "Accessible navigation with dropdown panels.",
  select: "Dropdown for choosing from a list of options.",
  sidebar: "Collapsible application sidebar with inset content layout.",
  switch: "Toggle between two states.",
  tabs: "Organize content into switchable panels.",
  tooltip: "Popup that displays information on hover.",
}

export const componentEntries: Array<DocEntry> = componentSlugs.map((slug) =>
  entry(
    slug,
    componentDescriptions[slug] ??
      `${titleFromSlug(slug)} component from the shadcn/ui library.`,
    "components"
  )
)

export const customEntries: Array<DocEntry> = [
  entry(
    "m3-shapes",
    "Material Design 3 expressive shapes for icon boxes, image clipping masks, and placeholders.",
    "custom"
  ),
  entry(
    "footer-monogram",
    "Large footer watermark monogram with Framer Motion animation variants.",
    "custom"
  ),
  entry(
    "footer-gradients",
    "Dia Browser-inspired soft glowing gradient effects with 3D Fold, peaked, and color dodge variants.",
    "custom"
  ),
  entry(
    "monogram-patterns",
    "Subtle background patterns created using the brand's triangular monogram logo, animated with Framer Motion.",
    "custom"
  ),
  entry(
    "scrollbars",
    "Brand-colored scrollbars with transparent tracks for native and Radix scroll areas.",
    "custom"
  ),
  entry(
    "mode-toggle",
    "Theme switcher with light, dark, and system modes.",
    "custom"
  ),
  entry(
    "theme-customizer",
    "Popover for brand colors, fonts, radius, accessibility, and light/dark mode.",
    "custom"
  ),
  entry(
    "site-header",
    "Portfolio navigation header with anchor links.",
    "custom"
  ),
  entry(
    "hero-section",
    "Landing page hero with headline and CTAs.",
    "custom"
  ),
  entry(
    "work-section",
    "Project showcase grid with animated cards.",
    "custom"
  ),
  entry(
    "skills-section",
    "Skills badges grouped by design and engineering.",
    "custom"
  ),
  entry(
    "contact-section",
    "Contact CTA section with email and social links.",
    "custom"
  ),
  entry(
    "ai-elements",
    "Vercel AI Elements — conversation, message, prompt input, suggestions, sources, and shimmer for portfolio chat.",
    "custom"
  ),
  entry(
    "chat-prompt-input",
    "A premium prompting container with segmented platform tabs, microphone toggle, actions bar, and auto-growing textarea.",
    "custom"
  ),
]

export const allDocEntries: Array<DocEntry> = [...componentEntries, ...customEntries]

export const docEntryBySlug: Record<string, DocEntry> = Object.fromEntries(
  allDocEntries.map((e) => [e.slug, e])
)

export const designSystemNav = {
  foundations: [
    { title: "Introduction", href: "/design-system" },
    { title: "Colors", href: "/design-system/colors" },
    { title: "Typography", href: "/design-system/typography" },
    { title: "Accessibility", href: "/design-system/accessibility" },
    { title: "Scrollbars", href: "/design-system/scrollbars" },
  ],
  components: componentEntries.map((e) => ({
    title: e.title,
    href: `/design-system/components/${e.slug}`,
  })),
  custom: customEntries.map((e) => ({
    title: e.title,
    href: `/design-system/components/${e.slug}`,
  })),
}

export function getDocEntry(slug: string): DocEntry | undefined {
  return docEntryBySlug[slug]
}
