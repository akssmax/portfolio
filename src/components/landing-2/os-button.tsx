import * as React from "react"

import { cn } from "@/lib/utils"

type OsButtonProps = {
  children: React.ReactNode
  className?: string
  href?: string
  inverted?: boolean
  type?: "button" | "submit"
  onClick?: () => void
}

export function OsButton({
  children,
  className,
  href,
  inverted = false,
  type = "button",
  onClick,
}: OsButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center border-2 border-foreground px-3 py-1 text-xs tracking-wide",
    "transition-transform duration-150 motion-reduce:transition-none",
    "hover:-translate-x-px hover:-translate-y-px active:translate-x-px active:translate-y-px",
    inverted
      ? "bg-foreground text-background"
      : "bg-background text-foreground",
    className,
  )

  if (href) {
    const isInternal = href.startsWith("/") || href.startsWith("#") || href.startsWith("mailto:")
    return (
      <a
        href={href}
        className={classes}
        onClick={onClick}
        {...(isInternal ? {} : { target: "_blank", rel: "noreferrer" })}
      >
        {children}
      </a>
    )
  }

  return (
    <button type={type} className={classes} onClick={onClick}>
      {children}
    </button>
  )
}
