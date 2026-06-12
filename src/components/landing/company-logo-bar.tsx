"use client"

import { useState } from "react"
import { motion, useReducedMotion } from "motion/react"

import { HundredXLogo } from "@/components/logos/hundred-x-logo"
import { KodoLogo } from "@/components/logos/kodo-logo"
import { getEmployerLogos, type EmployerLogo } from "@/lib/profile"
import { cn } from "@/lib/utils"

type CompanyLogoBarProps = {
  className?: string
  label?: string
}

const svgLogoClassName =
  "h-7 w-auto max-w-[6.5rem] text-muted-foreground opacity-55 transition duration-200 group-hover:scale-105 group-hover:text-foreground group-hover:opacity-100 dark:opacity-60"

const imgLogoClassName =
  "h-7 w-auto max-w-[6.5rem] object-contain opacity-55 grayscale transition duration-200 group-hover:scale-105 group-hover:opacity-100 group-hover:brightness-0 dark:opacity-60 dark:group-hover:invert"

function LogoBarItem({ name, logoSrc, websiteUrl }: EmployerLogo) {
  const [failed, setFailed] = useState(false)

  const logo =
    logoSrc === "/companies/kodo.svg" ? (
      <KodoLogo title={name} className={svgLogoClassName} />
    ) : logoSrc === "/companies/100x-bot.svg" ? (
      <HundredXLogo title={name} className={svgLogoClassName} />
    ) : failed ? (
      <span className="text-sm font-medium text-muted-foreground">{name}</span>
    ) : (
      <img
        src={logoSrc}
        alt={`${name} logo`}
        title={name}
        className={imgLogoClassName}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    )

  if (!websiteUrl) return logo

  return (
    <a
      href={websiteUrl}
      target="_blank"
      rel="noopener noreferrer"
      title={`Visit ${name}`}
      className="group rounded-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {logo}
    </a>
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
          <li key={employer.name}>
            <LogoBarItem {...employer} />
          </li>
        ))}
      </ul>
    </motion.div>
  )
}
