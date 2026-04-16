"use client";

import React from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
// import { appendOption } from "@/lib/question-bank.utils";
import type { OptionFormItem } from "@/types/question";
import { appendOption } from "./question";

// ─── Options editor (MCQ / Multiple Answers) ──────────────────────────────────

export const OptionsEditor = ({
  options,
  onChange,
  multiSelect = false,
  maxOptions = 8,
  minOptions = 2,
}: {
  options: OptionFormItem[];
  onChange: (options: OptionFormItem[]) => void;
  multiSelect?: boolean;
  maxOptions?: number;
  minOptions?: number;
}) => {
  const toggleCorrect = (id: string) => {
    const next = multiSelect
      ? options?.map((o) =>
          o.id === id ? { ...o, isCorrect: !o.isCorrect } : o,
        )
      : options?.map((o) => ({ ...o, isCorrect: o.id === id }));
    onChange(next);
  };

  const updateText = (id: string, text: string) =>
    onChange(options?.map((o) => (o.id === id ? { ...o, text } : o)));

  const removeOption = (id: string) => {
    if (options?.length <= minOptions) return;
    onChange(options?.filter((o) => o.id !== id));
  };

  return (
    <div className="space-y-2">
      {options?.map((opt) => (
        <div key={opt.id} className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => toggleCorrect(opt.id)}
            title={multiSelect ? "Toggle correct" : "Set as correct"}
            className={cn(
              "flex h-5 w-5 shrink-0 items-center justify-center border-2 transition-all",
              multiSelect ? "rounded" : "rounded-full",
              opt.isCorrect
                ? "border-blue-500 bg-blue-500 text-white"
                : "border-gray-300 hover:border-blue-400",
            )}
          >
            {opt.isCorrect && <Check className="h-3 w-3" />}
          </button>
          <span className="w-5 shrink-0 text-sm font-medium uppercase text-gray-500">
            {opt.id}.
          </span>
          <input
            type="text"
            value={opt.text}
            onChange={(e) => updateText(opt.id, e.target.value)}
            placeholder={`Option ${opt.id.toUpperCase()}`}
            className="h-9 flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm transition placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {options?.length > minOptions && (
            <button
              type="button"
              onClick={() => removeOption(opt.id)}
              className="flex h-7 w-7 shrink-0 items-center justify-center text-gray-300 transition-colors hover:text-red-500"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      ))}
      {options?.length < maxOptions && (
        <button
          type="button"
          onClick={() => onChange(appendOption(options))}
          className="mt-1 flex items-center gap-1.5 rounded-lg border border-dashed border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-all hover:border-blue-300 hover:text-blue-600"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Option
        </button>
      )}
    </div>
  );
};

// ─── True / False editor ──────────────────────────────────────────────────────

export const TrueFalseEditor = ({
  correctAnswer,
  onChange,
}: {
  correctAnswer: boolean;
  onChange: (value: boolean) => void;
}) => (
  <div className="flex gap-3">
    {(["True", "False"] as const).map((label) => {
      const val = label === "True";
      const active = correctAnswer === val;
      return (
        <button
          key={label}
          type="button"
          onClick={() => onChange(val)}
          className={cn(
            "flex-1 rounded-xl border py-2.5 text-sm font-medium transition-all",
            active
              ? "border-blue-500 bg-blue-50 text-blue-700"
              : "border-gray-200 text-gray-600 hover:border-gray-300",
          )}
        >
          {label}
        </button>
      );
    })}
  </div>
);

// ─── Correct answers text input ───────────────────────────────────────────────

export const CorrectAnswersInput = ({
  value,
  onChange,
  placeholder = "Add multiple by separating with a comma",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) => (
  <div>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-9 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm transition placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
    />
    <p className="mt-1 text-xs text-gray-400">
      Separate multiple accepted answers with a comma
    </p>
  </div>
);

// ─── Numeric answer input ─────────────────────────────────────────────────────

export const NumericAnswerInput = ({
  correctAnswer,
  tolerance,
  unit,
  onChangeAnswer,
  onChangeTolerance,
  onChangeUnit,
}: {
  correctAnswer: number;
  tolerance?: number;
  unit?: string;
  onChangeAnswer: (v: number) => void;
  onChangeTolerance: (v: number) => void;
  onChangeUnit: (v: string) => void;
}) => (
  <div className="space-y-3">
    {[
      {
        label: "Correct Answer",
        value: String(correctAnswer),
        type: "number",
        onChange: (v: string) => onChangeAnswer(Number(v)),
        placeholder: "0",
      },
      {
        label: "Tolerance (±)",
        value: String(tolerance ?? ""),
        type: "number",
        onChange: (v: string) => onChangeTolerance(Number(v)),
        placeholder: "0",
      },
      {
        label: "Unit (optional)",
        value: unit ?? "",
        type: "text",
        onChange: onChangeUnit,
        placeholder: "kg, m, s…",
      },
    ].map((f) => (
      <div key={f.label} className="flex items-center gap-3">
        <span className="w-32 shrink-0 text-xs font-medium text-gray-700">
          {f.label}
        </span>
        <input
          type={f.type}
          value={f.value}
          onChange={(e) => f.onChange(e.target.value)}
          placeholder={f.placeholder}
          className="h-9 w-36 rounded-lg border border-gray-200 px-3 py-2 text-sm transition focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>
    ))}
  </div>
);
