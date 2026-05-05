"use client";

import { useMemo, useState } from "react";
import { useCBTStore } from "@/store";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { SearchInput } from "@/components/common/SearchInput";
import { LevelFilter } from "@/components/common/LevelFilter";
import { SchoolSelector } from "@/components/common/SchoolSelector";
import { TermSelector } from "@/components/common/TermSelector";
import { ClassCard } from "./ClassCard";
import { GraduationCap, BookOpen } from "lucide-react";

export const AllClassesView = () => {
  const { classes, subjects } = useCBTStore();
  const [search, setSearch] = useState("");
  const [levels, setLevels] = useState<string[]>([]);

  const allLevels = useMemo(
    () => Array.from(new Set(classes.map((c) => c.level))),
    [classes],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return classes.filter((c) => {
      const matchesSearch = !q || c.name.toLowerCase().includes(q);
      const matchesLevel = levels.length === 0 || levels.includes(c.level);
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
          value={classes.length}
        />
        <StatCard
          icon={<BookOpen className="h-4 w-4" />}
          label="Total Subjects"
          value={subjects.length}
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

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((cls) => (
          <ClassCard key={cls.id} cls={cls} />
        ))}
      </div>
    </div>
  );
};
