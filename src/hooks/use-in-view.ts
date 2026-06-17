import { useEffect, useState, type RefObject } from "react"

type UseInViewOptions = IntersectionObserverInit & {
  /** Assumed visible before the observer runs (helps above-the-fold content). */
  initialInView?: boolean
  /** Re-subscribe when this toggles (e.g. after a deferred mount attaches the ref). */
  enabled?: boolean
}

export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  {
    initialInView = true,
    threshold = 0,
    root = null,
    rootMargin = "0px",
    enabled = true,
  }: UseInViewOptions = {},
): boolean {
  const [inView, setInView] = useState(initialInView)

  useEffect(() => {
    if (!enabled) return

    const node = ref.current
    if (!node || typeof IntersectionObserver === "undefined") return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry?.isIntersecting ?? false)
      },
      { threshold, root, rootMargin },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [enabled, ref, root, rootMargin, threshold])

  return inView
}
