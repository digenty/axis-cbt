"use client";

import { Star } from "lucide-react";
import { StudentHeader } from "./StudentHeader";
import { StudentProfileBanner } from "./StudentProfileBanner";
import { AssessmentCard } from "./AssessmentCard";
import { useGetStudentDashboard } from "@/hooks/queryHooks/useStudentCBT";
import type {
  ApiStudentAssessmentItem,
  AttemptStatus,
} from "@/types/student-api";
import type {
  StudentAssessmentCard,
  StudentAssessmentStatus,
} from "@/types/students";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SUBJECT_COLORS = ["blue", "green", "purple", "amber", "indigo"] as const;
type SubjectColor = (typeof SUBJECT_COLORS)[number];

function colorForSubject(name: string): SubjectColor {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
  return SUBJECT_COLORS[Math.abs(hash) % SUBJECT_COLORS.length];
}

function mapStatus(
  s: AttemptStatus | null,
  category: "active" | "upcoming" | "completed",
): StudentAssessmentStatus {
  if (category === "upcoming") return "scheduled";
  if (!s) return "not-started";
  if (s === "IN_PROGRESS") return "in-progress";
  if (s === "PENDING") return "submitted";
  if (s === "COMPLETED") return "graded";
  return "missed";
}

function mapItem(
  item: ApiStudentAssessmentItem,
  category: "active" | "upcoming" | "completed",
): StudentAssessmentCard {
  return {
    id: String(item.assessmentId),
    studentAssessmentId:
      item.studentAssessmentId != null
        ? String(item.studentAssessmentId)
        : undefined,
    subject: item.subjectName,
    subjectColor: colorForSubject(item.subjectName),
    title: item.name,
    status: mapStatus(item.attemptStatus, category),
    durationMinutes: item.durationMinutes,
    questionsCount: item.questionCount,
    scheduledAt: item.startDateTime,
    score: item.score ?? undefined,
    totalMarks: item.totalMarks,
  };
}

// ─── Section header ───────────────────────────────────────────────────────────

const SectionHeader = ({ title, count }: { title: string; count: number }) => (
  <div className="mb-4 flex items-center gap-2">
    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
    <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
      {count}
    </span>
  </div>
);

// ─── Grid layouts ─────────────────────────────────────────────────────────────

const TwoColGrid = ({ cards }: { cards: StudentAssessmentCard[] }) => (
  <div className="grid grid-cols-2 gap-4">
    {cards.map((c) => (
      <AssessmentCard key={c.id} card={c} />
    ))}
  </div>
);

const ThreeColGrid = ({ cards }: { cards: StudentAssessmentCard[] }) => (
  <div className="grid grid-cols-3 gap-4">
    {cards.map((c) => (
      <AssessmentCard key={c.id} card={c} />
    ))}
  </div>
);

const CardSkeleton = () => (
  <div className="h-48 animate-pulse rounded-xl border border-gray-100 bg-white" />
);

// ─── View ─────────────────────────────────────────────────────────────────────

export const StudentDashboardView = () => {
  const { data, isLoading } = useGetStudentDashboard();

  const active = (data?.activeAssessments ?? []).map((i) =>
    mapItem(i, "active"),
  );
  const upcoming = (data?.upcomingAssessments ?? []).map((i) =>
    mapItem(i, "upcoming"),
  );
  const completed = (data?.completedAssessments ?? []).map((i) =>
    mapItem(i, "completed"),
  );

  const profile = data
    ? {
        name: data.studentName,
        admissionNumber: "",
        className: data.armDisplay,
        academicYear: "",
        currentTerm: "",
      }
    : null;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <StudentHeader />

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
        {profile && <StudentProfileBanner profile={profile} />}

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            {active.length > 0 && (
              <section className="mb-8">
                <SectionHeader
                  title="Active Assessments"
                  count={active.length}
                />
                <TwoColGrid cards={active} />
              </section>
            )}

            {upcoming.length > 0 && (
              <section className="mb-8">
                <SectionHeader
                  title="Upcoming Assessments"
                  count={upcoming.length}
                />
                <TwoColGrid cards={upcoming} />
              </section>
            )}

            {completed.length > 0 && (
              <section>
                <SectionHeader
                  title="Completed Assessments"
                  count={completed.length}
                />
                <ThreeColGrid cards={completed} />
              </section>
            )}

            {active.length === 0 &&
              upcoming.length === 0 &&
              completed.length === 0 && (
                <div className="rounded-xl border border-gray-100 bg-white py-16 text-center text-sm text-gray-400">
                  No assessments available
                </div>
              )}
          </>
        )}
      </main>
    </div>
  );
};
