import type { ReactNode } from "react"
import { Image, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer"

import {
  DEFAULT_CONTACT_ICONS,
  type ResumeContactIconField,
  type ResumeDisplayPreferences,
} from "../resume-display-preferences"
import { toMailtoHref, toTelHref } from "../contact-link-utils"
import type { ResumeDocument, ResumeSectionId } from "../types"
import { ResumeLogomark } from "./resume-logomark"
import { PdfCompanyLogo } from "./pdf-company-logo"
import { PdfResumeIcon } from "./pdf/pdf-resume-icons"
import { PdfResumeSectionTitle } from "./pdf/pdf-resume-section"
import { RESUME_SPACING } from "./spacing-tokens"
import {
  DEFAULT_PDF_LAYOUT_PROPS,
  type ResumePdfLayoutProps,
} from "./pdf-layout-props"
import {
  PDF_JOB_HEADER_PROPS,
  PDF_SECTION_HEADING_PROPS,
} from "./pdf-pagination-props"

const S = RESUME_SPACING.modern
const PAGE_MARGIN = {
  paddingTop: S.page.paddingTop,
  paddingBottom: S.page.paddingBottom,
  paddingRight: S.page.paddingRight,
  paddingLeft: S.page.paddingLeft,
} as const

const styles = StyleSheet.create({
  page: {
    position: "relative",
    fontFamily: "Helvetica",
    fontSize: S.fontSize,
    lineHeight: S.lineHeight,
    color: "#171717",
    ...PAGE_MARGIN,
  },
  pageFooter: {
    position: "absolute",
    bottom: S.footerBottom,
    left: PAGE_MARGIN.paddingLeft,
    right: PAGE_MARGIN.paddingRight,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    paddingTop: 8,
  },
  footerMark: {
    width: 18,
    height: 13.4,
  },
  footerText: {
    fontSize: 8,
    color: "#737373",
  },
  header: {
    marginBottom: S.headerGap,
    paddingBottom: 12,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: 700,
    color: "#0F1923",
    lineHeight: 1.15,
  },
  title: {
    fontSize: 11,
    fontWeight: 700,
    lineHeight: 1.35,
    marginTop: 2,
  },
  meta: {
    fontSize: 9,
    color: "#737373",
    marginTop: 2,
  },
  portrait: {
    width: 64,
    height: 64,
    borderRadius: 8,
    objectFit: "cover",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  body: {
    flexDirection: "row",
    gap: S.columnGap ?? 20,
  },
  leftColumn: {
    width: S.leftColumnWidth ?? 150,
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: "#E5E5E5",
  },
  rightColumn: {
    flex: 1,
  },
  section: {
    marginBottom: S.sectionGap,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  sectionAccent: {
    width: 12,
    height: 3,
    borderRadius: 999,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    color: "#0F1923",
  },
  paragraph: {
    marginBottom: 4,
    color: "#262626",
    fontSize: 9.5,
  },
  job: {
    marginBottom: S.jobGap,
  },
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    paddingBottom: 4,
  },
  jobTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
    minWidth: 0,
  },
  jobLogoContainer: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  jobLogo: {
    width: 15,
    height: 15,
  },
  jobTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: "#171717",
    flex: 1,
  },
  jobMeta: {
    fontSize: 8.5,
    color: "#737373",
    textAlign: "right",
  },
  bulletList: {
    marginTop: 4,
    paddingLeft: 8,
  },
  bulletItem: {
    marginBottom: 2,
    color: "#404040",
    fontSize: 9,
  },
  skillWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  skillPill: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    fontSize: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    backgroundColor: "#FAFAFA",
    color: "#262626",
  },
  contactText: {
    fontSize: 8.5,
    color: "#404040",
    marginBottom: 4,
  },
  link: {
    textDecoration: "none",
  },
  educationText: {
    fontSize: 8.5,
    color: "#262626",
  },
  languageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8.5,
    marginBottom: 3,
  },
  languageName: {
    fontWeight: 700,
    color: "#262626",
  },
  languageLevel: {
    color: "#737373",
  },
})

function Section({
  sectionId,
  title,
  brandColor,
  display,
  children,
}: {
  sectionId?: ResumeSectionId
  title: string
  brandColor: string
  display?: ResumeDisplayPreferences
  children: ReactNode
}) {
  return (
    <View style={styles.section}>
      {display && sectionId ? (
        <PdfResumeSectionTitle
          sectionId={sectionId}
          title={title}
          brandColor={brandColor}
          display={display}
        />
      ) : (
        <View {...PDF_SECTION_HEADING_PROPS} style={styles.sectionHeader}>
          <View style={{ ...styles.sectionAccent, backgroundColor: brandColor }} />
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
      )}
      {children}
    </View>
  )
}

function PdfContactLine({
  field,
  display,
  brandColor,
  children,
}: {
  field: ResumeContactIconField
  display: ResumeDisplayPreferences
  brandColor: string
  children: React.ReactNode
}) {
  const showIcon = display.showContactIcons
  const iconName = DEFAULT_CONTACT_ICONS[field]

  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 4, marginBottom: 2 }}>
      {showIcon && iconName ? (
        <PdfResumeIcon name={iconName} color={brandColor} size={7} />
      ) : null}
      {children}
    </View>
  )
}

function formatWebsiteLabel(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "")
}

function PageChrome({
  document,
  brandColor,
}: {
  document: ResumeDocument
  brandColor: string
}) {
  return (
    <View fixed style={styles.pageFooter}>
      <View style={styles.footerMark}>
        <ResumeLogomark brandColor={brandColor} width={18} />
      </View>
      <Text
        style={styles.footerText}
        render={({ pageNumber, totalPages }) =>
          totalPages > 1
            ? `${document.name} · ${document.title} · ${pageNumber}/${totalPages}`
            : `${document.name} · ${document.title}`
        }
      />
    </View>
  )
}

export function ModernResumeLayout({
  document,
  brandColor,
  fontFamily = DEFAULT_PDF_LAYOUT_PROPS.fontFamily,
  display = DEFAULT_PDF_LAYOUT_PROPS.display,
}: ResumePdfLayoutProps) {
  return (
    <Page size="A4" style={[styles.page, { fontFamily }]}>
      <PageChrome document={document} brandColor={brandColor} />

      <View style={{ ...styles.header, borderBottomColor: brandColor }}>
        <View style={styles.headerText}>
          <Text style={styles.name}>{document.name}</Text>
          <Text style={{ ...styles.title, color: brandColor }}>
            {document.title}
          </Text>
          <Text style={styles.meta}>
            {document.location}
            {document.contact?.website
              ? `  ·  ${document.contact.website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}`
              : ""}
          </Text>
        </View>
        {document.portrait ? (
          <Image src={document.portrait.src} style={{ ...styles.portrait, borderColor: brandColor }} />
        ) : null}
      </View>

      <View style={styles.body}>
        {/* Left Column - Contact, Skills, Education, Languages */}
        <View style={styles.leftColumn}>
          {document.contact ? (
            <Section sectionId="contact" title="Contact" brandColor={brandColor} display={display}>
              <PdfContactLine field="email" display={display} brandColor={brandColor}>
                <Link src={toMailtoHref(document.contact.email)} style={{ textDecoration: "none" }}>
                  <Text style={styles.contactText}>{document.contact.email}</Text>
                </Link>
              </PdfContactLine>
              <PdfContactLine field="phone" display={display} brandColor={brandColor}>
                <Link src={toTelHref(document.contact.phone)} style={{ textDecoration: "none" }}>
                  <Text style={styles.contactText}>{document.contact.phone}</Text>
                </Link>
              </PdfContactLine>
              {document.contact.website ? (
                <PdfContactLine field="website" display={display} brandColor={brandColor}>
                  <Link
                    src={document.contact.website}
                    style={{ ...styles.link, color: brandColor }}
                  >
                    <Text style={styles.contactText}>
                      {formatWebsiteLabel(document.contact.website)}
                    </Text>
                  </Link>
                </PdfContactLine>
              ) : null}
              {document.contact.linkedin ? (
                <PdfContactLine field="linkedin" display={display} brandColor={brandColor}>
                  <Link
                    src={document.contact.linkedin}
                    style={{ ...styles.link, color: brandColor }}
                  >
                    <Text style={styles.contactText}>
                      {formatWebsiteLabel(document.contact.linkedin)}
                    </Text>
                  </Link>
                </PdfContactLine>
              ) : null}
              {document.contact.github ? (
                <PdfContactLine field="github" display={display} brandColor={brandColor}>
                  <Link
                    src={document.contact.github}
                    style={{ ...styles.link, color: brandColor }}
                  >
                    <Text style={styles.contactText}>
                      {formatWebsiteLabel(document.contact.github)}
                    </Text>
                  </Link>
                </PdfContactLine>
              ) : null}
            </Section>
          ) : null}

          {document.skills?.length ? (
            <Section sectionId="skills" title="Skills" brandColor={brandColor} display={display}>
              <View style={styles.skillWrap}>
                {document.skills.map((skill) => (
                  <Text key={skill} style={styles.skillPill}>
                    {skill}
                  </Text>
                ))}
              </View>
            </Section>
          ) : null}

          {document.education ? (
            <Section sectionId="education" title="Education" brandColor={brandColor} display={display}>
              <Text style={{ ...styles.educationText, fontWeight: "bold" }}>
                {document.education.degree}
              </Text>
              <Text style={{ ...styles.educationText, color: "#525252", marginTop: 1 }}>
                {document.education.school}
              </Text>
              <Text style={{ ...styles.educationText, color: "#737373", marginTop: 1 }}>
                {document.education.years}
              </Text>
            </Section>
          ) : null}

          {document.languages?.length ? (
            <Section sectionId="languages" title="Languages" brandColor={brandColor} display={display}>
              {document.languages.map((language) => (
                <View key={language.name} style={styles.languageRow}>
                  <Text style={styles.languageName}>{language.name}</Text>
                  <Text style={styles.languageLevel}>{language.level}</Text>
                </View>
              ))}
            </Section>
          ) : null}
        </View>

        {/* Right Column - Summary, Experience, Certifications, Interests */}
        <View style={styles.rightColumn}>
          {document.summary ? (
            <Section sectionId="summary" title="Summary" brandColor={brandColor} display={display}>
              {document.summary.split("\n\n").map((paragraph) => (
                <Text key={paragraph.slice(0, 24)} style={styles.paragraph}>
                  {paragraph}
                </Text>
              ))}
            </Section>
          ) : null}

          {document.experience?.length ? (
            <Section sectionId="experience" title="Experience" brandColor={brandColor} display={display}>
              {document.experience.map((job) => (
                <View key={`${job.company}-${job.period}`} style={styles.job}>
                  <View {...PDF_JOB_HEADER_PROPS} style={styles.jobHeader}>
                    <View style={styles.jobTitleRow}>
                      {job.logoSrc ? (
                        <View style={styles.jobLogoContainer}>
                          <PdfCompanyLogo
                            logoSrc={job.logoSrc}
                            name={job.company}
                            style={styles.jobLogo}
                          />
                        </View>
                      ) : null}
                      <Text style={styles.jobTitle}>
                        {job.role} · {job.company}
                      </Text>
                    </View>
                    <Text style={styles.jobMeta}>
                      {job.period}
                      {"\n"}
                      {job.location}
                    </Text>
                  </View>
                  <Text style={styles.paragraph}>{job.description}</Text>
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
              ))}
            </Section>
          ) : null}

          {document.certifications?.length ? (
            <Section sectionId="certifications" title="Certifications" brandColor={brandColor} display={display}>
              {document.certifications.map((certification) => (
                <Text key={`${certification.title}-${certification.date}`} style={styles.paragraph}>
                  <Text style={{ fontWeight: "bold" }}>{certification.title}</Text>
                  {" - "}
                  <Text style={{ color: "#525252" }}>{certification.issuer}</Text>
                  {" ("}
                  <Text style={{ color: "#737373" }}>{certification.date}</Text>
                  {")"}
                  {certification.credentialId ? ` · ID ${certification.credentialId}` : ""}
                </Text>
              ))}
            </Section>
          ) : null}

          {document.interests?.length ? (
            <Section sectionId="interests" title="Interests" brandColor={brandColor} display={display}>
              <Text style={styles.paragraph}>{document.interests.join(" · ")}</Text>
            </Section>
          ) : null}
        </View>
      </View>
    </Page>
  )
}
