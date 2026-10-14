import { createBundledHighlighter, createSingletonShorthands } from "shiki/core"
import { createJavaScriptRegexEngine } from "shiki/engine/javascript"
import type { CodeHighlighterPlugin } from "streamdown"

// Explicit imports keep hundreds of unrelated grammars and themes out of both
// the client build and Nitro's server bundle. Add languages here as needed.
const languages = {
  typescript: () => import("shiki/langs/typescript.mjs"),
  javascript: () => import("shiki/langs/javascript.mjs"),
  tsx: () => import("shiki/langs/tsx.mjs"),
  jsx: () => import("shiki/langs/jsx.mjs"),
  json: () => import("shiki/langs/json.mjs"),
  css: () => import("shiki/langs/css.mjs"),
  html: () => import("shiki/langs/html.mjs"),
  bash: () => import("shiki/langs/bash.mjs"),
  markdown: () => import("shiki/langs/markdown.mjs"),
  yaml: () => import("shiki/langs/yaml.mjs"),
  python: () => import("shiki/langs/python.mjs"),
  sql: () => import("shiki/langs/sql.mjs"),
  diff: () => import("shiki/langs/diff.mjs"),
}
const aliases: Record<string, keyof typeof languages> = {
  ts: "typescript",
  js: "javascript",
  sh: "bash",
  shell: "bash",
  zsh: "bash",
  md: "markdown",
  yml: "yaml",
  py: "python",
}
const themes = {
  "github-light": () => import("shiki/themes/github-light.mjs"),
  "github-dark": () => import("shiki/themes/github-dark.mjs"),
}
const highlighter = createSingletonShorthands(
  createBundledHighlighter({
    langs: languages,
    themes,
    engine: () => createJavaScriptRegexEngine({ forgiving: true }),
  })
)
const normalize = (language: string) =>
  aliases[language.trim().toLowerCase()] ?? language.trim().toLowerCase()
type Result = NonNullable<ReturnType<CodeHighlighterPlugin["highlight"]>>
const results = new Map<string, Result>()
const pending = new Map<string, Promise<Result>>()

export const code: CodeHighlighterPlugin = {
  name: "shiki",
  type: "code-highlighter",
  getSupportedLanguages: () =>
    [...Object.keys(languages), ...Object.keys(aliases)] as ReturnType<
      CodeHighlighterPlugin["getSupportedLanguages"]
    >,
  getThemes: () => ["github-light", "github-dark"],
  supportsLanguage: (language) => Object.hasOwn(languages, normalize(language)),
  highlight(options, callback) {
    const language = normalize(options.language)
    const key = JSON.stringify([language, options.themes, options.code])
    const cached = results.get(key)
    if (cached) return cached
    let task = pending.get(key)
    if (!task) {
      task = highlighter
        .codeToTokens(options.code, {
          lang: Object.hasOwn(languages, language) ? language : "text",
          themes: { light: options.themes[0], dark: options.themes[1] },
        })
        .then((result) => {
          results.set(key, result)
          // Streaming responses must not grow a permanent cache for every token.
          if (results.size > 64) results.delete(results.keys().next().value!)
          return result
        })
        .finally(() => pending.delete(key))
      pending.set(key, task)
    }
    void task
      .then((result) => callback?.(result))
      .catch((error) => {
        console.error("Code highlighting failed:", error)
      })
    return null
  },
}
