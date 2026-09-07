import { useState } from "react"
import { ReportsTable } from "@/components/ReportsTable"
import { CsvExportButton } from "@/components/CsvExportButton"
import { getAll } from "@/lib/sessionsStore"
import { Card, CardContent } from "@/components/ui/card"
import type { SessionRecord } from "@/types/session"

export function ReportsScreen() {
  const [sessions] = useState<SessionRecord[]>(() => getAll())

  return (
    <div className="mx-auto max-w-3xl p-6">
      <Card>
        <CardContent className="flex flex-col gap-4 p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Reportes</h1>
            <CsvExportButton sessions={sessions} />
          </div>
          <ReportsTable sessions={sessions} />
        </CardContent>
      </Card>
    </div>
  )
}
