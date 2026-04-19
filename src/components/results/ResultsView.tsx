"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  Download,
  ChevronDown,
  Check,
  MoreVertical,
  User,
  BarChart3,
} from "lucide-react";
import { useGetAssessments } from "@/hooks/queryHooks/useAssessment";
import {
  useGetAssessmentResults,
  useGetAssessmentStats,
} from "@/hooks/queryHooks/useAssessment";
import { useGetClassDetails } from "@/hooks/queryHooks/useSubjects";
import type {
  ApiAssessment,
  AssessmentStudentResult,
  StudentResultStatus,
} from "@/types/question";

// ─── Types ────────────────────────────────────────────────────────────────────

const STATUS_CFG: Record<
  StudentResultStatus,
  { label: string; className: string }
> = {
  IN_PROGRESS: {
    label: "In Progress",
    className: "bg-orange-50 text-orange-600 border-orange-200",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-green-50 text-green-600 border-green-200",
  },
  PENDING: {
    label: "Pending Grading",
    className: "bg-purple-50 text-purple-600 border-purple-200",
  },
  TIMED_OUT: {
    label: "Timed Out",
    className: "bg-red-50 text-red-600 border-red-200",
  },
  ABSENT: {
    label: "Absent",
    className: "bg-gray-100 text-gray-500 border-gray-200",
  },
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface ResultsViewProps {
  subjectId: number;
  classId: number;
  className: string;
  subjectName: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ResultsView = ({
  subjectId,
  classId,
  className,
  subjectName,
}: ResultsViewProps) => {
  const { data: classDetailsResponse } = useGetClassDetails(classId);
  const branchId = classDetailsResponse?.data?.branchId;

  const { data: assessmentsRes, isLoading: loadingAssessments } =
    useGetAssessments({
      classId,
      subjectId,
      branchId: branchId ?? 0,
    });

  const assessments = useMemo<ApiAssessment[]>(
    () => assessmentsRes?.data ?? [],
    [assessmentsRes],
  );

  const [selectedAssessmentId, setSelectedAssessmentId] = useState<
    number | null
  >(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  // Derive the active ID: user selection takes priority, otherwise default to first
  const effectiveSelectedId =
    selectedAssessmentId ?? assessments[0]?.id ?? null;

  // Close dropdown on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const selectedAssessment = assessments.find(
    (a) => a.id === effectiveSelectedId,
  );

  const { data: resultsRes, isLoading: loadingResults } =
    useGetAssessmentResults(effectiveSelectedId ?? 0);

  const { data: statsRes } = useGetAssessmentStats(effectiveSelectedId ?? 0);

  const results: AssessmentStudentResult[] = resultsRes?.data ?? [];
  const stats = statsRes?.data;

  // ── Loading / empty states ────────────────────────────────────────────────

  if (loadingAssessments || !classDetailsResponse) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 w-40 rounded-lg bg-gray-200" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-gray-100" />
          ))}
        </div>
        <div className="h-64 rounded-xl bg-gray-100" />
      </div>
    );
  }

  if (assessments.length === 0) {
    return (
      <div>
        <div className="mb-5 flex items-center gap-3">
          <h1 className="text-lg font-bold text-gray-900">Results</h1>
          <span className="text-sm text-gray-400">
            {className} • {subjectName}
          </span>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white py-20 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50">
            <BarChart3 className="h-6 w-6 text-purple-500" />
          </div>
          <p className="mb-1 text-sm font-medium text-gray-600">
            No results yet
          </p>
          <p className="max-w-xs text-xs text-gray-400">
            Results from completed assessments will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Title */}
      <div className="mb-5 flex items-center gap-3">
        <h1 className="text-lg font-bold text-gray-900">Results</h1>
        <span className="text-sm text-gray-400">
          {className} • {subjectName}
        </span>
      </div>

      {/* Filter row */}
      <div className="mb-5 flex items-center justify-between">
        <div className="relative" ref={dropRef}>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-50"
          >
            {selectedAssessment?.name ?? "Select assessment"}
            <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
          </button>
          {dropdownOpen && (
            <div className="absolute left-0 top-full z-30 mt-1 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-xl">
              {assessments.map((a) => (
                <button
                  key={a.id}
                  onClick={() => {
                    setSelectedAssessmentId(a.id);
                    setDropdownOpen(false);
                  }}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <span className="truncate">{a.name}</span>
                  {effectiveSelectedId === a.id && (
                    <Check className="ml-2 h-3.5 w-3.5 shrink-0 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <button className="flex items-center gap-1.5 rounded-lg border border-blue-200 px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50">
          <Download className="h-3.5 w-3.5" />
          Export Result
        </button>
      </div>

      {/* Stat cards */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        <StatCard
          icon="👥"
          color="blue"
          label="Total Students"
          value={stats?.totalStudents ?? results.length}
        />
        <StatCard
          icon="📊"
          color="amber"
          label="Average Score"
          value={
            stats?.averageScore ??
            (results.length > 0
              ? Math.round(
                  (results
                    .filter((r) => r.score !== null)
                    .reduce((s, r) => s + (r.score ?? 0), 0) /
                    Math.max(
                      1,
                      results.filter((r) => r.score !== null).length,
                    )) *
                    10,
                ) / 10
              : 0)
          }
        />
        <StatCard
          icon="🏆"
          color="green"
          label="Highest Score"
          value={
            stats?.highestScore ??
            (results.length > 0
              ? Math.max(...results.map((r) => r.score ?? 0))
              : 0)
          }
        />
        <StatCard
          icon="📉"
          color="red"
          label="Lowest Score"
          value={
            stats?.lowestScore ??
            (results.length > 0
              ? Math.min(
                  ...results
                    .filter((r) => r.score !== null)
                    .map((r) => r.score ?? 0),
                )
              : 0)
          }
        />
      </div>

      {/* Table */}
      {loadingResults ? (
        <div className="animate-pulse space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-14 rounded-xl bg-gray-100" />
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-16">
          <p className="text-sm text-gray-400">
            No attempts yet for this assessment
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {[
                  "Student",
                  "Adm. Number",
                  "Score",
                  "Percentage",
                  "Status",
                  "Submitted",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-medium text-gray-500"
                  >
                    {h}
                  </th>
                ))}
                <th className="w-10 px-3 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {results.map((result) => (
                <ResultRow key={result.studentAssessmentId} result={result} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

const StatCard = ({
  icon,
  color,
  label,
  value,
}: {
  icon: string;
  color: string;
  label: string;
  value: number;
}) => {
  const colors: Record<string, string> = {
    blue: "bg-blue-50  text-blue-600",
    amber: "bg-amber-50 text-amber-500",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50   text-red-500",
  };
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="mb-2 flex items-center gap-2">
        <div
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-lg text-sm",
            colors[color],
          )}
        >
          {icon}
        </div>
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

// ─── Result Row ───────────────────────────────────────────────────────────────

const ResultRow = ({ result }: { result: AssessmentStudentResult }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const cfg = STATUS_CFG[result.status] ?? STATUS_CFG.ABSENT;

  useEffect(() => {
    if (!menuOpen) return;
    const h = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [menuOpen]);

  const formattedDate = result.submissionTime
    ? new Date(result.submissionTime).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  return (
    <tr className="group transition-colors hover:bg-gray-50/50">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-200">
            <User className="h-3.5 w-3.5 text-gray-500" />
          </div>
          <span className="text-sm font-medium text-gray-800">
            {result.studentName}
          </span>
        </div>
      </td>
      <td className="px-5 py-3.5 text-sm text-gray-500">
        {result.admissionNumber}
      </td>
      <td className="px-5 py-3.5 text-sm text-gray-700">
        {result.score !== null ? `${result.score} / ${result.totalMarks}` : "—"}
      </td>
      <td className="px-5 py-3.5 text-sm text-gray-700">
        {result.percentage !== null ? `${result.percentage}%` : "—"}
      </td>
      <td className="px-5 py-3.5">
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
            cfg.className,
          )}
        >
          {cfg.label}
        </span>
      </td>
      <td className="px-5 py-3.5 text-sm text-gray-500">{formattedDate}</td>
      <td className="px-3 py-3.5">
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600",
              menuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100",
            )}
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full z-30 mt-1 w-40 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-xl">
              {result.status === "PENDING" && (
                <button className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50">
                  <Check className="h-3.5 w-3.5 text-gray-400" />
                  Grade attempt
                </button>
              )}
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};
