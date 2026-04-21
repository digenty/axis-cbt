"use client";

import { BookOpen, GraduationCap, BarChart3, Users } from "lucide-react";
import { useGetCbtOverview } from "@/hooks/queryHooks/useCbtOverview";
import { useGetMyAssessments } from "@/hooks/queryHooks/useCbtOverview";
import Link from "next/link";

// ─── Stat card ────────────────────────────────────────────────────────────────

const StatCard = ({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
}) => (
  <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${color}`}
    >
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  </div>
);

// ─── Arm card ─────────────────────────────────────────────────────────────────

const ArmCard = ({
  displayName,
  subjectCount,
  classId,
  branchId,
}: {
  displayName: string;
  subjectCount: number;
  classId: number;
  branchId: number;
}) => (
  <Link
    href={`/classes/${classId}`}
    className="flex flex-col gap-2 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
  >
    <p className="text-sm font-semibold text-gray-900">{displayName}</p>
    <div className="flex items-center gap-1.5 text-xs text-gray-400">
      <BookOpen className="h-3.5 w-3.5" />
      {subjectCount} subject{subjectCount !== 1 ? "s" : ""}
    </div>
  </Link>
);

// ─── Assessment status badge ──────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-600",
  PUBLISHED: "bg-green-50 text-green-700",
  ONGOING: "bg-blue-50 text-blue-700",
  COMPLETED: "bg-purple-50 text-purple-700",
  ARCHIVED: "bg-yellow-50 text-yellow-700",
};

// ─── View ─────────────────────────────────────────────────────────────────────

export const DashboardView = () => {
  const { data: overview, isLoading: loadingOverview } = useGetCbtOverview();
  const { data: myAssessments, isLoading: loadingAssessments } =
    useGetMyAssessments();

  const publishedCount =
    myAssessments?.filter((a) => a.status === "PUBLISHED").length ?? 0;
  const draftCount =
    myAssessments?.filter((a) => a.status === "DRAFT").length ?? 0;

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          CBT overview across all classes and subjects
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={<GraduationCap className="h-5 w-5 text-blue-600" />}
          label="Total Classes"
          value={loadingOverview ? "—" : (overview?.totalClasses ?? 0)}
          color="bg-blue-50"
        />
        <StatCard
          icon={<BookOpen className="h-5 w-5 text-indigo-600" />}
          label="Total Subjects"
          value={loadingOverview ? "—" : (overview?.totalSubjects ?? 0)}
          color="bg-indigo-50"
        />
        <StatCard
          icon={<BarChart3 className="h-5 w-5 text-green-600" />}
          label="Published Tests"
          value={loadingAssessments ? "—" : publishedCount}
          color="bg-green-50"
        />
        <StatCard
          icon={<Users className="h-5 w-5 text-amber-600" />}
          label="Draft Tests"
          value={loadingAssessments ? "—" : draftCount}
          color="bg-amber-50"
        />
      </div>

      {/* Class arms grid */}
      <div className="mb-6">
        <h2 className="mb-3 text-sm font-semibold text-gray-700">Class Arms</h2>
        {loadingOverview ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-xl border border-gray-100 bg-gray-100"
              />
            ))}
          </div>
        ) : overview?.arms.length === 0 ? (
          <div className="rounded-xl border border-gray-100 bg-white py-10 text-center text-sm text-gray-400">
            No class arms found
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {overview?.arms.map((arm) => (
              <ArmCard
                key={arm.armId}
                displayName={arm.displayName}
                subjectCount={arm.subjectCount}
                classId={arm.classId}
                branchId={arm.branchId}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recent assessments */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700">
            My Assessments
          </h2>
          <Link
            href="/results"
            className="text-xs font-medium text-blue-600 hover:underline"
          >
            View all results →
          </Link>
        </div>

        {loadingAssessments ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-14 animate-pulse rounded-xl border border-gray-100 bg-gray-100"
              />
            ))}
          </div>
        ) : !myAssessments?.length ? (
          <div className="rounded-xl border border-gray-100 bg-white py-10 text-center text-sm text-gray-400">
            No assessments yet
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
            {myAssessments.slice(0, 8).map((a, i) => (
              <Link
                key={a.id}
                href={`/classes/${a.classId}/subjects/${a.subjectId}/assessments/${a.id}`}
                className={`flex items-center justify-between px-5 py-3.5 text-sm transition-colors hover:bg-gray-50 ${i > 0 ? "border-t border-gray-50" : ""}`}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-gray-900">{a.name}</p>
                  <p className="text-xs text-gray-400">
                    {a.className} · {a.subjectName}
                  </p>
                </div>
                <span
                  className={`ml-3 shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[a.status] ?? "bg-gray-100 text-gray-600"}`}
                >
                  {a.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
