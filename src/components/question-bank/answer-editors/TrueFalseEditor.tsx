"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface TrueFalseEditorProps {
  value: "true" | "false" | null;
  onChange: (value: "true" | "false") => void;
}

export const TrueFalseEditor = ({ value, onChange }: TrueFalseEditorProps) => (
  <div className="space-y-2">
    <Label className="text-xs text-[var(--color-text-subtle)]">
      Correct Answer
    </Label>
    <RadioGroup
      value={value ?? undefined}
      onValueChange={(v) => onChange(v as "true" | "false")}
      className="flex gap-3"
    >
      <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-3 py-2 text-sm">
        <RadioGroupItem value="true" />
        True
      </label>
      <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-3 py-2 text-sm">
        <RadioGroupItem value="false" />
        False
      </label>
    </RadioGroup>
  </div>
);
