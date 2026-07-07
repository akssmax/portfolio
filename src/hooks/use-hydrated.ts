import { useEffect, useState } from "react"

/** True after the client has mounted — use to defer SSR-incompatible UI. */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  return hydrated
}
