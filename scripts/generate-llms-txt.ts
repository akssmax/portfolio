/**
 * Writes public/llms.txt — a plain-text summary of Akshay, the work, and the key
 * pages, in the llms.txt format (https://llmstxt.org) that AI assistants and
 * answer engines can read without running JavaScript.
 */
import { writeFileSync } from "node:fs"
import { join } from "node:path"

import {
  OFFICIAL_HEADER_TAGLINE,
  OFFICIAL_PROFILE_TEXT,
  OFFICIAL_RESUME_TITLE,
  SIGNATURE_TOOLKIT,
} from "../src/features/resume/official-resume-content"
import { getExperienceSummary, profile } from "../src/lib/profile"
import { fallbackPosts } from "../src/lib/sanity/fallback-posts"
import { fallbackProjects } from "../src/lib/sanity/fallback-projects"
import { SITE_URL } from "../src/lib/site-url"

const PUBLIC_DIR = join(import.meta.dirname, "../public")

const experienceLines = profile.experience.map((item) => {
  const site = "websiteUrl" in item && item.websiteUrl ? ` (${item.websiteUrl})` : ""
  return `- ${item.role}, ${item.company}${site}, ${item.period}, ${item.location}: ${getExperienceSummary(item)}`
})

const projectLines = fallbackProjects.map(
  (project) =>
    `- [${project.title}](${SITE_URL}/projects/${project.slug}): ${project.description}`,
)

const postLines = fallbackPosts.map(
  (post) => `- [${post.title}](${SITE_URL}/blog/${post.slug}): ${post.excerpt}`,
)

const toolkitLines = SIGNATURE_TOOLKIT.map((group) => `- ${group.label}: ${group.values}`)

const links = profile.links
const content = `# ${profile.name}

> ${profile.name} is a product designer and design engineer (a ${OFFICIAL_RESUME_TITLE.toLowerCase()}) based in ${profile.location}. ${OFFICIAL_HEADER_TAGLINE}

${OFFICIAL_PROFILE_TEXT}

Open to: full-time, contract, and freelance product design or design engineering roles, remote or in Bengaluru.

## Contact

- Email: ${profile.contact.email}
- Portfolio: ${SITE_URL}/
- LinkedIn: ${links.linkedin}
- GitHub: ${links.github}
- Dribbble: ${links.dribbble}

## Key pages

- [Home](${SITE_URL}/): Portfolio, with an AI assistant that answers questions about the work
- [About](${SITE_URL}/about): Background, skills, tools, education
- [Experience](${SITE_URL}/experience): Full work history
- [Projects](${SITE_URL}/projects): Case studies and recent builds

## Experience

${experienceLines.join("\n")}

## Projects and case studies

${projectLines.join("\n")}

## Toolkit

${toolkitLines.join("\n")}

## Education

- ${profile.education.degree}, ${profile.education.school}, ${profile.education.years}

## Writing

${postLines.join("\n")}
`

writeFileSync(join(PUBLIC_DIR, "llms.txt"), content)
console.log(`Generated public/llms.txt (${content.length} characters)`)
