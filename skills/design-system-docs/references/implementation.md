# Portfolio implementation reference

Canonical repository: [akssmax/portfolio](https://github.com/akssmax/portfolio). Paths below are relative to its application root. The implementation uses React, TanStack Start/Router, Tailwind v4, local shadcn/Radix/Base UI components, and Motion. They are reference choices, not required dependencies for another project.

## Layout baseline

The accompanying [screenshot](layout-reference.jpg) shows the open shell, selected component, preview controls, and right-hand page navigation.

| Element | Portfolio baseline | Invariant |
| --- | --- | --- |
| Toolbar | 56px | Breadcrumbs remain stationary across sidebar states. |
| Icon rail | 64px | Selection follows the route, not group expansion. |
| Expanded navigation | 260px; 280px on larger screens | Retain tree and scroll state when closed. |
| Toolbar leading group | 104px | Divider stays at the same x-coordinate in both states. |
| Shell | Fixed to the viewport; `100svh`; outer overflow clipped | Main and navigation scroll deliberately. |
| Sidebar transition | 240ms tween; `[0.22, 1, 0.36, 1]` | Shared export; duration zero for reduced motion. |
| Props search | 12 fields | Hide it for short lists. |
| Collapsed code | 15 lines | Copy still includes the whole example. |

Use these as the user's preferred documentation composition. Adapt breakpoints and widths when the host project has different density or navigation requirements. Preserve compact header placement and meaningful active states.

The desktop sidebar remains mounted. Its animated wrapper changes width and opacity; its inner content has a fixed expanded width. Apply `inert` and `aria-hidden` when closed. This avoids losing tree state while preventing focus from entering clipped content. Do not add a sidebar-width placeholder inside the toolbar.

## Files to inspect when source is available

Use the local checkout if attached to the task. Otherwise the repository links identify the reference implementation; the skill's main instructions remain usable without it.

| Concern | Reference files |
| --- | --- |
| Shell and navigation | `src/components/design-system/design-system-layout.tsx`, `docs-sidebar.tsx`, `doc-search.tsx` |
| Page structure and TOC | `src/components/design-system/doc-page.tsx`, `doc-section.tsx`, `component-doc-page.tsx` |
| Playground and prop UI | `src/components/design-system/component-playground.tsx`, `prop-controls.tsx`, `playground-context.tsx` |
| Deferred code/source | `src/components/design-system/code-block.tsx`, `component-source.tsx`, `src/lib/design-system/docs.ts` |
| Registry and authored guidance | `src/lib/design-system-registry.ts`, `src/lib/design-system/guidance.ts` |
| Generation and validation | `scripts/generate-design-system-docs.ts`, `design-system-playgrounds.ts`, `check-design-system-docs.ts` |
| Focused examples | `src/components/design-system/demos/playground-fixtures.tsx`, `chat-prompt-input-demo.tsx` |
| Motion foundation | `src/routes/design-system/animation.tsx`, `src/components/design-system/motion-demos.tsx`, `src/lib/design-system/motion-catalog.ts` |
| Shared preferences/recipes | `src/lib/motion-easing.ts`, `src/hooks/use-can-animate.ts`, `src/components/motion-preferences.tsx` |
| Narrow highlighting bundle | `src/lib/code-highlighter.ts` |

Example source links: [shell](https://github.com/akssmax/portfolio/blob/main/src/components/design-system/design-system-layout.tsx), [playground](https://github.com/akssmax/portfolio/blob/main/src/components/design-system/component-playground.tsx), [generator](https://github.com/akssmax/portfolio/blob/main/scripts/generate-design-system-docs.ts), [animation foundation](https://github.com/akssmax/portfolio/blob/main/src/routes/design-system/animation.tsx).

## Generation boundaries

The generator emits lightweight component reference JSON, separately loaded source text, and one lazy TSX renderer per component. It extracts complete runnable examples and typed per-part override templates. The validation command checks source freshness, renderer availability, and TypeScript validity of every complete example/template.

Wire equivalent regeneration into the destination's development/build lifecycle when practical. Preserve existing scripts. Write only changed output, and clearly identify generated files. The portfolio commands are `npm run docs:generate`, `npm run docs:check`, `npm run typecheck`, `npm test`, and `npm run build`; use the destination's package manager and checks.

Prefer useful local contracts over a giant inherited-prop dump. In the portfolio, native HTML props and upstream primitive APIs are described as forwarded; important local behavior is added explicitly. Calendar's mode discriminant and render-function props are intentionally not generic JSON controls. ChatPromptInput's inherited `children` is read-only because that implementation renders its own input and actions.

## Motion specifics

The portfolio has an application animation profile with `none`, `light`, and `full` tiers. Reuse its existing hook when working in that repository. On another project, inspect its actual preference and performance policy before introducing tiers or device heuristics.

MotionConfig alone does not stop every imperative animation, opacity loop, timer, or GPU effect. Effects need their own preference guards and cleanup. The reference ambient preview is explicitly started and stops after eight seconds. SVG morphing and stroke drawing are finite demonstrations. Inventory source files and actual behavior rather than copying the portfolio's list of engines into a project that lacks them.

## Conditional Vite/Nitro performance notes

Apply this section only to a project that uses the corresponding stack and exhibits the same bundling pressure. Do not paste its dependency list into unrelated projects.

The portfolio's default-memory build previously failed during Nitro server bundling. Keeping large Node-compatible libraries external in the **Nitro Vite environment**, and tracing them into deployment output, allowed the build to pass without an 8GB heap override. Merely adding trace entries without early externalization exposed a Rollup export-resolution failure in this installed toolchain.

The paired configuration is in [vite.config.ts](https://github.com/akssmax/portfolio/blob/main/vite.config.ts):

- `environments.nitro.resolve.external` lists the packages that can run directly in Node.
- Nitro `traceDeps` includes the same packages, preserving self-contained deployment output.
- React and React DOM stay together to avoid duplicate hook runtimes.
- Lucide needs full-package tracing (`lucide-react*`) for its dynamic icon map and dynamically imported icon files. Tracing only its ordinary entrypoint produced a missing-file error in the packaged server.
- PDF libraries were also externalized in this portfolio. That is relevant only when the destination actually uses them and its target runtime supports them.

A build passing is insufficient evidence that packaging is correct. Start the packaged server on a free local port and load real routes, then exercise features using the affected external dependencies. The portfolio checks included its documentation pages, lazy chat opening, source copying, and generating a valid PDF using the packaged library.

Restrict syntax highlighting to explicit languages/themes needed by the project, with readable plain-text fallback. The portfolio implementation uses a shared highlighter instance, coalesces concurrent work, keys results by the full code content, and bounds cached results so streamed partial responses do not grow memory indefinitely.
