import type { SessionRecord } from "@/types/session"

export const STORAGE_KEY = "app-control:sessions"
export const SCHEMA_VERSION = 2 as const

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

interface LegacyEnvelope {
  version: 1
  sessions: Omit<SessionRecord, "attemptNumber">[]
}

function isLegacyEnvelope(value: unknown): value is LegacyEnvelope {
  if (typeof value !== "object" || value === null) return false
  const candidate = value as Record<string, unknown>
  return candidate.version === 1 && Array.isArray(candidate.sessions)
}

function migrateLegacyEnvelope(legacy: LegacyEnvelope): SessionsEnvelope {
  const sorted = [...legacy.sessions].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  )
  const attemptNumberById = new Map(
    sorted.map((session, index) => [session.id, index + 1])
  )
  return {
    version: SCHEMA_VERSION,
    sessions: legacy.sessions.map((session) => ({
      ...session,
      attemptNumber: attemptNumberById.get(session.id) ?? 1,
    })),
  }
}

function readEnvelope(): SessionsEnvelope {
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return emptyEnvelope()

  try {
    const parsed: unknown = JSON.parse(raw)
    if (isSessionsEnvelope(parsed)) return parsed
    if (isLegacyEnvelope(parsed)) {
      const migrated = migrateLegacyEnvelope(parsed)
      writeEnvelope(migrated)
      return migrated
    }
    return emptyEnvelope()
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

export function nextAttemptNumber(sessions: SessionRecord[]): number {
  return sessions.reduce((max, session) => Math.max(max, session.attemptNumber), 0) + 1
}

export function append(input: Omit<SessionRecord, "id" | "attemptNumber">): SessionRecord {
  const envelope = readEnvelope()
  const record: SessionRecord = {
    ...input,
    id: crypto.randomUUID(),
    attemptNumber: nextAttemptNumber(envelope.sessions),
  }
  envelope.sessions.push(record)
  writeEnvelope(envelope)
  return record
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
