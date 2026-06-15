"use client"

import { useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { GraduationCap, Mail, MapPin, Phone } from "lucide-react"

import { ErrorBoundary } from "@/components/error-boundary"
import { M3FeatureImage } from "@/components/m3-shapes/m3-feature-image"
import { Badge } from "@/components/ui/badge"
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
                Product designer with a computer science foundation.
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
              className="relative grid gap-4 rounded-xl border border-border bg-muted/30 p-5 pt-12 sm:grid-cols-2 lg:max-w-2xl lg:grid-cols-1 xl:grid-cols-2"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
            >
              <Tag
                variant="outline"
                className="absolute end-5 top-5 bg-background shadow-xs"
              >
                {experienceLabel}
              </Tag>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="size-4 shrink-0" aria-hidden />
                  {profile.location}
                </div>
                <a
                  href={`mailto:${profile.contact.email}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Mail className="size-4 shrink-0" aria-hidden />
                  {profile.contact.email}
                </a>
                <a
                  href={`tel:${profile.contact.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Phone className="size-4 shrink-0" aria-hidden />
                  {profile.contact.phone}
                </a>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <GraduationCap className="mt-0.5 size-4 shrink-0" aria-hidden />
                  <div>
                    <p className="text-foreground">{profile.education.degree}</p>
                    <p>{profile.education.school}</p>
                    <p>{profile.education.years}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="w-fit">
                    {profile.role} @ {profile.company}
                  </Badge>
                  <DownloadResumeButton />
                </div>
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
