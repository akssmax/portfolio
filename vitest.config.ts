import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

// Unit tests don't need the app's Nitro servers or devtools listeners.
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: { environment: "node" },
})
