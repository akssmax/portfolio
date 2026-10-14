import {
  EASE_OUT_SMOOTH,
  EASE_OUT_EXPO,
  EASE_IN_OUT_SOFT,
  cardHoverTransition,
  cardTitleTransition,
  cardActionTransition,
  cardVisualFastTransition,
  cardVisualSlowTransition,
  chipHoverTransition,
  promptHeightTransition,
  surfaceHoverTransition,
} from "@/lib/motion-easing"

export const motionCurves = [
  {
    name: "EASE_OUT_SMOOTH",
    value: EASE_OUT_SMOOTH,
    use: "UI movement, hover feedback, and prompt resizing.",
  },
  {
    name: "EASE_OUT_EXPO",
    value: EASE_OUT_EXPO,
    use: "Background layers and a longer, softer settle.",
  },
  {
    name: "EASE_IN_OUT_SOFT",
    value: EASE_IN_OUT_SOFT,
    use: "Balanced movement with a gentle start and finish.",
  },
] as const

export const motionClassRecipes = [
  {
    name: "cardHoverTransition",
    value: cardHoverTransition,
    use: "Card movement, border, and shadow.",
  },
  {
    name: "cardTitleTransition",
    value: cardTitleTransition,
    use: "Card title color.",
  },
  {
    name: "cardActionTransition",
    value: cardActionTransition,
    use: "Action reveal and hover feedback.",
  },
  {
    name: "cardVisualFastTransition",
    value: cardVisualFastTransition,
    use: "Foreground image movement.",
  },
  {
    name: "cardVisualSlowTransition",
    value: cardVisualSlowTransition,
    use: "Background image movement.",
  },
  {
    name: "chipHoverTransition",
    value: chipHoverTransition,
    use: "Chip and compact control feedback.",
  },
  {
    name: "promptHeightTransition",
    value: promptHeightTransition,
    use: "Prompt height changes.",
  },
  {
    name: "surfaceHoverTransition",
    value: surfaceHoverTransition,
    use: "Surface border, shadow, and movement.",
  },
] as const

export type MotionCatalogEntry = {
  name: string
  engine: string
  description: string
  controls: string
  adaptation: string
  sources: string[]
  component?: { slug: string; title: string }
}

// This is an inventory of existing implementations, not a claim that every
// animation already uses the same duration or has the same runtime controls.
export const motionCatalog: MotionCatalogEntry[] = [
  {
    name: "Navigation and overlays",
    engine: "Motion + Radix / CSS",
    description:
      "The docs sidebar resizes and fades over 240ms. Mobile navigation uses the existing 200ms Sheet entrance and exit; its overlay fades over 100ms.",
    controls:
      "Sidebar open state; Sheet side, open, and onOpenChange. The desktop header stays fixed while the content area resizes.",
    adaptation:
      "Sidebar uses a zero-duration transition when canAnimate is false. The shared CSS reduced-motion rule stops Sheet movement. Closed desktop navigation is inert and hidden from assistive technology.",
    sources: [
      "src/components/design-system/design-system-layout.tsx",
      "src/components/ui/sheet.tsx",
    ],
    component: { slug: "sheet", title: "Sheet" },
  },
  {
    name: "Section entrances and stagger",
    engine: "Motion",
    description:
      "Headings and content reveal with opacity and short translations. Hero entrances use 450–500ms tweens with small staggered delays; section reveals commonly use 500ms.",
    controls:
      "initial, animate, whileInView, viewport.once, transition.duration, and delay. Use viewport animation only on nonessential presentation.",
    adaptation:
      "Render content in its final position when motion is off. Do not leave initial opacity at zero without an entrance that will run.",
    sources: [
      "src/components/landing/hero-variations.tsx",
      "src/components/landing/work-section.tsx",
      "src/components/about/about-hero.tsx",
    ],
    component: { slug: "hero-section", title: "Hero Section" },
  },
  {
    name: "Rotating copy and presence",
    engine: "Motion / AnimatePresence",
    description:
      "The landing copy uses keyed presence transitions. Full motion adds perspective and blur; light motion uses smaller translations. A separate headline implementation uses springs for incoming text.",
    controls:
      "slides, intervalMs, keyed children, variants, and AnimatePresence mode. Keep the text container height stable during replacement.",
    adaptation:
      "LandingHeroRotatingCopy stops its interval when canAnimate is false. Full and light variants are selected by useAnimationProfile.",
    sources: [
      "src/components/landing/landing-hero-rotating-copy.tsx",
      "src/components/landing/hero-rotating-headline.tsx",
    ],
    component: { slug: "hero-section", title: "Hero Section" },
  },
  {
    name: "Prompt layout and shared elements",
    engine: "Motion layout",
    description:
      "The chat prompt uses a 250ms smooth layout tween. Each prompt scopes shared element transitions with LayoutGroup so separate instances do not share a layoutId accidentally.",
    controls:
      "layout, layoutId, LayoutGroup, sharedLayout, PROMPT_LAYOUT_TRANSITION, and promptHeightTransition. Use a tween for text containers to avoid spring overshoot.",
    adaptation:
      "Gate shared layout and expensive effects with fullMotion. MotionPreferences disables Motion transform/layout animation when animation is unavailable.",
    sources: [
      "src/components/ui/chat-prompt-input.tsx",
      "src/lib/motion-easing.ts",
    ],
    component: { slug: "chat-prompt-input", title: "Chat Prompt Input" },
  },
  {
    name: "Card feedback and springs",
    engine: "Motion + CSS",
    description:
      "FeatureCard uses a 340 stiffness / 22 damping spring for a small icon lift. Shared CSS helpers cover 250–680ms card, chip, image, and surface transitions. Brand logo presets use their own spring values.",
    controls:
      "whileHover, whileFocus, whileTap, stiffness, damping, scale, y, and the exported transition class helpers.",
    adaptation:
      "Keep hover feedback available on keyboard focus. Use canAnimate for small feedback and fullMotion for expensive shared effects; remove movement when motion is off.",
    sources: [
      "src/components/marketing/feature-card.tsx",
      "src/components/brand/logo.tsx",
      "src/lib/motion-easing.ts",
    ],
    component: { slug: "feature-card", title: "Feature Card" },
  },
  {
    name: "Monogram drawing and pattern motion",
    engine: "Motion SVG + CSS",
    description:
      "FooterMonogram draws, traces, glows, pulses, shifts, reveals, or loops. MonogramPattern adds hover-driven springs, waves, or orbiting marks.",
    controls:
      "animation, trigger, strokeWidth, interactive, isParentHovered, variant, and tone. Loop and orbit timings remain local to each preset.",
    adaptation:
      'Use animation="none" and interactive={false} for a static composition. Repeated marks remain decorative, with meaning supplied by nearby text.',
    sources: [
      "src/components/brand/footer-monogram.tsx",
      "src/components/brand/monogram-patterns.tsx",
    ],
    component: { slug: "monogram-patterns", title: "Monogram Patterns" },
  },
  {
    name: "M3 shape morphs",
    engine: "Motion animate() + Flubber",
    description:
      "Flubber interpolates SVG paths with maxSegmentLength 8. M3FeatureImage morphs over 750ms and crossfades the image over 450ms; the animating avatar uses a 1.2s morph.",
    controls:
      "createShapeMorphInterpolator(from, to), numeric progress, animate(), active, items, onMorphStart, and onMorphEnd.",
    adaptation:
      "M3FeatureImage swaps directly when morphing is unavailable and exposes active to pause. New imperative morphs must check the local profile and stop their playback controls on cleanup.",
    sources: [
      "src/lib/m3-shape-morph.ts",
      "src/components/m3-shapes/m3-feature-image.tsx",
      "src/components/m3-shapes/m3-animating-avatar.tsx",
    ],
    component: { slug: "m3-shapes", title: "M3 Shapes" },
  },
  {
    name: "Gradient reveal",
    engine: "CSS transforms + requestAnimationFrame",
    description:
      "Footer gradients reveal from their bottom edge. The mount reveal uses a 1.1s expo tween; the scroll variant derives scale from window scroll position.",
    controls:
      "reveal, riseMs, replayKey, activeVariant, bars, blur, peak, valley, foldAngle, and depth.",
    adaptation:
      'Use reveal="none" for a static gradient. Window-scroll behavior needs an adapter if used inside a nested scrolling surface such as these docs.',
    sources: ["src/components/landing/footer-gradients.tsx"],
    component: { slug: "footer-gradients", title: "Footer Gradients" },
  },
  {
    name: "Border beam and text shimmer",
    engine: "Motion values + CSS masking",
    description:
      "BorderBeam drives a masked conic-gradient angle with a looping linear tween (6s by default), using useMotionValue and useMotionTemplate. Shimmer sweeps a text background over 2s.",
    controls:
      "Beam duration, phase delay, reverse, arc size in degrees, initialOffset, and colors; shimmer duration and spread. Stop the effect when the associated state ends.",
    adaptation:
      "BorderBeam checks canAnimate and stops its playback controls on cleanup. Shimmer and other background-position loops still need explicit gating in the consuming wrapper; retain static status text when motion is off.",
    sources: [
      "src/components/ui/border-beam.tsx",
      "src/components/ai-elements/shimmer.tsx",
    ],
    component: { slug: "chat-prompt-input", title: "Chat Prompt Input" },
  },
  {
    name: "Wavefields and pointer inertia",
    engine: "WebGPU / vgpu + Canvas / GSAP",
    description:
      "ShapeWaves renders brand wavefields with vgpu and WebGPU. ContactDotGridBackground lazy-loads a canvas DotGrid, whose pointer impulse and return use GSAP and InertiaPlugin.",
    controls:
      "Wave speed, scale, formation, active, and interaction; dot proximity, shockRadius, shockStrength, resistance, and returnDuration.",
    adaptation:
      "Use the existing wrappers: the contact grid mounts only for fullMotion and in-view content. Wave wrappers gate mounting and supply static backgrounds.",
    sources: [
      "src/components/marketing/ShapeWaves.jsx",
      "src/components/marketing/project-card-wave-background.tsx",
      "src/components/landing/hero-shape-waves-background.tsx",
      "src/components/landing/contact-dot-grid-background.tsx",
      "src/components/DotGrid.tsx",
    ],
    component: { slug: "feature-card", title: "Feature Card" },
  },
  {
    name: "Shader and dither backgrounds",
    engine: "OGL / WebGL + Canvas",
    description:
      "Lightfall and Strands render shader backgrounds; Dither draws an animated canvas treatment. InteractiveStrandsBackground smooths hover and pointer inputs with Motion values and springs.",
    controls:
      "Background speed and intensity; Strands useMotionValue, useSpring, and useMotionValueEvent for hover inputs; Dither disableAnimation, enableMouseInteraction, and fullMotion.",
    adaptation:
      "Treat these as optional decoration. Gate or pause them in the consuming wrapper, clean up animation frames and graphics resources, and show a static fallback.",
    sources: [
      "src/components/Lightfall.tsx",
      "src/components/Strands.tsx",
      "src/components/projects/interactive-strands-background.tsx",
      "src/components/landing/Dither.tsx",
    ],
  },
  {
    name: "CSS status and decorative keyframes",
    engine: "Tailwind + CSS keyframes",
    description:
      "Spinner uses animate-spin, Skeleton uses animate-pulse, the pride flag billows with a 500ms oscillation, and interests include a custom wave keyframe.",
    controls:
      "Utility classes, animation duration and iteration, and the flag's static class. Keep status text independent of the animation.",
    adaptation:
      "The shared data-site-reduced-motion CSS rule shortens transitions/keyframes and limits iterations. Keep motion-reduce variants in reusable class recipes too.",
    sources: [
      "src/components/ui/spinner.tsx",
      "src/components/ui/skeleton.tsx",
      "src/components/landing/pride-flag.module.css",
      "src/components/about/interests-section.tsx",
      "src/styles.css",
    ],
    component: { slug: "spinner", title: "Spinner" },
  },
  {
    name: "Journey, deck, and runner motion",
    engine: "Motion + CSS + custom timing",
    description:
      "Journey scrolling uses smooth or instant scroll based on canAnimate. Deck slides have a 320ms CSS entrance. Runner anticipation and landing recovery use custom 52ms / 100ms timings.",
    controls:
      "scrollToStop, scroll behavior, deck slide presence, and the runner's motion state helpers. These timings belong to their specific experiences.",
    adaptation:
      "Preserve direct navigation when smooth motion is disabled. Keep game timing separate from interface transition presets.",
    sources: [
      "src/hooks/use-journey-scroll.ts",
      "src/components/intro/deck-slide.tsx",
      "src/styles/journey-deck.css",
      "src/lib/brand/runner-player-motion.ts",
    ],
  },
]
