const PROJECT_GALLERY: Record<string, string[]> = {
  kodo: ["/projects/kodo/workflows.webp", "/projects/kodo/products.webp", "/projects/kodo/mobile.webp"],
  unlogged: ["/projects/unlogged/features.webp", "/projects/unlogged/about.webp", "/projects/unlogged/mobile.webp"],
  tulr: ["/projects/tulr/product.jpg", "/projects/tulr/mobile.webp"],
  postforge: ["/projects/postforge/tool.webp", "/projects/postforge/visuals.webp", "/projects/postforge/slides.webp"],
  rupeelens: ["/projects/rupeelens/dashboard.webp", "/projects/rupeelens/trends.webp", "/projects/rupeelens/mobile.webp"],
  "100x-landing-page": ["/projects/100x/apps.webp", "/projects/100x/workflows.webp", "/projects/100x/mobile.webp"],
  "100x-chat-shell": ["/projects/chat-shell/chat.webp", "/projects/chat-shell/design-canvas.webp", "/projects/chat-shell/mobile-chat.webp"],
  "v1-100x-proto": ["/projects/v1-100x-proto/home.webp", "/projects/v1-100x-proto/apps.webp", "/projects/v1-100x-proto/mobile.webp"],
  "resume-builder": ["/projects/resume-builder/preview.webp", "/projects/resume-builder/wizard-input.webp", "/projects/resume-builder/mobile.webp"],
}

export function getProjectGallery(slug: string): string[] {
  return PROJECT_GALLERY[slug] ?? []
}
