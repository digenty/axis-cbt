"use client";

import { useState } from "react";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export const MultipleBlanksEditor = ({
  text,
  blanks,
  onChangeText,
  onChangeBlanks,
}: MultipleBlanksEditorProps) => {
  const [openId, setOpenId] = useState<string | null>(null);

  const insertBlank = () => {
    const id = generateId();
    const label = `Blank ${blanks.length + 1}`;
    onChangeBlanks([
      ...blanks,
      {
        id,
        label,
        answerType: "short-answer",
        answers: [],
        mark: 1,
      },
    ]);
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
      <div>
        <Label className="text-sm font-medium text-[var(--color-text-default)]">
          Write your question
        </Label>
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
          Type normally, then click &quot;Insert Blank&quot; to add gaps.
        </p>
        <div className="mt-2 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-default)] p-3">
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

      <div className="rounded-lg border border-[var(--color-border-default)] p-4">
        <h4 className="text-sm font-semibold text-[var(--color-text-default)]">
          Blanks
        </h4>
        <p className="mb-3 text-xs text-[var(--color-text-muted)]">
          Set correct answers and marks for each blank.
        </p>

        <div className="space-y-2">
          {blanks.map((blank, i) => {
            const open = openId === blank.id;
            return (
              <div
                key={blank.id}
                className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-default)]"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : blank.id)}
                  className="flex w-full items-center gap-3 px-3 py-2"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-bg-state-soft)] text-xs font-medium">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-left text-sm font-medium">
                    {blank.label}
                  </span>
                  <span className="text-[11px] text-[var(--color-text-muted)]">
                    {blank.answerType === "short-answer"
                      ? "Short Answer"
                      : "Multiple Choice"}{" "}
                    • {blank.mark} mark
                    {blank.mark === 1 ? "" : "s"}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeBlank(blank.id);
                    }}
                    className="text-[var(--color-icon-default-muted)] hover:text-[var(--color-icon-destructive)]"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-[var(--color-icon-default-muted)] transition-transform",
                      open && "rotate-180",
                    )}
                  />
                </button>

                {open && (
                  <div className="space-y-3 border-t border-[var(--color-border-default)] px-3 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateBlank(blank.id, {
                            answerType: "short-answer",
                          })
                        }
                        className={cn(
                          "flex-1 rounded-md border px-3 py-1.5 text-xs",
                          blank.answerType === "short-answer"
                            ? "border-[var(--blue-500)] bg-[var(--color-bg-badge-blue)] text-[var(--blue-700)]"
                            : "border-[var(--color-border-default)] text-[var(--color-text-subtle)]",
                        )}
                      >
                        Short Answer
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateBlank(blank.id, {
                            answerType: "multiple-choice",
                          })
                        }
                        className={cn(
                          "flex-1 rounded-md border px-3 py-1.5 text-xs",
                          blank.answerType === "multiple-choice"
                            ? "border-[var(--blue-500)] bg-[var(--color-bg-badge-blue)] text-[var(--blue-700)]"
                            : "border-[var(--color-border-default)] text-[var(--color-text-subtle)]",
                        )}
                      >
                        Multiple Choice
                      </button>
                    </div>

                    {blank.answerType === "short-answer" ? (
                      <div className="space-y-1.5">
                        <Label className="text-xs text-[var(--color-text-subtle)]">
                          {blank.label} Answer(s)
                        </Label>
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
                        <p className="text-[11px] text-[var(--color-text-muted)]">
                          Add multiple by separating with a comma
                        </p>
                      </div>
                    ) : (
                      <MultipleChoiceEditor
                        options={blank.options ?? []}
                        onChange={(opts: Option[]) =>
                          updateBlank(blank.id, { options: opts })
                        }
                      />
                    )}

                    <div className="space-y-1.5">
                      <Label className="text-xs text-[var(--color-text-subtle)]">
                        {blank.label} Mark
                      </Label>
                      <Input
                        type="number"
                        min={0}
                        value={blank.mark}
                        onChange={(e) =>
                          updateBlank(blank.id, {
                            mark: Number(e.target.value) || 0,
                          })
                        }
                        className="w-24"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
