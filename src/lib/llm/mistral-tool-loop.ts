/** @deprecated Import from @/lib/llm/tool-loop instead */
export {
  runMistralToolLoop,
  runToolLoop,
  streamCompletion,
  streamMistralCompletion,
  toApiMessages,
  toMistralApiMessages,
  type ToolLoopOptions,
} from "@/lib/llm/tool-loop"

/** @deprecated Use ToolLoopOptions */
export type { ToolLoopOptions as MistralToolLoopOptions } from "@/lib/llm/tool-loop"
