"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateId } from "@/lib/utils";
import type { Option } from "@/types";

interface MultipleChoiceEditorProps {
  options: Option[];
  multi?: boolean;
  onChange: (options: Option[]) => void;
}

const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];

export const MultipleChoiceEditor = ({
  options,
  multi,
  onChange,
}: MultipleChoiceEditorProps) => {
  const update = (id: string, patch: Partial<Option>) =>
    onChange(options.map((o) => (o.id === id ? { ...o, ...patch } : o)));

  const setCorrect = (id: string) => {
    if (multi) {
      update(id, { isCorrect: !options.find((o) => o.id === id)?.isCorrect });
    } else {
      onChange(options.map((o) => ({ ...o, isCorrect: o.id === id })));
    }
  };

  const remove = (id: string) => onChange(options.filter((o) => o.id !== id));

  const add = () =>
    onChange([...options, { id: generateId(), text: "", isCorrect: false }]);

  return (
    <div className="space-y-2">
      <Label className="text-xs text-[var(--color-text-subtle)]">
        {multi ? "Options (select all correct)" : "Options"}
      </Label>
      {options.map((opt, i) => (
        <div
          key={opt.id}
          className="flex items-center gap-2 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-3 py-2"
        >
          <button
            type="button"
            onClick={() => setCorrect(opt.id)}
            className={
              multi
                ? `flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                    opt.isCorrect
                      ? "border-[var(--blue-500)] bg-[var(--blue-500)] text-white"
                      : "border-[var(--color-border-strong)]"
                  }`
                : `flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                    opt.isCorrect
                      ? "border-[var(--blue-500)] bg-[var(--blue-500)]"
                      : "border-[var(--color-border-strong)]"
                  }`
            }
            aria-label={opt.isCorrect ? "Mark incorrect" : "Mark correct"}
          >
            {opt.isCorrect && multi && (
              <svg
                className="h-3 w-3"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M2 6l3 3 5-6" />
              </svg>
            )}
            {opt.isCorrect && !multi && (
              <span className="block h-1.5 w-1.5 rounded-full bg-white" />
            )}
          </button>
          <span className="w-5 text-sm font-medium text-[var(--color-text-default)]">
            {LETTERS[i]}.
          </span>
          <Input
            value={opt.text}
            onChange={(e) => update(opt.id, { text: e.target.value })}
            placeholder={`Option ${LETTERS[i]}`}
            className="flex-1 border-0 shadow-none focus-visible:ring-0"
          />
          <button
            type="button"
            onClick={() => remove(opt.id)}
            className="text-[var(--color-icon-default-muted)] hover:text-[var(--color-icon-destructive)]"
            aria-label="Delete option"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={add}
        className="text-[var(--color-text-subtle)]"
      >
        <Plus className="mr-1 h-3.5 w-3.5" />
        Add Option
      </Button>
    </div>
  );
};
