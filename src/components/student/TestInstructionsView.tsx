"use client";

import {
  BookOpen,
  Clock,
  FileText,
  GraduationCap,
  Info,
  Loader2,
  Star,
} from "lucide-react";
import { useGetAssessmentPreview } from "@/hooks/queryHooks/useStudentCBT";
import { BackButton } from "@/components/common/BackButton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";

interface TestInstructionsViewProps {
  // The route segment is named [testId] but the value is `assessmentId`.
  testId: string;
  onBegin: () => void;
}

export const TestInstructionsView = ({
  testId,
  onBegin,
}: TestInstructionsViewProps) => {
  const assessmentId = Number(testId);
  const { data, isLoading, isError } = useGetAssessmentPreview(assessmentId);

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
        <EmptyState title="Test not found" />
      </div>
    );
  }

  const preview = data;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-8">
      <BackButton href="/student/cbt" label="Go Back" />

      <div className="mt-3 flex items-center gap-3">
        <h1 className="text-lg font-semibold text-[var(--color-text-default)]">
          {preview.name}
        </h1>
      </div>
      <span className="mt-2 inline-flex items-center gap-1 rounded-md border border-[var(--amber-300)] bg-[var(--color-bg-badge-amber)] px-2 py-0.5 text-[11px] text-[var(--amber-700)]">
        <Star className="h-3 w-3" />
        {preview.totalMarks} marks
      </span>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)] p-4">
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-subtle)]">
            <GraduationCap className="h-3.5 w-3.5" />
            Class
          </div>
          <div className="mt-2 text-sm font-semibold text-[var(--color-text-default)]">
            {preview.className || "-"}
          </div>
        </div>
        <div className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)] p-4">
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-subtle)]">
            <BookOpen className="h-3.5 w-3.5" />
            Subject
          </div>
          <div className="mt-2 text-sm font-semibold text-[var(--color-text-default)]">
            {preview.subjectName || "-"}
          </div>
        </div>
        <div className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)] p-4">
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-subtle)]">
            <Clock className="h-3.5 w-3.5" />
            Duration
          </div>
          <div className="mt-2 text-sm font-semibold text-[var(--color-text-default)]">
            {preview.durationMinutes} minutes
          </div>
        </div>
        <div className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)] p-4">
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-subtle)]">
            <FileText className="h-3.5 w-3.5" />
            Questions
          </div>
          <div className="mt-2 text-sm font-semibold text-[var(--color-text-default)]">
            {preview.questionCount}
          </div>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)]">
        <header className="flex items-center gap-2 border-b border-[var(--color-border-default)] bg-[var(--color-bg-subtle)] px-4 py-2.5">
          <BookOpen className="h-3.5 w-3.5 text-[var(--color-icon-default-subtle)]" />
          <span className="text-sm font-semibold text-[var(--color-text-default)]">
            Instructions
          </span>
        </header>
        <div className="px-4 py-4 text-sm text-[var(--color-text-default)] whitespace-pre-line">
          {preview.instructions ?? (
            <span className="text-[var(--color-text-muted)]">
              No specific instructions were provided for this test.
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-[var(--color-border-warning)] bg-[var(--color-bg-badge-orange)] p-4">
        <div className="flex items-center gap-2">
          <Info className="h-3.5 w-3.5 text-[var(--orange-600)]" />
          <span className="text-sm font-semibold text-[var(--orange-700)]">
            Important Notes
          </span>
        </div>
        <ul className="mt-2 space-y-1 text-xs text-[var(--orange-800)]">
          <li>
            • Once you start the assessment, the timer will begin automatically
          </li>
          <li>• You cannot pause the test once started</li>
          <li>• Make sure you have a stable internet connection</li>
          <li>• All questions must be answered before submission</li>
          <li>
            • You can navigate between questions using Next/Previous buttons
          </li>
          <li>• If you run out of time, tests are automatically submitted</li>
        </ul>
      </div>

      <div className="mt-5 flex justify-end">
        <Button onClick={onBegin}>Begin Assessment</Button>
      </div>
    </div>
  );
};
