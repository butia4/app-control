import { challenges } from "@/data/challenges"
import { Button } from "@/components/ui/button"

interface ChallengePickerProps {
  value: string | null
  onChange: (challengeId: string) => void
  disabled?: boolean
}

export function ChallengePicker({
  value,
  onChange,
  disabled,
}: ChallengePickerProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium">Desafío</span>
      <div className="flex gap-2">
        {challenges.map((challenge) => (
          <Button
            key={challenge.id}
            type="button"
            variant={value === challenge.id ? "default" : "outline"}
            aria-pressed={value === challenge.id}
            disabled={disabled}
            onClick={() => onChange(challenge.id)}
          >
            {challenge.name}
          </Button>
        ))}
      </div>
    </div>
  )
}
