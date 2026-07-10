import { EditableText } from "./editable-text"
import { HtmlResumeSection } from "./html-resume-section"
import { toMailtoHref, toTelHref } from "../../contact-link-utils"
import { RESUME_HTML_ROOT_CLASS, type ResumeHtmlLayoutProps } from "./resume-html-props"
import { cn } from "@/lib/utils"

export function ExecutiveHtmlResume({
  document,
  brandColor,
  fontFamily,
  display,
  onChange,
}: ResumeHtmlLayoutProps) {
  return (
    <div
      className={cn(
        "flex min-h-full flex-col px-11 pt-8 pb-14 text-[10px] leading-[1.45] text-neutral-900",
        RESUME_HTML_ROOT_CLASS,
      )}
      style={{ fontFamily }}
    >
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
        <HtmlResumeSection sectionId="summary" title="Summary" brandColor={brandColor} display={display} variant="plain">
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
        </HtmlResumeSection>
      ) : null}

      {document.experience?.length ? (
        <HtmlResumeSection sectionId="experience" title="Experience" brandColor={brandColor} display={display} variant="plain">
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
        </HtmlResumeSection>
      ) : null}

      {document.education ? (
        <HtmlResumeSection sectionId="education" title="Education" brandColor={brandColor} display={display} variant="plain">
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
        </HtmlResumeSection>
      ) : null}

      {document.skills?.length ? (
        <HtmlResumeSection sectionId="skills" title="Skills" brandColor={brandColor} display={display} variant="plain">
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
        </HtmlResumeSection>
      ) : null}

      {document.certifications?.length ? (
        <HtmlResumeSection sectionId="certifications" title="Certifications" brandColor={brandColor} display={display} variant="plain">
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
              {" - "}
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
        </HtmlResumeSection>
      ) : null}

      {document.languages?.length ? (
        <HtmlResumeSection sectionId="languages" title="Languages" brandColor={brandColor} display={display} variant="plain">
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
              {" - "}
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
        </HtmlResumeSection>
      ) : null}

      {document.interests?.length ? (
        <HtmlResumeSection sectionId="interests" title="Interests" brandColor={brandColor} display={display} variant="plain">
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
        </HtmlResumeSection>
      ) : null}

      {document.contact ? (
        <HtmlResumeSection sectionId="contact" title="Contact" brandColor={brandColor} display={display} variant="plain">
          <p className="mb-0.5 text-neutral-800">
            {onChange ? (
              <>
                <span className="max-sm:hidden">
                  <EditableText
                    value={document.contact.email}
                    onChange={(val) =>
                      onChange({
                        ...document,
                        contact: { ...document.contact!, email: val },
                      })
                    }
                    placeholder="Email"
                  />
                </span>
                <a
                  href={toMailtoHref(document.contact.email)}
                  className="no-underline hover:underline sm:hidden"
                >
                  {document.contact.email}
                </a>
              </>
            ) : (
              <a href={toMailtoHref(document.contact.email)} className="no-underline hover:underline">
                {document.contact.email}
              </a>
            )}
          </p>
          <p className="mb-0.5 text-neutral-800">
            {onChange ? (
              <>
                <span className="max-sm:hidden">
                  <EditableText
                    value={document.contact.phone}
                    onChange={(val) =>
                      onChange({
                        ...document,
                        contact: { ...document.contact!, phone: val },
                      })
                    }
                    placeholder="Phone"
                  />
                </span>
                <a
                  href={toTelHref(document.contact.phone)}
                  className="no-underline hover:underline sm:hidden"
                >
                  {document.contact.phone}
                </a>
              </>
            ) : (
              <a href={toTelHref(document.contact.phone)} className="no-underline hover:underline">
                {document.contact.phone}
              </a>
            )}
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
        </HtmlResumeSection>
      ) : null}
      <footer className="mt-auto flex items-center justify-between border-t border-neutral-200 pt-2.5">
        <span className="text-[8px] text-neutral-500">
          {document.name} · {document.title}
        </span>
      </footer>
    </div>
  )
}
