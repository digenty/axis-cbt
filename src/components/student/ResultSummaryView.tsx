"use client";

import { Award } from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import type { ApiStudentResult } from "@/types/student-api";

interface ResultSummaryViewProps {
  result: ApiStudentResult;
}

// Shown once an attempt is graded (score !== null) but the assessment doesn't allow a full
// per-question review (status !== COMPLETED && (allowReview || showResultsImmediately)) -
// see StudentResultView for that gate. Score is always shown once graded, independent of it.
export const ResultSummaryView = ({ result }: ResultSummaryViewProps) => {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border border-border-default p-4 rounded-lg">
        <span className="text-base font-semibold text-(--color-text-default)">
          {result.assessmentName}
        </span>
        <StatusBadge status="graded" />
      </div>

      <div className="mt-6 overflow-hidden rounded-md border border-bg-basic-green-accent">
        <div className="flex min-h-70 flex-col items-center justify-center gap-3 bg-bg-badge-green px-8 py-10">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/60">
            <Award className="h-10 w-10 text-[var(--green-600)]" />
          </div>
          <div className="text-center">
            <span className="text-5xl font-bold text-(--color-text-default)">
              {result.score}
            </span>
            <span className="text-2xl text-(--color-text-muted)">
              /{result.totalMarks}
            </span>
          </div>
          {result.percentage !== null && (
            <p className="text-sm text-(--color-text-muted)">
              {result.percentage}%
              {result.passed !== null ? (result.passed ? " · Passed" : " · Not passed") : ""}
            </p>
          )}
        </div>

        <div className="space-y-2 px-6 py-5 text-sm text-(--color-text-default)">
          <p>
            Submitted{" "}
            {result.submissionTime
              ? new Date(result.submissionTime).toLocaleString()
              : "—"}
          </p>
        </div>
      </div>
    </div>
  );
};
