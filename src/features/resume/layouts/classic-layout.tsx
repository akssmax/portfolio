import type { ReactNode } from "react"
import { Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer"

import type { ResumeDocument } from "../types"

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 44,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.45,
    color: "#171717",
  },
  header: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
  },
  headerLine: {
    paddingBottom: 8,
  },
  name: {
    fontSize: 22,
    fontWeight: 700,
  },
  title: {
    fontSize: 12,
  },
  meta: {
    fontSize: 9,
    color: "#525252",
  },
  sectionTitleWrap: {
    paddingBottom: 6,
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  paragraph: {
    marginBottom: 4,
    color: "#262626",
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
  jobTitle: {
    fontSize: 10.5,
    fontWeight: 700,
  },
  jobMeta: {
    fontSize: 9,
    color: "#525252",
    textAlign: "right",
  },
  bulletList: {
    marginTop: 4,
    paddingLeft: 10,
  },
  bulletItem: {
    marginBottom: 2,
    color: "#262626",
  },
  skillLine: {
    marginBottom: 3,
    color: "#262626",
  },
  contactLine: {
    marginBottom: 3,
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
      <View style={styles.sectionTitleWrap}>
        <Text style={[styles.sectionTitle, { color: brandColor }]}>{title}</Text>
      </View>
      {children}
    </View>
  )
}

export function ClassicResumeLayout({
  document,
  brandColor,
}: {
  document: ResumeDocument
  brandColor: string
}) {
  return (
    <Page size="A4" style={styles.page}>
      <View style={[styles.header, { borderBottomColor: brandColor }]}>
        <View style={styles.headerLine}>
          <Text style={[styles.name, { color: brandColor }]}>{document.name}</Text>
        </View>
        <View style={styles.headerLine}>
          <Text style={styles.title}>{document.title}</Text>
        </View>
        <View>
          <Text style={styles.meta}>{document.location}</Text>
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
            <View key={`${job.company}-${job.period}`} style={styles.job}>
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
