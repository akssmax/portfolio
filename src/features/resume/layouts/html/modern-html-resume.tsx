import type { ResumeDocument } from "../../types"
import { EditableText } from "./editable-text"
import { CompanyLogo } from "@/components/shared/company-logo"

type ModernHtmlResumeProps = {
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
    <section className="mb-4">
      <div className="mb-2 flex items-center gap-2">
        <span
          className="h-[3px] w-3 rounded-full"
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

export function ModernHtmlResume({ document, brandColor, onChange }: ModernHtmlResumeProps) {
  return (
    <div className="px-10 py-9 text-[10px] leading-[1.45] text-neutral-900 flex flex-col min-h-full">
      <header
        className="mb-5 border-b pb-3 flex justify-between items-start gap-4"
        style={{ borderBottomColor: brandColor }}
      >
        <div className="min-w-0 flex-1">
          <EditableText
            value={document.name}
            onChange={onChange ? (val) => onChange({ ...document, name: val }) : undefined}
            tagName="h1"
            className="text-[22px] font-bold leading-tight text-[#0F1923]"
            placeholder="Your Name"
          />
          <EditableText
            value={document.title}
            onChange={onChange ? (val) => onChange({ ...document, title: val }) : undefined}
            tagName="p"
            className="text-[11px] font-semibold mt-1"
            style={{ color: brandColor }}
            placeholder="Professional Title"
          />
          <EditableText
            value={document.location}
            onChange={onChange ? (val) => onChange({ ...document, location: val }) : undefined}
            tagName="p"
            className="text-[9px] text-neutral-500 mt-0.5"
            placeholder="Location"
          />
        </div>
        {document.portrait ? (
          <div className="shrink-0">
            <img
              src={document.portrait.src}
              alt={document.name}
              className="size-16 rounded-lg object-cover border"
              style={{ borderColor: brandColor }}
            />
          </div>
        ) : null}
      </header>

      <div className="flex-1 flex gap-6">
        {/* Left Column - Contact, Skills, Education, Languages */}
        <aside className="w-[180px] shrink-0 flex flex-col gap-4 border-r border-neutral-100 pr-5">
          {document.contact ? (
            <Section title="Contact" brandColor={brandColor}>
              <div className="flex flex-col gap-1.5 text-[8.5px] text-neutral-800">
                <p>
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
                <p>
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
                  ) : (
                    <a
                      href={document.contact.website}
                      className="hover:underline truncate block"
                      style={{ color: brandColor }}
                    >
                      {document.contact.website.replace(/^https?:\/\/(www\.)?/, "")}
                    </a>
                  )
                ) : null}
                {document.contact.linkedin ? (
                  onChange ? (
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
                  ) : (
                    <a
                      href={document.contact.linkedin}
                      className="hover:underline truncate block"
                      style={{ color: brandColor }}
                    >
                      {document.contact.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
                    </a>
                  )
                ) : null}
                {document.contact.github ? (
                  onChange ? (
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
                  ) : (
                    <a
                      href={document.contact.github}
                      className="hover:underline truncate block"
                      style={{ color: brandColor }}
                    >
                      {document.contact.github.replace(/^https?:\/\/(www\.)?/, "")}
                    </a>
                  )
                ) : null}
              </div>
            </Section>
          ) : null}

          {document.skills?.length ? (
            <Section title="Skills" brandColor={brandColor}>
              <div className="flex flex-wrap gap-1">
                {document.skills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="rounded-md border px-1.5 py-0.5 text-[8px] text-neutral-800 bg-neutral-50/50 border-neutral-200"
                  >
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
                  </span>
                ))}
              </div>
            </Section>
          ) : null}

          {document.education ? (
            <Section title="Education" brandColor={brandColor}>
              <div className="text-[8.5px] text-neutral-800">
                <p className="font-semibold">
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
                </p>
                <p className="text-neutral-500">
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
                </p>
                <p className="text-neutral-400">
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
                </p>
              </div>
            </Section>
          ) : null}

          {document.languages?.length ? (
            <Section title="Languages" brandColor={brandColor}>
              <div className="flex flex-col gap-1 text-[8.5px] text-neutral-800">
                {document.languages.map((language, lIdx) => (
                  <div key={lIdx} className="flex justify-between gap-1">
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
                      className="font-medium"
                      placeholder="Language"
                    />
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
                      className="text-neutral-500 text-right"
                      placeholder="Level"
                    />
                  </div>
                ))}
              </div>
            </Section>
          ) : null}
        </aside>

        {/* Right Column - Summary, Experience, Certifications, Interests */}
        <main className="flex-1 min-w-0 flex flex-col gap-4">
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
              <div className="flex flex-col gap-3">
                {document.experience.map((job, jobIdx) => (
                  <article key={jobIdx}>
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        {job.logoSrc ? (
                          <CompanyLogo
                            src={job.logoSrc}
                            name={job.company}
                            className="size-6 rounded-md p-0.5 bg-white border border-neutral-200 text-neutral-900"
                          />
                        ) : null}
                        <p className="font-bold text-neutral-900 truncate">
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
                      </div>
                      <div className="text-right text-[8.5px] text-neutral-500 shrink-0">
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
                      className="text-neutral-800 mb-1"
                      placeholder="Job description"
                    />
                    {job.highlights?.length ? (
                      <ul className="list-disc pl-3 text-neutral-800 space-y-0.5">
                        {job.highlights.map((highlight, hIdx) => (
                          <li key={hIdx}>
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
              </div>
            </Section>
          ) : null}

          {document.certifications?.length ? (
            <Section title="Certifications" brandColor={brandColor}>
              <div className="flex flex-col gap-1.5">
                {document.certifications.map((certification, cIdx) => (
                  <div key={cIdx} className="text-neutral-800">
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
                      className="font-medium"
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
                      className="text-neutral-600"
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
                      className="text-neutral-500"
                      placeholder="Date"
                    />
                    {")"}
                  </div>
                ))}
              </div>
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
        </main>
      </div>
    </div>
  )
}
