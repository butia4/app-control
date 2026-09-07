import { useCallback, useState } from "react"
import { append, getAll, remove, update } from "@/lib/sessionsStore"
import type { SessionRecord } from "@/types/session"

export interface UseSessionsApi {
  sessions: SessionRecord[]
  addSession: (record: SessionRecord) => void
  updateSession: (id: string, patch: Partial<SessionRecord>) => void
  deleteSession: (id: string) => void
}

export function useSessions(): UseSessionsApi {
  const [sessions, setSessions] = useState<SessionRecord[]>(() => getAll())

  const addSession = useCallback((record: SessionRecord) => {
    append(record)
    setSessions(getAll())
  }, [])

  const updateSession = useCallback(
    (id: string, patch: Partial<SessionRecord>) => {
      update(id, patch)
      setSessions(getAll())
    },
    []
  )

  const deleteSession = useCallback((id: string) => {
    remove(id)
    setSessions(getAll())
  }, [])

  return { sessions, addSession, updateSession, deleteSession }
}
