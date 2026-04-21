"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  BookOpen,
  Clock,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import { StudentHeader } from "./StudentHeader";
import {
  useGetAssessmentPreview,
  useGetStudentResult,
  useStartAssessment,
} from "@/hooks/queryHooks/useStudentCBT";
import type { AttemptStatus } from "@/types/student-api";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const RESULT_STATUSES: AttemptStatus[] = [
  "COMPLETED",
  "PENDING",
  "TIMED_OUT",
  "ABSENT",
];

// ─── Info card ────────────────────────────────────────────────────────────────

const InfoCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex flex-col gap-1.5 border-r border-gray-100 px-6 last:border-r-0">
    <div className="flex items-center gap-1.5 text-xs text-gray-400">
      {icon}
      {label}
    </div>
    <p className="text-sm font-semibold text-gray-900">{value}</p>
  </div>
);

// ─── Pre-test view ────────────────────────────────────────────────────────────

const PreTestView = ({
  assessmentId,
  studentAssessmentId,
  title,
  totalMarks,
  className,
  subjectName,
  durationMinutes,
  questionCount,
  instructions,
  isInProgress,
}: {
  assessmentId: number;
  studentAssessmentId: number | null;
  title: string;
  totalMarks: number;
  className: string;
  subjectName: string;
  durationMinutes: number;
  questionCount: number;
  instructions: string | null;
  isInProgress: boolean;
}) => {
  const router = useRouter();
  const { mutate: startAssessment, isPending } = useStartAssessment();
  const [error, setError] = useState<string | null>(null);

  const handleBegin = () => {
    setError(null);
    startAssessment(
      { assessmentId },
      {
        onSuccess: (result) => {
          router.push(`/students/${assessmentId}/take?sid=${result.id}`);
        },
        onError: () => {
          setError("Failed to start assessment. Please try again.");
        },
      },
    );
  };

  const defaultNotes = [
    "Once you start the assessment, the timer will begin automatically",
    "You cannot pause the test once started",
    "Make sure you have a stable internet connection",
    "If you run out of time, the test is automatically submitted",
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="mb-2 text-xl font-bold text-gray-900">{title}</h1>
        <span className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
          {totalMarks} marks
        </span>
      </div>

      <div className="mb-6 flex overflow-hidden rounded-xl border border-gray-200 bg-white">
        <InfoCard
          icon={<Building2 className="h-3.5 w-3.5" />}
          label="Class"
          value={className}
        />
        <InfoCard
          icon={<BookOpen className="h-3.5 w-3.5" />}
          label="Subject"
          value={subjectName}
        />
        <InfoCard
          icon={<Clock className="h-3.5 w-3.5" />}
          label="Duration"
          value={`${durationMinutes} minutes`}
        />
        <InfoCard
          icon={<FileText className="h-3.5 w-3.5" />}
          label="Questions"
          value={String(questionCount)}
        />
      </div>

      {instructions && (
        <div className="mb-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-3">
            <FileText className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-semibold text-gray-800">
              Instructions
            </span>
          </div>
          <div className="px-5 py-4 text-sm text-gray-700">
            <p dangerouslySetInnerHTML={{ __html: instructions }} />
          </div>
        </div>
      )}

      <div className="mb-8 rounded-xl border border-amber-100 bg-amber-50 px-5 py-4">
        <div className="mb-2 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <span className="text-sm font-semibold text-amber-700">
            Important Notes
          </span>
        </div>
        <ul className="space-y-1.5 text-xs text-amber-800">
          {defaultNotes.map((note, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-500" />
              {note}
            </li>
          ))}
        </ul>
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex justify-end">
        {isInProgress && studentAssessmentId ? (
          <Link
            href={`/students/${assessmentId}/take?sid=${studentAssessmentId}`}
            className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Resume Assessment
          </Link>
        ) : (
          <button
            onClick={handleBegin}
            disabled={isPending}
            className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
          >
            {isPending ? "Starting…" : "Begin Assessment"}
          </button>
        )}
      </div>
    </>
  );
};

// ─── Result states ────────────────────────────────────────────────────────────

const GradedView = ({
  title,
  score,
  totalMarks,
}: {
  title: string;
  score: number;
  totalMarks: number;
}) => (
  <div className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white py-10">
    <div className="mb-4 flex h-20 w-20 flex-col items-center justify-center rounded-full border-4 border-green-400 bg-green-50">
      <span className="text-2xl font-bold text-green-700">{score}</span>
      <span className="text-xs text-green-600">/{totalMarks}</span>
    </div>
    <p className="text-base font-semibold text-gray-900">{title} Score</p>
  </div>
);

const SubmittedView = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white py-16">
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-xl font-bold text-purple-600">
      <MessageSquare className="h-6 w-6" />
    </div>
    <h2 className="mb-2 text-lg font-bold text-gray-900">Awaiting Result</h2>
    <p className="max-w-sm text-center text-sm text-gray-500">
      Your answers have been submitted successfully. Your teacher is reviewing
      your answer for <span className="font-medium">{title}</span>.
    </p>
  </div>
);

const MissedView = () => (
  <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-12">
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
        <XCircle className="h-8 w-8 text-red-500" />
      </div>
      <h2 className="mb-2 text-base font-bold text-red-800">
        Test Window Closed
      </h2>
      <p className="mb-6 max-w-sm text-sm text-red-600">
        This test is no longer available. You did not complete this test within
        the scheduled window. Please contact your teacher if you believe this
        was an error.
      </p>
      <button className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50">
        <CheckCircle2 className="h-4 w-4" />
        Contact Teacher
      </button>
    </div>
  </div>
);

const MetaStrip = ({
  durationMinutes,
  questionCount,
}: {
  durationMinutes: number;
  questionCount: number;
}) => (
  <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-gray-400">
    <span className="flex items-center gap-1.5">
      <Clock className="h-3.5 w-3.5" />
      {durationMinutes} mins
    </span>
    <span className="flex items-center gap-1.5">
      <FileText className="h-3.5 w-3.5" />
      {questionCount} Questions
    </span>
  </div>
);

// ─── Loading skeleton ─────────────────────────────────────────────────────────

const LoadingSkeleton = () => (
  <div className="space-y-4">
    <div className="h-8 w-1/2 animate-pulse rounded-lg bg-gray-100" />
    <div className="h-24 animate-pulse rounded-xl bg-gray-100" />
    <div className="h-48 animate-pulse rounded-xl bg-gray-100" />
  </div>
);

// ─── View ─────────────────────────────────────────────────────────────────────

export const StudentAssessmentDetailView = ({
  assessmentId,
}: {
  assessmentId: string;
}) => {
  const numId = Number(assessmentId);
  const { data: preview, isLoading, isError } = useGetAssessmentPreview(numId);

  const isResultState =
    preview?.attemptStatus != null &&
    RESULT_STATUSES.includes(preview.attemptStatus);

  const { data: result } = useGetStudentResult(
    isResultState ? (preview?.studentAssessmentId ?? 0) : 0,
  );

  const statusLabel =
    preview?.attemptStatus === "COMPLETED"
      ? "Completed"
      : preview?.attemptStatus === "PENDING"
        ? "Submitted"
        : preview?.attemptStatus === "TIMED_OUT" ||
            preview?.attemptStatus === "ABSENT"
          ? "Missed"
          : null;

  const statusClass =
    preview?.attemptStatus === "COMPLETED"
      ? "bg-green-50 text-green-700"
      : preview?.attemptStatus === "PENDING"
        ? "bg-blue-50 text-blue-700"
        : "bg-red-50 text-red-600";

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <StudentHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8">
        <Link
          href="/students"
          className="mb-6 flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-800"
        >
          <ArrowLeft className="h-4 w-4" />
          {isResultState ? "Back to Dashboard" : "Go Back"}
        </Link>

        {isLoading ? (
          <LoadingSkeleton />
        ) : isError || !preview ? (
          <div className="rounded-xl border border-gray-200 bg-white py-16 text-center text-sm text-gray-400">
            Assessment not found
          </div>
        ) : isResultState ? (
          <>
            <div className="mb-6 text-center">
              <h1 className="mb-1 text-lg font-bold text-gray-900">
                {preview.name}
              </h1>
              <p className="mb-3 text-sm text-gray-400">
                {preview.subjectName}
              </p>
              {statusLabel && (
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
                >
                  {statusLabel}
                </span>
              )}
            </div>

            {preview.attemptStatus === "COMPLETED" && result ? (
              <GradedView
                title={preview.name}
                score={result.score}
                totalMarks={result.totalMarks}
              />
            ) : preview.attemptStatus === "PENDING" ? (
              <SubmittedView title={preview.name} />
            ) : (
              <MissedView />
            )}

            <MetaStrip
              durationMinutes={preview.durationMinutes}
              questionCount={preview.questionCount}
            />
          </>
        ) : (
          <PreTestView
            assessmentId={numId}
            studentAssessmentId={preview.studentAssessmentId}
            title={preview.name}
            totalMarks={preview.totalMarks}
            className={preview.className}
            subjectName={preview.subjectName}
            durationMinutes={preview.durationMinutes}
            questionCount={preview.questionCount}
            instructions={preview.instructions}
            isInProgress={preview.attemptStatus === "IN_PROGRESS"}
          />
        )}
      </main>
    </div>
  );
};
