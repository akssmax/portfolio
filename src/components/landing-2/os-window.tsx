import * as React from "react"
import { Link } from "@tanstack/react-router"

import { cn } from "@/lib/utils"

export type OsWindowTone = "pink" | "cyan" | "yellow" | "lime" | "orange" | "violet"

type OsWindowProps = {
  title: string
  children?: React.ReactNode
  className?: string
  bodyClassName?: string
  style?: React.CSSProperties
  href?: string
  to?: "/projects/$slug"
  params?: { slug: string }
  onClick?: () => void
  showClose?: boolean
  tone?: OsWindowTone
}

export function OsWindow({
  title,
  children,
  className,
  bodyClassName,
  style,
  href,
  to,
  params,
  onClick,
  showClose = true,
  tone,
}: OsWindowProps) {
  const chrome = (
    <>
      <div className="os-titlebar">
        {showClose ? <span className="os-titlebar-close" aria-hidden /> : null}
        <span className="min-w-0 flex-1 truncate">{title}</span>
      </div>
      {children ? (
        <div className={cn("os-window-body p-2 text-xs leading-relaxed", bodyClassName)}>
          {children}
        </div>
      ) : null}
    </>
  )

  const frameClass = cn(
    "os-window block overflow-hidden text-left",
    (href || to || onClick) &&
      "cursor-pointer transition-transform duration-200 motion-reduce:transition-none hover:-translate-x-px hover:-translate-y-px",
    className,
  )

  const shared = {
    className: frameClass,
    style,
    "data-tone": tone,
  } as const

  if (to && params) {
    return (
      <Link to={to} params={params} {...shared} onClick={onClick}>
        {chrome}
      </Link>
    )
  }

  if (href) {
    const isInternal = href.startsWith("/")
    return (
      <a
        href={href}
        {...shared}
        onClick={onClick}
        {...(isInternal ? {} : { target: "_blank", rel: "noreferrer" })}
      >
        {chrome}
      </a>
    )
  }

  if (onClick) {
    return (
      <button type="button" {...shared} onClick={onClick}>
        {chrome}
      </button>
    )
  }

  return <div {...shared}>{chrome}</div>
}
