import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { challenges } from "@/data/challenges"
import type { SessionRecord } from "@/types/session"

interface ReportsTableProps {
  sessions: SessionRecord[]
}

function challengeName(challengeId: string): string {
  return (
    challenges.find((challenge) => challenge.id === challengeId)?.name ??
    challengeId
  )
}

export function ReportsTable({ sessions }: ReportsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Desafío</TableHead>
          <TableHead>Modalidad</TableHead>
          <TableHead>Edad</TableHead>
          <TableHead>Duración (ms)</TableHead>
          <TableHead>Resuelto</TableHead>
          <TableHead>Fecha</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sessions.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-muted-foreground">
              No hay sesiones registradas todavía.
            </TableCell>
          </TableRow>
        ) : (
          sessions.map((session) => (
            <TableRow key={session.id}>
              <TableCell>{challengeName(session.challengeId)}</TableCell>
              <TableCell>{session.modality}</TableCell>
              <TableCell>{session.ageAtSession}</TableCell>
              <TableCell>{session.durationMs}</TableCell>
              <TableCell>{session.resuelto ? "Sí" : "No"}</TableCell>
              <TableCell>
                {new Date(session.timestamp).toLocaleString()}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
