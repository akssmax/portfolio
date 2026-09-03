import {
  MONOGRAM_ACCENT,
  MONOGRAM_MAIN,
  MONOGRAM_VIEWBOX,
} from "@/lib/brand/monogram-mark"

import { logoPixelSize } from "./pipeline"

const LOGO_SVG =
  `<svg viewBox="${MONOGRAM_VIEWBOX}" xmlns="http://www.w3.org/2000/svg" fill="none">` +
  `<path d="${MONOGRAM_MAIN}" fill="#EDEDED"/>` +
  `<path d="${MONOGRAM_ACCENT}" fill="#EDEDED"/>` +
  `</svg>`

export async function rasterizeLogo(
  size: number,
  signal?: AbortSignal,
): Promise<HTMLCanvasElement> {
  if (signal?.aborted)
    throw new DOMException("Logo rasterization aborted.", "AbortError")
  const [width, height] = logoPixelSize(size)
  const pad = 3
  const canvas = document.createElement("canvas")
  canvas.width = width + pad * 2
  canvas.height = height + pad * 2
  const context = canvas.getContext("2d")
  if (!context) throw new Error("Could not create the logo raster canvas.")
  const image = new Image()
  let abort: (() => void) | undefined
  const loaded = new Promise<void>((resolve, reject) => {
    image.onload = () => resolve()
    image.onerror = () =>
      reject(new Error("Could not decode the monogram SVG."))
    abort = () => {
      image.onload = null
      image.onerror = null
      image.src = ""
      reject(new DOMException("Logo rasterization aborted.", "AbortError"))
    }
    signal?.addEventListener("abort", abort, { once: true })
  })
  if (signal?.aborted) abort?.()
  else
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(LOGO_SVG)}`
  try {
    await loaded
  } finally {
    image.onload = null
    image.onerror = null
    if (abort) signal?.removeEventListener("abort", abort)
  }
  if (signal?.aborted)
    throw new DOMException("Logo rasterization aborted.", "AbortError")
  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = "high"
  context.drawImage(image, pad, pad, width, height)
  return canvas
}
