import { Checkbox } from "@/components/ui/checkbox"

interface ObservationCheckboxProps {
  id: string
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
}

export function ObservationCheckbox({
  id,
  label,
  checked,
  onCheckedChange,
  disabled,
}: ObservationCheckboxProps) {
  return (
    <label
      className="flex items-center gap-2 text-sm font-medium"
      htmlFor={id}
    >
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(value)}
        disabled={disabled}
      />
      {label}
    </label>
  )
}
