"use client"

import * as React from "react"
import { motion } from "motion/react"
import { ExternalLink } from "lucide-react"

import { SectionIntro } from "@/components/marketing/section-intro"
import { CompanyLogo } from "@/components/shared/company-logo"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAnimationProfile } from "@/hooks/use-can-animate"
import { EASE_OUT_SMOOTH } from "@/lib/motion-easing"
import type { DeckData, DeckExperienceItem } from "@/lib/intro/types"
import { cn } from "@/lib/utils"

type ExperienceSlideProps = {
  data: DeckData["experience"]
}

type TimelineNodeProps = {
  item: DeckExperienceItem
  index: number
  isFirst: boolean
  isLast: boolean
  selected: boolean
  active: boolean
  onSelect: () => void
  fullMotion: boolean
  nodeRef: (node: HTMLLIElement | null) => void
}

function TimelineNode({
  item,
  index,
  isFirst,
  isLast,
  selected,
  active,
  onSelect,
  fullMotion,
  nodeRef,
}: TimelineNodeProps) {
  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      event.stopPropagation()
      onSelect()
    }
  }

  return (
    <motion.li
      ref={nodeRef}
      data-index={index}
      initial={fullMotion ? { opacity: 0, x: -12 } : false}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.4,
        ease: EASE_OUT_SMOOTH,
        delay: 0.06 + index * 0.05,
      }}
      className="relative grid grid-cols-[3.5rem_1fr] items-start gap-x-3 sm:grid-cols-[4.5rem_1fr] sm:gap-x-4"
      onPointerDown={(event) => event.stopPropagation()}
      onPointerUp={(event) => event.stopPropagation()}
    >
      <div className="relative flex w-full flex-col items-center self-stretch pt-5 sm:pt-[1.125rem]">
        <span
          className={cn(
            "pointer-events-none absolute left-1/2 w-px -translate-x-1/2 bg-border/80",
            isFirst
              ? "top-[calc(1.25rem+0.375rem)] sm:top-[calc(1.125rem+0.375rem)]"
              : "top-0",
            isLast
              ? "bottom-[calc(100%-1.25rem-0.375rem)] sm:bottom-[calc(100%-1.125rem-0.375rem)]"
              : "bottom-0",
          )}
          aria-hidden
        />

        <span
          className={cn(
            "relative z-10 flex size-3 shrink-0 items-center justify-center rounded-full border-2 bg-background",
            item.isCurrent
              ? "border-primary shadow-[0_0_0_4px] shadow-primary/20"
              : isFirst
                ? "border-violet-500/70"
                : "border-border",
          )}
        >
          {item.isCurrent ? (
            <span className="size-1.5 rounded-full bg-primary" aria-hidden />
          ) : null}
        </span>

        <span className="relative z-10 mt-2 font-mono text-[11px] text-muted-foreground">
          {item.startYear}
        </span>
      </div>

      <button
        type="button"
        aria-haspopup="dialog"
        onClick={onSelect}
        onKeyDown={handleKeyDown}
        className={cn(
          "mb-3 flex w-full gap-3 rounded-xl border p-3 text-left transition-all duration-200 sm:p-4",
          selected
            ? "border-primary/50 bg-primary/5 shadow-md shadow-primary/10"
            : active
              ? "border-primary/30 bg-primary/[0.03]"
              : "border-border/70 bg-muted/15 hover:border-border hover:bg-muted/25",
        )}
      >
        <CompanyLogo src={item.logoSrc} name={item.company} className="size-10 p-1.5" />

        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-foreground">{item.company}</p>
              <p className="text-sm font-medium text-primary">{item.role}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-muted-foreground">{item.period}</p>
              {item.duration ? (
                <p className="text-[10px] text-muted-foreground/80">{item.duration}</p>
              ) : null}
            </div>
          </div>

          <p className="text-xs text-muted-foreground">{item.location}</p>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {item.description}
          </p>

          {isFirst ? (
            <p className="text-[10px] font-medium tracking-wide text-violet-500 uppercase">
              First role · {item.startYear}
            </p>
          ) : item.isCurrent ? (
            <p className="text-[10px] font-medium tracking-wide text-primary uppercase">
              Current role
            </p>
          ) : item.highlights.length > 0 ? (
            <p className="text-xs text-muted-foreground/80">
              {item.highlights.length} highlights · click to expand
            </p>
          ) : null}
        </div>
      </button>
    </motion.li>
  )
}

type JourneyStepperProps = {
  items: DeckExperienceItem[]
  journeyStart: string
  progress: number
  activeIndex: number
  onStepClick: (index: number) => void
}

function JourneyStepper({
  items,
  journeyStart,
  progress,
  activeIndex,
  onStepClick,
}: JourneyStepperProps) {
  const activeItem = items[activeIndex]

  return (
    <div className="space-y-3 rounded-2xl border border-border/60 bg-muted/20 px-4 py-4 sm:px-5">
      <div className="relative mb-6 px-1">
        <div className="relative flex justify-between gap-1">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-2.5" aria-hidden>
            <div className="absolute inset-x-3 top-1/2 h-0.5 -translate-y-1/2 bg-border/80" />
            <div
              className="absolute left-3 top-1/2 h-0.5 -translate-y-1/2 origin-left bg-gradient-to-r from-violet-500 via-primary to-fuchsia-500 transition-[width] duration-150 ease-out motion-reduce:transition-none"
              style={{ width: `calc((100% - 1.5rem) * ${progress})` }}
            />
          </div>

          {items.map((item, index) => {
            const reached = index <= activeIndex

            return (
              <button
                key={`${item.company}-${item.period}`}
                type="button"
                aria-label={`Go to ${item.company}`}
                aria-current={index === activeIndex ? "step" : undefined}
                onClick={() => onStepClick(index)}
                className="group flex min-w-0 flex-1 flex-col items-center"
              >
                <span className="flex h-2.5 w-full items-center justify-center">
                  <span
                    className={cn(
                      "relative z-10 size-2.5 shrink-0 rounded-full border-2 transition-all duration-300 motion-reduce:transition-none",
                      reached
                        ? "scale-110 border-primary bg-primary shadow-[0_0_0_3px] shadow-primary/15"
                        : "border-border/80 bg-background group-hover:border-primary/40",
                    )}
                  />
                </span>
                <span
                  className={cn(
                    "mt-2 hidden font-mono text-[9px] transition-colors sm:block",
                    index === activeIndex
                      ? "text-primary"
                      : reached
                        ? "text-muted-foreground"
                        : "text-muted-foreground/50",
                  )}
                >
                  {item.startYear}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="shrink-0 font-mono text-primary">{journeyStart}</span>
        <div className="min-w-0 text-center">
          <p className="truncate text-sm font-medium text-foreground">
            {activeItem?.company}
          </p>
          <p className="truncate text-[11px] text-muted-foreground">
            {activeItem?.role}
          </p>
        </div>
        <span className="shrink-0 font-mono text-primary">Now</span>
      </div>
    </div>
  )
}

function useTimelineScrollState(itemCount: number) {
  const listRef = React.useRef<HTMLOListElement>(null)
  const itemRefs = React.useRef<(HTMLLIElement | null)[]>([])
  const [scrollProgress, setScrollProgress] = React.useState(0)
  const [activeIndex, setActiveIndex] = React.useState(0)

  const setItemRef = React.useCallback((index: number, node: HTMLLIElement | null) => {
    itemRefs.current[index] = node
  }, [])

  React.useEffect(() => {
    const root = listRef.current
    if (!root || itemCount === 0) return

    const updateScrollProgress = () => {
      const maxScroll = root.scrollHeight - root.clientHeight
      const progress = maxScroll <= 0 ? 1 : root.scrollTop / maxScroll
      const clamped = Math.min(1, Math.max(0, progress))

      setScrollProgress(clamped)
      setActiveIndex(Math.round(clamped * Math.max(itemCount - 1, 0)))
    }

    root.addEventListener("scroll", updateScrollProgress, { passive: true })
    updateScrollProgress()

    return () => root.removeEventListener("scroll", updateScrollProgress)
  }, [itemCount])

  const scrollToIndex = React.useCallback((index: number) => {
    const node = itemRefs.current[index]
    if (!node) return
    node.scrollIntoView({ behavior: "smooth", block: "center" })
  }, [])

  return {
    listRef,
    setItemRef,
    scrollProgress,
    activeIndex,
    scrollToIndex,
  }
}

function ExperienceDetailDialog({
  item,
  open,
  onOpenChange,
}: {
  item: DeckExperienceItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!item) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[min(85dvh,720px)] overflow-y-auto border-border/80 bg-background/95 p-0 sm:max-w-xl"
        onPointerDown={(event) => event.stopPropagation()}
        onPointerUp={(event) => event.stopPropagation()}
      >
        <div className="border-b border-border/60 bg-gradient-to-br from-violet-500/10 via-primary/5 to-fuchsia-500/10 p-6 pb-5">
          <DialogHeader className="gap-4 text-left">
            <div className="flex items-start gap-4">
              <CompanyLogo src={item.logoSrc} name={item.company} className="size-12 p-2" />

              <div className="min-w-0 space-y-1">
                <DialogTitle className="text-xl font-semibold sm:text-2xl">
                  {item.company}
                </DialogTitle>
                <p className="text-sm font-medium text-primary">{item.role}</p>
                <p className="text-xs text-muted-foreground">
                  {item.period}
                  {item.duration ? ` · ${item.duration}` : ""} · {item.location}
                </p>
              </div>
            </div>

            <DialogDescription className="text-sm leading-relaxed">
              {item.description}
            </DialogDescription>

            {item.websiteUrl ? (
              <a
                href={item.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center gap-1.5 text-sm text-primary hover:underline"
              >
                Visit website
                <ExternalLink className="size-3.5" aria-hidden />
              </a>
            ) : null}
          </DialogHeader>
        </div>

        {item.highlights.length > 0 ? (
          <div className="space-y-3 p-6 pt-5">
            <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
              Highlights
            </p>
            <ul className="space-y-3">
              {item.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-3 text-sm leading-relaxed text-foreground/90">
                  <span
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                    aria-hidden
                  />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

export function ExperienceSlide({ data }: ExperienceSlideProps) {
  const { fullMotion } = useAnimationProfile()
  const [selectedCompany, setSelectedCompany] = React.useState<string | null>(null)
  const { listRef, setItemRef, scrollProgress, activeIndex, scrollToIndex } =
    useTimelineScrollState(data.items.length)

  const selectedItem =
    data.items.find((item) => item.company === selectedCompany) ?? null

  return (
    <div className="space-y-6">
      <div
        className={cn(
          "space-y-6 transition-all duration-300 motion-reduce:transition-none",
          selectedItem && "pointer-events-none scale-[0.985] blur-[6px] opacity-45",
        )}
      >
        <SectionIntro
          eyebrow="Design journey"
          heading={data.heading}
          description={data.subtitle}
        />

        <JourneyStepper
          items={data.items}
          journeyStart={data.journeyStart}
          progress={scrollProgress}
          activeIndex={activeIndex}
          onStepClick={scrollToIndex}
        />

        <ol
          ref={listRef}
          className="relative max-h-[min(48dvh,480px)] overflow-y-auto pe-1 scroll-smooth"
        >
          {data.items.map((item, index) => (
            <TimelineNode
              key={`${item.company}-${item.period}`}
              item={item}
              index={index}
              isFirst={index === 0}
              isLast={index === data.items.length - 1}
              selected={selectedCompany === item.company}
              active={activeIndex === index}
              onSelect={() => setSelectedCompany(item.company)}
              fullMotion={fullMotion}
              nodeRef={(node) => setItemRef(index, node)}
            />
          ))}
        </ol>
      </div>

      <ExperienceDetailDialog
        item={selectedItem}
        open={selectedItem !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedCompany(null)
        }}
      />
    </div>
  )
}
