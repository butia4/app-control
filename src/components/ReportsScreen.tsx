import { ReportsTable } from "@/components/ReportsTable"
import { CsvExportButton } from "@/components/CsvExportButton"
import { useSessions } from "@/hooks/useSessions"
import { Card, CardContent } from "@/components/ui/card"

export function ReportsScreen() {
  const { sessions, updateSession, deleteSession } = useSessions()

  return (
    <div className="mx-auto max-w-3xl p-6">
      <Card>
        <CardContent className="flex flex-col gap-4 p-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold tracking-tight">Reportes</h1>
              <span className="text-sm text-muted-foreground">
                Intentos totales: {sessions.length}
              </span>
            </div>
            <CsvExportButton sessions={sessions} />
          </div>
          <ReportsTable
            sessions={sessions}
            onUpdateSession={updateSession}
            onDeleteSession={deleteSession}
          />
        </CardContent>
      </Card>
    </div>
  )
}
