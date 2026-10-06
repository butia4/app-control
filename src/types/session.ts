export type Modality = "imperativo" | "evento"

export interface SessionRecord {
  id: string
  attemptNumber: number
  challengeId: string
  modality: Modality
  ageAtSession: number
  durationMs: number
  resuelto: boolean
  timestamp: string
  priorRoboticsExperience: boolean
  blockConfusion: boolean
}
