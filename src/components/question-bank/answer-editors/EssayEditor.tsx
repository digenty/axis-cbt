"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { QuestionMetadata } from "@/types";

interface EssayEditorProps {
  guidance: string;
  onChange: (guidance: string) => void;
  metadata?: QuestionMetadata;
  onChangeMetadata?: (m: QuestionMetadata) => void;
}

export const EssayEditor = ({
  guidance,
  onChange,
  metadata,
  onChangeMetadata,
}: EssayEditorProps) => {
  const m = metadata ?? {};
  const update = (patch: Partial<QuestionMetadata>) =>
    onChangeMetadata?.({ ...m, ...patch });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs text-[var(--color-text-subtle)]">
          Marking guidance / rubric (optional)
        </Label>
        <textarea
          value={guidance}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Notes for the grader — model answer, key points, rubric"
          rows={4}
          className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-3 py-2 text-sm text-[var(--color-text-default)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
        />
      </div>

      {onChangeMetadata && (
        <details className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-card)] p-3">
          <summary className="cursor-pointer text-xs font-medium text-[var(--color-text-subtle)]">
            Advanced essay options
          </summary>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-[var(--color-text-subtle)]">
                Min words
              </Label>
              <Input
                type="number"
                min={0}
                value={m.minWords ?? ""}
                onChange={(e) =>
                  update({
                    minWords: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-[var(--color-text-subtle)]">
                Max words
              </Label>
              <Input
                type="number"
                min={0}
                value={m.maxWords ?? ""}
                onChange={(e) =>
                  update({
                    maxWords: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
              />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <Label className="text-xs text-[var(--color-text-subtle)]">
                Model answer
              </Label>
              <textarea
                value={m.modelAnswer ?? ""}
                onChange={(e) => update({ modelAnswer: e.target.value })}
                rows={3}
                placeholder="Reference answer (shown to graders only)"
                className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-3 py-2 text-sm text-[var(--color-text-default)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              />
            </div>
          </div>
        </details>
      )}
    </div>
  );
};
