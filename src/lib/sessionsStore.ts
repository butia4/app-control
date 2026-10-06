import type { SessionRecord } from "@/types/session"

export const STORAGE_KEY = "app-control:sessions"
export const SCHEMA_VERSION = 3 as const

interface SessionsEnvelope {
  version: typeof SCHEMA_VERSION
  sessions: SessionRecord[]
}

type V2Session = Omit<
  SessionRecord,
  "priorRoboticsExperience" | "blockConfusion"
>
type V1Session = Omit<V2Session, "attemptNumber">

interface V1Envelope {
  version: 1
  sessions: V1Session[]
}

interface V2Envelope {
  version: 2
  sessions: V2Session[]
}

function emptyEnvelope(): SessionsEnvelope {
  return { version: SCHEMA_VERSION, sessions: [] }
}

function hasSessionsArray(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    Array.isArray((value as Record<string, unknown>).sessions)
  )
}

function isSessionsEnvelope(value: unknown): value is SessionsEnvelope {
  return hasSessionsArray(value) && value.version === SCHEMA_VERSION
}

function isV2Envelope(value: unknown): value is V2Envelope {
  return hasSessionsArray(value) && value.version === 2
}

function isV1Envelope(value: unknown): value is V1Envelope {
  return hasSessionsArray(value) && value.version === 1
}

function migrateV1ToV2(legacy: V1Envelope): V2Envelope {
  const sorted = [...legacy.sessions].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  )
  const attemptNumberById = new Map(
    sorted.map((session, index) => [session.id, index + 1])
  )
  return {
    version: 2,
    sessions: legacy.sessions.map((session) => ({
      ...session,
      attemptNumber: attemptNumberById.get(session.id) ?? 1,
    })),
  }
}

function migrateV2ToV3(legacy: V2Envelope): SessionsEnvelope {
  return {
    version: SCHEMA_VERSION,
    sessions: legacy.sessions.map((session) => ({
      ...session,
      priorRoboticsExperience: false,
      blockConfusion: false,
    })),
  }
}

// A stored envelope written by a newer app version must never be overwritten.
function isNewerVersion(value: unknown): boolean {
  return (
    hasSessionsArray(value) &&
    typeof value.version === "number" &&
    value.version > SCHEMA_VERSION
  )
}

function readEnvelope(): SessionsEnvelope {
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return emptyEnvelope()

  try {
    const parsed: unknown = JSON.parse(raw)
    if (isSessionsEnvelope(parsed)) return parsed
    if (isV1Envelope(parsed) || isV2Envelope(parsed)) {
      const v2 = isV1Envelope(parsed) ? migrateV1ToV2(parsed) : parsed
      const migrated = migrateV2ToV3(v2)
      writeEnvelope(migrated)
      return migrated
    }
    return emptyEnvelope()
  } catch {
    return emptyEnvelope()
  }
}

function writeEnvelope(envelope: SessionsEnvelope): void {
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (raw) {
    try {
      if (isNewerVersion(JSON.parse(raw))) {
        console.error(
          "Los datos guardados pertenecen a una versión más nueva; no se sobrescriben."
        )
        return
      }
    } catch {
      // Unparseable stored data is replaced as before.
    }
  }
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
