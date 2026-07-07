import { useEffect, useState, type RefObject } from "react"

type UseInViewOptions = {
  rootMargin?: string
  threshold?: number
  once?: boolean
  initialInView?: boolean
  enabled?: boolean
}

function isRefObject(value: unknown): value is RefObject<Element | null> {
  return value !== null && typeof value === "object" && "current" in value
}

/** Lightweight intersection observer hook — ref API returns boolean, options API returns callback ref. */
export function useInView(
  elementRef: RefObject<Element | null>,
  options?: UseInViewOptions,
): boolean
export function useInView(options?: UseInViewOptions): {
  ref: (node: Element | null) => void
  inView: boolean
}
export function useInView(
  arg?: RefObject<Element | null> | UseInViewOptions,
  maybeOptions?: UseInViewOptions,
): boolean | { ref: (node: Element | null) => void; inView: boolean } {
  const isRefApi = isRefObject(arg)
  const options = (isRefApi ? maybeOptions : arg) ?? {}
  const {
    rootMargin = "0px",
    threshold = 0,
    once = false,
    initialInView = false,
    enabled = true,
  } = options

  const [callbackNode, setCallbackNode] = useState<Element | null>(null)
  const [inView, setInView] = useState(initialInView)

  useEffect(() => {
    if (!enabled) {
      setInView(initialInView)
      return
    }

    const node = isRefApi ? (arg as RefObject<Element | null>).current : callbackNode
    if (!node || typeof IntersectionObserver === "undefined") return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry?.isIntersecting ?? false
        setInView(visible)
        if (visible && once) observer.disconnect()
      },
      { rootMargin, threshold },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [
    arg,
    callbackNode,
    enabled,
    initialInView,
    isRefApi,
    once,
    rootMargin,
    threshold,
  ])

  if (isRefApi) return inView
  return { ref: setCallbackNode, inView }
}
