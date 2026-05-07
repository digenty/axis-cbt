"use client";

import { use, useState } from "react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BackButton } from "@/components/common/BackButton";
import { EmptyState } from "@/components/common/EmptyState";
import {
  useGetStudentAttemptAnswers,
  useGradeManually,
} from "@/hooks/queryHooks/useAssessment";
import { useGetStudentResult } from "@/hooks/queryHooks/useStudentCBT";
import { cn } from "@/lib/utils";
import type { GradingStatus, StudentAttemptAnswer } from "@/types/question";
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

const gradingBadge = (s: GradingStatus): { label: string; cls: string } => {
  switch (s) {
    case "AUTO_GRADED":
      return {
        label: "Auto-graded",
        cls: "bg-[var(--color-bg-badge-blue)] text-[var(--blue-700)]",
      };
    case "MANUALLY_GRADED":
      return {
        label: "Manually graded",
        cls: "bg-[var(--color-bg-badge-green)] text-[var(--green-700)]",
      };
    case "REVIEW_REQUIRED":
      return {
        label: "Needs review",
        cls: "bg-[var(--color-bg-badge-orange)] text-[var(--orange-700)]",
      };
    default:
      return {
        label: "Pending",
        cls: "bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)]",
      };
  }
};

const renderStudentAnswer = (a: StudentAttemptAnswer) => {
  if (a.answerText && a.answerText.trim().length > 0) {
    return (
      <div className="whitespace-pre-wrap text-sm text-[var(--color-text-default)]">
        {a.answerText}
      </div>
    );
  }
  if (a.selectedOptionId !== null && a.selectedOptionId !== undefined) {
    return (
      <div className="text-sm text-[var(--color-text-default)]">
        Selected option ID: {a.selectedOptionId}
      </div>
    );
  }
  if (a.answerData && a.answerData.length > 0) {
    return (
      <pre className="overflow-x-auto rounded bg-[var(--color-bg-subtle)] p-2 text-xs text-[var(--color-text-default)]">
        {a.answerData}
      </pre>
    );
  }
  return (
    <div className="text-sm italic text-[var(--color-text-muted)]">
      No response
    </div>
  );
};

interface AnswerCardProps {
  index: number;
  answer: StudentAttemptAnswer;
  assessmentId: number;
  studentAssessmentId: number;
}

const AnswerCard = ({
  index,
  answer,
  assessmentId,
  studentAssessmentId,
}: AnswerCardProps) => {
  const [marks, setMarks] = useState<string>(
    answer.marksAwarded !== null && answer.marksAwarded !== undefined
      ? String(answer.marksAwarded)
      : "",
  );
  const [feedback, setFeedback] = useState<string>(answer.feedback ?? "");

  const grade = useGradeManually(assessmentId, studentAssessmentId);

  const needsManual =
    answer.gradingStatus === "REVIEW_REQUIRED" ||
    answer.gradingStatus === "PENDING" ||
    !answer.autoGraded;

  const badge = gradingBadge(answer.gradingStatus);

  const onSave = () => {
    const parsed = Number(marks);
    if (!Number.isFinite(parsed) || parsed < 0 || parsed > answer.maxMarks) {
      toast.error(`Marks must be between 0 and ${answer.maxMarks}`);
      return;
    }
    grade.mutate(
      {
        answerId: answer.answerId,
        marksAwarded: parsed,
        feedback: feedback.trim(),
      },
      {
        onSuccess: () => toast.success("Marks saved"),
        onError: (err) => {
          const msg =
            (err as { message?: string } | undefined)?.message ??
            "Failed to save marks";
          toast.error(msg);
        },
      },
    );
  };

  return (
    <div className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[var(--color-text-muted)]">
              Q{index + 1}
            </span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-medium",
                badge.cls,
              )}
            >
              {badge.label}
            </span>
            {answer.isCorrect === true && (
              <span className="inline-flex items-center gap-1 text-xs text-[var(--green-700)]">
                <CheckCircle2 className="h-3.5 w-3.5" /> Correct
              </span>
            )}
            {answer.isCorrect === false && (
              <span className="inline-flex items-center gap-1 text-xs text-[var(--red-700)]">
                <XCircle className="h-3.5 w-3.5" /> Incorrect
              </span>
            )}
          </div>
          <div
            className="mt-1 text-sm font-medium text-[var(--color-text-default)]"
            dangerouslySetInnerHTML={{
              __html: answer.questionHtml ?? answer.questionText,
            }}
          />
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

      <div className="mt-3 rounded-lg bg-[var(--color-bg-subtle)] p-3">
        <div className="mb-1 text-xs font-medium text-[var(--color-text-muted)]">
          Student response
        </div>
        {renderStudentAnswer(answer)}
      </div>

      {needsManual && (
        <div className="mt-3 grid gap-3 sm:grid-cols-[120px_1fr_auto] sm:items-end">
          <div className="space-y-1">
            <Label className="text-xs">Marks</Label>
            <Input
              type="number"
              min={0}
              max={answer.maxMarks}
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Feedback</Label>
            <textarea
              rows={2}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Optional comments for the student"
              className="border-border-default bg-bg-input-soft text-text-default placeholder:text-text-muted focus-visible:border-border-focus focus-visible:ring-border-focus/30 w-full rounded-md border px-3 py-2 text-sm shadow-none focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>
          <Button onClick={onSave} disabled={grade.isPending} size="sm">
            {grade.isPending && (
              <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
            )}
            Save
          </Button>
        </div>
      )}
    </div>
  );
};

export const GradeAttemptView = ({ params }: GradeAttemptViewProps) => {
  const { classId, subjectId, attemptId } = use(params);
  const studentAssessmentId = Number(attemptId);
  const baseUrl = `/classes/${classId}/subjects/${subjectId}`;

  const {
    data: result,
    isLoading: resultLoading,
    isError: resultError,
  } = useGetStudentResult(studentAssessmentId);

  const {
    data: answersRes,
    isLoading: answersLoading,
    isError: answersError,
  } = useGetStudentAttemptAnswers(studentAssessmentId);

  if (resultLoading || answersLoading) {
    return (
      <div className="flex justify-center px-6 py-12">
        <Loader2 className="h-5 w-5 animate-spin text-[var(--color-icon-default-muted)]" />
      </div>
    );
  }

  if (resultError || !result) {
    return (
      <div className="px-6 py-6">
        <BackButton href={`${baseUrl}/results`} label="Go Back" />
        <div className="mt-4">
          <EmptyState title="Attempt not found" />
        </div>
      </div>
    );
  }

  const answers = answersRes?.data ?? [];
  const assessmentIdNum = result.assessmentId;

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

      <h2 className="mt-6 text-sm font-semibold text-[var(--color-text-default)]">
        Answers
      </h2>

      {answersError ? (
        <div className="mt-3">
          <EmptyState title="Could not load answers" />
        </div>
      ) : answers.length === 0 ? (
        <div className="mt-3 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)] p-4 text-sm text-[var(--color-text-muted)]">
          This attempt has no recorded answers.
        </div>
      ) : (
        <div className="mt-3 space-y-3">
          {answers.map((a, i) => (
            <AnswerCard
              key={a.answerId}
              index={i}
              answer={a}
              assessmentId={assessmentIdNum}
              studentAssessmentId={studentAssessmentId}
            />
          ))}
        </div>
      )}
    </div>
  );
};
