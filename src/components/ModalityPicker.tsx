import { Button } from "@/components/ui/button"
import type { Modality } from "@/types/session"

interface ModalityPickerProps {
  value: Modality | null
  onChange: (modality: Modality) => void
}

export function ModalityPicker({ value, onChange }: ModalityPickerProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium">Modalidad</span>
      <div className="flex gap-2">
        <Button
          type="button"
          variant={value === "imperativo" ? "default" : "outline"}
          aria-pressed={value === "imperativo"}
          onClick={() => onChange("imperativo")}
        >
          Imperativo
        </Button>
        <Button
          type="button"
          variant={value === "evento" ? "default" : "outline"}
          aria-pressed={value === "evento"}
          onClick={() => onChange("evento")}
        >
          Evento
        </Button>
      </div>
    </div>
  )
}
