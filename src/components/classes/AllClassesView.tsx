"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookText, GraduationCap, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { SearchInput } from "@/components/common/SearchInput";
import { LevelFilter } from "@/components/common/LevelFilter";
import { SchoolSelector } from "@/components/common/SchoolSelector";
import { TermSelector } from "@/components/common/TermSelector";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { useGetAllClasses } from "@/hooks/queryHooks/useClasses";
import type { ApiClass } from "@/types/classes";

export const AllClassesView = () => {
  const { data, isLoading, isError } = useGetAllClasses();
  const [search, setSearch] = useState("");
  const [levels, setLevels] = useState<string[]>([]);

  const classes = useMemo<ApiClass[]>(() => data?.data?.content ?? [], [data]);

  const allLevels = useMemo(
    () => Array.from(new Set(classes.map((c) => c.level.name))),
    [classes],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return classes.filter((c) => {
      const matchesSearch = !q || c.name.toLowerCase().includes(q);
      const matchesLevel = levels.length === 0 || levels.includes(c.level.name);
      return matchesSearch && matchesLevel;
    });
  }, [classes, search, levels]);

  return (
    <div className="px-4 py-5 md:px-6 md:py-6">
      <PageHeader
        title="All Classes"
        showBack
        backHref="/subjects"
        right={
          <>
            <SchoolSelector />
            <TermSelector />
          </>
        }
      />

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <StatCard
          icon={<GraduationCap className="h-4 w-4" />}
          label="Total Classes"
          value={data?.data?.totalElements ?? classes.length}
        />
        <StatCard
          icon={<BookText className="h-4 w-4" />}
          label="Levels"
          value={allLevels.length}
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <div className="min-w-0 flex-1">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search classes"
          />
        </div>
        <LevelFilter
          levels={allLevels}
          selected={levels}
          onChange={setLevels}
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
      ) : filtered.length === 0 ? (
        <EmptyState
          className="mt-6"
          title="No classes found"
          description={
            search || levels.length > 0
              ? "Try adjusting your filters."
              : "No classes have been created yet."
          }
        />
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((cls) => (
            <ApiClassCard key={cls.id} cls={cls} />
          ))}
        </div>
      )}
    </div>
  );
};

const ApiClassCard = ({ cls }: { cls: ApiClass }) => (
  <div className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)] p-4">
    <div className="flex items-start justify-between gap-2">
      <div>
        <div className="text-sm font-semibold text-[var(--color-text-default)]">
          {cls.name}
        </div>
        <div className="mt-0.5 text-xs text-[var(--color-text-muted)]">
          {cls.level.name}
        </div>
      </div>
      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-bg-badge-gray)] px-2 py-0.5 text-[11px] text-[var(--color-text-subtle)]">
        <BookText className="h-3 w-3" />
        {cls.arms.length} {cls.arms.length === 1 ? "Arm" : "Arms"}
      </span>
    </div>

    <Button
      asChild
      variant="outline"
      className="mt-4 w-full justify-center font-medium"
    >
      <Link href={`/classes/${cls.id}`}>
        Open
        <ArrowRight className="ml-1 h-3.5 w-3.5" />
      </Link>
    </Button>
  </div>
);
