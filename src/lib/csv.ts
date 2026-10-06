import type { SessionRecord } from "@/types/session"

const CSV_HEADERS = [
  "attemptNumber",
  "challengeId",
  "modality",
  "ageAtSession",
  "durationMs",
  "resuelto",
  "timestamp",
  "priorRoboticsExperience",
  "blockConfusion",
] as const

function escapeCsvField(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function sessionsToCsv(sessions: SessionRecord[]): string {
  const header = CSV_HEADERS.join(",")
  const rows = sessions.map((session) =>
    CSV_HEADERS.map((field) => escapeCsvField(String(session[field]))).join(
      ","
    )
  )
  return [header, ...rows].join("\n")
}

export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}
