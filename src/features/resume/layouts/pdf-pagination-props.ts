/** Section title stays with the first line of body content. */
export const PDF_SECTION_HEADING_PROPS = {
  wrap: false,
  minPresenceAhead: 16,
} as const

/** Experience section titles stay with at least one full job block. */
export const PDF_EXPERIENCE_SECTION_HEADING_PROPS = {
  wrap: false,
  minPresenceAhead: 80,
} as const

/** Keep section heading and first experience entry on the same page. */
export const PDF_EXPERIENCE_SECTION_INTRO_PROPS = {
  wrap: false,
} as const

/** Grid section titles should stay with at least one full row. */
export const PDF_GRID_SECTION_HEADING_PROPS = {
  wrap: false,
  minPresenceAhead: 36,
} as const

/** Keep a two-column grid row intact; allow breaks between rows. */
export const PDF_GRID_ROW_PROPS = {
  wrap: false,
  minPresenceAhead: 28,
} as const

/** Job title row stays together (used when the full block may still break). */
export const PDF_JOB_HEADER_PROPS = {
  wrap: false,
  minPresenceAhead: 10,
} as const

/** Keep a full experience entry (header + description + bullets) on one page. */
export const PDF_EXPERIENCE_BLOCK_PROPS = {
  wrap: false,
} as const

/** Keep a project card intact; move it to the next page if it does not fit. */
export const PDF_PROJECT_CARD_PROPS = {
  wrap: false,
} as const

/** Header band and compact grids that should not split mid-block. */
export const PDF_HEADER_BAND_PROPS = {
  wrap: false,
} as const
