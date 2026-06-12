import type { ComponentPropsWithoutRef } from "react"

import { cn } from "@/lib/utils"

export const scrollbarClassName = "custom-scrollbar"

type CustomScrollbarProps = ComponentPropsWithoutRef<"div"> & {
  orientation?: "vertical" | "horizontal" | "both"
}

/** Scrollable region using global brand-colored scrollbar tokens. */
export function CustomScrollbar({
  className,
  children,
  orientation = "vertical",
  ...props
}: CustomScrollbarProps) {
  return (
    <div
      data-slot="custom-scrollbar"
      className={cn(
        scrollbarClassName,
        orientation === "vertical" && "overflow-y-auto overflow-x-hidden",
        orientation === "horizontal" && "overflow-x-auto overflow-y-hidden",
        orientation === "both" && "overflow-auto",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
