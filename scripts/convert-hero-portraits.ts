import sharp from "sharp"
import { readdir } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const portraitsDir = path.resolve(rootDir, "../public/images/portraits")

const files = await readdir(portraitsDir)

for (const file of files) {
  if (!file.endsWith(".png")) continue

  const inputPath = path.join(portraitsDir, file)
  const outputPath = path.join(portraitsDir, file.replace(/\.png$/, ".webp"))

  await sharp(inputPath).webp({ quality: 85 }).toFile(outputPath)
  console.log(`Converted ${file} -> ${path.basename(outputPath)}`)
}
