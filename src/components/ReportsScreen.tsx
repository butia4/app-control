import { useState } from "react"
import { ReportsTable } from "@/components/ReportsTable"
import { CsvExportButton } from "@/components/CsvExportButton"
import { getAll } from "@/lib/sessionsStore"
import type { SessionRecord } from "@/types/session"

export function ReportsScreen() {
  const [sessions] = useState<SessionRecord[]>(() => getAll())

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Reportes</h1>
        <CsvExportButton sessions={sessions} />
      </div>
      <ReportsTable sessions={sessions} />
    </div>
  )
}
