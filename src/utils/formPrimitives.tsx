"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { DifficultyLevel } from "@/types/question";

// ─── Spinner ──────────────────────────────────────────────────────────────────

export const Spinner = ({ className }: { className?: string }) => (
  <span
    className={cn(
      "inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white",
      className,
    )}
  />
);

// ─── Section wrapper ──────────────────────────────────────────────────────────

export const Section = ({
  title,
  optional,
  hint,
  children,
  className,
}: {
  title?: string;
  optional?: boolean;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn("rounded-xl border border-gray-200 bg-white p-4", className)}
  >
    {title && (
      <h3 className="mb-0.5 text-sm font-semibold text-gray-900">
        {title}{" "}
        {optional && (
          <span className="text-xs font-normal text-gray-400">(optional)</span>
        )}
      </h3>
    )}
    {hint && <p className="mb-2 text-xs text-gray-400">{hint}</p>}
    {children}
  </div>
);

// ─── Form top bar ─────────────────────────────────────────────────────────────

export const FormTopBar = ({
  onCancel,
  onSave,
  saving,
  isEdit,
  label,
}: {
  onCancel: () => void;
  onSave: () => void;
  saving: boolean;
  isEdit?: boolean;
  label?: string;
}) => (
  <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-white px-6 py-3">
    <button
      type="button"
      onClick={onCancel}
      className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
    >
      Cancel
    </button>
    <button
      type="button"
      onClick={onSave}
      disabled={saving}
      className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
    >
      {saving && <Spinner />}
      {label ?? (isEdit ? "Update Question" : "Save Question")}
    </button>
  </div>
);

// ─── Marks input ──────────────────────────────────────────────────────────────

export const MarksInput = ({
  value,
  onChange,
  label = "Marks:",
}: {
  value: number;
  onChange: (v: number) => void;
  label?: string;
}) => (
  <div className="flex items-center gap-3">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <input
      type="number"
      min={1}
      value={value}
      onChange={(e) => onChange(Math.max(1, Number(e.target.value)))}
      className="h-8 w-16 rounded-lg border border-gray-200 text-center text-sm transition focus:ring-2 focus:ring-blue-500 focus:outline-none"
    />
  </div>
);

// ─── Difficulty selector ──────────────────────────────────────────────────────

export const DifficultySelector = ({
  value,
  onChange,
}: {
  value: DifficultyLevel;
  onChange: (v: DifficultyLevel) => void;
}) => {
  const options: { value: DifficultyLevel; label: string; active: string }[] = [
    {
      value: "EASY",
      label: "Easy",
      active: "border-green-400 bg-green-50 text-green-700",
    },
    {
      value: "MEDIUM",
      label: "Medium",
      active: "border-amber-400 bg-amber-50 text-amber-700",
    },
    {
      value: "HARD",
      label: "Hard",
      active: "border-red-400 bg-red-50 text-red-700",
    },
  ];
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700">Difficulty:</span>
      <div className="flex gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(value === opt.value ? "" : opt.value)}
            className={cn(
              "rounded-lg border px-2.5 py-1 text-xs font-medium transition-all",
              value === opt.value
                ? opt.active
                : "border-gray-200 text-gray-500 hover:border-gray-300",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── Instruction input ────────────────────────────────────────────────────────

export const InstructionInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => (
  <Section
    title="Instruction"
    optional
    hint='Add a brief instruction if needed. e.g. "Fill in the gaps"'
  >
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Example: fill in the gaps with the correct words"
      className="h-9 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm transition placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
    />
  </Section>
);
