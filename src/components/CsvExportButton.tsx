import { Button } from "@/components/ui/button"
import { downloadCsv, sessionsToCsv } from "@/lib/csv"
import type { SessionRecord } from "@/types/session"

interface CsvExportButtonProps {
  sessions: SessionRecord[]
}

export function CsvExportButton({ sessions }: CsvExportButtonProps) {
  const handleExport = () => {
    const csv = sessionsToCsv(sessions)
    downloadCsv("sessions.csv", csv)
  }

  return (
    <Button type="button" variant="outline" onClick={handleExport}>
      Exportar CSV
    </Button>
  )
}
