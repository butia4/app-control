import { useCallback, useState } from "react"
import { getAll, setThreshold } from "@/lib/challengesStore"
import type { Challenge } from "@/data/challenges"

export interface UseChallengesApi {
  challenges: Challenge[]
  updateThreshold: (challengeId: string, thresholdMs: number) => void
}

export function useChallenges(): UseChallengesApi {
  const [challenges, setChallenges] = useState<Challenge[]>(() => getAll())

  const updateThreshold = useCallback(
    (challengeId: string, thresholdMs: number) => {
      setThreshold(challengeId, thresholdMs)
      setChallenges(getAll())
    },
    []
  )

  return { challenges, updateThreshold }
}
