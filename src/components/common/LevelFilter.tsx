"use client";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ListFilter } from "lucide-react";

interface LevelFilterProps {
  levels: string[];
  selected: string[];
  onChange: (levels: string[]) => void;
}

export const LevelFilter = ({
  levels,
  selected,
  onChange,
}: LevelFilterProps) => {
  const toggle = (l: string) => {
    onChange(
      selected.includes(l) ? selected.filter((x) => x !== l) : [...selected, l],
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex h-9 items-center gap-2 rounded-full border border-dashed border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-3 text-sm text-[var(--color-text-default)] hover:bg-[var(--color-bg-state-soft-hover)]"
        >
          <ListFilter className="h-3.5 w-3.5 text-[var(--color-icon-default-muted)]" />
          <span>Level{selected.length > 0 && ` · ${selected.length}`}</span>
          <ChevronDown className="h-3.5 w-3.5 text-[var(--color-icon-default-muted)]" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {levels.map((l) => (
          <DropdownMenuCheckboxItem
            key={l}
            checked={selected.includes(l)}
            onCheckedChange={() => toggle(l)}
          >
            {l}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
