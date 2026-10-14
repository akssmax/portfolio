export type DocCategory = "components" | "custom"

export type DocEntry = {
  slug: string
  title: string
  description: string
  category: DocCategory
}

function titleFromSlug(slug: string): string {
  const names: Record<string, string> = {
    "ai-elements": "AI Elements",
    "input-otp": "Input OTP",
    kbd: "Keyboard Key",
  }
  if (names[slug]) return names[slug]
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
  "aspect-ratio": "Preserves a consistent width-to-height ratio for media.",
  avatar: "Image element with a fallback for representing users.",
  badge: "Small status descriptor for UI elements.",
  breadcrumb: "Shows the current page within a navigation hierarchy.",
  button: "Triggers an action or event when clicked.",
  "button-group": "Groups related buttons into a connected set of actions.",
  calendar: "A date picker with month navigation and selection modes.",
  card: "Container for grouped content and actions.",
  carousel: "Slideshow for cycling through content with prev/next controls.",
  chart: "Recharts wrapper with theme-aware colors and tooltips.",
  checkbox: "Control for selecting multiple options.",
  collapsible:
    "A disclosure control for showing and hiding a section of content.",
  combobox: "Searchable select input with filterable dropdown items.",
  command: "Command palette for searchable actions and navigation.",
  "context-menu": "Menu triggered by right-click on a target area.",
  dialog: "Modal window overlaid on the primary content.",
  drawer: "A sliding panel for contextual content and actions.",
  "dropdown-menu": "Menu triggered by a button.",
  empty: "Communicates an empty state with context and a next action.",
  field: "Composes labels, descriptions, controls, and validation messages.",
  "hover-card": "Preview card shown when hovering a trigger element.",
  input: "Text input field for forms.",
  "input-group":
    "Combines inputs with leading or trailing visuals and actions.",
  "input-otp": "One-time password input with grouped character slots.",
  item: "Flexible list row with media, content, and actions.",
  kbd: "Displays a keyboard key or shortcut within interface text.",
  label: "An accessible text label associated with a form control.",
  menubar: "Horizontal menu bar with nested dropdown menus.",
  "native-select":
    "A styled native select using the browser's built-in interaction.",
  "navigation-menu": "Accessible navigation with dropdown panels.",
  pagination: "Navigation between pages of a larger collection.",
  popover: "Displays contextual content in a floating panel.",
  progress: "Communicates the completion of an ongoing task.",
  "radio-group":
    "A set of mutually exclusive choices with keyboard navigation.",
  resizable: "A layout of panels separated by draggable resize handles.",
  "scroll-area": "A scrollable viewport with consistently styled scrollbars.",
  select: "Dropdown for choosing from a list of options.",
  separator: "Visually or semantically separates groups of content.",
  sheet: "A dialog panel that opens from an edge of the screen.",
  sidebar: "Collapsible application sidebar with inset content layout.",
  skeleton: "A placeholder matching the shape of content while it loads.",
  slider: "Selects a numeric value or range with one or more thumbs.",
  sonner: "Theme-aware toast notifications for transient feedback.",
  spinner: "An animated indicator for an operation in progress.",
  switch: "Toggle between two states.",
  table: "Semantic table elements for structured, tabular data.",
  tabs: "Organize content into switchable panels.",
  textarea: "A multi-line text field for longer responses.",
  toggle: "A button with an on or off pressed state.",
  "toggle-group":
    "A connected group of single- or multiple-selection toggle buttons.",
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
    "Footer monogram variants: a ShapeWaves cutout for the site and an interactive runner preview.",
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
    "Landing page hero with rotating headline and ask-the-portfolio prompt.",
    "custom"
  ),
  entry("work-section", "Project showcase grid with animated cards.", "custom"),
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
  entry(
    "feature-card",
    "Minimal horizontal project card with an animated wave background and screenshot preview on hover or focus.",
    "custom"
  ),
  entry(
    "feature-card-grid",
    "Stacked recent-project cards and visual bento case-study cards.",
    "custom"
  ),
  entry(
    "projects-showcase",
    "Landing page work showcase with stacked Recent Projects and Case Studies sections.",
    "custom"
  ),
]

export const allDocEntries: Array<DocEntry> = [
  ...componentEntries,
  ...customEntries,
]

export const docEntryBySlug: Record<string, DocEntry> = Object.fromEntries(
  allDocEntries.map((e) => [e.slug, e])
)

export const designSystemNav = {
  foundations: [
    { title: "Introduction", href: "/design-system" },
    { title: "Customization", href: "/design-system/customization" },
    { title: "Colors", href: "/design-system/colors" },
    { title: "Typography", href: "/design-system/typography" },
    { title: "Animation", href: "/design-system/animation" },
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
