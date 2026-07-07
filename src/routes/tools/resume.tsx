import { createFileRoute } from "@tanstack/react-router"

import { PublicResumeWizard } from "@/features/resume/public/public-resume-wizard"
import { siteUrl } from "@/lib/site-url"

export const Route = createFileRoute("/tools/resume")({
  head: () => ({
    meta: [
      {
        title: "AI Resume Builder — Profile to PDF | Akshay Saini",
      },
      {
        name: "description",
        content: "Generate a customizable resume PDF from a LinkedIn, GitHub, Peerlist, or portfolio URL using AI web search and Mistral structuring. Built by Akshay Saini.",
      },
      {
        name: "keywords",
        content: "resume builder, linkedin to pdf, github to resume, ai resume generator, mistral, resume pdf, portfolio to pdf, akshay saini",
      },
      {
        property: "og:title",
        content: "AI Resume Builder — Profile to PDF | Akshay Saini",
      },
      {
        property: "og:description",
        content: "Generate a customizable resume PDF from a LinkedIn, GitHub, Peerlist, or portfolio URL using AI web search and Mistral structuring.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:url",
        content: siteUrl("/tools/resume"),
      },
      {
        property: "og:image",
        content: siteUrl("/images/hero-portrait.png"),
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: "AI Resume Builder — Profile to PDF | Akshay Saini",
      },
      {
        name: "twitter:description",
        content: "Generate a customizable resume PDF from a LinkedIn, GitHub, Peerlist, or portfolio URL using AI web search and Mistral structuring.",
      },
      {
        name: "twitter:image",
        content: siteUrl("/images/hero-portrait.png"),
      },
    ],
    links: [
      {
        rel: "canonical",
        href: siteUrl("/tools/resume"),
      },
    ],
  }),
  component: PublicResumePage,
})

function PublicResumePage() {
  return <PublicResumeWizard />
}
