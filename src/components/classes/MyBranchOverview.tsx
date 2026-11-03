"use client";

import { EmptyState } from "@/components/common/EmptyState";
import { StatCard } from "@/components/common/StatCard";
import { IconBadge } from "@/components/common/IconBadge";
import { ArmCard } from "@/components/classes/AllClassesView";
import type { TeacherCbtOverview } from "@/types/question";
import { BookFill, GraduationCapFill } from "@digenty/icons";

interface MyBranchOverviewProps {
  overview: TeacherCbtOverview["branchWide"];
}

export const MyBranchOverview = ({ overview }: MyBranchOverviewProps) => {
  const arms = overview?.arms ?? [];

  return (
    <>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <StatCard
          icon={
            <IconBadge color="--color-bg-basic-teal-subtle" className="border-bg-basic-teal-accent border rounded-xs">
              <GraduationCapFill fill="var(--color-text-default)" className="size-2.5" />
            </IconBadge>
          }
          label="Total Classes"
          value={overview?.totalClasses ?? "—"}
        />
        <StatCard
          icon={
            <IconBadge color="--color-bg-basic-yellow-subtle" className="border-bg-basic-yellow-accent border rounded-xs">
              <BookFill fill="var(--color-text-default)" className="size-2.5" />
            </IconBadge>
          }
          label="Total Subjects"
          value={overview?.totalSubjects ?? "—"}
        />
      </div>

      {arms.length === 0 ? (
        <EmptyState className="mt-6" title="No classes found" description="No classes have been created yet." />
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {arms.map((arm) => (
            <ArmCard key={arm.armId} arm={arm} canManage={false} />
          ))}
        </div>
      )}
    </>
  );
};
