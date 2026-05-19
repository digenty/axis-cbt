"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Award, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Modal } from "@/components/Modal";
import {
  useGetAssessmentPreview,
  useGetStudentAttemptReview,
  useGetStudentResult,
} from "@/hooks/queryHooks/useStudentCBT";
import type {
  ApiReviewQuestion,
  ApiStudentOption,
  ApiSubQuestion,
  AttemptStatus as ApiAttemptStatus,
} from "@/types/student-api";
import type { AttemptStatus as UiAttemptStatus } from "@/types/results";
import { cn } from "@/lib/utils";

// ─── Helpers ─────────────────────────────────────────────────────────────────

interface QuestionGroupTypeData {
  stimulusType?: string;
  stimulusContent?: string;
  stimulusHtml?: string;
  stimulusImageUrl?: string;
  subQuestions?: ApiSubQuestion[];
}

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

const parseAnswerDataJson = (answerData: string): Record<string, unknown> => {
  try {
    return JSON.parse(answerData) as Record<string, unknown>;
  } catch {
    return {};
  }
};

const getCorrectOptionIds = (correctAnswer: unknown): number[] => {
  if (!correctAnswer || typeof correctAnswer !== "object") return [];
  const ca = correctAnswer as Record<string, unknown>;
  if (Array.isArray(ca.correctOptionIds))
    return ca.correctOptionIds as number[];
  if (typeof ca.correctOptionId === "number") return [ca.correctOptionId];
  return [];
};

const getCorrectText = (correctAnswer: unknown): string => {
  if (!correctAnswer || typeof correctAnswer !== "object") return "—";
  const ca = correctAnswer as Record<string, unknown>;
  if (typeof ca.answerText === "string") return ca.answerText;
  if (typeof ca.correctAnswer === "string") return ca.correctAnswer;
  if (typeof ca.correctText === "string") return ca.correctText;
  return "—";
};

const apiStatusToUi = (
  status: ApiAttemptStatus | null | undefined,
): UiAttemptStatus => {
  if (status === "IN_PROGRESS") return "in-progress";
  if (status === "PENDING") return "submitted";
  if (status === "ABSENT" || status === "TIMED_OUT") return "missed";
  if (status === "COMPLETED") return "graded";
  return "submitted";
};

// ─── ReviewOption ─────────────────────────────────────────────────────────────

interface ReviewOptionProps {
  option: ApiStudentOption;
  label: string;
  isCorrect: boolean;
  wasSelected: boolean;
}

const ReviewOption = ({
  option,
  label,
  isCorrect,
  wasSelected,
}: ReviewOptionProps) => {
  const highlightClass = isCorrect
    ? "border-[var(--color-border-green)] bg-[var(--color-bg-badge-green)] text-[var(--green-700)]"
    : wasSelected
      ? "border-[var(--color-border-red)] bg-[var(--color-bg-badge-red)] text-[var(--red-700)]"
      : "border-[var(--color-border-default)]";

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 rounded-lg border px-3 py-3.5 text-sm",
        highlightClass,
      )}
    >
      <div className="flex items-center gap-2">
        <span className="w-5 shrink-0 font-medium">{label}.</span>
        <span>{option.optionText}</span>
      </div>
      {isCorrect && (
        <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--green-700)]" />
      )}
      {wasSelected && !isCorrect && (
        <XCircle className="h-4 w-4 shrink-0 text-[var(--red-700)]" />
      )}
    </div>
  );
};

// ─── ReviewQuestionGroup ──────────────────────────────────────────────────────

const ReviewQuestionGroup = ({ q }: { q: ApiReviewQuestion }) => {
  const td = q.typeData as QuestionGroupTypeData;
  const subQuestions = td?.subQuestions ?? [];
  const stimulusContent = td?.stimulusHtml || td?.stimulusContent || "";
  const stimulusImageUrl = td?.stimulusImageUrl || "";

  const answerData = q.answerData ? parseAnswerDataJson(q.answerData) : {};
  const subAnswers = (answerData.subAnswers ?? {}) as Record<
    string,
    {
      selectedOptionId?: number;
      selectedOptionIds?: number[];
      answerText?: string;
    }
  >;

  const correctSubAnswers = (() => {
    if (!q.correctAnswer || typeof q.correctAnswer !== "object")
      return {} as Record<string | number, unknown>;
    const ca = q.correctAnswer as Record<string, unknown>;
    if (Array.isArray(ca.subQuestions)) {
      return Object.fromEntries(
        (
          ca.subQuestions as Array<
            { subQuestionId: number } & Record<string, unknown>
          >
        ).map((sq) => [sq.subQuestionId, sq]),
      );
    }
    return (ca.subAnswers ?? {}) as Record<string | number, unknown>;
  })();

  return (
    <div className="grid h-[664px] grid-cols-1 gap-6 md:grid-cols-2">
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

      <div className="flex flex-col gap-5 overflow-y-auto">
        <p className="text-sm font-medium text-(--color-text-muted)">
          Answer the following questions
        </p>
        {subQuestions.map((sq, i) => {
          const sqAns = subAnswers[sq.subQuestionId] ?? {};
          const sqCorrect = correctSubAnswers[sq.subQuestionId];
          const sqT = sq.questionType.toUpperCase();
          const sqCorrectIds = (() => {
            if (!sqCorrect || typeof sqCorrect !== "object") return [];
            const ca = sqCorrect as Record<string, unknown>;
            if (sqT === "TRUE_FALSE" && typeof ca.correctAnswer === "boolean")
              return [ca.correctAnswer === true ? 1 : 2];
            return getCorrectOptionIds(sqCorrect);
          })();

          let sqStudentIds: number[] = [];
          if (sqT === "TRUE_FALSE") {
            const id = sqAns.selectedOptionId ?? null;
            sqStudentIds = id != null ? [id] : [];
          } else if (sqT === "MULTIPLE_CHOICE" || sqT === "MULTIPLE_ANSWERS") {
            sqStudentIds = sqAns.selectedOptionIds ?? [];
          }

          const sqOptions =
            sqT === "TRUE_FALSE" ? TRUE_FALSE_OPTIONS : (sq.options ?? []);

          return (
            <div key={sq.subQuestionId} className="flex flex-col gap-1">
              <div className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-bg-subtle)] text-xs font-medium text-(--color-text-muted)">
                  {i + 1}
                </span>
                <div
                  className="text-sm font-medium text-(--color-text-default) leading-snug"
                  dangerouslySetInnerHTML={{
                    __html: sq.questionHtml || sq.questionText,
                  }}
                />
              </div>
              <div className="pl-7 flex flex-col gap-1.5">
                {sqT === "MULTIPLE_CHOICE" ||
                sqT === "TRUE_FALSE" ||
                sqT === "MULTIPLE_ANSWERS" ? (
                  sqOptions.map((opt, j) => (
                    <ReviewOption
                      key={opt.id}
                      option={opt}
                      label={String.fromCharCode(65 + j)}
                      isCorrect={sqCorrectIds.includes(opt.id)}
                      wasSelected={sqStudentIds.includes(opt.id)}
                    />
                  ))
                ) : (
                  <div className="space-y-2">
                    <div className="rounded-lg bg-[var(--color-bg-subtle)] p-3">
                      <div className="mb-1 text-xs font-medium text-(--color-text-muted)">
                        Your answer
                      </div>
                      <div className="text-sm text-(--color-text-default)">
                        {sqAns.answerText || "—"}
                      </div>
                    </div>
                    {!!sqCorrect && (
                      <div className="rounded-lg border border-[var(--color-border-green)] bg-[var(--color-bg-badge-green)] p-3">
                        <div className="mb-1 text-xs font-medium text-[var(--green-700)]">
                          Correct answer
                        </div>
                        <div className="text-sm text-[var(--green-700)]">
                          {getCorrectText(sqCorrect)}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── ReviewQuestionCard ───────────────────────────────────────────────────────

interface ReviewQuestionCardProps {
  q: ApiReviewQuestion;
  globalIdx: number;
}

const ReviewQuestionCard = ({ q, globalIdx }: ReviewQuestionCardProps) => {
  const t = q.questionType.toUpperCase();
  const td = q.typeData as { options?: ApiStudentOption[] } | null | undefined;
  const options = td?.options ?? [];
  const answerData = q.answerData ? parseAnswerDataJson(q.answerData) : {};

  let studentOptionIds: number[] = [];
  if (t === "TRUE_FALSE") {
    const id = answerData.selectedOptionId as number | null | undefined;
    studentOptionIds = id != null ? [id] : [];
  } else if (t === "MULTIPLE_CHOICE" || t === "MULTIPLE_ANSWERS") {
    studentOptionIds = (answerData.selectedOptionIds as number[]) ?? [];
  }

  const correctOptionIds = getCorrectOptionIds(q.correctAnswer);
  const optionList = t === "TRUE_FALSE" ? TRUE_FALSE_OPTIONS : options;

  const isTextType =
    t === "ESSAY" ||
    t === "SHORT_ANSWER" ||
    t === "FILL_IN_THE_BLANK" ||
    t === "NUMERICAL" ||
    t === "MULTIPLE_BLANKS" ||
    t === "MATCHING";

  return (
    <div className="border border-border-default rounded-lg p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-7 items-center justify-center rounded-full bg-bg-basic-gray-accent text-xs font-medium text-white">
            {globalIdx + 1}
          </span>
          <span className="text-xs text-(--color-text-muted)">
            {q.maxMarks} mark{q.maxMarks === 1 ? "" : "s"}
          </span>
        </div>
        {q.isCorrect !== null && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-(--color-text-muted)">
              {q.marksAwarded}/{q.maxMarks}
            </span>
            {q.isCorrect ? (
              <CheckCircle2 className="h-4 w-4 text-(--green-700)" />
            ) : (
              <XCircle className="h-4 w-4 text-(--red-700)" />
            )}
          </div>
        )}
      </div>

      {t !== "QUESTION_GROUP" && (
        <>
          <div
            className="rounded-lg bg-(--color-bg-card) py-4 text-lg font-medium text-(--color-text-default)"
            dangerouslySetInnerHTML={{
              __html: q.questionHtml || q.questionText,
            }}
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
        {(t === "MULTIPLE_CHOICE" ||
          t === "TRUE_FALSE" ||
          t === "MULTIPLE_ANSWERS") && (
          <div className="flex flex-col gap-1.5">
            {optionList.map((opt, i) => (
              <ReviewOption
                key={opt.id}
                option={opt}
                label={String.fromCharCode(65 + i)}
                isCorrect={correctOptionIds.includes(opt.id)}
                wasSelected={studentOptionIds.includes(opt.id)}
              />
            ))}
          </div>
        )}

        {isTextType && (
          <div className="space-y-2">
            <div className="rounded-lg bg-[var(--color-bg-subtle)] p-3">
              <div className="mb-1 text-xs font-medium text-(--color-text-muted)">
                Your answer
              </div>
              <div className="text-sm text-(--color-text-default) whitespace-pre-wrap">
                {(answerData.answerText as string) || "—"}
              </div>
            </div>
            {q.correctAnswer != null && (
              <div className="rounded-lg border border-[var(--color-border-green)] bg-[var(--color-bg-badge-green)] p-3">
                <div className="mb-1 text-xs font-medium text-[var(--green-700)]">
                  Correct answer
                </div>
                <div className="text-sm text-[var(--green-700)] whitespace-pre-wrap">
                  {getCorrectText(q.correctAnswer)}
                </div>
              </div>
            )}
          </div>
        )}

        {t === "QUESTION_GROUP" && <ReviewQuestionGroup q={q} />}
      </div>

      {q.feedback && (
        <div className="mt-3 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-default)] p-3">
          <div className="mb-1 text-xs font-medium text-(--color-text-muted)">
            Teacher feedback
          </div>
          <div className="text-sm text-(--color-text-default)">
            {q.feedback}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── TestReviewView ───────────────────────────────────────────────────────────

interface TestReviewViewProps {
  studentAssessmentId: number;
  assessmentId: number;
}

interface OrderedQuestion {
  section: { sectionId: number; name: string; instructions: string | null };
  question: ApiReviewQuestion;
  globalIndex: number;
}

export const TestReviewView = ({
  studentAssessmentId,
  assessmentId,
}: TestReviewViewProps) => {
  const [scoreOpen, setScoreOpen] = useState(false);

  const { data: preview, isLoading: previewLoading } =
    useGetAssessmentPreview(assessmentId);
  const { data: reviewData, isLoading: reviewLoading } =
    useGetStudentAttemptReview(studentAssessmentId);
  const { data: resultData } = useGetStudentResult(studentAssessmentId);

  const orderedQuestions = useMemo<OrderedQuestion[]>(() => {
    const out: OrderedQuestion[] = [];
    let idx = 0;
    for (const section of reviewData?.data?.sections ?? []) {
      for (const question of section.questions ?? []) {
        out.push({ section, question, globalIndex: idx++ });
      }
    }
    return out;
  }, [reviewData]);

  if (previewLoading || reviewLoading) {
    return (
      <div className="flex justify-center px-6 py-12">
        <Loader2 className="h-5 w-5 animate-spin text-(--color-icon-default-muted)" />
      </div>
    );
  }

  const p = preview?.data;
  const sections = reviewData?.data?.sections ?? [];
  const uiStatus = apiStatusToUi(p?.attemptStatus);
  const feedbacks = orderedQuestions
    .map((oq) => oq.question.feedback)
    .filter((f): f is string => !!f);

  return (
    <div className="flex h-screen flex-col bg-[var(--color-bg-default)]">
      {/* ─── Header ─── */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-4 md:px-6">
        <div className="flex flex-col">
          <span className="text-base font-semibold text-(--color-text-default)">
            {p?.name ?? "—"}
          </span>
          {p?.subjectName && (
            <span className="text-sm text-(--color-text-muted)">
              {p.subjectName}
            </span>
          )}
        </div>
        <Button
          className="bg-bg-state-primary text-text-white-default"
          variant="outline"
          size="sm"
          onClick={() => setScoreOpen(true)}
        >
          View Test Score
        </Button>
      </header>

      <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
        {/* ─── Sidebar ─── */}
        <aside className="hidden md:flex md:flex-col md:w-[200px] shrink-0 border-r border-[var(--color-border-default)] bg-[var(--color-bg-card)] px-4 py-4 overflow-y-auto">
          <div className="text-xs font-medium text-[var(--color-text-muted)]">
            Question Navigator
          </div>
          {sections.map((section) => (
            <div key={section.sectionId} className="mt-4">
              <div className="text-xs font-medium text-[var(--blue-600)]">
                {section.name}
              </div>
              <div className="mt-2 grid grid-cols-4 gap-1.5">
                {orderedQuestions
                  .filter((oq) => oq.section.sectionId === section.sectionId)
                  .map(({ question, globalIndex }) => (
                    <button
                      key={question.assessmentQuestionId}
                      type="button"
                      onClick={() =>
                        document
                          .getElementById(
                            `question-${question.assessmentQuestionId}`,
                          )
                          ?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          })
                      }
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-md text-xs font-medium",
                        question.isCorrect === true
                          ? "bg-[var(--color-bg-badge-green)] text-[var(--green-700)]"
                          : question.isCorrect === false
                            ? "bg-[var(--color-bg-badge-red)] text-[var(--red-700)]"
                            : "bg-[var(--color-bg-subtle)] text-[var(--color-text-subtle)]",
                      )}
                    >
                      {globalIndex + 1}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </aside>

        {/* ─── Main content ─── */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
          <div className="mx-auto max-w-3xl space-y-8">
            {sections.map((section) => {
              const sectionQuestions = orderedQuestions.filter(
                (oq) => oq.section.sectionId === section.sectionId,
              );
              return (
                <div key={section.sectionId}>
                  <div className="mb-4">
                    <h2 className="text-base font-semibold text-(--color-text-default)">
                      {section.name}
                    </h2>
                    {section.instructions && (
                      <p className="mt-1 text-sm text-(--color-text-muted)">
                        {section.instructions}
                      </p>
                    )}
                  </div>
                  <div className="space-y-4">
                    {sectionQuestions.map(({ question, globalIndex }) => (
                      <div
                        key={question.assessmentQuestionId}
                        id={`question-${question.assessmentQuestionId}`}
                      >
                        <ReviewQuestionCard
                          q={question}
                          globalIdx={globalIndex}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      <Modal open={scoreOpen} setOpen={setScoreOpen} showFooter={false}>
        {/* Green hero */}
        <div className="flex flex-col items-center gap-3 rounded-t-xl bg-[var(--color-bg-badge-green)] px-8 py-10">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/60">
            <Award className="h-10 w-10 text-[var(--green-600)]" />
          </div>
          <div className="text-center">
            <span className="text-5xl font-bold text-(--color-text-default)">
              {resultData?.score ?? "—"}
            </span>
            <span className="text-2xl text-(--color-text-muted)">
              /{resultData?.totalMarks ?? p?.totalMarks ?? "—"}
            </span>
          </div>
          <p className="text-base font-semibold text-(--color-text-default)">
            {p?.name} Score
          </p>
        </div>

        {/* Teacher feedback */}
        {feedbacks.length > 0 && (
          <div className="px-6 py-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-(--color-text-muted)">
              Teacher&apos;s Feedback
            </p>
            <div className="space-y-2">
              {feedbacks.map((fb, i) => (
                <p
                  key={i}
                  className="text-sm italic text-(--color-text-default)"
                >
                  &ldquo;{fb}&rdquo;
                </p>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
