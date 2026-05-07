"use client";

import Link from "next/link";
import { use } from "react";
import { ArrowLeft, Award, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useGetStudentResult } from "@/hooks/queryHooks/useStudentCBT";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/common/StatCard";
import { EmptyState } from "@/components/common/EmptyState";
import { StatusBadge } from "@/components/common/StatusBadge";
import type {
  AttemptStatus as ApiAttemptStatus,
  StudentAnswerSummary,
} from "@/types/student-api";
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

      <h2 className="mt-6 text-sm font-semibold text-[var(--color-text-default)]">
        Answer review
      </h2>

      {result.answers && result.answers.length > 0 ? (
        <div className="mt-3 space-y-3">
          {result.answers.map((a, i) => (
            <AnswerRow key={a.assessmentQuestionId} index={i} answer={a} />
          ))}
        </div>
      ) : (
        <div className="mt-3 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)] p-4 text-sm text-[var(--color-text-muted)]">
          Detailed answer review is not yet available — please check back once
          your teacher has published the marking.
        </div>
      )}
    </div>
  );
};

const AnswerRow = ({
  index,
  answer,
}: {
  index: number;
  answer: StudentAnswerSummary;
}) => {
  const correctness =
    answer.isCorrect === true ? (
      <span className="inline-flex items-center gap-1 text-xs text-[var(--green-700)]">
        <CheckCircle2 className="h-3.5 w-3.5" /> Correct
      </span>
    ) : answer.isCorrect === false ? (
      <span className="inline-flex items-center gap-1 text-xs text-[var(--red-700)]">
        <XCircle className="h-3.5 w-3.5" /> Incorrect
      </span>
    ) : null;

  return (
    <div className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[var(--color-text-muted)]">
              Q{index + 1}
            </span>
            {correctness}
          </div>
          <div className="mt-1 text-sm font-medium text-[var(--color-text-default)]">
            {answer.questionText}
          </div>
        </div>
        <div className="text-right text-xs text-[var(--color-text-muted)]">
          <div>Max: {answer.maxMarks}</div>
          <div>
            Awarded:{" "}
            {answer.marksAwarded !== null && answer.marksAwarded !== undefined
              ? answer.marksAwarded
              : "—"}
          </div>
        </div>
      </div>

      {answer.answerData && (
        <div className="mt-3 rounded-lg bg-[var(--color-bg-subtle)] p-3">
          <div className="mb-1 text-xs font-medium text-[var(--color-text-muted)]">
            Your response
          </div>
          <pre className="overflow-x-auto text-xs text-[var(--color-text-default)] whitespace-pre-wrap">
            {answer.answerData}
          </pre>
        </div>
      )}

      {answer.feedback && (
        <div className="mt-3 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-default)] p-3">
          <div className="mb-1 text-xs font-medium text-[var(--color-text-muted)]">
            Teacher feedback
          </div>
          <div className="text-sm text-[var(--color-text-default)]">
            {answer.feedback}
          </div>
        </div>
      )}
    </div>
  );
};
