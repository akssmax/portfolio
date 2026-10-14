import fs from "node:fs"
import path from "node:path"
import ts from "typescript"
import { allDocEntries } from "../src/lib/design-system-registry"
import type { ComponentReference } from "../src/lib/design-system/docs"

const root = process.cwd()
const virtualFiles = new Map<string, string>()
for (const entry of allDocEntries) {
  if (
    !fs.existsSync(
      path.join(
        root,
        `src/components/design-system/generated-playgrounds/${entry.slug}.tsx`
      )
    )
  )
    throw new Error(
      `Missing playground: ${entry.slug}. Run npm run docs:generate.`
    )
  const reference: ComponentReference = JSON.parse(
    fs.readFileSync(
      path.join(root, `src/lib/design-system/generated/${entry.slug}.json`),
      "utf8"
    )
  )
  const source = fs.readFileSync(path.join(root, reference.sourcePath), "utf8")
  const generatedSource = JSON.parse(
    fs.readFileSync(
      path.join(
        root,
        `src/lib/design-system/generated/sources/${entry.slug}.json`
      ),
      "utf8"
    )
  )
  if (source !== generatedSource)
    throw new Error(
      `Stale API reference: ${entry.slug}. Run npm run docs:generate.`
    )
  virtualFiles.set(
    path.join(
      root,
      `src/components/design-system/demos/__docs-check/${entry.slug}.tsx`
    ),
    reference.example.code
  )
  for (const [part, template] of Object.entries(
    reference.playground.templates
  )) {
    virtualFiles.set(
      path.join(
        root,
        `src/components/design-system/demos/__docs-check/${entry.slug}-${part}.tsx`
      ),
      template
    )
  }
}
const config = ts.readConfigFile(
  path.join(root, "tsconfig.json"),
  ts.sys.readFile
)
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root)
const options = {
  ...parsed.options,
  noUnusedLocals: false,
  noUnusedParameters: false,
}
const host = ts.createCompilerHost(options)
const originalGetSourceFile = host.getSourceFile.bind(host)
host.getSourceFile = (
  fileName,
  languageVersion,
  onError,
  shouldCreateNewSourceFile
) => {
  const code = virtualFiles.get(fileName)
  return code !== undefined
    ? ts.createSourceFile(
        fileName,
        code,
        languageVersion,
        true,
        ts.ScriptKind.TSX
      )
    : originalGetSourceFile(
        fileName,
        languageVersion,
        onError,
        shouldCreateNewSourceFile
      )
}
const program = ts.createProgram([...virtualFiles.keys()], options, host)
const diagnostics = ts
  .getPreEmitDiagnostics(program)
  .filter(
    (diagnostic) =>
      diagnostic.file && virtualFiles.has(diagnostic.file.fileName)
  )
if (diagnostics.length) {
  console.error(
    ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getCurrentDirectory: () => root,
      getCanonicalFileName: (file) => file,
      getNewLine: () => "\n",
    })
  )
  process.exit(1)
}
console.log(
  `Verified ${allDocEntries.length} component references and typechecked ${virtualFiles.size} complete examples and playground templates.`
)
