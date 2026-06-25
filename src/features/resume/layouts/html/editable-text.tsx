import type { FocusEvent, HTMLAttributes, KeyboardEvent } from "react"
import { cn } from "@/lib/utils"

type EditableTextProps = Omit<HTMLAttributes<HTMLElement>, "onChange"> & {
  value: string
  onChange?: (val: string) => void
  tagName?: "span" | "p" | "h1" | "h2" | "h3" | "h4" | "a"
  singleLine?: boolean
  placeholder?: string
}

export function EditableText({
  value,
  onChange,
  tagName: Tag = "span",
  singleLine = true,
  className,
  placeholder,
  ...props
}: EditableTextProps) {
  const isEditable = Boolean(onChange)

  const handleBlur = (e: FocusEvent<HTMLElement>) => {
    if (!onChange) return
    const text = e.currentTarget.textContent ?? ""
    if (text !== value) {
      onChange(text)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (singleLine && e.key === "Enter") {
      e.preventDefault()
      e.currentTarget.blur()
    }
  }

  return (
    <Tag
      contentEditable={isEditable}
      suppressContentEditableWarning={isEditable}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      data-placeholder={placeholder}
      className={cn(
        className,
        isEditable && "outline-none focus:bg-neutral-100 hover:bg-neutral-50/80 rounded px-0.5 cursor-text transition-colors"
      )}
      {...props}
    >
      {value}
    </Tag>
  )
}
