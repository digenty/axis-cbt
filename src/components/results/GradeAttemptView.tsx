"use client";

import { use, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Flag } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCBTStore } from "@/store";
import { BackButton } from "@/components/common/BackButton";
import { QuestionTypeBadge } from "@/components/common/QuestionTypeBadge";
import { EmptyState } from "@/components/common/EmptyState";
import type { Question, StudentAnswer } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface GradeAttemptViewProps {
  params: Promise<{
    classId: string;
    subjectId: string;
    attemptId: string;
  }>;
}

const renderStudentAnswer = (q: Question, ans?: StudentAnswer) => {
  if (!ans)
    return (
      <span className="text-xs italic text-[var(--color-text-muted)]">
        Not answered
      </span>
    );
  if (ans.textAnswer) {
    return (
      <div className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-subtle)] px-3 py-2 text-sm text-[var(--color-text-default)]">
        {ans.textAnswer}
      </div>
    );
  }
  if (ans.selectedOptionIds && q.options) {
    return (
      <div className="flex flex-col gap-1.5">
        {q.options.map((opt) => {
          const picked = ans.selectedOptionIds?.includes(opt.id);
          const correct = opt.isCorrect;
          return (
            <div
              key={opt.id}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm",
                correct
                  ? "border-[var(--green-400)] bg-[var(--color-bg-badge-green)] text-[var(--green-700)]"
                  : picked
                    ? "border-[var(--red-400)] bg-[var(--color-bg-badge-red)] text-[var(--red-700)]"
                    : "border-[var(--color-border-default)] text-[var(--color-text-default)]",
              )}
            >
              <span
                className={cn(
                  "flex h-3.5 w-3.5 items-center justify-center rounded-full border",
                  picked
                    ? correct
                      ? "border-[var(--green-500)] bg-[var(--green-500)]"
                      : "border-[var(--red-500)] bg-[var(--red-500)]"
                    : "border-[var(--color-border-strong)]",
                )}
              >
                {picked && (
                  <span className="block h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </span>
              {opt.text}
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

export const GradeAttemptView = ({ params }: GradeAttemptViewProps) => {
  const { classId, subjectId, attemptId } = use(params);
  const router = useRouter();
  const { attempts, tests, questions, gradeAttempt } = useCBTStore();

  const attempt = useMemo(
    () => attempts.find((a) => a.id === attemptId),
    [attempts, attemptId],
  );
  const test = useMemo(
    () => (attempt ? tests.find((t) => t.id === attempt.testId) : null),
    [tests, attempt],
  );

  const orderedQuestions = useMemo<Question[]>(() => {
    if (!test) return [];
    return test.sections.flatMap(
      (s) =>
        s.questionIds
          .map((id) => questions.find((q) => q.id === id))
          .filter(Boolean) as Question[],
    );
  }, [test, questions]);

  const [activeIdx, setActiveIdx] = useState(0);
  const [marks, setMarks] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    attempt?.answers.forEach((a) => {
      if (typeof a.awardedMarks === "number")
        map[a.questionId] = a.awardedMarks;
    });
    return map;
  });

  if (!attempt || !test) {
    return (
      <div className="px-6 py-6">
        <EmptyState title="Attempt not found" />
      </div>
    );
  }

  const baseUrl = `/classes/${classId}/subjects/${subjectId}`;
  const activeQuestion = orderedQuestions[activeIdx];

  const handleGrade = () => {
    const score = orderedQuestions.reduce(
      (sum, q) => sum + (marks[q.id] ?? 0),
      0,
    );
    const newAnswers: StudentAnswer[] = attempt.answers.map((a) => ({
      ...a,
      awardedMarks: marks[a.questionId] ?? a.awardedMarks ?? 0,
    }));
    gradeAttempt(attempt.id, score, "", newAnswers);
    toast.success("Attempt graded");
    router.push(`${baseUrl}/results`);
  };

  return (
    <div className="flex h-full min-h-[calc(100vh-3.5rem)] flex-col">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-4 py-2.5 md:px-6">
        <div className="flex items-center gap-3">
          <BackButton href={`${baseUrl}/results`} label="Go Back" />
          <h1 className="text-base font-semibold text-[var(--color-text-default)]">
            {test.title}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-[var(--color-bg-muted)] text-[11px]">
              {attempt.studentName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <div className="font-medium text-[var(--color-text-default)]">
              {attempt.studentName}
            </div>
            <div className="text-[11px] text-[var(--color-text-muted)]">
              {attempt.studentClass}
            </div>
          </div>
        </div>
        <Button onClick={handleGrade}>Grade</Button>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        <aside className="w-full shrink-0 border-r border-[var(--color-border-default)] bg-[var(--color-bg-card)] px-4 py-4 md:w-[200px]">
          <div className="text-xs font-medium text-[var(--color-text-muted)]">
            Question Navigator
          </div>
          <div className="mt-1 text-[11px] text-[var(--blue-600)]">
            {Object.keys(marks).length}/{orderedQuestions.length} Questions
          </div>
          {test.sections.map((s) => (
            <div key={s.id} className="mt-4">
              <div className="text-xs font-medium text-[var(--blue-600)]">
                {s.title}
              </div>
              <div className="mt-2 grid grid-cols-4 gap-1.5">
                {s.questionIds.map((qid) => {
                  const idx = orderedQuestions.findIndex((q) => q.id === qid);
                  if (idx === -1) return null;
                  const isActive = idx === activeIdx;
                  return (
                    <button
                      key={qid}
                      type="button"
                      onClick={() => setActiveIdx(idx)}
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-md text-xs font-medium",
                        isActive
                          ? "bg-[var(--blue-500)] text-white"
                          : marks[qid] !== undefined
                            ? "bg-[var(--color-bg-badge-blue)] text-[var(--blue-700)]"
                            : "bg-[var(--color-bg-subtle)] text-[var(--color-text-subtle)]",
                      )}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </aside>

        <main className="flex-1 overflow-y-auto px-4 py-5 md:px-8">
          {activeQuestion ? (
            <div className="mx-auto max-w-3xl">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-bg-state-gray)] text-xs font-medium text-white">
                  {activeIdx + 1}
                </span>
                <QuestionTypeBadge type={activeQuestion.type} />
                <span className="text-xs text-[var(--color-text-muted)]">
                  {activeQuestion.marks} mark
                  {activeQuestion.marks === 1 ? "" : "s"}
                </span>
                <button
                  type="button"
                  className="ml-auto text-[var(--color-icon-default-muted)] hover:text-[var(--color-icon-warning)]"
                  aria-label="Flag for review"
                >
                  <Flag className="h-4 w-4" />
                </button>
              </div>

              <div
                className="mt-3 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-card)] p-4 text-sm text-[var(--color-text-default)]"
                dangerouslySetInnerHTML={{ __html: activeQuestion.text }}
              />

              <div className="mt-4 space-y-2">
                <Label className="text-xs text-[var(--color-text-subtle)]">
                  Student answer
                </Label>
                {renderStudentAnswer(
                  activeQuestion,
                  attempt.answers.find(
                    (a) => a.questionId === activeQuestion.id,
                  ),
                )}
              </div>

              <div className="mt-5 flex items-center gap-3 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-card)] px-3 py-3">
                <Label
                  htmlFor={`marks-${activeQuestion.id}`}
                  className="text-sm font-medium text-[var(--color-text-default)]"
                >
                  Awarded marks
                </Label>
                <Input
                  id={`marks-${activeQuestion.id}`}
                  type="number"
                  className="w-24"
                  min={0}
                  max={activeQuestion.marks}
                  value={marks[activeQuestion.id] ?? ""}
                  onChange={(e) =>
                    setMarks({
                      ...marks,
                      [activeQuestion.id]: Math.min(
                        activeQuestion.marks,
                        Math.max(0, Number(e.target.value) || 0),
                      ),
                    })
                  }
                />
                <span className="text-sm text-[var(--color-text-muted)]">
                  / {activeQuestion.marks}
                </span>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <Button
                  variant="outline"
                  disabled={activeIdx === 0}
                  onClick={() => setActiveIdx((i) => Math.max(0, i - 1))}
                >
                  Previous Question
                </Button>
                <Button
                  disabled={activeIdx === orderedQuestions.length - 1}
                  onClick={() =>
                    setActiveIdx((i) =>
                      Math.min(orderedQuestions.length - 1, i + 1),
                    )
                  }
                >
                  Next Question
                </Button>
              </div>
            </div>
          ) : (
            <EmptyState title="No questions in this attempt" />
          )}
        </main>
      </div>
    </div>
  );
};
