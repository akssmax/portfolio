import { createFileRoute } from "@tanstack/react-router"

import { ResumeBuilderPage } from "@/features/resume/resume-builder-page"

export const Route = createFileRoute("/resume")({
  head: () => ({
    meta: [
      { title: "Resume builder — Akshay Saini" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ResumeBuilderPage,
})
