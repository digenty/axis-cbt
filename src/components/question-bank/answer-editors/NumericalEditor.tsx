"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { QuestionMetadata } from "@/types";

interface NumericalEditorProps {
  answer: string;
  onChange: (answer: string) => void;
  metadata?: QuestionMetadata;
  onChangeMetadata?: (m: QuestionMetadata) => void;
}

export const NumericalEditor = ({
  answer,
  onChange,
  metadata,
  onChangeMetadata,
}: NumericalEditorProps) => {
  const m = metadata ?? {};
  const update = (patch: Partial<QuestionMetadata>) =>
    onChangeMetadata?.({ ...m, ...patch });

  return (
    <div className="space-y-4">
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

      {onChangeMetadata && (
        <details className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-card)] p-3">
          <summary className="cursor-pointer text-xs font-medium text-[var(--color-text-subtle)]">
            Advanced numeric options
          </summary>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-[var(--color-text-subtle)]">
                Tolerance (±)
              </Label>
              <Input
                type="number"
                step="any"
                value={m.tolerance ?? ""}
                onChange={(e) =>
                  update({
                    tolerance: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
                placeholder="0.01"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-[var(--color-text-subtle)]">
                Unit
              </Label>
              <Input
                value={m.unit ?? ""}
                onChange={(e) => update({ unit: e.target.value || undefined })}
                placeholder="e.g. cm, kg"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-[var(--color-text-subtle)]">
                Min value
              </Label>
              <Input
                type="number"
                step="any"
                value={m.minValue ?? ""}
                onChange={(e) =>
                  update({
                    minValue: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-[var(--color-text-subtle)]">
                Max value
              </Label>
              <Input
                type="number"
                step="any"
                value={m.maxValue ?? ""}
                onChange={(e) =>
                  update({
                    maxValue: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs text-[var(--color-text-subtle)]">
                Decimal places
              </Label>
              <Input
                type="number"
                min={0}
                value={m.decimalPlaces ?? ""}
                onChange={(e) =>
                  update({
                    decimalPlaces: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
              />
            </div>
          </div>
        </details>
      )}
    </div>
  );
};
