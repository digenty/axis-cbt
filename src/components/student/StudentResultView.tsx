"use client";

import { use } from "react";
import { Loader2 } from "lucide-react";
import {
  useGetAssessmentPreview,
  useGetStudentResult,
} from "@/hooks/queryHooks/useStudentCBT";
import { AwaitingResultView } from "@/components/student/AwaitingResultView";
import { ResultSummaryView } from "@/components/student/ResultSummaryView";
import { TestReviewView } from "@/components/student/TestReviewView";
import { EmptyState } from "@/components/common/EmptyState";

interface StudentResultViewProps {
  params: Promise<{ testId: string }>;
  searchParams: Promise<{ assessmentId?: string }>;
}

// Which screen the student sees is decided by the attempt's own result, never by the
// assessment's showResultsImmediately setting alone - that setting only affects whether the
// full per-question review is also allowed, not whether a graded score is shown at all.
export const StudentResultView = ({
  params,
  searchParams,
}: StudentResultViewProps) => {
  const { testId } = use(params);
  const { assessmentId: assessmentIdStr } = use(searchParams);
  const studentAssessmentId = Number(testId);
  const assessmentId = Number(assessmentIdStr ?? 0);

  const { data: preview, isLoading: previewLoading } =
    useGetAssessmentPreview(assessmentId);
  const {
    data: result,
    isLoading: resultLoading,
    isError: resultError,
  } = useGetStudentResult(studentAssessmentId);

  if (previewLoading || resultLoading) {
    return (
      <div className="flex justify-center px-6 py-12">
        <Loader2 className="h-5 w-5 animate-spin text-(--color-icon-default-muted)" />
      </div>
    );
  }

  if (resultError || !result) {
    return (
      <div className="px-6 py-12">
        <EmptyState title="Result not available" />
      </div>
    );
  }

  const p = preview?.data;
  const reviewEligible =
    result.status === "COMPLETED" && Boolean(p?.allowReview || p?.showResultsImmediately);

  if (reviewEligible) {
    return (
      <TestReviewView
        studentAssessmentId={studentAssessmentId}
        assessmentId={assessmentId}
      />
    );
  }

  if (result.score !== null) {
    return <ResultSummaryView result={result} />;
  }

  return (
    <AwaitingResultView
      studentAssessmentId={studentAssessmentId}
      assessmentId={assessmentId}
      awaitingManualGrading={result.awaitingManualGrading}
      ungradedQuestionCount={result.ungradedQuestionCount}
    />
  );
};
