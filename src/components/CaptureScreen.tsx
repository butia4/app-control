import { useState } from "react"
import { ChallengePicker } from "@/components/ChallengePicker"
import { ModalityPicker } from "@/components/ModalityPicker"
import { AgeInput } from "@/components/AgeInput"
import { StopwatchControls } from "@/components/StopwatchControls"
import { useStopwatch } from "@/hooks/useStopwatch"
import { useSessions } from "@/hooks/useSessions"
import { challenges } from "@/data/challenges"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { Modality } from "@/types/session"

export function CaptureScreen() {
  const [challengeId, setChallengeId] = useState<string | null>(null)
  const [modality, setModality] = useState<Modality | null>(null)
  const [ageInput, setAgeInput] = useState("")
  const [ageError, setAgeError] = useState<string | undefined>(undefined)
  const [savedMessage, setSavedMessage] = useState<string | null>(null)

  const { nextAttemptNumber, addSession } = useSessions()
  const [displayAttemptNumber, setDisplayAttemptNumber] =
    useState(nextAttemptNumber)
  const stopwatch = useStopwatch()
  const isLocked = stopwatch.status !== "idle"

  const parsedAge = ageInput.trim() === "" ? NaN : Number(ageInput)
  const hasValidAge = Number.isFinite(parsedAge) && parsedAge >= 0
  const canStart =
    challengeId !== null && modality !== null && hasValidAge

  const challenge = challenges.find((item) => item.id === challengeId)

  const handleStart = () => {
    if (!hasValidAge) {
      setAgeError("La edad es obligatoria y debe ser numérica.")
      return
    }
    setAgeError(undefined)
    stopwatch.start()
  }

  const handleFinalize = () => {
    if (!challengeId || modality === null || !hasValidAge) return

    if (!challenge) return

    const { durationMs } = stopwatch.finalize()
    const resuelto = durationMs <= challenge.thresholdMs

    addSession({
      challengeId,
      modality,
      ageAtSession: parsedAge,
      durationMs,
      resuelto,
      timestamp: new Date().toISOString(),
    })
    setSavedMessage(
      `Sesión guardada: ${resuelto ? "resuelto" : "no resuelto"}.`
    )
  }

  const handleReset = () => {
    setSavedMessage(null)
    setChallengeId(null)
    setModality(null)
    setAgeInput("")
    setAgeError(undefined)
    stopwatch.reset()
    setDisplayAttemptNumber(nextAttemptNumber)
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <Card>
        <CardContent className="flex flex-col gap-6 p-6">
          <h1 className="text-2xl font-bold tracking-tight">
            Captura de intento
          </h1>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" htmlFor="attempt-number">
              N° de intento
            </label>
            <Input
              id="attempt-number"
              value={displayAttemptNumber}
              readOnly
              disabled
            />
          </div>

          <ChallengePicker
            value={challengeId}
            onChange={setChallengeId}
            disabled={isLocked}
          />
          <ModalityPicker
            value={modality}
            onChange={setModality}
            disabled={isLocked}
          />
          <AgeInput
            value={ageInput}
            onChange={setAgeInput}
            error={ageError}
            disabled={isLocked}
          />

          <StopwatchControls
            stopwatch={stopwatch}
            canStart={canStart}
            onStart={handleStart}
            onFinalize={handleFinalize}
            onReset={handleReset}
            thresholdMs={challenge?.thresholdMs ?? null}
          />

          {savedMessage && (
            <p className="text-sm text-muted-foreground">{savedMessage}</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
