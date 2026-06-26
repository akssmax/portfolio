"use client"

import { useState } from "react"
import { motion, useReducedMotion } from "motion/react"

import type {EmployerLogo} from "@/lib/profile";
import { HundredXLogo } from "@/components/logos/hundred-x-logo"
import { KodoLogo } from "@/components/logos/kodo-logo"
import { UnloggedLogo } from "@/components/logos/unlogged-logo"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { getExperienceDuration } from "@/lib/experience-duration"
import {  getEmployerLogos } from "@/lib/profile"
import { cn } from "@/lib/utils"

type CompanyLogoBarProps = {
  className?: string
  label?: string
}

const LOGO_HEIGHT_CLASS = "h-7"
const LOGO_MAX_WIDTH_CLASS = "max-w-[6.5rem]"

const logoSlotClassName = cn(
  "flex items-center",
  LOGO_HEIGHT_CLASS,
  LOGO_MAX_WIDTH_CLASS,
)

const svgLogoClassName = cn(
  "block h-full w-auto max-w-full text-muted-foreground opacity-55 transition duration-200 group-hover:scale-105 group-hover:text-foreground group-hover:opacity-100 dark:opacity-60",
)

const imgLogoClassName = cn(
  "block h-full w-auto max-w-full object-contain object-left opacity-55 grayscale transition duration-200 group-hover:scale-105 group-hover:opacity-100 group-hover:brightness-0 dark:opacity-60 dark:group-hover:invert",
)

function LogoBarItem({ name, logoSrc, websiteUrl, period, role }: EmployerLogo) {
  const [failed, setFailed] = useState(false)
  const duration = getExperienceDuration(period)

  const logo =
    logoSrc === "/companies/kodo.svg" ? (
      <KodoLogo title={name} className={svgLogoClassName} />
    ) : logoSrc === "/companies/100x-bot.svg" ? (
      <HundredXLogo title={name} className={svgLogoClassName} />
    ) : logoSrc === "/companies/unlogged.svg" ? (
      <UnloggedLogo title={name} className={svgLogoClassName} />
    ) : failed ? (
      <span className="text-sm font-medium leading-none text-muted-foreground">
        {name}
      </span>
    ) : (
      <img
        src={logoSrc}
        alt={`${name} logo`}
        className={imgLogoClassName}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    )

  const triggerClassName =
    "group inline-flex h-7 max-w-[6.5rem] items-center rounded-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

  const trigger = websiteUrl ? (
    <a
      href={websiteUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={triggerClassName}
    >
      <span className={logoSlotClassName}>{logo}</span>
    </a>
  ) : (
    <span className={triggerClassName}>
      <span className={logoSlotClassName}>{logo}</span>
    </span>
  )

  return (
    <Tooltip>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      <TooltipContent sideOffset={6}>
        <p className="font-medium">{role}</p>
        <p className="text-background/80">
          {period}
          {duration ? ` · ${duration}` : null}
        </p>
      </TooltipContent>
    </Tooltip>
  )
}

export function CompanyLogoBar({
  className,
  label = "Previously at",
}: CompanyLogoBarProps) {
  const shouldReduceMotion = useReducedMotion()
  const employers = getEmployerLogos()

  if (employers.length === 0) return null

  return (
    <motion.div
      className={cn("mt-8", className)}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <ul
        className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-4"
        aria-label="Companies worked with"
      >
        {employers.map((employer) => (
          <li key={employer.name} className="flex h-7 items-center">
            <LogoBarItem {...employer} />
          </li>
        ))}
      </ul>
    </motion.div>
  )
}
