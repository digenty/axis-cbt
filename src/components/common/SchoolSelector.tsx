"use client";

import { ChevronDown, Building2 } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SCHOOLS = ["Lawanson", "Surulere", "Ikeja"];

export const SchoolSelector = () => {
  const [active, setActive] = useState(SCHOOLS[0]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex h-9 items-center gap-2 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-3 text-sm text-[var(--color-text-default)] hover:bg-[var(--color-bg-state-soft-hover)]"
        >
          <Building2 className="h-3.5 w-3.5 text-[var(--color-icon-default-muted)]" />
          <span>{active}</span>
          <ChevronDown className="h-3.5 w-3.5 text-[var(--color-icon-default-muted)]" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {SCHOOLS.map((s) => (
          <DropdownMenuItem key={s} onClick={() => setActive(s)}>
            {s}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
