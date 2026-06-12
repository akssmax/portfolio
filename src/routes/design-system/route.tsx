import { Outlet, createFileRoute } from "@tanstack/react-router"

import { DesignSystemLayout } from "@/components/design-system/design-system-layout"

export const Route = createFileRoute("/design-system")({
  component: DesignSystemLayoutRoute,
})

function DesignSystemLayoutRoute() {
  return (
    <DesignSystemLayout>
      <Outlet />
    </DesignSystemLayout>
  )
}
