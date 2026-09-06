import { challenges } from "@/data/challenges"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ChallengePickerProps {
  value: string | null
  onChange: (challengeId: string) => void
}

export function ChallengePicker({ value, onChange }: ChallengePickerProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium" htmlFor="challenge-picker">
        Desafío
      </label>
      <Select
        value={value ?? undefined}
        onValueChange={(next) => onChange(next as string)}
      >
        <SelectTrigger id="challenge-picker" className="w-full">
          <SelectValue placeholder="Seleccionar desafío" />
        </SelectTrigger>
        <SelectContent>
          {challenges.map((challenge) => (
            <SelectItem key={challenge.id} value={challenge.id}>
              {challenge.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
