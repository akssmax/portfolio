import type {
  CaseStudyFact,
  CaseStudyMedia,
  CaseStudyPrototype,
  CaseStudyStory,
  CaseStudySystemCard,
} from "@/lib/projects/case-study-story"
import { kodoCaseStudy } from "@/lib/projects/kodo-case-study"

/**
 * One editorial case-study page = a hero plus an ordered list of sections.
 * Kodo, Unlogged and Tulr all map their data into this shape so they share
 * one layout (`CaseStudyDeepDiveLayout`).
 */

type List<T> = ReadonlyArray<T>

export type DeepDiveChapter = {
  id: string
  number: string
  label: string
  title: string
  introduction: string
  problem: string
  responsibility: string
  approach: string
  decisions: List<string>
  decisionLabel?: string
  shipped: string
  shippedLabel?: string
  media: List<CaseStudyMedia>
  publicLink?: { label: string; href: string }
}

export type DeepDivePerson = {
  name: string
  context: string
  href?: string
  quote?: string
}

export type DeepDiveSection =
  | {
      kind: "prose"
      id: string
      toc: string
      eyebrow: string
      title: string
      paragraphs: List<string>
      callout?: { eyebrow: string; title: string; body: string }
    }
  | { kind: "chapter"; id: string; toc: string; chapter: DeepDiveChapter }
  | {
      kind: "modules"
      id: string
      toc: string
      eyebrow: string
      title: string
      intro: string
      shipped: List<{ name: string; detail: string }>
      designed: List<{ name: string; detail: string }>
    }
  | {
      kind: "steps"
      id: string
      toc: string
      eyebrow: string
      title: string
      intro: string
      steps: List<{ title: string; detail: string }>
    }
  | {
      kind: "systems"
      id: string
      toc: string
      eyebrow: string
      title: string
      body: string
      systems: List<CaseStudySystemCard>
      people?: {
        eyebrow: string
        intro: string
        entries: List<DeepDivePerson>
        link?: { label: string; href: string }
      }
    }
  | {
      kind: "prototype"
      id: string
      toc: string
      prototype: CaseStudyPrototype
    }
  | { kind: "quote"; id: string; text: string; attribution: string }
  | {
      kind: "outcomes"
      id: string
      toc: string
      eyebrow: string
      title: string
      shippedLabel: string
      shipped: List<string>
      notShippedLabel?: string
      notShipped?: List<string>
      lessonsLabel: string
      lessons: List<string>
      footnote?: string
    }

export type DeepDiveStudy = {
  title: string
  description: string
  role: string
  period: string
  facts?: List<CaseStudyFact>
  sections: Array<DeepDiveSection>
}

function chapterSection(chapter: DeepDiveChapter): DeepDiveSection {
  return {
    kind: "chapter",
    id: chapter.id,
    toc: chapter.label,
    chapter,
  }
}

export function storyToDeepDive(study: CaseStudyStory): DeepDiveStudy {
  const sections: Array<DeepDiveSection> = [
    {
      kind: "prose",
      id: "overview",
      toc: study.nav.overview,
      eyebrow: study.brief.eyebrow,
      title: study.brief.title,
      paragraphs: [study.context, study.remit],
    },
  ]

  for (const chapter of study.chapters) {
    sections.push(chapterSection(chapter))
    if (chapter.prototype) {
      sections.push({
        kind: "prototype",
        id: chapter.prototype.id,
        toc: chapter.prototype.previewTitle,
        prototype: chapter.prototype,
      })
    }
  }

  if (study.pullQuote) {
    sections.push({
      kind: "quote",
      id: "quote",
      text: study.pullQuote.text,
      attribution: study.pullQuote.attribution,
    })
  }

  if (study.research) {
    sections.push({
      kind: "steps",
      id: "research",
      toc: study.nav.research ?? study.research.eyebrow,
      eyebrow: study.research.eyebrow,
      title: study.research.title,
      intro: study.research.body,
      steps: study.research.items,
    })
  }

  sections.push({
    kind: "systems",
    id: "design-system",
    toc: study.nav.system,
    eyebrow: study.system.eyebrow,
    title: study.system.title,
    body: study.system.body,
    systems: study.system.systems ?? [],
    people: study.system.people,
  })

  sections.push({
    kind: "outcomes",
    id: "outcomes",
    toc: study.nav.outcomes,
    eyebrow: study.outcomes.eyebrow,
    title: study.outcomes.title,
    shippedLabel: study.outcomes.releasesLabel,
    shipped: study.outcomes.releases,
    lessonsLabel: study.outcomes.lessonsLabel,
    lessons: study.outcomes.lessons,
    footnote: study.outcomes.footnote,
  })

  return {
    title: study.title,
    description: study.description,
    role: study.role,
    period: study.period,
    facts: study.facts,
    sections,
  }
}

function kodoPrototype(
  prototype: typeof kodoCaseStudy.mobilePrototype
): DeepDiveSection {
  return {
    kind: "prototype",
    id: prototype.id,
    toc: prototype.previewTitle,
    prototype: { ...prototype, eyebrow: "Interactive prototype" },
  }
}

export function kodoDeepDive(): DeepDiveStudy {
  const k = kodoCaseStudy
  const p2p = k.chapters.filter((chapter) => chapter.group === "p2p")
  const beyond = k.chapters.filter((chapter) => chapter.group === "beyond")
  const shippedCount = k.modules.shipped.length
  const designedCount = k.modules.designed.length

  const sections: Array<DeepDiveSection> = [
    {
      kind: "prose",
      id: "overview",
      toc: "Overview",
      eyebrow: "The brief",
      title: "Procure-to-pay, rebuilt as one workspace.",
      paragraphs: [k.context, k.remit],
      callout: { eyebrow: "The bet", ...k.bet },
    },
    {
      kind: "modules",
      id: "modules",
      toc: "Module map",
      eyebrow: "Module map",
      title: "What P2P v1 covered, and what waited.",
      intro: `I designed every module below. ${shippedCount} shipped in the first release with redBus and Brndme; ${designedCount} were fully designed and left for later.`,
      shipped: k.modules.shipped,
      designed: k.modules.designed,
    },
    ...p2p.map(chapterSection),
    kodoPrototype(k.vendorPortalPrototype),
    {
      kind: "steps",
      id: "process",
      toc: "How I worked",
      eyebrow: "How I worked",
      title: "Fast loops between customers, PMs and engineering.",
      intro:
        "We shipped quickly, mostly before AI design tools were common. Ideas moved from customer calls and PM research into rapid prototypes, and from there into handoff files engineers could build from.",
      steps: k.process,
    },
    {
      kind: "systems",
      id: "design-system",
      toc: "Design systems",
      eyebrow: "Design systems",
      title: "Two systems, 1,000+ components.",
      body: k.system,
      systems: k.systems,
      people: {
        eyebrow: "People I worked with",
        intro:
          "Gaurav Thapa and Tumul Roy were direct partners in this work. Their recommendations speak to the collaboration behind the product and system decisions.",
        entries: k.partners.map((partner) => ({
          name: partner.name,
          context: partner.context,
          href: partner.href,
          quote: partner.excerpt,
        })),
        link: {
          label: "Read LinkedIn recommendations",
          href: "https://in.linkedin.com/in/akssmax",
        },
      },
    },
  ]

  for (const chapter of beyond) {
    sections.push(chapterSection(chapter))
    if (chapter.id === "corporate-cards") {
      sections.push(kodoPrototype(k.mobilePrototype))
    }
  }

  sections.push({
    kind: "outcomes",
    id: "outcomes",
    toc: "Takeaways",
    eyebrow: "In retrospect",
    title: "What shipped, and what stayed with me.",
    shippedLabel: "Shipped",
    shipped: k.releases,
    notShippedLabel: "Designed, not shipped",
    notShipped: k.notShipped,
    lessonsLabel: "Lessons learned",
    lessons: k.lessons,
    footnote:
      "This account focuses on the work I contributed to. Kodo's company-wide customer and transaction figures are separate from the outcomes of these projects.",
  })

  return {
    title: k.title,
    description: k.description,
    role: k.role,
    period: k.period,
    facts: k.facts,
    sections,
  }
}
