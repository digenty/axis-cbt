"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  FileText,
  Loader2,
  LogOut,
  MessageSquare,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { SubmitTestDialog } from "@/components/student/SubmitTestDialog";
import {
  useGetAssessmentPaper,
  useGetAssessmentPreview,
  useGetStudentAttemptAnswers,
  useStartAssessment,
  useSubmitAnswer,
  useSubmitAnswersBatch,
  useSubmitAssessment,
} from "@/hooks/queryHooks/useStudentCBT";
import type {
  ApiStudentOption,
  ApiStudentQuestion,
  ApiStudentSection,
  ApiSubQuestion,
  SubmitAnswerPayload,
} from "@/types/student-api";
import type { StudentAttemptAnswer } from "@/types/question";
import { toast } from "@/components/common/Toast";
import { cn, formatDate } from "@/lib/utils";
import { clearStudentSession } from "@/lib/auth-session";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { RichTextEditor } from "@/components/question-bank/RichTextEditor";
import { TestWindowClosed } from "./TestWindowClosed";

interface TestRunnerProps {
  // The route segment is named [testId] but the value is `assessmentId`.
  testId: string;
  studentName: string;
}

interface SubAnswer {
  selectedOptionIds: number[];
  textAnswer: string;
}

interface AnswerState {
  selectedOptionIds: number[];
  textAnswer: string;
  subAnswers: Record<number, SubAnswer>;
}

const examEndTimeKey = (id: number) => `cbt_exam_end_${id}`;

const emptySubAnswer = (): SubAnswer => ({
  selectedOptionIds: [],
  textAnswer: "",
});

const emptyAnswer = (): AnswerState => ({
  selectedOptionIds: [],
  textAnswer: "",
  subAnswers: {},
});

const isAnswered = (a: AnswerState | undefined): boolean => {
  if (!a) return false;
  if (a.selectedOptionIds.length > 0) return true;
  if (a.textAnswer.trim().length > 0) return true;
  if (
    Object.values(a.subAnswers).some(
      (s) => s.selectedOptionIds.length > 0 || s.textAnswer.trim().length > 0,
    )
  )
    return true;
  return false;
};

interface QuestionGroupTypeData {
  stimulusType?: string;
  stimulusContent?: string;
  stimulusHtml?: string;
  stimulusImageUrl?: string;
  subQuestions?: ApiSubQuestion[];
}

const buildAnswerData = (
  q: ApiStudentQuestion,
  a: AnswerState,
): Record<string, unknown> => {
  const t = q.questionType.toUpperCase();
  if (t === "TRUE_FALSE") {
    return { selectedOptionId: a.selectedOptionIds[0] ?? null };
  }
  if (t === "MULTIPLE_CHOICE") {
    return { selectedOptionIds: a.selectedOptionIds };
  }
  if (t === "MULTIPLE_ANSWERS") {
    return { selectedOptionIds: a.selectedOptionIds };
  }
  if (t === "QUESTION_GROUP") {
    const td = q.typeData as QuestionGroupTypeData;
    const subAnswerData: Record<number, unknown> = {};
    for (const sq of td?.subQuestions ?? []) {
      const sa = a.subAnswers[sq.subQuestionId];
      if (!sa) continue;
      const st = sq.questionType.toUpperCase();
      if (st === "TRUE_FALSE") {
        subAnswerData[sq.subQuestionId] = {
          selectedOptionId: sa.selectedOptionIds[0] ?? null,
        };
      } else if (st === "MULTIPLE_CHOICE" || st === "MULTIPLE_ANSWERS") {
        subAnswerData[sq.subQuestionId] = {
          selectedOptionIds: sa.selectedOptionIds,
        };
      } else {
        subAnswerData[sq.subQuestionId] = { answerText: sa.textAnswer };
      }
    }
    return { subAnswers: subAnswerData };
  }
  return { answerText: a.textAnswer };
};

const parseApiAnswer = (answer: StudentAttemptAnswer): AnswerState => {
  const type = answer.questionType.toUpperCase();
  let parsed: Record<string, unknown> = {};
  if (answer.answerData) {
    try {
      parsed = JSON.parse(answer.answerData) as Record<string, unknown>;
    } catch {
      // malformed JSON — fall back to empty
    }
  }

  if (type === "TRUE_FALSE") {
    const id = (parsed.selectedOptionId as number | null | undefined) ?? null;
    return { ...emptyAnswer(), selectedOptionIds: id != null ? [id] : [] };
  }

  if (type === "MULTIPLE_CHOICE" || type === "MULTIPLE_ANSWERS") {
    return {
      ...emptyAnswer(),
      selectedOptionIds: (parsed.selectedOptionIds as number[]) ?? [],
    };
  }

  if (type === "QUESTION_GROUP") {
    const rawSubs = (parsed.subAnswers ?? {}) as Record<
      string,
      {
        selectedOptionId?: number;
        selectedOptionIds?: number[];
        answerText?: string;
      }
    >;
    const subAnswers: Record<number, SubAnswer> = {};
    for (const [sqId, sa] of Object.entries(rawSubs)) {
      if ("selectedOptionId" in sa) {
        const id = sa.selectedOptionId ?? null;
        subAnswers[Number(sqId)] = {
          ...emptySubAnswer(),
          selectedOptionIds: id != null ? [id] : [],
        };
      } else if ("selectedOptionIds" in sa) {
        subAnswers[Number(sqId)] = {
          ...emptySubAnswer(),
          selectedOptionIds: sa.selectedOptionIds ?? [],
        };
      } else {
        subAnswers[Number(sqId)] = {
          ...emptySubAnswer(),
          textAnswer: sa.answerText ?? "",
        };
      }
    }
    return { ...emptyAnswer(), subAnswers };
  }

  return {
    ...emptyAnswer(),
    textAnswer: (parsed.answerText as string) ?? answer.answerText ?? "",
  };
};

const getOptions = (q: ApiStudentQuestion): ApiStudentOption[] => {
  const td = q.typeData as { options?: ApiStudentOption[] } | null | undefined;
  return td?.options ?? [];
};

const TRUE_FALSE_OPTIONS: ApiStudentOption[] = [
  {
    id: 1,
    optionText: "True",
    optionHtml: null,
    optionLabel: "a",
    optionOrder: 0,
    imageUrl: null,
  },
  {
    id: 2,
    optionText: "False",
    optionHtml: null,
    optionLabel: "b",
    optionOrder: 1,
    imageUrl: null,
  },
];

// ─── Sub-question input (used inside QUESTION_GROUP) ─────────────────────────

const renderSubQuestionInput = (
  sq: ApiSubQuestion,
  ans: SubAnswer,
  onChange: (a: SubAnswer) => void,
) => {
  const t = sq.questionType.toUpperCase();
  const options = sq.options ?? [];

  if (t === "TRUE_FALSE") {
    return (
      <div className="grid grid-cols-2 gap-2 mt-2">
        {TRUE_FALSE_OPTIONS.map((opt) => {
          const picked = ans.selectedOptionIds.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() =>
                onChange({ selectedOptionIds: [opt.id], textAnswer: "" })
              }
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm",
                picked
                  ? "border-2 border-[var(--blue-500)] ring-offset-1 ring-2 ring-border-informative/30"
                  : "border-[var(--color-border-default)] hover:bg-[var(--color-bg-state-soft-hover)]",
              )}
            >
              <span
                className={cn(
                  "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border",
                  picked
                    ? "border-2 border-[var(--blue-500)] ring-offset-1 ring-2 ring-border-informative/30"
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
      <div className="flex flex-col gap-2 mt-2">
        {options.map((opt, i) => {
          const picked = ans.selectedOptionIds.includes(opt.id);
          const letter = String.fromCharCode(65 + i);
          return (
            <label
              key={opt.id}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm text-text-dark-default",
                picked
                  ? "border-2 border-[var(--blue-500)] ring-offset-1 ring-2 ring-border-informative/30"
                  : "border-[var(--color-border-default)] hover:bg-[var(--color-bg-state-soft-hover)]",
              )}
            >
              <span className="w-5 shrink-0 font-medium">{letter}.</span>
              <input
                type="checkbox"
                checked={picked}
                onChange={() => {
                  const next = picked
                    ? ans.selectedOptionIds.filter((id) => id !== opt.id)
                    : [...ans.selectedOptionIds, opt.id];
                  onChange({ selectedOptionIds: next, textAnswer: "" });
                }}
                className="h-3.5 w-3.5 accent-(--blue-500) border rounded-lg border-border-darker"
              />
              {opt.optionText}
            </label>
          );
        })}
      </div>
    );
  }

  if (t === "MULTIPLE_CHOICE") {
    return (
      <div className="flex flex-col gap-1.5 mt-2">
        {options.map((opt) => {
          const picked = ans.selectedOptionIds.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() =>
                onChange({ selectedOptionIds: [opt.id], textAnswer: "" })
              }
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-3.5 text-sm",
                picked
                  ? "border-2 border-[var(--blue-500)] ring-offset-1 ring-2 ring-border-informative/30"
                  : "border-[var(--color-border-default)] hover:bg-[var(--color-bg-state-soft-hover)]",
              )}
            >
              <span
                className={cn(
                  "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border",
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

  if (t === "FILL_IN_THE_BLANK") {
    return (
      <textarea
        value={ans.textAnswer}
        onChange={(e) =>
          onChange({ selectedOptionIds: [], textAnswer: e.target.value })
        }
        placeholder="Type your answer here"
        rows={1}
        className="mt-2 w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-3 py-2 text-sm text-[var(--color-text-default)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
      />
    );
  }

  return (
    <div className="mt-2">
      <RichTextEditor
        value={ans.textAnswer}
        onChange={(v) => onChange({ selectedOptionIds: [], textAnswer: v })}
        placeholder="Type your answer here"
      />
    </div>
  );
};

// ─── Top-level answer input ───────────────────────────────────────────────────

const renderAnswerInput = (
  q: ApiStudentQuestion,
  answer: AnswerState,
  onChange: (a: AnswerState) => void,
) => {
  const t = q.questionType.toUpperCase();
  const options = getOptions(q);

  if (t === "TRUE_FALSE") {
    return (
      <div className="grid grid-cols-2 gap-3">
        {TRUE_FALSE_OPTIONS.map((opt) => {
          const picked = answer.selectedOptionIds.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() =>
                onChange({
                  ...answer,
                  selectedOptionIds: [opt.id],
                  textAnswer: "",
                })
              }
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-3.5 text-sm",
                picked
                  ? "border-2 border-[var(--blue-500)] ring-offset-1 ring-2 ring-border-informative/30"
                  : "border-[var(--color-border-default)] hover:bg-[var(--color-bg-state-soft-hover)]",
              )}
            >
              <span
                className={cn(
                  "flex h-3.5 w-3.5 items-center justify-center rounded-full border",
                  picked
                    ? "border-2 border-[var(--blue-500)] ring-offset-1 ring-2 ring-border-informative/30"
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
      <div className="flex flex-col gap-4">
        {options.map((opt, i) => {
          const picked = answer.selectedOptionIds.includes(opt.id);
          const letter = String.fromCharCode(65 + i);
          return (
            <label
              key={opt.id}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-3.5 text-sm text-text-dark-default",
                picked
                  ? "border-2 border-[var(--blue-500)] ring-offset-1 ring-2 ring-border-informative/30"
                  : "border-[var(--color-border-default)] hover:bg-[var(--color-bg-state-soft-hover)]",
              )}
            >
              <span className="w-5 shrink-0 font-medium">{letter}.</span>
              <input
                type="checkbox"
                checked={picked}
                onChange={() => {
                  const next = picked
                    ? answer.selectedOptionIds.filter((id) => id !== opt.id)
                    : [...answer.selectedOptionIds, opt.id];
                  onChange({
                    ...answer,
                    selectedOptionIds: next,
                    textAnswer: "",
                  });
                }}
                className="h-3.5 w-3.5 accent-(--blue-500) border rounded-lg border-border-darker"
              />
              {opt.optionText}
            </label>
          );
        })}
      </div>
    );
  }

  if (t === "MULTIPLE_CHOICE") {
    return (
      <div className="flex flex-col gap-1.5">
        {options.map((opt) => {
          const picked = answer.selectedOptionIds.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                onChange({
                  ...answer,
                  selectedOptionIds: [opt.id],
                  textAnswer: "",
                });
              }}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-3.5 text-sm",
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

  if (t === "FILL_IN_THE_BLANK") {
    return (
      <textarea
        value={answer.textAnswer}
        onChange={(e) =>
          onChange({
            ...answer,
            selectedOptionIds: [],
            textAnswer: e.target.value,
          })
        }
        placeholder="Type your answer here"
        rows={1}
        className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-3 py-2 text-sm text-[var(--color-text-default)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
      />
    );
  }

  if (t === "QUESTION_GROUP") {
    const td = q.typeData as QuestionGroupTypeData;
    const subQuestions = td?.subQuestions ?? [];
    const stimulusContent = td?.stimulusHtml || td?.stimulusContent || "";
    const stimulusImageUrl = td?.stimulusImageUrl || "";

    return (
      <div className="grid h-[664px] grid-cols-1 gap-6 md:grid-cols-2">
        {/* Left: stimulus */}
        <div className="overflow-y-auto rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-subtle)] p-4 text-sm text-[var(--color-text-default)] leading-relaxed">
          {stimulusImageUrl && (
            <div className="mb-3">
              <Image
                src={stimulusImageUrl}
                alt="Stimulus"
                width={500}
                height={300}
                className="rounded-lg w-full object-contain"
              />
            </div>
          )}
          {stimulusContent && (
            <div dangerouslySetInnerHTML={{ __html: stimulusContent }} />
          )}
        </div>

        {/* Right: sub-questions */}
        <div className="flex flex-col gap-5 overflow-y-auto">
          <p className="text-sm font-medium text-[var(--color-text-muted)]">
            Answer the following questions
          </p>
          {subQuestions.map((sq, i) => {
            const subAns =
              answer.subAnswers[sq.subQuestionId] ?? emptySubAnswer();
            return (
              <div key={sq.subQuestionId} className="flex flex-col gap-1">
                <div className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-bg-subtle)] text-xs font-medium text-[var(--color-text-muted)]">
                    {i + 1}
                  </span>
                  <div
                    className="text-sm font-medium text-[var(--color-text-default)] leading-snug"
                    dangerouslySetInnerHTML={{
                      __html: sq.questionHtml || sq.questionText,
                    }}
                  />
                </div>
                <div className="pl-7">
                  {renderSubQuestionInput(sq, subAns, (sa) =>
                    onChange({
                      ...answer,
                      subAnswers: {
                        ...answer.subAnswers,
                        [sq.subQuestionId]: sa,
                      },
                    }),
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <RichTextEditor
      value={answer.textAnswer}
      onChange={(v) =>
        onChange({ ...answer, selectedOptionIds: [], textAnswer: v })
      }
      placeholder="Type your answer here"
    />
  );
};

interface OrderedQuestion {
  section: ApiStudentSection;
  question: ApiStudentQuestion;
  globalIndex: number;
}

// ─── Question row ─────────────────────────────────────────────────────────────

interface QuestionRowProps {
  q: ApiStudentQuestion;
  globalIdx: number;
  answer: AnswerState;
  onAnswer: (q: ApiStudentQuestion, next: AnswerState) => void;
}

const QuestionRow = ({ q, globalIdx, answer, onAnswer }: QuestionRowProps) => (
  <div className="border border-border-default rounded-lg p-6">
    <div className="flex items-center gap-3">
      <span className="flex size-7 items-center justify-center rounded-full bg-bg-basic-gray-accent text-xs font-medium text-white">
        {globalIdx + 1}
      </span>
      <span className="text-xs text-(--color-text-muted)">
        {q.marks} mark{q.marks === 1 ? "" : "s"}
      </span>
    </div>

    {q.questionType.toUpperCase() !== "QUESTION_GROUP" && (
      <>
        <div
          className="rounded-lg bg-(--color-bg-card) py-4 text-lg font-medium text-(--color-text-default)"
          dangerouslySetInnerHTML={{ __html: q.questionHtml || q.questionText }}
        />
        {q.imageUrl && (
          <div className="relative mt-3 max-h-80 overflow-hidden rounded-lg">
            <Image
              src={q.imageUrl}
              height={80}
              width={200}
              alt="Question image"
              className="rounded-lg"
            />
          </div>
        )}
      </>
    )}

    <div className="mt-4">
      {renderAnswerInput(q, answer, (next) => onAnswer(q, next))}
    </div>
  </div>
);

export const TestRunner = ({ testId }: TestRunnerProps) => {
  const router = useRouter();
  const assessmentId = Number(testId);

  // ─── Lifecycle: start the attempt on mount ──────────────────────────────
  const { id: studentId, isUserLoading } = useLoggedInUser();
  const startMutation = useStartAssessment();
  const { data: previewData } = useGetAssessmentPreview(assessmentId);
  const preview = previewData?.data;
  const [studentAssessmentId, setStudentAssessmentId] = useState<number | null>(
    null,
  );
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current || studentAssessmentId !== null) return;
    if (isUserLoading) return;

    startedRef.current = true;

    const browserInfo = navigator.userAgent;
    console.log({ assessmentId, studentId, browserInfo });

    const doStart = async () => {
      let ipAddress: string | undefined;
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);
        try {
          const res = await fetch("https://api.ipify.org?format=json", {
            signal: controller.signal,
          });
          const json = await res.json();
          ipAddress = json.ip as string;
        } finally {
          clearTimeout(timeout);
        }
      } catch {
        // non-critical — proceed without IP if fetch fails or times out
      }

      startMutation.mutate(
        { assessmentId, studentId, ipAddress, browserInfo },
        {
          onSuccess: (res) => {
            setStudentAssessmentId(res?.data?.id);
          },

          onError: () => {},
        },
      );
    };

    doStart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessmentId, isUserLoading]);

  // ─── Paper fetch + saved-answer hydration ───────────────────────────────
  const { data: paper, isLoading: paperLoading } = useGetAssessmentPaper(
    studentAssessmentId ?? 0,
  );
  const { data: attemptAnswers } = useGetStudentAttemptAnswers(
    studentAssessmentId ?? 0,
  );
  const orderedQuestions = useMemo<OrderedQuestion[]>(() => {
    if (!paper) return [];
    const out: OrderedQuestion[] = [];
    let idx = 0;
    for (const section of paper?.data?.sections ?? []) {
      for (const question of section.questions ?? []) {
        out.push({ section, question, globalIndex: idx });
        idx++;
      }
    }
    return out;
  }, [paper]);

  // ─── Answer state per assessmentQuestionId ─────────────────────────────
  const [answers, setAnswers] = useState<Record<number, AnswerState>>({});

  // Server-persisted answers seeded on mount; local `answers` wins on conflict.
  const resolvedAnswers = useMemo<Record<number, AnswerState>>(() => {
    const hydrated: Record<number, AnswerState> = {};
    for (const a of attemptAnswers?.data ?? []) {
      hydrated[a.assessmentQuestionId] = parseApiAnswer(a);
    }
    return { ...hydrated, ...answers };
  }, [attemptAnswers, answers]);

  const [activeSectionIdx, setActiveSectionIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [submitOpen, setSubmitOpen] = useState(false);

  // Effect A: resume from localStorage instantly on refresh
  useEffect(() => {
    if (!studentAssessmentId) return;
    const stored = localStorage.getItem(examEndTimeKey(studentAssessmentId));
    if (!stored) return;
    const remaining = Math.max(
      0,
      Math.floor((Number(stored) - Date.now()) / 1000),
    );
    // Don't restore an expired cache entry — wait for Effect B (server value) to handle it.
    // This prevents a stale localStorage key from triggering an immediate auto-submit race.
    if (remaining === 0) return;
    const id = setTimeout(() => setSecondsLeft(remaining), 0);
    return () => clearTimeout(id);
  }, [studentAssessmentId]);

  // Effect B: seed countdown from API (server wins on conflict).
  // Prefers timeRemainingSeconds (server-computed, clock-skew-immune) over examEndTime.
  useEffect(() => {
    if (!studentAssessmentId || !paper?.data) return;
    const { timeRemainingSeconds, examEndTime } = paper.data;

    let endMs: number;

    if (timeRemainingSeconds != null && timeRemainingSeconds > 0) {
      endMs = Date.now() + timeRemainingSeconds * 1000;
    } else if (examEndTime) {
      endMs = new Date(examEndTime).getTime();
    } else {
      return;
    }

    localStorage.setItem(examEndTimeKey(studentAssessmentId), String(endMs));
    const remaining = Math.max(0, Math.floor((endMs - Date.now()) / 1000));
    const id = setTimeout(() => setSecondsLeft(remaining), 0);
    return () => clearTimeout(id);
  }, [paper?.data, studentAssessmentId]);

  // Effect C: wall-clock interval — recomputes from stored end time every second
  useEffect(() => {
    if (secondsLeft === null || secondsLeft <= 0) return;
    const id = setInterval(() => {
      if (!studentAssessmentId) return;
      const stored = localStorage.getItem(examEndTimeKey(studentAssessmentId));
      if (!stored) return;
      const remaining = Math.max(
        0,
        Math.floor((Number(stored) - Date.now()) / 1000),
      );
      setSecondsLeft(remaining);
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (studentAssessmentId)
      localStorage.removeItem(examEndTimeKey(studentAssessmentId));
    flushPending();
    submitAssessmentMutation.mutate(studentAssessmentId, {
      onSuccess: (response) => {
        setSubmitOpen(false);
        const id = response?.data?.studentAssessmentId ?? studentAssessmentId;
        router.push(`/student/cbt/${id}/result?assessmentId=${assessmentId}`);
      },
      onError: () =>
        toast({ title: "Failed to submit assessment", type: "error" }),
    });
  };

  // Effect D: auto-submit when time is up (placed after handleSubmit to avoid hoisting issues)
  useEffect(() => {
    if (secondsLeft !== 0) return;
    handleSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  if (startMutation.isError) {
    const errorMessage =
      (startMutation.error as { message?: string })?.message ??
      "This test is no longer available. Please contact your teacher if you believe this was an error.";

    return (
      <TestWindowClosed
        description={errorMessage}
        assessmentId={assessmentId}
      />
    );
  }

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

  const sections = paper?.data?.sections ?? [];
  const activeSection = sections[activeSectionIdx];
  const minutes = Math.floor((secondsLeft ?? 0) / 60);
  const seconds = (secondsLeft ?? 0) % 60;
  const answeredCount = orderedQuestions.filter((oq) =>
    isAnswered(resolvedAnswers[oq.question.assessmentQuestionId]),
  ).length;

  return (
    <div className="flex h-screen flex-col bg-[var(--color-bg-default)]">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-4 md:px-6">
        <h1 className="text-xl font-semibold text-[var(--color-text-default)]">
          {paper?.data?.assessmentName}
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
          {paper?.data?.sections.map((s) => (
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
                  const isActive =
                    orderedQuestions[idx]?.section.sectionId ===
                    activeSection?.sectionId;
                  const answered = isAnswered(
                    resolvedAnswers[q.assessmentQuestionId],
                  );
                  return (
                    <button
                      key={q.assessmentQuestionId}
                      type="button"
                      onClick={() => {
                        const sIdx = sections.findIndex(
                          (sec) =>
                            sec.sectionId ===
                            orderedQuestions[idx]?.section.sectionId,
                        );
                        if (sIdx !== -1) setActiveSectionIdx(sIdx);
                      }}
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
          <div className="mx-auto space-y-5">
            <div>
              <h3 className="text-xl font-semibold text-(--color-text-default)">
                {activeSection?.name}
              </h3>
              <p className="text-text-muted text-sm">
                {activeSection?.instructions}
              </p>
            </div>

            {activeSection?.questions.map((q) => {
              const globalIdx = orderedQuestions.findIndex(
                (oq) =>
                  oq.question.assessmentQuestionId === q.assessmentQuestionId,
              );
              const answer =
                resolvedAnswers[q.assessmentQuestionId] ?? emptyAnswer();
              return (
                <QuestionRow
                  key={q.assessmentQuestionId}
                  q={q}
                  globalIdx={globalIdx}
                  answer={answer}
                  onAnswer={setAnswer}
                />
              );
            })}

            <div className="mt-6 flex items-center justify-between">
              <Button
                variant="outline"
                disabled={activeSectionIdx === 0}
                onClick={() => setActiveSectionIdx((i) => Math.max(0, i - 1))}
              >
                Previous Section
              </Button>
              <Button
                onClick={() => {
                  if (activeSectionIdx === sections.length - 1)
                    setSubmitOpen(true);
                  else setActiveSectionIdx((i) => i + 1);
                }}
              >
                {activeSectionIdx === sections.length - 1
                  ? "Submit"
                  : "Next Section"}
              </Button>
            </div>
          </div>
        </main>
      </div>

      <footer className="flex shrink-0 items-center justify-between border-t border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-4 py-2 text-xs text-[var(--color-text-muted)] md:px-6">
        <span>
          Section {activeSectionIdx + 1} of {sections.length}
        </span>
        <span className="text-[var(--blue-600)]">
          {answeredCount} / {orderedQuestions.length} answered
        </span>
        <form action={clearStudentSession}>
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded px-2 py-1 hover:bg-[var(--color-bg-state-soft-hover)] hover:text-[var(--color-text-default)]"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </button>
        </form>
      </footer>

      <SubmitTestDialog
        open={submitOpen}
        setOpen={setSubmitOpen}
        onConfirm={handleSubmit}
        isLoading={submitAssessmentMutation.isPending}
        answeredCount={answeredCount}
        totalQuestions={orderedQuestions.length}
      />
    </div>
  );
};
