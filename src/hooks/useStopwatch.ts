import { useCallback, useEffect, useRef, useState } from "react"

export type StopwatchStatus = "idle" | "running" | "paused" | "finished"

export interface StopwatchApi {
  elapsedMs: number
  status: StopwatchStatus
  start: () => void
  pause: () => void
  resume: () => void
  finalize: () => { durationMs: number }
  reset: () => void
}

const TICK_INTERVAL_MS = 100

export function useStopwatch(): StopwatchApi {
  const [status, setStatus] = useState<StopwatchStatus>("idle")
  const [elapsedMs, setElapsedMs] = useState(0)

  // Accumulated duration from completed running spans (excludes paused time).
  const accumulatedMsRef = useRef(0)
  // performance.now() timestamp when the current running span started.
  const runStartRef = useRef<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTick = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const currentElapsed = useCallback(() => {
    const runStart = runStartRef.current
    if (runStart === null) return accumulatedMsRef.current
    return accumulatedMsRef.current + (performance.now() - runStart)
  }, [])

  useEffect(() => {
    return clearTick
  }, [clearTick])

  const start = useCallback(() => {
    if (status !== "idle") return
    accumulatedMsRef.current = 0
    runStartRef.current = performance.now()
    setElapsedMs(0)
    setStatus("running")
    clearTick()
    intervalRef.current = setInterval(() => {
      setElapsedMs(currentElapsed())
    }, TICK_INTERVAL_MS)
  }, [status, clearTick, currentElapsed])

  const pause = useCallback(() => {
    if (status !== "running") return
    accumulatedMsRef.current = currentElapsed()
    runStartRef.current = null
    clearTick()
    setElapsedMs(accumulatedMsRef.current)
    setStatus("paused")
  }, [status, clearTick, currentElapsed])

  const resume = useCallback(() => {
    if (status !== "paused") return
    runStartRef.current = performance.now()
    setStatus("running")
    clearTick()
    intervalRef.current = setInterval(() => {
      setElapsedMs(currentElapsed())
    }, TICK_INTERVAL_MS)
  }, [status, clearTick, currentElapsed])

  const finalize = useCallback((): { durationMs: number } => {
    const durationMs = currentElapsed()
    accumulatedMsRef.current = durationMs
    runStartRef.current = null
    clearTick()
    setElapsedMs(durationMs)
    setStatus("finished")
    return { durationMs }
  }, [clearTick, currentElapsed])

  const reset = useCallback(() => {
    accumulatedMsRef.current = 0
    runStartRef.current = null
    clearTick()
    setElapsedMs(0)
    setStatus("idle")
  }, [clearTick])

  return { elapsedMs, status, start, pause, resume, finalize, reset }
}
