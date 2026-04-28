"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NumericalEditorProps {
  answer: string;
  onChange: (answer: string) => void;
}

export const NumericalEditor = ({ answer, onChange }: NumericalEditorProps) => (
  <div className="space-y-1.5">
    <Label className="text-xs text-[var(--color-text-subtle)]">
      Expected Numerical Answer
    </Label>
    <Input
      value={answer}
      onChange={(e) => onChange(e.target.value)}
      placeholder="e.g. 3.14"
      inputMode="decimal"
    />
  </div>
);
