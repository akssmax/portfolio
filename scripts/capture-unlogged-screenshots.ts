/**
 * Captures section screenshots from the live Unlogged marketing site.
 * Run: npm run capture:unlogged
 */
import { mkdir, unlink } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { chromium } from "playwright"
import sharp from "sharp"

const BASE_URL = "https://www.unlogged.io/"
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_DIR = path.join(__dirname, "../public/projects/unlogged")

const NAV_OPTIONS = { waitUntil: "domcontentloaded" as const, timeout: 90_000 }
const SETTLE_MS = 3000

type CaptureTarget =
  | { file: string; type: "viewport"; url?: string }
  | { file: string; type: "heading"; text: string | RegExp }

const CAPTURES: CaptureTarget[] = [
  { file: "hero.webp", type: "viewport" },
  {
    file: "features.webp",
    type: "heading",
    text: /Mock, Monitor, Replay/i,
  },
  {
    file: "benefits.webp",
    type: "heading",
    text: /Save Time|Code and Deploy Confidently|Mocking on Demand/i,
  },
  {
    file: "about.webp",
    type: "viewport",
    url: "https://www.unlogged.io/about-us",
  },
]

async function saveWebp(pngPath: string, webpPath: string) {
  await sharp(pngPath).webp({ quality: 85 }).toFile(webpPath)
  await unlink(pngPath)
}

async function capture() {
  await mkdir(OUTPUT_DIR, { recursive: true })

  const browser = await chromium.launch()
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  })

  for (const target of CAPTURES) {
    const webpPath = path.join(OUTPUT_DIR, target.file)
    const pngPath = webpPath.replace(/\.webp$/, ".png")

    try {
      if (target.type === "viewport") {
        await page.goto(target.url ?? BASE_URL, NAV_OPTIONS)
        await page.waitForTimeout(SETTLE_MS)
        await page.screenshot({ path: pngPath, type: "png", fullPage: false })
        await saveWebp(pngPath, webpPath)
        continue
      }

      await page.goto(BASE_URL, NAV_OPTIONS)
      await page.waitForTimeout(SETTLE_MS)

      const heading = page.getByRole("heading", { name: target.text })
      await heading.first().scrollIntoViewIfNeeded({ timeout: 45_000 })
      await page.waitForTimeout(500)

      const sectionLocator = heading.first().locator("xpath=ancestor::section[1]")
      const hasSection = (await sectionLocator.count()) > 0

      if (hasSection) {
        await sectionLocator.screenshot({ path: pngPath, type: "png" })
      } else {
        await page.screenshot({
          path: pngPath,
          type: "png",
          clip: { x: 0, y: 0, width: 1440, height: 900 },
        })
      }

      await saveWebp(pngPath, webpPath)
    } catch (error) {
      console.warn(`Skipped ${target.file}:`, error instanceof Error ? error.message : error)
    }
  }

  await browser.close()
  console.log(`Saved screenshots to public/projects/unlogged/`)
}

capture().catch((error) => {
  console.error(error)
  process.exit(1)
})
