"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Search,
  ChevronRight,
  FileText,
  Clock,
  Users,
} from "lucide-react";
import { useGetMyAssessments } from "@/hooks/queryHooks/useCbtOverview";
import { useGetAssessmentStats } from "@/hooks/queryHooks/useAssessment";
import type { TeacherAssessmentListItem } from "@/types/student-api";

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  DRAFT: { label: "Draft", className: "bg-gray-100 text-gray-600" },
  PUBLISHED: { label: "Published", className: "bg-green-50 text-green-700" },
  ONGOING: { label: "Ongoing", className: "bg-blue-50 text-blue-700" },
  COMPLETED: {
    label: "Completed",
    className: "bg-purple-50 text-purple-700",
  },
  ARCHIVED: { label: "Archived", className: "bg-yellow-50 text-yellow-700" },
};

// ─── Assessment row ───────────────────────────────────────────────────────────

const AssessmentRow = ({ a }: { a: TeacherAssessmentListItem }) => {
  const { data: stats } = useGetAssessmentStats(
    a.status === "COMPLETED" || a.status === "ONGOING" ? a.id : 0,
  );
  const cfg = STATUS_CONFIG[a.status] ?? STATUS_CONFIG.DRAFT;

  return (
    <Link
      href={`/classes/${a.classId}/subjects/${a.subjectId}/results`}
      className="group flex items-center gap-4 border-t border-gray-50 px-5 py-4 transition-colors hover:bg-gray-50 first:border-t-0"
    >
      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-gray-900">
            {a.name}
          </p>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${cfg.className}`}
          >
            {cfg.label}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-gray-400">
          {a.className} · {a.subjectName}
        </p>
        <div className="mt-1.5 flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            {a.questionCount} questions
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {a.durationMinutes} min
          </span>
          {a.totalMarks > 0 && (
            <span className="flex items-center gap-1">
              <BarChart3 className="h-3 w-3" />
              {a.totalMarks} marks
            </span>
          )}
        </div>
      </div>

      {/* Stats (shown when completed/ongoing) */}
      {stats && (
        <div className="hidden shrink-0 items-center gap-5 sm:flex">
          <div className="text-center">
            <p className="text-sm font-bold text-gray-900">
              {stats.data?.completed ?? 0}
            </p>
            <p className="text-xs text-gray-400">Completed</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-gray-900">
              {stats.data?.averagePercentage != null
                ? `${Math.round(stats.data.averagePercentage)}%`
                : "—"}
            </p>
            <p className="text-xs text-gray-400">Avg Score</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-gray-900">
              {stats.data?.passRate != null
                ? `${Math.round(stats.data.passRate)}%`
                : "—"}
            </p>
            <p className="text-xs text-gray-400">Pass Rate</p>
          </div>
        </div>
      )}

      <ChevronRight className="h-4 w-4 shrink-0 text-gray-300 transition-colors group-hover:text-gray-500" />
    </Link>
  );
};

// ─── View ─────────────────────────────────────────────────────────────────────

export const GlobalResultsView = () => {
  const { data, isLoading } = useGetMyAssessments();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filtered = (data ?? []).filter((a) => {
    const matchSearch =
      !search ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.subjectName.toLowerCase().includes(search.toLowerCase()) ||
      a.className.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusOptions = ["ALL", "PUBLISHED", "ONGOING", "COMPLETED", "DRAFT"];

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Results</h1>
          <p className="mt-1 text-sm text-gray-500">
            All assessments across your subjects
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500">
          <Users className="h-4 w-4" />
          <span>{data?.length ?? 0} assessments</span>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1" style={{ minWidth: 200 }}>
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search assessments…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Status tabs */}
        <div className="flex gap-1 rounded-lg border border-gray-100 bg-white p-1">
          {statusOptions.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                statusFilter === s
                  ? "bg-blue-600 text-white"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {s === "ALL" ? "All" : (STATUS_CONFIG[s]?.label ?? s)}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-xl border border-gray-100 bg-white"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-gray-100 bg-white py-16 text-center">
          <BarChart3 className="mx-auto mb-3 h-8 w-8 text-gray-200" />
          <p className="text-sm font-medium text-gray-500">
            {search || statusFilter !== "ALL"
              ? "No assessments match your filters"
              : "No assessments yet"}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
          {filtered.map((a) => (
            <AssessmentRow key={a.id} a={a} />
          ))}
        </div>
      )}
    </div>
  );
};
