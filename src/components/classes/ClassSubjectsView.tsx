"use client";

import Link from "next/link";
import { use, useCallback, useMemo } from "react";
import { Bell, Eye, Loader2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { DataTable } from "@/components/DataTable";
import {
  useGetClassDetails,
  useGetSubjectsByClassId,
} from "@/hooks/queryHooks/useSubjects";
import { toast } from "sonner";
import type { ApiClassSubject } from "@/types/subjects";

interface ClassSubjectsViewProps {
  params: Promise<{ classId: string }>;
}

export const ClassSubjectsView = ({ params }: ClassSubjectsViewProps) => {
  const { classId: classIdStr } = use(params);
  const classId = Number(classIdStr);

  const { data: classDetailsRes, isLoading: classLoading } =
    useGetClassDetails(classId);
  const {
    data: subjectsRes,
    isLoading: subjectsLoading,
    isError: subjectsError,
  } = useGetSubjectsByClassId(classId);

  const className = useMemo(() => {
    const raw = classDetailsRes as
      | { data?: { name?: string } }
      | { name?: string }
      | undefined;
    if (!raw) return "";
    if ("data" in raw && raw.data?.name) return raw.data.name;
    if ("name" in raw && typeof raw.name === "string") return raw.name;
    return "";
  }, [classDetailsRes]);

  const classSubjects = useMemo<ApiClassSubject[]>(
    () => subjectsRes?.data ?? [],
    [subjectsRes],
  );

  const handleNotify = useCallback((subjectName: string) => {
    toast.success("Teacher notified", {
      description: `A reminder has been sent for ${subjectName}.`,
    });
  }, []);

  const columns = useMemo<ColumnDef<ApiClassSubject>[]>(
    () => [
      {
        id: "subject",
        header: "Subject",
        cell: ({ row }) => (
          <span className="text-[var(--color-text-default)]">
            {row.original.name}
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
                <span className="text-[var(--color-text-muted)]">
                  Unassigned
                </span>
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
        cell: ({ row }) => row.original.assessmentCount,
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
                onClick={() => handleNotify(sub.name)}
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
                <Link href={`/classes/${classIdStr}/subjects/${sub.id}`}>
                  <Eye className="h-3 w-3" />
                  View
                </Link>
              </Button>
            </div>
          );
        },
      },
    ],
    [classIdStr, handleNotify],
  );

  if (classLoading || subjectsLoading) {
    return (
      <div className="px-6 py-10 flex justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-[var(--color-icon-default-muted)]" />
      </div>
    );
  }

  if (subjectsError) {
    return (
      <div className="px-6 py-6">
        <PageHeader title="Class" showBack backHref="/classes" />
        <EmptyState
          title="Failed to load subjects"
          description="Please refresh the page to try again."
        />
      </div>
    );
  }

  return (
    <div className="px-4 py-5 md:px-6 md:py-6">
      <PageHeader title={className || "Class"} showBack backHref="/classes" />

      <div className="mt-5">
        {classSubjects.length === 0 ? (
          <EmptyState
            title="No subjects yet"
            description="Subjects you add to this class will show up here."
          />
        ) : (
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
        )}
      </div>
    </div>
  );
};
