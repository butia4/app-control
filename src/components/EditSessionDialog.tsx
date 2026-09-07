import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChallengePicker } from "@/components/ChallengePicker"
import { ModalityPicker } from "@/components/ModalityPicker"
import { AgeInput } from "@/components/AgeInput"
import { challenges } from "@/data/challenges"
import type { Modality, SessionRecord } from "@/types/session"

interface EditSessionDialogProps {
  session: SessionRecord
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (id: string, patch: Partial<SessionRecord>) => void
}

export function EditSessionDialog({
  session,
  open,
  onOpenChange,
  onSave,
}: EditSessionDialogProps) {
  const [challengeId, setChallengeId] = useState(session.challengeId)
  const [modality, setModality] = useState<Modality>(session.modality)
  const [ageInput, setAgeInput] = useState(String(session.ageAtSession))
  const [durationInput, setDurationInput] = useState(
    String(session.durationMs)
  )

  const parsedAge = ageInput.trim() === "" ? NaN : Number(ageInput)
  const hasValidAge = Number.isFinite(parsedAge) && parsedAge >= 0

  const parsedDuration = durationInput.trim() === "" ? NaN : Number(durationInput)
  const hasValidDuration = Number.isFinite(parsedDuration) && parsedDuration >= 0

  const ageError = hasValidAge
    ? undefined
    : "La edad es obligatoria y debe ser numérica."
  const durationError = hasValidDuration
    ? undefined
    : "La duración es obligatoria y debe ser numérica."

  const canSubmit = hasValidAge && hasValidDuration && challengeId !== null

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit || challengeId === null) return

    const challenge = challenges.find((item) => item.id === challengeId)
    if (!challenge) return

    onSave(session.id, {
      challengeId,
      modality,
      ageAtSession: parsedAge,
      durationMs: parsedDuration,
      resuelto: parsedDuration <= challenge.thresholdMs,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar intento</DialogTitle>
          <DialogDescription>
            Modificá los datos del intento y guardá los cambios.
          </DialogDescription>
        </DialogHeader>

        <form
          id="edit-session-form"
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <ChallengePicker value={challengeId} onChange={setChallengeId} />
          <ModalityPicker value={modality} onChange={setModality} />
          <AgeInput value={ageInput} onChange={setAgeInput} error={ageError} />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" htmlFor="duration-input">
              Duración (ms)
            </label>
            <Input
              id="duration-input"
              type="number"
              min={0}
              inputMode="numeric"
              aria-invalid={Boolean(durationError)}
              value={durationInput}
              onChange={(event) => setDurationInput(event.target.value)}
            />
            {durationError && (
              <p className="text-sm text-destructive">{durationError}</p>
            )}
          </div>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="edit-session-form"
            disabled={!canSubmit}
          >
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
