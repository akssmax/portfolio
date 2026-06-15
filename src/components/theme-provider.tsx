"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"

import { AppearanceProvider } from "@/components/appearance-provider"
import { FaviconSync } from "@/components/brand/favicon-sync"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <FaviconSync />
      <AppearanceProvider>{children}</AppearanceProvider>
    </NextThemesProvider>
  )
}
