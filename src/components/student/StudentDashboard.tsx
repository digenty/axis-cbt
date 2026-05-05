"use client";

import Link from "next/link";
import { useMemo } from "react";
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
} from "lucide-react";
import { useCBTStore } from "@/store";
import { formatDate, cn } from "@/lib/utils";
import type { Test, StudentAttempt } from "@/types";

const STUDENT_INFO = {
  name: "Damilare John",
  studentId: "GFA/2023/01045",
  classLabel: "JSS 1 A",
  year: "2024/2025",
  term: "Second Term",
};

interface AssessmentRow {
  test: Test;
  attempt?: StudentAttempt;
}

const TestMeta = ({ test }: { test: Test }) => (
  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[var(--color-text-muted)]">
    <span className="inline-flex items-center gap-1">
      <Clock className="h-3 w-3" />
      {test.duration} mins
    </span>
    <span className="inline-flex items-center gap-1">
      <FileText className="h-3 w-3" />
      {test.sections.reduce((n, s) => n + s.questionIds.length, 0)} Questions
    </span>
    <span className="inline-flex items-center gap-1">
      <Calendar className="h-3 w-3" />
      {formatDate(test.testDate)}
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
  const { tests, attempts, subjects } = useCBTStore();

  const myAttempts = useMemo(
    () => attempts.filter((a) => a.studentName === STUDENT_INFO.name),
    [attempts],
  );

  const visibleTests = useMemo<AssessmentRow[]>(
    () =>
      tests.map((t) => ({
        test: t,
        attempt: myAttempts.find((a) => a.testId === t.id),
      })),
    [tests, myAttempts],
  );

  const subjectName = (id: string) =>
    subjects.find((s) => s.id === id)?.name ?? id;

  const active = visibleTests.filter(
    (r) =>
      r.test.status === "published" &&
      (!r.attempt ||
        r.attempt.status === "in-progress" ||
        r.attempt.status === "submitted"),
  );
  const upcoming = visibleTests.filter((r) => r.test.status === "draft");
  const completed = visibleTests.filter(
    (r) =>
      r.attempt?.status === "graded" ||
      r.attempt?.status === "submitted" ||
      r.attempt?.status === "missed" ||
      r.test.status === "completed",
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8">
      <div className="rounded-xl bg-[var(--blue-800)] px-5 py-3 text-white">
        <div className="flex flex-wrap items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-[var(--blue-700)] text-xs text-white">
              {STUDENT_INFO.name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-semibold">{STUDENT_INFO.name}</span>
            <span className="opacity-50">•</span>
            <span>{STUDENT_INFO.studentId}</span>
            <span className="opacity-50">•</span>
            <span>{STUDENT_INFO.classLabel}</span>
            <span className="opacity-50">•</span>
            <span>{STUDENT_INFO.year}</span>
            <span className="opacity-60">{STUDENT_INFO.term}</span>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-5">
        <Section
          title="Active Assessments"
          dotColor="bg-[var(--blue-500)]"
          count={active.length}
        >
          {active.map(({ test, attempt }) => (
            <div
              key={test.id}
              className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-card)] p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[var(--blue-600)]">
                  {subjectName(test.subjectId)}
                </span>
                <span className="rounded-full bg-[var(--color-bg-badge-orange)] px-2 py-0.5 text-[10px] font-medium text-[var(--orange-700)]">
                  {attempt?.status === "in-progress"
                    ? "In Progress"
                    : "Not Started"}
                </span>
              </div>
              <h4 className="mt-2 text-sm font-semibold text-[var(--color-text-default)]">
                {test.title}
              </h4>
              <TestMeta test={test} />
              {attempt?.status === "in-progress" ? (
                <Button
                  asChild
                  variant="outline"
                  className="mt-3 w-full justify-center text-[var(--orange-600)]"
                >
                  <Link href={`/student/cbt/${test.id}`}>
                    <RotateCcw className="mr-1 h-3.5 w-3.5" />
                    Resume Test
                  </Link>
                </Button>
              ) : (
                <Button asChild className="mt-3 w-full justify-center">
                  <Link href={`/student/cbt/${test.id}`}>
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
          {upcoming.map(({ test }) => (
            <div
              key={test.id}
              className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-card)] p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[var(--blue-600)]">
                  {subjectName(test.subjectId)}
                </span>
                <span className="rounded-full bg-[var(--color-bg-badge-blue)] px-2 py-0.5 text-[10px] font-medium text-[var(--blue-700)]">
                  Scheduled
                </span>
              </div>
              <h4 className="mt-2 text-sm font-semibold text-[var(--color-text-default)]">
                {test.title}
              </h4>
              <TestMeta test={test} />
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
          {completed.map(({ test, attempt }) => (
            <div
              key={test.id}
              className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-card)] p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[var(--blue-600)]">
                  {subjectName(test.subjectId)}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-medium",
                    attempt?.status === "graded"
                      ? "bg-[var(--color-bg-badge-green)] text-[var(--green-700)]"
                      : attempt?.status === "submitted"
                        ? "bg-[var(--color-bg-badge-violet)] text-[var(--violet-700)]"
                        : "bg-[var(--color-bg-badge-red)] text-[var(--red-700)]",
                  )}
                >
                  {attempt?.status === "graded"
                    ? "Graded"
                    : attempt?.status === "submitted"
                      ? "Submitted"
                      : "Missed"}
                </span>
              </div>
              <h4 className="mt-2 text-sm font-semibold text-[var(--color-text-default)]">
                {test.title}
              </h4>
              <TestMeta test={test} />
              {attempt?.status === "graded" && (
                <div className="mt-3 rounded-md bg-[var(--color-bg-badge-green)] px-3 py-2 text-xs">
                  <div className="text-[var(--green-700)]">Score</div>
                  <div className="text-base font-semibold text-[var(--green-800)]">
                    {attempt.score} / {attempt.totalMarks}
                  </div>
                </div>
              )}
              {attempt?.status === "submitted" && (
                <div className="mt-3 rounded-md bg-[var(--color-bg-badge-violet)] px-3 py-2 text-xs">
                  <div className="text-[var(--violet-700)]">
                    Awaiting Results
                  </div>
                  <div className="font-medium text-[var(--violet-800)]">
                    Your teacher is grading this assessment
                  </div>
                </div>
              )}
              {attempt?.status === "missed" && (
                <div className="mt-3 rounded-md bg-[var(--color-bg-badge-gray)] px-3 py-2 text-xs">
                  <div className="font-medium text-[var(--color-text-subtle)]">
                    Test Closed
                  </div>
                  <div className="text-[var(--color-text-muted)]">
                    This test is no longer available
                  </div>
                </div>
              )}
              <Button
                asChild
                variant="outline"
                className="mt-3 w-full justify-center"
              >
                <Link href={`/student/cbt/${test.id}/result`}>
                  {attempt?.status === "graded" ? (
                    <>
                      <Award className="mr-1 h-3.5 w-3.5" />
                      View Result
                    </>
                  ) : attempt?.status === "submitted" ? (
                    <>
                      <Eye className="mr-1 h-3.5 w-3.5" />
                      View Submission
                    </>
                  ) : (
                    <>
                      <Eye className="mr-1 h-3.5 w-3.5" />
                      View Details
                    </>
                  )}
                </Link>
              </Button>
            </div>
          ))}
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
