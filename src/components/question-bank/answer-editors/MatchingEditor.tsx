"use client";

import { useRef, useState } from "react";
import { ImageIcon, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateId } from "@/lib/utils";
import { uploadImage } from "@/lib/uploads";

interface MatchingItem {
  id: string;
  text: string;
  imageUrl?: string;
}

interface MatchingEditorProps {
  items: MatchingItem[];
  options: MatchingItem[];
  onChange: (items: MatchingItem[], options: MatchingItem[]) => void;
}

export const MatchingEditor = ({
  items,
  options,
  onChange,
}: MatchingEditorProps) => {
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const updateItem = (id: string, patch: Partial<MatchingItem>) =>
    onChange(
      items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
      options,
    );

  const updateOption = (id: string, patch: Partial<MatchingItem>) =>
    onChange(
      items,
      options.map((op) => (op.id === id ? { ...op, ...patch } : op)),
    );

  const removeItem = (id: string) =>
    onChange(
      items.filter((it) => it.id !== id),
      options,
    );

  const removeOption = (id: string) =>
    onChange(
      items,
      options.filter((op) => op.id !== id),
    );

  const handleUpload = async (
    id: string,
    file: File,
    apply: (id: string, patch: Partial<MatchingItem>) => void,
  ) => {
    setUploadingId(id);
    try {
      const url = await uploadImage(file, "cbt/match");
      apply(id, { imageUrl: url });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="space-y-2">
        <Label className="text-xs text-[var(--color-text-subtle)]">
          Items (left)
        </Label>
        {items.map((it, i) => (
          <MatchRow
            key={it.id}
            item={it}
            label={`${i + 1}.`}
            placeholder={`Item ${i + 1}`}
            uploading={uploadingId === it.id}
            onTextChange={(text) => updateItem(it.id, { text })}
            onUpload={(file) => handleUpload(it.id, file, updateItem)}
            onRemoveImage={() => updateItem(it.id, { imageUrl: undefined })}
            onDelete={() => removeItem(it.id)}
          />
        ))}
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            onChange([...items, { id: generateId(), text: "" }], options)
          }
        >
          <Plus className="mr-1 h-3.5 w-3.5" />
          Add Item
        </Button>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-[var(--color-text-subtle)]">
          Options (right — drop targets)
        </Label>
        {options.map((op, i) => (
          <MatchRow
            key={op.id}
            item={op}
            label={`${String.fromCharCode(65 + i)}.`}
            placeholder={`Option ${String.fromCharCode(65 + i)}`}
            uploading={uploadingId === op.id}
            onTextChange={(text) => updateOption(op.id, { text })}
            onUpload={(file) => handleUpload(op.id, file, updateOption)}
            onRemoveImage={() => updateOption(op.id, { imageUrl: undefined })}
            onDelete={() => removeOption(op.id)}
          />
        ))}
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            onChange(items, [...options, { id: generateId(), text: "" }])
          }
        >
          <Plus className="mr-1 h-3.5 w-3.5" />
          Add Option
        </Button>
      </div>
    </div>
  );
};

interface MatchRowProps {
  item: MatchingItem;
  label: string;
  placeholder: string;
  uploading: boolean;
  onTextChange: (text: string) => void;
  onUpload: (file: File) => void;
  onRemoveImage: () => void;
  onDelete: () => void;
}

const MatchRow = ({
  item,
  label,
  placeholder,
  uploading,
  onTextChange,
  onUpload,
  onRemoveImage,
  onDelete,
}: MatchRowProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <span className="w-6 text-xs text-[var(--color-text-muted)]">
          {label}
        </span>
        <Input
          value={item.text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder={placeholder}
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
          aria-label="Add image"
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
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      {item.imageUrl && (
        <div className="ml-8 flex items-center gap-2">
          <div className="relative h-16 w-24 overflow-hidden rounded bg-gray-100">
            <img
              src={item.imageUrl}
              alt={item.text || placeholder}
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
            aria-label="Remove image"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
