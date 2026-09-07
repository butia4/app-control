import { Button } from "@/components/ui/button"
import type { StopwatchApi } from "@/hooks/useStopwatch"

interface StopwatchControlsProps {
  stopwatch: StopwatchApi
  canStart: boolean
  onStart: () => void
  onFinalize: () => void
  onReset: () => void
  thresholdMs: number | null
}

function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`
}

export function StopwatchControls({
  stopwatch,
  canStart,
  onStart,
  onFinalize,
  onReset,
  thresholdMs,
}: StopwatchControlsProps) {
  const { status, elapsedMs, pause, resume } = stopwatch
  const isOvertime = thresholdMs != null && elapsedMs > thresholdMs

  return (
    <div className="flex flex-col gap-2">
      <span
        className={`font-mono text-5xl tabular-nums ${
          isOvertime ? "text-destructive" : ""
        }`}
      >
        {formatElapsed(elapsedMs)}
      </span>
      {(status === "running" || status === "paused") &&
        thresholdMs != null && (
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">
              Tiempo máximo: {formatElapsed(thresholdMs)}
            </span>
            <div className="h-2 w-full rounded-full bg-muted">
              <div
                className={`h-2 rounded-full ${
                  isOvertime ? "bg-destructive" : "bg-primary"
                }`}
                style={{
                  width: `${Math.min(elapsedMs / thresholdMs, 1) * 100}%`,
                }}
              />
            </div>
          </div>
        )}
      <div className="flex gap-2">
        {status === "idle" && (
          <Button type="button" disabled={!canStart} onClick={onStart}>
            Start
          </Button>
        )}
        {status === "running" && (
          <>
            <Button type="button" variant="outline" onClick={pause}>
              Pausar
            </Button>
            <Button type="button" onClick={onFinalize}>
              Terminar
            </Button>
          </>
        )}
        {status === "paused" && (
          <>
            <Button type="button" variant="outline" onClick={resume}>
              Reanudar
            </Button>
            <Button type="button" onClick={onFinalize}>
              Terminar
            </Button>
          </>
        )}
        {status === "finished" && (
          <>
            <Button type="button" disabled>
              Terminar
            </Button>
            <Button type="button" variant="outline" onClick={onReset}>
              Nuevo intento
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
