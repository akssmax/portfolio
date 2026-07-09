/**
 * @react-pdf/renderer (via pdfkit) expects a Node-like Buffer global in the browser.
 * Vite does not polyfill it by default; without this, PDF generation throws
 * "Buffer is not defined" and the download UI stays stuck on "Generating PDF…".
 */
export async function ensurePdfBuffer(): Promise<void> {
  if (typeof globalThis.Buffer !== "undefined") return

  const { Buffer } = await import("buffer")
  globalThis.Buffer = Buffer
}
