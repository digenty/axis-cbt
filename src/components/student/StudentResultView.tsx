"use client";

import Link from "next/link";
import { use } from "react";
import { ArrowLeft, Award, Loader2 } from "lucide-react";
import { useGetStudentResult } from "@/hooks/queryHooks/useStudentCBT";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/common/StatCard";
import { EmptyState } from "@/components/common/EmptyState";
import { StatusBadge } from "@/components/common/StatusBadge";
import type { AttemptStatus as ApiAttemptStatus } from "@/types/student-api";
import type { AttemptStatus as UiAttemptStatus } from "@/types/results";

interface StudentResultViewProps {
  // The route segment is named [testId] but we now use it as studentAssessmentId.
  params: Promise<{ testId: string }>;
}

const apiStatusToUi = (
  status: ApiAttemptStatus,
  hasScore: boolean,
): UiAttemptStatus => {
  if (status === "IN_PROGRESS") return "in-progress";
  if (status === "PENDING") return "submitted";
  if (status === "ABSENT" || status === "TIMED_OUT") return "missed";
  if (status === "COMPLETED") return hasScore ? "graded" : "submitted";
  return "submitted";
};

export const StudentResultView = ({ params }: StudentResultViewProps) => {
  const { testId } = use(params);
  const studentAssessmentId = Number(testId);

  const { data, isLoading, isError } = useGetStudentResult(studentAssessmentId);

  if (isLoading) {
    return (
      <div className="px-6 py-12 flex justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-[var(--color-icon-default-muted)]" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="px-6 py-12">
        <EmptyState title="Result not available yet" />
      </div>
    );
  }

  const result = data;
  const uiStatus = apiStatusToUi(result.status, result.score !== null);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-8">
      <Button asChild variant="outline" size="sm">
        <Link href="/student/cbt">
          <ArrowLeft className="mr-1 h-3.5 w-3.5" />
          Back to dashboard
        </Link>
      </Button>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="text-lg font-semibold text-[var(--color-text-default)]">
          {result.assessmentName}
        </h1>
        <StatusBadge status={uiStatus} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <StatCard
          icon={<Award className="h-4 w-4 text-[var(--green-500)]" />}
          label="Your Score"
          value={
            result.score !== null ? `${result.score}/${result.totalMarks}` : "—"
          }
        />
        <StatCard
          label="Percentage"
          value={result.percentage !== null ? `${result.percentage}%` : "—"}
        />
        <StatCard
          label="Submitted"
          value={
            result.submissionTime
              ? new Date(result.submissionTime).toLocaleString()
              : "—"
          }
        />
      </div>

      <div className="mt-5 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)] p-4 text-sm text-[var(--color-text-muted)]">
        Detailed answer review is not yet available — please check back once
        your teacher has published the marking.
      </div>
    </div>
  );
};
