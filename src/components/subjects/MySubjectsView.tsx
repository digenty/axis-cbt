"use client";

import Link from "next/link";
import { BookOpen, ChevronRight, AlertCircle, RefreshCw } from "lucide-react";
import { useGetTeacherSubjects } from "@/hooks/queryHooks/useSubjects";
import { ApiSubject, ClassArmReportDtos } from "@/types/subjects";
import { cn } from "@/lib/utils";
import Layout from "@/components/Layout";
import { useEffect } from "react";

const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse rounded-md bg-bg-subtle", className)} />
);

const SubjectsLoadingSkeleton = () => (
  <Layout>
    <div className="space-y-4">
      <Skeleton className="h-5 w-28" />
      {[1, 2].map((i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border border-border-default"
        >
          <div className="border-b border-border-default bg-bg-subtle px-4 py-3">
            <Skeleton className="h-4 w-24" />
          </div>
          {[1, 2, 3].map((j) => (
            <div
              key={j}
              className="flex items-center justify-between border-b border-border-default px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-4 w-28" />
              </div>
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
          ))}
        </div>
      ))}
    </div>
  </Layout>
);

export const MySubjectsView = () => {
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetTeacherSubjects();

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) return <SubjectsLoadingSkeleton />;

  if (isError) {
    const message =
      (error as { message?: string })?.message ?? "Failed to load subjects";
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-bg-basic-red-subtle mb-4 flex h-12 w-12 items-center justify-center rounded-2xl">
            <AlertCircle className="text-text-destructive h-6 w-6" />
          </div>
          <p className="text-text-subtle mb-1 text-sm font-medium">
            Could not load subjects
          </p>
          <p className="text-text-muted mb-5 max-w-xs text-xs">{message}</p>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="border-border-default text-text-subtle hover:bg-bg-subtle flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={cn("h-3.5 w-3.5", isFetching && "animate-spin")}
            />
            Try again
          </button>
        </div>
      </Layout>
    );
  }

  const subjects: ApiSubject[] = response?.data ?? [];

  if (subjects.length === 0) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <BookOpen className="text-text-hint mb-4 h-12 w-12" />
          <p className="text-text-muted text-sm font-medium">
            No subjects assigned
          </p>
          <p className="text-text-muted mt-1 text-xs">
            Subjects assigned to you will appear here
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-5">
        <h2 className="text-text-default text-base font-semibold">My Subjects</h2>
        {subjects.map((subject) => (
          <SubjectGroup key={subject?.subjectId} subject={subject} />
        ))}
      </div>
    </Layout>
  );
};

const SubjectGroup = ({ subject }: { subject: ApiSubject }) => {
  console.log({ subject });
  return (
    <div className="overflow-hidden rounded-xl border border-border-default shadow-sm">
      <div className="border-b border-border-default bg-bg-subtle px-4 py-3">
        <h3 className="text-text-default text-sm font-semibold">
          {subject?.subjectName}
        </h3>
      </div>
      <div className="divide-y divide-border-default">
        {subject?.classArmReportDtos?.map((classArm) => (
          <SubjectRow
            key={classArm.armId}
            classArm={classArm}
            subjectId={subject?.subjectId}
          />
        ))}
      </div>
    </div>
  );
};

const SubjectRow = ({
  classArm,
  subjectId,
}: {
  classArm: ClassArmReportDtos;
  subjectId: number;
}) => {
  return (
    <div className="hover:bg-bg-subtle/60 flex items-center justify-between px-4 py-3 transition-colors">
      <div className="flex items-center gap-3">
        {/* <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
					<BookOpen className="h-4 w-4 text-blue-500" />
				</div> */}
        <div>
          <p className="text-text-default text-sm font-medium">
            {classArm.classArmName ?? "-"}
          </p>
        </div>
      </div>
      <Link
        href={`/classes/${classArm?.classId}/subjects/${subjectId}`}
        className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700"
      >
        View Subject
        <ChevronRight className="h-3 w-3" />
      </Link>
    </div>
  );
};
