"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "../ui/skeleton";
import { useGetTeacherSubjects } from "@/hooks/queryHooks/useSubjects";
import { useGetMyCbtOverview } from "@/hooks/queryHooks/useCbtOverview";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { canManageClassesAndSubjects } from "@/lib/permissions/classes-and-subjects";
import { MySubjectsList } from "@/components/subjects/MySubjectsList";
import { MyBranchOverview } from "@/components/classes/MyBranchOverview";
import { AllClassesView } from "@/components/classes/AllClassesView";

// `/teacher/subject/my` is the long-standing, reliable source for a teacher's own subjects
// (with arm-level detail) and stays the primary load for the common case. `/api/cbt/overview/my`
// is only fetched as a fallback for the narrower case it exists for - someone with no rows there
// at all (branch-wide staff, or a genuinely unassigned teacher) - so a teacher who already has
// subjects here never depends on that newer endpoint at all.
export const MySubjectsView = () => {
  const router = useRouter();
  const { data: subjects, isLoading, isError } = useGetTeacherSubjects();
  const hasSubjects = (subjects?.data?.length ?? 0) > 0;

  // "manage" classes & subjects means this person administers the module itself
  // (not a classroom teacher), so once they have no subject-teacher assignments
  // of their own they should see everything, not an empty state - without
  // needing the backend to separately recognize them as an admin.
  const { permissions } = useLoggedInUser();
  const canManage = canManageClassesAndSubjects(permissions ?? []);

  const { data: overviewRes, isLoading: overviewLoading } = useGetMyCbtOverview({
    enabled: !isLoading && !isError && !hasSubjects && !canManage,
  });
  const overview = overviewRes?.data;

  if (isLoading) {
    return (
      <div className="px-4 py-5 md:px-6 md:py-6">
        <PageHeader title="My Subjects" />
        <div className="mt-10 max-w-160">
          <Skeleton className="h-100 w-full bg-bg-state-soft" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-4 py-5 md:px-6 md:py-6">
        <PageHeader title="My Subjects" />
        <div className="mt-10">
          <EmptyState
            title="Could not load subjects"
            description="Please refresh the page and try again."
          />
        </div>
      </div>
    );
  }

  if (hasSubjects) {
    return (
      <div className="px-4 py-5 md:px-6 md:py-6">
        <PageHeader title="My Subjects" />
        <div className="mt-5 flex flex-col gap-5 max-w-160">
          {subjects?.data?.map((subject) => (
            <section
              key={subject.subjectId}
              className="overflow-hidden rounded-xl p-3 bg-bg-muted"
            >
              <header className=" bg-bg-muted px-5 py-3">
                <h2 className="text-base font-semibold text-[var(--color-text-default)]">
                  {subject.subjectName}
                </h2>
              </header>
              <ul className="border border-border-default bg-bg-card rounded-md">
                {subject.classArmReportDtos.map((arm) => (
                  <li
                    key={`${arm.classId}-${arm.armId}`}
                    className="flex items-center justify-between border-b border-[var(--color-border-default)] px-6 py-5 last:border-b-0"
                  >
                    <span className="text-base text-[var(--color-text-default)] font-semibold">
                      {arm.classArmName}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => {
                        const qs = new URLSearchParams({
                          className: arm.classArmName,
                          subjectName: subject.subjectName,
                          armId: String(arm.armId),
                          // This is the teacher's own assigned subject, so they always manage it
                          // regardless of the classes-and-subjects module permission.
                          canManage: "1",
                          // Signals the assessments list should come from the teacher-scoped
                          // `/api/cbt/assessments/my` endpoint, not the admin-only branch/class
                          // filtered one, which 403s for a non-admin token.
                          mine: "1",
                        }).toString();
                        router.push(
                          `/classes/${arm.classId}/subjects/${subject.subjectId}?${qs}`,
                        );
                      }}
                      className="h-7 bg-bg-state-primary! cursor-pointer"
                    >
                      View Subject
                    </Button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    );
  }

  if (canManage) {
    return <AllClassesView />;
  }

  return (
    <div className="px-4 py-5 md:px-6 md:py-6">
      <PageHeader title="My Subjects" />

      {overviewLoading ? (
        <div className="mt-10 max-w-160">
          <Skeleton className="h-100 w-full bg-bg-state-soft" />
        </div>
      ) : overview?.scope === "BRANCH_WIDE" ? (
        <MyBranchOverview overview={overview.branchWide} />
      ) : overview && overview.subjects.length > 0 ? (
        <MySubjectsList subjects={overview.subjects} />
      ) : (
        <div className="mt-10">
          <EmptyState
            title="No subjects assigned"
            description="You aren't currently assigned to any subjects yet."
          />
        </div>
      )}
    </div>
  );
};
