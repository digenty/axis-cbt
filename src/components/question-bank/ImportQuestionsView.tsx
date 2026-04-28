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
import { toast } from "sonner";

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
  const { classId, subjectId } = use(params);
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const baseUrl = `/classes/${classId}/subjects/${subjectId}`;

  const handleFile = (f: File) => {
    if (f.size > 40 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Maximum file size is 40MB",
      });
      return;
    }
    setFile(f);
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
                  <span className="text-[var(--green-600)]">Uploaded</span>
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

          <div className="mt-4 flex items-center gap-3 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-card)] px-3 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--green-600)] text-xs font-bold text-white">
              X
            </span>
            <div className="flex-1">
              <div className="text-sm font-medium text-[var(--color-text-default)]">
                Download CSV or XLSX Template
              </div>
              <div className="text-[11px] text-[var(--color-text-muted)]">
                You can download the attached example and use them as a starting
                point for your file
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                toast.info("Template download", {
                  description: "Mock download — no file emitted.",
                })
              }
            >
              <Download className="mr-1 h-3.5 w-3.5" />
              Download
            </Button>
          </div>
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

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 md:px-0">
      <Steps active={2} />

      <div className="mt-2 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)] p-6">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-[var(--color-text-default)]">
            Confirm Question Upload
          </h2>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Review the summary of your upload before completing the import.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          {[
            {
              label: "Total Questions",
              value: 67,
              color: "bg-[var(--color-bg-badge-blue)] text-[var(--blue-600)]",
            },
            {
              label: "Valid Questions",
              value: 78,
              color: "bg-[var(--color-bg-badge-green)] text-[var(--green-600)]",
            },
            {
              label: "Invalid Questions",
              value: 45,
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

        <div className="mt-3 flex items-center gap-2 rounded-lg border border-[var(--color-border-warning)] bg-[var(--color-bg-badge-orange)] px-3 py-2 text-xs text-[var(--orange-700)]">
          <AlertTriangle className="h-3.5 w-3.5" />
          Some questions contain errors. They will not be imported unless
          corrected.
        </div>

        <div className="mt-4 rounded-lg border border-[var(--color-border-default)] p-4">
          <h4 className="text-sm font-semibold text-[var(--color-text-default)]">
            Error Breakdown
          </h4>
          <ul className="mt-2 space-y-1.5 text-xs">
            {[
              "3 missing Admission Numbers",
              "1 invalid question",
              "1 unrecognized class",
            ].map((line) => (
              <li
                key={line}
                className="flex items-center gap-2 text-[var(--color-text-subtle)]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--red-500)]" />
                {line}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toast.info("Error report", {
                description: "Mock CSV download — no file emitted.",
              })
            }
          >
            <Download className="mr-1 h-3.5 w-3.5" />
            Download Error Report (CSV)
          </Button>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)] px-4 py-3">
        <Button variant="outline" onClick={() => setStep(1)}>
          <ArrowLeft className="mr-1 h-3.5 w-3.5" />
          Back
        </Button>
        <Button
          onClick={() => {
            toast.success("Questions imported", {
              description: "78 valid questions added to the bank.",
            });
            router.push(`${baseUrl}/question-bank`);
          }}
        >
          Confirm &amp; Import
        </Button>
      </div>
    </div>
  );
};
