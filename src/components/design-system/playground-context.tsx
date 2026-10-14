import { createContext, createElement, useContext, useEffect } from "react"
import type { ElementType } from "react"

export type PlaygroundValues = Record<string, unknown>
export type PlaygroundRuntime = {
  part: string
  values: PlaygroundValues
  events: string[]
  resetKey: number
  observe: (part: string, props: PlaygroundValues) => void
  event: (name: string, value: unknown) => void
  update: (name: string, value: unknown) => void
}
export const PlaygroundContext = createContext<PlaygroundRuntime | null>(null)

export function withPlaygroundProps<T extends ElementType>(
  Original: T,
  name: string
): T {
  function Controlled(props: PlaygroundValues) {
    const runtime = useContext(PlaygroundContext)
    const selected = runtime?.part === name
    useEffect(() => {
      if (selected) runtime?.observe(name, props)
    }, [selected, runtime?.resetKey]) // Capture the example's first instance, not every render.
    if (!runtime || !selected) return createElement(Original, props)
    const merged = { ...props, ...runtime.values }
    for (const event of runtime.events) {
      const original = props[event]
      merged[event] = (...args: unknown[]) => {
        runtime.event(event, args[0])
        if (event === "onChange" && Object.hasOwn(runtime.values, "value")) {
          const target = (args[0] as { target?: { value?: unknown } })?.target
          if (target) runtime.update("value", target.value)
        }
        const stateProp: Record<string, string> = {
          onValueChange: "value",
          onModeChange: "mode",
          onCheckedChange: "checked",
          onPressedChange: "pressed",
          onOpenChange: "open",
          onInputValueChange: "inputValue",
          onSelect: "selected",
        }
        if (stateProp[event] && Object.hasOwn(runtime.values, stateProp[event]))
          runtime.update(stateProp[event], args[0])
        if (typeof original === "function") return original(...args)
      }
    }
    // Native text controls remain editable when their value is overridden.
    if (
      Object.hasOwn(runtime.values, "value") &&
      !merged.onChange &&
      name.match(/Input|Textarea|NativeSelect/)
    )
      merged.onChange = (event: { target: { value: unknown } }) =>
        runtime.update("value", event.target.value)
    return createElement(Original, merged)
  }
  Controlled.displayName = `Playground(${name})`
  return Controlled as unknown as T
}
