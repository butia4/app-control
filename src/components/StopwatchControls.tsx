import { Button } from "@/components/ui/button"
import type { StopwatchApi } from "@/hooks/useStopwatch"

interface StopwatchControlsProps {
  stopwatch: StopwatchApi
  canStart: boolean
  onStart: () => void
  onFinalize: () => void
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
}: StopwatchControlsProps) {
  const { status, elapsedMs, pause, resume } = stopwatch

  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-5xl tabular-nums">
        {formatElapsed(elapsedMs)}
      </span>
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
          <Button type="button" disabled>
            Terminar
          </Button>
        )}
      </div>
    </div>
  )
}
