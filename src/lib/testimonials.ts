export type TestimonialQuotePart = {
  text: string
  bold?: boolean
}

export type Testimonial = {
  id: string
  name: string
  headline: string
  relationship: string
  date: string
  quote: TestimonialQuotePart[]
  avatarSrc: string
  linkedInUrl: string
}

export const testimonials: Testimonial[] = [
  {
    id: "gaurav-thapa",
    name: "Gaurav Thapa",
    headline: "Software Architect · Engineer · AI-friendly Human",
    relationship: "Managed Akshay directly",
    date: "May 2026",
    avatarSrc: "/testimonials/gaurav-thapa.jpg",
    linkedInUrl: "https://www.linkedin.com/in/gaurav-thapa/",
    quote: [
      {
        text: "Akshay played an important role in shaping the product and design experience for a dynamic forms and workflows platform we built, with its first major application in ",
      },
      { text: "procure-to-pay and enterprise finance workflows", bold: true },
      { text: ". What I appreciated most was his ability to " },
      { text: "iterate quickly without becoming superficial", bold: true },
      {
        text: ". He was comfortable working through ",
      },
      { text: "complex workflows, configurable UI patterns", bold: true },
      {
        text: ", and evolving product requirements while still keeping the product intuitive and usable. He was also unusually ",
      },
      { text: "hands-on technically", bold: true },
      {
        text: " for a product designer, especially around ",
      },
      { text: "prototyping, design systems", bold: true },
      {
        text: ", and collaborating closely with engineering and other stakeholders to ensure execution quality matched product intent. Akshay brings strong ",
      },
      { text: "product and UI thinking, execution speed, and ownership", bold: true },
      { text: ", which makes him very effective in " },
      { text: "fast-moving startup environments", bold: true },
      { text: "." },
    ],
  },
  {
    id: "tumul-roy",
    name: "Tumul Roy",
    headline: "Product & Platform Strategy · Kellogg MMM '27",
    relationship: "Managed Akshay directly",
    date: "Dec 2025",
    avatarSrc: "/testimonials/tumul-roy.jpg",
    linkedInUrl: "https://www.linkedin.com/in/tumul-roy/",
    quote: [
      { text: "I worked very closely with Akshay at " },
      { text: "Kodo", bold: true },
      { text: ", where he was the designer on our " },
      { text: "procure-to-pay product", bold: true },
      {
        text: ". We partnered day-to-day from early discovery through enterprise rollout, and he played a key role in translating ",
      },
      {
        text: "messy, ambiguous requirements into clear and intuitive product flows",
        bold: true,
      },
      { text: ". What I really valued was how " },
      { text: "quickly he could move without being superficial", bold: true },
      {
        text: ". He took the time to deeply understand ",
      },
      { text: "user workflows, edge cases, and system constraints", bold: true },
      { text: ", which mattered a lot in a " },
      { text: "finance and compliance-heavy product", bold: true },
      { text: " like ours. Akshay approaches design as a " },
      { text: "problem-solving exercise, not just a visual one", bold: true },
      { text: ". He consistently asked the " },
      { text: "right questions early", bold: true },
      {
        text: ", thought through requirements end-to-end, and collaborated extremely well with product and engineering. He was deeply invested in the quality of the product and cared about making ",
      },
      { text: "complex workflows feel simple and trustworthy", bold: true },
      { text: " for users. He's someone I'd happily work with again and strongly recommend to any team building " },
      { text: "complex, high-stakes products", bold: true },
      { text: "." },
    ],
  },
  {
    id: "shardul-lavekar",
    name: "Shardul Lavekar",
    headline: "100x.bot · YC · BITS",
    relationship: "Managed Akshay directly",
    date: "Jan 2024",
    avatarSrc: "/testimonials/shardul-lavekar.jpg",
    linkedInUrl: "https://www.linkedin.com/in/shardul-lavekar-96049414/",
    quote: [
      { text: "I have worked with Akshay for " },
      { text: "3 years", bold: true },
      { text: " and highly recommend him. Super " },
      { text: "hard working, very committed, and loyal", bold: true },
      {
        text: ". Little bored of DevTools, he wants to try designing something else. From what I saw, he could pick up any tool from ",
      },
      { text: "Figma to Amplitude", bold: true },
      { text: " at speed and deliver " },
      { text: "beautiful designs, on time", bold: true },
      { text: ". He has helped immensely with our " },
      { text: "marketing outreach", bold: true },
      { text: " too. From " },
      {
        text: "Product Hunt launches, twitter/Reddit ads, to marketing videos",
        bold: true,
      },
      { text: " — he owned everything. Akshay will be a " },
      { text: "great asset", bold: true },
      { text: " for any team he joins." },
    ],
  },
]

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function getTestimonialInitials(name: string) {
  return getInitials(name)
}

export function getTestimonialQuotePlainText(quote: TestimonialQuotePart[]) {
  return quote.map((part) => part.text).join("")
}
