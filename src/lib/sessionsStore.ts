import type { SessionRecord } from "@/types/session"

export const STORAGE_KEY = "app-control:sessions"
export const SCHEMA_VERSION = 1 as const

interface SessionsEnvelope {
  version: typeof SCHEMA_VERSION
  sessions: SessionRecord[]
}

function emptyEnvelope(): SessionsEnvelope {
  return { version: SCHEMA_VERSION, sessions: [] }
}

function isSessionsEnvelope(value: unknown): value is SessionsEnvelope {
  if (typeof value !== "object" || value === null) return false
  const candidate = value as Record<string, unknown>
  return (
    candidate.version === SCHEMA_VERSION && Array.isArray(candidate.sessions)
  )
}

function readEnvelope(): SessionsEnvelope {
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return emptyEnvelope()

  try {
    const parsed: unknown = JSON.parse(raw)
    if (!isSessionsEnvelope(parsed)) return emptyEnvelope()
    return parsed
  } catch {
    return emptyEnvelope()
  }
}

function writeEnvelope(envelope: SessionsEnvelope): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(envelope))
}

export function getAll(): SessionRecord[] {
  return readEnvelope().sessions
}

export function append(record: SessionRecord): void {
  const envelope = readEnvelope()
  envelope.sessions.push(record)
  writeEnvelope(envelope)
}

export function update(id: string, patch: Partial<SessionRecord>): void {
  const envelope = readEnvelope()
  const index = envelope.sessions.findIndex((session) => session.id === id)
  if (index === -1) return

  envelope.sessions[index] = { ...envelope.sessions[index], ...patch }
  writeEnvelope(envelope)
}

export function remove(id: string): void {
  const envelope = readEnvelope()
  const index = envelope.sessions.findIndex((session) => session.id === id)
  if (index === -1) return

  envelope.sessions.splice(index, 1)
  writeEnvelope(envelope)
}
