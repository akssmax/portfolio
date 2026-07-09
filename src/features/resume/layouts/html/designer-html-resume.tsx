import { CompanyLogo } from "@/components/shared/company-logo"

import { cssColorWithAlpha } from "../../color-utils"
import { HtmlLogomark } from "./html-logomark"
import { ResumePortraitImage } from "./resume-portrait-image"
import { EditableText } from "./editable-text"
import { HtmlResumeSection } from "./html-resume-section"
import type { ResumeHtmlLayoutProps } from "./resume-html-props"

function formatWebsiteLabel(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "")
}

export function DesignerHtmlResume({
  document,
  brandColor,
  fontFamily,
  display,
  onChange,
}: ResumeHtmlLayoutProps) {
  const tint = cssColorWithAlpha(brandColor, 0.08)
  const pillBackground = cssColorWithAlpha(brandColor, 0.12)
  const pillBorder = cssColorWithAlpha(brandColor, 0.25)

  return (
    <div
      className="flex min-h-full text-[10px] leading-[1.45] text-neutral-900"
      style={{ fontFamily }}
    >
      <aside className="relative flex w-[52px] shrink-0 flex-col items-center pt-9">
        <span
          className="absolute inset-y-0 left-0 w-2"
          style={{ backgroundColor: brandColor }}
        />
      </aside>

      <div className="min-w-0 flex-1 pb-14 pl-2 pr-10 pt-[34px]">
        <header
          className="mb-4 rounded-lg p-3.5"
          style={{ backgroundColor: tint }}
        >
          <div className="mb-2.5 flex items-start gap-3">
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="pb-2">
                <EditableText
                  value={document.name}
                  onChange={onChange ? (val) => onChange({ ...document, name: val }) : undefined}
                  tagName="h1"
                  className="text-2xl font-bold leading-tight text-[#0F1923]"
                  placeholder="Your Name"
                />
              </div>
              <div className="pb-2">
                <EditableText
                  value={document.title}
                  onChange={onChange ? (val) => onChange({ ...document, title: val }) : undefined}
                  tagName="p"
                  className="text-[11px] font-bold"
                  style={{ color: brandColor }}
                  placeholder="Professional Title"
                />
              </div>
              <EditableText
                value={document.location}
                onChange={onChange ? (val) => onChange({ ...document, location: val }) : undefined}
                tagName="p"
                className="text-[9px] text-neutral-500"
                placeholder="Location"
              />
            </div>
            {document.portrait ? (
              <ResumePortraitImage
                src={document.portrait.src}
                shape={document.portrait.shape}
                alt={`${document.name} portrait`}
                brandColor={brandColor}
              />
            ) : null}
          </div>

          {document.contact ? (
            <div className="flex flex-wrap gap-1.5">
              <span
                className="rounded-full px-2 py-1 text-[8.5px]"
                style={{ backgroundColor: pillBackground, color: brandColor }}
              >
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
              </span>
              <span
                className="rounded-full px-2 py-1 text-[8.5px]"
                style={{ backgroundColor: pillBackground, color: brandColor }}
              >
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
              </span>
              {document.contact.website ? (
                <span
                  className="rounded-full px-2 py-1 text-[8.5px]"
                  style={{ backgroundColor: pillBackground, color: brandColor }}
                >
                  <EditableText
                    value={document.contact.website}
                    onChange={
                      onChange
                        ? (val) =>
                            onChange({
                              ...document,
                              contact: { ...document.contact!, website: val },
                            })
                        : undefined
                    }
                    placeholder="Website"
                  />
                </span>
              ) : null}
            </div>
          ) : null}
        </header>

        {document.summary ? (
          <HtmlResumeSection sectionId="summary" title="Summary" brandColor={brandColor} display={display}>
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
          <HtmlResumeSection sectionId="experience" title="Experience" brandColor={brandColor} display={display}>
            {document.experience.map((job, jobIdx) => (
              <article
                key={`${job.company}-${job.period}-${jobIdx}`}
                className="mb-3 pl-2.5"
                style={{ borderLeft: `2px solid ${brandColor}` }}
              >
                <div className="flex items-start justify-between gap-3 pb-1">
                  <div className="flex min-w-0 items-center gap-2">
                    <CompanyLogo
                      src={job.logoSrc}
                      name={job.company}
                      className="size-7 rounded-md p-1 bg-white border border-neutral-200 text-neutral-900"
                    />
                    <p className="text-[10.5px] font-bold text-neutral-900">
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
                  <div className="text-right text-[8.5px] text-neutral-500">
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
                  <ul className="mt-1 space-y-0.5 pl-2 text-[9.5px] text-neutral-700">
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
          <HtmlResumeSection sectionId="education" title="Education" brandColor={brandColor} display={display}>
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
          <HtmlResumeSection sectionId="skills" title="Skills" brandColor={brandColor} display={display}>
            <div className="flex flex-wrap gap-1.5">
              {document.skills.map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="rounded-full border px-2 py-1 text-[8.5px] text-neutral-800"
                  style={{
                    backgroundColor: pillBackground,
                    borderColor: pillBorder,
                  }}
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
          </HtmlResumeSection>
        ) : null}

        {document.certifications?.length ? (
          <HtmlResumeSection sectionId="certifications" title="Certifications" brandColor={brandColor} display={display}>
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
          <HtmlResumeSection sectionId="languages" title="Languages" brandColor={brandColor} display={display}>
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
          <HtmlResumeSection sectionId="interests" title="Interests" brandColor={brandColor} display={display}>
            <div className="flex flex-wrap gap-1.5">
              {document.interests.map((interest, iIdx) => (
                <span
                  key={iIdx}
                  className="rounded-full border px-2 py-1 text-[8.5px] text-neutral-800"
                  style={{
                    backgroundColor: pillBackground,
                    borderColor: pillBorder,
                  }}
                >
                  <EditableText
                    value={interest}
                    onChange={
                      onChange
                        ? (val) => {
                            const newInterests = [...document.interests!]
                            newInterests[iIdx] = val
                            onChange({ ...document, interests: newInterests })
                          }
                        : undefined
                    }
                    placeholder="Interest"
                  />
                </span>
              ))}
            </div>
          </HtmlResumeSection>
        ) : null}

        {document.contact ? (
          <HtmlResumeSection sectionId="contact" title="Links" brandColor={brandColor} display={display}>
            {document.contact.website ? (
              onChange ? (
                <p className="mb-1">
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
                  className="mb-1 block no-underline"
                  style={{ color: brandColor }}
                >
                  {formatWebsiteLabel(document.contact.website)}
                </a>
              )
            ) : null}
            {document.contact.linkedin ? (
              onChange ? (
                <p className="mb-1">
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
                  className="mb-1 block no-underline"
                  style={{ color: brandColor }}
                >
                  {document.contact.linkedin}
                </a>
              )
            ) : null}
            {document.contact.github ? (
              onChange ? (
                <p>
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

        <footer className="mt-2 flex items-center justify-between border-t border-neutral-200 pt-2.5">
          <HtmlLogomark brandColor={brandColor} width={18} />
          <p className="text-[8px] text-neutral-500">
            {document.name} · {document.title}
          </p>
        </footer>
      </div>
    </div>
  )
}
