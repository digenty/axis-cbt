"use client";

import Link from "next/link";
import { ArrowLeft, Calendar, Clock, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { useGetAssessmentPreview } from "@/hooks/queryHooks/useStudentCBT";
import type { AttemptStatus as ApiAttemptStatus } from "@/types/student-api";
import type { AttemptStatus as UiAttemptStatus } from "@/types/results";
import { format } from "date-fns";
import { TimeFill } from "@digenty/icons";

interface AwaitingResultViewProps {
  studentAssessmentId: number;
  assessmentId: number;
}

const apiStatusToUi = (
  status: ApiAttemptStatus | null | undefined,
): UiAttemptStatus => {
  if (status === "IN_PROGRESS") return "in-progress";
  if (status === "PENDING") return "submitted";
  if (status === "ABSENT" || status === "TIMED_OUT") return "missed";
  if (status === "COMPLETED") return "graded";
  return "submitted";
};

export const AwaitingResultView = ({
  assessmentId,
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
  const uiStatus = apiStatusToUi(p.attemptStatus);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-8 ">
      {/* ─── Top nav row ─── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border border-border-default p-4 rounded-lg">
        {/* <Button asChild variant="outline" size="sm">
          <Link href="/student/cbt">
            <ArrowLeft className="mr-1 h-3.5 w-3.5" />
            Back to Dashboard
          </Link>
        </Button> */}

        <div className="flex flex-col items-center text-center">
          <span className="text-base font-semibold text-(--color-text-default)">
            {p.name}
          </span>
          {p.subjectName && (
            <span className="text-sm text-text-informative font-medium capitalize ">
              {p.subjectName.toLowerCase()}
            </span>
          )}
        </div>

        <StatusBadge status={uiStatus} />
      </div>

      {/* ─── Awaiting card ─── */}

      <div className="mt-6 border border-bg-basic-purple-accent rounded-md">
        <div className=" flex min-h-85 flex-col items-center justify-center  bg-bg-badge-purple px-6 py-12">
          <TimeFill
            fill="var(--color-bg-basic-purple-accent)"
            className="size-10 text-white"
          />
          <h2 className="mt-5 text-xl font-semibold text-(--color-text-default)">
            Awaiting Result
          </h2>
          <p className="mt-2 max-w-sm text-center text-sm text-(--color-text-muted)">
            Your answers have been submitted successfully. Your teacher is
            reviewing your answer for submitted tests
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
  );
};
