"use client"

import { useEffect, useState } from "react"
import { ArrowUpRight, Quote } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

import { M3ShapeImage } from "@/components/m3-shapes"
import { MonogramPattern } from "@/components/brand/monogram-patterns"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { profile } from "@/lib/profile"
import {
  testimonials,
  type Testimonial,
  type TestimonialQuotePart,
} from "@/lib/testimonials"
import { cn } from "@/lib/utils"

function TestimonialQuote({ quote }: { quote: TestimonialQuotePart[] }) {
  return (
    <blockquote className="text-sm leading-[1.65] text-muted-foreground">
      {quote.map((part, index) =>
        part.bold ? (
          <strong
            key={index}
            className="font-semibold text-foreground"
          >
            {part.text}
          </strong>
        ) : (
          part.text
        ),
      )}
    </blockquote>
  )
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border/70 bg-muted/25">
      <div className="flex flex-col gap-5 p-5 sm:grid sm:grid-cols-[11rem_minmax(0,1fr)] sm:items-start sm:gap-0 sm:p-6">
        <header className="flex flex-col items-start gap-4 sm:pe-6">
          <M3ShapeImage
            shape="arch"
            src={testimonial.avatarSrc}
            alt={testimonial.name}
            className="size-[4.75rem] shrink-0 sm:size-24"
          />
          <div className="min-w-0 space-y-1.5">
            <a
              href={testimonial.linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-base font-semibold leading-tight tracking-tight text-foreground transition-colors hover:text-primary"
            >
              {testimonial.name}
            </a>
            <p className="text-sm leading-snug text-muted-foreground">
              {testimonial.headline}
            </p>
            <p className="text-xs leading-snug text-muted-foreground/70">
              {testimonial.relationship}
            </p>
            <p className="text-xs tabular-nums text-muted-foreground/55">
              {testimonial.date}
            </p>
          </div>
        </header>

        <figure className="min-w-0 space-y-2.5 border-t border-border/60 pt-5 sm:border-t-0 sm:border-s sm:ps-6 sm:pt-0">
          <Quote className="size-3.5 text-primary/40" aria-hidden />
          <TestimonialQuote quote={testimonial.quote} />
        </figure>
      </div>
    </article>
  )
}

export function TestimonialsSection() {
  const shouldReduceMotion = useReducedMotion()
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (!api) return

    const onSelect = () => setCurrent(api.selectedScrollSnap())

    onSelect()
    api.on("select", onSelect)
    api.on("reInit", onSelect)

    return () => {
      api.off("select", onSelect)
      api.off("reInit", onSelect)
    }
  }, [api])

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden border-t border-border py-24"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <MonogramPattern
        variant="grid"
        tone="muted"
        isParentHovered={isHovered}
        className="absolute inset-0 -z-10 pointer-events-none opacity-40 dark:opacity-35 [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]"
      />
      <motion.div
        className="mx-auto max-w-6xl px-4 sm:px-6"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Recommendations
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              What managers and collaborators have said on LinkedIn.
            </p>
          </div>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            View on LinkedIn
            <ArrowUpRight className="size-4" aria-hidden />
          </a>
        </div>

        <div className="mx-auto max-w-3xl">
          <Carousel setApi={setApi} opts={{ align: "start", loop: true }}>
            <CarouselContent className="-ms-0">
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="ps-0">
                  <TestimonialCard testimonial={testimonial} />
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="mt-6 flex items-center justify-center gap-4">
              <CarouselPrevious className="static shrink-0 translate-y-0 border-border bg-background shadow-sm" />
              <div
                className="flex items-center gap-2"
                role="tablist"
                aria-label="Recommendation slides"
              >
                {testimonials.map((testimonial, index) => (
                  <button
                    key={testimonial.id}
                    type="button"
                    role="tab"
                    aria-selected={index === current}
                    aria-label={`Show recommendation from ${testimonial.name}`}
                    onClick={() => api?.scrollTo(index)}
                    className={cn(
                      "size-2 rounded-full transition-colors",
                      index === current
                        ? "bg-foreground"
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50",
                    )}
                  />
                ))}
              </div>
              <CarouselNext className="static shrink-0 translate-y-0 border-border bg-background shadow-sm" />
            </div>
          </Carousel>
        </div>
      </motion.div>
    </section>
  )
}
