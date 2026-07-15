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
  "100x-chat-shell": {
    layout: "wide-dual",
    desktopSrc: "/projects/chat-shell/hero.webp",
    mobileSrc: "/projects/chat-shell/mobile-chat.webp",
    desktopAlt: "Design with AI — Design Studio desktop view",
    mobileAlt: "Design with AI — New Chat mobile view",
    urlBar: "llm-daisyui-shell.vercel.app/design",
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
