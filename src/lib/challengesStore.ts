import { challenges as defaultChallenges } from "@/data/challenges"

export const STORAGE_KEY = "app-control:challenge-thresholds"

type ThresholdOverrides = Record<string, number>

function readOverrides(): ThresholdOverrides {
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return {}

  try {
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== "object" || parsed === null) return {}
    return parsed as ThresholdOverrides
  } catch {
    return {}
  }
}

function writeOverrides(overrides: ThresholdOverrides): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
}

export function getAll() {
  const overrides = readOverrides()
  return defaultChallenges.map((challenge) => ({
    ...challenge,
    thresholdMs: overrides[challenge.id] ?? challenge.thresholdMs,
  }))
}

export function setThreshold(challengeId: string, thresholdMs: number): void {
  const overrides = readOverrides()
  overrides[challengeId] = thresholdMs
  writeOverrides(overrides)
}
