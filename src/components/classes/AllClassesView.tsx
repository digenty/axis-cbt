"use client";

import { EmptyState } from "@/components/common/EmptyState";
import { LevelFilter } from "@/components/common/LevelFilter";
import { PageHeader } from "@/components/common/PageHeader";
import { BranchSelector } from "@/components/common/BranchSelector";
import { SearchInput } from "@/components/common/SearchInput";
import { StatCard } from "@/components/common/StatCard";
import { TermSelector } from "@/components/common/TermSelector";
import { Button } from "@/components/ui/button";
import { useGetCbtOverview } from "@/hooks/queryHooks/useCbtOverview";
import { useGetBranches } from "@/hooks/queryHooks/useBranches";
import { useGetTermsBySchool } from "@/hooks/queryHooks/useTerms";
import { useGetClassLevelNames } from "@/hooks/queryHooks/useClassLevels";
import useDebounce from "@/hooks/useDebounce";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { Branch } from "@/types/branch";
import type { ApiCbtArmSummary } from "@/types/student-api";
import type { Term } from "@/types/term";
import { ArrowOpenRight, BookFill, GraduationCapFill } from "@digenty/icons";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { IconBadge } from "../common/IconBadge";
import { Badge } from "../ui/badge";
import { extractUniqueLevelsByType } from "@/utils/extractUniqueLevelsByType";

export const AllClassesView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevelNames, setSelectedLevelNames] = useState<string[]>([]);
  const [branchSelected, setBranchSelected] = useState<Branch | undefined>();
  const [termSelected, setTermSelected] = useState<Term | null>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { schoolId, isUserLoading } = useLoggedInUser();
  const { data: branchesRes, isLoading: branchesLoading } = useGetBranches();
  const { data: termsRes, isLoading: termsLoading } =
    useGetTermsBySchool(schoolId);
  const { data: levelNamesRes } = useGetClassLevelNames(branchSelected?.id);
  const levels = extractUniqueLevelsByType(levelNamesRes?.data || []);

  const selectedLevelId = useMemo(() => {
    if (selectedLevelNames.length !== 1) return undefined;
    return levels.find((level) => level.levelName === selectedLevelNames[0])
      ?.id;
  }, [levels, selectedLevelNames]);

  const {
    data: overviewData,
    isLoading,
    isError,
  } = useGetCbtOverview({
    branchId: branchSelected?.id,
    levelId: selectedLevelId,
    search: debouncedSearchQuery || undefined,
  });

  useEffect(() => {
    if (!termsRes?.data?.terms || termSelected !== null) return;
    const active = termsRes.data.terms.find((t) => t.isActiveTerm) ?? null;
    const id = setTimeout(() => setTermSelected(active), 0);
    return () => clearTimeout(id);
  }, [termsRes, termSelected]);

  const branches = useMemo(() => branchesRes?.data ?? [], [branchesRes]);
  const terms = useMemo(() => termsRes?.data?.terms ?? [], [termsRes]);
  const arms = useMemo(() => overviewData?.data?.arms ?? [], [overviewData]);
  const levelNames = useMemo(() => levels.map((l) => l.levelName), [levels]);

  return (
    <div className="px-4 py-5 md:px-6 md:py-6">
      <PageHeader
        title="All Classes"
        showBack
        right={
          <>
            <BranchSelector
              branches={branches}
              branchSelected={branchSelected}
              setBranchSelected={setBranchSelected}
              loadingBranches={branchesLoading}
            />
            <TermSelector
              terms={terms}
              termSelected={termSelected}
              setTermSelected={setTermSelected}
              loading={termsLoading || isUserLoading}
            />
          </>
        }
      />

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <StatCard
          icon={
            <IconBadge
              color="--color-bg-basic-teal-subtle"
              className="border-bg-basic-teal-accent border rounded-xs"
            >
              <GraduationCapFill
                fill="var(--color-text-default)"
                className="size-2.5"
              />
            </IconBadge>
          }
          label="Total Classes"
          value={overviewData?.data?.totalClasses ?? "—"}
        />
        <StatCard
          icon={
            <IconBadge
              color="--color-bg-basic-yellow-subtle"
              className="border-bg-basic-yellow-accent border rounded-xs"
            >
              <BookFill fill="var(--color-text-default)" className="size-2.5" />
            </IconBadge>
          }
          label="Total Subjects"
          value={overviewData?.data?.totalSubjects ?? "—"}
        />
      </div>

      <div className="mt-5 flex items-center gap-2">
        <SearchInput
          className="md:w-70.5"
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search classes"
        />
        <LevelFilter
          levels={levelNames}
          selected={selectedLevelNames}
          onChange={setSelectedLevelNames}
        />
      </div>

      {isLoading ? (
        <div className="mt-10 flex justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-[var(--color-icon-default-muted)]" />
        </div>
      ) : isError ? (
        <EmptyState
          className="mt-6"
          title="Failed to load classes"
          description="Please refresh the page to try again."
        />
      ) : arms.length === 0 ? (
        <EmptyState
          className="mt-6"
          title="No classes found"
          description={
            searchQuery || selectedLevelNames.length > 0 || branchSelected
              ? "Try adjusting your filters."
              : "No classes have been created yet."
          }
        />
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {arms.map((arm) => (
            <ArmCard key={arm.armId} arm={arm} />
          ))}
        </div>
      )}
    </div>
  );
};

const ArmCard = ({ arm }: { arm: ApiCbtArmSummary }) => {
  const router = useRouter();

  return (
    <div className="bg-bg-subtle border-border-default flex flex-col gap-4 rounded-md border p-4 md:p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-text-default text-xs font-medium">
            {arm.displayName}
          </p>
          <p className="text-text-muted pt-2 text-xs font-normal">
            {arm.branchName}
          </p>
        </div>
        <Badge className="border-border-default bg-bg-badge-default text-text-muted flex items-center gap-1 rounded-md text-xs font-normal">
          <BookFill fill="var(--color-icon-default-muted)" />
          {arm.subjectCount} Subject{arm.subjectCount !== 1 ? "s" : ""}
        </Badge>
      </div>

      <Button
        onClick={() =>
          router.push(
            `/classes/${arm.armId}?className=${encodeURIComponent(arm.displayName)}`,
          )
        }
        className="border cursor-pointer border-border-darker bg-bg-state-secondary! text-text-default flex h-7 items-center gap-2 rounded-md border p-2"
      >
        <span className="text-sm font-medium">Open</span>
        <ArrowOpenRight
          fill="var(--color-icon-default-muted)"
          className="size-3"
        />
      </Button>
    </div>
  );
};
