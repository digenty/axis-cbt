"use client";

import { Skeleton } from "../ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { Branch, BranchWithClassLevels } from "@/types/branch";
import { School } from "@digenty/icons";

interface BranchSelectorProps {
  branches: BranchWithClassLevels[];
  setBranchSelected: (branchSelected?: Branch) => void;
  branchSelected?: Branch;
  loadingBranches: boolean;
}

export const BranchSelector = ({
  branches,
  setBranchSelected,
  branchSelected,
  loadingBranches,
}: BranchSelectorProps) => {
  if (loadingBranches) {
    return <Skeleton className="bg-bg-input-soft h-9 w-36" />;
  }

  return (
    <Select
      value={branchSelected?.uuid ?? "none"}
      onValueChange={(value) => {
        if (value === "none") {
          setBranchSelected(undefined);
          return;
        }
        const found = branches.find((b) => b.branch?.uuid === value);
        setBranchSelected(found?.branch);
      }}
    >
      <SelectTrigger className="bg-bg-state-secondary! text-text-default h-8! rounded-md border px-3 py-2 text-left text-sm font-normal!">
        <span className="text-text-default! text-sm font-medium flex items-center gap-2">
          <School fill="var(--color-text-default)" className="size-3.5" />
          {branchSelected ? branchSelected.name : "All Branches"}
        </span>
      </SelectTrigger>
      <SelectContent className="bg-bg-card border-border-default">
        <SelectItem
          value="none"
          className="text-text-default text-sm font-medium"
        >
          All Branches
        </SelectItem>
        {branches.map((b) => (
          <SelectItem
            key={b.branch?.id}
            value={b.branch?.uuid}
            className="text-text-default text-sm font-medium"
          >
            {b.branch?.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
