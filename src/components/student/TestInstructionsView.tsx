"use client";

import { BookMinus, Info, Loader2, LogOut, Star } from "lucide-react";

// ─── Instruction renderer ─────────────────────────────────────────────────────

function applyBold(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      part
    ),
  );
}

function renderInstructions(text: string): React.ReactNode {
  const lines = text.split("\n");
  const nodes: React.ReactNode[] = [];

  lines.forEach((line, i) => {
    if (line.startsWith("→ ")) {
      nodes.push(
        <div key={i} className="flex items-start gap-2">
          <span className="mt-0.5 shrink-0">→</span>
          <span>{applyBold(line.slice(2))}</span>
        </div>,
      );
    } else if (line.trim() === "") {
      nodes.push(<div key={i} className="h-2" />);
    } else {
      nodes.push(<p key={i}>{applyBold(line)}</p>);
    }
  });

  return <div className="space-y-1">{nodes}</div>;
}
import { useGetAssessmentPreview } from "@/hooks/queryHooks/useStudentCBT";
import { clearStudentSession } from "@/lib/auth-session";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { StatCard } from "../common/StatCard";
import { IconBadge } from "../common/IconBadge";
import {
  BookOpen,
  GraduationCapFill,
  TimeFill,
  QuestionFill,
} from "@digenty/icons";

interface TestInstructionsViewProps {
  // The route segment is named [testId] but the value is `assessmentId`.
  testId: string;
  onBegin: () => void;
}

export const TestInstructionsView = ({
  testId,
  onBegin,
}: TestInstructionsViewProps) => {
  const assessmentId = Number(testId);
  const { data, isLoading, isError } = useGetAssessmentPreview(assessmentId);

  if (isLoading) {
    return (
      <div className="px-6 py-12 flex justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-[var(--color-icon-default-muted)]" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="px-6 py-12">
        <EmptyState title="Test not found" />
      </div>
    );
  }

  const preview = data?.data;
  if (!preview) {
    return (
      <div className="px-6 py-12">
        <EmptyState title="Test not found" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-8">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => clearStudentSession()}
        >
          <LogOut className="mr-1 h-3.5 w-3.5" />
          Log out
        </Button>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <h1 className="text-lg font-semibold text-[var(--color-text-default)]">
          {preview.name}
        </h1>
      </div>
      <span className="mt-2 inline-flex items-center gap-1 rounded-md border border-[var(--amber-300)] bg-[var(--color-bg-badge-amber)] px-2 py-1.5 text-[11px] text-text-default">
        <Star className="h-3 w-3 text-bg-basic-amber-strong" />
        {preview.totalMarks} marks
      </span>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={
            <IconBadge
              color="--color-bg-basic-teal-subtle"
              className="border-bg-basic-teal-accent border rounded-xs"
            >
              <GraduationCapFill
                fill="var(--color-text-default)"
                className="size-2.5"
              />
            </IconBadge>
          }
          label="Class"
          value={
            <span className="text-xl font-medium">
              {preview.className || "-"}
            </span>
          }
        />
        <StatCard
          icon={
            <IconBadge
              color="--color-bg-basic-blue-subtle"
              className="border-bg-basic-blue-accent border rounded-xs"
            >
              <BookOpen fill="var(--color-text-default)" className="size-2.5" />
            </IconBadge>
          }
          label="Subject"
          value={
            <span className="text-xl font-medium capitalize">
              {preview.subjectName.toLowerCase() || "-"}
            </span>
          }
        />
        <StatCard
          icon={
            <IconBadge
              color="--color-bg-basic-orange-subtle"
              className="border-bg-basic-orange-accent border rounded-xs"
            >
              <TimeFill fill="var(--color-text-default)" className="size-2.5" />
            </IconBadge>
          }
          label="Duration"
          value={
            <span className="text-xl font-medium">
              {preview.durationMinutes} minutes
            </span>
          }
        />
        <StatCard
          icon={
            <IconBadge
              color="--color-bg-basic-purple-subtle"
              className="border-bg-basic-purple-accent border rounded-xs"
            >
              <QuestionFill
                fill="var(--color-text-default)"
                className="size-2.5"
              />
            </IconBadge>
          }
          label="Questions"
          value={
            <span className="text-xl font-medium">{preview.questionCount}</span>
          }
        />
      </div>

      <div className="mt-5 overflow-hidden rounded-xl p-1 bg-bg-muted">
        <header className="flex items-center gap-2 px-4 py-2.5">
          <BookMinus className="size-3 text-text-default" />
          <span className="text-sm font-semibold text-[var(--color-text-default)]">
            Instructions
          </span>
        </header>
        <div className="rounded-md px-4 py-4 text-sm text-text-default bg-bg-default">
          {preview.instructions ? (
            renderInstructions(preview.instructions)
          ) : (
            <span className="text-text-muted">
              No specific instructions were provided for this test.
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-[var(--color-border-warning)] bg-[var(--color-bg-badge-orange)] p-4">
        <div className="flex items-center gap-2">
          <Info className="h-3.5 w-3.5 text-text-warning" />
          <span className="text-base font-medium text-text-warning">
            Important Notes
          </span>
        </div>
        <ul className="mt-2 space-y-1 text-sm text-text-default">
          <li>
            • Once you start the assessment, the timer will begin automatically
          </li>
          <li>• You cannot pause the test once started</li>
          <li>• Make sure you have a stable internet connection</li>
          <li>• All questions must be answered before submission</li>
          <li>
            • You can navigate between questions using Next/Previous buttons
          </li>
          <li>• If you run out of time, tests are automatically submitted</li>
        </ul>
      </div>

      <div className="mt-5 flex justify-end">
        <Button onClick={onBegin}>Begin Assessment</Button>
      </div>
    </div>
  );
};
