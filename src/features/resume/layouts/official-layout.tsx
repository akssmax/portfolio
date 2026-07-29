import type { ReactNode } from "react"
import { Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer"

import type { ResumeDocument, ResumeExperienceItem, ResumeProjectItem } from "../types"
import { blendHexOverWhite } from "../color-utils"
import { RESUME_SPACING } from "./spacing-tokens"
import { getPdfSectionMarginBottom } from "../section-spacing-utils"
import type { ResumeDisplayPreferences } from "../resume-display-preferences"
import {
  DEFAULT_PDF_LAYOUT_PROPS,
  type ResumePdfLayoutProps,
} from "./pdf-layout-props"
import {
  PDF_EXPERIENCE_BLOCK_PROPS,
  PDF_EXPERIENCE_SECTION_INTRO_PROPS,
  PDF_GRID_ROW_PROPS,
  PDF_GRID_SECTION_HEADING_PROPS,
  PDF_HEADER_BAND_PROPS,
  PDF_PROJECT_CARD_PROPS,
  PDF_SECTION_HEADING_PROPS,
} from "./pdf-pagination-props"
import {
  buildOfficialContactParts,
  buildOfficialFooterLabel,
  buildOfficialLinkParts,
  formatLanguageLine,
  formatOfficialTitle,
  formatOfficialMetricText,
  getOfficialCapabilities,
  getOfficialCertifications,
  getOfficialCoreStrengths,
  getOfficialEducation,
  getOfficialHighlightMetrics,
  getOfficialProjects,
  getOfficialSummaryParts,
  parseProjectMetaParts,
  splitExperienceGroups,
} from "./official-layout-utils"
import {
  OFFICIAL_HEADER_BG,
  OFFICIAL_HEADER_CONTACT_SEPARATOR,
  OFFICIAL_HEADER_NAME_COLOR,
  OFFICIAL_HEADER_TAGLINE_COLOR,
} from "../official-resume-content"
import { PdfResumePortrait } from "./pdf/pdf-resume-portrait"

const S = RESUME_SPACING.official

/** Shared bordered container for official grid sections (matches HTML rounded-sm boxes). */
const OFFICIAL_BORDERED_FRAME = {
  borderWidth: 1,
  borderColor: "#E5E5E5",
  borderRadius: 4,
  backgroundColor: "#FFFFFF",
} as const

const styles = StyleSheet.create({
  page: {
    position: "relative",
    paddingTop: S.page.paddingTop,
    paddingBottom: S.page.paddingBottom + S.footerReserve,
    paddingLeft: S.page.paddingLeft,
    paddingRight: S.page.paddingRight,
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
    fontSize: S.fontSize,
    lineHeight: S.lineHeight,
    color: "#171717",
  },
  pageFooter: {
    position: "absolute",
    bottom: S.footerBottom,
    left: S.page.paddingLeft,
    right: S.page.paddingRight,
    alignItems: "flex-start",
  },
  footerText: {
    fontSize: 7.5,
    color: "#737373",
  },
  header: {
    marginTop: -S.page.paddingTop,
    marginBottom: S.headerGap,
    marginHorizontal: -S.page.paddingLeft,
  },
  headerBand: {
    backgroundColor: OFFICIAL_HEADER_BG,
    paddingHorizontal: S.page.paddingLeft,
    paddingTop: 28,
    paddingBottom: 16,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  headerTextColumn: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 19,
    fontWeight: 700,
    letterSpacing: 0.15,
    color: OFFICIAL_HEADER_NAME_COLOR,
    lineHeight: 1.05,
    marginBottom: 4,
  },
  title: {
    fontSize: 11.5,
    fontWeight: 700,
    letterSpacing: 0.2,
    lineHeight: 1.3,
    marginBottom: 0,
  },
  tagline: {
    fontSize: 9,
    fontWeight: 400,
    color: OFFICIAL_HEADER_TAGLINE_COLOR,
    lineHeight: 1.45,
    marginTop: 6,
  },
  contactRow: {
    fontSize: 8,
    fontWeight: 400,
    lineHeight: 1.35,
    marginTop: 8,
  },
  contactPlain: {
    color: OFFICIAL_HEADER_TAGLINE_COLOR,
  },
  contactSeparator: {
    color: OFFICIAL_HEADER_CONTACT_SEPARATOR,
  },
  contactLink: {
    textDecoration: "underline",
    color: OFFICIAL_HEADER_NAME_COLOR,
  },
  section: {
    marginBottom: S.sectionGap,
  },
  sectionGrouped: {
    marginBottom: S.profileClusterGap ?? 6,
  },
  profileCluster: {
    marginBottom: S.sectionGap,
  },
  sectionTitleWrap: {
    marginBottom: S.sectionTitleGap ?? 4,
  },
  sectionTitle: {
    fontSize: 9.5,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.9,
  },
  paragraph: {
    marginBottom: 3,
    color: "#262626",
    fontSize: 9.5,
    lineHeight: 1.42,
  },
  metricsRow: {
    flexDirection: "row",
    marginBottom: 0,
    ...OFFICIAL_BORDERED_FRAME,
  },
  metricCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  metricCellDivider: {
    borderLeftWidth: 1,
    borderLeftColor: "#E5E5E5",
  },
  metricValue: {
    fontSize: 14,
    fontWeight: 700,
    color: "#171717",
    marginBottom: 2,
    textAlign: "center",
  },
  metricLabel: {
    fontSize: 7.5,
    fontWeight: 500,
    color: "#525252",
    textAlign: "center",
    lineHeight: 1.3,
  },
  strengthGrid: {
    ...OFFICIAL_BORDERED_FRAME,
  },
  strengthRow: {
    flexDirection: "row",
  },
  strengthRowDivider: {
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  strengthCell: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  strengthCellDivider: {
    borderLeftWidth: 1,
    borderLeftColor: "#E5E5E5",
  },
  strengthCellText: {
    fontSize: 8.5,
    fontWeight: 500,
    color: "#262626",
    textAlign: "center",
    lineHeight: 1.25,
  },
  job: {
    marginBottom: S.jobGap,
  },
  jobLast: {
    marginBottom: 0,
  },
  metaCluster: {
    marginBottom: S.sectionGap,
  },
  metaItem: {
    marginBottom: 12,
  },
  metaItemLast: {
    marginBottom: 0,
  },
  jobHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  jobTitleColumn: {
    flex: 1,
    minWidth: 0,
    paddingRight: 12,
  },
  jobRole: {
    fontSize: 10.5,
    fontWeight: 700,
    color: "#0F1923",
    marginBottom: 1,
  },
  jobCompany: {
    fontSize: 10,
    fontWeight: 700,
    color: "#262626",
    marginBottom: 1,
  },
  jobCompanyMeta: {
    fontSize: 10,
    fontWeight: 400,
    color: "#525252",
  },
  jobPeriod: {
    fontSize: 8.5,
    color: "#525252",
    textAlign: "right",
    maxWidth: 72,
    lineHeight: 1.3,
  },
  jobMeta: {
    fontSize: 8.5,
    color: "#525252",
    marginBottom: 1,
  },
  bulletList: {
    marginTop: 2,
    paddingLeft: 10,
  },
  bulletItem: {
    marginBottom: 1.5,
    color: "#262626",
    fontSize: 9.5,
    lineHeight: 1.38,
  },
  gridRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  gridCell: {
    width: "50%",
    paddingRight: 4,
  },
  gridCellRight: {
    width: "50%",
    paddingLeft: 4,
    paddingRight: 0,
  },
  experienceCard: {
    padding: 8,
    ...OFFICIAL_BORDERED_FRAME,
  },
  projectCard: {
    width: "100%",
    padding: 8,
    ...OFFICIAL_BORDERED_FRAME,
  },
  projectTitle: {
    fontSize: 10,
    fontWeight: 700,
    marginBottom: 1,
  },
  projectTitleLink: {
    textDecoration: "none",
  },
  projectMeta: {
    fontSize: 8,
    color: "#525252",
    marginBottom: 2,
  },
  projectMetaLink: {
    textDecoration: "none",
  },
  projectDescription: {
    fontSize: 9,
    color: "#262626",
    lineHeight: 1.38,
    marginBottom: 2,
  },
  projectStack: {
    fontSize: 8,
    color: "#525252",
    lineHeight: 1.35,
  },
  capabilityGrid: {
    ...OFFICIAL_BORDERED_FRAME,
  },
  capabilityRow: {
    flexDirection: "row",
  },
  capabilityRowDivider: {
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  capabilityColumn: {
    width: "50%",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderColor: "#E5E5E5",
  },
  capabilityColumnRight: {
    borderRightWidth: 1,
  },
  capabilityLabel: {
    fontSize: 9,
    fontWeight: 700,
    marginBottom: 2,
    color: "#0F1923",
  },
  capabilityValues: {
    fontSize: 8.5,
    color: "#404040",
    lineHeight: 1.38,
  },
  inlineLabel: {
    fontSize: 9.5,
    fontWeight: 700,
    color: "#0F1923",
  },
  inlineText: {
    fontSize: 9.5,
    color: "#262626",
  },
  linksRow: {
    fontSize: 8.5,
    color: "#525252",
  },
  link: {
    textDecoration: "none",
  },
})

function chunkPair<T>(items: T[]): T[][] {
  const rows: T[][] = []
  for (let i = 0; i < items.length; i += 2) {
    rows.push(items.slice(i, i + 2))
  }
  return rows
}

function Section({
  title,
  brandColor,
  children,
  style,
  display,
  headingProps = PDF_SECTION_HEADING_PROPS,
}: {
  title: string
  brandColor: string
  children: ReactNode
  style?: typeof styles.section
  display: ResumeDisplayPreferences
  headingProps?: {
    wrap?: boolean
    minPresenceAhead?: number
  }
}) {
  return (
    <View
      style={[
        styles.section,
        { marginBottom: getPdfSectionMarginBottom(display) },
        ...(style ? [style] : []),
      ]}
    >
      <View {...headingProps} style={styles.sectionTitleWrap}>
        <Text style={[styles.sectionTitle, { color: brandColor }]}>{title}</Text>
      </View>
      {children}
    </View>
  )
}

function OfficialHeader({
  document,
  brandColor,
}: {
  document: ResumeDocument
  brandColor: string
}) {
  const { tagline } = getOfficialSummaryParts(document)
  const contactParts = buildOfficialContactParts(document)

  return (
    <View style={styles.header}>
      <View {...PDF_HEADER_BAND_PROPS} style={styles.headerBand}>
        <View style={styles.headerTextColumn}>
          <Text style={styles.name}>{document.name}</Text>
          <Text style={[styles.title, { color: brandColor }]}>
            {formatOfficialTitle(document.title)}
          </Text>
          {tagline ? <Text style={styles.tagline}>{tagline}</Text> : null}
          {contactParts.length ? (
            <Text style={styles.contactRow}>
              {contactParts.map((part, index) => (
                <Text key={`${part.label}-${index}`}>
                  {index > 0 ? (
                    <Text style={styles.contactSeparator}> | </Text>
                  ) : null}
                  {part.href ? (
                    <Link src={part.href} style={styles.contactLink}>
                      <Text>{part.label}</Text>
                    </Link>
                  ) : (
                    <Text style={styles.contactPlain}>{part.label}</Text>
                  )}
                </Text>
              ))}
            </Text>
          ) : null}
        </View>
        {document.portrait ? (
          <PdfResumePortrait src={document.portrait.src} brandColor={brandColor} />
        ) : null}
      </View>
    </View>
  )
}

function CoreStrengthsGrid({ rows }: { rows: string[][] }) {
  return (
    <View style={styles.strengthGrid}>
      {rows.map((row, rowIndex) => (
        <View
          key={`strength-row-${rowIndex}`}
          {...PDF_GRID_ROW_PROPS}
          style={[styles.strengthRow, rowIndex > 0 ? styles.strengthRowDivider : {}]}
        >
          {row.map((skill, columnIndex) => (
            <View
              key={`${skill}-${columnIndex}`}
              style={[
                styles.strengthCell,
                columnIndex > 0 ? styles.strengthCellDivider : {},
              ]}
            >
              <Text style={styles.strengthCellText}>{skill}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  )
}

function ExperienceBlock({
  job,
  isLast = false,
}: {
  job: ResumeExperienceItem
  isLast?: boolean
}) {
  return (
    <View
      {...PDF_EXPERIENCE_BLOCK_PROPS}
      style={[styles.job, isLast ? styles.jobLast : {}]}
    >
      <View style={styles.jobHeaderRow}>
        <View style={styles.jobTitleColumn}>
          <Text style={styles.jobRole}>{job.role}</Text>
          <Text style={styles.jobCompany}>
            {job.company}
            {job.location ? (
              <Text style={styles.jobCompanyMeta}>{` · ${job.location}`}</Text>
            ) : null}
          </Text>
        </View>
        <Text style={styles.jobPeriod}>{job.period}</Text>
      </View>
      {job.description ? (
        <Text style={styles.jobMeta}>{job.description}</Text>
      ) : null}
      {job.highlights?.length ? (
        <View style={styles.bulletList}>
          {job.highlights.map((highlight) => (
            <Text key={highlight} style={styles.bulletItem}>
              • {highlight}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  )
}

function ExperienceListSection({
  title,
  brandColor,
  display,
  jobs,
  gridLayout,
}: {
  title: string
  brandColor: string
  display: ResumeDisplayPreferences
  jobs: ResumeExperienceItem[]
  gridLayout: boolean
}) {
  if (gridLayout) {
    return (
      <Section
        title={title}
        brandColor={brandColor}
        display={display}
        headingProps={PDF_GRID_SECTION_HEADING_PROPS}
      >
        <ExperienceGrid jobs={jobs} />
      </Section>
    )
  }

  const [firstJob, ...restJobs] = jobs

  return (
    <View
      style={[
        styles.section,
        { marginBottom: getPdfSectionMarginBottom(display) },
      ]}
    >
      {firstJob ? (
        <View {...PDF_EXPERIENCE_SECTION_INTRO_PROPS}>
          <View style={styles.sectionTitleWrap}>
            <Text style={[styles.sectionTitle, { color: brandColor }]}>{title}</Text>
          </View>
          <ExperienceBlock job={firstJob} isLast={restJobs.length === 0} />
        </View>
      ) : (
        <View style={styles.sectionTitleWrap}>
          <Text style={[styles.sectionTitle, { color: brandColor }]}>{title}</Text>
        </View>
      )}
      {restJobs.map((job, index) => (
        <ExperienceBlock
          key={`${job.company}-${job.period}`}
          job={job}
          isLast={index === restJobs.length - 1}
        />
      ))}
    </View>
  )
}

function ProjectCard({
  project,
  brandColor,
}: {
  project: ResumeProjectItem
  brandColor: string
}) {
  const cardTint = blendHexOverWhite(brandColor, 0.07)
  const cardBorder = blendHexOverWhite(brandColor, 0.22)
  const metaParts = parseProjectMetaParts(project.meta, project.url)

  return (
    <View
      {...PDF_PROJECT_CARD_PROPS}
      style={[
        styles.projectCard,
        { backgroundColor: cardTint, borderColor: cardBorder },
      ]}
    >
      {project.url ? (
        <Link src={project.url} style={styles.projectTitleLink}>
          <Text style={[styles.projectTitle, { color: brandColor }]}>{project.title}</Text>
        </Link>
      ) : (
        <Text style={[styles.projectTitle, { color: "#0F1923" }]}>{project.title}</Text>
      )}
      <Text style={styles.projectMeta}>
        {metaParts.map((part, index) => (
          <Text key={`${part.label}-${index}`}>
            {index > 0 ? " | " : ""}
            {part.href ? (
              <Link src={part.href} style={[styles.projectMetaLink, { color: brandColor }]}>
                <Text>{part.label}</Text>
              </Link>
            ) : (
              <Text>{part.label}</Text>
            )}
          </Text>
        ))}
      </Text>
      <Text style={styles.projectDescription}>{project.description}</Text>
      <Text style={styles.projectStack}>Stack: {project.stack}</Text>
    </View>
  )
}

function ProjectGrid({
  projects,
  brandColor,
}: {
  projects: ResumeProjectItem[]
  brandColor: string
}) {
  return (
    <View>
      {chunkPair(projects).map((row, rowIndex) => (
        <View
          key={`project-row-${rowIndex}`}
          {...PDF_GRID_ROW_PROPS}
          style={styles.gridRow}
        >
          {row.map((project, columnIndex) => (
            <View
              key={project.title}
              style={columnIndex === 0 ? styles.gridCell : styles.gridCellRight}
            >
              <ProjectCard project={project} brandColor={brandColor} />
            </View>
          ))}
        </View>
      ))}
    </View>
  )
}

function ExperienceGrid({ jobs }: { jobs: ResumeExperienceItem[] }) {
  return (
    <View>
      {chunkPair(jobs).map((row, rowIndex) => (
        <View
          key={`experience-row-${rowIndex}`}
          {...PDF_GRID_ROW_PROPS}
          style={styles.gridRow}
        >
          {row.map((job, columnIndex) => (
            <View
              key={`${job.company}-${job.period}`}
              style={columnIndex === 0 ? styles.gridCell : styles.gridCellRight}
            >
              <View style={styles.experienceCard}>
                <ExperienceBlock job={job} isLast />
              </View>
            </View>
          ))}
        </View>
      ))}
    </View>
  )
}

function CapabilitiesToolsGrid({
  categories,
}: {
  categories: ReturnType<typeof getOfficialCapabilities>
}) {
  return (
    <View style={styles.capabilityGrid}>
      {chunkPair(categories).map((row, rowIndex) => (
        <View
          key={`capability-row-${rowIndex}`}
          {...PDF_GRID_ROW_PROPS}
          style={[styles.capabilityRow, rowIndex > 0 ? styles.capabilityRowDivider : {}]}
        >
          {row.map((category, columnIndex) => (
            <View
              key={category.label}
              style={[
                styles.capabilityColumn,
                columnIndex === 0 && row.length > 1 ? styles.capabilityColumnRight : {},
              ]}
            >
              <Text style={styles.capabilityLabel}>{category.label}</Text>
              <Text style={styles.capabilityValues}>{category.values}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  )
}

function PageChrome({ document }: { document: ResumeDocument }) {
  const footerLabel = buildOfficialFooterLabel(document)

  return (
    <View fixed style={styles.pageFooter}>
      <Text
        style={styles.footerText}
        render={({ pageNumber, totalPages }) =>
          totalPages > 1
            ? `${footerLabel} Page ${pageNumber} of ${totalPages}`
            : footerLabel
        }
      />
    </View>
  )
}

export function OfficialResumeLayout({
  document,
  brandColor,
  fontFamily = DEFAULT_PDF_LAYOUT_PROPS.fontFamily,
  display = DEFAULT_PDF_LAYOUT_PROPS.display,
}: ResumePdfLayoutProps) {
  const { profile: profileText } = getOfficialSummaryParts(document)
  const { professional, earlier } = document.experience?.length
    ? splitExperienceGroups(document.experience)
    : { professional: [], earlier: [] }
  const metrics = getOfficialHighlightMetrics(document)
  const coreStrengths = getOfficialCoreStrengths(document)
  const projects = getOfficialProjects(document)
  const capabilities = getOfficialCapabilities(document)
  const education = getOfficialEducation(document)
  const certifications = getOfficialCertifications(document)
  const linkParts = buildOfficialLinkParts(document)
  const sectionGap = getPdfSectionMarginBottom(display)

  return (
    <Page size="A4" style={[styles.page, { fontFamily }]}>
      <PageChrome document={document} />
      <OfficialHeader document={document} brandColor={brandColor} />

      {profileText || metrics.length ? (
        <View style={[styles.profileCluster, { marginBottom: sectionGap }]}>
          {profileText ? (
            <Section
              title="Professional Profile"
              brandColor={brandColor}
              display={display}
              style={metrics.length ? styles.sectionGrouped : undefined}
            >
              {profileText.split("\n\n").map((paragraph) => (
                <Text key={paragraph.slice(0, 24)} style={styles.paragraph}>
                  {paragraph}
                </Text>
              ))}
            </Section>
          ) : null}

          {metrics.length ? (
            <View style={styles.metricsRow}>
              {metrics.map((metric, index) => (
                <View
                  key={`${metric.value}-${metric.label}`}
                  style={[
                    styles.metricCell,
                    index > 0 ? styles.metricCellDivider : {},
                  ]}
                >
                  <Text style={styles.metricValue}>
                    {formatOfficialMetricText(metric.value)}
                  </Text>
                  <Text style={styles.metricLabel}>
                    {formatOfficialMetricText(metric.label)}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      ) : null}

      {coreStrengths.length ? (
        <Section title="Core Strengths" brandColor={brandColor} display={display}>
          <CoreStrengthsGrid rows={coreStrengths} />
        </Section>
      ) : null}

      {professional.length ? (
        <ExperienceListSection
          title="Professional Experience"
          brandColor={brandColor}
          display={display}
          jobs={professional}
          gridLayout={display.experienceGridLayout}
        />
      ) : null}

      {projects.length ? (
        <Section
          title="Selected Product Work"
          brandColor={brandColor}
          display={display}
          headingProps={PDF_GRID_SECTION_HEADING_PROPS}
        >
          <ProjectGrid projects={projects} brandColor={brandColor} />
        </Section>
      ) : null}

      {earlier.length ? (
        <ExperienceListSection
          title="Earlier Experience"
          brandColor={brandColor}
          display={display}
          jobs={earlier}
          gridLayout={display.experienceGridLayout}
        />
      ) : null}

      {education || certifications.length ? (
        <Section
          title="Education and Certification"
          brandColor={brandColor}
          display={display}
          headingProps={PDF_GRID_SECTION_HEADING_PROPS}
        >
          <View style={styles.capabilityGrid}>
            <View {...PDF_GRID_ROW_PROPS} style={styles.capabilityRow}>
              {education ? (
                <View
                  style={[
                    styles.capabilityColumn,
                    certifications.length > 0 ? styles.capabilityColumnRight : {},
                    { width: certifications.length > 0 ? "50%" : "100%" },
                  ]}
                >
                  <Text style={styles.capabilityLabel}>{education.degree}</Text>
                  <Text style={styles.capabilityValues}>{education.school}</Text>
                  <Text style={styles.capabilityValues}>
                    {education.years} | {education.location}
                  </Text>
                </View>
              ) : null}
              {certifications.length ? (
                <View style={[styles.capabilityColumn, { width: education ? "50%" : "100%" }]}>
                  {certifications.map((certification) => (
                    <View
                      key={`${certification.title}-${certification.date}`}
                      style={{ marginBottom: certifications.length > 1 ? 6 : 0 }}
                    >
                      <Text style={styles.capabilityLabel}>{certification.title}</Text>
                      <Text style={styles.capabilityValues}>{certification.issuer}</Text>
                      <Text style={styles.capabilityValues}>
                        {certification.date}
                        {certification.credentialId
                          ? ` | Credential ID ${certification.credentialId}`
                          : ""}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          </View>
        </Section>
      ) : null}

      {capabilities.length ? (
        <Section
          title="Capabilities and Tools"
          brandColor={brandColor}
          display={display}
          headingProps={PDF_GRID_SECTION_HEADING_PROPS}
        >
          <CapabilitiesToolsGrid categories={capabilities} />
        </Section>
      ) : null}

      {document.languages?.length || linkParts.length ? (
        <View style={[styles.metaCluster, { marginBottom: sectionGap }]}>
          {document.languages?.length ? (
            <View style={linkParts.length ? styles.metaItem : styles.metaItemLast}>
              <Text>
                <Text style={styles.inlineLabel}>Languages{"\n"}</Text>
                <Text style={styles.inlineText}>{formatLanguageLine(document.languages)}</Text>
              </Text>
            </View>
          ) : null}

          {linkParts.length ? (
            <View style={styles.metaItemLast}>
              <Text style={styles.linksRow}>
                <Text style={styles.inlineLabel}>Links{"\n"}</Text>
                {linkParts.map((part, index) => (
                  <Text key={`${part.label}-link-${index}`}>
                    {index > 0 ? " | " : ""}
                    <Link src={part.href!} style={[styles.link, { color: brandColor }]}>
                      <Text>{part.label}</Text>
                    </Link>
                  </Text>
                ))}
              </Text>
            </View>
          ) : null}
        </View>
      ) : null}
    </Page>
  )
}
