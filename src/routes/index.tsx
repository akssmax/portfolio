import { createFileRoute } from "@tanstack/react-router"

import { ErrorBoundary } from "@/components/error-boundary"
import { RouteError } from "@/components/route-error"
import { ContactSection } from "@/components/landing/contact-section"
import { ExperienceSection } from "@/components/landing/experience-section"
import { HeroSection } from "@/components/landing/hero-section"
import { SiteFooter } from "@/components/landing/site-footer"
import { SiteHeader } from "@/components/landing/site-header"
import { SkillsSection } from "@/components/landing/skills-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { WorkSection } from "@/components/landing/work-section"
import { getHomeWorkSections } from "@/lib/sanity/projects"

export const Route = createFileRoute("/")({
  loader: () => getHomeWorkSections(),
  errorComponent: RouteError,
  head: () => ({
    meta: [
      {
        title: "Akshay Saini — Product Designer & Design Engineer in Bangalore, India",
      },
      {
        name: "description",
        content: "Portfolio of Akshay Saini, a Product Designer and Design Engineer based in Bangalore (Bengaluru), India. Specialized in fintech, developer tools, and agentic AI.",
      },
      {
        name: "keywords",
        content: "product designer in bangalore, design engineer in bangalore, designer in bangalore, product designer in india, design engineer in india, ux designer in bangalore, ui designer in bangalore, design engineer, product designer, bangalore, india, freelancer designer bangalore, akshay saini, design portfolio",
      },
      {
        property: "og:title",
        content: "Akshay Saini — Product Designer & Design Engineer in Bangalore, India",
      },
      {
        property: "og:description",
        content: "Portfolio of Akshay Saini, an expert Product Designer & Design Engineer based in Bangalore (Bengaluru), India. Specializing in fintech, developer tools, and agentic AI.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:url",
        content: "https://akshaysaini.xyz/",
      },
      {
        property: "og:image",
        content: "https://akshaysaini.xyz/images/hero-portrait.png",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: "Akshay Saini — Product Designer & Design Engineer in Bangalore, India",
      },
      {
        name: "twitter:description",
        content: "Portfolio of Akshay Saini, an expert Product Designer & Design Engineer based in Bangalore (Bengaluru), India.",
      },
      {
        name: "twitter:image",
        content: "https://akshaysaini.xyz/images/hero-portrait.png",
      },
      {
        name: "twitter:creator",
        content: "@akssmax",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://akshaysaini.xyz/",
      },
    ],
  }),
  component: HomePage,
})

function HomePage() {
  const { recentProjects, caseStudies } = Route.useLoaderData()

  return (
    <div className="min-h-svh bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Akshay Saini",
            "jobTitle": ["Product Designer", "Design Engineer", "UI/UX Designer"],
            "url": "https://akshaysaini.xyz/",
            "image": "https://akshaysaini.xyz/images/portraits/02.png",
            "sameAs": [
              "https://www.linkedin.com/in/akssmax/",
              "https://github.com/akssmax",
              "https://dribbble.com/akssmax",
              "https://medium.com/@akssmax",
              "https://www.youtube.com/@akshaysainiAK"
            ],
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Bengaluru",
              "addressRegion": "Karnataka",
              "addressCountry": "India"
            },
            "knowsAbout": [
              "Product Design",
              "Design Engineering",
              "UI/UX Design",
              "Fintech Design",
              "DevTools Design",
              "Agentic AI",
              "Front-End Development",
              "React",
              "TypeScript",
              "Figma"
            ],
            "worksFor": {
              "@type": "Organization",
              "name": "100x.bot"
            }
          })
        }}
      />
      <SiteHeader />
      <main>
        <ErrorBoundary title="Hero section failed" showHeader={false}>
          <HeroSection />
        </ErrorBoundary>
        <ErrorBoundary title="Work section failed" showHeader={false}>
          <WorkSection recentProjects={recentProjects} caseStudies={caseStudies} />
        </ErrorBoundary>
        <ErrorBoundary title="Experience section failed" showHeader={false}>
          <ExperienceSection />
        </ErrorBoundary>
        <ErrorBoundary title="Testimonials section failed" showHeader={false}>
          <TestimonialsSection />
        </ErrorBoundary>
        <ErrorBoundary title="Skills section failed" showHeader={false}>
          <SkillsSection />
        </ErrorBoundary>
        <ErrorBoundary title="Contact section failed" showHeader={false}>
          <ContactSection />
        </ErrorBoundary>
      </main>
      <SiteFooter />
    </div>
  )
}
