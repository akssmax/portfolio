import { CustomScrollbar } from "@/components/ui/custom-scrollbar"

const lines = Array.from({ length: 24 }, (_, index) => (
  <p key={index} className="text-sm text-muted-foreground">
    Scrollable line {index + 1} — thumb uses{" "}
    <code className="text-foreground">--primary</code> with a transparent track.
  </p>
))

export function ScrollbarDemo() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-2">
        <p className="text-sm font-medium">CustomScrollbar</p>
        <CustomScrollbar className="h-48 rounded-lg border border-border bg-card/40 p-4">
          <div className="space-y-3">{lines}</div>
        </CustomScrollbar>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Native overflow</p>
        <div className="custom-scrollbar h-48 overflow-y-auto rounded-lg border border-border bg-card/40 p-4">
          <div className="space-y-3">{lines}</div>
        </div>
      </div>
    </div>
  )
}
