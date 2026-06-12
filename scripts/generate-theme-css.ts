/**
 * Generates theme CSS files from theme-data.ts
 * Run: node --import tsx scripts/generate-theme-css.ts
 */
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

import {
  THEME_PRESET_DATA,
  generateAllPresetsCss,
  generateThemeCss,
} from "../src/lib/themes/theme-data"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const themesDir = path.join(__dirname, "../src/lib/themes/themes")

async function main() {
  await mkdir(themesDir, { recursive: true })

  for (const preset of THEME_PRESET_DATA) {
    const filePath = path.join(themesDir, `${preset.id}.css`)
    await writeFile(filePath, `${generateThemeCss(preset)}\n`)
    console.log(`  ✓ ${preset.id}.css`)
  }

  const presetsPath = path.join(themesDir, "presets.css")
  await writeFile(presetsPath, `${generateAllPresetsCss()}\n`)
  console.log(`  ✓ presets.css (bundle)`)

  console.log(`Generated ${THEME_PRESET_DATA.length} theme files`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
