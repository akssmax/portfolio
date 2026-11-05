import { profile } from "./profile"
import { SITE_URL, siteUrl } from "./site-url"

/**
 * schema.org graph for every page: who Akshay is, and that this site is theirs.
 * Search engines (and the answer engines built on them, such as ChatGPT search
 * via Bing) use it to connect the name, role, location, and profiles.
 */
export function buildSiteStructuredData() {
  const personId = `${SITE_URL}/#person`
  const links = profile.links

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: profile.name,
        jobTitle: ["Product Designer", "Design Engineer"],
        disambiguatingDescription: "Also described as a full stack designer: from UX research and Figma to production code.",
        description:
          "AI-native product designer and design engineer: UX and product design in Figma, design systems, and production code, built with Claude Code and Codex.",
        url: siteUrl("/"),
        image: siteUrl(profile.portrait.src),
        email: `mailto:${profile.contact.email}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Bengaluru",
          addressRegion: "Karnataka",
          addressCountry: "IN",
        },
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: profile.education.school,
        },
        knowsAbout: [
          "Product design",
          "UX design",
          "Design systems",
          "Design engineering",
          "Conversational AI design",
          "Agentic AI products",
          "Figma",
          "React",
          "TypeScript",
          "Claude Code",
          "Codex",
          "PostHog",
        ],
        sameAs: [links.linkedin, links.github, links.dribbble, links.medium, links.youtube],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: siteUrl("/"),
        name: `${profile.name} — Design Engineer`,
        inLanguage: "en",
        publisher: { "@id": personId },
        about: { "@id": personId },
      },
    ],
  }
}

/** JSON for a `<script type="application/ld+json">`, safe to inline in HTML. */
export function serializeStructuredData(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}
