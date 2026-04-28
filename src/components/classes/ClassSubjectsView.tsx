"use client";

import Link from "next/link";
import { use, useMemo } from "react";
import { Bell, Eye } from "lucide-react";
import { useCBTStore } from "@/store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
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

  const handleNotify = (subjectName: string) => {
    toast.success("Teacher notified", {
      description: `A reminder has been sent for ${subjectName}.`,
    });
  };

  return (
    <div className="px-4 py-5 md:px-6 md:py-6">
      <PageHeader title={cls.name} showBack backHref="/classes" />

      <div className="mt-5 overflow-x-auto rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)]">
        <div className="grid min-w-[720px] grid-cols-[2fr_2fr_1fr_1fr_auto] items-center gap-4 border-b border-[var(--color-border-default)] bg-[var(--color-bg-subtle)] px-4 py-3 text-xs font-medium text-[var(--color-text-muted)]">
          <span>Subject</span>
          <span>Teacher</span>
          <span>Questions in Bank</span>
          <span>Tests</span>
          <span className="w-44" />
        </div>
        {classSubjects.length === 0 ? (
          <EmptyState
            title="No subjects yet"
            description="Subjects you add to this class will show up here."
          />
        ) : (
          classSubjects.map((sub) => {
            const teacher = sub.teacherName;
            return (
              <div
                key={sub.id}
                className="grid min-w-[720px] grid-cols-[2fr_2fr_1fr_1fr_auto] items-center gap-4 border-b border-[var(--color-border-default)] px-4 py-3 last:border-b-0"
              >
                <span className="text-sm text-[var(--color-text-default)]">
                  {sub.name}
                </span>
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
                <span className="text-sm text-[var(--color-text-default)]">
                  {sub.questionsInBank}
                </span>
                <span className="text-sm text-[var(--color-text-default)]">
                  {sub.tests}
                </span>
                <div className="flex w-44 items-center justify-end gap-2">
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
                    <Link href={`/classes/${cls.id}/subjects/${sub.id}`}>
                      <Eye className="h-3 w-3" />
                      View
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
