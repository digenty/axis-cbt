"use client";

import Link from "next/link";
import { use, useCallback, useMemo } from "react";
import { Bell, Eye } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { useCBTStore } from "@/store";
import { Subject } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { DataTable } from "@/components/DataTable";
import { toast } from "sonner";

interface ClassSubjectsViewProps {
  params: Promise<{ classId: string }>;
}

export const ClassSubjectsView = ({ params }: ClassSubjectsViewProps) => {
  const { classId } = use(params);
  const { classes, subjects } = useCBTStore();

  const cls = useMemo(
    () => classes.find((c) => c.id === classId),
    [classes, classId],
  );
  const classSubjects = useMemo(
    () => subjects.filter((s) => s.classId === classId),
    [subjects, classId],
  );

  const handleNotify = useCallback((subjectName: string) => {
    toast.success("Teacher notified", {
      description: `A reminder has been sent for ${subjectName}.`,
    });
  }, []);

  const columns = useMemo<ColumnDef<Subject>[]>(
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
        cell: ({ row }) => row.original.tests,
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
                <Link href={`/classes/${classId}/subjects/${sub.id}`}>
                  <Eye className="h-3 w-3" />
                  View
                </Link>
              </Button>
            </div>
          );
        },
      },
    ],
    [classId, handleNotify],
  );

  if (!cls) {
    return (
      <div className="px-6 py-6">
        <PageHeader title="Class not found" showBack backHref="/classes" />
        <EmptyState
          title="We couldn't find this class"
          description="The class may have been deleted or the link is wrong."
        />
      </div>
    );
  }

  return (
    <div className="px-4 py-5 md:px-6 md:py-6">
      <PageHeader title={cls.name} showBack backHref="/classes" />

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
            // border
            headerBg
          />
        )}
      </div>
    </div>
  );
};
