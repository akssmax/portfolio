export function getProjectLiveUrl(slug: string): string | null {
  switch (slug) {
    case "postforge":
      return "https://postforge-kohl.vercel.app/"
    case "rupeelens":
      return "https://rupeelens-coral.vercel.app/"
    case "100x-landing-page":
      return "https://100x-landing-page.vercel.app/"
    case "100x-chat-shell":
      return "https://llm-daisyui-shell.vercel.app/"
    case "v1-100x-proto":
      return "https://agent.akshaysaini.xyz/"
    case "resume-builder":
      return "/tools/resume"
    case "kodo":
      return "https://www.kodo.com/"
    case "unlogged":
      return "https://www.unlogged.io/"
    case "tulr":
      return "https://www.producthunt.com/products/tulr-io"
    default:
      return null
  }
}
