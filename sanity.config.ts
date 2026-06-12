import { visionTool } from "@sanity/vision"
import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"

import { schemaTypes } from "./sanity/schemaTypes"

export default defineConfig({
  name: "default",
  title: "Design Portfolio",
  projectId: process.env.VITE_SANITY_PROJECT_ID ?? "",
  dataset: process.env.VITE_SANITY_DATASET ?? "production",
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
})
