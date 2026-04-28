"use client";

import { Label } from "@/components/ui/label";

interface EssayEditorProps {
  guidance: string;
  onChange: (guidance: string) => void;
}

export const EssayEditor = ({ guidance, onChange }: EssayEditorProps) => (
  <div className="space-y-2">
    <Label className="text-xs text-[var(--color-text-subtle)]">
      Marking guidance (optional)
    </Label>
    <textarea
      value={guidance}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Notes for the grader — model answer, key points, rubric"
      rows={4}
      className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-3 py-2 text-sm text-[var(--color-text-default)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
    />
  </div>
);
