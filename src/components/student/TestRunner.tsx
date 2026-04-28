"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, Flag } from "lucide-react";
import { useCBTStore } from "@/store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { generateId } from "@/lib/utils";
import type { Question, StudentAnswer } from "@/types";
import { cn } from "@/lib/utils";

interface TestRunnerProps {
  testId: string;
  studentName: string;
}

const renderAnswerInput = (
  q: Question,
  answer: StudentAnswer | undefined,
  onChange: (a: StudentAnswer) => void,
) => {
  if (q.type === "multiple-choice" || q.type === "true-false") {
    return (
      <div className="flex flex-col gap-1.5">
        {(q.options ?? []).map((opt) => {
          const picked = answer?.selectedOptionIds?.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() =>
                onChange({
                  questionId: q.id,
                  selectedOptionIds: [opt.id],
                })
              }
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
                picked
                  ? "border-[var(--blue-500)] bg-[var(--color-bg-badge-blue)] text-[var(--blue-700)]"
                  : "border-[var(--color-border-default)] hover:bg-[var(--color-bg-state-soft-hover)]",
              )}
            >
              <span
                className={cn(
                  "flex h-3.5 w-3.5 items-center justify-center rounded-full border",
                  picked
                    ? "border-[var(--blue-500)] bg-[var(--blue-500)]"
                    : "border-[var(--color-border-strong)]",
                )}
              >
                {picked && (
                  <span className="block h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </span>
              {opt.text}
            </button>
          );
        })}
      </div>
    );
  }
  if (q.type === "multiple-answers") {
    return (
      <div className="flex flex-col gap-1.5">
        {(q.options ?? []).map((opt) => {
          const picked = answer?.selectedOptionIds?.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                const current = answer?.selectedOptionIds ?? [];
                onChange({
                  questionId: q.id,
                  selectedOptionIds: picked
                    ? current.filter((id) => id !== opt.id)
                    : [...current, opt.id],
                });
              }}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
                picked
                  ? "border-[var(--blue-500)] bg-[var(--color-bg-badge-blue)] text-[var(--blue-700)]"
                  : "border-[var(--color-border-default)] hover:bg-[var(--color-bg-state-soft-hover)]",
              )}
            >
              <span
                className={cn(
                  "flex h-3.5 w-3.5 items-center justify-center rounded border",
                  picked
                    ? "border-[var(--blue-500)] bg-[var(--blue-500)]"
                    : "border-[var(--color-border-strong)]",
                )}
              >
                {picked && (
                  <svg
                    className="h-2.5 w-2.5 text-white"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M2 6l3 3 5-6" />
                  </svg>
                )}
              </span>
              {opt.text}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <textarea
      value={answer?.textAnswer ?? ""}
      onChange={(e) =>
        onChange({ questionId: q.id, textAnswer: e.target.value })
      }
      rows={4}
      placeholder="Type your answer here"
      className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-3 py-2 text-sm text-[var(--color-text-default)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
    />
  );
};

export const TestRunner = ({ testId, studentName }: TestRunnerProps) => {
  const router = useRouter();
  const { tests, questions, attempts, updateAttempt } = useCBTStore();
  const test = useMemo(
    () => tests.find((t) => t.id === testId),
    [tests, testId],
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

  const existingAttempt = useMemo(
    () =>
      attempts.find(
        (a) => a.testId === testId && a.studentName === studentName,
      ),
    [attempts, testId, studentName],
  );

  const [attemptId] = useState(existingAttempt?.id ?? generateId());
  const [answers, setAnswers] = useState<StudentAnswer[]>(
    existingAttempt?.answers ?? [],
  );
  const [activeIdx, setActiveIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState((test?.duration ?? 60) * 60);
  const [submitOpen, setSubmitOpen] = useState(false);

  useEffect(() => {
    if (!test) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 0) {
          clearInterval(id);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [test]);

  if (!test) return null;

  const activeQ = orderedQuestions[activeIdx];

  const setAnswer = (a: StudentAnswer) =>
    setAnswers((prev) => {
      const others = prev.filter((p) => p.questionId !== a.questionId);
      return [...others, a];
    });

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const handleSubmit = () => {
    if (existingAttempt) {
      updateAttempt(existingAttempt.id, {
        answers,
        status: "submitted",
        submittedAt: new Date().toISOString(),
        totalMarks: test.totalMarks,
      });
    } else {
      useCBTStore.setState((state) => ({
        attempts: [
          ...state.attempts,
          {
            id: attemptId,
            testId: test.id,
            subjectId: test.subjectId,
            classId: test.classId,
            studentId: studentName.toLowerCase().replace(/\s+/g, "-"),
            studentName,
            studentClass: "JSS 1 A",
            answers,
            status: "submitted" as const,
            totalMarks: test.totalMarks,
            startedAt: new Date().toISOString(),
            submittedAt: new Date().toISOString(),
          },
        ],
      }));
    }
    setSubmitOpen(false);
    router.push(`/student/cbt/${test.id}/result`);
  };

  const answeredCount = orderedQuestions.filter((q) =>
    answers.some(
      (a) =>
        a.questionId === q.id &&
        (a.textAnswer || (a.selectedOptionIds?.length ?? 0) > 0),
    ),
  ).length;

  return (
    <div className="flex h-screen flex-col bg-[var(--color-bg-default)]">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-4 md:px-6">
        <h1 className="text-base font-semibold text-[var(--color-text-default)]">
          {test.title}
        </h1>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-bg-state-soft)] px-3 py-1 text-sm font-medium text-[var(--color-text-default)]">
            <Clock className="h-3.5 w-3.5" />
            {String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
          </span>
          <Button onClick={() => setSubmitOpen(true)}>Submit Test</Button>
        </div>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        <aside className="w-full shrink-0 border-r border-[var(--color-border-default)] bg-[var(--color-bg-card)] px-4 py-4 md:w-[200px]">
          <div className="text-xs font-medium text-[var(--color-text-muted)]">
            Question Navigator
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
                  const answered = answers.some(
                    (a) =>
                      a.questionId === qid &&
                      (a.textAnswer || (a.selectedOptionIds?.length ?? 0) > 0),
                  );
                  return (
                    <button
                      key={qid}
                      type="button"
                      onClick={() => setActiveIdx(idx)}
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-md text-xs font-medium",
                        isActive
                          ? "bg-[var(--blue-500)] text-white"
                          : answered
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
          {activeQ && (
            <div className="mx-auto max-w-3xl">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-9 items-center justify-center rounded-full bg-[var(--color-bg-state-gray)] text-xs font-medium text-white">
                  {activeIdx + 1}
                </span>
                <span className="text-xs text-[var(--color-text-muted)]">
                  {activeQ.marks} marks
                </span>
                <button
                  type="button"
                  className="ml-auto text-[var(--color-icon-default-muted)] hover:text-[var(--color-icon-warning)]"
                >
                  <Flag className="h-4 w-4" />
                </button>
              </div>

              <div
                className="mt-3 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-card)] p-4 text-sm text-[var(--color-text-default)]"
                dangerouslySetInnerHTML={{ __html: activeQ.text }}
              />

              <div className="mt-4">
                {renderAnswerInput(
                  activeQ,
                  answers.find((a) => a.questionId === activeQ.id),
                  setAnswer,
                )}
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
                  onClick={() => {
                    if (activeIdx === orderedQuestions.length - 1)
                      setSubmitOpen(true);
                    else setActiveIdx((i) => i + 1);
                  }}
                >
                  {activeIdx === orderedQuestions.length - 1
                    ? "Submit"
                    : "Next Question"}
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>

      <footer className="flex shrink-0 items-center justify-between border-t border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-4 py-2 text-xs text-[var(--color-text-muted)] md:px-6">
        <span>
          Section {Math.min(activeIdx + 1, test.sections.length)} of{" "}
          {test.sections.length}
        </span>
        <span className="text-[var(--blue-600)]">
          {answeredCount} / {orderedQuestions.length} answered
        </span>
      </footer>

      <Dialog open={submitOpen} onOpenChange={setSubmitOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Submit your test?</DialogTitle>
            <DialogDescription>
              You answered {answeredCount} out of {orderedQuestions.length}{" "}
              questions. Submitted answers can&apos;t be changed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubmitOpen(false)}>
              Keep going
            </Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
