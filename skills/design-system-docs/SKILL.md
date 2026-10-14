---
name: design-system-docs
description: Build or improve developer documentation for a project's local React component library, using the shared rail/sidebar layout, live prop playgrounds, local API references, and motion foundations. Use for design-system documentation and component explorers, including customized shadcn components; not for a generic visual redesign or a standalone marketing site.
---

# Design System Docs

Build a usable developer workspace around the project's actual components. Use the portfolio implementation as a visual and architectural reference, while keeping the destination project's brand, router, dependencies, and component contracts.

Read [the layout reference](references/layout-reference.jpg) for the shell and playground composition. Read [implementation notes](references/implementation.md) when porting the React architecture, generating API references, or investigating build performance.

## Establish the local source of truth

Inspect the existing documentation route, component exports, variants, theme tokens, motion helpers, and build scripts. Extend the project's working conventions. Do not install a second UI or animation stack merely to reproduce this layout.

Use upstream design systems for documentation patterns, not as a substitute for local API truth. Primer and Radix are useful references for anatomy, examples, API tables, and accessibility. Customized shadcn components must be documented from their local implementations.

## App shell

Use the following preferred defaults, adapting measurements to the destination:

- A narrow icon rail, expandable documentation sidebar, compact top toolbar, main document pane, and an optional right-hand table of contents.
- Put the sidebar and document inside one inset workspace with subtle rounded outer corners and a clean vertical separator. Collapse the sidebar to zero width; retain only the rail's intended gutter.
- Group the navigation into Foundations, Components, and project-specific Patterns. Put the introduction and customization workflow within easy reach. Use searchable component names and meaningful groups.
- Keep the header's back button, sidebar toggle, divider, and breadcrumbs in the **same horizontal positions** when the sidebar opens or closes. Expanding the sidebar must not introduce an empty header spacer.
- Derive rail selection from the current route and documentation category. Opening a sidebar group is not a route selection. Use one current destination per navigation surface and expose it with `aria-current`.
- Keep the shell within the viewport. Give navigation and document content their own intentional scroll regions; avoid body overflow, clipping anchored headings, and competing scrollbars.
- Preserve navigation expansion and scroll state across sidebar collapse. Closed navigation must become inert and unavailable to keyboard focus immediately; restore focus to the toggle when collapsing from inside it.
- Animate opening and closing with the project's motion preferences. Reduced motion should produce an immediate layout change. Keep mobile navigation in a drawer, close it after navigation, and restore trigger focus.
- Support keyboard documentation search and sidebar toggling when they do not conflict with the host app's shortcuts. Use platform-appropriate key labels.

Use semantic theme tokens for surfaces, borders, selection, and text. Keep documentation chrome readable, while examples inherit the project's real theme and component typography. Support light and dark appearances.

## Component documentation

Give each component a consistent page with an overview, playground, complete usage example, local API reference, styling/tokens, accessibility and keyboard behavior, customization guidance, and implementation source. Add related components and adjacent-page navigation where helpful.

Maintain a component registry and separate authored usage guidance from generated implementation data. Generate props, required flags, literal unions, defaults, exports, dependencies, and public slots from local TypeScript and styling definitions. Account for wrappers such as `forwardRef`, `memo`, and variant factories. Describe forwarded native/primitive props honestly instead of claiming an exhaustive generated table.

Keep source text out of initial route data and hydration. Fetch it when the source disclosure opens, with loading and retry states. A collapsed code block should render only its visible excerpt; expanding and copying must expose the complete code.

## Live playgrounds

Render real local components in independent lazy modules. The preview, prop controls, and copyable code must describe the same example and current overrides.

- Use a **single focused pattern instance** as the primary playground. A gallery with its own editors plus a second generated control panel creates competing controls. Put additional examples in their own section when they have a distinct purpose.
- Choose controls by the actual contract: selects for finite unions, switches for booleans, number/text/date inputs for compatible values. Keep controlled state and its callbacks paired.
- Show the component-part selector only when the example renders multiple editable parts. Do not offer exports that cannot be edited meaningfully in the example.
- Keep commonly useful visual and behavioral props visible. Put structured JSON, generic styling, callbacks, composition, and read-only fields under a collapsed **Advanced** section, with an indication of changed advanced values.
- Show prop search only when the field list is large; the reference threshold is 12. A tiny list needs no search box.
- Use JSON editors only for genuinely editable serializable structures, with explicit apply and parse feedback. Do not invent JSON inputs for render functions, React elements, DOM refs, internal controllers, or unsupported children. Explain those contracts as read-only code fields.
- Observe events without replacing the example's original callbacks. Keep controlled overrides editable through matching change callbacks, including mode changes. Provide a concise event log after interaction.
- Reset example state, prop overrides, and event output together. Isolate preview failures so a bad value does not crash the documentation shell.
- Reserve room for floating component UI. For a chat composer, avoid labels colliding with its floating mode switch and add picker headroom only while its project menu is open. Verify all variants, disabled/loading states, typing, and local submission.

Copyable examples must include imports, state, helper functions, and supporting data. Generate code for the selected part without losing discriminated-union validity. Regenerate reference data and playground modules from their source demos; do not hand-edit generated output.

## Foundations and motion

Provide foundations relevant to the project: colors, typography, accessibility, and animation, plus existing conventions such as scrollbars. Keep animation in Foundations.

Document motion that actually exists: shared durations/easing/springs, CSS transitions/keyframes, Motion APIs, SVG drawing/morphing, and any GSAP, canvas, WebGL, or WebGPU effects. Link each family to its owning source. Do not claim an engine or fallback the project does not use.

Include live, finite recipes for navigation transitions, easing, presence, springs, and supported SVG behaviors. Make decorative looping previews opt-in and stop them automatically. Describe reduced-motion behavior and the project's real low-power policy. Reuse shared motion helpers and clean up imperative animations, timers, and animation frames. Scope shared layout IDs per component instance when multiple instances can coexist.

## Performance and verification

Keep heavy demos, source text, syntax grammars, and unrelated interfaces out of the initial documentation shell. Use explicit grammar/theme imports and a bounded cache for streaming highlighting. Write generated files only when their content changes to avoid unnecessary HMR churn.

Treat a larger Node heap as a diagnostic workaround, not a performance improvement. Measure bundle/DOM changes and verify the production build with its normal memory settings. See the conditional Nitro notes in [implementation notes](references/implementation.md) before changing server bundling.

Verify the result in desktop and mobile browsers: route selection, stable header coordinates, keyboard search, focus restoration, sidebar animation/reduced motion, prop-to-preview-to-code synchronization, reset/copy/source loading, overlay bounds, and document overflow. Typecheck complete examples and generated templates against the actual components. Run the project's relevant checks and smoke-test packaged production output when build packaging changes. Report measured improvements without inventing Lighthouse scores or Core Web Vitals.
