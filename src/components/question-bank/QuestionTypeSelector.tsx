"use client";

import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { QuestionType } from "@/types";
import { getQuestionTypeLabel } from "@/lib/utils";

interface QuestionTypeSelectorProps {
  value: QuestionType;
  onChange: (type: QuestionType) => void;
  options: QuestionType[];
}

export const QuestionTypeSelector = ({
  value,
  onChange,
  options,
}: QuestionTypeSelectorProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button
        type="button"
        className="flex h-9 items-center gap-2 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-3 text-sm font-medium text-[var(--color-text-default)] hover:bg-[var(--color-bg-state-soft-hover)]"
      >
        {getQuestionTypeLabel(value)}
        <ChevronDown className="h-3.5 w-3.5 text-[var(--color-icon-default-muted)]" />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start" className="min-w-48 py-1">
      {options.map((opt) => (
        <DropdownMenuItem
          key={opt}
          onClick={() => onChange(opt)}
          className="px-4 py-2 text-sm text-[var(--color-text-default)]"
        >
          {getQuestionTypeLabel(opt)}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);
