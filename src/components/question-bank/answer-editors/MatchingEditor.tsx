"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateId } from "@/lib/utils";

interface MatchingItem {
  id: string;
  text: string;
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
  const updateItem = (id: string, text: string) =>
    onChange(
      items.map((it) => (it.id === id ? { ...it, text } : it)),
      options,
    );

  const updateOption = (id: string, text: string) =>
    onChange(
      items,
      options.map((op) => (op.id === id ? { ...op, text } : op)),
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

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="space-y-2">
        <Label className="text-xs text-[var(--color-text-subtle)]">
          Items (left)
        </Label>
        {items.map((it, i) => (
          <div key={it.id} className="flex items-center gap-2">
            <span className="w-6 text-xs text-[var(--color-text-muted)]">
              {i + 1}.
            </span>
            <Input
              value={it.text}
              onChange={(e) => updateItem(it.id, e.target.value)}
              placeholder={`Item ${i + 1}`}
            />
            <button
              type="button"
              onClick={() => removeItem(it.id)}
              className="text-[var(--color-icon-default-muted)] hover:text-[var(--color-icon-destructive)]"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
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
          <div key={op.id} className="flex items-center gap-2">
            <span className="w-6 text-xs text-[var(--color-text-muted)]">
              {String.fromCharCode(65 + i)}.
            </span>
            <Input
              value={op.text}
              onChange={(e) => updateOption(op.id, e.target.value)}
              placeholder={`Option ${String.fromCharCode(65 + i)}`}
            />
            <button
              type="button"
              onClick={() => removeOption(op.id)}
              className="text-[var(--color-icon-default-muted)] hover:text-[var(--color-icon-destructive)]"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
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
