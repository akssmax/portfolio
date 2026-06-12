import { Outlet, createFileRoute } from "@tanstack/react-router"

import { DesignSystemLayout } from "@/components/design-system/design-system-layout"
import { RouteError } from "@/components/route-error"

export const Route = createFileRoute("/design-system")({
  errorComponent: RouteError,
  component: DesignSystemLayoutRoute,
})

function DesignSystemLayoutRoute() {
  return (
    <DesignSystemLayout>
      <Outlet />
    </DesignSystemLayout>
  )
}
