import { EditableText } from "./editable-text"
import { HtmlResumeSection } from "./html-resume-section"
import type { ResumeHtmlLayoutProps } from "./resume-html-props"

export function MinimalHtmlResume({
  document,
  brandColor,
  fontFamily,
  display,
  onChange,
}: ResumeHtmlLayoutProps) {
  return (
    <div
      className="px-12 py-9 text-[10px] leading-[1.4] text-neutral-900"
      style={{ fontFamily }}
    >
      <header
        className="mb-3.5 border-b pb-2.5"
        style={{ borderBottomColor: brandColor }}
      >
        <div className="pb-1">
          <EditableText
            value={document.name}
            onChange={onChange ? (val) => onChange({ ...document, name: val }) : undefined}
            tagName="h1"
            className="text-xl font-bold leading-tight text-neutral-900"
            placeholder="Your Name"
          />
        </div>
        <div className="pb-1">
          <EditableText
            value={document.title}
            onChange={onChange ? (val) => onChange({ ...document, title: val }) : undefined}
            tagName="p"
            className="text-[11px]"
            style={{ color: brandColor }}
            placeholder="Professional Title"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1 text-[9px] text-neutral-600">
          <EditableText
            value={document.location}
            onChange={onChange ? (val) => onChange({ ...document, location: val }) : undefined}
            placeholder="Location"
          />
          {document.contact?.website ? (
            <>
              <span className="text-neutral-400 select-none">·</span>
              <a
                href={document.contact.website}
                className="hover:underline"
                style={{ color: brandColor }}
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
        </HtmlResumeSection>
      ) : null}
    </div>
  )
}
