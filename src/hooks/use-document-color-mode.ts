"use client"

import { useEffect, useState } from "react"

export type DocumentColorMode = "light" | "dark"

function readDocumentColorMode(): DocumentColorMode {
  if (typeof window === "undefined") return "light"

  const root = document.documentElement
  if (root.classList.contains("dark")) return "dark"
  if (root.classList.contains("light")) return "light"

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

/**
 * Resolves the class already applied to the document and tracks later mode changes.
 * This prevents GPU surfaces from initializing with the server's fallback palette.
 */
export function useDocumentColorMode(): DocumentColorMode | null {
  const [mode, setMode] = useState<DocumentColorMode | null>(null)

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const sync = () => setMode(readDocumentColorMode())
    const observer = new MutationObserver(sync)

    sync()
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    media.addEventListener("change", sync)

    return () => {
      observer.disconnect()
      media.removeEventListener("change", sync)
    }
  }, [])

  return mode
}
