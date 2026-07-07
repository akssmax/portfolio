/**
 * Captures section screenshots from the live Kodo marketing site.
 * Run: npm run capture:kodo
 */
import { mkdir, unlink } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { chromium, type Page } from "playwright"
import sharp from "sharp"

const BASE_URL = "https://www.kodo.com/"
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_DIR = path.join(__dirname, "../public/projects/kodo")

const NAV_OPTIONS = { waitUntil: "domcontentloaded" as const, timeout: 90_000 }
const SETTLE_MS = 3000

type CaptureTarget =
  | { file: string; type: "viewport" }
  | { file: string; type: "heading"; text: string | RegExp }

const CAPTURES: CaptureTarget[] = [
  { file: "hero.webp", type: "viewport" },
  {
    file: "products.webp",
    type: "heading",
    text: /Accounts Payable|Vendor Payments|Corporate cards|Reimbursements/i,
  },
  {
    file: "workflows.webp",
    type: "heading",
    text: "Dynamic Workflows",
  },
  {
    file: "integrations.webp",
    type: "heading",
    text: "Robust Integrations",
  },
  {
    file: "collaboration.webp",
    type: "heading",
    text: "Seamless Collaboration",
  },
  {
    file: "segments.webp",
    type: "heading",
    text: /Flexibility and Control|at every stage of growth/i,
  },
]

async function saveWebp(pngPath: string, webpPath: string) {
  await sharp(pngPath).webp({ quality: 85 }).toFile(webpPath)
  await unlink(pngPath)
}

async function captureMobile(page: Page) {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(BASE_URL, NAV_OPTIONS)
  await page.waitForTimeout(SETTLE_MS)

  const mobileWebp = path.join(OUTPUT_DIR, "mobile.webp")
  const mobilePng = mobileWebp.replace(/\.webp$/, ".png")
  await page.screenshot({ path: mobilePng, type: "png", fullPage: false })
  await saveWebp(mobilePng, mobileWebp)
  console.log("  ✓ mobile.webp")
}

async function scrollToSection(page: Page, text: string | RegExp) {
  const heading = page.getByRole("heading", { name: text }).first()
  if ((await heading.count()) > 0) {
    await heading.scrollIntoViewIfNeeded({ timeout: 45_000 })
    return heading.locator("xpath=ancestor::section[1]")
  }

  const label = page.getByText(text, { exact: false }).first()
  await label.scrollIntoViewIfNeeded({ timeout: 45_000 })
  const section = label.locator("xpath=ancestor::section[1]")
  if ((await section.count()) > 0) {
    return section
  }

  return label.locator("xpath=ancestor::div[contains(@class,'section') or contains(@class,'Section')][1]")
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

      await page.goto(BASE_URL, NAV_OPTIONS)
      await page.waitForTimeout(SETTLE_MS)

      const sectionLocator = await scrollToSection(page, target.text)
      await page.waitForTimeout(500)

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

  try {
    await captureMobile(page)
  } catch (error) {
    console.warn("Skipped mobile.webp:", error instanceof Error ? error.message : error)
  }

  await browser.close()
  console.log(`Saved screenshots to public/projects/kodo/`)
}

capture().catch((error) => {
  console.error(error)
  process.exit(1)
})
