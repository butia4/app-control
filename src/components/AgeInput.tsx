import { Input } from "@/components/ui/input"

interface AgeInputProps {
  value: string
  onChange: (value: string) => void
  error?: string
  disabled?: boolean
}

export function AgeInput({ value, onChange, error, disabled }: AgeInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium" htmlFor="age-input">
        Edad
      </label>
      <Input
        id="age-input"
        type="number"
        min={0}
        inputMode="numeric"
        aria-invalid={Boolean(error)}
        disabled={disabled}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
