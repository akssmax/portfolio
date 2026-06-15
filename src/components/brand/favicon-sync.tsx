"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"

import { syncFavicon } from "@/lib/brand/monogram-mark"

export function FaviconSync() {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    syncFavicon(resolvedTheme === "dark")
  }, [resolvedTheme])

  return null
}
