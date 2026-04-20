"use client";

import React, { useState } from "react";
import { cn, getQuestionTypeLabel } from "@/lib/utils";
import type { QuestionType, SubQuestionType } from "@/types/question";

// ─── Types available inside single-question form ──────────────────────────────

export const SINGLE_QUESTION_TYPES: SubQuestionType[] = [
  "MULTIPLE_CHOICE",
  "MULTIPLE_ANSWERS",
  "TRUE_FALSE",
  "SHORT_ANSWER",
  "ESSAY",
  "NUMERIC_ANSWER",
];

// ─── Inline dropdown ──────────────────────────────────────────────────────────

export const QuestionTypeDropdown = ({
  value,
  onChange,
  types = SINGLE_QUESTION_TYPES,
}: {
  value: QuestionType;
  onChange: (type: QuestionType) => void;
  types?: QuestionType[];
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-gray-50"
      >
        {getQuestionTypeLabel(value)}
        <svg
          className="h-3.5 w-3.5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 z-30 mt-1 w-52 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-xl">
            {types.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  onChange(type);
                  setOpen(false);
                }}
                className={cn(
                  "w-full px-3 py-2 text-left text-sm transition-colors hover:bg-gray-50",
                  value === type
                    ? "font-semibold text-blue-700"
                    : "text-gray-700",
                )}
              >
                {getQuestionTypeLabel(type)}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
