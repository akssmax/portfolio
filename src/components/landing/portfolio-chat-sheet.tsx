"use client"

import { useEffect, useState } from "react"

import { PortfolioChatPanel } from "@/components/landing/portfolio-chat-panel"
import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useIsMobile } from "@/hooks/use-mobile"

type PortfolioChatSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialMessage?: string | null
}

export function PortfolioChatSheet({
  open,
  onOpenChange,
  initialMessage,
}: PortfolioChatSheetProps) {
  const isMobile = useIsMobile()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  if (isMobile) {
    return (
      <Drawer
        open={open}
        onOpenChange={onOpenChange}
        direction="bottom"
        repositionInputs={false}
      >
        <DrawerContent className="flex h-[92dvh] max-h-[92dvh] flex-col gap-0 overflow-hidden p-0 data-[vaul-drawer-direction=bottom]:mt-0 data-[vaul-drawer-direction=bottom]:max-h-[92dvh]">
          <PortfolioChatPanel
            open={open}
            initialMessage={initialMessage}
            layout="mobile"
          />
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="flex h-full w-full max-w-md flex-col gap-0 p-0 sm:max-w-md"
      >
        <PortfolioChatPanel
          open={open}
          initialMessage={initialMessage}
          layout="desktop"
        />
      </SheetContent>
    </Sheet>
  )
}
