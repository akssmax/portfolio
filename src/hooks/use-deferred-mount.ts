import { useEffect, useState } from "react"

/** Defer mounting heavy visuals until after first paint / idle time. */
export function useDeferredMount(enabled = true) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (!enabled) {
      setMounted(false)
      return
    }

    let cancelled = false

    const mount = () => {
      if (!cancelled) setMounted(true)
    }

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const id = window.requestIdleCallback(mount, { timeout: 1500 })
      return () => {
        cancelled = true
        window.cancelIdleCallback(id)
      }
    }

    const timeoutId = setTimeout(mount, 300)
    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [enabled])

  return mounted
}
