import { useCallback, useMemo, useState } from "react"
import {
  append,
  getAll,
  nextAttemptNumber as computeNextAttemptNumber,
  remove,
  update,
} from "@/lib/sessionsStore"
import type { SessionRecord } from "@/types/session"

export interface UseSessionsApi {
  sessions: SessionRecord[]
  nextAttemptNumber: number
  addSession: (input: Omit<SessionRecord, "id" | "attemptNumber">) => void
  updateSession: (id: string, patch: Partial<SessionRecord>) => void
  deleteSession: (id: string) => void
}

export function useSessions(): UseSessionsApi {
  const [sessions, setSessions] = useState<SessionRecord[]>(() => getAll())

  const addSession = useCallback(
    (input: Omit<SessionRecord, "id" | "attemptNumber">) => {
      append(input)
      setSessions(getAll())
    },
    []
  )

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

  const nextAttemptNumber = useMemo(
    () => computeNextAttemptNumber(sessions),
    [sessions]
  )

  return {
    sessions,
    nextAttemptNumber,
    addSession,
    updateSession,
    deleteSession,
  }
}
