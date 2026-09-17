import { DitherField } from "@/components/landing-2/dither-field"
import { profile } from "@/lib/profile"

export function Landing2Footer() {
  return (
    <footer className="relative overflow-hidden border-t-2 border-foreground px-4 py-10 sm:px-8">
      <DitherField variant="desktop" color="lime" />
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-6 text-xs sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <p>{profile.name} © {new Date().getFullYear()}</p>
          <p>Version 0.01</p>
          <p>Made in Bangalore. With Love.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <a href={`mailto:${profile.contact.email}`} className="underline">
            {profile.contact.email}
          </a>
          <a href={profile.links.linkedin} className="underline" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={profile.links.github} className="underline" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
        <p>AS.OS.1</p>
      </div>
    </footer>
  )
}
