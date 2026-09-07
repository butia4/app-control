import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
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
  if (sessions.length === 0) {
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
          <TableRow>
            <TableCell colSpan={6} className="text-center text-muted-foreground">
              No hay sesiones registradas todavía.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
  }

  return (
    <>
      <Table className="hidden md:table">
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
          {sessions.map((session) => (
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
          ))}
        </TableBody>
      </Table>

      <div className="flex flex-col gap-3 md:hidden">
        {sessions.map((session) => (
          <Card key={session.id}>
            <CardContent className="flex flex-col gap-1 p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  {challengeName(session.challengeId)}
                </span>
                <span className="text-sm text-muted-foreground">
                  {session.modality}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                Edad: {session.ageAtSession}
              </span>
              <span className="text-sm text-muted-foreground">
                Duración: {session.durationMs} ms
              </span>
              <span className="text-sm text-muted-foreground">
                Resuelto: {session.resuelto ? "Sí" : "No"}
              </span>
              <span className="text-sm text-muted-foreground">
                Fecha: {new Date(session.timestamp).toLocaleString()}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
