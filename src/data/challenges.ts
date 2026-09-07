export interface Challenge {
  id: string
  name: string
  thresholdMs: number
}

export const challenges: Challenge[] = [
  { id: "desafio-1", name: "Desafío 1", thresholdMs: 60_000 },
  { id: "desafio-2", name: "Desafío 2", thresholdMs: 60_000 },
]
