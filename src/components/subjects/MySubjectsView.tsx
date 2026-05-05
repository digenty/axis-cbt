"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { useRouter } from "next/navigation";
import { useGetTeacherSubjects } from "@/hooks/queryHooks/useSubjects";
import { Skeleton } from "../ui/skeleton";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { AllClassesView } from "@/components/classes/AllClassesView";

export const MySubjectsView = () => {
  const router = useRouter();
  const { data: subjects, isLoading, isError } = useGetTeacherSubjects();
  const { isAdmin, isMain, isUserLoading } = useLoggedInUser();

  const isPrivileged = Boolean(isAdmin || isMain);
  const hasSubjects = (subjects?.data?.length ?? 0) > 0;
  console.log(isAdmin, isMain);

  if (
    !isLoading &&
    !isUserLoading &&
    !isError &&
    isPrivileged &&
    !hasSubjects
  ) {
    return <AllClassesView />;
  }

  return (
    <div className="px-4 py-5 md:px-6 md:py-6">
      <PageHeader
        title="My Subjects"
        right={
          isPrivileged && hasSubjects ? (
            <Button asChild variant="outline" size="sm">
              <Link href="/classes">
                View All Classes
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          ) : undefined
        }
      />

      {isLoading || isUserLoading ? (
        <div className="mt-10 max-w-160 ">
          <Skeleton className="h-100 w-full bg-bg-state-soft" />
        </div>
      ) : isError ? (
        <div className="mt-10">
          <EmptyState
            title="Could not load subjects"
            description="Please refresh the page and try again."
          />
        </div>
      ) : !hasSubjects ? (
        <div className="mt-10">
          <EmptyState
            title="No subjects assigned"
            description="You aren't currently assigned to any subjects."
          />
        </div>
      ) : (
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
      )}
    </div>
  );
};
