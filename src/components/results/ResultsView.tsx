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
} from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { useCBTStore } from "@/store";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { StudentAttempt } from "@/types";

interface ResultsViewProps {
  params: Promise<{ classId: string; subjectId: string }>;
}

function IconBadge({
  color,
  children,
}: {
  color: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className="flex size-8 items-center justify-center rounded-lg border-2 border-white/20"
      style={{ background: `var(${color})` }}
    >
      {children}
    </span>
  );
}

export const ResultsView = ({ params }: ResultsViewProps) => {
  const { classId, subjectId } = use(params);
  const { tests, attempts, classes, subjects } = useCBTStore();

  const cls = useMemo(
    () => classes.find((c) => c.id === classId),
    [classes, classId],
  );
  const subject = useMemo(
    () => subjects.find((s) => String(s.id) === subjectId),
    [subjects, subjectId],
  );

  const subjectTests = useMemo(
    () =>
      tests.filter((t) => t.subjectId === subjectId && t.classId === classId),
    [tests, classId, subjectId],
  );

  const [activeTestId, setActiveTestId] = useState<string | null>(
    subjectTests[0]?.id ?? null,
  );
  const activeTest = useMemo(
    () => subjectTests.find((t) => t.id === activeTestId),
    [subjectTests, activeTestId],
  );

  const testAttempts = useMemo(
    () =>
      activeTest ? attempts.filter((a) => a.testId === activeTest.id) : [],
    [attempts, activeTest],
  );

  const stats = useMemo(() => {
    const graded = testAttempts.filter((a) => typeof a.percentage === "number");
    if (graded.length === 0)
      return { total: testAttempts.length, avg: "-", high: "-", low: "-" };
    const percentages = graded.map((a) => a.percentage as number);
    return {
      total: testAttempts.length,
      avg: Math.round(
        percentages.reduce((a, b) => a + b, 0) / percentages.length,
      ),
      high: Math.max(...percentages),
      low: Math.min(...percentages),
    };
  }, [testAttempts]);

  const baseUrl = `/classes/${classId}/subjects/${subjectId}`;

  const columns = useMemo<ColumnDef<StudentAttempt>[]>(
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
                  {a.studentName[0]}
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
          return typeof a.score === "number"
            ? `${a.score} / ${a.totalMarks}`
            : "-";
        },
      },
      {
        id: "percentage",
        header: "Percentage",
        cell: ({ row }) => {
          const a = row.original;
          return typeof a.percentage === "number" ? `${a.percentage}%` : "-";
        },
      },
      {
        id: "weightedScore",
        header: "Weighted Score",
        cell: ({ row }) => {
          const a = row.original;
          return typeof a.weightedScore === "number"
            ? a.weightedScore.toFixed(1)
            : "-";
        },
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
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
                  <Link href={`${baseUrl}/results/${a.id}`}>Open / Grade</Link>
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
        subtitle={cls && subject ? `${cls.name} • ${subject.name}` : undefined}
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
              {activeTest?.title ?? "Select a test"}
              <ChevronDown className="h-3.5 w-3.5 text-[var(--color-icon-default-muted)]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {subjectTests.map((t) => (
              <DropdownMenuItem
                key={t.id}
                onClick={() => setActiveTestId(t.id)}
              >
                {t.title}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          size="sm"
          onClick={() =>
            toast.info("Export results", {
              description: "Mock export — no file emitted.",
            })
          }
        >
          <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
          Export Result
        </Button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={
            <IconBadge color="--color-bg-basic-teal-accent">
              <Users className="h-4 w-4 text-white" />
            </IconBadge>
          }
          label="Total Students"
          value={stats.total}
        />
        <StatCard
          icon={
            <IconBadge color="--color-bg-basic-amber-accent">
              <BarChart2 className="h-4 w-4 text-white" />
            </IconBadge>
          }
          label="Average Score"
          value={stats.avg}
          hint="/100"
        />
        <StatCard
          icon={
            <IconBadge color="--color-bg-basic-green-accent">
              <Trophy className="h-4 w-4 text-white" />
            </IconBadge>
          }
          label="Highest Score"
          value={stats.high}
          hint="/100"
        />
        <StatCard
          icon={
            <IconBadge color="--color-bg-basic-red-accent">
              <Star className="h-4 w-4 text-white" />
            </IconBadge>
          }
          label="Lowest Score"
          value={stats.low}
          hint="/100"
        />
      </div>

      <div className="mt-5">
        <DataTable
          columns={columns}
          data={testAttempts}
          totalCount={testAttempts.length}
          page={1}
          setCurrentPage={() => {}}
          pageSize={testAttempts.length || 10}
          showPagination={false}
          border
          headerBg
        />
      </div>
    </div>
  );
};
