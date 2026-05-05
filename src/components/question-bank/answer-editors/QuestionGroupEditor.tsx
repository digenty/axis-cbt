"use client";

import { Database, ChevronDown, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RichTextEditor } from "../RichTextEditor";
import { ComprehensionPassageEditor } from "./ComprehensionPassageEditor";
import type { Question } from "@/types";

export type MaterialKind =
  | "comprehension-passage"
  | "diagram"
  | "table"
  | "chart"
  | "multiple-blanks";

interface QuestionGroupEditorProps {
  materialKind: MaterialKind;
  onChangeMaterialKind: (k: MaterialKind) => void;
  passage: string;
  onChangePassage: (p: string) => void;
  instruction: string;
  onChangeInstruction: (i: string) => void;
  subQuestions: Question[];
  onChangeSubQuestions: (qs: Question[]) => void;
}

const MATERIAL_KINDS: { label: string; value: MaterialKind }[] = [
  { label: "Comprehension Passage", value: "comprehension-passage" },
  { label: "Diagram", value: "diagram" },
  { label: "Table", value: "table" },
  { label: "Chart", value: "chart" },
  { label: "Multiple Blanks", value: "multiple-blanks" },
];

function getLabel(kind: MaterialKind): string {
  return MATERIAL_KINDS.find((m) => m.value === kind)?.label ?? kind;
}

function getPlaceholder(kind: MaterialKind): string {
  switch (kind) {
    case "comprehension-passage":
      return "Type or paste the comprehension passage";
    case "table":
      return "Create table content";
    case "chart":
      return "Describe chart data";
    case "multiple-blanks":
      return "Create text with blanks";
    default:
      return "Add descriptive text for your question material";
  }
}

export const QuestionGroupEditor = ({
  materialKind,
  onChangeMaterialKind,
  passage,
  onChangePassage,
  instruction,
  onChangeInstruction,
  subQuestions,
  onChangeSubQuestions,
}: QuestionGroupEditorProps) => (
  <div className="space-y-4">
    {/* ─── Question Material card ─── */}
    <div className="overflow-hidden rounded-xl border border-[var(--color-border-default)]">
      <div className="flex items-start gap-3 px-4 py-4">
        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950">
          <Database className="h-5 w-5 text-blue-500" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[var(--color-text-default)]">
            Question Material
          </p>
          <p className="mt-0.5 text-xs text-[var(--color-text-subtle)]">
            This is the shared content that all questions in this group will
            reference.
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex h-8 items-center gap-1.5 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-3 text-sm font-medium text-[var(--color-text-default)] hover:bg-[var(--color-bg-state-soft-hover)]"
            >
              {getLabel(materialKind)}
              <ChevronDown className="h-3.5 w-3.5 text-[var(--color-icon-default-muted)]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-48 py-1">
            {MATERIAL_KINDS.map(({ label, value }) => (
              <DropdownMenuItem
                key={value}
                onClick={() => onChangeMaterialKind(value)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-text-default)]"
              >
                {label}
                {materialKind === value && (
                  <Check className="ml-auto h-3.5 w-3.5" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="border-t border-[var(--color-border-default)] px-4 pb-4 pt-3">
        <RichTextEditor
          value={passage}
          onChange={onChangePassage}
          placeholder={getPlaceholder(materialKind)}
        />
      </div>
    </div>

    {/* ─── Sub-questions ─── */}
    <ComprehensionPassageEditor
      instruction={instruction}
      onChangeInstruction={onChangeInstruction}
      subQuestions={subQuestions}
      onChangeSubQuestions={onChangeSubQuestions}
    />
  </div>
);
