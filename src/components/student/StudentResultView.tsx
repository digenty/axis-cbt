"use client";

import Link from "next/link";
import { use, useMemo } from "react";
import { ArrowLeft, Award, CheckCircle2, XCircle } from "lucide-react";
import { useCBTStore } from "@/store";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/common/StatCard";
import { EmptyState } from "@/components/common/EmptyState";
import { StatusBadge } from "@/components/common/StatusBadge";
import { QuestionTypeBadge } from "@/components/common/QuestionTypeBadge";
import { cn } from "@/lib/utils";
import type { Question } from "@/types";

interface StudentResultViewProps {
  params: Promise<{ testId: string }>;
}

export const StudentResultView = ({ params }: StudentResultViewProps) => {
  const { testId } = use(params);
  const { tests, attempts, questions } = useCBTStore();

  const test = useMemo(
    () => tests.find((t) => t.id === testId),
    [tests, testId],
  );
  const attempt = useMemo(
    () =>
      attempts.find(
        (a) => a.testId === testId && a.studentName === "Damilare John",
      ),
    [attempts, testId],
  );

  const orderedQuestions = useMemo<Question[]>(
    () =>
      test
        ? test.sections.flatMap(
            (s) =>
              s.questionIds
                .map((id) => questions.find((q) => q.id === id))
                .filter(Boolean) as Question[],
          )
        : [],
    [test, questions],
  );

  if (!test || !attempt) {
    return (
      <div className="px-6 py-12">
        <EmptyState title="Result not available yet" />
      </div>
    );
  }

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
          {test.title}
        </h1>
        <StatusBadge status={attempt.status} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <StatCard
          icon={<Award className="h-4 w-4 text-[var(--green-500)]" />}
          label="Your Score"
          value={
            typeof attempt.score === "number"
              ? `${attempt.score}/${attempt.totalMarks}`
              : "—"
          }
        />
        <StatCard
          label="Percentage"
          value={
            typeof attempt.percentage === "number"
              ? `${attempt.percentage}%`
              : "—"
          }
        />
        <StatCard
          label="Submitted"
          value={
            attempt.submittedAt
              ? new Date(attempt.submittedAt).toLocaleString()
              : "—"
          }
        />
      </div>

      {attempt.feedback && (
        <div className="mt-3 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)] p-4">
          <div className="text-xs text-[var(--color-text-muted)]">
            Teacher feedback
          </div>
          <p className="mt-1 text-sm text-[var(--color-text-default)]">
            {attempt.feedback}
          </p>
        </div>
      )}

      <div className="mt-5 flex flex-col gap-3">
        {orderedQuestions.map((q, i) => {
          const ans = attempt.answers.find((a) => a.questionId === q.id);
          const correct =
            typeof ans?.awardedMarks === "number"
              ? ans.awardedMarks > 0
              : undefined;
          return (
            <div
              key={q.id}
              className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)] p-4"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-bg-state-soft)] text-xs font-medium">
                  {i + 1}
                </span>
                <QuestionTypeBadge type={q.type} />
                <span className="text-[11px] text-[var(--color-text-muted)]">
                  • {q.marks} mark{q.marks === 1 ? "" : "s"}
                </span>
                <span className="ml-auto inline-flex items-center gap-1 text-xs">
                  {correct === true && (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-[var(--green-500)]" />
                      <span className="text-[var(--green-700)]">
                        {ans?.awardedMarks}/{q.marks}
                      </span>
                    </>
                  )}
                  {correct === false && (
                    <>
                      <XCircle className="h-3.5 w-3.5 text-[var(--red-500)]" />
                      <span className="text-[var(--red-700)]">0/{q.marks}</span>
                    </>
                  )}
                  {correct === undefined && (
                    <span className="text-[var(--color-text-muted)]">
                      Pending
                    </span>
                  )}
                </span>
              </div>

              <div
                className="mt-3 text-sm text-[var(--color-text-default)]"
                dangerouslySetInnerHTML={{ __html: q.text }}
              />

              {ans?.textAnswer && (
                <div
                  className={cn(
                    "mt-3 rounded-lg border px-3 py-2 text-sm",
                    correct === true
                      ? "border-[var(--green-300)] bg-[var(--color-bg-badge-green)] text-[var(--green-800)]"
                      : correct === false
                        ? "border-[var(--red-300)] bg-[var(--color-bg-badge-red)] text-[var(--red-800)]"
                        : "border-[var(--color-border-default)] bg-[var(--color-bg-subtle)] text-[var(--color-text-default)]",
                  )}
                >
                  Your answer: {ans.textAnswer}
                </div>
              )}

              {ans?.selectedOptionIds && q.options && (
                <div className="mt-3 flex flex-col gap-1.5 text-sm">
                  {q.options.map((opt) => {
                    const picked = ans.selectedOptionIds?.includes(opt.id);
                    return (
                      <div
                        key={opt.id}
                        className={cn(
                          "rounded-lg border px-3 py-1.5",
                          opt.isCorrect
                            ? "border-[var(--green-400)] bg-[var(--color-bg-badge-green)] text-[var(--green-700)]"
                            : picked
                              ? "border-[var(--red-400)] bg-[var(--color-bg-badge-red)] text-[var(--red-700)]"
                              : "border-[var(--color-border-default)] text-[var(--color-text-default)]",
                        )}
                      >
                        {opt.text}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
