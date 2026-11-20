"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, HelpCircle } from "lucide-react";
import type { TeacherCbtSubjectSummary } from "@/types/question";

interface MySubjectsListProps {
  subjects: TeacherCbtSubjectSummary[];
}

export const MySubjectsList = ({ subjects }: MySubjectsListProps) => {
  const router = useRouter();

  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {subjects.map((subject) => (
        <div
          key={`${subject.classId}-${subject.subjectId}`}
          className="bg-bg-subtle border-border-default flex flex-col gap-4 rounded-md border p-4 md:p-6"
        >
          <div>
            <p className="text-text-default text-sm font-semibold">
              {subject.subjectName}
            </p>
            <p className="text-text-muted pt-1 text-xs font-normal">
              {subject.className} · {subject.branchName}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="border-border-default bg-bg-badge-default text-text-muted flex items-center gap-1 rounded-md text-xs font-normal">
              <ClipboardList className="size-3" />
              {subject.assessmentCount} Assessment
              {subject.assessmentCount !== 1 ? "s" : ""}
            </Badge>
            <Badge className="border-border-default bg-bg-badge-default text-text-muted flex items-center gap-1 rounded-md text-xs font-normal">
              <HelpCircle className="size-3" />
              {subject.questionCount} Question
              {subject.questionCount !== 1 ? "s" : ""}
            </Badge>
          </div>

          <Button
            size="sm"
            onClick={() => {
              const qs = new URLSearchParams({
                className: subject.className,
                subjectName: subject.subjectName,
              }).toString();
              router.push(
                `/classes/${subject.classId}/subjects/${subject.subjectId}?${qs}`,
              );
            }}
            className="h-7 bg-bg-state-primary! cursor-pointer self-start"
          >
            View Subject
          </Button>
        </div>
      ))}
    </div>
  );
};
