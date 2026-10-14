import fs from "node:fs"
import path from "node:path"
import ts from "typescript"
import { controlFor, generatePlayground } from "./design-system-playgrounds"

import { allDocEntries } from "../src/lib/design-system-registry"

// The local implementation is the API reference. Regenerate before dev/build so
// customized shadcn components never silently inherit an upstream contract.
const root = process.cwd()
const output = path.join(root, "src/lib/design-system/generated")
const customSources: Record<string, string> = {
  "m3-shapes": "components/m3-shapes/m3-shape.tsx",
  "footer-monogram": "components/brand/footer-monogram.tsx",
  "footer-gradients": "components/landing/footer-gradients.tsx",
  "monogram-patterns": "components/brand/monogram-patterns.tsx",
  scrollbars: "components/ui/custom-scrollbar.tsx",
  "mode-toggle": "components/mode-toggle.tsx",
  "theme-customizer": "components/theme-customizer.tsx",
  "site-header": "components/landing/site-header.tsx",
  "hero-section": "components/landing/hero-variations.tsx",
  "work-section": "components/landing/work-section.tsx",
  "skills-section": "components/landing/skills-section.tsx",
  "contact-section": "components/landing/contact-section.tsx",
  "ai-elements": "components/ai-elements/conversation.tsx",
  "chat-prompt-input": "components/ui/chat-prompt-input.tsx",
  "feature-card": "components/marketing/feature-card.tsx",
  "feature-card-grid": "components/marketing/feature-card-grid.tsx",
  "projects-showcase": "components/marketing/projects-showcase.tsx",
}
const sourcePaths = allDocEntries.map((entry) =>
  path.join(
    root,
    "src",
    customSources[entry.slug] ?? `components/ui/${entry.slug}.tsx`
  )
)
const config = ts.readConfigFile(
  path.join(root, "tsconfig.json"),
  ts.sys.readFile
)
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root)
const program = ts.createProgram(sourcePaths, parsed.options)
const checker = program.getTypeChecker()
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed })
const loaders = fs.readFileSync(
  path.join(root, "src/components/design-system/demos/index.tsx"),
  "utf8"
)
const demos = new Map(
  [
    ...loaders.matchAll(
      /(?:"([\w-]+)"|(\w+)):\s*\(\)\s*=>\s*import\("(.+?)"\)\.then\(\(m\)\s*=>\s*\(\{\s*default:\s*m\.(\w+)/g
    ),
  ].map((match) => [match[1] ?? match[2], { file: match[3], name: match[4] }])
)

function identifiers(node: ts.Node) {
  const names = new Set<string>()
  const visit = (child: ts.Node) => {
    if (ts.isIdentifier(child)) names.add(child.text)
    ts.forEachChild(child, visit)
  }
  visit(node)
  return names
}

// Include referenced local helpers, constants, types and just the imports used by
// an example. This also makes the copied chart / custom demos self-contained.
function exampleFor(slug: string, interactive = false) {
  const fixtures: Record<string, string> = {
    button: "ButtonPropDemo",
    avatar: "AvatarPropDemo",
    badge: "BadgePropDemo",
    input: "InputPropDemo",
    switch: "SwitchPropDemo",
    "m3-shapes": "M3ShapePropDemo",
    "footer-gradients": "FooterGradientsPropDemo",
    "monogram-patterns": "MonogramPatternPropDemo",
    "footer-monogram": "FooterMonogramPropDemo",
    "contact-section": "ContactSectionPropDemo",
  }
  const demo =
    interactive && fixtures[slug]
      ? { file: "./playground-fixtures", name: fixtures[slug] }
      : demos.get(slug)
  if (!demo) throw new Error(`Missing live example for ${slug}`)
  const file = path.join(
    root,
    "src/components/design-system/demos",
    `${demo.file}.tsx`
  )
  const source = ts.createSourceFile(
    file,
    fs.readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  )
  const declarations = new Map<string, ts.Statement>()
  for (const statement of source.statements) {
    if (
      (ts.isFunctionDeclaration(statement) ||
        ts.isTypeAliasDeclaration(statement) ||
        ts.isInterfaceDeclaration(statement)) &&
      statement.name
    ) {
      declarations.set(statement.name.text, statement)
    }
    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name))
          declarations.set(declaration.name.text, statement)
      }
    }
  }
  const selected = new Set<ts.Statement>()
  const used = new Set<string>()
  const include = (name: string) => {
    used.add(name)
    const statement = declarations.get(name)
    if (!statement || selected.has(statement)) return
    selected.add(statement)
    for (const identifier of identifiers(statement)) include(identifier)
  }
  include(demo.name)
  if (!selected.size) throw new Error(`Could not extract ${demo.name}`)
  const imports: string[] = []
  for (const statement of source.statements) {
    if (!ts.isImportDeclaration(statement)) continue
    const clause = statement.importClause
    if (!clause) continue
    const name =
      clause.name && used.has(clause.name.text) ? clause.name : undefined
    let bindings: ts.NamedImportBindings | undefined
    if (clause.namedBindings && ts.isNamedImports(clause.namedBindings)) {
      const elements = clause.namedBindings.elements.filter((element) =>
        used.has(element.name.text)
      )
      if (elements.length)
        bindings = ts.factory.updateNamedImports(clause.namedBindings, elements)
    } else if (
      clause.namedBindings &&
      used.has(clause.namedBindings.name.text)
    ) {
      bindings = clause.namedBindings
    }
    if (!name && !bindings) continue
    const updated = ts.factory.updateImportDeclaration(
      statement,
      statement.modifiers,
      ts.factory.updateImportClause(clause, clause.isTypeOnly, name, bindings),
      statement.moduleSpecifier,
      statement.attributes
    )
    imports.push(printer.printNode(ts.EmitHint.Unspecified, updated, source))
  }
  return {
    code: [
      '"use client"',
      ...imports,
      ...source.statements
        .filter((statement) => selected.has(statement))
        .map((statement) => statement.getText(source)),
    ].join("\n\n"),
    path: path.relative(root, file),
    name: demo.name,
  }
}

const behaviorProps = new Set([
  "children",
  "className",
  "style",
  "asChild",
  "render",
  "value",
  "defaultValue",
  "onValueChange",
  "checked",
  "defaultChecked",
  "onCheckedChange",
  "open",
  "defaultOpen",
  "onOpenChange",
  "disabled",
  "required",
  "name",
  "type",
  "orientation",
  "min",
  "max",
  "step",
  "multiple",
  "src",
  "alt",
  "delayMs",
  "delayDuration",
  "side",
  "align",
  "sideOffset",
  "modal",
  "onSelect",
  "onOpenAutoFocus",
  "onCloseAutoFocus",
  "onEscapeKeyDown",
  "onInteractOutside",
])
const nativeProps = new Set([
  "children",
  "className",
  "style",
  "disabled",
  "required",
  "name",
  "type",
  "src",
  "alt",
  "min",
  "max",
  "step",
])
// Important primitive contracts and form events must remain discoverable even
// when their declarations live in an upstream package rather than the wrapper.
for (const name of [
  "onClick",
  "onChange",
  "placeholder",
  "autoComplete",
  "readOnly",
  "htmlFor",
  "pressed",
  "defaultPressed",
  "onPressedChange",
  "collapsible",
  "loop",
  "activationMode",
  "dir",
  "mode",
  "selected",
  "startMonth",
  "endMonth",
  "numberOfMonths",
  "items",
  "itemToStringLabel",
  "itemToStringValue",
  "filter",
  "shouldFilter",
  "inputValue",
  "defaultInputValue",
  "onInputValueChange",
  "onValueCommit",
  "skipDelayDuration",
  "maxLength",
  "minLength",
])
  behaviorProps.add(name)
nativeProps.add("htmlFor")
const descriptions: Record<string, string> = {
  children: "Content rendered inside this part.",
  className: "Additional classes merged with the local styles using cn().",
  variant: "Visual treatment defined by the local component.",
  size: "Size preset defined by the local component.",
  asChild:
    "Compose onto a single child element instead of the default element.",
  render: "Element or render function used for composition by the primitive.",
  disabled:
    "Disable interaction. Supply surrounding context when the reason is not obvious.",
  value: "Controlled value. Pair with the matching change callback.",
  defaultValue: "Initial value for uncontrolled usage.",
  checked: "Controlled selection state.",
  defaultChecked: "Initial selection state for uncontrolled usage.",
  onCheckedChange: "Called when the selection state changes.",
  onValueChange: "Called when the value changes.",
  onClick: "Called when the action is activated by pointer or keyboard.",
  onChange:
    "Native input change event. Read event.target.value for the updated value.",
  placeholder: "A short input hint. Keep a separate visible label.",
  autoComplete: "A native autocomplete hint for the browser.",
  readOnly: "Keep the value readable and focusable while preventing editing.",
  htmlFor: "The id of the form control this label names.",
  pressed: "Controlled pressed state for a toggle.",
  defaultPressed: "Initial pressed state for an uncontrolled toggle.",
  onPressedChange: "Called when the pressed state changes.",
  collapsible: "Allow all accordion content to close in single mode.",
  items: "The collection of available choices.",
  selected: "The selected date or dates for the calendar's mode.",
  open: "Controlled visibility. Pair with onOpenChange.",
  defaultOpen: "Initial visibility for uncontrolled usage.",
  onOpenChange: "Called when visibility changes.",
  src: "Image resource URL.",
  alt: "Text alternative describing the image's purpose.",
  delayMs: "Delay in milliseconds before showing the fallback.",
  side: "Preferred side for the floating content.",
  sideOffset: "Distance between the trigger and floating content.",
  align: "Alignment relative to the trigger.",
  orientation: "Layout and keyboard interaction direction.",
  modal: "Whether the overlay uses modal interaction behavior.",
  type: "Element or primitive behavior. Check the declared type below.",
}

fs.mkdirSync(output, { recursive: true })
for (const [index, entry] of allDocEntries.entries()) {
  const file = program.getSourceFile(sourcePaths[index])
  if (!file) throw new Error(`Missing source: ${sourcePaths[index]}`)
  const moduleSymbol = checker.getSymbolAtLocation(file)
  if (!moduleSymbol) throw new Error(`No module exports: ${file.fileName}`)
  const source = file.getFullText()
  const exports = checker.getExportsOfModule(moduleSymbol)
  const parts = exports.flatMap((exportSymbol) => {
    if (!/^[A-Z]/.test(exportSymbol.name)) return []
    const symbol =
      exportSymbol.flags & ts.SymbolFlags.Alias
        ? checker.getAliasedSymbol(exportSymbol)
        : exportSymbol
    const declaration = symbol.valueDeclaration
    if (!declaration) return []
    const type = checker.getTypeOfSymbolAtLocation(symbol, declaration)
    const signature = type.getCallSignatures()[0]
    if (!signature) return []
    const parameter = signature.parameters[0]
    const propsType =
      parameter && checker.getTypeOfSymbolAtLocation(parameter, declaration)
    const defaults: Record<string, string> = {}
    let functionNode = ts.isVariableDeclaration(declaration)
      ? declaration.initializer
      : declaration
    // forwardRef/memo retain their render function's local parameter defaults.
    while (
      functionNode &&
      ts.isCallExpression(functionNode) &&
      /(?:^|\.)(?:forwardRef|memo)$/.test(functionNode.expression.getText())
    ) {
      functionNode = functionNode.arguments[0]
    }
    if (
      functionNode &&
      (ts.isFunctionDeclaration(functionNode) ||
        ts.isArrowFunction(functionNode) ||
        ts.isFunctionExpression(functionNode))
    ) {
      const binding = functionNode.parameters[0]?.name
      if (binding && ts.isObjectBindingPattern(binding)) {
        for (const element of binding.elements) {
          if (element.initializer)
            defaults[(element.propertyName ?? element.name).getText()] =
              element.initializer.getText()
        }
      }
    }
    // CVA defaults are separate from the function parameter defaults.
    const partText = functionNode?.getText() ?? ""
    for (const statement of file.statements) {
      if (!ts.isVariableStatement(statement)) continue
      for (const variable of statement.declarationList.declarations) {
        if (
          !partText.includes(variable.name.getText()) ||
          !variable.initializer ||
          !ts.isCallExpression(variable.initializer)
        )
          continue
        if (variable.initializer.expression.getText() !== "cva") continue
        const options = variable.initializer.arguments[1]
        if (!options || !ts.isObjectLiteralExpression(options)) continue
        const defaultVariants = options.properties.find(
          (property) => property.name?.getText() === "defaultVariants"
        )
        if (
          defaultVariants &&
          ts.isPropertyAssignment(defaultVariants) &&
          ts.isObjectLiteralExpression(defaultVariants.initializer)
        ) {
          for (const property of defaultVariants.initializer.properties) {
            if (ts.isPropertyAssignment(property))
              defaults[property.name.getText()] ??=
                property.initializer.getText()
          }
        }
      }
    }
    const properties = propsType ? checker.getPropertiesOfType(propsType) : []
    const rows = properties
      .filter((property) => {
        const local = property.declarations?.some(
          (node) => node.getSourceFile() === file
        )
        const required = !(property.flags & ts.SymbolFlags.Optional)
        const native = property.declarations?.every((node) =>
          node.getSourceFile().fileName.includes("@types/react/")
        )
        const usefulNative =
          nativeProps.has(property.name) ||
          (entry.slug === "button" && property.name === "onClick") ||
          ([
            "input",
            "textarea",
            "native-select",
            "input-group",
            "input-otp",
          ].includes(entry.slug) &&
            [
              "onChange",
              "placeholder",
              "autoComplete",
              "readOnly",
              "maxLength",
              "minLength",
            ].includes(property.name)) ||
          (["input", "textarea", "native-select"].includes(entry.slug) &&
            ["value", "defaultValue"].includes(property.name))
        return (
          !property.name.startsWith("__") &&
          (local ||
            !native ||
            required ||
            (behaviorProps.has(property.name) && (!native || usefulNative)) ||
            property.name in defaults)
        )
      })
      .map((property) => {
        const propType = checker.getTypeOfSymbolAtLocation(
          property,
          declaration
        )
        const comment = ts.displayPartsToString(
          property.getDocumentationComment(checker)
        )
        return {
          name: property.name,
          type: checker
            .typeToString(
              propType,
              declaration,
              ts.TypeFormatFlags.NoTruncation
            )
            .replace(/import\("[^"]+"\)\./g, "")
            .replace(/ \| undefined/g, ""),
          required:
            !(property.flags & ts.SymbolFlags.Optional) &&
            !(property.name in defaults),
          defaultValue: defaults[property.name] ?? null,
          description:
            comment ||
            descriptions[property.name] ||
            "See the declared TypeScript contract for this prop.",
          control: controlFor(
            propType,
            property.name,
            checker,
            exportSymbol.name
          ),
        }
      })
    rows.sort(
      (a, b) =>
        Number(b.defaultValue !== null) - Number(a.defaultValue !== null) ||
        Number(b.required) - Number(a.required) ||
        a.name.localeCompare(b.name)
    )
    const contract =
      functionNode &&
      (ts.isFunctionDeclaration(functionNode) ||
        ts.isArrowFunction(functionNode) ||
        ts.isFunctionExpression(functionNode))
        ? functionNode.parameters[0]?.type?.getText()
        : undefined
    return [
      {
        name: exportSymbol.name,
        contract:
          contract ??
          (propsType
            ? checker.typeToString(propsType, declaration)
            : "No props"),
        props: rows,
      },
    ]
  })
  const imports = file.statements
    .filter(ts.isImportDeclaration)
    .map((node) => (node.moduleSpecifier as ts.StringLiteral).text)
  const primitive = imports.includes("radix-ui")
    ? "Radix UI"
    : imports.includes("@base-ui/react")
      ? "Base UI"
      : imports.includes("vaul")
        ? "Vaul"
        : "Local component"
  const primaryNames: Record<string, string> = {
    chart: "ChartContainer",
    sonner: "Toaster",
    "input-otp": "InputOTP",
    "hero-section": "HeroRotatingCopy",
    "contact-section": "CtaSection",
    "monogram-patterns": "MonogramPattern",
    scrollbars: "CustomScrollbar",
    "ai-elements": "Conversation",
  }
  const primaryName =
    primaryNames[entry.slug] ??
    entry.slug
      .split("-")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join("")
  parts.sort(
    (a, b) => Number(b.name === primaryName) - Number(a.name === primaryName)
  )
  const interactiveExample = exampleFor(entry.slug, true)
  // Pattern docs use the same focused component for usage and the playground.
  // Legacy gallery demos include their own editors and hand-written API tables.
  const example = [
    "footer-gradients",
    "monogram-patterns",
    "footer-monogram",
    "contact-section",
  ].includes(entry.slug)
    ? interactiveExample
    : exampleFor(entry.slug)
  const playground = {
    ...generatePlayground(root, entry.slug, interactiveExample, parts),
    example: interactiveExample,
  }
  const data = {
    sourcePath: path.relative(root, file.fileName),
    importPath: `@/${path.relative(path.join(root, "src"), file.fileName).replace(/\.tsx?$/, "")}`,
    primitive,
    dependencies: imports.filter(
      (name) => !name.startsWith("@/") && name !== "react"
    ),
    exports: parts.map((part) => part.name),
    parts,
    slots: [
      ...new Set(
        [...source.matchAll(/data-slot="([\w-]+)"/g)].map((match) => match[1])
      ),
    ],
    tokens: [
      ...new Set(
        [
          ...source.matchAll(
            /(?:bg|text|border|ring|shadow)-(primary(?:-foreground)?|secondary(?:-foreground)?|muted(?:-foreground)?|accent(?:-foreground)?|destructive|background|foreground|border|input|ring|card(?:-foreground)?|popover(?:-foreground)?)(?![\w-])/g
          ),
        ].map((match) => `--${match[1]}`)
      ),
    ],
    example,
    playground,
  }
  const destination = path.join(output, `${entry.slug}.json`)
  const serialized = `${JSON.stringify(data, null, 2)}\n`
  // Avoid 71 unnecessary HMR events when prebuild runs next to a dev server.
  if (
    !fs.existsSync(destination) ||
    fs.readFileSync(destination, "utf8") !== serialized
  ) {
    fs.writeFileSync(destination, serialized)
  }
  // Keep implementation text out of the route loader and hydration payload.
  const sourceDirectory = path.join(output, "sources")
  fs.mkdirSync(sourceDirectory, { recursive: true })
  const sourceDestination = path.join(sourceDirectory, `${entry.slug}.json`)
  const sourceSerialized = `${JSON.stringify(source)}\n`
  if (
    !fs.existsSync(sourceDestination) ||
    fs.readFileSync(sourceDestination, "utf8") !== sourceSerialized
  )
    fs.writeFileSync(sourceDestination, sourceSerialized)
}
console.log(
  `Generated local API references and complete examples for ${allDocEntries.length} components.`
)
