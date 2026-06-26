"use client"

import { useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { GraduationCap, Mail, MapPin, Phone } from "lucide-react"

import { ErrorBoundary } from "@/components/error-boundary"
import { M3FeatureImage } from "@/components/m3-shapes/m3-feature-image"
import { Tag } from "@/components/ui/tag"
import { DownloadResumeButton } from "@/features/resume/download-resume-button"
import { getExperienceTagLabel } from "@/lib/experience-duration"
import { getRandomizedHeroPortraitItems } from "@/lib/hero-portraits"
import { profile } from "@/lib/profile"

export function AboutHero() {
  const shouldReduceMotion = useReducedMotion()
  const [portraitItems] = useState(() => getRandomizedHeroPortraitItems())
  const experienceLabel = getExperienceTagLabel()

  return (
    <section className="border-b border-border py-16 sm:py-20 lg:py-24">
      <motion.div
        className="mx-auto max-w-6xl px-4 sm:px-6"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,38%)] lg:gap-12 xl:gap-16">
          <div className="flex min-w-0 flex-col gap-8 lg:pt-2">
            <div className="max-w-2xl space-y-3">
              <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                About
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                {profile.name}
              </h1>
              <p className="text-base text-muted-foreground sm:text-lg">
                Product Designer and Design Engineer based in Bangalore, India, with a computer science foundation.
              </p>
            </div>

            <motion.p
              className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
            >
              {profile.bio}
            </motion.p>

            <motion.aside
              className="relative rounded-2xl border border-border/80 bg-card/45 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-foreground/15 hover:shadow-md lg:max-w-2xl"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="relative flex size-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-semibold tracking-wide text-foreground">
                    {profile.role} @ {profile.company}
                  </span>
                </div>
                <Tag
                  variant="outline"
                  className="bg-background/80 shadow-xs border-border/80 text-foreground font-medium px-2.5 py-0.5 text-[11px] rounded-full"
                >
                  {experienceLabel}
                </Tag>
              </div>

              {/* Grid Content */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {/* Contact Section */}
                <div className="space-y-3.5">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                    Contact & Location
                  </h3>
                  <div className="space-y-2.5">
                    <div className="group/item flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground border border-border/40 shadow-2xs transition-colors group-hover/item:bg-primary/10 group-hover/item:text-primary group-hover/item:border-primary/20">
                        <MapPin className="size-3.5" aria-hidden />
                      </div>
                      <span className="font-medium">{profile.location}</span>
                    </div>

                    <a
                      href={`mailto:${profile.contact.email}`}
                      className="group/item flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground border border-border/40 shadow-2xs transition-colors group-hover/item:bg-primary/10 group-hover/item:text-primary group-hover/item:border-primary/20">
                        <Mail className="size-3.5" aria-hidden />
                      </div>
                      <span className="font-medium truncate">{profile.contact.email}</span>
                    </a>

                    <a
                      href={`tel:${profile.contact.phone.replace(/\s/g, "")}`}
                      className="group/item flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground border border-border/40 shadow-2xs transition-colors group-hover/item:bg-primary/10 group-hover/item:text-primary group-hover/item:border-primary/20">
                        <Phone className="size-3.5" aria-hidden />
                      </div>
                      <span className="font-medium">{profile.contact.phone}</span>
                    </a>
                  </div>
                </div>

                {/* Education Section */}
                <div className="space-y-3.5">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                    Education
                  </h3>
                  <div className="group/edu flex gap-3">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground border border-border/40 shadow-2xs transition-colors group-hover/edu:bg-primary/10 group-hover/edu:text-primary group-hover/edu:border-primary/20">
                      <GraduationCap className="size-3.5" aria-hidden />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-semibold text-foreground leading-snug">
                        {profile.education.degree}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {profile.education.school}
                      </p>
                      <p className="text-[11px] font-medium text-muted-foreground/70 mt-1">
                        {profile.education.years}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-6 pt-4 border-t border-border/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-xs text-muted-foreground">
                  Need a copy for offline reference?
                </p>
                <DownloadResumeButton className="shadow-xs font-medium hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary dark:hover:text-primary-foreground transition-all duration-200" />
              </div>
            </motion.aside>
          </div>

          <motion.div
            className="mx-auto w-full max-w-md lg:sticky lg:top-24 lg:ms-auto lg:me-0 lg:max-w-none"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <ErrorBoundary title="Portrait failed to load" showHeader={false}>
              <M3FeatureImage
                items={portraitItems}
                alt={`${profile.name} portrait`}
                className="mx-auto lg:ms-auto lg:me-0"
                imageClassName="size-72 sm:size-80 md:size-[22rem] lg:size-[26rem] xl:size-[30rem]"
              />
            </ErrorBoundary>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
