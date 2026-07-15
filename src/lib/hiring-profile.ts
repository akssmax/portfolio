import { getDesignCareerSpanLabel } from "./experience-duration"
import { profile } from "./profile"
import { siteUrl } from "./site-url"

export const hiringProfile = {
  totalExperience: getDesignCareerSpanLabel(profile.experience.map((item) => item.period)),
  totalExperienceNote:
    "~6 years in product/UX design (May 2020 – Present). Overall professional experience since 2017 including graphic design, branding, and founder work (Wallzy).",
  currentCtcLpa: 24,
  expectedSalaryLpa: { min: 28, max: 32 },
  noticePeriod: "Available immediately",
  currentLocation: "Bengaluru (Bangalore), Karnataka, India",
  preferredLocations: ["Bengaluru", "Gurgaon / Gurugram"],
  openToRelocation: true,
  workSetupPreference: "Prefers work from office (WFO); comfortable with hybrid if required",
  portfolioUrl: siteUrl("/"),
  currentCompany: profile.company,
  currentRole: profile.role,
  formalQualifications: [
    `${profile.education.degree} — ${profile.education.school} (${profile.education.years})`,
    ...profile.certifications.map((c) => `${c.title} — ${c.issuer} (${c.date})`),
    "Self-taught product designer; no formal B.Des/M.Des degree",
  ],
  primaryDesignTools: ["Figma", "FigJam", "Miro", "Framer", "Adobe Creative Suite", "Cursor"],
  b2cHighlights: [
    "100x.bot — consumer-facing agentic AI product UI, browser extension, and marketing site",
    "Kodo — Kodo ERP (Procure-to-Pay) plus consumer-facing payment app revamp (MD3) and UPI app demo for NPCI",
    "Wallzy — founded and designed an Android wallpaper app with 100K+ Google Play installs",
    "Tulr — mobile and web product design for a no-code platform",
  ],
  leadershipHighlights: [
    "Led end-to-end product design on Kodo ERP P2P launch, Unlogged product, and 100x extension + website",
    "Built design systems at Kodo (700+ components) and 100x (shadcn/ui tokens)",
    "Managed and collaborated with 2 junior developers at 100x.bot; no formal Design Manager title",
  ],
  openToGurugramRelocation:
    "Yes — previously worked in Gurgaon (Tulr, freelance, internship) and open to relocating to Gurugram/Gurgaon",
} as const

export function buildHiringProfileText(): string {
  const { expectedSalaryLpa } = hiringProfile

  return [
    "Hiring & recruiter information for Akshay Saini",
    "",
    `Total experience: ${hiringProfile.totalExperienceNote}`,
    `Current CTC: ${hiringProfile.currentCtcLpa} LPA`,
    `Expected salary: ${expectedSalaryLpa.min}–${expectedSalaryLpa.max} LPA`,
    `Notice period: ${hiringProfile.noticePeriod}`,
    `Current location: ${hiringProfile.currentLocation}`,
    `Preferred locations: ${hiringProfile.preferredLocations.join(", ")}`,
    `Open to relocation: ${hiringProfile.openToRelocation ? "Yes" : "No"}`,
    `Work setup: ${hiringProfile.workSetupPreference}`,
    `Portfolio: ${hiringProfile.portfolioUrl}`,
    `Current company: ${hiringProfile.currentCompany}`,
    `Current role: ${hiringProfile.currentRole}`,
    "",
    "Formal design qualifications:",
    ...hiringProfile.formalQualifications.map((item) => `- ${item}`),
    "",
    "Primary design tools:",
    hiringProfile.primaryDesignTools.join(", "),
    "",
    "B2C / consumer product experience:",
    ...hiringProfile.b2cHighlights.map((item) => `- ${item}`),
    "",
    "End-to-end leadership & team collaboration:",
    ...hiringProfile.leadershipHighlights.map((item) => `- ${item}`),
    "",
    `Relocation to Gurugram/Gurgaon: ${hiringProfile.openToGurugramRelocation}`,
    "",
    "Common recruiter Q&A:",
    "Q: What is your current CTC? A: 24 LPA.",
    "Q: What is your expected salary? A: 28–32 LPA.",
    "Q: What is your notice period? A: Available immediately.",
    "Q: Where are you based and where do you prefer to work? A: Based in Bengaluru; prefer Bengaluru or Gurgaon; open to relocation.",
    "Q: Are you open to office / hybrid? A: Yes — prefers WFO; comfortable with hybrid if required.",
    "Q: Do you have B2C experience? A: Yes — 100x.bot, Kodo (ERP + payment/UPI experiences), Wallzy (100K+ installs), Tulr.",
    "Q: Have you led end-to-end design and managed a team? A: Yes on end-to-end launches; managed/collaborated with 2 junior developers at 100x; no formal Design Manager title.",
    `Q: Contact for hiring? A: ${profile.contact.email}`,
  ].join("\n")
}
