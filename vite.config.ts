import path from "node:path"
import { fileURLToPath } from "node:url"

import { defineConfig } from "vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import viteTsConfigPaths from "vite-tsconfig-paths"
import tailwindcss from "@tailwindcss/vite"
import { nitro } from "nitro/vite"

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const isDev = process.env.NODE_ENV !== "production"

const config = defineConfig({
  envDir: rootDir,
  resolve: {
    alias: {
      flubber: path.resolve(rootDir, "node_modules/flubber/index.js"),
    },
  },
  optimizeDeps: {
    include: ["flubber"],
  },
  ssr: {
    noExternal: ["flubber"],
  },
  plugins: [
    ...(isDev ? [devtools()] : []),
    nitro({
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
