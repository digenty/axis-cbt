"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Book,
  BookText,
  GraduationCap,
  Loader2,
} from "lucide-react";
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
import {
  ArrowOpenRight,
  BookFill,
  BookOpen,
  GraduationCapFill,
  NumStudentIcon,
  TimeFill,
} from "@digenty/icons";
import { Badge } from "../ui/badge";
import { useRouter } from "next/navigation";
import { IconBadge } from "../common/IconBadge";

export const AllClassesView = () => {
  const { data, isLoading, isError } = useGetAllClasses();
  const [search, setSearch] = useState("");
  const [levels, setLevels] = useState<string[]>([]);

  const classes = useMemo<ApiClass[]>(() => data?.data?.content ?? [], [data]);

  const allLevels = useMemo(
    () => Array.from(new Set(classes.map((c) => c.name))),
    [classes],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return classes.filter((c) => {
      const matchesSearch = !q || c.name.toLowerCase().includes(q);
      const matchesLevel = levels.length === 0 || levels.includes(c.name);
      return matchesSearch && matchesLevel;
    });
  }, [classes, search, levels]);

  console.log(filtered);

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
          value={data?.data?.totalElements ?? classes.length}
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

const ApiClassCard = ({ cls }: { cls: ApiClass }) => {
  const router = useRouter();

  return (
    <div className="bg-bg-subtle border-border-default flex flex-col gap-4 rounded-md border p-4 md:p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-text-default text-xs font-medium">{cls.name}</p>
          {/* <p className="text-text-muted pt-2 text-xs font-normal">{cls.branchName ? cls.branchName : "Not available"}</p> */}
          <p className="text-text-muted pt-2 text-xs font-normal">
            {"Not available"}
          </p>
        </div>
        <Badge className="border-border-default bg-bg-badge-default text-text-muted flex items-center gap-1 rounded-md text-xs font-normal">
          {/* <NumStudentIcon fill="var(--color-icon-default-muted)" /> {cls.} Subject{totalStudents !== "1" && "s"} */}
          <BookFill fill="var(--color-icon-default-muted)" /> Not available
        </Badge>
      </div>

      <Button
        onClick={() => router.push(`/classes/${cls.id}`)}
        className="border cursor-pointer border-border-darker bg-bg-state-secondary! text-text-default flex h-7 items-center gap-2 rounded-md border p-2"
      >
        {/* {isPending && <Spinner />} */}
        <span className="text-sm font-medium">Open</span>
        <ArrowOpenRight
          fill="var(--color-icon-default-muted)"
          className="size-3"
        />
      </Button>
    </div>
  );
};
