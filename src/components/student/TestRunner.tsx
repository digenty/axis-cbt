"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, Flag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/common/EmptyState";
import {
  useGetAssessmentPaper,
  useStartAssessment,
  useSubmitAnswer,
  useSubmitAnswersBatch,
  useSubmitAssessment,
} from "@/hooks/queryHooks/useStudentCBT";
import type {
  ApiStudentOption,
  ApiStudentQuestion,
  ApiStudentSection,
  SubmitAnswerPayload,
} from "@/types/student-api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TestRunnerProps {
  // The route segment is named [testId] but the value is `assessmentId`.
  testId: string;
  studentName: string;
}

interface AnswerState {
  selectedOptionIds: number[];
  textAnswer: string;
}

const emptyAnswer = (): AnswerState => ({
  selectedOptionIds: [],
  textAnswer: "",
});

const isAnswered = (a: AnswerState | undefined): boolean => {
  if (!a) return false;
  if (a.selectedOptionIds.length > 0) return true;
  if (a.textAnswer.trim().length > 0) return true;
  return false;
};

const buildAnswerData = (
  q: ApiStudentQuestion,
  a: AnswerState,
): Record<string, unknown> => {
  const t = q.questionType.toUpperCase();
  if (t === "MULTIPLE_CHOICE" || t === "TRUE_FALSE") {
    return { selectedOptionId: a.selectedOptionIds[0] ?? null };
  }
  if (t === "MULTIPLE_ANSWERS") {
    return { selectedOptionIds: a.selectedOptionIds };
  }
  return { answerText: a.textAnswer };
};

const getOptions = (q: ApiStudentQuestion): ApiStudentOption[] => {
  const td = q.typeData as { options?: ApiStudentOption[] } | null | undefined;
  return td?.options ?? [];
};

const renderAnswerInput = (
  q: ApiStudentQuestion,
  answer: AnswerState,
  onChange: (a: AnswerState) => void,
) => {
  const t = q.questionType.toUpperCase();
  const options = getOptions(q);

  if (t === "MULTIPLE_CHOICE" || t === "TRUE_FALSE") {
    return (
      <div className="flex flex-col gap-1.5">
        {options.map((opt) => {
          const picked = answer.selectedOptionIds.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() =>
                onChange({ selectedOptionIds: [opt.id], textAnswer: "" })
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
              {opt.optionText}
            </button>
          );
        })}
      </div>
    );
  }

  if (t === "MULTIPLE_ANSWERS") {
    return (
      <div className="flex flex-col gap-1.5">
        {options.map((opt) => {
          const picked = answer.selectedOptionIds.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                const next = picked
                  ? answer.selectedOptionIds.filter((id) => id !== opt.id)
                  : [...answer.selectedOptionIds, opt.id];
                onChange({ selectedOptionIds: next, textAnswer: "" });
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
              {opt.optionText}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <textarea
      value={answer.textAnswer}
      onChange={(e) =>
        onChange({ selectedOptionIds: [], textAnswer: e.target.value })
      }
      rows={4}
      placeholder="Type your answer here"
      className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-3 py-2 text-sm text-[var(--color-text-default)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
    />
  );
};

interface OrderedQuestion {
  section: ApiStudentSection;
  question: ApiStudentQuestion;
  globalIndex: number;
}

export const TestRunner = ({ testId }: TestRunnerProps) => {
  const router = useRouter();
  const assessmentId = Number(testId);

  // ─── Lifecycle: start the attempt on mount ──────────────────────────────
  const startMutation = useStartAssessment();
  const [studentAssessmentId, setStudentAssessmentId] = useState<number | null>(
    null,
  );
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current || studentAssessmentId !== null) return;
    startedRef.current = true;
    startMutation.mutate(
      { assessmentId },
      {
        onSuccess: (res) => {
          setStudentAssessmentId(res.id);
        },
        onError: () => {
          toast.error("Failed to start the assessment");
        },
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessmentId]);

  // ─── Paper fetch ────────────────────────────────────────────────────────
  const { data: paper, isLoading: paperLoading } = useGetAssessmentPaper(
    studentAssessmentId ?? 0,
  );

  const orderedQuestions = useMemo<OrderedQuestion[]>(() => {
    if (!paper) return [];
    const out: OrderedQuestion[] = [];
    let idx = 0;
    for (const section of paper.sections ?? []) {
      for (const question of section.questions ?? []) {
        out.push({ section, question, globalIndex: idx });
        idx++;
      }
    }
    return out;
  }, [paper]);

  // ─── Answer state per assessmentQuestionId ─────────────────────────────
  const [answers, setAnswers] = useState<Record<number, AnswerState>>({});
  const [activeIdx, setActiveIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [submitOpen, setSubmitOpen] = useState(false);

  // Initialize timer once paper is loaded
  useEffect(() => {
    if (paper && secondsLeft === null) {
      setSecondsLeft(paper.timeRemainingSeconds ?? paper.durationMinutes * 60);
    }
  }, [paper, secondsLeft]);

  // Tick timer
  useEffect(() => {
    if (secondsLeft === null || secondsLeft <= 0) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => (s === null ? null : Math.max(0, s - 1)));
    }, 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  const submitAnswerMutation = useSubmitAnswer();
  const submitAnswersBatchMutation = useSubmitAnswersBatch();
  const submitAssessmentMutation = useSubmitAssessment();

  // Pending-write tracking: each timer fires the per-question save. If the
  // student submits or navigates away while answers are still queued, we flush
  // everything via the batch endpoint so nothing is silently dropped.
  const saveTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});
  const pendingPayloads = useRef<Record<number, SubmitAnswerPayload>>({});

  const flushPending = (): SubmitAnswerPayload[] => {
    const payloads = Object.values(pendingPayloads.current);
    Object.values(saveTimers.current).forEach((t) => clearTimeout(t));
    saveTimers.current = {};
    pendingPayloads.current = {};
    if (payloads.length > 0) {
      submitAnswersBatchMutation.mutate(payloads);
    }
    return payloads;
  };

  const setAnswer = (q: ApiStudentQuestion, next: AnswerState) => {
    const aqId = q.assessmentQuestionId;
    setAnswers((prev) => ({ ...prev, [aqId]: next }));
    if (studentAssessmentId === null) return;
    const payload: SubmitAnswerPayload = {
      studentAssessmentId,
      assessmentQuestionId: aqId,
      answerData: buildAnswerData(q, next),
    };
    pendingPayloads.current[aqId] = payload;
    if (saveTimers.current[aqId]) clearTimeout(saveTimers.current[aqId]);
    saveTimers.current[aqId] = setTimeout(() => {
      delete saveTimers.current[aqId];
      // The latest payload wins; drop from pending only after we send it.
      const latest = pendingPayloads.current[aqId];
      if (!latest) return;
      delete pendingPayloads.current[aqId];
      submitAnswerMutation.mutate(latest);
    }, 600);
  };

  // Flush pending answers if the runner unmounts mid-test.
  useEffect(() => {
    return () => {
      flushPending();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = () => {
    if (studentAssessmentId === null) return;
    flushPending();
    submitAssessmentMutation.mutate(studentAssessmentId, {
      onSuccess: () => {
        setSubmitOpen(false);
        router.push(`/student/cbt/${studentAssessmentId}/result`);
      },
      onError: () => toast.error("Failed to submit assessment"),
    });
  };

  if (paperLoading || startMutation.isPending || !paper) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-[var(--color-icon-default-muted)]" />
      </div>
    );
  }

  if (orderedQuestions.length === 0) {
    return (
      <div className="px-6 py-12">
        <EmptyState
          title="This test has no questions"
          description="Please contact your teacher."
        />
      </div>
    );
  }

  const activeOQ = orderedQuestions[activeIdx];
  const activeQ = activeOQ.question;
  const activeAnswer = answers[activeQ.assessmentQuestionId] ?? emptyAnswer();
  const minutes = Math.floor((secondsLeft ?? 0) / 60);
  const seconds = (secondsLeft ?? 0) % 60;

  const answeredCount = orderedQuestions.filter((oq) =>
    isAnswered(answers[oq.question.assessmentQuestionId]),
  ).length;

  return (
    <div className="flex h-screen flex-col bg-[var(--color-bg-default)]">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-4 md:px-6">
        <h1 className="text-base font-semibold text-[var(--color-text-default)]">
          {paper.assessmentName}
        </h1>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-bg-state-soft)] px-3 py-1 text-sm font-medium text-[var(--color-text-default)]">
            <Clock className="h-3.5 w-3.5" />
            {String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
          </span>
          <Button
            onClick={() => setSubmitOpen(true)}
            disabled={submitAssessmentMutation.isPending}
          >
            Submit Test
          </Button>
        </div>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        <aside className="w-full shrink-0 border-r border-[var(--color-border-default)] bg-[var(--color-bg-card)] px-4 py-4 md:w-[200px]">
          <div className="text-xs font-medium text-[var(--color-text-muted)]">
            Question Navigator
          </div>
          {paper.sections.map((s) => (
            <div key={s.sectionId} className="mt-4">
              <div className="text-xs font-medium text-[var(--blue-600)]">
                {s.name}
              </div>
              <div className="mt-2 grid grid-cols-4 gap-1.5">
                {s.questions.map((q) => {
                  const idx = orderedQuestions.findIndex(
                    (oq) =>
                      oq.question.assessmentQuestionId ===
                      q.assessmentQuestionId,
                  );
                  if (idx === -1) return null;
                  const isActive = idx === activeIdx;
                  const answered = isAnswered(answers[q.assessmentQuestionId]);
                  return (
                    <button
                      key={q.assessmentQuestionId}
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
              dangerouslySetInnerHTML={{
                __html: activeQ.questionHtml || activeQ.questionText,
              }}
            />

            <div className="mt-4">
              {renderAnswerInput(activeQ, activeAnswer, (next) =>
                setAnswer(activeQ, next),
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
        </main>
      </div>

      <footer className="flex shrink-0 items-center justify-between border-t border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-4 py-2 text-xs text-[var(--color-text-muted)] md:px-6">
        <span>
          Section {activeOQ.section.sectionOrder} of {paper.sections.length}
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
            <Button
              onClick={handleSubmit}
              disabled={submitAssessmentMutation.isPending}
            >
              {submitAssessmentMutation.isPending && (
                <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
              )}
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
