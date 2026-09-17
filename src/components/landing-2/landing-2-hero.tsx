import * as React from "react"

import { CropMarks } from "@/components/landing-2/crop-marks"
import { DitherField } from "@/components/landing-2/dither-field"
import { OsFindDialog } from "@/components/landing-2/os-find-dialog"
import { OsWindow } from "@/components/landing-2/os-window"
import type { ProjectCard } from "@/lib/sanity/types"
import { profile } from "@/lib/profile"

type Landing2HeroProps = {
  latestProject?: ProjectCard
  onSubmitPrompt: (text: string) => void
  findInputRef: React.Ref<HTMLInputElement>
}

export function Landing2Hero({
  latestProject,
  onSubmitPrompt,
  findInputRef,
}: Landing2HeroProps) {
  return (
    <section className="relative min-h-[calc(100svh-3.25rem)] overflow-hidden">
      <DitherField variant="sky" />
      <CropMarks />

      <OsFindDialog
        onSubmitPrompt={onSubmitPrompt}
        inputRef={findInputRef}
        className="absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
      />

      {latestProject ? (
        <OsWindow
          title="Akshay News"
          className="absolute top-6 left-4 z-10 hidden w-[15.5rem] sm:block lg:left-8"
          to="/projects/$slug"
          params={{ slug: latestProject.slug }}
          tone="cyan"
          bodyClassName="p-0"
        >
          {latestProject.coverImageUrl ? (
            <img
              src={latestProject.coverImageUrl}
              alt=""
              className="h-28 w-full border-b border-foreground object-cover"
            />
          ) : null}
          <div className="p-2">
            <p className="mb-1 text-[10px] text-muted-foreground">Latest case study</p>
            <p className="font-medium">{latestProject.title}</p>
            <p className="mt-2 underline">Read More</p>
          </div>
        </OsWindow>
      ) : null}

      <OsWindow
        title="Portrait 1.1"
        className="absolute top-6 right-4 z-10 hidden w-[10.5rem] sm:block lg:right-8"
        tone="violet"
        bodyClassName="p-0"
      >
        <img
          src="/images/portraits/02.webp"
          alt={profile.name}
          className="aspect-[4/5] w-full object-cover object-top"
        />
      </OsWindow>
    </section>
  )
}
