"use client";

import { use } from "react";
import { Info, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BackButton } from "@/components/common/BackButton";
import { EmptyState } from "@/components/common/EmptyState";
import { useGetStudentResult } from "@/hooks/queryHooks/useStudentCBT";
import type { AttemptStatus as ApiAttemptStatus } from "@/types/student-api";

interface GradeAttemptViewProps {
  params: Promise<{
    classId: string;
    subjectId: string;
    // The route segment is named [attemptId] but the value is `studentAssessmentId`.
    attemptId: string;
  }>;
}

const statusLabel = (s: ApiAttemptStatus): string => {
  switch (s) {
    case "IN_PROGRESS":
      return "In progress";
    case "PENDING":
      return "Pending grading";
    case "COMPLETED":
      return "Completed";
    case "ABSENT":
      return "Absent";
    case "TIMED_OUT":
      return "Timed out";
    default:
      return "Not started";
  }
};

export const GradeAttemptView = ({ params }: GradeAttemptViewProps) => {
  const { classId, subjectId, attemptId } = use(params);
  const studentAssessmentId = Number(attemptId);
  const baseUrl = `/classes/${classId}/subjects/${subjectId}`;

  const {
    data: result,
    isLoading,
    isError,
  } = useGetStudentResult(studentAssessmentId);

  if (isLoading) {
    return (
      <div className="flex justify-center px-6 py-12">
        <Loader2 className="h-5 w-5 animate-spin text-[var(--color-icon-default-muted)]" />
      </div>
    );
  }

  if (isError || !result) {
    return (
      <div className="px-6 py-6">
        <BackButton href={`${baseUrl}/results`} label="Go Back" />
        <div className="mt-4">
          <EmptyState title="Attempt not found" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-5 md:px-6 md:py-6">
      <BackButton href={`${baseUrl}/results`} label="Go Back" />

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-[var(--color-bg-muted)] text-xs">
            S
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold text-[var(--color-text-default)]">
            {result.assessmentName}
          </h1>
          <p className="text-xs text-[var(--color-text-muted)]">
            {statusLabel(result.status)} •{" "}
            {result.score !== null
              ? `${result.score} / ${result.totalMarks}`
              : "Not scored"}
            {result.percentage !== null ? ` (${result.percentage}%)` : ""}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)] p-4">
          <div className="text-xs text-[var(--color-text-muted)]">Score</div>
          <div className="mt-1 text-lg font-semibold text-[var(--color-text-default)]">
            {result.score !== null
              ? `${result.score} / ${result.totalMarks}`
              : "—"}
          </div>
        </div>
        <div className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)] p-4">
          <div className="text-xs text-[var(--color-text-muted)]">
            Percentage
          </div>
          <div className="mt-1 text-lg font-semibold text-[var(--color-text-default)]">
            {result.percentage !== null ? `${result.percentage}%` : "—"}
          </div>
        </div>
        <div className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)] p-4">
          <div className="text-xs text-[var(--color-text-muted)]">
            Submitted
          </div>
          <div className="mt-1 text-sm font-semibold text-[var(--color-text-default)]">
            {result.submissionTime
              ? new Date(result.submissionTime).toLocaleString()
              : "—"}
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-[var(--color-border-warning)] bg-[var(--color-bg-badge-orange)] p-4">
        <div className="flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[var(--orange-600)]" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-[var(--orange-700)]">
              Manual grading not available yet
            </p>
            <p className="text-xs text-[var(--orange-800)]">
              The backend does not currently expose an endpoint that returns a
              student&apos;s individual answers, which is required to manually
              grade essays and short-answer questions. Once the
              <code className="mx-1 rounded bg-white/40 px-1">
                /api/cbt/assessments/grade-manually
              </code>
              flow has a matching answer-listing endpoint, this view will be
              wired up to assign per-question marks and submit them.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
