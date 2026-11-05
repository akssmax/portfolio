import { Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer"

import { blendHexOverWhite, resolvePdfBrandColor } from "../color-utils"
import {  parseProjectMetaParts } from "./official-layout-utils"
import { DEFAULT_PDF_LAYOUT_PROPS  } from "./pdf-layout-props"
import {  chunkPairs, getSignatureContent } from "./signature-content"
import { SIGNATURE } from "./signature-tokens"
import { PdfFounderBadge } from "./founder-badge"
import type {SignatureJob} from "./signature-content";
import type {OfficialContactPart} from "./official-layout-utils";
import type {ResumePdfLayoutProps} from "./pdf-layout-props";
import type { ResumeProjectItem } from "../types"

const C = SIGNATURE.color
const F = SIGNATURE.font
const G = SIGNATURE.gap
const P = SIGNATURE.page

const styles = StyleSheet.create({
  page: {
    paddingTop: P.marginTop,
    paddingBottom: P.marginBottom,
    paddingHorizontal: P.marginX,
    backgroundColor: "#FFFFFF",
    fontSize: F.body,
    lineHeight: SIGNATURE.lineHeight,
    color: C.body,
  },
  footer: {
    position: "absolute",
    left: P.marginX,
    right: P.marginX,
    bottom: SIGNATURE.footer.bottom,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: SIGNATURE.footer.fontSize,
    color: C.faint,
  },
  name: { fontSize: F.name, fontWeight: 700, color: C.ink, lineHeight: 1.1 },
  title: { fontSize: F.title, fontWeight: 700, marginTop: 3 },
  tagline: { fontSize: F.tagline, color: C.body, marginTop: 6 },
  inlineRow: { flexDirection: "row", flexWrap: "wrap", fontSize: F.small, color: C.muted },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", marginBottom: G.sectionTitle },
  sectionTitle: { fontSize: F.sectionTitle, fontWeight: 700, letterSpacing: 0.4 },
  sectionRule: { flexGrow: 1, height: 1, backgroundColor: C.rule, marginLeft: 8 },
  jobHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  jobTitle: { flexShrink: 1, paddingRight: 12, color: C.ink },
  jobPeriod: { fontSize: F.small, color: C.muted },
  bulletRow: { flexDirection: "row", marginTop: G.bullet },
  bulletDot: { width: 10, fontSize: F.body },
  bulletText: { flex: 1, fontSize: F.body },
  metricsRow: {
    flexDirection: "row",
    marginTop: 10,
    borderWidth: 1,
    borderColor: C.rule,
    borderRadius: 4,
    backgroundColor: C.surface,
  },
  metricCell: { flex: 1, paddingVertical: 7, paddingHorizontal: 6, alignItems: "center" },
  metricValue: { fontSize: F.metricValue, fontWeight: 700, color: C.ink, lineHeight: 1.15 },
  metricLabel: { fontSize: F.tiny, color: C.muted, textAlign: "center" },
  toolkitRow: { flexDirection: "row", fontSize: F.small, marginTop: 3 },
  toolkitLabel: { width: 92, fontWeight: 700, color: C.ink, paddingRight: 8 },
  toolkitValues: { flex: 1 },
  projectRow: { flexDirection: "row" },
  projectCard: { flexGrow: 1, padding: 8, borderRadius: 4, borderWidth: 1 },
  projectTitle: { fontSize: F.body, fontWeight: 700, textDecoration: "none" },
  tiny: { fontSize: F.tiny, color: C.muted },
  small: { fontSize: F.small, color: C.body },
  strong: { fontWeight: 700, color: C.ink },
  twoColumn: { flexDirection: "row", flexWrap: "wrap" },
  column: { width: "50%", paddingRight: 16, marginBottom: 6 },
})

function SectionTitle({ title, brandColor }: { title: string; brandColor: string }) {
  return (
    <View style={styles.sectionTitleRow}>
      <Text style={[styles.sectionTitle, { color: brandColor }]}>{title.toUpperCase()}</Text>
      <View style={styles.sectionRule} />
    </View>
  )
}

function InlineParts({
  parts,
  linkColor,
  marginTop,
}: {
  parts: Array<OfficialContactPart>
  linkColor: string
  marginTop: number
}) {
  return (
    <Text style={[styles.inlineRow, { marginTop }]}>
      {parts.map((part, index) => (
        <Text key={`${part.label}-${index}`}>
          {index > 0 ? <Text style={{ color: C.faint }}>{"  ·  "}</Text> : null}
          {part.href ? (
            <Link src={part.href} style={{ color: linkColor, textDecoration: "none" }}>
              {part.label}
            </Link>
          ) : (
            part.label
          )}
        </Text>
      ))}
    </Text>
  )
}

function JobEntry({ entry, compact }: { entry: SignatureJob; compact?: boolean }) {
  const { job } = entry
  return (
    <View>
      <View style={styles.jobHeader}>
        <Text style={[styles.jobTitle, { fontSize: compact ? F.body : F.role }]}>
          <Text style={{ fontWeight: 700 }}>{job.role}</Text>
          <Text style={{ color: C.faint }}>{" · "}</Text>
          {job.companyUrl ? (
            <Link src={job.companyUrl} style={{ fontWeight: 700, color: C.ink, textDecoration: "underline" }}>
              {job.company}
            </Link>
          ) : (
            <Text style={{ fontWeight: 700 }}>{job.company}</Text>
          )}
        </Text>
        <Text style={styles.jobPeriod}>{job.period}</Text>
      </View>
      {job.location && !compact ? (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.jobPeriod}>{job.location}</Text>
          {job.founderBadge ? <Text style={[styles.jobPeriod, { color: C.faint }]}>{"\u00A0\u00A0·"}</Text> : null}
          <PdfFounderBadge inline label={job.founderBadge} />
        </View>
      ) : null}
      {job.description && !compact ? (
        <Text
          style={{ fontSize: F.body, color: C.body, marginTop: 3 }}
        >
          {job.description}
        </Text>
      ) : null}
      {!compact && entry.visibleHighlights.length ? (
        <View style={{ marginTop: 3 - G.bullet }}>
          {entry.visibleHighlights.map((highlight, index) => (
            <View key={`${index}-${highlight.slice(0, 12)}`} style={styles.bulletRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>{highlight}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  )
}

function ProjectCard({ project, brandColor }: { project: ResumeProjectItem; brandColor: string }) {
  const meta = parseProjectMetaParts(project.meta, project.url)
    .map((part) => part.label)
    .join(" · ")

  return (
    <View
      style={[
        styles.projectCard,
        {
          borderColor: blendHexOverWhite(brandColor, 0.2),
          backgroundColor: blendHexOverWhite(brandColor, 0.05),
        },
      ]}
    >
      {project.url ? (
        <Link src={project.url} style={[styles.projectTitle, { color: brandColor }]}>
          {project.title}
        </Link>
      ) : (
        <Text style={[styles.projectTitle, { color: C.ink }]}>{project.title}</Text>
      )}
      <Text style={[styles.tiny, { marginTop: 1 }]}>{meta}</Text>
      <Text style={[styles.small, { marginTop: 3 }]}>{project.description}</Text>
    </View>
  )
}

/**
 * Every block is unbreakable (`wrap={false}`) and carries its own bottom gap,
 * so a block that does not fit moves whole to the next page, which starts at the
 * same top margin as page 1.
 */
export function SignatureResumeLayout({
  document,
  brandColor: rawBrandColor,
  fontFamily = DEFAULT_PDF_LAYOUT_PROPS.fontFamily,
}: ResumePdfLayoutProps) {
  const brandColor = resolvePdfBrandColor(rawBrandColor)
  const content = getSignatureContent(document)
  const education = document.education
  const certifications = document.certifications ?? []
  const languages = document.languages ?? []
  const projectRows = chunkPairs(content.projects)

  return (
    <Page size="A4" style={[styles.page, { fontFamily }]}>
      <View fixed style={styles.footer}>
        <Text>{content.footerLabel}</Text>
        <Text
          render={({ pageNumber, totalPages }) =>
            totalPages > 1 ? `Page ${pageNumber} of ${totalPages}` : ""
          }
        />
      </View>

      <View
        wrap={false}
        style={{
          paddingBottom: 12,
          borderBottomWidth: 2,
          borderBottomColor: brandColor,
          marginBottom: G.section,
        }}
      >
        <Text style={styles.name}>{document.name}</Text>
        <Text style={[styles.title, { color: brandColor }]}>{document.title}</Text>
        {content.tagline ? <Text style={styles.tagline}>{content.tagline}</Text> : null}
        {content.contactLine.length ? (
          <InlineParts parts={content.contactLine} linkColor={C.body} marginTop={8} />
        ) : null}
        {content.linkLine.length ? (
          <InlineParts parts={content.linkLine} linkColor={brandColor} marginTop={2} />
        ) : null}
      </View>

      {content.profileParagraphs.length || content.metrics.length ? (
        <View wrap={false} style={{ marginBottom: G.section }}>
          <SectionTitle title="Profile" brandColor={brandColor} />
          {content.profileParagraphs.map((paragraph, index) => (
            <Text key={`profile-${index}`} style={{ marginTop: index ? 4 : 0 }}>
              {paragraph}
            </Text>
          ))}
          {content.metrics.length ? (
            <View style={styles.metricsRow}>
              {content.metrics.map((metric, index) => (
                <View
                  key={`${metric.value}-${metric.label}`}
                  style={[
                    styles.metricCell,
                    index ? { borderLeftWidth: 1, borderLeftColor: C.rule } : {},
                  ]}
                >
                  <Text style={styles.metricValue}>{metric.value}</Text>
                  <Text style={styles.metricLabel}>{metric.label}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      ) : null}

      {content.toolkit.length ? (
        <View wrap={false} style={{ marginBottom: G.section }}>
          <SectionTitle title="AI-native toolkit" brandColor={brandColor} />
          {content.toolkit.map((group, index) => (
            <View key={group.label} style={[styles.toolkitRow, index === 0 ? { marginTop: 0 } : {}]}>
              <Text style={styles.toolkitLabel}>{group.label}</Text>
              <Text style={styles.toolkitValues}>{group.values}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {content.professional.map((entry, position) => (
        <View
          key={`job-${entry.index}`}
          wrap={false}
          style={{
            marginBottom:
              position === content.professional.length - 1 ? G.section : G.item,
          }}
        >
          {position === 0 ? <SectionTitle title="Experience" brandColor={brandColor} /> : null}
          <JobEntry entry={entry} />
        </View>
      ))}

      {projectRows.map((row, rowIndex) => (
        <View
          key={`projects-${rowIndex}`}
          wrap={false}
          style={{ marginBottom: rowIndex === projectRows.length - 1 ? G.section : 8 }}
        >
          {rowIndex === 0 ? <SectionTitle title="Recent projects" brandColor={brandColor} /> : null}
          <View style={styles.projectRow}>
            {row.map((project, index) => (
              <View key={project.title} style={{ flex: 1, marginLeft: index ? 8 : 0 }}>
                <ProjectCard project={project} brandColor={brandColor} />
              </View>
            ))}
            {row.length === 1 ? <View style={{ flex: 1, marginLeft: 8 }} /> : null}
          </View>
        </View>
      ))}

      {content.earlier.map((entry, position) => (
        <View
          key={`earlier-${entry.index}`}
          wrap={false}
          style={{ marginBottom: position === content.earlier.length - 1 ? G.section : 6 }}
        >
          {position === 0 ? (
            <SectionTitle title="Earlier experience" brandColor={brandColor} />
          ) : null}
          <JobEntry entry={entry} compact />
        </View>
      ))}

      {education || certifications.length || languages.length || document.interests?.length ? (
        <View wrap={false}>
          <SectionTitle title="Education and more" brandColor={brandColor} />
          <View style={styles.twoColumn}>
            {education ? (
              <View style={styles.column}>
                <Text style={[styles.small, styles.strong]}>{education.degree}</Text>
                <Text style={styles.small}>{education.school}</Text>
                <Text style={[styles.small, { color: C.muted }]}>
                  {education.years} · {education.location}
                </Text>
              </View>
            ) : null}
            {certifications.map((certification) => (
              <View key={certification.title} style={styles.column}>
                <Text style={[styles.small, styles.strong]}>{certification.title}</Text>
                <Text style={styles.small}>{certification.issuer}</Text>
                <Text style={[styles.small, { color: C.muted }]}>
                  {certification.date}
                  {certification.credentialId
                    ? ` · Credential ID ${certification.credentialId}`
                    : ""}
                </Text>
              </View>
            ))}
          </View>
          {/* Languages and interests share one line to keep Signature at 2 pages. */}
          {languages.length || document.interests?.length ? (
            <Text style={styles.small}>
              {languages.length ? (
                <>
                  <Text style={styles.strong}>Languages: </Text>
                  {languages.map((language) => `${language.name} (${language.level})`).join(", ")}
                </>
              ) : null}
              {languages.length && document.interests?.length ? (
                <Text style={{ color: C.faint }}>{"  ·  "}</Text>
              ) : null}
              {document.interests?.length ? (
                <>
                  <Text style={styles.strong}>Interests: </Text>
                  {document.interests.join(", ")}
                </>
              ) : null}
            </Text>
          ) : null}
        </View>
      ) : null}
    </Page>
  )
}
