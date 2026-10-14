export type ComponentGuidance = {
  usage: string[]
  accessibility: string[]
  keys?: [string, string][]
  related: string[]
}

const form: ComponentGuidance = {
  usage: [
    "Use a visible label and keep helper text close to the control.",
    "Choose controlled props when another part of the UI needs the value. Use default props for an independent, uncontrolled field.",
  ],
  accessibility: [
    "Connect Label.htmlFor to the control's id. A placeholder does not replace a label.",
    "Use aria-invalid for errors and aria-describedby to associate help or error text. Do not communicate errors through color alone.",
  ],
  keys: [["Tab / Shift + Tab", "Move between focusable controls."]],
  related: ["field", "label", "button"],
}
const overlay: ComponentGuidance = {
  usage: [
    "Keep the trigger and content together in the component tree; use the primitive's portal for floating content.",
    "Use controlled open and onOpenChange when opening the overlay from application state.",
  ],
  accessibility: [
    "Give the overlay a meaningful title and description. Keep its close control discoverable.",
    "Preserve the primitive's focus management. Verify that focus returns to the trigger after closing.",
  ],
  keys: [
    ["Escape", "Dismiss the overlay."],
    [
      "Tab / Shift + Tab",
      "Move through focusable content. Modal overlays contain focus.",
    ],
  ],
  related: ["dialog", "popover", "button"],
}
const menu: ComponentGuidance = {
  usage: [
    "Group related actions and give destructive actions a clear label.",
    "Use the primitive's item selection callback. Keep menu actions concise and use a dialog for multi-step tasks.",
  ],
  accessibility: [
    "Keep the trigger keyboard accessible and preserve the menu's roles and focus behavior.",
    "Give icon-only items an accessible name. Do not place arbitrary nested interactive controls inside a menu item.",
  ],
  keys: [
    ["Arrow keys", "Move through menu items or between menus."],
    ["Enter / Space", "Activate the focused item or trigger."],
    ["Escape", "Close the current menu and restore focus."],
  ],
  related: ["dropdown-menu", "context-menu", "button"],
}
const display: ComponentGuidance = {
  usage: [
    "Use semantic content and compose the exported parts shown in the example.",
    "Prefer semantic theme tokens for local styling so the component follows appearance settings.",
  ],
  accessibility: [
    "Keep the document's heading order and reading order meaningful.",
    "Include a text equivalent for information conveyed only through imagery, color, or animation.",
  ],
  related: ["card", "separator", "skeleton"],
}
const pattern: ComponentGuidance = {
  usage: [
    "Import the portfolio implementation directly and use the complete example as the composition reference.",
    "Keep reusable behavior in the component and pass page-specific content through its documented props.",
  ],
  accessibility: [
    "Verify keyboard access and reading order within the surrounding page.",
    "Test animation with reduced motion enabled, and provide useful alternatives for decorative or image content.",
  ],
  related: ["m3-shapes", "feature-card", "chat-prompt-input"],
}

const guidance: Record<string, ComponentGuidance> = {
  "chat-prompt-input": {
    usage: [
      "Keep value and onValueChange paired. onSubmit receives the message and the current Chat or Gen UI mode; the example records submissions locally.",
      "Use the playground props to switch between adaptive, minimal, and expanded layouts, or inspect disabled and loading states on the same composer.",
      "Leave space above the composer for its floating mode switch and project context menu. This preview adds headroom while the menu is open so it stays inside the preview.",
      "When mode is controlled, pair it with onModeChange so the mode switch can update it.",
    ],
    accessibility: [
      "The textarea and icon buttons have accessible names. Keep the prompt hint meaningful and test the surrounding form with the keyboard.",
      "Enter submits the prompt and Shift + Enter adds a new line. Arrow keys select project context; Escape closes the context menu.",
      "Voice input depends on browser support and microphone permission. Provide text input as the alternative.",
    ],
    related: ["ai-elements", "textarea", "input-group"],
  },
  "footer-gradients": {
    usage: [
      "Give the parent an explicit height. FooterGradients fills its container and is decorative; keep meaningful content outside the gradient.",
      "Choose activeVariant first. bars and stops apply to dia/fold3d; foldAngle and depth apply to fold3d. colors apply to peaked/dodge, and pointiness applies to peaked. peak and valley use fractional heights.",
      'Use reveal="mount" for an entrance, "none" for a static background, or "scroll" for the component\'s window-scroll reveal. Increment replayKey to replay a mount reveal. Omit stops/colors to use the built-in light and dark palettes.',
    ],
    accessibility: [
      "The gradient is hidden from assistive technology. Never use it as the only way to communicate a status or value.",
      'Use reveal="none" when reduced motion is requested, and check text contrast against the brightest part of the background.',
    ],
    related: ["footer-monogram", "monogram-patterns", "contact-section"],
  },
  "monogram-patterns": {
    usage: [
      'Place MonogramPattern inside a positioned container with a defined height. Use className="absolute inset-0" for a full background layer.',
      "Choose one of the eight variant values and a semantic tone. interactive enables the hover treatment; use isParentHovered when a surrounding card should drive the same treatment.",
      "Keep masks and overlays in the consuming layout using className or style. They are not separate MonogramPattern props.",
    ],
    accessibility: [
      "Treat the repeated marks as decoration and keep meaningful labels in normal text above the pattern.",
      "The component checks reduced motion. Hover effects must remain optional, and text must stay readable over every tone.",
    ],
    related: ["footer-monogram", "footer-gradients", "feature-card"],
  },
  "footer-monogram": {
    usage: [
      "Use animation for the motion preset, trigger for hover or continuous activation, and size for the mark's scale. The wrapper and SVG have separate wrapperClassName and className props.",
      'The runner game is opt-in with enableRunnerGame and requires size="footer". Use runnerActive with onRunnerActiveChange only when the parent owns its state.',
    ],
    accessibility: [
      "Keep the decorative monogram separate from important text. The component follows the site's motion preference.",
      "When enabling the runner, verify its start, exit, and game controls using the keyboard and provide surrounding instructions.",
    ],
    related: ["monogram-patterns", "footer-gradients", "m3-shapes"],
  },
  "contact-section": {
    usage: [
      "Use variant to choose the edge treatment, then configure topCutout/bottomCutout and their positions. dubWidth sizes the dub notch; m3Size sizes the m3 variants.",
      "Set --cta-cutout-bg on the surrounding surface so the cutouts blend into it. showBorders controls the decorative edge lines and cutouts together.",
      "Use a unique id when rendering more than one section on a page. showGithubActivity is opt-in and can load live activity.",
    ],
    accessibility: [
      "Keep the section's heading, contact actions, and focus indicators readable in both themes.",
      "Cutouts are decorative. Check that they do not obscure content at narrow widths or larger text sizes.",
    ],
    related: ["hero-section", "footer-gradients", "button"],
  },
  button: {
    usage: [
      "Use default for the main action, outline or secondary for supporting actions, and ghost for quiet controls.",
      'Set type="button" inside forms unless the action should submit. Use asChild with a link for navigation.',
      "Compose a spinner and disabled state while an action is pending. The local Button has no loading prop.",
    ],
    accessibility: [
      "Use a clear action label. Icon-only buttons need an aria-label or visually hidden text.",
      "Preserve the focus-visible ring. Native disabled buttons leave the tab order; explain unavailable actions in nearby text.",
      "Use aria-busy and a persistent text label for pending actions. Hide a decorative spinner from assistive technology.",
    ],
    keys: [
      ["Tab", "Focus an enabled button."],
      ["Enter / Space", "Activate the focused button."],
    ],
    related: ["button-group", "tooltip", "alert-dialog"],
  },
  avatar: {
    usage: [
      "Compose AvatarImage and AvatarFallback inside Avatar; the fallback appears while an image is unavailable.",
      "Use the size prop on Avatar. AvatarGroup and AvatarGroupCount compose a stack without changing the individual avatar API.",
      "Keep status information in nearby text or give AvatarBadge an accessible label.",
    ],
    accessibility: [
      'Give a meaningful profile photo an alt value. Use alt="" when adjacent text already names the person.',
      "Initials alone may be ambiguous. Include the person's name in the surrounding content or an accessible label.",
    ],
    related: ["item", "hover-card", "badge"],
  },
  badge: {
    ...display,
    usage: [
      "Use badges for short status or metadata labels. Pair color with meaningful text.",
      "Badge renders a span by default. Use asChild when composing a link, and preserve the child's accessible name.",
    ],
    related: ["avatar", "item", "button"],
  },
  input: {
    ...form,
    usage: [
      "Choose an appropriate native type such as email, url, or password, and supply autocomplete when relevant.",
      "Compose the input with Label or Field for descriptions and validation. Use InputGroup when leading or trailing actions are needed.",
    ],
    related: ["field", "input-group", "textarea"],
  },
  textarea: {
    ...form,
    usage: [
      "Use for multi-line free-form input. Set rows or minimum height to match the expected response.",
      "Keep validation, character limits, and descriptions visible alongside the field.",
    ],
    related: ["input", "field", "label"],
  },
  checkbox: {
    ...form,
    usage: [
      "Use for independent choices or selecting multiple options. Use RadioGroup for mutually exclusive choices.",
      'The Radix checked state can also be "indeterminate"; preserve that state for partially selected groups.',
    ],
    keys: [
      ["Space", "Toggle the focused checkbox."],
      ["Tab", "Move to the next control."],
    ],
    related: ["radio-group", "switch", "field"],
  },
  switch: {
    ...form,
    usage: [
      "Use for a setting that takes effect immediately. Use Checkbox for a choice submitted with a form.",
      "Pair checked with onCheckedChange for controlled usage and keep the label stable when the value changes.",
    ],
    keys: [
      ["Space", "Toggle the focused switch."],
      ["Tab", "Move to the next control."],
    ],
    related: ["checkbox", "field", "label"],
  },
  "radio-group": {
    ...form,
    keys: [
      ["Arrow keys", "Move between and select an option in the group."],
      ["Tab", "Move into or out of the group."],
    ],
    related: ["checkbox", "select", "field"],
  },
  slider: {
    ...form,
    usage: [
      "Use value or defaultValue arrays: one value for a single thumb, two for a range.",
      "Provide a visible value and appropriate min, max, and step. Give every thumb an accessible name when composing custom slider behavior.",
    ],
    keys: [
      ["Arrow keys", "Adjust the focused thumb."],
      ["Home / End", "Move to the minimum or maximum."],
    ],
    related: ["input", "progress", "field"],
  },
  select: {
    ...form,
    keys: [
      ["Enter / Space", "Open the select or confirm a choice."],
      ["Arrow keys", "Move between options."],
      ["Escape", "Close the list."],
    ],
    related: ["native-select", "combobox", "field"],
  },
  combobox: {
    ...form,
    usage: [
      "Use a combobox when the choices need text filtering. This implementation uses Base UI, so use its render composition API.",
      "Provide a useful empty state and preserve the relationship between the input, list, and options.",
    ],
    keys: [
      ["Arrow keys", "Move through the filtered options."],
      ["Enter", "Select the active option."],
      ["Escape", "Close the popup."],
    ],
    related: ["select", "command", "input-group"],
  },
  dialog: { ...overlay, related: ["alert-dialog", "sheet", "drawer"] },
  "alert-dialog": {
    ...overlay,
    usage: [
      "Use for an interruption that requires an explicit decision, such as confirming deletion.",
      "Give the cancel action a safe, clear label and explain the effect of the destructive action.",
    ],
    keys: [
      ["Tab / Shift + Tab", "Move between actions inside the modal."],
      ["Enter / Space", "Activate the focused action."],
      ["Escape", "Cancel and restore focus."],
    ],
    related: ["dialog", "button", "alert"],
  },
  drawer: { ...overlay, related: ["sheet", "dialog", "button"] },
  sheet: { ...overlay, related: ["drawer", "dialog", "sidebar"] },
  popover: {
    ...overlay,
    accessibility: [
      "Use for short contextual interactions. Preserve trigger and content composition so the primitive can manage focus.",
      "Choose a dialog for tasks that need a title, description, and a modal workflow.",
    ],
    related: ["hover-card", "tooltip", "dialog"],
  },
  "dropdown-menu": menu,
  "context-menu": menu,
  menubar: menu,
  tooltip: {
    ...display,
    usage: [
      "Use for short supplementary information, never as the only way to discover an action or error.",
      "The application already mounts TooltipProvider. Keep TooltipTrigger and TooltipContent together.",
    ],
    accessibility: [
      "Tooltips must appear on keyboard focus as well as hover. Name the trigger independently.",
      "Keep interactive content out of a tooltip; use Popover or HoverCard when richer content is needed.",
    ],
    keys: [
      ["Focus / Hover", "Show the tooltip."],
      ["Escape", "Dismiss the tooltip."],
    ],
    related: ["popover", "hover-card", "button"],
  },
  "hover-card": {
    ...display,
    usage: [
      "Use for a supplementary preview of a linked resource.",
      "Keep essential information and actions available outside the hover card, especially on touch devices.",
    ],
    accessibility: [
      "Do not require users to open the preview to understand or use the underlying link.",
      "For a keyboard-operated interactive panel, use Popover instead.",
    ],
    related: ["popover", "tooltip", "avatar"],
  },
  tabs: {
    ...display,
    usage: [
      "Use matching value props on each trigger and panel. Provide defaultValue or a controlled value.",
      "Use for switching related views in place. Use links when each item navigates to a distinct page.",
    ],
    accessibility: [
      "Keep TabsList, TabsTrigger, and TabsContent composed together to preserve their relationships.",
      "Make each panel's purpose clear from its trigger label.",
    ],
    keys: [
      ["Arrow keys", "Move between tabs in the list's orientation."],
      ["Home / End", "Move to the first or last tab."],
      ["Tab", "Move from the active tab into the panel."],
    ],
    related: ["navigation-menu", "toggle-group", "accordion"],
  },
  accordion: {
    ...display,
    usage: [
      'Use type="single" for one expanded item or type="multiple" for independent sections.',
      "Keep item values stable. Use collapsible with a single accordion to allow all sections to close.",
    ],
    accessibility: [
      "Use descriptive trigger labels and maintain an appropriate heading hierarchy.",
      "Keep interactive controls out of the trigger button.",
    ],
    keys: [
      ["Enter / Space", "Expand or collapse the focused section."],
      ["Arrow keys", "Move focus between triggers."],
      ["Home / End", "Focus the first or last trigger."],
    ],
    related: ["collapsible", "tabs", "card"],
  },
  collapsible: {
    ...display,
    keys: [["Enter / Space", "Toggle the content from its trigger."]],
    related: ["accordion", "button", "card"],
  },
  command: {
    ...menu,
    usage: [
      "Use for searchable actions or navigation. Supply useful keywords and an explicit empty state.",
      "Use Command inside the dialog composition when building a global command palette.",
    ],
    related: ["combobox", "dialog", "input"],
  },
  "toggle-group": {
    ...form,
    keys: [
      ["Arrow keys", "Move between toggle items."],
      ["Enter / Space", "Toggle the focused item."],
    ],
    related: ["toggle", "radio-group", "tabs"],
  },
  toggle: {
    ...form,
    usage: [
      "Use for an on/off toolbar action with a pressed state, such as bold formatting.",
      "Use pressed and onPressedChange for controlled usage. Keep its action label stable.",
    ],
    keys: [["Enter / Space", "Toggle the pressed state."]],
    related: ["toggle-group", "button", "switch"],
  },
  progress: {
    ...display,
    accessibility: [
      "Give progress an accessible label and expose its value meaningfully.",
      "Describe ongoing work in text. Use an indeterminate indicator only when progress cannot be measured.",
    ],
    related: ["spinner", "skeleton", "button"],
  },
  skeleton: {
    ...display,
    usage: [
      "Match the shape of the expected content to reduce layout shifts.",
      "Keep skeletons decorative and provide a single useful loading announcement for the surrounding region.",
    ],
    related: ["spinner", "progress", "card"],
  },
  spinner: {
    ...display,
    accessibility: [
      "Provide a text loading label or name the surrounding busy region.",
      "Avoid multiple live announcements for the same pending action. Honor reduced motion in custom animation changes.",
    ],
    related: ["progress", "skeleton", "button"],
  },
  sonner: {
    ...display,
    usage: [
      "Mount Toaster once in the relevant application surface and call toast() from sonner to announce outcomes.",
      "Use concise messages and offer an action only when it has a clear, safe purpose.",
    ],
    accessibility: [
      "Do not use a transient toast as the only record of an error or required user action.",
      "Check announcement timing and keyboard access to toast actions.",
    ],
    related: ["alert", "dialog", "button"],
  },
  carousel: {
    ...display,
    usage: [
      "Compose CarouselContent and CarouselItem inside Carousel, with the exported previous and next controls.",
      "Keep the viewport and navigation usable at small widths. Avoid automatic rotation for essential content.",
    ],
    accessibility: [
      "Give the carousel an accessible label and its controls explicit previous/next names.",
      "Keep slide content and controls reachable by keyboard.",
    ],
    keys: [
      [
        "Left / Right arrows",
        "Navigate a horizontal carousel when its keyboard handler receives focus.",
      ],
    ],
    related: ["aspect-ratio", "card", "button"],
  },
  table: {
    ...display,
    accessibility: [
      "Use actual table headers and an informative caption when the context needs it.",
      "Keep data usable with horizontal scrolling on small screens. Do not convey a cell's meaning only through color.",
    ],
    related: ["scroll-area", "badge", "pagination"],
  },
  chart: {
    ...display,
    usage: [
      "Define a ChartConfig with semantic labels and colors, then pass it to ChartContainer.",
      "Use the exported tooltip and legend parts with Recharts. Keep the chart container's dimensions explicit.",
    ],
    accessibility: [
      "Enable Recharts accessibility features where supported and provide a meaningful chart title.",
      "Give complex data a text summary or table alternative; color and hover tooltips are not enough.",
    ],
    related: ["table", "card", "tooltip"],
  },
}

for (const slug of [
  "field",
  "label",
  "input-group",
  "input-otp",
  "native-select",
  "calendar",
])
  guidance[slug] ??= form
for (const slug of [
  "alert",
  "aspect-ratio",
  "breadcrumb",
  "button-group",
  "card",
  "empty",
  "item",
  "kbd",
  "navigation-menu",
  "pagination",
  "resizable",
  "scroll-area",
  "separator",
  "sidebar",
])
  guidance[slug] ??= display

export function getComponentGuidance(
  slug: string,
  custom: boolean
): ComponentGuidance {
  return guidance[slug] ?? (custom ? pattern : display)
}
