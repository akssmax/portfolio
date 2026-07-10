"use client"

import { ErrorBoundary } from "@/components/error-boundary"
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

  if (isMobile) {
    return (
      <Drawer
        open={open}
        onOpenChange={onOpenChange}
        direction="bottom"
        repositionInputs={false}
      >
        <DrawerContent className="flex h-[92dvh] max-h-[92dvh] flex-col gap-0 overflow-hidden p-0 data-[vaul-drawer-direction=bottom]:mt-0 data-[vaul-drawer-direction=bottom]:max-h-[92dvh]">
          <ErrorBoundary
            title="Chat failed to load"
            showHeader={false}
            variant="panel"
            className="flex min-h-0 flex-1 flex-col"
          >
            <PortfolioChatPanel
              open={open}
              initialMessage={initialMessage}
              layout="mobile"
            />
          </ErrorBoundary>
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
        <ErrorBoundary
          title="Chat failed to load"
          showHeader={false}
          variant="panel"
          className="flex min-h-0 flex-1 flex-col"
        >
          <PortfolioChatPanel
            open={open}
            initialMessage={initialMessage}
            layout="desktop"
          />
        </ErrorBoundary>
      </SheetContent>
    </Sheet>
  )
}
