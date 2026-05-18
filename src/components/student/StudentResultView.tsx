"use client";

import { use } from "react";
import { Loader2 } from "lucide-react";
import { useGetAssessmentPreview } from "@/hooks/queryHooks/useStudentCBT";
import { AwaitingResultView } from "@/components/student/AwaitingResultView";
import { TestReviewView } from "@/components/student/TestReviewView";

interface StudentResultViewProps {
  params: Promise<{ testId: string }>;
  searchParams: Promise<{ assessmentId?: string }>;
}

export const StudentResultView = ({
  params,
  searchParams,
}: StudentResultViewProps) => {
  const { testId } = use(params);
  const { assessmentId: assessmentIdStr } = use(searchParams);
  const studentAssessmentId = Number(testId);
  const assessmentId = Number(assessmentIdStr ?? 0);

  const { data: preview, isLoading } = useGetAssessmentPreview(assessmentId);

  if (isLoading) {
    return (
      <div className="flex justify-center px-6 py-12">
        <Loader2 className="h-5 w-5 animate-spin text-(--color-icon-default-muted)" />
      </div>
    );
  }

  const showImmediately = preview?.data?.showResultsImmediately ?? false;

  return showImmediately ? (
    <TestReviewView
      studentAssessmentId={studentAssessmentId}
      assessmentId={assessmentId}
    />
  ) : (
    <AwaitingResultView
      studentAssessmentId={studentAssessmentId}
      assessmentId={assessmentId}
    />
  );
};
