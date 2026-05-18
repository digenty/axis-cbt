"use client";

import { use, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Download,
  FileSpreadsheet,
  X,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/components/common/Toast";
import { useImportQuestions } from "@/hooks/queryHooks/useQuestionBank";
import type { ImportQuestionsResult } from "@/types/question";

interface ImportQuestionsViewProps {
  params: Promise<{ classId: string; subjectId: string }>;
}

const Steps = ({ active }: { active: 1 | 2 }) => (
  <div className="mx-auto flex max-w-md items-center gap-3 py-3">
    <div className="flex flex-1 items-center gap-2">
      <span
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full border-2",
          active === 1
            ? "border-[var(--blue-500)] text-[var(--blue-500)]"
            : "border-[var(--green-500)] bg-[var(--green-500)] text-white",
        )}
      >
        {active === 1 ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Check className="h-3.5 w-3.5" />
        )}
      </span>
      <span className="text-sm text-[var(--color-text-default)]">
        Import questions
      </span>
    </div>
    <div className="h-px flex-1 bg-[var(--color-border-default)]" />
    <div className="flex flex-1 items-center gap-2">
      <span
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full border-2",
          active === 2
            ? "border-[var(--blue-500)] text-[var(--blue-500)]"
            : "border-[var(--color-border-default)] bg-[var(--color-bg-default)] text-[var(--color-text-muted)]",
        )}
      >
        {active === 2 ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <span className="text-xs font-medium">2</span>
        )}
      </span>
      <span className="text-sm text-[var(--color-text-default)]">
        Confirm &amp; Upload
      </span>
    </div>
  </div>
);

export const ImportQuestionsView = ({ params }: ImportQuestionsViewProps) => {
  const { classId: classIdStr, subjectId: subjectIdStr } = use(params);
  const classId = Number(classIdStr);
  const subjectId = Number(subjectIdStr);
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [result, setResult] = useState<ImportQuestionsResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const importMutation = useImportQuestions(classId, subjectId);

  const baseUrl = `/classes/${classIdStr}/subjects/${subjectIdStr}`;

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
    setResult(null);
  };

  const handleConfirmImport = () => {
    if (!file) return;
    importMutation.mutate(file, {
      onSuccess: (res) => {
        setResult(res.data);
        toast({
          title: "Import complete",
          description: `${res.data.imported} imported, ${res.data.failed} failed.`,
          type: "success",
        });
      },
    });
  };

  const downloadErrorReport = () => {
    if (!result || result.errors.length === 0) return;
    const csv =
      "row,error\n" +
      result.errors
        .map((e, i) => `${i + 1},"${e.replace(/"/g, '""')}"`)
        .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `import-errors-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (step === 1) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-8 md:px-0">
        <Steps active={1} />

        <div className="mt-2 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)] p-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-[var(--color-text-default)]">
              Import Questions
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Upload your questions in CSV format to quickly add them to the
              question bank.
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
              "mt-5 flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-10 text-center text-sm transition-colors",
              dragActive
                ? "border-[var(--blue-500)] bg-[var(--color-bg-badge-blue)]"
                : "border-[var(--color-border-strong)] bg-[var(--color-bg-subtle)]",
            )}
          >
            <FileSpreadsheet className="h-8 w-8 text-[var(--color-icon-default-muted)]" />
            <p className="text-sm text-[var(--color-text-default)]">
              Drag and drop a CSV file here, or{" "}
              <span className="font-medium text-[var(--blue-600)]">
                click to browse
              </span>
            </p>
            <p className="text-[11px] text-[var(--color-text-muted)]">
              Maximum of 40MB
            </p>
          </button>

          <input
            ref={inputRef}
            type="file"
            accept=".csv,.xlsx"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />

          {file && (
            <div className="mt-3 flex items-center gap-3 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-card)] px-3 py-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--color-bg-badge-gray)] text-xs font-medium text-[var(--color-text-default)]">
                CSV
              </span>
              <div className="flex-1 min-w-0">
                <div className="truncate text-sm text-[var(--color-text-default)]">
                  {file.name}
                </div>
                <div className="text-[11px] text-[var(--color-text-muted)]">
                  {(file.size / (1024 * 1024)).toFixed(1)} MB •{" "}
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
        </div>

        <div className="mt-3 flex items-center justify-between rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)] px-4 py-3">
          <Button
            variant="outline"
            onClick={() => router.push(`${baseUrl}/question-bank`)}
          >
            Cancel
          </Button>
          <Button onClick={() => setStep(2)} disabled={!file}>
            Continue
          </Button>
        </div>
      </div>
    );
  }

  const total = result ? result.imported + result.failed : 0;

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 md:px-0">
      <Steps active={2} />

      <div className="mt-2 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)] p-6">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-[var(--color-text-default)]">
            {result ? "Import Complete" : "Confirm Question Upload"}
          </h2>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            {result
              ? "Review the result of your upload below."
              : "Press “Confirm & Import” to upload your file."}
          </p>
        </div>

        {result && (
          <>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                {
                  label: "Total Questions",
                  value: total,
                  color:
                    "bg-[var(--color-bg-badge-blue)] text-[var(--blue-600)]",
                },
                {
                  label: "Imported",
                  value: result.imported,
                  color:
                    "bg-[var(--color-bg-badge-green)] text-[var(--green-600)]",
                },
                {
                  label: "Failed",
                  value: result.failed,
                  color: "bg-[var(--color-bg-badge-red)] text-[var(--red-600)]",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-lg border border-[var(--color-border-default)] p-3"
                >
                  <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-subtle)]">
                    <span
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded",
                        s.color,
                      )}
                    >
                      •
                    </span>
                    {s.label}
                  </div>
                  <div className="mt-2 text-xl font-semibold text-[var(--color-text-default)]">
                    {s.value}
                  </div>
                </div>
              ))}
            </div>

            {result.failed > 0 && result.errors.length > 0 && (
              <>
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-[var(--color-border-warning)] bg-[var(--color-bg-badge-orange)] px-3 py-2 text-xs text-[var(--orange-700)]">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Some questions could not be imported. Review the errors below.
                </div>

                <div className="mt-4 rounded-lg border border-[var(--color-border-default)] p-4">
                  <h4 className="text-sm font-semibold text-[var(--color-text-default)]">
                    Errors ({result.errors.length})
                  </h4>
                  <ul className="mt-2 max-h-40 space-y-1.5 overflow-y-auto text-xs">
                    {result.errors.map((line, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-[var(--color-text-subtle)]"
                      >
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[var(--red-500)]" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadErrorReport}
                  >
                    <Download className="mr-1 h-3.5 w-3.5" />
                    Download Error Report (CSV)
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)] px-4 py-3">
        <Button
          variant="outline"
          onClick={() => {
            setStep(1);
            setResult(null);
          }}
        >
          <ArrowLeft className="mr-1 h-3.5 w-3.5" />
          Back
        </Button>
        {result ? (
          <Button onClick={() => router.push(`${baseUrl}/question-bank`)}>
            Done
          </Button>
        ) : (
          <Button
            onClick={handleConfirmImport}
            disabled={importMutation.isPending}
          >
            {importMutation.isPending && (
              <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
            )}
            Confirm &amp; Import
          </Button>
        )}
      </div>
    </div>
  );
};
