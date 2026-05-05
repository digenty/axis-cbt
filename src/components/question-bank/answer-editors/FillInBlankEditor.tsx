"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FillInBlankEditorProps {
  answer: string;
  onChange: (answer: string) => void;
}

export const FillInBlankEditor = ({
  answer,
  onChange,
}: FillInBlankEditorProps) => (
  <div className="space-y-1.5">
    <Label className="text-xs text-[var(--color-text-subtle)]">
      Expected Answer
    </Label>
    <p className="text-[11px] text-[var(--color-text-muted)]">
      Use{" "}
      <code className="rounded bg-[var(--color-bg-muted)] px-1">______</code> in
      the question text to mark the gap.
    </p>
    <Input
      value={answer}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Expected answer"
    />
  </div>
);
