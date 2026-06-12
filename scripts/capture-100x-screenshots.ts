/**
 * Captures section screenshots from the live 100x marketing site.
 * Run: npm run capture:100x
 */
import { mkdir, unlink } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { chromium } from "playwright"
import sharp from "sharp"

const BASE_URL = "https://100x.bot/"
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_DIR = path.join(__dirname, "../public/projects/100x")

const NAV_OPTIONS = { waitUntil: "domcontentloaded" as const, timeout: 90_000 }
const SETTLE_MS = 3000

type CaptureTarget =
  | { file: string; type: "viewport" }
  | { file: string; type: "heading"; text: string }
  | { file: string; type: "path"; path: string }

const CAPTURES: CaptureTarget[] = [
  { file: "hero.webp", type: "viewport" },
  {
    file: "workflows.webp",
    type: "heading",
    text: "Turn your repetitive work into reusable automations",
  },
  {
    file: "apps.webp",
    type: "path",
    path: "/product/apps",
  },
  {
    file: "smart-tables.webp",
    type: "path",
    path: "/product/tables",
  },
  { file: "integrations.webp", type: "path", path: "/integrations" },
  { file: "marketplace.webp", type: "path", path: "/marketplace" },
  { file: "hackathon.webp", type: "path", path: "/hackathon" },
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
        await page.goto(BASE_URL, NAV_OPTIONS)
        await page.waitForTimeout(SETTLE_MS)
        await page.screenshot({ path: pngPath, type: "png", fullPage: false })
        await saveWebp(pngPath, webpPath)
        continue
      }

      if (target.type === "path") {
        await page.goto(`${BASE_URL.replace(/\/$/, "")}${target.path}`, NAV_OPTIONS)
        await page.waitForSelector("main, h1", { timeout: 45_000 })
        await page.waitForTimeout(SETTLE_MS)
        await page.screenshot({ path: pngPath, type: "png", fullPage: false })
        await saveWebp(pngPath, webpPath)
        continue
      }

      await page.goto(BASE_URL, NAV_OPTIONS)
      await page.waitForTimeout(SETTLE_MS)

      const heading = page.getByRole("heading", { name: target.text })
      await heading.scrollIntoViewIfNeeded({ timeout: 45_000 })
      await page.waitForTimeout(500)

      const sectionLocator = heading.locator("xpath=ancestor::section[1]")
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
  console.log(`Saved ${CAPTURES.length} screenshots to public/projects/100x/`)
}

capture().catch((error) => {
  console.error(error)
  process.exit(1)
})
