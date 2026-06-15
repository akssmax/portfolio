import type { ResumeDocument } from "../../types"

type ClassicHtmlResumeProps = {
  document: ResumeDocument
  brandColor: string
}

function Section({
  title,
  brandColor,
  children,
}: {
  title: string
  brandColor: string
  children: React.ReactNode
}) {
  return (
    <section className="mb-3.5">
      <h2
        className="pb-1.5 text-[11px] font-bold uppercase tracking-wide"
        style={{ color: brandColor }}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}

export function ClassicHtmlResume({ document, brandColor }: ClassicHtmlResumeProps) {
  return (
    <div className="px-11 py-10 text-[10px] leading-[1.45] text-neutral-900">
      <header
        className="mb-4 border-b-2 pb-3"
        style={{ borderBottomColor: brandColor }}
      >
        <div className="pb-2">
          <h1
            className="text-[22px] font-bold leading-tight"
            style={{ color: brandColor }}
          >
            {document.name}
          </h1>
        </div>
        <div className="pb-2">
          <p className="text-xs">{document.title}</p>
        </div>
        <p className="text-[9px] text-neutral-600">{document.location}</p>
      </header>

      {document.summary ? (
        <Section title="Summary" brandColor={brandColor}>
          {document.summary.split("\n\n").map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="mb-1 text-neutral-800">
              {paragraph}
            </p>
          ))}
        </Section>
      ) : null}

      {document.experience?.length ? (
        <Section title="Experience" brandColor={brandColor}>
          {document.experience.map((job) => (
            <article key={`${job.company}-${job.period}`} className="mb-2.5">
              <div className="flex items-start justify-between gap-3 pb-1">
                <p className="text-[10.5px] font-bold">
                  {job.role} · {job.company}
                </p>
                <p className="text-right text-[9px] text-neutral-600">
                  {job.period}
                  <br />
                  {job.location}
                </p>
              </div>
              <p className="mb-1 text-neutral-800">{job.description}</p>
              {job.highlights?.length ? (
                <ul className="mt-1 space-y-0.5 pl-2.5 text-neutral-800">
                  {job.highlights.map((highlight) => (
                    <li key={highlight}>• {highlight}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </Section>
      ) : null}

      {document.education ? (
        <Section title="Education" brandColor={brandColor}>
          <p className="text-neutral-800">
            {document.education.degree}
            <br />
            {document.education.school} · {document.education.years}
            <br />
            {document.education.location}
          </p>
        </Section>
      ) : null}

      {document.skills?.length ? (
        <Section title="Skills" brandColor={brandColor}>
          {document.skills.map((skill) => (
            <p key={skill} className="mb-0.5 text-neutral-800">
              {skill}
            </p>
          ))}
        </Section>
      ) : null}

      {document.certifications?.length ? (
        <Section title="Certifications" brandColor={brandColor}>
          {document.certifications.map((certification) => (
            <p
              key={`${certification.title}-${certification.date}`}
              className="mb-1 text-neutral-800"
            >
              {certification.title} — {certification.issuer} ({certification.date})
              {certification.credentialId
                ? ` · ID ${certification.credentialId}`
                : ""}
            </p>
          ))}
        </Section>
      ) : null}

      {document.languages?.length ? (
        <Section title="Languages" brandColor={brandColor}>
          {document.languages.map((language) => (
            <p key={language.name} className="mb-1 text-neutral-800">
              {language.name} — {language.level}
            </p>
          ))}
        </Section>
      ) : null}

      {document.interests?.length ? (
        <Section title="Interests" brandColor={brandColor}>
          <p className="text-neutral-800">{document.interests.join(" · ")}</p>
        </Section>
      ) : null}

      {document.contact ? (
        <Section title="Contact" brandColor={brandColor}>
          <p className="mb-0.5 text-neutral-800">{document.contact.email}</p>
          <p className="mb-0.5 text-neutral-800">{document.contact.phone}</p>
          {document.contact.website ? (
            <a
              href={document.contact.website}
              className="mb-0.5 block no-underline"
              style={{ color: brandColor }}
            >
              {document.contact.website}
            </a>
          ) : null}
          {document.contact.linkedin ? (
            <a
              href={document.contact.linkedin}
              className="block no-underline"
              style={{ color: brandColor }}
            >
              {document.contact.linkedin}
            </a>
          ) : null}
          {document.contact.github ? (
            <a
              href={document.contact.github}
              className="block no-underline"
              style={{ color: brandColor }}
            >
              {document.contact.github}
            </a>
          ) : null}
        </Section>
      ) : null}
    </div>
  )
}
