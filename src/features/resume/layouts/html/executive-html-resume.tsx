import type { ResumeDocument } from "../../types"
import { EditableText } from "./editable-text"

type ExecutiveHtmlResumeProps = {
  document: ResumeDocument
  brandColor: string
  onChange?: (updated: ResumeDocument) => void
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
        className="mb-2 border-b border-neutral-200 pb-1.5 text-[10px] font-bold uppercase tracking-[0.12em]"
        style={{ color: brandColor }}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}

export function ExecutiveHtmlResume({ document, brandColor, onChange }: ExecutiveHtmlResumeProps) {
  return (
    <div className="flex min-h-full flex-col px-11 pt-8 pb-14 text-[10px] leading-[1.45] text-neutral-900">
      <header
        className="mb-[18px] rounded px-4 py-3.5"
        style={{ backgroundColor: brandColor }}
      >
        <div className="pb-1">
          <EditableText
            value={document.name}
            onChange={onChange ? (val) => onChange({ ...document, name: val }) : undefined}
            tagName="h1"
            className="text-2xl font-bold leading-tight text-white"
            placeholder="Your Name"
          />
        </div>
        <div className="pb-1">
          <EditableText
            value={document.title}
            onChange={onChange ? (val) => onChange({ ...document, title: val }) : undefined}
            tagName="p"
            className="text-xs font-bold text-white"
            placeholder="Professional Title"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1 text-[9px] text-white/85">
          <EditableText
            value={document.location}
            onChange={onChange ? (val) => onChange({ ...document, location: val }) : undefined}
            placeholder="Location"
          />
          {document.contact?.website ? (
            <>
              <span className="text-white/50 select-none">·</span>
              <a
                href={document.contact.website}
                className="hover:underline text-white/85"
                target="_blank"
                rel="noreferrer"
              >
                {document.contact.website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
              </a>
            </>
          ) : null}
        </div>
      </header>

      {document.summary ? (
        <Section title="Summary" brandColor={brandColor}>
          {document.summary.split("\n\n").map((paragraph, idx) => (
            <EditableText
              key={idx}
              value={paragraph}
              onChange={
                onChange
                  ? (val) => {
                      const paragraphs = document.summary!.split("\n\n")
                      paragraphs[idx] = val
                      onChange({ ...document, summary: paragraphs.join("\n\n") })
                    }
                  : undefined
              }
              tagName="p"
              singleLine={false}
              className="mb-1 text-neutral-800"
              placeholder="Summary paragraph"
            />
          ))}
        </Section>
      ) : null}

      {document.experience?.length ? (
        <Section title="Experience" brandColor={brandColor}>
          {document.experience.map((job, jobIdx) => (
            <article key={`${job.company}-${job.period}-${jobIdx}`} className="mb-2.5">
              <div className="flex items-start justify-between gap-3 pb-1">
                <p className="text-[10.5px] font-bold">
                  <EditableText
                    value={job.role}
                    onChange={
                      onChange
                        ? (val) => {
                            const newExp = [...document.experience!]
                            newExp[jobIdx] = { ...job, role: val }
                            onChange({ ...document, experience: newExp })
                          }
                        : undefined
                    }
                    placeholder="Role"
                  />
                  {" · "}
                  <EditableText
                    value={job.company}
                    onChange={
                      onChange
                        ? (val) => {
                            const newExp = [...document.experience!]
                            newExp[jobIdx] = { ...job, company: val }
                            onChange({ ...document, experience: newExp })
                          }
                        : undefined
                    }
                    placeholder="Company"
                  />
                </p>
                <div className="text-right text-[9px] text-neutral-600">
                  <EditableText
                    value={job.period}
                    onChange={
                      onChange
                        ? (val) => {
                            const newExp = [...document.experience!]
                            newExp[jobIdx] = { ...job, period: val }
                            onChange({ ...document, experience: newExp })
                          }
                        : undefined
                    }
                    placeholder="Period"
                  />
                  <br />
                  <EditableText
                    value={job.location}
                    onChange={
                      onChange
                        ? (val) => {
                            const newExp = [...document.experience!]
                            newExp[jobIdx] = { ...job, location: val }
                            onChange({ ...document, experience: newExp })
                          }
                        : undefined
                    }
                    placeholder="Location"
                  />
                </div>
              </div>
              <EditableText
                value={job.description}
                onChange={
                  onChange
                    ? (val) => {
                        const newExp = [...document.experience!]
                        newExp[jobIdx] = { ...job, description: val }
                        onChange({ ...document, experience: newExp })
                      }
                    : undefined
                }
                tagName="p"
                singleLine={false}
                className="mb-1 text-neutral-800"
                placeholder="Job description"
              />
              {job.highlights?.length ? (
                <ul className="mt-1 space-y-0.5 pl-2.5 text-neutral-800">
                  {job.highlights.map((highlight, hIdx) => (
                    <li key={hIdx}>
                      •{" "}
                      <EditableText
                        value={highlight}
                        onChange={
                          onChange
                            ? (val) => {
                                const newHighlights = [...job.highlights!]
                                newHighlights[hIdx] = val
                                const newExp = [...document.experience!]
                                newExp[jobIdx] = { ...job, highlights: newHighlights }
                                onChange({ ...document, experience: newExp })
                              }
                            : undefined
                        }
                        placeholder="Highlight"
                      />
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </Section>
      ) : null}

      {document.education ? (
        <Section title="Education" brandColor={brandColor}>
          <div className="text-neutral-800">
            <EditableText
              value={document.education.degree}
              onChange={
                onChange
                  ? (val) =>
                      onChange({
                        ...document,
                        education: { ...document.education!, degree: val },
                      })
                  : undefined
              }
              placeholder="Degree"
            />
            <br />
            <EditableText
              value={document.education.school}
              onChange={
                onChange
                  ? (val) =>
                      onChange({
                        ...document,
                        education: { ...document.education!, school: val },
                      })
                  : undefined
              }
              placeholder="School"
            />
            {" · "}
            <EditableText
              value={document.education.years}
              onChange={
                onChange
                  ? (val) =>
                      onChange({
                        ...document,
                        education: { ...document.education!, years: val },
                      })
                  : undefined
              }
              placeholder="Years"
            />
            <br />
            <EditableText
              value={document.education.location}
              onChange={
                onChange
                  ? (val) =>
                      onChange({
                        ...document,
                        education: { ...document.education!, location: val },
                      })
                  : undefined
              }
              placeholder="Location"
            />
          </div>
        </Section>
      ) : null}

      {document.skills?.length ? (
        <Section title="Skills" brandColor={brandColor}>
          {document.skills.map((skill, sIdx) => (
            <p key={sIdx} className="mb-0.5 text-neutral-800">
              <EditableText
                value={skill}
                onChange={
                  onChange
                    ? (val) => {
                        const newSkills = [...document.skills!]
                        newSkills[sIdx] = val
                        onChange({ ...document, skills: newSkills })
                      }
                    : undefined
                }
                placeholder="Skill"
              />
            </p>
          ))}
        </Section>
      ) : null}

      {document.certifications?.length ? (
        <Section title="Certifications" brandColor={brandColor}>
          {document.certifications.map((certification, cIdx) => (
            <p
              key={`${certification.title}-${certification.date}-${cIdx}`}
              className="mb-1 text-neutral-800"
            >
              <EditableText
                value={certification.title}
                onChange={
                  onChange
                    ? (val) => {
                        const newCertifications = [...document.certifications!]
                        newCertifications[cIdx] = { ...certification, title: val }
                        onChange({ ...document, certifications: newCertifications })
                      }
                    : undefined
                }
                placeholder="Certification Title"
              />
              {" — "}
              <EditableText
                value={certification.issuer}
                onChange={
                  onChange
                    ? (val) => {
                        const newCertifications = [...document.certifications!]
                        newCertifications[cIdx] = { ...certification, issuer: val }
                        onChange({ ...document, certifications: newCertifications })
                      }
                    : undefined
                }
                placeholder="Issuer"
              />
              {" ("}
              <EditableText
                value={certification.date}
                onChange={
                  onChange
                    ? (val) => {
                        const newCertifications = [...document.certifications!]
                        newCertifications[cIdx] = { ...certification, date: val }
                        onChange({ ...document, certifications: newCertifications })
                      }
                    : undefined
                }
                placeholder="Date"
              />
              {")"}
              {certification.credentialId || onChange ? (
                <>
                  {" · ID "}
                  <EditableText
                    value={certification.credentialId ?? ""}
                    onChange={
                      onChange
                        ? (val) => {
                            const newCertifications = [...document.certifications!]
                            newCertifications[cIdx] = { ...certification, credentialId: val || undefined }
                            onChange({ ...document, certifications: newCertifications })
                          }
                        : undefined
                    }
                    placeholder="Credential ID"
                  />
                </>
              ) : null}
            </p>
          ))}
        </Section>
      ) : null}

      {document.languages?.length ? (
        <Section title="Languages" brandColor={brandColor}>
          {document.languages.map((language, lIdx) => (
            <p key={`${language.name}-${lIdx}`} className="mb-1 text-neutral-800">
              <EditableText
                value={language.name}
                onChange={
                  onChange
                    ? (val) => {
                        const newLanguages = [...document.languages!]
                        newLanguages[lIdx] = { ...language, name: val }
                        onChange({ ...document, languages: newLanguages })
                      }
                    : undefined
                }
                placeholder="Language"
              />
              {" — "}
              <EditableText
                value={language.level}
                onChange={
                  onChange
                    ? (val) => {
                        const newLanguages = [...document.languages!]
                        newLanguages[lIdx] = { ...language, level: val }
                        onChange({ ...document, languages: newLanguages })
                      }
                    : undefined
                }
                placeholder="Level"
              />
            </p>
          ))}
        </Section>
      ) : null}

      {document.interests?.length ? (
        <Section title="Interests" brandColor={brandColor}>
          <p className="text-neutral-800">
            <EditableText
              value={document.interests.join(" · ")}
              onChange={
                onChange
                  ? (val) => {
                      const newInterests = val.split(/\s*·\s*/).filter(Boolean)
                      onChange({ ...document, interests: newInterests })
                    }
                  : undefined
              }
              placeholder="Interest 1 · Interest 2"
            />
          </p>
        </Section>
      ) : null}

      {document.contact ? (
        <Section title="Contact" brandColor={brandColor}>
          <p className="mb-0.5 text-neutral-800">
            <EditableText
              value={document.contact.email}
              onChange={
                onChange
                  ? (val) =>
                      onChange({
                        ...document,
                        contact: { ...document.contact!, email: val },
                      })
                  : undefined
              }
              placeholder="Email"
            />
          </p>
          <p className="mb-0.5 text-neutral-800">
            <EditableText
              value={document.contact.phone}
              onChange={
                onChange
                  ? (val) =>
                      onChange({
                        ...document,
                        contact: { ...document.contact!, phone: val },
                      })
                  : undefined
              }
              placeholder="Phone"
            />
          </p>
          {document.contact.website ? (
            onChange ? (
              <p className="mb-0.5">
                <EditableText
                  value={document.contact.website}
                  onChange={(val) =>
                    onChange({
                      ...document,
                      contact: { ...document.contact!, website: val },
                    })
                  }
                  style={{ color: brandColor }}
                  placeholder="Website"
                />
              </p>
            ) : (
              <a
                href={document.contact.website}
                className="mb-0.5 block no-underline"
                style={{ color: brandColor }}
              >
                {document.contact.website}
              </a>
            )
          ) : null}
          {document.contact.linkedin ? (
            onChange ? (
              <p className="mb-0.5">
                <EditableText
                  value={document.contact.linkedin}
                  onChange={(val) =>
                    onChange({
                      ...document,
                      contact: { ...document.contact!, linkedin: val },
                    })
                  }
                  style={{ color: brandColor }}
                  placeholder="LinkedIn"
                />
              </p>
            ) : (
              <a
                href={document.contact.linkedin}
                className="mb-0.5 block no-underline"
                style={{ color: brandColor }}
              >
                {document.contact.linkedin}
              </a>
            )
          ) : null}
          {document.contact.github ? (
            onChange ? (
              <p className="mb-0.5">
                <EditableText
                  value={document.contact.github}
                  onChange={(val) =>
                    onChange({
                      ...document,
                      contact: { ...document.contact!, github: val },
                    })
                  }
                  style={{ color: brandColor }}
                  placeholder="GitHub"
                />
              </p>
            ) : (
              <a
                href={document.contact.github}
                className="block no-underline"
                style={{ color: brandColor }}
              >
                {document.contact.github}
              </a>
            )
          ) : null}
        </Section>
      ) : null}
      <footer className="mt-auto flex items-center justify-between border-t border-neutral-200 pt-2.5">
        <span className="text-[8px] text-neutral-500">
          {document.name} · {document.title}
        </span>
      </footer>
    </div>
  )
}
