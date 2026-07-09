import type { ReactNode } from "react"

import {
  DEFAULT_SECTION_ICONS,
  type ResumeDisplayPreferences,
} from "../../resume-display-preferences"
import type { ResumeSectionId } from "../../types"
import { ResumeIcon } from "./resume-icon"
import { cn } from "@/lib/utils"

type HtmlResumeSectionProps = {
  sectionId?: ResumeSectionId
  title: string
  brandColor: string
  display: ResumeDisplayPreferences
  children: ReactNode
  className?: string
  titleClassName?: string
  variant?: "accent-dot" | "underline" | "plain"
}

export function HtmlResumeSection({
  sectionId,
  title,
  brandColor,
  display,
  children,
  className,
  titleClassName,
  variant = "accent-dot",
}: HtmlResumeSectionProps) {
  const iconName =
    sectionId && display.showSectionIcons
      ? DEFAULT_SECTION_ICONS[sectionId] ?? "file-text"
      : undefined

  return (
    <section className={cn("mb-3.5", className)}>
      <div
        className={cn(
          "mb-2 flex items-center gap-2",
          variant === "underline" && "border-b pb-1.5",
        )}
        style={variant === "underline" ? { borderBottomColor: brandColor } : undefined}
      >
        {variant === "accent-dot" && !iconName ? (
          <span
            className="h-[3px] w-3 shrink-0 rounded-full"
            style={{ backgroundColor: brandColor }}
          />
        ) : null}
        {iconName ? (
          <ResumeIcon name={iconName} style={{ color: brandColor }} />
        ) : null}
        <h2
          className={cn(
            "text-[10px] font-bold uppercase tracking-[0.08em] text-[#0F1923]",
            variant === "plain" && "text-[11px] tracking-wide",
            titleClassName,
          )}
          style={variant === "plain" || variant === "underline" ? { color: brandColor } : undefined}
        >
          {title}
        </h2>
      </div>
      {children}
    </section>
  )
}
