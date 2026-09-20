"use client"

import * as React from "react"
import {
  ArrowRight,
  Bot,
  CalendarDays,
  Check,
  CirclePlay,
  Code2,
  Film,
  Layers3,
  MousePointer2,
  RotateCcw,
  ScanEye,
  Table2,
  WandSparkles,
} from "lucide-react"

import type { StoryChapter } from "@/lib/journey/story"

type Props = { chapter: StoryChapter }

const toolOptions = [
  {
    label: "Motion",
    icon: Film,
    detail: "A moving idea can explain more than a static frame.",
  },
  {
    label: "Vector",
    icon: WandSparkles,
    detail: "Shape, color, and composition became my first design language.",
  },
  {
    label: "Code",
    icon: Code2,
    detail: "A computer science degree made building feel possible, too.",
  },
]

const blockOptions = [
  { label: "Video", icon: CirclePlay },
  { label: "Table", icon: Table2 },
  { label: "Form", icon: Layers3 },
  { label: "Calendar", icon: CalendarDays },
]

const traceLines = [
  { code: "request.checkout(cart)", result: "request received" },
  { code: "applyDiscount(code)", result: "discount applied" },
  { code: "charge(total)", result: "unexpected null found" },
  { code: "return receipt", result: "execution stopped" },
]

function StageHeader({ label, hint }: { label: string; hint: string }) {
  return (
    <div className="journey-stage-header">
      <span className="journey-stage-label">
        <span className="journey-live-dot" /> {label}
      </span>
      <span className="journey-stage-hint">{hint}</span>
    </div>
  )
}

function StageNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="journey-stage-note" aria-live="polite">
      {children}
    </p>
  )
}

export function JourneyPlayground({ chapter }: Props) {
  const [selectedTool, setSelectedTool] = React.useState(0)
  const [wallpaper, setWallpaper] = React.useState(0)
  const [studio, setStudio] = React.useState(0)
  const [blocks, setBlocks] = React.useState<Array<string>>(["Video"])
  const [trace, setTrace] = React.useState(0)
  const [replay, setReplay] = React.useState(0)
  const [approval, setApproval] = React.useState(0)
  const [agentTasks, setAgentTasks] = React.useState<Array<string>>([
    "Find context",
  ])
  const [agentRun, setAgentRun] = React.useState(false)

  if (chapter.interaction === "tools") {
    const active = toolOptions[selectedTool]
    const Icon = active.icon
    return (
      <div className="journey-playground journey-tools">
        <StageHeader label="THE STARTING DESK" hint="Pick a tool" />
        <div className="journey-tool-display" aria-hidden="true">
          <div className="journey-tool-orbit journey-tool-orbit-one" />
          <div className="journey-tool-orbit journey-tool-orbit-two" />
          <div className="journey-tool-object">
            <Icon size={92} strokeWidth={1.6} />
          </div>
          <span className="journey-tool-spark journey-tool-spark-one">✳</span>
          <span className="journey-tool-spark journey-tool-spark-two">✦</span>
        </div>
        <div className="journey-choice-row">
          {toolOptions.map((tool, index) => (
            <button
              key={tool.label}
              type="button"
              className={`journey-choice ${selectedTool === index ? "is-active" : ""}`}
              onClick={() => setSelectedTool(index)}
              aria-pressed={selectedTool === index}
            >
              {tool.label}
            </button>
          ))}
        </div>
        <StageNote>{active.detail}</StageNote>
      </div>
    )
  }

  if (chapter.interaction === "wallpaper") {
    const themes = ["sunset", "mint", "night"]
    return (
      <div className="journey-playground journey-wallzy">
        <StageHeader label="WALLZY MINI STUDIO" hint="Try a wallpaper" />
        <div
          className={`journey-phone journey-phone-${themes[wallpaper]}`}
          aria-label={`${themes[wallpaper]} wallpaper preview`}
        >
          <span className="journey-phone-time">9:41</span>
          <div className="journey-wallpaper-shape shape-a" />
          <div className="journey-wallpaper-shape shape-b" />
          <div className="journey-wallpaper-shape shape-c" />
          <span className="journey-phone-word">Make it yours.</span>
          <span className="journey-phone-dock">● ● ● ●</span>
        </div>
        <div className="journey-choice-row" aria-label="Wallpaper treatments">
          {themes.map((theme, index) => (
            <button
              key={theme}
              type="button"
              className={`journey-choice ${wallpaper === index ? "is-active" : ""}`}
              onClick={() => setWallpaper(index)}
              aria-pressed={wallpaper === index}
            >
              {theme}
            </button>
          ))}
        </div>
        <StageNote>
          Wallpaper discovery, customization, and an identity made for a real
          Android app.
        </StageNote>
      </div>
    )
  }

  if (chapter.interaction === "studio") {
    const work =
      chapter.id === "freelance"
        ? ["Packaging", "Web", "App concept"]
        : ["Brand", "Print", "Motion"]
    return (
      <div className="journey-playground journey-studio">
        <StageHeader
          label={
            chapter.id === "freelance" ? "THE SIDE QUESTS" : "FIRST DESIGN DESK"
          }
          hint="Flip through the work"
        />
        <div
          className={`journey-studio-poster poster-${studio}`}
          aria-hidden="true"
        >
          <span className="journey-poster-star">✳</span>
          <span className="journey-poster-title">
            {work[studio]}
            <br />
            in progress.
          </span>
          <span className="journey-poster-stamp">AS / {chapter.year}</span>
        </div>
        <div className="journey-choice-row">
          {work.map((label, index) => (
            <button
              key={label}
              type="button"
              className={`journey-choice ${studio === index ? "is-active" : ""}`}
              onClick={() => setStudio(index)}
              aria-pressed={studio === index}
            >
              {label}
            </button>
          ))}
        </div>
        <StageNote>
          {chapter.id === "freelance"
            ? "Packaging, websites, and concepts made alongside Tulr."
            : "One internship, many mediums. Each project stretched a different muscle."}
        </StageNote>
      </div>
    )
  }

  if (chapter.interaction === "blocks") {
    function toggleBlock(label: string) {
      setBlocks((current) =>
        current.includes(label)
          ? current.filter((item) => item !== label)
          : [...current, label]
      )
    }
    return (
      <div className="journey-playground journey-blocks">
        <StageHeader
          label="BUILD A TULR WORKFLOW"
          hint="Add or remove blocks"
        />
        <div className="journey-builder">
          <div className="journey-builder-top">
            <span className="journey-builder-dots">● ● ●</span>
            <span>untitled workflow</span>
            <span>↗</span>
          </div>
          <div className="journey-builder-canvas">
            {blocks.length === 0 ? (
              <span className="journey-builder-empty">
                A blank canvas. Pick a block below.
              </span>
            ) : (
              blocks.map((label, index) => {
                const Icon =
                  blockOptions.find((block) => block.label === label)?.icon ??
                  Layers3
                return (
                  <React.Fragment key={label}>
                    {index > 0 ? (
                      <ArrowRight size={18} aria-hidden="true" />
                    ) : null}
                    <div className="journey-builder-block">
                      <Icon size={22} />
                      <span>{label}</span>
                    </div>
                  </React.Fragment>
                )
              })
            )}
          </div>
        </div>
        <div className="journey-choice-row">
          {blockOptions.map((block) => (
            <button
              key={block.label}
              type="button"
              className={`journey-choice ${blocks.includes(block.label) ? "is-active" : ""}`}
              onClick={() => toggleBlock(block.label)}
              aria-pressed={blocks.includes(block.label)}
            >
              {block.label}
            </button>
          ))}
        </div>
        <StageNote>
          {blocks.length
            ? `${blocks.length} connected building block${blocks.length === 1 ? "" : "s"}. Tulr made workflows composable without code.`
            : "Choose a block to start a workflow."}
        </StageNote>
      </div>
    )
  }

  if (chapter.interaction === "trace") {
    return (
      <div className="journey-playground journey-trace">
        <StageHeader
          label="VIDEOBUG / TIME TRAVEL"
          hint="Scrub the execution"
        />
        <div className="journey-code-window">
          <div className="journey-code-top">
            <span>● ● ●</span>
            <span>Checkout.java</span>
            <span>↶</span>
          </div>
          {traceLines.map((line, index) => (
            <div
              key={line.code}
              className={`journey-code-line ${trace === index ? "is-current" : ""}`}
            >
              <span>{String(index + 21).padStart(2, "0")}</span>
              <code>{line.code}</code>
              {trace === index ? (
                <ScanEye size={16} aria-label="Current line" />
              ) : null}
            </div>
          ))}
        </div>
        <div className="journey-scrubber">
          <RotateCcw size={18} aria-hidden="true" />
          <input
            aria-label="Rewind recorded code execution"
            type="range"
            min="0"
            max="3"
            value={trace}
            onChange={(event) => setTrace(Number(event.target.value))}
          />
          <span>{trace + 1}/4</span>
        </div>
        <StageNote>
          Recorded result: {traceLines[trace].result}. Videobug let developers
          inspect what already happened.
        </StageNote>
      </div>
    )
  }

  if (chapter.interaction === "replay") {
    const steps = [
      "Recorded traffic",
      "Mocked calls",
      "Test replayed",
      "Result inspected",
    ]
    return (
      <div className="journey-playground journey-replay">
        <StageHeader label="UNLOGGED / REPLAY LAB" hint="Run the next step" />
        <div className="journey-replay-graphic" aria-hidden="true">
          <div className="journey-replay-core">
            <CirclePlay size={72} strokeWidth={1.6} />
          </div>
          <span className="journey-replay-ring ring-one" />
          <span className="journey-replay-ring ring-two" />
        </div>
        <div className="journey-replay-steps">
          {steps.map((step, index) => (
            <span key={step} className={index <= replay ? "is-done" : ""}>
              {index <= replay ? (
                <Check size={13} />
              ) : (
                <span className="journey-step-dot" />
              )}
              {step}
            </span>
          ))}
        </div>
        <button
          type="button"
          className="journey-action-button"
          onClick={() =>
            setReplay((currentStep) => (currentStep + 1) % steps.length)
          }
        >
          <CirclePlay size={18} />
          {replay === steps.length - 1 ? "Replay again" : "Run next step"}
        </button>
        <StageNote>
          {steps[replay]}. Unlogged turned recorded behavior into something
          developers could test.
        </StageNote>
      </div>
    )
  }

  if (chapter.interaction === "approval") {
    const steps = ["Request", "Manager review", "Finance approval", "Paid"]
    return (
      <div className="journey-playground journey-approval">
        <StageHeader
          label="KODO / SPEND FLOW"
          hint="Move the request forward"
        />
        <div className="journey-invoice">
          <span className="journey-invoice-kicker">
            PURCHASE REQUEST <span>№ 1042</span>
          </span>
          <span className="journey-invoice-amount">
            ₹ 48,500<span>.00</span>
          </span>
          <span className="journey-invoice-caption">
            Team equipment · Awaiting action
          </span>
          <div className="journey-invoice-rule" />
          {steps.map((step, index) => (
            <div
              className={`journey-approval-step ${index <= approval ? "is-done" : ""}`}
              key={step}
            >
              <span>{index <= approval ? <Check size={15} /> : index + 1}</span>
              {step}
            </div>
          ))}
        </div>
        <button
          type="button"
          className="journey-action-button"
          onClick={() => setApproval((step) => (step + 1) % steps.length)}
        >
          <Check size={17} />
          {approval === steps.length - 1 ? "Start again" : "Approve next"}
        </button>
        <StageNote>
          {steps[approval]}: complex finance work made visible, controlled, and
          understandable.
        </StageNote>
      </div>
    )
  }

  const tasks = ["Find context", "Open tabs", "Summarize", "Take action"]
  function toggleTask(label: string) {
    setAgentRun(false)
    setAgentTasks((currentTasks) =>
      currentTasks.includes(label)
        ? currentTasks.filter((task) => task !== label)
        : [...currentTasks, label]
    )
  }
  return (
    <div className="journey-playground journey-agent">
      <StageHeader
        label="100x.bot / AGENT BUILDER"
        hint="Choose tasks, then run"
      />
      <div className="journey-agent-avatar" aria-hidden="true">
        <Bot size={70} strokeWidth={1.7} />
        <span className="journey-agent-spark">✳</span>
      </div>
      <div className="journey-choice-row">
        {tasks.map((task) => (
          <button
            key={task}
            type="button"
            className={`journey-choice ${agentTasks.includes(task) ? "is-active" : ""}`}
            onClick={() => toggleTask(task)}
            aria-pressed={agentTasks.includes(task)}
          >
            {task}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="journey-action-button"
        disabled={agentTasks.length === 0}
        onClick={() => setAgentRun(true)}
      >
        <MousePointer2 size={18} />
        Run the agent
      </button>
      <StageNote>
        {agentRun
          ? `Agent ready: ${agentTasks.join(" → ")}.`
          : agentTasks.length
            ? `${agentTasks.length} task${agentTasks.length === 1 ? "" : "s"} queued. Design makes the agent's actions understandable.`
            : "Choose at least one task."}
      </StageNote>
    </div>
  )
}
