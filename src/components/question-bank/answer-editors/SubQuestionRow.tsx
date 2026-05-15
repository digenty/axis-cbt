"use client";

import { useRef, useState } from "react";
import { ChevronDown, ImageIcon, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QuestionTypeBadge } from "@/components/common/QuestionTypeBadge";
import { QuestionTypeSelector } from "../QuestionTypeSelector";
import { RichTextEditor } from "../RichTextEditor";
import { MultipleChoiceEditor } from "./MultipleChoiceEditor";
import { TrueFalseEditor } from "./TrueFalseEditor";
import { ShortAnswerEditor } from "./ShortAnswerEditor";
import { EssayEditor } from "./EssayEditor";
import type { Question, QuestionType } from "@/types";
import { cn } from "@/lib/utils";
import { uploadImage } from "@/lib/uploads";

const SUB_TYPES: QuestionType[] = [
  "multiple-choice",
  "multiple-answers",
  "true-false",
  "short-answer",
  "essay",
  "fill-in-blank",
  "numerical",
];

interface SubQuestionRowProps {
  index: number;
  question: Question;
  onChange: (q: Question) => void;
  onDelete: () => void;
}

export const SubQuestionRow = ({
  index,
  question,
  onChange,
  onDelete,
}: SubQuestionRowProps) => {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadImage(file, "cbt/sub-questions");
      onChange({ ...question, imageUrl: url });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-default)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 px-3 py-2 text-left"
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-bg-state-soft)] text-xs font-medium">
          Q{index + 1}
        </span>
        <div
          className="flex-1 truncate text-sm text-[var(--color-text-default)]"
          dangerouslySetInnerHTML={{ __html: question.text || "(untitled)" }}
        />
        <QuestionTypeBadge type={question.type} />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
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
          <div className="flex items-center justify-between">
            <Label className="text-xs text-[var(--color-text-subtle)]">
              Question text
            </Label>
            <QuestionTypeSelector
              value={question.type}
              onChange={(t) => onChange({ ...question, type: t })}
              options={SUB_TYPES}
            />
          </div>
          <RichTextEditor
            value={question.text}
            onChange={(v) => onChange({ ...question, text: v })}
            minHeight="80px"
          />

          <div className="flex flex-col gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (file) handleUpload(file);
              }}
            />
            {question.imageUrl ? (
              <div className="flex items-start gap-2">
                <div className="relative h-24 w-32 overflow-hidden rounded-md bg-gray-100">
                  <img
                    src={question.imageUrl}
                    alt="Sub-question"
                    className="absolute inset-0 h-full w-full object-contain"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    "Replace"
                  )}
                </Button>
                <button
                  type="button"
                  onClick={() => onChange({ ...question, imageUrl: undefined })}
                  className="text-[var(--color-icon-default-muted)] hover:text-[var(--color-icon-destructive)]"
                  aria-label="Remove image"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 w-fit gap-1.5 px-2 text-xs"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <ImageIcon className="h-3.5 w-3.5" />
                )}
                Add Image
              </Button>
            )}
          </div>

          {(question.type === "multiple-choice" ||
            question.type === "multiple-answers") && (
            <MultipleChoiceEditor
              options={question.options ?? []}
              multi={question.type === "multiple-answers"}
              onChange={(opts) => onChange({ ...question, options: opts })}
            />
          )}

          {question.type === "true-false" && (
            <TrueFalseEditor
              value={
                (question.options?.find((o) => o.isCorrect)?.id as
                  | "true"
                  | "false"
                  | null) ?? null
              }
              onChange={(v) =>
                onChange({
                  ...question,
                  options: [
                    { id: "true", text: "True", isCorrect: v === "true" },
                    { id: "false", text: "False", isCorrect: v === "false" },
                  ],
                })
              }
            />
          )}

          {(question.type === "short-answer" ||
            question.type === "fill-in-blank" ||
            question.type === "numerical") && (
            <ShortAnswerEditor
              answer={(question.correctAnswer as string) ?? ""}
              onChange={(a) => onChange({ ...question, correctAnswer: a })}
            />
          )}

          {question.type === "essay" && (
            <EssayEditor
              guidance={question.instruction ?? ""}
              onChange={(g) => onChange({ ...question, instruction: g })}
            />
          )}

          <div className="space-y-1.5">
            <Label className="text-xs text-[var(--color-text-subtle)]">
              Marks
            </Label>
            <Input
              type="number"
              min={0}
              value={question.marks}
              onChange={(e) =>
                onChange({
                  ...question,
                  marks: Number(e.target.value) || 0,
                })
              }
              className="w-24"
            />
          </div>
        </div>
      )}
    </div>
  );
};
