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
import { useCBTStore } from "@/store";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ResultsViewProps {
  params: Promise<{ classId: string; subjectId: string }>;
}

export const ResultsView = ({ params }: ResultsViewProps) => {
  const { classId, subjectId } = use(params);
  const { tests, attempts } = useCBTStore();

  const subjectTests = useMemo(
    () =>
      tests.filter((t) => t.subjectId === subjectId && t.classId === classId),
    [tests, classId, subjectId],
  );

  const [activeTestId, setActiveTestId] = useState<string | null>(
    subjectTests[0]?.id ?? null,
  );
  const activeTest = subjectTests.find((t) => t.id === activeTestId);

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

  return (
    <div className="px-4 py-5 md:px-6 md:py-6">
      <PageHeader
        title="Results"
        subtitle={
          activeTest ? `${activeTest.subjectId} attempts` : "Pick a test"
        }
        showBack
        backHref={baseUrl}
        right={
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toast.info("Export results", {
                description: "Mock export — no file emitted.",
              })
            }
          >
            <ExternalLink className="mr-1 h-3.5 w-3.5" />
            Export Result
          </Button>
        }
      />

      <div className="mt-4">
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
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Users className="h-4 w-4" />}
          label="Total Students"
          value={stats.total}
        />
        <StatCard
          icon={<BarChart2 className="h-4 w-4 text-[var(--amber-500)]" />}
          label="Average Score"
          value={stats.avg}
          hint="/100"
        />
        <StatCard
          icon={<Trophy className="h-4 w-4 text-[var(--green-500)]" />}
          label="Highest Score"
          value={stats.high}
          hint="/100"
        />
        <StatCard
          icon={<Star className="h-4 w-4 text-[var(--red-500)]" />}
          label="Lowest Score"
          value={stats.low}
          hint="/100"
        />
      </div>

      <div className="mt-5 overflow-x-auto rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)]">
        <div className="grid min-w-[800px] grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] items-center gap-3 border-b border-[var(--color-border-default)] bg-[var(--color-bg-subtle)] px-4 py-2.5 text-xs font-medium text-[var(--color-text-muted)]">
          <span>Student Name</span>
          <span>Score</span>
          <span>Percentage</span>
          <span>Weighted Score</span>
          <span>Status</span>
          <span className="w-8" />
        </div>
        {testAttempts.length === 0 ? (
          <EmptyState
            title="No attempts yet"
            description="Once students start the test, their attempts appear here."
          />
        ) : (
          testAttempts.map((a) => (
            <div
              key={a.id}
              className="grid min-w-[800px] grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] items-center gap-3 border-b border-[var(--color-border-default)] px-4 py-2.5 last:border-b-0"
            >
              <span className="flex items-center gap-2 text-sm">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-[var(--color-bg-muted)] text-[10px] text-[var(--color-text-subtle)]">
                    {a.studentName[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="text-[var(--color-text-default)]">
                  {a.studentName}
                </span>
              </span>
              <span className="text-sm">
                {typeof a.score === "number"
                  ? `${a.score} / ${a.totalMarks}`
                  : "-"}
              </span>
              <span className="text-sm">
                {typeof a.percentage === "number" ? `${a.percentage}%` : "-"}
              </span>
              <span className="text-sm">
                {typeof a.weightedScore === "number"
                  ? a.weightedScore.toFixed(1)
                  : "-"}
              </span>
              <span>
                <StatusBadge status={a.status} />
              </span>
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
                    <Link href={`${baseUrl}/results/${a.id}`}>
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
            </div>
          ))
        )}
      </div>
    </div>
  );
};
