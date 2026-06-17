import { createFileRoute } from "@tanstack/react-router"

import { PublicResumeWizard } from "@/features/resume/public/public-resume-wizard"

export const Route = createFileRoute("/tools/resume")({
  head: () => ({
    meta: [
      { title: "AI Resume Builder — LinkedIn to PDF" },
      {
        name: "description",
        content:
          "Generate a customizable resume PDF from a LinkedIn profile URL using AI web search and Mistral structuring.",
      },
    ],
  }),
  component: PublicResumePage,
})

function PublicResumePage() {
  return <PublicResumeWizard />
}
