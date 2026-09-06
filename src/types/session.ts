export type Modality = "imperativo" | "evento"

export interface SessionRecord {
  id: string
  challengeId: string
  modality: Modality
  ageAtSession: number
  durationMs: number
  resuelto: boolean
  timestamp: string
}
