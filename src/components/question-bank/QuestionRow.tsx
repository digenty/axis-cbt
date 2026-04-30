"use client";

import { useState } from "react";
import {
  ChevronDown,
  GripVertical,
  Pencil,
  Trash2,
  Copy,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { QuestionTypeBadge } from "@/components/common/QuestionTypeBadge";
import { QuestionEditForm } from "./QuestionEditForm";
import type { Question } from "@/types";
import { cn } from "@/lib/utils";

interface QuestionRowProps {
  index: number;
  question: Question;
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onUpdate?: (q: Question) => void;
}

export const QuestionRow = ({
  question,
  dragHandleProps,
  onEdit,
  onDuplicate,
  onDelete,
  onUpdate,
}: QuestionRowProps) => {
  const [open, setOpen] = useState(false);

  const isGroup =
    question.type === "question-group" ||
    question.type === "comprehension-passage" ||
    question.type === "multiple-blanks";

  const meta = (
    <div className="flex flex-wrap items-center gap-2 pt-1.5">
      <QuestionTypeBadge type={question.type} />
      <span className="text-[11px] text-[var(--color-text-muted)]">
        •
        {isGroup
          ? ` ${question.subQuestions?.length ?? question.blanks?.length ?? 0} questions`
          : ""}
        {` ${question.marks} mark${question.marks === 1 ? "" : "s"}`}
      </span>
    </div>
  );

  return (
    <div
      className={cn(
        "rounded-lg bg-[var(--color-bg-card)] transition-colors",
        open
          ? "border-2 border-blue-500"
          : "border border-[var(--color-border-default)]",
      )}
    >
      <div className="flex items-center gap-2 px-3 py-2.5">
        <button
          type="button"
          className="flex h-5 w-3 cursor-grab items-center justify-center text-[var(--color-icon-default-muted)] active:cursor-grabbing"
          {...dragHandleProps}
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex flex-1 items-center text-left"
        >
          <div className="flex-1">
            <div className="text-sm text-[var(--color-text-default)]">
              {question.text || "(untitled)"}
            </div>
            {meta}
          </div>
          <ChevronDown
            className={cn(
              "mt-1 h-4 w-4 shrink-0 text-[var(--color-icon-default-muted)] transition-transform",
              open && "rotate-180",
            )}
          />
        </button>
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-icon-default-muted)] hover:bg-[var(--color-bg-state-soft-hover)]"
              aria-label="More actions"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="mr-2 h-3.5 w-3.5" />
              Open in editor
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDuplicate}>
              <Copy className="mr-2 h-3.5 w-3.5" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onDelete}
              className="text-[var(--color-text-destructive)]"
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>

      {open && onUpdate && (
        <QuestionEditForm
          question={question}
          onUpdate={onUpdate}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
        />
      )}
    </div>
  );
};
