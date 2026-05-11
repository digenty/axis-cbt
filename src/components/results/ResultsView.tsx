"use client";

import Link from "next/link";
import { use, useMemo, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Trophy,
  Users,
  Star,
  BarChart2,
  ChevronDown,
  MoreHorizontal,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  useGetClassDetails,
  useGetSubjectsByClassId,
  useGetTeacherSubjects,
} from "@/hooks/queryHooks/useSubjects";
import {
  useGetAssessmentEnrollment,
  useGetAssessments,
  useGetAssessmentResults,
  useGetAssessmentStats,
} from "@/hooks/queryHooks/useAssessment";
import type {
  AssessmentStudentResult,
  StudentResultStatus,
} from "@/types/question";
import type { AttemptStatus as ApiAttemptStatus } from "@/types/student-api";
import type { AttemptStatus as UiAttemptStatus } from "@/types/results";
import { IconBadge } from "../common/IconBadge";

interface ResultsViewProps {
  params: Promise<{ classId: string; subjectId: string }>;
}

const apiResultStatusToUi = (
  s: StudentResultStatus | ApiAttemptStatus,
  hasScore: boolean,
): UiAttemptStatus => {
  if (s === "NOT_STARTED") return "not-started";
  if (s === "IN_PROGRESS") return "in-progress";
  if (s === "PENDING") return "submitted";
  if (s === "ABSENT" || s === "TIMED_OUT") return "missed";
  if (s === "COMPLETED") return hasScore ? "graded" : "submitted";
  return "submitted";
};

export const ResultsView = ({ params }: ResultsViewProps) => {
  const { classId: classIdStr, subjectId: subjectIdStr } = use(params);
  const classId = Number(classIdStr);
  const subjectId = Number(subjectIdStr);

  const { data: classDetails } = useGetClassDetails(classId);
  const { data: teacherSubjects } = useGetTeacherSubjects();
  const { data: classSubjects } = useGetSubjectsByClassId(classId);

  const branchId = useMemo(
    () => classSubjects?.data?.find((s) => s.id === subjectId)?.branchId,
    [classSubjects, subjectId],
  );

  const className = useMemo(() => {
    const raw = classDetails as
      | { data?: { name?: string } }
      | { name?: string }
      | undefined;
    if (!raw) return "";
    if ("data" in raw && raw.data?.name) return raw.data.name;
    if ("name" in raw && typeof raw.name === "string") return raw.name;
    return "";
  }, [classDetails]);

  const subjectName = useMemo(
    () =>
      teacherSubjects?.data?.find((s) => s.subjectId === subjectId)
        ?.subjectName ?? "",
    [teacherSubjects, subjectId],
  );

  const { data: assessmentsRes, isLoading: assessmentsLoading } =
    useGetAssessments({
      branchId: branchId ?? 0,
      classId,
      subjectId,
    });
  const subjectTests = useMemo(
    () => assessmentsRes?.data ?? [],
    [assessmentsRes],
  );

  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);
  const activeTestId =
    selectedTestId !== null && subjectTests.some((t) => t.id === selectedTestId)
      ? selectedTestId
      : (subjectTests[0]?.id ?? null);

  const activeTest = useMemo(
    () => subjectTests.find((t) => t.id === activeTestId),
    [subjectTests, activeTestId],
  );

  const { data: resultsRes, isLoading: resultsLoading } =
    useGetAssessmentResults(activeTestId ?? 0);
  const baseResults = useMemo(() => resultsRes?.data ?? [], [resultsRes]);

  const { data: enrollmentRes } = useGetAssessmentEnrollment(activeTestId ?? 0);
  const enrollment = useMemo(() => enrollmentRes?.data ?? [], [enrollmentRes]);

  // Merge enrollment-only (NOT_STARTED) rows in so absentees / pending students
  // show up alongside actual attempts.
  const results = useMemo<AssessmentStudentResult[]>(() => {
    if (enrollment.length === 0) return baseResults;
    const seen = new Set(baseResults.map((r) => r.studentId));
    const totalMarks = activeTest?.totalMarks ?? 0;
    const synthetic: AssessmentStudentResult[] = enrollment
      .filter((e) => !seen.has(e.studentId))
      .map((e) => ({
        studentAssessmentId: e.studentAssessmentId ?? 0,
        studentId: e.studentId,
        studentName: e.studentName,
        admissionNumber: "",
        className: "",
        status: e.attemptStatus as StudentResultStatus,
        score: null,
        totalMarks,
        percentage: null,
        passed: null,
        submissionTime: null,
        timeSpentSeconds: null,
      }));
    return [...baseResults, ...synthetic];
  }, [baseResults, enrollment, activeTest?.totalMarks]);

  const { data: statsRes } = useGetAssessmentStats(activeTestId ?? 0);
  const apiStats = statsRes?.data;

  const baseUrl = `/classes/${classIdStr}/subjects/${subjectIdStr}`;

  const columns = useMemo<ColumnDef<AssessmentStudentResult>[]>(
    () => [
      {
        id: "studentName",
        header: "Student Name",
        cell: ({ row }) => {
          const a = row.original;
          return (
            <span className="flex items-center gap-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-[var(--color-bg-muted)] text-[10px] text-[var(--color-text-subtle)]">
                  {(a.studentName || "?")[0]}
                </AvatarFallback>
              </Avatar>
              <span className="text-[var(--color-text-default)]">
                {a.studentName}
              </span>
            </span>
          );
        },
      },
      {
        id: "score",
        header: "Score",
        cell: ({ row }) => {
          const a = row.original;
          return a.score !== null ? `${a.score} / ${a.totalMarks}` : "-";
        },
      },
      {
        id: "percentage",
        header: "Percentage",
        cell: ({ row }) => {
          const a = row.original;
          return a.percentage !== null ? `${a.percentage}%` : "-";
        },
      },
      {
        id: "weightedScore",
        header: "Weighted",
        cell: ({ row }) => {
          const a = row.original;
          return a.percentage !== null ? (a.percentage * 0.2).toFixed(1) : "-";
        },
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => (
          <StatusBadge
            status={apiResultStatusToUi(
              row.original.status,
              row.original.score !== null,
            )}
          />
        ),
      },
      {
        id: "actions",
        header: "",
        size: 40,
        cell: ({ row }) => {
          const a = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-icon-default-muted)] hover:bg-[var(--color-bg-state-soft-hover)]"
                  aria-label="Row actions"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`${baseUrl}/results/${a.studentAssessmentId}`}>
                    Open / Grade
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    toast.info("Retake request", {
                      description: "Mock — no email sent.",
                    })
                  }
                >
                  Request Retake
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [baseUrl],
  );

  return (
    <div className="px-4 py-5 md:px-6 md:py-6">
      <PageHeader
        title="Results"
        subtitle={
          className && subjectName
            ? `${className} • ${subjectName.toLocaleLowerCase()}`
            : undefined
        }
        showBack
        backHref={baseUrl}
      />

      <div className="mt-4 flex items-center justify-between gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex h-9 items-center gap-2 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-default)] px-3 text-sm text-[var(--color-text-default)]"
            >
              {activeTest?.name ?? "Select a test"}
              <ChevronDown className="h-3.5 w-3.5 text-[var(--color-icon-default-muted)]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {subjectTests.map((t) => (
              <DropdownMenuItem
                key={t.id}
                onClick={() => setSelectedTestId(t.id)}
              >
                {t.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          size="sm"
          // onClick={() =>
          //   toast.info("Export results", {
          //     description: "Mock export — no file emitted.",
          //   })
          // }
        >
          <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
          Export Result
        </Button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={
            <IconBadge
              color="--color-bg-basic-teal-subtle"
              className="border-bg-basic-teal-accent border rounded-xs"
            >
              <Users className="size-2.5 text-text-default" />
            </IconBadge>
          }
          label="Total Students"
          value={apiStats?.totalStudents ?? results.length}
        />
        <StatCard
          icon={
            <IconBadge
              color="--color-bg-basic-amber-subtle"
              className="border-bg-basic-amber-accent border rounded-xs"
            >
              <BarChart2 className="size-2.5 text-text-default" />
            </IconBadge>
          }
          label="Average Score"
          value={apiStats?.averagePercentage ?? "-"}
          hint="/100"
        />
        <StatCard
          icon={
            <IconBadge
              color="--color-bg-basic-green-subtle"
              className="border-bg-basic-green-accent border rounded-xs"
            >
              <Trophy className="size-2.5 text-text-default" />
            </IconBadge>
          }
          label="Highest Score"
          value={apiStats?.highestScore ?? "-"}
          hint="/100"
        />
        <StatCard
          icon={
            <IconBadge
              color="--color-bg-basic-red-subtle"
              className="border-bg-basic-red-accent border rounded-xs"
            >
              <Star className="size-2.5 text-text-default" />
            </IconBadge>
          }
          label="Lowest Score"
          value={apiStats?.lowestScore ?? "-"}
          hint="/100"
        />
      </div>

      <div className="mt-5">
        {assessmentsLoading || resultsLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-[var(--color-icon-default-muted)]" />
          </div>
        ) : !activeTest ? (
          <EmptyState
            title="No tests yet"
            description="Create an assessment to view results here."
          />
        ) : (
          <DataTable
            columns={columns}
            data={results}
            totalCount={results.length}
            page={1}
            setCurrentPage={() => {}}
            pageSize={results.length || 10}
            showPagination={false}
            border
            headerBg
          />
        )}
      </div>
    </div>
  );
};
