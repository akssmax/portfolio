import { Link, createFileRoute } from "@tanstack/react-router"
import { CodeBlock, CopyButton } from "@/components/design-system/code-block"
import { DocPage, DocHeader } from "@/components/design-system/doc-page"
import { DocSection } from "@/components/design-system/doc-section"
import {
  EasingPreview,
  NavigationMotionPreview,
  PresenceMotionPreview,
  SpringMotionPreview,
  SvgMotionPreview,
  AmbientMotionPreview,
} from "@/components/design-system/motion-demos"
import { Switch } from "@/components/ui/switch"
import {
  useAnimationProfile,
  useReducedMotionSettings,
  setSiteReducedMotion,
} from "@/hooks/use-can-animate"
import {
  motionCatalog,
  motionClassRecipes,
} from "@/lib/design-system/motion-catalog"
import {
  SIDEBAR_TRANSITION,
  PROMPT_LAYOUT_TRANSITION,
} from "@/lib/motion-easing"

export const Route = createFileRoute("/design-system/animation")({
  head: () => ({ meta: [{ title: "Animation — Design System" }] }),
  component: AnimationPage,
})

const toc = [
  { id: "principles", title: "Motion rules" },
  { id: "timing", title: "Timing & easing" },
  { id: "recipes", title: "Interaction recipes" },
  { id: "svg", title: "SVG & shape morphs" },
  { id: "ambient", title: "Ambient effects" },
  { id: "reduced-motion", title: "Preferences & tiers" },
  { id: "implementation", title: "Implementation" },
  { id: "inventory", title: "Animation inventory" },
]

function AnimationPage() {
  const profile = useAnimationProfile()
  const { systemReducedMotion, siteReducedMotion } = useReducedMotionSettings()
  return (
    <DocPage toc={toc}>
      <article className="min-w-0 space-y-10">
        <DocHeader
          title="Animation"
          description="Motion that explains a change, responds to an action, or adds a quiet layer of personality. Explore the curves, recipes, preferences, and custom effects used in this portfolio."
        >
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            {["Motion for React", "CSS", "SVG", "Canvas / GPU", "GSAP"].map(
              (engine) => (
                <span
                  key={engine}
                  className="rounded-md border border-border px-2 py-1 text-muted-foreground"
                >
                  {engine}
                </span>
              )
            )}
          </div>
        </DocHeader>

        <div className="space-y-4 rounded-xl border border-border bg-muted/15 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p role="status" className="text-sm font-medium">
                Current motion tier:{" "}
                <span className="text-primary">{profile.tier}</span>
              </p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                These previews follow your device and portfolio preferences.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <label htmlFor="animation-reduce-motion" className="text-xs">
                Reduce motion
              </label>
              <Switch
                id="animation-reduce-motion"
                checked={systemReducedMotion || siteReducedMotion}
                disabled={systemReducedMotion}
                onCheckedChange={setSiteReducedMotion}
              />
            </div>
          </div>
          <p className="text-[11px] leading-5 text-muted-foreground">
            {systemReducedMotion
              ? "Enabled by your device. The portfolio preference cannot override it."
              : "This is the shared portfolio preference. It also changes sidebar transitions and other motion across the site."}
          </p>
        </div>

        <DocSection
          id="principles"
          title="Motion rules"
          description="Use these rules when adding an interaction or customizing a component."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              [
                "Explain a change",
                "Use motion to connect a trigger to its result. Keep essential content and state understandable when animation is disabled.",
              ],
              [
                "Keep UI movement restrained",
                "Use smooth tweens for navigation and text containers. Reserve spring overshoot, morphing, blur, and continuous motion for deliberate component treatments.",
              ],
              [
                "Reuse the existing recipes",
                "Import shared curves and class helpers from motion-easing.ts. Component-specific presets stay with their owning component; their timings are listed below.",
              ],
              [
                "Make interactions interruptible",
                "A second click should reverse or replace a transition immediately. Hidden content must leave the tab order, and focus must remain in a usable place.",
              ],
              [
                "Choose cheap properties",
                "Prefer opacity and transform for ordinary feedback. Sidebar width is an intentional layout exception so the reading area resizes along with the navigation.",
              ],
              [
                "Bound background work",
                "Gate decorative loops with the local motion profile, pause inactive or offscreen work, and clean up playback controls, timers, observers, and animation frames.",
              ],
            ].map(([title, description]) => (
              <div key={title} className="rounded-xl border border-border p-5">
                <h3 className="text-xs font-semibold">{title}</h3>
                <p className="mt-2 text-xs leading-6 text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </DocSection>

        <DocSection
          id="timing"
          title="Timing & easing"
          description="Values below come from the shared exports. Motion uses seconds; CSS class durations use milliseconds."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border p-5">
              <p className="font-mono text-[10px] text-muted-foreground">
                SIDEBAR_TRANSITION
              </p>
              <p className="mt-2 text-3xl font-semibold">
                {SIDEBAR_TRANSITION.duration * 1000}
                <span className="ml-1 text-sm text-muted-foreground">ms</span>
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Navigation width + opacity · smooth tween
              </p>
            </div>
            <div className="rounded-xl border border-border p-5">
              <p className="font-mono text-[10px] text-muted-foreground">
                PROMPT_LAYOUT_TRANSITION
              </p>
              <p className="mt-2 text-3xl font-semibold">
                {PROMPT_LAYOUT_TRANSITION.layout.duration * 1000}
                <span className="ml-1 text-sm text-muted-foreground">ms</span>
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Prompt layout · smooth tween
              </p>
            </div>
          </div>
          <EasingPreview />
          <CodeBlock
            filename="shared-transitions.tsx"
            code={
              'import { EASE_OUT_SMOOTH, SIDEBAR_TRANSITION } from "@/lib/motion-easing"\n\n<motion.aside\n  initial={false}\n  animate={{ width: open ? 280 : 0, opacity: open ? 1 : 0 }}\n  transition={canAnimate ? SIDEBAR_TRANSITION : { duration: 0 }}\n  inert={!open}\n  aria-hidden={!open}\n/>\n\n// For another tween, choose duration to suit the specific interaction:\nconst transition = { duration: 0.3, ease: EASE_OUT_SMOOTH }'
            }
          />
          <div className="divide-y divide-border overflow-hidden rounded-xl border border-border">
            {motionClassRecipes.map((recipe) => (
              <div key={recipe.name} className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] font-medium break-all">
                      {recipe.name}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {recipe.use}
                    </p>
                  </div>
                  <CopyButton
                    label={`Copy ${recipe.name} recipe`}
                    value={`import { ${recipe.name} } from "@/lib/motion-easing"\n\n<div className={${recipe.name}}>Content</div>`}
                  />
                </div>
                <code className="block text-[10px] leading-5 break-all text-muted-foreground">
                  {recipe.value}
                </code>
              </div>
            ))}
          </div>
        </DocSection>

        <DocSection
          id="recipes"
          title="Interaction recipes"
          description="Small, deliberate examples of the interactions already used in the interface. Each preview can be replayed without changing global timing settings."
        >
          <NavigationMotionPreview />
          <p className="text-xs leading-6 text-muted-foreground">
            The real sidebar uses the same shared transition. It remains mounted
            to preserve expanded groups and scroll position; its closed state is
            inert. The toolbar stays in the same position.
          </p>
          <PresenceMotionPreview />
          <CodeBlock
            filename="presence.tsx"
            code={
              'import { AnimatePresence, motion } from "motion/react"\nimport { useCanAnimate } from "@/hooks/use-can-animate"\nimport { SIDEBAR_TRANSITION } from "@/lib/motion-easing"\n\n// Inside your component; visible comes from application state.\nconst canAnimate = useCanAnimate()\n\n<AnimatePresence initial={false}>\n  {visible && (\n    <motion.div\n      key="result"\n      initial={canAnimate ? { opacity: 0, y: 12 } : false}\n      animate={{ opacity: 1, y: 0 }}\n      exit={{ opacity: 0, y: canAnimate ? -8 : 0 }}\n      transition={canAnimate ? SIDEBAR_TRANSITION : { duration: 0 }}\n    >\n      Changes saved\n    </motion.div>\n  )}\n</AnimatePresence>'
            }
          />
          <SpringMotionPreview />
          <CodeBlock
            filename="spring-feedback.tsx"
            code={
              '<motion.button\n  whileHover={canAnimate ? { scale: 1.06, y: -2 } : undefined}\n  whileFocus={canAnimate ? { scale: 1.06, y: -2 } : undefined}\n  whileTap={canAnimate ? { scale: 0.98, y: 0 } : undefined}\n  transition={canAnimate\n    ? { type: "spring", stiffness: 340, damping: 22 }\n    : { duration: 0 }}\n>\n  Explore project\n</motion.button>'
            }
          />
        </DocSection>

        <DocSection
          id="svg"
          title="SVG & shape morphs"
          description="Use pathLength for a stroke reveal. Use Flubber for shape interpolation, with Motion driving progress and cleanup."
        >
          <SvgMotionPreview />
          <CodeBlock
            filename="morph-progress.tsx"
            code={
              'import { animate, useMotionValue } from "motion/react"\nimport { useEffect, useMemo } from "react"\nimport { useAnimationProfile } from "@/hooks/use-can-animate"\nimport { createShapeMorphInterpolator } from "@/lib/m3-shape-morph"\n\n// Inside your component; target is 0 or 1 from application state.\nconst { fullMotion } = useAnimationProfile()\nconst progress = useMotionValue(0)\nconst interpolate = useMemo(\n  () => createShapeMorphInterpolator("circle", "flower"), []\n)\n\nuseEffect(() => {\n  if (!fullMotion) {\n    progress.set(target) // Render the new shape directly.\n    return\n  }\n  const controls = animate(progress, target, {\n    duration: 1.2, ease: [0.45, 0, 0.25, 1],\n  })\n  return () => controls.stop()\n}, [target, fullMotion, progress])\n\n// Use useTransform(progress, t => interpolate?.(t) ?? fallbackPath)\n// as the d value on motion.path.'
            }
          />
          <p className="text-xs leading-6 text-muted-foreground">
            The preview follows the avatar's 1.2s morph timing. M3FeatureImage
            has its own 750ms morph and 450ms image crossfade. These are
            component presets, not interchangeable global durations.
          </p>
          <Link
            to="/design-system/components/$slug"
            params={{ slug: "m3-shapes" }}
            className="text-xs font-medium text-primary hover:underline"
          >
            Explore M3 Shapes →
          </Link>
        </DocSection>

        <DocSection
          id="ambient"
          title="Ambient effects"
          description="Decorative loops should have an explicit lifecycle. This preview is opt-in and stops after eight seconds."
        >
          <AmbientMotionPreview />
          <p className="text-xs leading-6 text-muted-foreground">
            The example uses the real BorderBeam and Shimmer components. When
            motion is disabled, it unmounts the animated layers and keeps the
            static text. Canvas, WebGL, WebGPU, and GSAP effects follow the same
            lifecycle rule at their consuming wrapper.
          </p>
        </DocSection>

        <DocSection
          id="reduced-motion"
          title="Preferences & tiers"
          description="The local hooks combine the operating system preference, the portfolio's stored preference, hydration, and a device-capability heuristic."
        >
          <div className="space-y-3">
            {[
              [
                "none",
                "canAnimate: false · fullMotion: false",
                "Used before hydration or when either reduced-motion preference is enabled. Render final states immediately and retain all actions and content.",
              ],
              [
                "light",
                "canAnimate: true · fullMotion: false",
                "Used by the device heuristic for lower capability devices. Keep simple feedback; avoid expensive shared layout, SVG morphs, blur, and 3D treatments.",
              ],
              [
                "full",
                "canAnimate: true · fullMotion: true",
                "Enables richer component treatments when the device heuristic allows them. This is permission to enhance, not a reason to run every effect at once.",
              ],
            ].map(([tier, flags, description]) => (
              <div key={tier} className="rounded-xl border border-border p-5">
                <h3 className="text-sm font-semibold">{tier}</h3>
                <p className="mt-1 font-mono text-[10px] break-words text-muted-foreground">
                  {flags}
                </p>
                <p className="mt-3 text-xs leading-6 text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>
          <p className="text-sm leading-7 text-muted-foreground">
            MotionPreferences applies MotionConfig and the document's{" "}
            <code className="text-foreground">data-site-reduced-motion</code>{" "}
            attribute. MotionConfig suppresses transform/layout animation; it
            does not automatically cancel every opacity, background-position,
            imperative animate(), or canvas loop. Custom effects must use the
            local profile and explicit cleanup.
          </p>
          <CodeBlock
            filename="motion-profile.tsx"
            code={
              'import { useAnimationProfile } from "@/hooks/use-can-animate"\n\nconst { canAnimate, fullMotion, tier } = useAnimationProfile()\n\n// Small interactive feedback\n<motion.div\n  animate={{ opacity: visible ? 1 : 0 }}\n  transition={{ duration: canAnimate ? 0.2 : 0 }}\n/>\n\n// Expensive optional decoration\n{fullMotion ? <AnimatedBackground /> : <StaticBackground />}'
            }
          />
          <p className="text-xs leading-6 text-muted-foreground">
            The current heuristic chooses light motion at six or fewer logical
            cores, reported device memory of 4GB or less, or Windows with eight
            or fewer logical cores. The site preference is stored as{" "}
            <code>portfolio:reduced-motion</code>; an operating system request
            always takes precedence.
          </p>
          <Link
            to="/design-system/accessibility"
            className="text-xs font-medium text-primary hover:underline"
          >
            Accessibility guidelines →
          </Link>
        </DocSection>

        <DocSection
          id="implementation"
          title="Implementation"
          description="Choose the smallest engine that supports the interaction. Use the existing implementation before creating another animation utility."
        >
          <div className="space-y-3 rounded-xl border border-border p-5 text-xs leading-6 text-muted-foreground">
            <p>
              <strong className="text-foreground">CSS:</strong> color, border,
              shadow, and simple hover transitions. Animate only the relevant
              properties, and include motion-reduce variants.
            </p>
            <p>
              <strong className="text-foreground">Motion:</strong> state
              transitions, presence, gestures, springs, layout, and motion
              values. Use <code>initial=&#123;false&#125;</code> when the
              initial state should render without an entrance.
            </p>
            <p>
              <strong className="text-foreground">Custom engines:</strong>{" "}
              Flubber for SVG paths, GSAP inertia for pointer physics, and
              canvas/WebGL/WebGPU for dense backgrounds. Keep these in their
              current wrappers with visibility checks and cleanup.
            </p>
          </div>
          <CodeBlock
            filename="imperative-cleanup.tsx"
            code={
              'useEffect(() => {\n  if (!canAnimate || !active) return\n\n  const controls = animate(progress, [0, 1], {\n    duration: 6, ease: "linear", repeat: Infinity,\n  })\n  return () => controls.stop()\n}, [canAnimate, active, progress])\n\n// For requestAnimationFrame: cancelAnimationFrame(frame) on cleanup.\n// For intervals: clearInterval(timer).\n// For canvas/WebGL: also remove listeners and dispose resources.'
            }
          />
          <ul className="list-disc space-y-2 pl-5 text-xs leading-6 text-muted-foreground">
            <li>
              Verify both opening and closing, rapid reversals, navigation
              during a transition, and keyboard focus.
            </li>
            <li>
              Test the shared Reduce motion switch and the operating system
              preference. Essential content must remain visible in the none
              tier.
            </li>
            <li>
              Use static fallbacks before hydration. Stop hidden or inactive
              rendering; avoid permanent will-change on large surfaces.
            </li>
          </ul>
          <p className="text-xs leading-6 text-muted-foreground">
            Upstream references:{" "}
            <a
              href="https://motion.dev/docs/react-animation"
              className="text-primary hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Motion animation
            </a>
            ,{" "}
            <a
              href="https://motion.dev/docs/react-animate-presence"
              className="text-primary hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              AnimatePresence
            </a>
            , and{" "}
            <a
              href="https://motion.dev/docs/react-accessibility"
              className="text-primary hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              accessibility
            </a>
            .
          </p>
        </DocSection>

        <DocSection
          id="inventory"
          title="Animation inventory"
          description="The current animation families and their owning files. Timing and controls remain local where the effect is specific to a component."
        >
          <div className="space-y-4">
            {motionCatalog.map((entry) => (
              <div
                key={entry.name}
                className="min-w-0 space-y-4 rounded-xl border border-border p-5"
              >
                <div>
                  <p className="mb-2 text-[10px] text-muted-foreground">
                    {entry.engine}
                  </p>
                  <h3 className="text-sm font-semibold">{entry.name}</h3>
                  <p className="mt-2 text-xs leading-6 text-muted-foreground">
                    {entry.description}
                  </p>
                </div>
                <dl className="space-y-3 text-xs leading-6">
                  <div>
                    <dt className="font-medium">Controls</dt>
                    <dd className="text-muted-foreground">{entry.controls}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Motion adaptation</dt>
                    <dd className="text-muted-foreground">
                      {entry.adaptation}
                    </dd>
                  </div>
                </dl>
                <details className="rounded-lg border border-border px-3 py-2">
                  <summary className="cursor-pointer text-[11px] font-medium">
                    Source files · {entry.sources.length}
                  </summary>
                  <ul className="mt-3 space-y-2">
                    {entry.sources.map((source) => (
                      <li
                        key={source}
                        className="flex min-w-0 items-start justify-between gap-2"
                      >
                        <code className="text-[10px] leading-5 break-all text-muted-foreground">
                          {source}
                        </code>
                        <CopyButton
                          value={source}
                          label={`Copy ${source} path`}
                        />
                      </li>
                    ))}
                  </ul>
                </details>
                {entry.component && (
                  <Link
                    to="/design-system/components/$slug"
                    params={{ slug: entry.component.slug }}
                    className="inline-block text-[11px] font-medium text-primary hover:underline"
                  >
                    {entry.component.title} documentation →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </DocSection>
      </article>
    </DocPage>
  )
}
