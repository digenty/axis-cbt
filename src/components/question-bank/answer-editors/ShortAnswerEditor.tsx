"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ShortAnswerEditorProps {
  answer: string;
  onChange: (answer: string) => void;
  placeholder?: string;
  hint?: string;
  label?: string;
}

export const ShortAnswerEditor = ({
  answer,
  onChange,
  placeholder = "Expected Answer",
  hint = "Add multiple by separating with a comma",
  label = "Expected Answer(s)",
}: ShortAnswerEditorProps) => (
  <div className="space-y-1.5">
    <Label className="text-xs text-[var(--color-text-subtle)]">{label}</Label>
    <Input
      value={answer}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
    <p className="text-[11px] text-[var(--color-text-muted)]">{hint}</p>
  </div>
);
