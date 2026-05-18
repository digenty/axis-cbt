"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TestInstructionsView } from "./TestInstructionsView";
import { useGetAssessmentPreview } from "@/hooks/queryHooks/useStudentCBT";

interface StudentTestPageProps {
  params: Promise<{ testId: string }>;
}

export const StudentTestPage = ({ params }: StudentTestPageProps) => {
  const { testId } = use(params);
  const router = useRouter();

  const { data: preview, isLoading: previewLoading } = useGetAssessmentPreview(
    Number(testId),
  );

  const isInProgress = preview?.data?.attemptStatus === "IN_PROGRESS";

  useEffect(() => {
    if (!previewLoading && isInProgress) {
      router.push(`/student/cbt/${testId}/progress`);
    }
  }, [isInProgress, previewLoading, router, testId]);

  if (previewLoading || isInProgress) return null;

  return (
    <TestInstructionsView
      testId={testId}
      onBegin={() => router.push(`/student/cbt/${testId}/progress`)}
    />
  );
};
