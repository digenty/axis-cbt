"use client";

import { use, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  AlertTriangle,
  Check,
  FileSpreadsheet,
  Loader2,
  Pencil,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/components/common/Toast";
import {
  usePreviewImport,
  useImportQuestions,
} from "@/hooks/queryHooks/useQuestionBank";
import type {
  AiImportQuestion,
  ImportPreview,
  ImportPreviewQuestion,
} from "@/types/question";

// ─── Stepper ──────────────────────────────────────────────────────────────────

const STEPS = ["Upload File", "Review Questions", "Confirm & Import"] as const;

const Stepper = ({ active }: { active: 1 | 2 | 3 }) => (
  <div className="flex items-center py-3">
    {STEPS.map((label, i) => {
      const step = (i + 1) as 1 | 2 | 3;
      const done = active > step;
      const current = active === step;
      return (
        <div key={step} className="flex flex-1 items-center">
          <div className="flex shrink-0 items-center gap-2">
            <span
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                done
                  ? "bg-[var(--green-500)] text-white"
                  : current
                    ? "bg-[var(--blue-500)] text-white"
                    : "border border-[var(--color-border-default)] bg-[var(--color-bg-default)] text-[var(--color-text-muted)]",
              )}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : step}
            </span>
            <span
              className={cn(
                "hidden text-sm font-medium whitespace-nowrap sm:block",
                current
                  ? "text-[var(--color-text-default)]"
                  : done
                    ? "text-[var(--green-600)]"
                    : "text-[var(--color-text-muted)]",
              )}
            >
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={cn(
                "mx-3 h-px flex-1",
                done
                  ? "bg-[var(--green-500)]"
                  : "bg-[var(--color-border-default)]",
              )}
            />
          )}
        </div>
      );
    })}
  </div>
);

// ─── Type helpers ─────────────────────────────────────────────────────────────

const TYPE_LABEL: Record<string, string> = {
  MULTIPLE_CHOICE: "Multiple Choice",
  ESSAY: "Essay",
  THEORY: "Theory",
  TRUE_FALSE: "True / False",
  SHORT_ANSWER: "Short Answer",
  FILL_IN_THE_BLANK: "Fill in the Blank",
  MATCH: "Matching",
};

const TYPE_COLOR: Record<string, string> = {
  MULTIPLE_CHOICE: "bg-[var(--color-bg-badge-blue)] text-[var(--blue-600)]",
  ESSAY: "bg-[var(--color-bg-badge-green)] text-[var(--green-600)]",
  THEORY: "bg-[var(--color-bg-badge-blue)] text-[var(--blue-600)]",
  TRUE_FALSE:
    "bg-[var(--color-bg-badge-gray)] text-[var(--color-text-default)]",
};

const typeLabel = (t: string) =>
  TYPE_LABEL[t] ??
  t
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const typeColor = (t: string) =>
  TYPE_COLOR[t] ??
  "bg-[var(--color-bg-badge-gray)] text-[var(--color-text-default)]";

// ─── QuestionCard ─────────────────────────────────────────────────────────────

const QuestionCard = ({ q }: { q: ImportPreviewQuestion }) => {
  const needsReview = q.status === "needs_review";
  return (
    <div
      className={cn(
        "rounded-lg border p-3",
        needsReview
          ? "border-[var(--color-border-warning)]"
          : "border-[var(--color-border-default)]",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-[var(--color-text-muted)]">
            Q{q.number}
          </span>
          <span
            className={cn(
              "rounded px-1.5 py-0.5 text-[11px] font-medium",
              typeColor(q.type),
            )}
          >
            {typeLabel(q.type)}
          </span>
          {needsReview && (
            <span className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium bg-[var(--color-bg-badge-orange)] text-[var(--orange-600)]">
              <AlertTriangle className="h-2.5 w-2.5" />
              Needs Review
            </span>
          )}
        </div>
        <button
          type="button"
          className="flex shrink-0 items-center gap-1 text-xs text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)]"
        >
          <Pencil className="h-3 w-3" />
          Edit
        </button>
      </div>
      <p className="mt-2 text-sm text-[var(--color-text-default)]">{q.text}</p>
      {q.options && q.options.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {q.options.map((opt) => (
            <span
              key={opt.label}
              className={cn(
                "rounded-md border px-2.5 py-1 text-xs",
                opt.label === q.correctAnswer
                  ? "border-[var(--green-400)] bg-[var(--color-bg-badge-green)] font-medium text-[var(--green-700)]"
                  : "border-[var(--color-border-default)] text-[var(--color-text-subtle)]",
              )}
            >
              {opt.label}. {opt.text}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

interface ImportQuestionsViewProps {
  params: Promise<{ classId: string; subjectId: string }>;
}

export const ImportQuestionsView = ({ params }: ImportQuestionsViewProps) => {
  const { classId: classIdStr, subjectId: subjectIdStr } = use(params);
  const classId = Number(classIdStr);
  const subjectId = Number(subjectIdStr);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [rawQuestions, setRawQuestions] = useState<AiImportQuestion[]>([]);

  const baseUrl = `/classes/${classIdStr}/subjects/${subjectIdStr}`;

  const previewMutation = usePreviewImport(classId, subjectId);
  const importMutation = useImportQuestions(classId, subjectId);

  const handleFile = (f: File) => {
    if (f.size > 40 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 40MB",
        type: "error",
      });
      return;
    }
    setFile(f);
    setPreview(null);
  };

  const handleContinueStep1 = () => {
    if (!file) return;
    previewMutation.mutate(file, {
      onSuccess: (res) => {
        setPreview(res.data);
        setRawQuestions(res.rawQuestions);
        setStep(2);
      },
    });
  };

  const handleConfirmImport = () => {
    importMutation.mutate(
      { questions: rawQuestions, confirmNewTopics: true },
      {
        onSuccess: () => {
          toast({ title: "Import complete", type: "success" });
          router.push(`${baseUrl}/question-bank`);
        },
      },
    );
  };

  // ── Derived stats ──
  const allQuestions = preview?.sections.flatMap((s) => s.questions) ?? [];
  const validCount = allQuestions.filter((q) => q.status === "valid").length;
  const needsReviewCount = allQuestions.filter(
    (q) => q.status === "needs_review",
  ).length;
  const sectionCount = preview?.sections.length ?? 0;

  const typeCounts = allQuestions.reduce<Record<string, number>>((acc, q) => {
    acc[q.type] = (acc[q.type] ?? 0) + 1;
    return acc;
  }, {});
  const maxTypeCount = Math.max(...Object.values(typeCounts), 1);

  // ─── Step 1: Upload File ──────────────────────────────────────────────────

  if (step === 1) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-8 md:px-0">
        <div className="overflow-hidden rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)]">
          <div className="border-b border-[var(--color-border-default)] px-6">
            <Stepper active={1} />
          </div>

          <div className="p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-[var(--color-text-default)]">
                Upload Exam File
              </h2>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                Upload your exam document and we&apos;ll use AI to extract and
                structure your questions
              </p>
            </div>

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                const f = e.dataTransfer.files?.[0];
                if (f) handleFile(f);
              }}
              className={cn(
                "mt-5 flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-12 text-center transition-colors",
                dragActive
                  ? "border-[var(--blue-500)] bg-[var(--color-bg-badge-blue)]"
                  : "border-[var(--color-border-strong)] bg-[var(--color-bg-subtle)] hover:bg-[var(--color-bg-state-soft-hover)]",
              )}
            >
              <FileSpreadsheet className="h-10 w-10 text-[var(--color-icon-default-muted)]" />
              <p className="text-sm text-[var(--color-text-default)]">
                Drag and drop your file here, or{" "}
                <span className="font-medium text-[var(--blue-600)]">
                  click to browse
                </span>
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">
                Supported:&nbsp;.docx&nbsp;&middot;&nbsp;.pdf&nbsp;&middot;&nbsp;.csv&nbsp;&middot;&nbsp;.xlsx&nbsp;&nbsp;|&nbsp;&nbsp;Maximum 40MB
              </p>
            </button>

            <input
              ref={inputRef}
              type="file"
              accept=".csv,.xlsx,.docx,.pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />

            {file && (
              <div className="mt-3 flex items-center gap-3 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-card)] px-3 py-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--color-bg-badge-gray)] text-[10px] font-semibold uppercase text-[var(--color-text-default)]">
                  {file.name.split(".").pop()}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm text-[var(--color-text-default)]">
                    {file.name}
                  </div>
                  <div className="text-[11px] text-[var(--color-text-muted)]">
                    {(file.size / (1024 * 1024)).toFixed(1)} MB &middot;{" "}
                    <span className="text-[var(--green-600)]">Ready</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-[var(--color-icon-default-muted)] hover:text-[var(--color-icon-destructive)]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <div className="mt-4 flex items-start gap-2 rounded-lg border border-[var(--blue-200)] bg-[var(--color-bg-badge-blue)] p-3">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--blue-500)]" />
              <div>
                <p className="text-sm font-medium text-[var(--blue-700)]">
                  AI-Powered Import — No Template Needed
                </p>
                <p className="mt-0.5 text-xs text-[var(--blue-600)]">
                  Just upload your exam paper as-is. We&apos;ll detect question
                  types, extract options, map answer keys, and auto-assign
                  topics from the Nigerian curriculum.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[var(--color-border-default)] px-6 py-4">
            <Button
              variant="outline"
              onClick={() => router.push(`${baseUrl}/question-bank`)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleContinueStep1}
              disabled={!file || previewMutation.isPending}
            >
              {previewMutation.isPending && (
                <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
              )}
              Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Step 2: Review Questions ─────────────────────────────────────────────

  if (step === 2 && preview) {
    const mcqCount = allQuestions.filter(
      (q) => q.type === "MULTIPLE_CHOICE",
    ).length;
    const essayCount = allQuestions.filter((q) => q.type === "ESSAY").length;
    const theoryCount = allQuestions.filter((q) => q.type === "THEORY").length;

    return (
      <div className="mx-auto w-full max-w-4xl space-y-4 px-4 py-8 md:px-0">
        {/* Stepper bar */}
        <div className="overflow-hidden rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)] px-6">
          <Stepper active={2} />
        </div>

        {/* Summary header */}
        <div className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)] p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-[var(--color-text-default)]">
                AI detected {preview.totalQuestions} questions across{" "}
                {sectionCount} sections
              </h3>
              <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                Source: {preview.fileName}
                {preview.curriculum && (
                  <> &middot; Topics auto-assigned from curriculum</>
                )}
              </p>
            </div>
            {preview.curriculum && (
              <span className="rounded-full bg-[var(--color-bg-badge-green)] px-3 py-1 text-xs font-medium text-[var(--green-700)]">
                📚 {preview.curriculum}
              </span>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {mcqCount > 0 && (
              <span className="rounded-full bg-[var(--color-bg-badge-blue)] px-2.5 py-1 text-xs font-medium text-[var(--blue-600)]">
                {mcqCount} MCQ
              </span>
            )}
            {essayCount > 0 && (
              <span className="rounded-full bg-[var(--color-bg-badge-green)] px-2.5 py-1 text-xs font-medium text-[var(--green-600)]">
                {essayCount} Essay
              </span>
            )}
            {needsReviewCount > 0 && (
              <span className="rounded-full bg-[var(--color-bg-badge-orange)] px-2.5 py-1 text-xs font-medium text-[var(--orange-600)]">
                {needsReviewCount} Needs Review
              </span>
            )}
            {theoryCount > 0 && (
              <span className="rounded-full bg-[var(--color-bg-badge-blue)] px-2.5 py-1 text-xs font-medium text-[var(--blue-600)]">
                {theoryCount} Theory
              </span>
            )}
          </div>
        </div>

        {/* Sections */}
        {preview.sections.map((section) => (
          <div
            key={section.name}
            className="overflow-hidden rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)]"
          >
            <div className="flex items-center justify-between border-b border-[var(--color-border-default)] bg-[var(--color-bg-subtle)] px-4 py-2.5">
              <span className="text-sm font-semibold text-[var(--color-text-default)]">
                {section.name}
              </span>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[var(--color-bg-badge-green)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--green-700)]">
                  📚 {section.topicTag}
                </span>
                <span className="text-xs text-[var(--color-text-muted)]">
                  {section.questions.length} questions
                </span>
              </div>
            </div>
            <div className="divide-y divide-[var(--color-border-default)]">
              {section.questions.map((q) => (
                <div key={q.id} className="p-4">
                  <QuestionCard q={q} />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Nav */}
        <div className="flex items-center justify-between rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)] px-4 py-3">
          <Button variant="outline" onClick={() => setStep(1)}>
            <ArrowLeft className="mr-1 h-3.5 w-3.5" />
            Back
          </Button>
          <Button onClick={() => setStep(3)}>Continue</Button>
        </div>
      </div>
    );
  }

  // ─── Step 3: Confirm & Import ─────────────────────────────────────────────

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 md:px-0">
      <div className="overflow-hidden rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)]">
        <div className="border-b border-[var(--color-border-default)] px-6">
          <Stepper active={3} />
        </div>

        <div className="p-6">
          <h2 className="text-lg font-semibold text-[var(--color-text-default)]">
            Confirm &amp; Import
          </h2>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Review the summary below and confirm to add questions to your
            question bank.
          </p>

          {/* Stats */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              {
                label: "Total Questions",
                value: preview?.totalQuestions ?? 0,
                cls: "bg-[var(--color-bg-badge-blue)] text-[var(--blue-600)]",
              },
              {
                label: "Valid",
                value: validCount,
                cls: "bg-[var(--color-bg-badge-green)] text-[var(--green-600)]",
              },
              {
                label: "Needs Review",
                value: needsReviewCount,
                cls: "bg-[var(--color-bg-badge-orange)] text-[var(--orange-600)]",
              },
              {
                label: "Sections",
                value: sectionCount,
                cls: "bg-[var(--color-bg-badge-gray)] text-[var(--color-text-subtle)]",
              },
            ].map((s) => (
              <div key={s.label} className={cn("rounded-lg p-3", s.cls)}>
                <div className="text-2xl font-semibold">{s.value}</div>
                <div className="mt-1 text-xs opacity-80">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Type breakdown */}
          {Object.keys(typeCounts).length > 0 && (
            <div className="mt-5">
              <h4 className="text-sm font-semibold text-[var(--color-text-default)]">
                Question Type Breakdown
              </h4>
              <div className="mt-3 space-y-2">
                {Object.entries(typeCounts).map(([t, count]) => (
                  <div key={t} className="flex items-center gap-3">
                    <span className="w-44 shrink-0 truncate text-xs text-[var(--color-text-subtle)]">
                      {typeLabel(t)}
                      {t === "MULTIPLE_CHOICE" ? " (MCQ)" : ""}
                    </span>
                    <span className="w-6 shrink-0 text-xs font-medium text-[var(--color-text-default)]">
                      {count}
                    </span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--color-bg-subtle)]">
                      <div
                        className="h-full rounded-full bg-[var(--blue-500)]"
                        style={{
                          width: `${(count / maxTypeCount) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Auto-assigned topics */}
          {preview && preview.sections.length > 0 && (
            <div className="mt-5">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-semibold text-[var(--color-text-default)]">
                  Auto-Assigned Topics
                </h4>
                {preview.curriculum && (
                  <span className="rounded-full bg-[var(--color-bg-badge-green)] px-2.5 py-1 text-[11px] font-medium text-[var(--green-700)]">
                    📚 {preview.curriculum}
                  </span>
                )}
              </div>
              <div className="mt-3 overflow-hidden rounded-lg border border-[var(--color-border-default)]">
                {preview.sections.map((section, i) => (
                  <div
                    key={section.name}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2.5 text-sm",
                      i !== 0 &&
                        "border-t border-[var(--color-border-default)]",
                    )}
                  >
                    <span className="min-w-0 flex-1 truncate text-[var(--color-text-default)]">
                      {section.name}
                    </span>
                    <span className="text-[var(--color-text-muted)]">
                      &rarr;
                    </span>
                    <span className="shrink-0 rounded-full bg-[var(--color-bg-badge-green)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--green-700)]">
                      📚 {section.topicTag}
                    </span>
                    <span className="shrink-0 text-xs text-[var(--color-text-muted)]">
                      {section.questions.length} questions
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Needs-review warning */}
          {needsReviewCount > 0 && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-[var(--color-border-warning)] bg-[var(--color-bg-badge-orange)] px-3 py-2.5 text-xs text-[var(--orange-700)]">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <p>
                {needsReviewCount} question
                {needsReviewCount !== 1 ? "s" : ""} marked as &apos;Needs
                Review&apos; will be saved as drafts. You can edit them from the
                Question Bank.
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-[var(--color-border-default)] px-6 py-4">
          <Button variant="outline" onClick={() => setStep(preview ? 2 : 1)}>
            <ArrowLeft className="mr-1 h-3.5 w-3.5" />
            Back
          </Button>
          <Button
            onClick={handleConfirmImport}
            disabled={importMutation.isPending}
          >
            {importMutation.isPending && (
              <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
            )}
            Confirm &amp; Import
          </Button>
        </div>
      </div>
    </div>
  );
};
