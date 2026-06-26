import type { ReactNode } from "react"
import { Image, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer"

import type { ResumeDocument } from "../types"
import { ResumeLogomark } from "./resume-logomark"
import { PdfCompanyLogo } from "./pdf-company-logo"

const PAGE_MARGIN = {
  paddingTop: 34,
  paddingBottom: 44,
  paddingRight: 40,
  paddingLeft: 40,
} as const

const styles = StyleSheet.create({
  page: {
    position: "relative",
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.45,
    color: "#171717",
    ...PAGE_MARGIN,
  },
  pageFooter: {
    position: "absolute",
    bottom: 22,
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
    marginBottom: 20,
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
  },
  title: {
    fontSize: 11,
    fontWeight: 700,
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
    flex: 1,
    flexDirection: "row",
    gap: 20,
  },
  leftColumn: {
    width: 150,
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: "#E5E5E5",
  },
  rightColumn: {
    flex: 1,
  },
  section: {
    marginBottom: 14,
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
    marginBottom: 10,
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
  title,
  brandColor,
  children,
}: {
  title: string
  brandColor: string
  children: ReactNode
}) {
  return (
    <View style={styles.section}>
      <View wrap={false} minPresenceAhead={40} style={styles.sectionHeader}>
        <View style={{ ...styles.sectionAccent, backgroundColor: brandColor }} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
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
}: {
  document: ResumeDocument
  brandColor: string
}) {
  return (
    <Page size="A4" style={styles.page}>
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
            <Section title="Contact" brandColor={brandColor}>
              <Text style={styles.contactText}>{document.contact.email}</Text>
              <Text style={styles.contactText}>{document.contact.phone}</Text>
              {document.contact.website ? (
                <Link
                  src={document.contact.website}
                  style={{ ...styles.link, color: brandColor }}
                >
                  <Text style={styles.contactText}>
                    {formatWebsiteLabel(document.contact.website)}
                  </Text>
                </Link>
              ) : null}
              {document.contact.linkedin ? (
                <Link
                  src={document.contact.linkedin}
                  style={{ ...styles.link, color: brandColor }}
                >
                  <Text style={styles.contactText}>
                    {formatWebsiteLabel(document.contact.linkedin)}
                  </Text>
                </Link>
              ) : null}
              {document.contact.github ? (
                <Link
                  src={document.contact.github}
                  style={{ ...styles.link, color: brandColor }}
                >
                  <Text style={styles.contactText}>
                    {formatWebsiteLabel(document.contact.github)}
                  </Text>
                </Link>
              ) : null}
            </Section>
          ) : null}

          {document.skills?.length ? (
            <Section title="Skills" brandColor={brandColor}>
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
            <Section title="Education" brandColor={brandColor}>
              <View wrap={false} minPresenceAhead={24}>
                <Text style={{ ...styles.educationText, fontWeight: "bold" }}>
                  {document.education.degree}
                </Text>
                <Text style={{ ...styles.educationText, color: "#525252", marginTop: 1 }}>
                  {document.education.school}
                </Text>
                <Text style={{ ...styles.educationText, color: "#737373", marginTop: 1 }}>
                  {document.education.years}
                </Text>
              </View>
            </Section>
          ) : null}

          {document.languages?.length ? (
            <Section title="Languages" brandColor={brandColor}>
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
            <Section title="Summary" brandColor={brandColor}>
              {document.summary.split("\n\n").map((paragraph) => (
                <Text key={paragraph.slice(0, 24)} style={styles.paragraph}>
                  {paragraph}
                </Text>
              ))}
            </Section>
          ) : null}

          {document.experience?.length ? (
            <Section title="Experience" brandColor={brandColor}>
              {document.experience.map((job) => (
                <View
                  key={`${job.company}-${job.period}`}
                  style={styles.job}
                >
                  <View wrap={false} minPresenceAhead={48} style={styles.jobHeader}>
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
            <Section title="Certifications" brandColor={brandColor}>
              {document.certifications.map((certification) => (
                <View
                  key={`${certification.title}-${certification.date}`}
                  wrap={false}
                  minPresenceAhead={24}
                >
                  <Text style={styles.paragraph}>
                    <Text style={{ fontWeight: "bold" }}>{certification.title}</Text>
                    {" — "}
                    <Text style={{ color: "#525252" }}>{certification.issuer}</Text>
                    {" ("}
                    <Text style={{ color: "#737373" }}>{certification.date}</Text>
                    {")"}
                    {certification.credentialId ? ` · ID ${certification.credentialId}` : ""}
                  </Text>
                </View>
              ))}
            </Section>
          ) : null}

          {document.interests?.length ? (
            <Section title="Interests" brandColor={brandColor}>
              <Text style={styles.paragraph}>{document.interests.join(" · ")}</Text>
            </Section>
          ) : null}
        </View>
      </View>
    </Page>
  )
}
