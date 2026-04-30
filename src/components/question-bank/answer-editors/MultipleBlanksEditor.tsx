"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateId } from "@/lib/utils";
import { MultipleChoiceEditor } from "./MultipleChoiceEditor";
import type { Blank, Option } from "@/types";
import { cn } from "@/lib/utils";

interface MultipleBlanksEditorProps {
  text: string;
  blanks: Blank[];
  onChangeText: (text: string) => void;
  onChangeBlanks: (blanks: Blank[]) => void;
}

const ANSWER_TYPE_LABELS: Record<Blank["answerType"], string> = {
  "short-answer": "Short answer",
  "multiple-choice": "Multiple Choice",
};

export const MultipleBlanksEditor = ({
  text,
  blanks,
  onChangeText,
  onChangeBlanks,
}: MultipleBlanksEditorProps) => {
  const [openId, setOpenId] = useState<string | null>(blanks[0]?.id ?? null);

  const insertBlank = () => {
    const id = generateId();
    const label = `Blank ${blanks.length + 1}`;
    const newBlank: Blank = {
      id,
      label,
      answerType: "short-answer",
      answers: [],
      mark: 1,
    };
    onChangeBlanks([...blanks, newBlank]);
    onChangeText(`${text} {${label}}`);
    setOpenId(id);
  };

  const updateBlank = (id: string, patch: Partial<Blank>) =>
    onChangeBlanks(blanks.map((b) => (b.id === id ? { ...b, ...patch } : b)));

  const removeBlank = (id: string) => {
    const blank = blanks.find((b) => b.id === id);
    onChangeBlanks(blanks.filter((b) => b.id !== id));
    if (blank) onChangeText(text.replaceAll(`{${blank.label}}`, ""));
  };

  return (
    <div className="space-y-4">
      {/* ─── Question text ─── */}
      <div>
        <p className="mb-1 text-sm font-medium text-[var(--color-text-default)]">
          Write your question
        </p>
        <p className="mb-2 text-xs text-[var(--color-text-muted)]">
          Type normally, then click &quot;Insert Blank&quot; to add gaps.
        </p>
        <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-default)] p-3">
          <textarea
            value={text}
            onChange={(e) => onChangeText(e.target.value)}
            rows={3}
            className="w-full resize-none bg-transparent text-sm text-[var(--color-text-default)] focus:outline-none"
            placeholder="London and Paris are examples of {Blank 1} in {Blank 2}"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={insertBlank}
          className="mt-2 border-dashed"
        >
          <Plus className="mr-1 h-3.5 w-3.5" />
          Insert Blank
        </Button>
      </div>

      {/* ─── Blanks section ─── */}
      {blanks.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-[var(--color-border-default)]">
          {/* Section header */}
          <div className="px-5 py-4">
            <h4 className="text-sm font-semibold text-[var(--color-text-default)]">
              Blanks
            </h4>
            <p className="mt-0.5 text-xs text-[var(--color-text-subtle)]">
              Set correct answers and marks for each blank
            </p>
          </div>

          <div className="border-t border-[var(--color-border-default)]">
            {blanks.map((blank, i) => {
              const open = openId === blank.id;
              const Chevron = open ? ChevronUp : ChevronDown;
              return (
                <div
                  key={blank.id}
                  className={cn(
                    "border-[var(--color-border-default)]",
                    i > 0 && "border-t",
                  )}
                >
                  {/* Blank header */}
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : blank.id)}
                    className="flex w-full items-start gap-3 px-5 py-4 text-left"
                  >
                    <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-[var(--color-border-strong)] text-xs font-medium text-[var(--color-text-default)]">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[var(--color-text-default)]">
                        {blank.label}
                      </p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="rounded-md bg-[var(--color-bg-state-soft)] px-2 py-0.5 text-xs text-[var(--color-text-subtle)]">
                          {ANSWER_TYPE_LABELS[blank.answerType]}
                        </span>
                        <span className="text-xs text-[var(--color-text-subtle)]">
                          •{" "}
                          {blank.mark === 1 ? "1 mark" : `${blank.mark} marks`}
                        </span>
                      </div>
                    </div>
                    <Chevron className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--color-icon-default-muted)]" />
                  </button>

                  {/* Blank expanded body */}
                  {open && (
                    <div className="border-t border-[var(--color-border-default)] px-5 py-4 space-y-4">
                      {/* Answer type toggles */}
                      <div className="flex gap-3">
                        {(["short-answer", "multiple-choice"] as const).map(
                          (type) => {
                            const selected = blank.answerType === type;
                            return (
                              <button
                                key={type}
                                type="button"
                                onClick={() =>
                                  updateBlank(blank.id, { answerType: type })
                                }
                                className={cn(
                                  "flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                                  selected
                                    ? "border-blue-500 text-[var(--color-text-default)]"
                                    : "border-[var(--color-border-default)] text-[var(--color-text-subtle)]",
                                )}
                              >
                                <span
                                  className={cn(
                                    "flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2",
                                    selected
                                      ? "border-blue-500"
                                      : "border-[var(--color-border-strong)]",
                                  )}
                                >
                                  {selected && (
                                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                                  )}
                                </span>
                                {ANSWER_TYPE_LABELS[type]}
                              </button>
                            );
                          },
                        )}
                      </div>

                      {/* Answer input */}
                      {blank.answerType === "short-answer" ? (
                        <div className="space-y-1.5">
                          <p className="text-sm font-semibold text-[var(--color-text-default)]">
                            {blank.label} Answer(s)
                          </p>
                          <Input
                            value={blank.answers.join(", ")}
                            onChange={(e) =>
                              updateBlank(blank.id, {
                                answers: e.target.value
                                  .split(",")
                                  .map((s) => s.trim())
                                  .filter(Boolean),
                              })
                            }
                            placeholder="Expected Answer"
                          />
                          <p className="text-xs text-[var(--color-text-subtle)]">
                            Add multiple by separating with a comma
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <p className="text-sm font-semibold text-[var(--color-text-default)]">
                            {blank.label} Answer(s)
                          </p>
                          <MultipleChoiceEditor
                            options={blank.options ?? []}
                            onChange={(opts: Option[]) =>
                              updateBlank(blank.id, { options: opts })
                            }
                          />
                        </div>
                      )}

                      {/* Marks */}
                      <div className="flex items-center gap-3 border-t border-[var(--color-border-default)] pt-4">
                        <span className="text-sm font-medium text-[var(--color-text-default)]">
                          {blank.label} Mark:
                        </span>
                        <Input
                          type="number"
                          min={0}
                          value={blank.mark}
                          onChange={(e) =>
                            updateBlank(blank.id, {
                              mark: Number(e.target.value) || 0,
                            })
                          }
                          className="h-8 w-16 text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeBlank(blank.id)}
                          className="ml-auto text-xs text-[var(--color-text-destructive)] hover:underline"
                        >
                          Remove blank
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
