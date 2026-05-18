"use client";

import { useRef, useState } from "react";
import { ImageIcon, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "@/components/common/Toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateId } from "@/lib/utils";
import { uploadImage } from "@/lib/uploads";
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
  const [uploadingId, setUploadingId] = useState<string | null>(null);

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
        <OptionRow
          key={opt.id}
          opt={opt}
          letter={LETTERS[i] ?? String(i + 1)}
          uploading={uploadingId === opt.id}
          onToggleCorrect={() => setCorrect(opt.id)}
          onTextChange={(text) => update(opt.id, { text })}
          onUpload={async (file) => {
            setUploadingId(opt.id);
            try {
              const url = await uploadImage(file, "cbt/options");
              update(opt.id, { imageUrl: url });
            } catch (err) {
              toast({
                title: err instanceof Error ? err.message : "Upload failed",
                type: "error",
              });
            } finally {
              setUploadingId(null);
            }
          }}
          onRemoveImage={() => update(opt.id, { imageUrl: undefined })}
          onDelete={() => remove(opt.id)}
        />
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

interface OptionRowProps {
  opt: Option;
  letter: string;
  uploading: boolean;
  onToggleCorrect: () => void;
  onTextChange: (text: string) => void;
  onUpload: (file: File) => void;
  onRemoveImage: () => void;
  onDelete: () => void;
}

const OptionRow = ({
  opt,
  letter,
  uploading,
  onToggleCorrect,
  onTextChange,
  onUpload,
  onRemoveImage,
  onDelete,
}: OptionRowProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-default)]">
      <div className="flex items-center gap-2 px-3 py-2">
        <button
          type="button"
          onClick={onToggleCorrect}
          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border ${
            opt.isCorrect
              ? "border-[var(--blue-500)] bg-[var(--blue-500)] text-white"
              : "border-[var(--color-border-strong)]"
          }`}
          aria-label={opt.isCorrect ? "Mark incorrect" : "Mark correct"}
        >
          {opt.isCorrect && (
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
        </button>
        <span className="w-5 text-sm font-medium text-[var(--color-text-default)]">
          {letter}.
        </span>
        <Input
          value={opt.text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder={`Option ${letter}`}
          className="flex-1 border-0 shadow-none focus-visible:ring-0"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) onUpload(file);
          }}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="text-[var(--color-icon-default-muted)] hover:text-[var(--color-text-default)] disabled:opacity-60"
          aria-label="Add option image"
        >
          {uploading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <ImageIcon className="h-3.5 w-3.5" />
          )}
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="text-[var(--color-icon-default-muted)] hover:text-[var(--color-icon-destructive)]"
          aria-label="Delete option"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      {opt.imageUrl && (
        <div className="flex items-center gap-2 border-t border-[var(--color-border-default)] px-3 py-2">
          <div className="relative h-20 w-28 overflow-hidden rounded bg-gray-100">
            <img
              src={opt.imageUrl}
              alt={`Option ${letter}`}
              className="absolute inset-0 h-full w-full object-contain"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="h-7 px-2 text-xs"
          >
            Replace
          </Button>
          <button
            type="button"
            onClick={onRemoveImage}
            className="text-[var(--color-icon-default-muted)] hover:text-[var(--color-icon-destructive)]"
            aria-label="Remove option image"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
