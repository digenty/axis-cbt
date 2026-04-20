"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { mockTestAttempt } from "@/lib/mock-student-data";
import { QuestionNavigator } from "./QuestionNavigator";
import { QuestionRenderer } from "./QuestionRenderer";
import { SubmitTestModal } from "./SubmitTestModal";
import type { AnswerMap, AnswerValue } from "@/types/students";

// ─── Timer ────────────────────────────────────────────────────────────────────

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const StudentTestTakerView = ({
  assessmentId,
}: {
  assessmentId: string;
}) => {
  const router = useRouter();
  const attempt = mockTestAttempt;
  const sections = attempt.sections;

  const [timeLeft, setTimeLeft] = useState(attempt.durationSeconds);
  const [sectionIdx, setSectionIdx] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [submitOpen, setSubmitOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const currentSection = sections[sectionIdx];

  // ── Timer ────────────────────────────────────────────────────────────────

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
  }, []);

  // ── Answer helpers ───────────────────────────────────────────────────────

  const setAnswer = useCallback((questionId: string, value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  // ── Section nav ──────────────────────────────────────────────────────────

  const isFirst = sectionIdx === 0;
  const isLast = sectionIdx === sections.length - 1;

  // ── Total answered ───────────────────────────────────────────────────────

  const totalQuestions = sections.reduce(
    (s, sec) => s + sec.questions.length,
    0,
  );
  const answeredCount = Object.keys(answers).length;

  // ── Submit ───────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    setSubmitting(true);
    // In a real app: POST answers to API
    await new Promise((r) => setTimeout(r, 800));
    router.push(`/students/${assessmentId}`);
  };

  // ── Jump to question ─────────────────────────────────────────────────────

  const handleJump = (secIdx: number, _qIdx: number) => {
    setSectionIdx(secIdx);
  };

  // ── Layout helpers ───────────────────────────────────────────────────────

  const isComprehension =
    currentSection.isComprehension || currentSection.isImageBased;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
        <p className="text-sm font-semibold text-gray-900">{attempt.title}</p>
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
        {/* Navigator */}
        <QuestionNavigator
          sections={sections}
          answers={answers}
          currentSectionIdx={sectionIdx}
          onJump={handleJump}
        />

        {/* Main */}
        <div className="flex min-h-0 flex-1 flex-col">
          {/* Section header */}
          <div className="border-b border-gray-100 bg-white px-6 py-4">
            <h2 className="text-base font-bold text-gray-900">
              {currentSection.title}
            </h2>
            <p className="mt-0.5 text-xs text-gray-400">
              Instructions (optional)
            </p>
          </div>

          {/* Questions area */}
          {isComprehension ? (
            <div className="flex min-h-0 flex-1 overflow-hidden">
              {/* Passage / image */}
              <div className="flex w-1/2 shrink-0 flex-col overflow-y-auto border-r border-gray-100 bg-white px-6 py-5">
                {currentSection.isImageBased ? (
                  <>
                    <div className="mb-4 flex h-52 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="h-8 w-8" />
                        <span className="text-sm">Upload Image</span>
                      </div>
                    </div>
                    <p className="text-xs italic text-gray-400">
                      Instructions (optional)
                    </p>
                  </>
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

              {/* Questions */}
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

      {/* Submit modal */}
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
