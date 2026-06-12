import type { ComponentType } from "react"

import { getDemo } from "@/components/design-system/demos"

export type DocCategory = "components" | "custom"

export type DocEntry = {
  slug: string
  title: string
  description: string
  category: DocCategory
  demo: ComponentType
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
    demo: getDemo(slug),
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
  checkbox: "Control for selecting multiple options.",
  dialog: "Modal window overlaid on the primary content.",
  "dropdown-menu": "Menu triggered by a button.",
  input: "Text input field for forms.",
  select: "Dropdown for choosing from a list of options.",
  switch: "Toggle between two states.",
  tabs: "Organize content into switchable panels.",
  tooltip: "Popup that displays information on hover.",
}

export const componentEntries: DocEntry[] = componentSlugs.map((slug) =>
  entry(
    slug,
    componentDescriptions[slug] ??
      `${titleFromSlug(slug)} component from the shadcn/ui library.`,
    "components"
  )
)

export const customEntries: DocEntry[] = [
  entry(
    "m3-shapes",
    "Material Design 3 expressive shapes for icon boxes, image clipping masks, and placeholders.",
    "custom"
  ),
  entry(
    "mode-toggle",
    "Theme switcher with light, dark, and system modes.",
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
]

export const allDocEntries: DocEntry[] = [...componentEntries, ...customEntries]

export const docEntryBySlug: Record<string, DocEntry> = Object.fromEntries(
  allDocEntries.map((e) => [e.slug, e])
)

export const designSystemNav = {
  foundations: [
    { title: "Introduction", href: "/design-system" },
    { title: "Colors", href: "/design-system/colors" },
    { title: "Typography", href: "/design-system/typography" },
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
