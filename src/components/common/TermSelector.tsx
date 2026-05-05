"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { Term } from "@/types/term";
import { Calendar } from "@digenty/icons";

interface TermSelectorProps {
  terms: Term[];
  termSelected: Term | null;
  setTermSelected: (term: Term | null) => void;
  loading?: boolean;
}

export const TermSelector = ({
  terms,
  termSelected,
  setTermSelected,
  loading,
}: TermSelectorProps) => {
  if (loading) {
    return <Skeleton className="bg-bg-input-soft h-9 w-40" />;
  }

  return (
    <Select
      value={termSelected ? String(termSelected.termId) : "none"}
      onValueChange={(value) => {
        if (value === "none") {
          setTermSelected(null);
          return;
        }
        const found = terms.find((t) => String(t.termId) === value) ?? null;
        setTermSelected(found);
      }}
    >
      <SelectTrigger className="bg-bg-state-secondary! text-text-default h-8! rounded-md border px-3 py-2 text-sm font-normal! capitalize">
        <Calendar fill="var(--color-icon-default-muted )" className="size-4" />
        {termSelected ? `${termSelected.term.toLowerCase()} Term` : "All Terms"}
      </SelectTrigger>
      <SelectContent className="bg-bg-card border-border-default">
        <SelectItem
          value="none"
          className="text-text-default text-sm font-medium"
        >
          All Terms
        </SelectItem>
        {terms.map((t) => (
          <SelectItem
            key={t.termId}
            value={String(t.termId)}
            className="text-text-default text-sm font-medium capitalize"
          >
            {t.term.toLowerCase()}
            {t.isActiveTerm && " (Active)"}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
