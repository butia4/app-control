import { useState } from "react"
import { useChallenges } from "@/hooks/useChallenges"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function ConfigScreen() {
  const { challenges, updateThreshold } = useChallenges()
  const [draftSeconds, setDraftSeconds] = useState<Record<string, string>>(
    () =>
      Object.fromEntries(
        challenges.map((challenge) => [
          challenge.id,
          String(challenge.thresholdMs / 1000),
        ])
      )
  )

  const handleSave = (challengeId: string) => {
    const raw = draftSeconds[challengeId]
    const seconds = Number(raw)
    if (!Number.isFinite(seconds) || seconds <= 0) {
      toast.error("El tiempo máximo debe ser un número mayor a 0.")
      return
    }
    updateThreshold(challengeId, Math.round(seconds * 1000))
    toast.success("Tiempo máximo actualizado.")
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <Card>
        <CardContent className="flex flex-col gap-6 p-6">
          <h1 className="text-2xl font-bold tracking-tight">
            Configuración
          </h1>

          {challenges.map((challenge) => (
            <div key={challenge.id} className="flex flex-col gap-1.5">
              <label
                className="text-sm font-medium"
                htmlFor={`threshold-${challenge.id}`}
              >
                {challenge.name} — tiempo máximo (segundos)
              </label>
              <div className="flex gap-2">
                <Input
                  id={`threshold-${challenge.id}`}
                  type="number"
                  min={1}
                  value={draftSeconds[challenge.id] ?? ""}
                  onChange={(event) =>
                    setDraftSeconds((prev) => ({
                      ...prev,
                      [challenge.id]: event.target.value,
                    }))
                  }
                />
                <Button
                  type="button"
                  onClick={() => handleSave(challenge.id)}
                >
                  Guardar
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
