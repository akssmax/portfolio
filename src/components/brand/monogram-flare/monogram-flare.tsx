"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

import { cn } from "@/lib/utils"

type MonogramFlareProps = {
  className?: string
  fallback?: ReactNode
}

export function MonogramFlare({ className, fallback }: MonogramFlareProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    if (typeof navigator === "undefined" || !navigator.gpu) {
      setFailed(true)
      return
    }

    let disposed = false
    let disposeRenderer: (() => void) | undefined

    void import("./renderer")
      .then(({ createRenderer }) => {
        if (disposed) return
        const renderer = createRenderer({ canvas })
        disposeRenderer = renderer.dispose
        return renderer.ready
      })
      .catch((error: unknown) => {
        console.error("Monogram flare failed to start", error)
        if (!disposed) setFailed(true)
      })

    return () => {
      disposed = true
      disposeRenderer?.()
    }
  }, [])

  if (failed) {
    return fallback ?? null
  }

  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-background", className)}>
      <canvas
        ref={canvasRef}
        className="block h-full w-full touch-none"
        aria-hidden
      />
    </div>
  )
}
