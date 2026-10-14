import fs from "node:fs"
import path from "node:path"
import ts from "typescript"

export function controlFor(
  type: ts.Type,
  name: string,
  checker: ts.TypeChecker,
  owner = ""
) {
  const text = checker.typeToString(type)
  if (name === "children" && owner === "ChatPromptInput")
    return {
      kind: "readonly",
      reason:
        "The composer renders its own input and actions. Place extra content in the surrounding container.",
    }
  if (
    name === "children" &&
    ["MonogramPattern", "MiniMonogram"].includes(owner)
  )
    return {
      kind: "readonly",
      reason:
        "The pattern renders its own marks. Place content in the surrounding container.",
    }
  if (owner === "Calendar" && ["mode", "required"].includes(name))
    return {
      kind: "readonly",
      reason:
        "Selection contract · change the calendar mode and its state together in code.",
    }
  if (
    owner === "Calendar" &&
    ["selected", "month", "defaultMonth", "startMonth", "endMonth"].includes(
      name
    )
  )
    return { kind: "date" }
  if (
    name === "children" &&
    ["Input", "InputGroupInput", "Textarea"].includes(owner)
  )
    return {
      kind: "readonly",
      reason: "Native text field · use value or defaultValue for its content.",
    }
  if (["asChild", "render", "ref", "components", "icons"].includes(name))
    return {
      kind: "readonly",
      reason: "Composition prop · configure the element in code.",
    }
  if (name.startsWith("on") && text.includes("=>"))
    return {
      kind: "event",
      reason: "Interact with the preview to observe this callback.",
    }
  if (name === "children" && !text.includes("=>")) return { kind: "text" }
  if (text.includes("ReactNode") && !text.includes("=>"))
    return { kind: "text" }
  if (
    /\b(?:HTML\w*Element|SVG\w*Element|DocumentFragment|RefObject)\b/.test(text)
  )
    return {
      kind: "readonly",
      reason: "DOM reference · configure this prop in code.",
    }
  if (/ReactElement|JSX\.Element|ComponentType|ElementType/.test(text))
    return {
      kind: "readonly",
      reason: "React composition · supply the element or component in code.",
    }
  const types = (type.isUnion() ? type.types : [type]).filter(
    (item) => !(item.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null))
  )
  if (
    types.length &&
    types.every((item) => !!(item.flags & ts.TypeFlags.BooleanLiteral))
  )
    return { kind: "boolean" }
  if (
    types.length &&
    types.every(
      (item) =>
        item.isStringLiteral() ||
        item.isNumberLiteral() ||
        !!(item.flags & ts.TypeFlags.BooleanLiteral)
    )
  )
    return {
      kind: "enum",
      options: types.map((item) =>
        item.isStringLiteral() || item.isNumberLiteral()
          ? item.value
          : checker.typeToString(item) === "true"
      ),
    }
  if (
    types.some((item) => !!(item.flags & ts.TypeFlags.Boolean)) &&
    types.every(
      (item) =>
        !!(item.flags & (ts.TypeFlags.Boolean | ts.TypeFlags.BooleanLiteral))
    )
  )
    return { kind: "boolean" }
  if (types.every((item) => !!(item.flags & ts.TypeFlags.NumberLike)))
    return { kind: "number" }
  if (
    types.every((item) =>
      checker.isTypeAssignableTo(item, checker.getStringType())
    )
  )
    return { kind: "text" }
  if (text.includes("=>"))
    return {
      kind: "readonly",
      reason: "Render function · configure this in code.",
    }
  return { kind: "json" }
}

function writeChanged(destination: string, contents: string) {
  if (
    !fs.existsSync(destination) ||
    fs.readFileSync(destination, "utf8") !== contents
  )
    fs.writeFileSync(destination, contents)
}

export function generatePlayground(
  root: string,
  slug: string,
  example: { code: string; name: string },
  parts: {
    name: string
    props: { name: string; control?: { kind: string } }[]
  }[]
) {
  const source = ts.createSourceFile(
    "example.tsx",
    example.code,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  )
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed })
  const available = new Map(parts.map((part) => [part.name, part]))
  const bindings = new Map<string, string>()
  const imports: ts.Statement[] = []
  for (const statement of source.statements) {
    if (
      !ts.isImportDeclaration(statement) ||
      !statement.importClause?.namedBindings ||
      !ts.isNamedImports(statement.importClause.namedBindings)
    ) {
      imports.push(statement)
      continue
    }
    const elements = statement.importClause.namedBindings.elements.map(
      (element) => {
        const original = (element.propertyName ?? element.name).text
        if (!available.has(original) || element.isTypeOnly) return element
        const local = element.name.text
        let rendered = false
        const visit = (node: ts.Node) => {
          if (
            (ts.isJsxOpeningElement(node) ||
              ts.isJsxSelfClosingElement(node)) &&
            node.tagName.getText(source) === local
          )
            rendered = true
          ts.forEachChild(node, visit)
        }
        visit(source)
        if (!rendered) return element
        bindings.set(local, original)
        return ts.factory.createImportSpecifier(
          false,
          element.propertyName ?? element.name,
          ts.factory.createIdentifier(`Original${local}`)
        )
      }
    )
    imports.push(
      ts.factory.updateImportDeclaration(
        statement,
        statement.modifiers,
        ts.factory.updateImportClause(
          statement.importClause,
          statement.importClause.isTypeOnly,
          statement.importClause.name,
          ts.factory.updateNamedImports(
            statement.importClause.namedBindings,
            elements
          )
        ),
        statement.moduleSpecifier,
        statement.attributes
      )
    )
  }
  const renderedParts = [...new Set(bindings.values())]
  const headers = imports.filter(
    (node) =>
      ts.isImportDeclaration(node) ||
      (ts.isExpressionStatement(node) && ts.isStringLiteral(node.expression))
  )
  const body = imports.filter((node) => !headers.includes(node))
  const moduleCode = [
    ...headers.map((node) =>
      printer.printNode(ts.EmitHint.Unspecified, node, source)
    ),
    `import { withPlaygroundProps } from "@/components/design-system/playground-context"`,
    ...[...bindings].map(
      ([local, original]) =>
        `const ${local} = withPlaygroundProps(Original${local}, ${JSON.stringify(original)})`
    ),
    ...body.map((node) =>
      printer.printNode(ts.EmitHint.Unspecified, node, source)
    ),
    `export default ${example.name}`,
  ].join("\n\n")
  const output = path.join(
    root,
    "src/components/design-system/generated-playgrounds"
  )
  fs.mkdirSync(output, { recursive: true })
  writeChanged(
    path.join(output, `${slug}.tsx`),
    `// Generated by npm run docs:generate. Edit the source demo instead.\n${moduleCode}\n`
  )
  const templates: Record<string, string> = {}
  for (const [local, original] of bindings) {
    const overrides: string[] = []
    const replacements: { start: number; end: number; text: string }[] = []
    const editableChildren = available
      .get(original)
      ?.props.some(
        (prop) => prop.name === "children" && prop.control?.kind === "text"
      )
    const visit = (node: ts.Node) => {
      if (
        (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) &&
        node.tagName.getText(source) === local
      ) {
        replacements.push({
          start: node.attributes.end,
          end: node.attributes.end,
          text: " {...playgroundProps}",
        })
      }
      if (
        editableChildren &&
        ts.isJsxElement(node) &&
        node.openingElement.tagName.getText(source) === local
      ) {
        replacements.push({
          start: node.openingElement.end,
          end: node.closingElement.getStart(source),
          text: `{playgroundProps.children ?? <>${example.code.slice(node.openingElement.end, node.closingElement.getStart(source))}</>}`,
        })
        ts.forEachChild(node.openingElement, visit)
        return
      }
      ts.forEachChild(node, visit)
    }
    visit(source)
    let code = example.code
    for (const replacement of replacements.sort((a, b) => b.start - a.start))
      code =
        code.slice(0, replacement.start) +
        replacement.text +
        code.slice(replacement.end)
    // Keep the directive first. TypeScript annotation makes empty overrides valid.
    code = code.replace(/^"use client"\s*/, "")
    overrides.push(
      `"use client"\n\nimport type { ComponentProps as PlaygroundComponentProps } from "react"`
    )
    // The declaration can follow imports; imported component names remain in scope.
    const transformed = ts.createSourceFile(
      "template.tsx",
      code,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX
    )
    const lastImport = [...transformed.statements]
      .filter(ts.isImportDeclaration)
      .at(-1)
    const insert = lastImport?.end ?? 0
    const propType =
      original === "Calendar"
        ? `Extract<PlaygroundComponentProps<typeof ${local}>, { mode: "single"; required?: false }>`
        : `PlaygroundComponentProps<typeof ${local}>`
    templates[original] =
      overrides.join("\n") +
      "\n" +
      code.slice(0, insert) +
      `\n\nconst playgroundProps: Partial<${propType}> = /*__DS_PROPS__*/ {}\n` +
      code.slice(insert)
  }
  return { parts: renderedParts, templates }
}
