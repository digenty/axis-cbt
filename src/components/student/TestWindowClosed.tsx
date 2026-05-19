"use client";

import { EmptyState } from "@/components/common/EmptyState";
import { StudentShell } from "@/components/student/StudentShell";
import { useGetAssessmentPreview } from "@/hooks/queryHooks/useStudentCBT";
import { format } from "date-fns";
import { Calendar, Clock, FileText, Loader2, X } from "lucide-react";

interface AwaitingResultViewProps {
  assessmentId: number;
  description: string;
}

export const TestWindowClosed = ({
  assessmentId,
  description,
}: AwaitingResultViewProps) => {
  const {
    data: preview,
    isLoading,
    isError,
  } = useGetAssessmentPreview(assessmentId);

  if (isLoading) {
    return (
      <div className="flex justify-center px-6 py-12">
        <Loader2 className="h-5 w-5 animate-spin text-(--color-icon-default-muted)" />
      </div>
    );
  }

  if (isError || !preview?.data) {
    return (
      <div className="px-6 py-12">
        <EmptyState title="Assessment details not available" />
      </div>
    );
  }

  const p = preview.data;

  return (
    <StudentShell>
      <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-8 ">
        <div className="flex flex-wrap items-center justify-center gap-3 border border-border-default p-4 rounded-lg">
          <div className="flex flex-col items-center = text-center">
            <span className="text-base font-semibold text-(--color-text-default)">
              {p.name}
            </span>
            {p.subjectName && (
              <span className="text-sm text-text-informative font-medium capitalize ">
                {p.subjectName.toLowerCase()}
              </span>
            )}
          </div>
        </div>

        {/* ─── Awaiting card ─── */}

        <div className="mt-6 border border-icon-destructive rounded-md">
          <div className=" flex min-h-85 flex-col items-center justify-center  bg-bg-badge-red px-6 py-12">
            <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-bg-state-destructive">
              <X className="h-6 w-6 text-white" />
            </div>
            <h2 className="mt-5 text-xl font-semibold text-(--color-text-default)">
              Test Window Closed
            </h2>
            <p className="mt-2 max-w-sm text-center text-sm text-(--color-text-muted)">
              {description}
            </p>
          </div>

          {/* ─── Stats row ─── */}
          <div className="mt-5 space-y-3 text-sm text-(--color-text-default) px-6 pb-6">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0" />
              <span>
                {p.durationMinutes != null ? `${p.durationMinutes} mins` : "—"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 shrink-0" />
              <span>
                {p.questionCount != null ? `${p.questionCount} Questions` : "—"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 shrink-0" />
              <span>{format(p.startDateTime, "PPpp ")}</span>
            </div>
          </div>
        </div>
      </div>
    </StudentShell>
  );
};
