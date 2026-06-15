import { CompanyLogo } from "@/components/shared/company-logo"

import { cssColorWithAlpha } from "../../color-utils"
import type { ResumeDocument } from "../../types"
import { HtmlLogomark } from "./html-logomark"
import { ResumePortraitImage } from "./resume-portrait-image"

function formatWebsiteLabel(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "")
}

type DesignerHtmlResumeProps = {
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
    <section className="mb-4">
      <div className="mb-2 flex items-center gap-2">
        <span
          className="h-[3px] w-3.5 rounded-full"
          style={{ backgroundColor: brandColor }}
        />
        <h2 className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#0F1923]">
          {title}
        </h2>
      </div>
      {children}
    </section>
  )
}

export function DesignerHtmlResume({ document, brandColor }: DesignerHtmlResumeProps) {
  const tint = cssColorWithAlpha(brandColor, 0.08)
  const pillBackground = cssColorWithAlpha(brandColor, 0.12)
  const pillBorder = cssColorWithAlpha(brandColor, 0.25)

  return (
    <div className="flex min-h-full text-[10px] leading-[1.45] text-neutral-900">
      <aside className="relative flex w-[52px] shrink-0 flex-col items-center pt-9">
        <span
          className="absolute inset-y-0 left-0 w-2"
          style={{ backgroundColor: brandColor }}
        />
      </aside>

      <div className="min-w-0 flex-1 pb-9 pl-2 pr-10 pt-[34px]">
        <header
          className="mb-5 rounded-lg p-3.5"
          style={{ backgroundColor: tint }}
        >
          <div className="mb-2.5 flex items-start gap-3">
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="pb-2">
                <h1 className="text-2xl font-bold leading-tight text-[#0F1923]">
                  {document.name}
                </h1>
              </div>
              <div className="pb-2">
                <p className="text-[11px] font-bold" style={{ color: brandColor }}>
                  {document.title}
                </p>
              </div>
              <p className="text-[9px] text-neutral-500">{document.location}</p>
            </div>
            {document.portrait ? (
              <ResumePortraitImage
                src={document.portrait.src}
                shape={document.portrait.shape}
                alt={`${document.name} portrait`}
              />
            ) : null}
          </div>

          {document.contact ? (
            <div className="flex flex-wrap gap-1.5">
              <span
                className="rounded-full px-2 py-1 text-[8.5px]"
                style={{ backgroundColor: pillBackground, color: brandColor }}
              >
                {document.contact.email}
              </span>
              <span
                className="rounded-full px-2 py-1 text-[8.5px]"
                style={{ backgroundColor: pillBackground, color: brandColor }}
              >
                {document.contact.phone}
              </span>
              {document.contact.website ? (
                <span
                  className="rounded-full px-2 py-1 text-[8.5px]"
                  style={{ backgroundColor: pillBackground, color: brandColor }}
                >
                  {formatWebsiteLabel(document.contact.website)}
                </span>
              ) : null}
            </div>
          ) : null}
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
              <article
                key={`${job.company}-${job.period}`}
                className="mb-3 pl-2.5"
                style={{ borderLeft: `2px solid ${brandColor}` }}
              >
                <div className="flex items-start justify-between gap-3 pb-1">
                  <div className="flex min-w-0 items-center gap-2">
                    <CompanyLogo
                      src={job.logoSrc}
                      name={job.company}
                      className="size-7 rounded-md p-1"
                    />
                    <p className="text-[10.5px] font-bold text-neutral-900">
                      {job.role} · {job.company}
                    </p>
                  </div>
                  <p className="text-right text-[8.5px] text-neutral-500">
                    {job.period}
                    <br />
                    {job.location}
                  </p>
                </div>
                <p className="mb-1 text-neutral-800">{job.description}</p>
                {job.highlights?.length ? (
                  <ul className="mt-1 space-y-0.5 pl-2 text-[9.5px] text-neutral-700">
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
            <div className="flex flex-wrap gap-1.5">
              {document.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border px-2 py-1 text-[8.5px] text-neutral-800"
                  style={{
                    backgroundColor: pillBackground,
                    borderColor: pillBorder,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
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
            <div className="flex flex-wrap gap-1.5">
              {document.interests.map((interest) => (
                <span
                  key={interest}
                  className="rounded-full border px-2 py-1 text-[8.5px] text-neutral-800"
                  style={{
                    backgroundColor: pillBackground,
                    borderColor: pillBorder,
                  }}
                >
                  {interest}
                </span>
              ))}
            </div>
          </Section>
        ) : null}

        {document.contact ? (
          <Section title="Links" brandColor={brandColor}>
            {document.contact.website ? (
              <a
                href={document.contact.website}
                className="mb-1 block no-underline"
                style={{ color: brandColor }}
              >
                {document.contact.website}
              </a>
            ) : null}
            {document.contact.linkedin ? (
              <a
                href={document.contact.linkedin}
                className="mb-1 block no-underline"
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

        <footer className="mt-2 flex items-center justify-between border-t border-neutral-200 pt-2.5">
          <HtmlLogomark brandColor={brandColor} width={18} />
          <p className="text-[8px] text-neutral-500">Akshay Saini · Design Engineer</p>
        </footer>
      </div>
    </div>
  )
}
