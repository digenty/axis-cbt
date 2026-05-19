"use client";

import Link from "next/link";
import { type ReactNode, use, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Bell, Eye, Loader2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { ErrorComponent } from "@/components/common/ErrorComponent";
import { DataTable } from "@/components/DataTable";
import {
  useGetSubjectsByArmId,
  useNotifyTeacher,
} from "@/hooks/queryHooks/useSubjects";
import { toast } from "@/components/common/Toast";
import type { ApiClassArmSubject } from "@/types/subjects";

// ─── Mobile card ────────────────────────────────────────────────────────────

interface SubjectCardProps {
  sub: ApiClassArmSubject;
  armIdStr: string;
  classId: number;
  className: string;
  isNotifying: boolean;
  onNotify: (subjectId: number, subjectName: string) => void;
}

function SubjectCard({
  sub,
  armIdStr,
  className,
  isNotifying,
  onNotify,
  classId,
}: SubjectCardProps) {
  console.log(className);
  const rows: { label: string; value: ReactNode }[] = [
    {
      label: "Subject",
      value: (
        <span className="text-sm font-medium text-[var(--color-text-default)] capitalize">
          {sub.subjectName.toLowerCase()}
        </span>
      ),
    },
    {
      label: "Teacher",
      value: (
        <span className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="bg-[var(--color-bg-muted)] text-[10px] text-[var(--color-text-subtle)]">
              {(sub.teacherName ?? "U")[0]}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-[var(--color-text-default)]">
            {sub.teacherName ?? (
              <span className="font-normal text-[var(--color-text-muted)]">
                Unassigned
              </span>
            )}
          </span>
        </span>
      ),
    },
    { label: "Question in Bank", value: sub.questionsInBank },
    { label: "Tests", value: sub.testsCount },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-state-secondary)]">
      {rows.map(({ label, value }) => (
        <div
          key={label}
          className="flex items-center justify-between border-b border-[var(--color-border-default)] px-4 py-3 last:border-b-0"
        >
          <span className="text-sm text-[var(--color-text-muted)] font-medium">
            {label}
          </span>
          <span className="text-sm font-medium text-[var(--color-text-default)]">
            {value}
          </span>
        </div>
      ))}
      <div className="flex gap-2 px-4 py-3">
        <Button
          variant="outline"
          size="sm"
          className="h-9 flex-1 gap-1.5 text-sm"
          disabled={isNotifying}
          onClick={() => onNotify(sub.subjectId, sub.subjectName)}
        >
          <Bell className="h-3.5 w-3.5" />
          Notify Teacher
        </Button>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="h-9 flex-1 gap-1.5 text-sm"
        >
          <Link
            href={{
              pathname: `/classes/${classId}/subjects/${sub.subjectId}`,
              query: { className, subjectName: sub.subjectName },
            }}
          >
            <Eye className="h-3.5 w-3.5" />
            View
          </Link>
        </Button>
      </div>
    </div>
  );
}

interface ClassSubjectsViewProps {
  params: Promise<{ classId: string }>;
}

export const ClassSubjectsView = ({ params }: ClassSubjectsViewProps) => {
  const { classId: armIdStr } = use(params);
  const armId = Number(armIdStr);
  const searchParams = useSearchParams();
  const className = searchParams.get("className") ?? "";

  const {
    data: subjectsRes,
    isLoading: subjectsLoading,
    isError: subjectsError,
  } = useGetSubjectsByArmId(armId);

  const classSubjects = useMemo<ApiClassArmSubject[]>(
    () => subjectsRes?.data?.subjects ?? [],
    [subjectsRes],
  );

  const classId = subjectsRes?.data?.classId ?? 0;

  const { mutate: notifyTeacher, isPending: isNotifying } =
    useNotifyTeacher(armId);

  const handleNotify = useCallback(
    (subjectId: number, subjectName: string) => {
      notifyTeacher(subjectId, {
        onSuccess: () =>
          toast({
            title: "Teacher notified",
            description: `A reminder has been sent for ${subjectName}.`,
            type: "success",
          }),
        onError: () =>
          toast({
            title: "Failed to notify teacher",
            description: "Please try again.",
            type: "error",
          }),
      });
    },
    [notifyTeacher],
  );

  const columns: ColumnDef<ApiClassArmSubject>[] = [
    {
      id: "subject",
      header: "Subject",
      cell: ({ row }) => (
        <span className="text-[var(--color-text-default)] capitalize">
          {row.original.subjectName.toLowerCase()}
        </span>
      ),
    },
    {
      id: "teacher",
      header: "Teacher",
      cell: ({ row }) => {
        const teacher = row.original.teacherName;
        return (
          <span className="flex items-center gap-2 text-sm">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="bg-[var(--color-bg-muted)] text-[10px] text-[var(--color-text-subtle)]">
                {(teacher ?? "U")[0]}
              </AvatarFallback>
            </Avatar>
            {teacher ? (
              <span className="text-[var(--color-text-default)]">
                {teacher}
              </span>
            ) : (
              <span className="text-[var(--color-text-muted)]">Unassigned</span>
            )}
          </span>
        );
      },
    },
    {
      id: "questionsInBank",
      header: "Questions in Bank",
      cell: ({ row }) => row.original.questionsInBank,
    },
    {
      id: "tests",
      header: "Tests",
      cell: ({ row }) => row.original.testsCount,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const sub = row.original;
        return (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1 text-xs"
              disabled={isNotifying}
              onClick={() => handleNotify(sub.subjectId, sub.subjectName)}
            >
              <Bell className="h-3 w-3" />
              Notify Teacher
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-7 gap-1 text-xs"
            >
              <Link
                href={{
                  pathname: `/classes/${classId}/subjects/${sub.subjectId}`,
                  query: { className, subjectName: sub.subjectName },
                }}
              >
                <Eye className="h-3 w-3" />
                View
              </Link>
            </Button>
          </div>
        );
      },
    },
  ];

  if (subjectsLoading) {
    return (
      <div className="px-6 py-10 flex justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-[var(--color-icon-default-muted)]" />
      </div>
    );
  }

  if (subjectsError) {
    return (
      <div className="px-6 py-6">
        <PageHeader title={className || "Class"} showBack />
        <div className="mt-20 flex justify-center">
          <ErrorComponent
            title="Failed to load subjects"
            description="Please refresh the page to try again."
            buttonText="Go back"
            url="/classes"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-5 md:px-6 md:py-6">
      <PageHeader title={className || "Class"} showBack />

      <div className="mt-5">
        {classSubjects.length === 0 ? (
          <div className="mt-20 flex justify-center">
            <ErrorComponent
              title="No subjects yet"
              description="Subjects you add to this class will show up here."
              buttonText="Add subjects"
              onClick={() => {
                window.location.href = `${process.env.NEXT_PUBLIC_MAIN_APP_URL}/staff/settings/academic`;
              }}
            />
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3 md:hidden">
              {classSubjects.map((sub) => (
                <SubjectCard
                  key={sub.subjectId}
                  sub={sub}
                  armIdStr={armIdStr}
                  className={className}
                  isNotifying={isNotifying}
                  onNotify={handleNotify}
                  classId={classId}
                />
              ))}
            </div>
            <div className="hidden md:block">
              <DataTable
                columns={columns}
                data={classSubjects}
                totalCount={classSubjects.length}
                page={1}
                setCurrentPage={() => {}}
                pageSize={classSubjects.length}
                showPagination={false}
                headerBg
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
