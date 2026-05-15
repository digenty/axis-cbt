"use client";

import { useRef, useState } from "react";
import {
  Database,
  ChevronDown,
  Check,
  ImageIcon,
  Loader2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RichTextEditor } from "../RichTextEditor";
import { ComprehensionPassageEditor } from "./ComprehensionPassageEditor";
import { uploadImage } from "@/lib/uploads";
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
  stimulusImageUrl?: string;
  onChangeStimulusImage?: (url: string | undefined) => void;
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
  stimulusImageUrl,
  onChangeStimulusImage,
}: QuestionGroupEditorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    if (!onChangeStimulusImage) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, "cbt/stimulus");
      onChangeStimulusImage(url);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
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

        <div className="space-y-3 border-t border-[var(--color-border-default)] px-4 pb-4 pt-3">
          <RichTextEditor
            value={passage}
            onChange={onChangePassage}
            placeholder={getPlaceholder(materialKind)}
          />
          {onChangeStimulusImage && (
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
              {stimulusImageUrl ? (
                <div className="flex items-start gap-2">
                  <div className="relative h-32 w-44 overflow-hidden rounded-md bg-gray-100">
                    <img
                      src={stimulusImageUrl}
                      alt="Stimulus"
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
                    onClick={() => onChangeStimulusImage(undefined)}
                    className="text-[var(--color-icon-default-muted)] hover:text-[var(--color-icon-destructive)]"
                    aria-label="Remove stimulus image"
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
          )}
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
};
