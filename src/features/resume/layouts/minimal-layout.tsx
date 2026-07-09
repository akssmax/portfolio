import type { ReactNode } from "react"
import { Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer"

import { RESUME_SPACING } from "./spacing-tokens"
import {
  DEFAULT_PDF_LAYOUT_PROPS,
  type ResumePdfLayoutProps,
} from "./pdf-layout-props"

const S = RESUME_SPACING.minimal

const styles = StyleSheet.create({
  page: {
    paddingTop: S.page.paddingTop,
    paddingBottom: S.page.paddingBottom,
    paddingLeft: S.page.paddingLeft,
    paddingRight: S.page.paddingRight,
    fontFamily: "Helvetica",
    fontSize: S.fontSize,
    lineHeight: S.lineHeight,
    color: "#171717",
  },
  header: {
    marginBottom: S.headerGap,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  headerLine: {
    paddingBottom: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: 700,
  },
  title: {
    fontSize: 11,
    color: "#404040",
  },
  meta: {
    fontSize: 8.5,
    color: "#737373",
  },
  sectionTitleWrap: {
    paddingBottom: 4,
  },
  section: {
    marginBottom: S.sectionGap,
  },
  sectionTitle: {
    fontSize: 9.5,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  paragraph: {
    marginBottom: 3,
    color: "#262626",
  },
  job: {
    marginBottom: S.jobGap,
  },
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    paddingBottom: 2,
  },
  jobTitle: {
    fontSize: 10,
    fontWeight: 700,
  },
  jobMeta: {
    fontSize: 8.5,
    color: "#737373",
    textAlign: "right",
  },
  bulletList: {
    marginTop: 3,
    paddingLeft: 8,
  },
  bulletItem: {
    marginBottom: 1.5,
    color: "#262626",
  },
  skillLine: {
    marginBottom: 2,
    color: "#262626",
  },
  contactLine: {
    marginBottom: 2,
    color: "#262626",
  },
  link: {
    textDecoration: "none",
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
      <View wrap={false} minPresenceAhead={28} style={styles.sectionTitleWrap}>
        <Text style={[styles.sectionTitle, { color: brandColor }]}>{title}</Text>
      </View>
      {children}
    </View>
  )
}

export function MinimalResumeLayout({
  document,
  brandColor,
  fontFamily = DEFAULT_PDF_LAYOUT_PROPS.fontFamily,
}: ResumePdfLayoutProps) {
  return (
    <Page size="A4" style={[styles.page, { fontFamily }]}>
      <View style={[styles.header, { borderBottomColor: brandColor }]}>
        <View style={styles.headerLine}>
          <Text style={styles.name}>{document.name}</Text>
        </View>
        <View style={styles.headerLine}>
          <Text style={[styles.title, { color: brandColor }]}>{document.title}</Text>
        </View>
        <View>
          <Text style={styles.meta}>
            {document.location}
            {document.contact?.website
              ? `  ·  ${document.contact.website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}`
              : ""}
          </Text>
        </View>
      </View>

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
              wrap={false}
              minPresenceAhead={56}
            >
              <View style={styles.jobHeader}>
                <Text style={styles.jobTitle}>
                  {job.role} · {job.company}
                </Text>
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

      {document.education ? (
        <Section title="Education" brandColor={brandColor}>
          <Text style={styles.paragraph}>
            {document.education.degree}
            {"\n"}
            {document.education.school} · {document.education.years}
            {"\n"}
            {document.education.location}
          </Text>
        </Section>
      ) : null}

      {document.skills?.length ? (
        <Section title="Skills" brandColor={brandColor}>
          {document.skills.map((skill) => (
            <Text key={skill} style={styles.skillLine}>
              {skill}
            </Text>
          ))}
        </Section>
      ) : null}

      {document.certifications?.length ? (
        <Section title="Certifications" brandColor={brandColor}>
          {document.certifications.map((certification) => (
            <Text
              key={`${certification.title}-${certification.date}`}
              style={styles.paragraph}
            >
              {certification.title} — {certification.issuer} ({certification.date})
              {certification.credentialId
                ? ` · ID ${certification.credentialId}`
                : ""}
            </Text>
          ))}
        </Section>
      ) : null}

      {document.languages?.length ? (
        <Section title="Languages" brandColor={brandColor}>
          {document.languages.map((language) => (
            <Text key={language.name} style={styles.paragraph}>
              {language.name} — {language.level}
            </Text>
          ))}
        </Section>
      ) : null}

      {document.interests?.length ? (
        <Section title="Interests" brandColor={brandColor}>
          <Text style={styles.paragraph}>{document.interests.join(" · ")}</Text>
        </Section>
      ) : null}

      {document.contact ? (
        <Section title="Contact" brandColor={brandColor}>
          <Text style={styles.contactLine}>{document.contact.email}</Text>
          <Text style={styles.contactLine}>{document.contact.phone}</Text>
          {document.contact.website ? (
            <Link
              src={document.contact.website}
              style={[styles.link, { color: brandColor }]}
            >
              <Text>{document.contact.website}</Text>
            </Link>
          ) : null}
          {document.contact.linkedin ? (
            <Link
              src={document.contact.linkedin}
              style={[styles.link, { color: brandColor }]}
            >
              <Text>{document.contact.linkedin}</Text>
            </Link>
          ) : null}
          {document.contact.github ? (
            <Link
              src={document.contact.github}
              style={[styles.link, { color: brandColor }]}
            >
              <Text>{document.contact.github}</Text>
            </Link>
          ) : null}
        </Section>
      ) : null}
    </Page>
  )
}
