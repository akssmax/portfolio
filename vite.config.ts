import path from "node:path"
import { fileURLToPath } from "node:url"

import { defineConfig } from "vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import viteTsConfigPaths from "vite-tsconfig-paths"
import tailwindcss from "@tailwindcss/vite"
import { nitro } from "nitro/vite"
import { nodePolyfills } from "vite-plugin-node-polyfills"

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const isDev = process.env.NODE_ENV !== "production"
const serverExternals = [
  "react",
  "react-dom",
  "lucide-react",
  "@react-pdf/renderer",
  "pdfjs-dist",
]

const config = defineConfig({
  envDir: rootDir,
  resolve: {
    alias: {
      flubber: path.resolve(rootDir, "node_modules/flubber/index.js"),
    },
  },
  optimizeDeps: {
    include: ["flubber", "buffer"],
  },
  ssr: {
    noExternal: ["flubber"],
  },
  environments: {
    // Externalize before CommonJS transforms; Nitro then traces the same list.
    nitro: { resolve: { external: serverExternals } },
  },
  plugins: [
    // @react-pdf/renderer needs Buffer in the browser (pdfkit file IDs, etc.)
    nodePolyfills({
      include: ["buffer"],
      globals: {
        Buffer: true,
        global: false,
        process: false,
      },
    }),
    ...(isDev ? [devtools()] : []),
    nitro({
      // These packages run directly in Node. Include them in the deployment
      // without parsing large icon and PDF libraries into a second bundle.
      // Keep React and its renderer together to preserve a single hook runtime.
      // Lucide also exposes a dynamic icon map whose imports must be copied.
      traceDeps: serverExternals.map((name) =>
        name === "lucide-react" ? `${name}*` : name
      ),
      vercel: {
        functions: {
          maxDuration: 120,
        },
      },
    }),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
