"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"

import { AppearanceProvider } from "@/components/appearance-provider"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <AppearanceProvider>{children}</AppearanceProvider>
    </NextThemesProvider>
  )
}
