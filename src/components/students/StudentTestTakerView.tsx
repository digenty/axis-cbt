"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import {
  useGetAssessmentPaper,
  useSubmitAnswer,
  useSubmitAssessment,
} from "@/hooks/queryHooks/useStudentCBT";
import { QuestionNavigator } from "./QuestionNavigator";
import { QuestionRenderer } from "./QuestionRenderer";
import { SubmitTestModal } from "./SubmitTestModal";
import type {
  ApiStudentSection,
  ApiStudentQuestion,
  ApiStudentOption,
  ApiMatchLeftItem,
  ApiMatchRightItem,
} from "@/types/student-api";
import type {
  TakerSection,
  TakerQuestion,
  AnswerMap,
  AnswerValue,
} from "@/types/students";

// ─── Mapping helpers ──────────────────────────────────────────────────────────

function mapOptions(
  opts: ApiStudentOption[],
): { label: string; text: string }[] {
  return opts
    .sort((a, b) => a.optionOrder - b.optionOrder)
    .map((o) => ({ label: o.optionLabel, text: o.optionText }));
}

function mapQuestion(q: ApiStudentQuestion): TakerQuestion {
  const id = String(q.assessmentQuestionId);
  const text = q.questionHtml ?? q.questionText;
  const marks = q.marks;
  const td = q.typeData as Record<string, unknown> | null | undefined;

  switch (q.questionType) {
    case "MULTIPLE_CHOICE": {
      const opts = (td?.options as ApiStudentOption[] | undefined) ?? [];
      return {
        id,
        text,
        marks,
        type: "multiple-choice",
        options: mapOptions(opts),
      };
    }
    case "MULTIPLE_ANSWERS": {
      const opts = (td?.options as ApiStudentOption[] | undefined) ?? [];
      return {
        id,
        text,
        marks,
        type: "multiple-answers",
        options: mapOptions(opts),
      };
    }
    case "TRUE_FALSE":
      return { id, text, marks, type: "true-false" };
    case "ESSAY":
      return { id, text, marks, type: "essay" };
    case "SHORT_ANSWER":
    case "NUMERICAL":
      return { id, text, marks, type: "short-answer" };
    case "MATCHING": {
      const lefts = (td?.leftItems as ApiMatchLeftItem[] | undefined) ?? [];
      const rights = (td?.rightItems as ApiMatchRightItem[] | undefined) ?? [];
      const choices = ["Select", ...rights.map((r) => r.matchText)];
      const pairs = lefts
        .sort((a, b) => a.itemOrder - b.itemOrder)
        .map((l) => ({ id: String(l.pairId), left: l.itemText, choices }));
      return { id, text, marks, type: "match", pairs };
    }
    default:
      return { id, text, marks, type: "short-answer" };
  }
}

function mapSection(sec: ApiStudentSection): TakerSection {
  return {
    id: String(sec.sectionId),
    title: sec.name,
    questions: sec.questions.map(mapQuestion),
  };
}

// ─── Timer ────────────────────────────────────────────────────────────────────

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const StudentTestTakerView = ({
  assessmentId,
  studentAssessmentId,
}: {
  assessmentId: string;
  studentAssessmentId: number | null;
}) => {
  const router = useRouter();
  const { data: paper, isLoading } = useGetAssessmentPaper(
    studentAssessmentId ?? 0,
  );
  const { mutate: submitAnswer } = useSubmitAnswer();
  const { mutate: submitAssessment, isPending: submitting } =
    useSubmitAssessment();

  const sections: TakerSection[] = (paper?.sections ?? []).map(mapSection);
  const durationSeconds =
    paper?.timeRemainingSeconds ?? (paper?.durationMinutes ?? 0) * 60;

  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [sectionIdx, setSectionIdx] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [submitOpen, setSubmitOpen] = useState(false);

  // Sync timer when paper loads
  useEffect(() => {
    if (durationSeconds > 0) setTimeLeft(durationSeconds);
  }, [durationSeconds]);

  const handleSubmit = useCallback(() => {
    if (!studentAssessmentId) {
      router.push(`/students/${assessmentId}`);
      return;
    }
    submitAssessment(studentAssessmentId, {
      onSuccess: () => router.push(`/students/${assessmentId}`),
      onError: () => router.push(`/students/${assessmentId}`),
    });
  }, [studentAssessmentId, assessmentId, submitAssessment, router]);

  // Countdown timer
  useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paper]);

  const pendingAnswers = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  const setAnswer = useCallback(
    (questionId: string, value: AnswerValue) => {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));

      if (!studentAssessmentId) return;

      // Debounce per question to avoid flooding the API on text input
      const existing = pendingAnswers.current.get(questionId);
      if (existing) clearTimeout(existing);
      const t = setTimeout(() => {
        pendingAnswers.current.delete(questionId);
        submitAnswer({
          studentAssessmentId,
          assessmentQuestionId: Number(questionId),
          answerData: value,
        });
      }, 800);
      pendingAnswers.current.set(questionId, t);
    },
    [studentAssessmentId, submitAnswer],
  );

  const currentSection = sections[sectionIdx];
  const isFirst = sectionIdx === 0;
  const isLast = sectionIdx === sections.length - 1;
  const totalQuestions = sections.reduce(
    (s, sec) => s + sec.questions.length,
    0,
  );
  const answeredCount = Object.keys(answers).length;

  const handleJump = (secIdx: number, _qIdx: number) => setSectionIdx(secIdx);
  const isComprehension =
    currentSection?.isComprehension || currentSection?.isImageBased;

  if (isLoading || !paper) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-sm text-gray-400">Loading assessment…</div>
      </div>
    );
  }

  if (!currentSection) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-sm text-gray-400">No questions available</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
        <p className="text-sm font-semibold text-gray-900">
          {paper.assessmentName}
        </p>
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-semibold ${timeLeft < 300 ? "border-red-200 bg-red-50 text-red-600" : "border-gray-200 text-gray-700"}`}
          >
            ⏱ {formatTime(timeLeft)}
          </div>
          <button
            onClick={() => setSubmitOpen(true)}
            className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Submit Test
          </button>
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────────────────── */}
      <div className="flex min-h-0 flex-1">
        <QuestionNavigator
          sections={sections}
          answers={answers}
          currentSectionIdx={sectionIdx}
          onJump={handleJump}
        />

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="border-b border-gray-100 bg-white px-6 py-4">
            <h2 className="text-base font-bold text-gray-900">
              {currentSection.title}
            </h2>
            {currentSection.passage === undefined &&
              !currentSection.isImageBased && (
                <p className="mt-0.5 text-xs text-gray-400">
                  Answer all questions in this section
                </p>
              )}
          </div>

          {isComprehension ? (
            <div className="flex min-h-0 flex-1 overflow-hidden">
              <div className="flex w-1/2 shrink-0 flex-col overflow-y-auto border-r border-gray-100 bg-white px-6 py-5">
                {currentSection.isImageBased ? (
                  <div className="flex h-52 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8" />
                      <span className="text-sm">Image-based section</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Passage
                    </p>
                    <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
                      {currentSection.passage}
                    </p>
                  </>
                )}
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5">
                <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Answer the following questions
                </p>
                <div className="space-y-4">
                  {currentSection.questions.map((q, idx) => {
                    const globalNum =
                      sections
                        .slice(0, sectionIdx)
                        .reduce((s, sec) => s + sec.questions.length, 0) +
                      idx +
                      1;
                    return (
                      <QuestionRenderer
                        key={q.id}
                        question={q}
                        number={globalNum}
                        answer={answers[q.id]}
                        onAnswer={(val) => setAnswer(q.id, val)}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="mx-auto max-w-2xl space-y-4">
                {currentSection.questions.map((q, idx) => {
                  const globalNum =
                    sections
                      .slice(0, sectionIdx)
                      .reduce((s, sec) => s + sec.questions.length, 0) +
                    idx +
                    1;
                  return (
                    <QuestionRenderer
                      key={q.id}
                      question={q}
                      number={globalNum}
                      answer={answers[q.id]}
                      onAnswer={(val) => setAnswer(q.id, val)}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Footer ──────────────────────────────────────────── */}
          <div className="flex h-14 shrink-0 items-center justify-between border-t border-gray-100 bg-white px-6">
            <button
              onClick={() => setSectionIdx((i) => i - 1)}
              disabled={isFirst}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-30"
            >
              Previous Section
            </button>

            <span className="text-xs text-gray-400">
              Section {sectionIdx + 1} of {sections.length},{" "}
              <span className="font-medium text-gray-600">
                {answeredCount}/{totalQuestions} answered
              </span>
            </span>

            {isLast ? (
              <button
                onClick={() => setSubmitOpen(true)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Submit Test
              </button>
            ) : (
              <button
                onClick={() => setSectionIdx((i) => i + 1)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Next Section
              </button>
            )}
          </div>
        </div>
      </div>

      {submitOpen && (
        <SubmitTestModal
          onClose={() => setSubmitOpen(false)}
          onConfirm={handleSubmit}
          submitting={submitting}
        />
      )}
    </div>
  );
};
