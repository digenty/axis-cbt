"use client";

import Link from "next/link";
import {
  Clock,
  FileText,
  Calendar,
  RotateCcw,
  Play,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import type { StudentAssessmentCard } from "@/types/students";
import { cn } from "@/lib/utils";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SUBJECT_COLORS: Record<string, string> = {
  blue: "text-blue-600",
  green: "text-green-600",
  purple: "text-purple-600",
  amber: "text-amber-600",
  indigo: "text-indigo-600",
};

const STATUS_BADGE: Record<string, string> = {
  "in-progress": "bg-blue-50 text-blue-700",
  "not-started": "bg-gray-100 text-gray-500",
  scheduled: "bg-gray-100 text-gray-500",
  graded: "bg-green-50 text-green-700",
  submitted: "bg-blue-50 text-blue-700",
  missed: "bg-red-50 text-red-600",
};

const STATUS_LABEL: Record<string, string> = {
  "in-progress": "In Progress",
  "not-started": "Not Started",
  scheduled: "Scheduled",
  graded: "Graded",
  submitted: "Submitted",
  missed: "Missed",
};

function formatSchedule(iso: string) {
  try {
    return format(new Date(iso), "d MMM yyyy, h:mm a");
  } catch {
    return iso;
  }
}

// ─── Completed card body ──────────────────────────────────────────────────────

const GradedBody = ({
  score,
  totalMarks,
}: {
  score: number;
  totalMarks: number;
}) => (
  <div className="mb-4 flex items-center gap-3 rounded-xl border border-green-100 bg-green-50 px-4 py-3">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-green-400 bg-white">
      <CheckCircle2 className="h-4 w-4 text-green-500" />
    </div>
    <div>
      <p className="text-sm font-semibold text-green-800">
        {score} / {totalMarks}
      </p>
      <p className="text-xs text-green-600">Score</p>
    </div>
  </div>
);

const SubmittedBody = () => (
  <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
    <p className="text-xs text-amber-700">
      Your teacher is grading this assessment
    </p>
  </div>
);

const MissedBody = () => (
  <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
    <div>
      <p className="text-xs font-medium text-red-700">Test Closed</p>
      <p className="text-xs text-red-500">This test is no longer available</p>
    </div>
  </div>
);

// ─── Action buttons ───────────────────────────────────────────────────────────

const ActionButton = ({ card }: { card: StudentAssessmentCard }) => {
  const base =
    "flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-colors";

  if (card.status === "in-progress") {
    const sid = card.studentAssessmentId;
    return (
      <Link
        href={`/students/${card.id}/take${sid ? `?sid=${sid}` : ""}`}
        className={cn(
          base,
          "border border-gray-200 text-gray-700 hover:bg-gray-50",
        )}
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Resume Test
      </Link>
    );
  }
  if (card.status === "not-started") {
    return (
      <Link
        href={`/students/${card.id}`}
        className={cn(base, "bg-blue-600 text-white hover:bg-blue-700")}
      >
        <Play className="h-3.5 w-3.5" />
        Start Test
      </Link>
    );
  }
  if (card.status === "scheduled") {
    return (
      <button
        disabled
        className={cn(
          base,
          "border border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed",
        )}
      >
        Not Open
      </button>
    );
  }
  if (card.status === "graded") {
    return (
      <Link
        href={`/students/${card.id}`}
        className={cn(
          base,
          "border border-gray-200 text-gray-700 hover:bg-gray-50",
        )}
      >
        View Result
      </Link>
    );
  }
  if (card.status === "submitted") {
    return (
      <Link
        href={`/students/${card.id}`}
        className={cn(
          base,
          "border border-gray-200 text-gray-700 hover:bg-gray-50",
        )}
      >
        View Submission
      </Link>
    );
  }
  // missed
  return (
    <Link
      href={`/students/${card.id}`}
      className={cn(
        base,
        "border border-gray-200 text-gray-700 hover:bg-gray-50",
      )}
    >
      View Details
    </Link>
  );
};

// ─── Card ─────────────────────────────────────────────────────────────────────

export const AssessmentCard = ({ card }: { card: StudentAssessmentCard }) => (
  <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
    {/* Header */}
    <div className="mb-2 flex items-center justify-between">
      <span
        className={cn(
          "text-xs font-semibold",
          SUBJECT_COLORS[card.subjectColor] ?? "text-blue-600",
        )}
      >
        {card.subject}
      </span>
      <span
        className={cn(
          "rounded-full px-2 py-0.5 text-xs font-medium",
          STATUS_BADGE[card.status],
        )}
      >
        {STATUS_LABEL[card.status]}
      </span>
    </div>

    {/* Title */}
    <p className="mb-3 text-sm font-semibold text-gray-900">{card.title}</p>

    {/* Meta */}
    <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
      <span className="flex items-center gap-1">
        <Clock className="h-3 w-3" />
        {card.durationMinutes} mins
      </span>
      <span className="flex items-center gap-1">
        <FileText className="h-3 w-3" />
        {card.questionsCount} Questions
      </span>
      <span className="flex items-center gap-1">
        <Calendar className="h-3 w-3" />
        {formatSchedule(card.scheduledAt)}
      </span>
    </div>

    {/* Completed state body */}
    {card.status === "graded" &&
      card.score !== undefined &&
      card.totalMarks !== undefined && (
        <GradedBody score={card.score} totalMarks={card.totalMarks} />
      )}
    {card.status === "submitted" && <SubmittedBody />}
    {card.status === "missed" && <MissedBody />}

    {/* Action */}
    <div className="mt-auto">
      <ActionButton card={card} />
    </div>
  </div>
);
