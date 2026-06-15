"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"

import { AppearanceProvider } from "@/components/appearance-provider"
import { PortfolioChatProvider } from "@/components/landing/portfolio-chat-provider"
import { FaviconSync } from "@/components/brand/favicon-sync"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <FaviconSync />
      <AppearanceProvider>
        <PortfolioChatProvider>{children}</PortfolioChatProvider>
      </AppearanceProvider>
    </NextThemesProvider>
  )
}
