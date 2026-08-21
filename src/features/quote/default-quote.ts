import type { FontPresetId } from "@/lib/themes/types"

import type { QuoteDocument } from "./types"

export const DEFAULT_QUOTE_NUMBER = "AS-2026-001"

export const DEFAULT_QUOTE_DATE = "August 2026"

/** Geist — matches the registered PDF font so preview ≈ exported PDF. */
export const DEFAULT_QUOTE_FONT: FontPresetId = "geist"

export function createDefaultQuoteDocument(): QuoteDocument {
  return {
    quoteNumber: DEFAULT_QUOTE_NUMBER,
    date: DEFAULT_QUOTE_DATE,
    clientCompany: "Indus Best Mega Food Park Pvt. Ltd.",
    projectTitle: "Website Redesign & Development",
    overview: [
      "A complete redesign and custom-coded rebuild of the Indus Best Mega Food Park website — built to reflect the scale of the park (CPC, cold chain, IQF lines, warehousing) and give investors and tenants a clear path from information to enquiry.",
      "Unlike a page-builder platform, this is a fully coded site you own outright — no monthly subscription, no platform dependency.",
    ].join("\n\n"),
    scope: [
      "Discovery, sitemap & content structure (up to 15 pages)",
      "UI/UX design — desktop, tablet, mobile",
      "Custom coded development, fully responsive",
      "Enquiry/contact forms",
      "On-page SEO (meta tags, sitemap, robots.txt, Search Console)",
      "Content & asset integration",
      "Testing, QA, and deployment to your existing server",
    ],
    exclusions: [
      "Hosting/domain",
      "Photography",
      "Copywriting from scratch",
      "Logo/brand work",
      "Multilingual versions",
      "Ongoing SEO campaigns",
      "Features beyond the agreed scope",
    ],
    timeline: "1 week from kickoff",
    timelineNote:
      "Contingent on content, feedback and approvals being turned around within 24 hours at each review point.",
    investmentAmount: "₹1,00,000",
    investmentGst: true,
    milestones: [
      { label: "On kickoff", percent: 50 },
      { label: "On launch/handover", percent: 50 },
    ],
    support: "30 days free bug fixes and minor corrections after launch.",
    font: DEFAULT_QUOTE_FONT,
  }
}
