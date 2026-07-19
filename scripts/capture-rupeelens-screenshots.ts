/**
 * Captures RupeeLens screenshots from a local or deployed app.
 *
 * Prerequisite: RupeeLens running (default http://localhost:3001)
 *   cd "../Pesonal Finanace/personal-finance" && npm run dev -- --port 3001
 *
 * Run: npm run capture:rupeelens
 */
import { mkdir, unlink } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { chromium, type Page } from "playwright"
import sharp from "sharp"

const DEFAULT_BASE_URL = "http://localhost:3001"
const BASE_URL = (process.env.RUPEELENS_CAPTURE_URL ?? DEFAULT_BASE_URL).replace(
  /\/$/,
  "",
)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_DIR = path.join(__dirname, "../public/projects/rupeelens")
const FIXTURE_CSV = path.resolve(
  __dirname,
  "../../../Pesonal Finanace/personal-finance/fixtures/axis-sample.csv",
)

const NAV_OPTIONS = { waitUntil: "domcontentloaded" as const, timeout: 90_000 }
const SETTLE_MS = 2200

async function saveWebp(pngPath: string, webpPath: string) {
  await sharp(pngPath).webp({ quality: 85 }).toFile(webpPath)
  await unlink(pngPath)
}

async function screenshotPage(page: Page, fileName: string) {
  const webpPath = path.join(OUTPUT_DIR, fileName)
  const pngPath = webpPath.replace(/\.webp$/, ".png")
  await page.screenshot({ path: pngPath, type: "png", fullPage: false })
  await saveWebp(pngPath, webpPath)
  console.log(`  ✓ ${fileName}`)
}

async function importSampleStatement(page: Page) {
  await page.goto(`${BASE_URL}/`, NAV_OPTIONS)
  await page.waitForTimeout(1200)

  const uploadCta = page.getByRole("button", {
    name: /upload your first statement/i,
  })
  const sidebarUpload = page.getByRole("button", { name: /upload/i }).first()

  if (await uploadCta.isVisible().catch(() => false)) {
    await uploadCta.click()
  } else if (await sidebarUpload.isVisible().catch(() => false)) {
    await sidebarUpload.click()
  } else {
    throw new Error("Could not find Upload control")
  }

  const fileInput = page.locator('input[type="file"]')
  await fileInput.waitFor({ state: "attached", timeout: 15_000 })
  await fileInput.setInputFiles(FIXTURE_CSV)
  await page.getByRole("button", { name: /confirm import/i }).click({
    timeout: 30_000,
  })
  await page.waitForTimeout(SETTLE_MS + 1500)
}

async function captureDesktop(page: Page) {
  console.log("Desktop captures…")

  await importSampleStatement(page)
  await page.goto(`${BASE_URL}/`, NAV_OPTIONS)
  await page.waitForTimeout(SETTLE_MS)
  await screenshotPage(page, "hero.webp")
  await screenshotPage(page, "dashboard.webp")

  const routes: Array<{ path: string; file: string }> = [
    { path: "/transactions", file: "transactions.webp" },
    { path: "/spending", file: "spending.webp" },
    { path: "/subscriptions", file: "subscriptions.webp" },
    { path: "/credits-debits", file: "credits-debits.webp" },
  ]

  for (const route of routes) {
    await page.goto(`${BASE_URL}${route.path}`, NAV_OPTIONS)
    await page.waitForTimeout(SETTLE_MS)
    await screenshotPage(page, route.file)
  }

  // Trends tab on dashboard if present
  await page.goto(`${BASE_URL}/`, NAV_OPTIONS)
  await page.waitForTimeout(1000)
  const trendsTab = page.getByRole("tab", { name: /trends/i })
  if (await trendsTab.isVisible().catch(() => false)) {
    await trendsTab.click()
    await page.waitForTimeout(SETTLE_MS)
    await screenshotPage(page, "trends.webp")
  }
}

async function captureMobile(page: Page) {
  console.log("Mobile capture…")
  await page.goto(`${BASE_URL}/`, NAV_OPTIONS)
  await page.waitForTimeout(SETTLE_MS)
  await screenshotPage(page, "mobile.webp")
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true })
  console.log(`Capturing RupeeLens from ${BASE_URL}`)
  console.log(`Fixture: ${FIXTURE_CSV}`)
  console.log(`Output: ${OUTPUT_DIR}`)

  const browser = await chromium.launch({ headless: true })

  const desktop = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  })
  const desktopPage = await desktop.newPage()
  await captureDesktop(desktopPage)
  await desktop.close()

  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  })
  const mobilePage = await mobile.newPage()
  // Re-import in fresh mobile context so dashboard isn't empty
  await importSampleStatement(mobilePage)
  await captureMobile(mobilePage)
  await mobile.close()

  await browser.close()
  console.log("Done.")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
