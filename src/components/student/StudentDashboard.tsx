"use client";

import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  FileText,
  Lock,
  Play,
  RotateCcw,
  Eye,
  Award,
  Loader2,
} from "lucide-react";
import { useGetStudentDashboard } from "@/hooks/queryHooks/useStudentCBT";
import { EmptyState } from "@/components/common/EmptyState";
import { formatDate, cn } from "@/lib/utils";
import type { ApiStudentAssessmentItem } from "@/types/student-api";

const ItemMeta = ({ item }: { item: ApiStudentAssessmentItem }) => (
  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[var(--color-text-muted)]">
    <span className="inline-flex items-center gap-1">
      <Clock className="h-3 w-3" />
      {item.durationMinutes} mins
    </span>
    <span className="inline-flex items-center gap-1">
      <FileText className="h-3 w-3" />
      {item.questionCount} Questions
    </span>
    <span className="inline-flex items-center gap-1">
      <Calendar className="h-3 w-3" />
      {formatDate(item.startDateTime)}
    </span>
  </div>
);

const Section = ({
  title,
  dotColor,
  count,
  children,
}: {
  title: string;
  dotColor: string;
  count: number;
  children: React.ReactNode;
}) => (
  <section className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)] p-4">
    <div className="mb-3 flex items-center gap-2">
      <span className={cn("h-2 w-2 rounded-full", dotColor)} />
      <h3 className="text-sm font-semibold text-[var(--color-text-default)]">
        {title}
      </h3>
      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-bg-state-gray)] px-1.5 text-[11px] text-white">
        {count}
      </span>
    </div>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
  </section>
);

export const StudentDashboard = () => {
  const { data, isLoading, isError } = useGetStudentDashboard();

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10 flex justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-[var(--color-icon-default-muted)]" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8">
        <EmptyState
          title="Failed to load dashboard"
          description="Please refresh the page to try again."
        />
      </div>
    );
  }

  const active = data.activeAssessments ?? [];
  const upcoming = data.upcomingAssessments ?? [];
  const completed = data.completedAssessments ?? [];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8">
      <div className="rounded-xl bg-[var(--blue-800)] px-5 py-3 text-white">
        <div className="flex flex-wrap items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-[var(--blue-700)] text-xs text-white">
              {data.studentName?.[0] ?? "S"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-semibold">{data.studentName}</span>
            {data.armDisplay && (
              <>
                <span className="opacity-50">•</span>
                <span>{data.armDisplay}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-5">
        <Section
          title="Active Assessments"
          dotColor="bg-[var(--blue-500)]"
          count={active.length}
        >
          {active.map((item) => (
            <div
              key={item.assessmentId}
              className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-card)] p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[var(--blue-600)]">
                  {item.subjectName}
                </span>
                <span className="rounded-full bg-[var(--color-bg-badge-orange)] px-2 py-0.5 text-[10px] font-medium text-[var(--orange-700)]">
                  {item.attemptStatus === "IN_PROGRESS"
                    ? "In Progress"
                    : "Not Started"}
                </span>
              </div>
              <h4 className="mt-2 text-sm font-semibold text-[var(--color-text-default)]">
                {item.name}
              </h4>
              <ItemMeta item={item} />
              {item.attemptStatus === "IN_PROGRESS" ? (
                <Button
                  asChild
                  variant="outline"
                  className="mt-3 w-full justify-center text-[var(--orange-600)]"
                >
                  <Link href={`/student/cbt/${item.assessmentId}`}>
                    <RotateCcw className="mr-1 h-3.5 w-3.5" />
                    Resume Test
                  </Link>
                </Button>
              ) : (
                <Button asChild className="mt-3 w-full justify-center">
                  <Link href={`/student/cbt/${item.assessmentId}`}>
                    <Play className="mr-1 h-3.5 w-3.5" />
                    Start Test
                  </Link>
                </Button>
              )}
            </div>
          ))}
          {active.length === 0 && (
            <p className="col-span-full text-xs text-[var(--color-text-muted)]">
              No active assessments right now.
            </p>
          )}
        </Section>

        <Section
          title="Upcoming Assessments"
          dotColor="bg-[var(--orange-500)]"
          count={upcoming.length}
        >
          {upcoming.map((item) => (
            <div
              key={item.assessmentId}
              className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-card)] p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[var(--blue-600)]">
                  {item.subjectName}
                </span>
                <span className="rounded-full bg-[var(--color-bg-badge-blue)] px-2 py-0.5 text-[10px] font-medium text-[var(--blue-700)]">
                  Scheduled
                </span>
              </div>
              <h4 className="mt-2 text-sm font-semibold text-[var(--color-text-default)]">
                {item.name}
              </h4>
              <ItemMeta item={item} />
              <Button
                disabled
                variant="outline"
                className="mt-3 w-full justify-center"
              >
                <Lock className="mr-1 h-3.5 w-3.5" />
                Not Open
              </Button>
            </div>
          ))}
          {upcoming.length === 0 && (
            <p className="col-span-full text-xs text-[var(--color-text-muted)]">
              Nothing scheduled yet.
            </p>
          )}
        </Section>

        <Section
          title="Completed Assessments"
          dotColor="bg-[var(--green-500)]"
          count={completed.length}
        >
          {completed.map((item) => {
            const isGraded =
              item.attemptStatus === "COMPLETED" && item.score !== null;
            const isPending = item.attemptStatus === "PENDING";
            const isMissed =
              item.attemptStatus === "ABSENT" ||
              item.attemptStatus === "TIMED_OUT";
            return (
              <div
                key={item.assessmentId}
                className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-card)] p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[var(--blue-600)]">
                    {item.subjectName}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-medium",
                      isGraded
                        ? "bg-[var(--color-bg-badge-green)] text-[var(--green-700)]"
                        : isPending
                          ? "bg-[var(--color-bg-badge-violet)] text-[var(--violet-700)]"
                          : "bg-[var(--color-bg-badge-red)] text-[var(--red-700)]",
                    )}
                  >
                    {isGraded ? "Graded" : isPending ? "Submitted" : "Missed"}
                  </span>
                </div>
                <h4 className="mt-2 text-sm font-semibold text-[var(--color-text-default)]">
                  {item.name}
                </h4>
                <ItemMeta item={item} />
                {isGraded && (
                  <div className="mt-3 rounded-md bg-[var(--color-bg-badge-green)] px-3 py-2 text-xs">
                    <div className="text-[var(--green-700)]">Score</div>
                    <div className="text-base font-semibold text-[var(--green-800)]">
                      {item.score} / {item.totalMarks}
                    </div>
                  </div>
                )}
                {isPending && (
                  <div className="mt-3 rounded-md bg-[var(--color-bg-badge-violet)] px-3 py-2 text-xs">
                    <div className="text-[var(--violet-700)]">
                      Awaiting Results
                    </div>
                    <div className="font-medium text-[var(--violet-800)]">
                      Your teacher is grading this assessment
                    </div>
                  </div>
                )}
                {isMissed && (
                  <div className="mt-3 rounded-md bg-[var(--color-bg-badge-gray)] px-3 py-2 text-xs">
                    <div className="font-medium text-[var(--color-text-subtle)]">
                      Test Closed
                    </div>
                    <div className="text-[var(--color-text-muted)]">
                      This test is no longer available
                    </div>
                  </div>
                )}
                {item.studentAssessmentId !== null && (
                  <Button
                    asChild
                    variant="outline"
                    className="mt-3 w-full justify-center"
                  >
                    <Link
                      href={`/student/cbt/${item.studentAssessmentId}/result`}
                    >
                      {isGraded ? (
                        <>
                          <Award className="mr-1 h-3.5 w-3.5" />
                          View Result
                        </>
                      ) : (
                        <>
                          <Eye className="mr-1 h-3.5 w-3.5" />
                          View Details
                        </>
                      )}
                    </Link>
                  </Button>
                )}
              </div>
            );
          })}
          {completed.length === 0 && (
            <p className="col-span-full text-xs text-[var(--color-text-muted)]">
              You haven&apos;t finished any assessments yet.
            </p>
          )}
        </Section>
      </div>
    </div>
  );
};
