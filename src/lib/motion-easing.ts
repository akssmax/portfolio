/** Shared easing curves for homepage and marketing surfaces. */

export const EASE_OUT_SMOOTH = [0.22, 1, 0.36, 1] as const
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const
export const EASE_IN_OUT_SOFT = [0.45, 0.05, 0.25, 1] as const

/** Tailwind arbitrary easing — smooth deceleration for hovers */
export const easeSmooth = "ease-[cubic-bezier(0.22,1,0.36,1)]"

/** Tailwind arbitrary easing — slower settle for background layers */
export const easeExpo = "ease-[cubic-bezier(0.16,1,0.3,1)]"

export const cardHoverTransition =
  "transition-[transform,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:hover:transform-none"

export const cardTitleTransition =
  "transition-colors duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"

export const cardActionTransition =
  "transition-[transform,opacity,border-color,background-color,color,box-shadow] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"

export const cardVisualFastTransition =
  "transition-transform duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:group-hover/visual:transform-none"

export const cardVisualSlowTransition =
  "transition-transform duration-[680ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:group-hover/visual:transform-none"

export const chipHoverTransition =
  "transition-[transform,border-color,background-color,color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:hover:transform-none"

/** Framer layout tween for chat prompt resize — ease-out, no spring bounce. */
export const PROMPT_LAYOUT_TRANSITION = {
  layout: { duration: 0.25, ease: EASE_OUT_SMOOTH },
} as const

export const promptHeightTransition =
  "transition-[height] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"

export const surfaceHoverTransition =
  "transition-[border-color,box-shadow,transform] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
