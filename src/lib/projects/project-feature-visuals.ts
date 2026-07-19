export type WideDualFeatureVisual = {
  layout: "wide-dual"
  desktopSrc: string
  mobileSrc: string
  desktopAlt: string
  mobileAlt: string
  urlBar: string
}

export type CompactPhoneFeatureVisual = {
  layout: "compact-phone"
  imageSrc: string
  imageAlt: string
}

export type FeatureVisualConfig = WideDualFeatureVisual | CompactPhoneFeatureVisual

export const PROJECT_FEATURE_VISUALS: Record<string, FeatureVisualConfig> = {
  rupeelens: {
    layout: "wide-dual",
    desktopSrc: "/projects/rupeelens/hero.webp",
    mobileSrc: "/projects/rupeelens/mobile.webp",
    desktopAlt: "RupeeLens — dashboard desktop view",
    mobileAlt: "RupeeLens — dashboard mobile view",
    urlBar: "rupeelens-coral.vercel.app",
  },
  "100x-chat-shell": {
    layout: "compact-phone",
    imageSrc: "/projects/chat-shell/mobile-chat.webp",
    imageAlt: "Design with AI — New Chat mobile view",
  },
  "v1-100x-proto": {
    layout: "compact-phone",
    imageSrc: "/projects/v1-100x-proto/mobile.webp",
    imageAlt: "100x Agent Extension — mobile agent workspace",
  },
  "100x-landing-page": {
    layout: "compact-phone",
    imageSrc: "/projects/100x/mobile.webp",
    imageAlt: "100x.Bot marketing site — mobile homepage",
  },
  "resume-builder": {
    layout: "compact-phone",
    imageSrc: "/projects/resume-builder/mobile.webp",
    imageAlt: "Resume Builder — mobile editor and preview",
  },
  kodo: {
    layout: "compact-phone",
    imageSrc: "/projects/kodo/mobile.webp",
    imageAlt: "Kodo — intake-to-pay marketing site on mobile",
  },
  unlogged: {
    layout: "compact-phone",
    imageSrc: "/projects/unlogged/mobile.webp",
    imageAlt: "Unlogged — Java devtools marketing site on mobile",
  },
  tulr: {
    layout: "compact-phone",
    imageSrc: "/projects/tulr/mobile.webp",
    imageAlt: "Tulr — no-code platform marketing on mobile",
  },
}

export function getFeatureVisualConfig(slug: string): FeatureVisualConfig | null {
  return PROJECT_FEATURE_VISUALS[slug] ?? null
}
