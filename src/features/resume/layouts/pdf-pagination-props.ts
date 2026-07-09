/** Section title stays with the first line of body content. */
export const PDF_SECTION_HEADING_PROPS = {
  wrap: false,
  minPresenceAhead: 16,
} as const

/** Job title row stays together; description/highlights may flow across pages. */
export const PDF_JOB_HEADER_PROPS = {
  wrap: false,
  minPresenceAhead: 10,
} as const
