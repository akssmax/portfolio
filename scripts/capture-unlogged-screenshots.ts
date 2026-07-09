/**
 * Captures section screenshots from the Unlogged marketing site.
 * The live site (unlogged.io) returns 404; we use Wayback Machine archives.
 * Fallback: read.unlogged.io docs homepage.
 * Run: npm run capture:unlogged
 */
import { mkdir, unlink } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { chromium } from "playwright"
import sharp from "sharp"

const DOCS_FALLBACK_URL = "https://read.unlogged.io/"

// id_ mode strips the Wayback toolbar for cleaner screenshots.
const WAYBACK_HOME = "https://web.archive.org/web/20230603065848id_/https://www.unlogged.io/"

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
]

async function resolveBaseUrl(page: import("playwright").Page): Promise<string> {
  for (const url of [WAYBACK_HOME, DOCS_FALLBACK_URL]) {
    try {
      const response = await page.goto(url, NAV_OPTIONS)
      if (response && response.ok()) {
        await page.waitForTimeout(SETTLE_MS)
        const title = await page.title()
        if (!/not found|404/i.test(title)) {
          return url
        }
      }
    } catch {
      // try next URL
    }
  }

  throw new Error(
    `No working Unlogged URL found (tried Wayback archive and ${DOCS_FALLBACK_URL})`,
  )
}

async function saveWebp(pngPath: string, webpPath: string) {
  await sharp(pngPath).webp({ quality: 85 }).toFile(webpPath)
  await unlink(pngPath)
}

async function generateStyledAssetsFromFeatures() {
  const featuresPath = path.join(OUTPUT_DIR, "features.webp")
  const featuresMeta = await sharp(featuresPath).metadata()
  const width = featuresMeta.width ?? 2880
  const height = featuresMeta.height ?? 1800

  // Wayback id_ captures lose CSS; derive phone + hero crops from the styled features capture.
  const cropW = Math.round(height * (390 / 844))
  const left = Math.round((width - cropW) / 2)

  await sharp(featuresPath)
    .extract({ left, top: 0, width: cropW, height })
    .resize(780, 1688, { fit: "cover", position: "top" })
    .webp({ quality: 85 })
    .toFile(path.join(OUTPUT_DIR, "mobile.webp"))
  console.log("  ✓ mobile.webp (from features.webp)")

  await sharp(featuresPath)
    .resize(2880, 1800, { fit: "cover", position: "top" })
    .webp({ quality: 85 })
    .toFile(path.join(OUTPUT_DIR, "hero.webp"))
  console.log("  ✓ hero.webp (from features.webp)")
}

async function captureAboutFromDocs(page: import("playwright").Page) {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(DOCS_FALLBACK_URL, NAV_OPTIONS)
  await page.waitForTimeout(SETTLE_MS)

  const aboutWebp = path.join(OUTPUT_DIR, "about.webp")
  const aboutPng = aboutWebp.replace(/\.webp$/, ".png")
  await page.screenshot({ path: aboutPng, type: "png", fullPage: false })
  await saveWebp(aboutPng, aboutWebp)
  console.log("  ✓ about.webp (from docs)")
}

async function capture() {
  await mkdir(OUTPUT_DIR, { recursive: true })

  const browser = await chromium.launch()
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  })

  const baseUrl = await resolveBaseUrl(page)
  console.log(`Using source: ${baseUrl}`)

  for (const target of CAPTURES) {
    const webpPath = path.join(OUTPUT_DIR, target.file)
    const pngPath = webpPath.replace(/\.webp$/, ".png")

    try {
      if (target.type === "viewport") {
        await page.goto(target.url ?? baseUrl, NAV_OPTIONS)
        await page.waitForTimeout(SETTLE_MS)
        await page.screenshot({ path: pngPath, type: "png", fullPage: false })
        await saveWebp(pngPath, webpPath)
        console.log(`  ✓ ${target.file}`)
        continue
      }

      await page.goto(baseUrl, NAV_OPTIONS)
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
      console.log(`  ✓ ${target.file}`)
    } catch (error) {
      console.warn(`Skipped ${target.file}:`, error instanceof Error ? error.message : error)
    }
  }

  try {
    await generateStyledAssetsFromFeatures()
  } catch (error) {
    console.warn("Skipped mobile/hero from features.webp:", error instanceof Error ? error.message : error)
  }

  try {
    await captureAboutFromDocs(page)
  } catch (error) {
    console.warn("Skipped about.webp:", error instanceof Error ? error.message : error)
  }

  await browser.close()
  console.log(`Saved screenshots to public/projects/unlogged/`)
}

capture().catch((error) => {
  console.error(error)
  process.exit(1)
})
