export type PropDoc = {
  name: string
  type: string
  required: boolean
  defaultValue: string | null
  description: string
  control?: {
    kind:
      | "date"
      | "text"
      | "number"
      | "boolean"
      | "enum"
      | "json"
      | "event"
      | "readonly"
    options?: (string | number | boolean)[]
    reason?: string
  }
}

export type ComponentReference = {
  sourcePath: string
  importPath: string
  primitive: string
  dependencies: string[]
  exports: string[]
  parts: { name: string; contract: string; props: PropDoc[] }[]
  slots: string[]
  tokens: string[]
  example: { code: string; path: string; name: string }
  playground: {
    parts: string[]
    templates: Record<string, string>
    example: { code: string; path: string; name: string }
  }
}

const references = import.meta.glob<{ default: ComponentReference }>(
  "./generated/*.json"
)

const sources = import.meta.glob<{ default: string }>(
  "./generated/sources/*.json"
)

export async function loadComponentSource(slug: string) {
  const load = sources[`./generated/sources/${slug}.json`]
  if (!load) throw new Error("Component source is unavailable.")
  return (await load()).default
}

export async function loadComponentReference(slug: string) {
  const load = references[`./generated/${slug}.json`]
  if (!load) return null
  return (await load()).default
}
