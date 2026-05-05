"use client";

import { ChevronDown, Calendar } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TERMS = [
  "24/25 First Term",
  "24/25 Second Term",
  "24/25 Third Term",
  "23/24 Third Term",
];

export const TermSelector = () => {
  const [active, setActive] = useState(TERMS[2]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex h-9 items-center gap-2 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-3 text-sm text-[var(--color-text-default)] hover:bg-[var(--color-bg-state-soft-hover)]"
        >
          <Calendar className="h-3.5 w-3.5 text-[var(--color-icon-default-muted)]" />
          <span>{active}</span>
          <ChevronDown className="h-3.5 w-3.5 text-[var(--color-icon-default-muted)]" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {TERMS.map((t) => (
          <DropdownMenuItem key={t} onClick={() => setActive(t)}>
            {t}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
