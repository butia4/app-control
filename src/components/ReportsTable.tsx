import { useState } from "react"
import { toast } from "sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { EditSessionDialog } from "@/components/EditSessionDialog"
import { challenges } from "@/data/challenges"
import type { SessionRecord } from "@/types/session"

interface ReportsTableProps {
  sessions: SessionRecord[]
  onUpdateSession: (id: string, patch: Partial<SessionRecord>) => void
  onDeleteSession: (id: string) => void
}

function challengeName(challengeId: string): string {
  return (
    challenges.find((challenge) => challenge.id === challengeId)?.name ??
    challengeId
  )
}

export function ReportsTable({
  sessions,
  onUpdateSession,
  onDeleteSession,
}: ReportsTableProps) {
  const [editingSession, setEditingSession] = useState<SessionRecord | null>(
    null
  )
  const [deletingSession, setDeletingSession] = useState<SessionRecord | null>(
    null
  )

  const handleConfirmDelete = () => {
    if (!deletingSession) return
    onDeleteSession(deletingSession.id)
    toast.success("Sesión eliminada")
    setDeletingSession(null)
  }

  if (sessions.length === 0) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Desafío</TableHead>
            <TableHead>Modalidad</TableHead>
            <TableHead>Edad</TableHead>
            <TableHead>Duración (ms)</TableHead>
            <TableHead>Resuelto</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>
              <span className="sr-only">Acciones</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={8} className="text-center text-muted-foreground">
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
            <TableHead>#</TableHead>
            <TableHead>Desafío</TableHead>
            <TableHead>Modalidad</TableHead>
            <TableHead>Edad</TableHead>
            <TableHead>Duración (ms)</TableHead>
            <TableHead>Resuelto</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>
              <span className="sr-only">Acciones</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((session) => (
            <TableRow key={session.id}>
              <TableCell>{session.attemptNumber}</TableCell>
              <TableCell>{challengeName(session.challengeId)}</TableCell>
              <TableCell>{session.modality}</TableCell>
              <TableCell>{session.ageAtSession}</TableCell>
              <TableCell>{session.durationMs}</TableCell>
              <TableCell>{session.resuelto ? "Sí" : "No"}</TableCell>
              <TableCell>
                {new Date(session.timestamp).toLocaleString()}
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingSession(session)}
                  >
                    Editar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setDeletingSession(session)}
                  >
                    Eliminar
                  </Button>
                </div>
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
                  #{session.attemptNumber} · {challengeName(session.challengeId)}
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
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingSession(session)}
                >
                  Editar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setDeletingSession(session)}
                >
                  Eliminar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingSession && (
        <EditSessionDialog
          key={editingSession.id}
          session={editingSession}
          open={editingSession !== null}
          onOpenChange={(open) => {
            if (!open) setEditingSession(null)
          }}
          onSave={onUpdateSession}
        />
      )}

      <AlertDialog
        open={deletingSession !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingSession(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar intento</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El intento se eliminará
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
