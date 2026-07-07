import type { ComponentType } from "react"

import { PlaceholderDemo } from "@/components/design-system/demos/placeholder-demo"

type DemoModule = { default: ComponentType }

const demoLoaders: Record<string, (() => Promise<DemoModule>) | undefined> = {
  accordion: () => import("./tier-2-demos").then((m) => ({ default: m.AccordionDemo })),
  alert: () => import("./tier-1-demos").then((m) => ({ default: m.AlertDemo })),
  "alert-dialog": () => import("./tier-2-demos").then((m) => ({ default: m.AlertDialogDemo })),
  "aspect-ratio": () => import("./tier-2-demos").then((m) => ({ default: m.AspectRatioDemo })),
  avatar: () => import("./tier-1-demos").then((m) => ({ default: m.AvatarDemo })),
  badge: () => import("./tier-1-demos").then((m) => ({ default: m.BadgeDemo })),
  breadcrumb: () => import("./tier-2-demos").then((m) => ({ default: m.BreadcrumbDemo })),
  button: () => import("./tier-1-demos").then((m) => ({ default: m.ButtonDemo })),
  "button-group": () => import("./tier-2-demos").then((m) => ({ default: m.ButtonGroupDemo })),
  calendar: () => import("./tier-3-demos").then((m) => ({ default: m.CalendarDemo })),
  card: () => import("./tier-1-demos").then((m) => ({ default: m.CardDemo })),
  carousel: () => import("./tier-4-demos").then((m) => ({ default: m.CarouselDemo })),
  chart: () => import("./tier-4-demos").then((m) => ({ default: m.ChartDemo })),
  checkbox: () => import("./tier-1-demos").then((m) => ({ default: m.CheckboxDemo })),
  collapsible: () => import("./tier-2-demos").then((m) => ({ default: m.CollapsibleDemo })),
  combobox: () => import("./tier-4-demos").then((m) => ({ default: m.ComboboxDemo })),
  command: () => import("./tier-4-demos").then((m) => ({ default: m.CommandDemo })),
  "context-menu": () => import("./tier-4-demos").then((m) => ({ default: m.ContextMenuDemo })),
  dialog: () => import("./tier-1-demos").then((m) => ({ default: m.DialogDemo })),
  drawer: () => import("./tier-2-demos").then((m) => ({ default: m.DrawerDemo })),
  "dropdown-menu": () => import("./tier-1-demos").then((m) => ({ default: m.DropdownMenuDemo })),
  empty: () => import("./tier-2-demos").then((m) => ({ default: m.EmptyDemo })),
  field: () => import("./tier-2-demos").then((m) => ({ default: m.FieldDemo })),
  "hover-card": () => import("./tier-4-demos").then((m) => ({ default: m.HoverCardDemo })),
  input: () => import("./tier-1-demos").then((m) => ({ default: m.InputDemo })),
  "input-group": () => import("./tier-2-demos").then((m) => ({ default: m.InputGroupDemo })),
  "input-otp": () => import("./tier-4-demos").then((m) => ({ default: m.InputOtpDemo })),
  item: () => import("./tier-4-demos").then((m) => ({ default: m.ItemDemo })),
  kbd: () => import("./tier-2-demos").then((m) => ({ default: m.KbdDemo })),
  label: () => import("./tier-3-demos").then((m) => ({ default: m.LabelDemo })),
  menubar: () => import("./tier-4-demos").then((m) => ({ default: m.MenubarDemo })),
  "native-select": () => import("./tier-2-demos").then((m) => ({ default: m.NativeSelectDemo })),
  "navigation-menu": () => import("./tier-4-demos").then((m) => ({ default: m.NavigationMenuDemo })),
  pagination: () => import("./tier-2-demos").then((m) => ({ default: m.PaginationDemo })),
  popover: () => import("./tier-2-demos").then((m) => ({ default: m.PopoverDemo })),
  progress: () => import("./tier-2-demos").then((m) => ({ default: m.ProgressDemo })),
  "radio-group": () => import("./tier-2-demos").then((m) => ({ default: m.RadioGroupDemo })),
  resizable: () => import("./tier-2-demos").then((m) => ({ default: m.ResizableDemo })),
  "scroll-area": () => import("./tier-2-demos").then((m) => ({ default: m.ScrollAreaDemo })),
  select: () => import("./tier-1-demos").then((m) => ({ default: m.SelectDemo })),
  separator: () => import("./tier-1-demos").then((m) => ({ default: m.SeparatorDemo })),
  sheet: () => import("./tier-2-demos").then((m) => ({ default: m.SheetDemo })),
  sidebar: () => import("./tier-4-demos").then((m) => ({ default: m.SidebarDemo })),
  skeleton: () => import("./tier-1-demos").then((m) => ({ default: m.SkeletonDemo })),
  slider: () => import("./tier-2-demos").then((m) => ({ default: m.SliderDemo })),
  sonner: () => import("./tier-3-demos").then((m) => ({ default: m.SonnerDemo })),
  spinner: () => import("./tier-2-demos").then((m) => ({ default: m.SpinnerDemo })),
  switch: () => import("./tier-1-demos").then((m) => ({ default: m.SwitchDemo })),
  table: () => import("./tier-2-demos").then((m) => ({ default: m.TableDemo })),
  tabs: () => import("./tier-1-demos").then((m) => ({ default: m.TabsDemo })),
  textarea: () => import("./tier-1-demos").then((m) => ({ default: m.TextareaDemo })),
  toggle: () => import("./tier-2-demos").then((m) => ({ default: m.ToggleDemo })),
  "toggle-group": () => import("./tier-2-demos").then((m) => ({ default: m.ToggleGroupDemo })),
  tooltip: () => import("./tier-1-demos").then((m) => ({ default: m.TooltipDemo })),
  "m3-shapes": () => import("./m3-shapes-demo").then((m) => ({ default: m.M3ShapesDemo })),
  "footer-monogram": () => import("./footer-monogram-demo").then((m) => ({ default: m.FooterMonogramDemo })),
  "footer-gradients": () => import("./footer-gradients-demo").then((m) => ({ default: m.FooterGradientsDemo })),
  "monogram-patterns": () => import("./monogram-patterns-demo").then((m) => ({ default: m.MonogramPatternsDemo })),
  scrollbars: () => import("./scrollbar-demo").then((m) => ({ default: m.ScrollbarDemo })),
  "mode-toggle": () => import("./custom-demos").then((m) => ({ default: m.ModeToggleDemo })),
  "theme-customizer": () => import("./custom-demos").then((m) => ({ default: m.ThemeCustomizerDemo })),
  "site-header": () => import("./custom-demos").then((m) => ({ default: m.SiteHeaderDemo })),
  "hero-section": () => import("./custom-demos").then((m) => ({ default: m.HeroSectionDemo })),
  "work-section": () => import("./custom-demos").then((m) => ({ default: m.WorkSectionDemo })),
  "skills-section": () => import("./custom-demos").then((m) => ({ default: m.SkillsSectionDemo })),
  "contact-section": () => import("./custom-demos").then((m) => ({ default: m.ContactSectionDemo })),
  "ai-elements": () => import("./ai-elements-demo").then((m) => ({ default: m.AiElementsDemo })),
  "chat-prompt-input": () => import("./chat-prompt-input-demo").then((m) => ({ default: m.ChatInputDemo })),
  "feature-card": () => import("./custom-demos").then((m) => ({ default: m.FeatureCardDemo })),
  "feature-card-grid": () => import("./custom-demos").then((m) => ({ default: m.FeatureCardGridDemo })),
  "projects-showcase": () => import("./custom-demos").then((m) => ({ default: m.ProjectsShowcaseDemo })),
}

export function loadDemo(slug: string): Promise<ComponentType> {
  const loader = demoLoaders[slug]
  if (!loader) {
    return Promise.resolve(() => <PlaceholderDemo name={slug} />)
  }
  return loader().then((module) => module.default)
}

export function hasDemo(slug: string): boolean {
  return slug in demoLoaders
}
