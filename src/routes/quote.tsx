import { createFileRoute } from "@tanstack/react-router"

import { QuoteBuilderPage } from "@/features/quote/quote-builder-page"

export const Route = createFileRoute("/quote")({
  head: () => ({
    meta: [
      { title: "Quotation builder — Akshay Saini" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: QuoteBuilderPage,
})
