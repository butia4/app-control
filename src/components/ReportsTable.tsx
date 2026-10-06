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

const PAGE_SIZE = 20

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
  const [page, setPage] = useState(1)

  // Clamp so deleting the last row of the last page never leaves an empty page.
  const totalPages = Math.max(1, Math.ceil(sessions.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageSessions = sessions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const handleConfirmDelete = () => {
    if (!deletingSession) return
    onDeleteSession(deletingSession.id)
    toast.success(`Intento N.° ${deletingSession.attemptNumber} eliminado`)
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
            <TableHead>Exp. robótica</TableHead>
            <TableHead>Confusión bloques</TableHead>
            <TableHead>
              <span className="sr-only">Acciones</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={10} className="text-center text-muted-foreground">
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
            <TableHead>Exp. robótica</TableHead>
            <TableHead>Confusión bloques</TableHead>
            <TableHead>
              <span className="sr-only">Acciones</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageSessions.map((session) => (
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
                {session.priorRoboticsExperience ? "Sí" : "No"}
              </TableCell>
              <TableCell>{session.blockConfusion ? "Sí" : "No"}</TableCell>
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
        {pageSessions.map((session) => (
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
              <span className="text-sm text-muted-foreground">
                Experiencia previa en robótica:{" "}
                {session.priorRoboticsExperience ? "Sí" : "No"}
              </span>
              <span className="text-sm text-muted-foreground">
                Confusión en el uso de bloques:{" "}
                {session.blockConfusion ? "Sí" : "No"}
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

      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setPage(currentPage - 1)}
          >
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setPage(currentPage + 1)}
          >
            Siguiente
          </Button>
        </div>
      )}

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
