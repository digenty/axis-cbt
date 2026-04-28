"use client";

import type { QuestionType } from "@/types";
import { getQuestionTypeLabel } from "@/lib/utils";
import { cn } from "@/lib/utils";

const TYPE_STYLES: Record<QuestionType, { bg: string; text: string }> = {
  "multiple-choice": {
    bg: "bg-[var(--color-bg-badge-blue)]",
    text: "text-[var(--blue-700)]",
  },
  "true-false": {
    bg: "bg-[var(--color-bg-badge-green)]",
    text: "text-[var(--green-700)]",
  },
  essay: {
    bg: "bg-[var(--color-bg-badge-amber)]",
    text: "text-[var(--amber-700)]",
  },
  "fill-in-blank": {
    bg: "bg-[var(--color-bg-badge-purple)]",
    text: "text-[var(--purple-700)]",
  },
  matching: {
    bg: "bg-[var(--color-bg-badge-cyan)]",
    text: "text-[var(--cyan-700)]",
  },
  "short-answer": {
    bg: "bg-[var(--color-bg-badge-indigo)]",
    text: "text-[var(--indigo-700)]",
  },
  numerical: {
    bg: "bg-[var(--color-bg-badge-rose)]",
    text: "text-[var(--rose-700)]",
  },
  "question-group": {
    bg: "bg-[var(--color-bg-badge-orange)]",
    text: "text-[var(--orange-700)]",
  },
  "multiple-answers": {
    bg: "bg-[var(--color-bg-badge-teal)]",
    text: "text-[var(--teal-700)]",
  },
  "comprehension-passage": {
    bg: "bg-[var(--color-bg-badge-violet)]",
    text: "text-[var(--violet-700)]",
  },
  "multiple-blanks": {
    bg: "bg-[var(--color-bg-badge-fuchsia)]",
    text: "text-[var(--fuchsia-700)]",
  },
};

interface QuestionTypeBadgeProps {
  type: QuestionType;
  className?: string;
}

export const QuestionTypeBadge = ({
  type,
  className,
}: QuestionTypeBadgeProps) => {
  const style = TYPE_STYLES[type] ?? {
    bg: "bg-[var(--color-bg-badge-gray)]",
    text: "text-[var(--color-text-subtle)]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
        style.bg,
        style.text,
        className,
      )}
    >
      {getQuestionTypeLabel(type)}
    </span>
  );
};
