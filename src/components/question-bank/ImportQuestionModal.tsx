"use client";

import { useCallback, useRef, useState } from "react";
import { AlertTriangle, CheckCircle, Download, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/Modal";
import { useImportQuestions } from "@/hooks/queryHooks/useQuestionBank";
import { toast } from "@/components/Toast";

type Step = 1 | 2;

interface UploadedFile {
  name: string;
  size: string;
  raw: File;
}

interface ParseResult {
  imported: number;
  failed: number;
  errors: string[];
}

interface ImportQuestionsModalProps {
  open: boolean;
  classId: number;
  subjectId: number;
  onClose: () => void;
  onImported: (count: number) => void;
}

// ─── Step indicator ───────────────────────────────────────────────────────────

const StepIndicator = ({ step }: { step: Step }) => (
  <div className="mb-5 flex items-center overflow-hidden rounded-xl border border-gray-200">
    {[
      { n: 1 as Step, label: "Import questions" },
      { n: 2 as Step, label: "Confirm & Upload" },
    ].map(({ n, label }, i) => {
      const done = step > n;
      const active = step === n;
      return (
        <div
          key={n}
          className={cn(
            "flex flex-1 items-center gap-2.5 px-4 py-3",
            i === 0 && "border-r border-gray-200",
          )}
        >
          <div
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all",
              done
                ? "bg-green-500"
                : active
                  ? "border-2 border-blue-500 bg-white"
                  : "border-2 border-gray-200 bg-white",
            )}
          >
            {done ? (
              <CheckCircle className="h-4 w-4 text-white" />
            ) : active ? (
              <span className="h-2 w-2 rounded-full bg-blue-500" />
            ) : (
              <span className="text-xs font-semibold text-gray-400">{n}</span>
            )}
          </div>
          <span
            className={cn(
              "text-sm font-medium",
              active
                ? "text-gray-900"
                : done
                  ? "text-gray-600"
                  : "text-gray-400",
            )}
          >
            {label}
          </span>
        </div>
      );
    })}
  </div>
);

// ─── Main modal ───────────────────────────────────────────────────────────────

export const ImportQuestionsModal = ({
  open,
  classId,
  subjectId,
  onClose,
  onImported,
}: ImportQuestionsModalProps) => {
  const [step, setStep] = useState<Step>(1);
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate: importQ, isPending } = useImportQuestions(classId, subjectId);

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setFile(null);
      setParseResult(null);
    }, 200);
  };

  const formatSize = (bytes: number) =>
    bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  const acceptFile = useCallback((f: File) => {
    setFile({ name: f.name, size: formatSize(f.size), raw: f });
  }, []);

  const handleContinue = () => {
    if (!file) return;
    importQ(file.raw, {
      onSuccess: (res) => {
        setParseResult({
          imported: res.data?.imported ?? 0,
          failed: res.data?.failed ?? 0,
          errors: res.data?.errors ?? [],
        });
        setStep(2);
      },
      onError: (e: unknown) => {
        const msg =
          e && typeof e === "object" && "message" in e
            ? String((e as { message: string }).message)
            : "Failed to process file";
        toast({ title: msg, type: "error" });
      },
    });
  };

  const handleConfirm = () => {
    if (!parseResult) return;
    toast({
      title: `${parseResult?.imported} question${parseResult?.imported !== 1 ? "s" : ""} imported successfully`,
      type: "success",
    });
    onImported(parseResult?.imported);
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      className="max-h-[90vh] overflow-y-auto"
    >
      <div className="px-6 pt-6 pb-5">
        <StepIndicator step={step} />
        {step === 1 ? (
          <div className="space-y-4">
            <div className="mb-2 text-center">
              <h2 className="text-lg font-bold text-gray-900">
                Import Questions
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Upload your questions in CSV or XLSX format to quickly add them
                to the question bank.
              </p>
            </div>

            {/* Drop zone */}
            <div
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const f = e.dataTransfer.files[0];
                if (f) acceptFile(f);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              className={cn(
                "flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition-all",
                isDragging
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-200 bg-gray-50/50 hover:border-gray-300",
              )}
            >
              <svg
                className="mb-3 h-12 w-12 text-gray-300"
                viewBox="0 0 48 48"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="6" y="6" width="15" height="15" rx="2" />
                <rect x="27" y="6" width="15" height="15" rx="2" />
                <rect x="6" y="27" width="15" height="15" rx="2" />
                <rect x="27" y="27" width="15" height="15" rx="2" />
              </svg>
              <p className="text-sm text-gray-600">
                Drag and drop a CSV or XLSX file here, or{" "}
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="font-medium text-blue-600 hover:underline"
                >
                  click to browse
                </button>
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Maximum file size: 40 MB
              </p>
              <input
                ref={inputRef}
                type="file"
                accept=".csv,.xlsx"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) acceptFile(f);
                }}
              />
            </div>

            {/* Selected file */}
            {file && (
              <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                  <span className="text-xs font-bold text-gray-500">
                    {file?.name.endsWith(".xlsx") ? "XLSX" : "CSV"}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-800">
                    {file?.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {file?.size}{" "}
                    <span className="font-medium text-green-600">• Ready</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-gray-400 transition-colors hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Template download */}
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-600">
                <span className="text-xs font-bold text-white">XLS</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-800">
                  Download Template
                </p>
                <p className="text-xs text-gray-500">
                  Download the CSV / XLSX template and use it as a starting
                  point
                </p>
              </div>
              <a
                href="/templates/questions-import-template.xlsx"
                download
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors hover:bg-gray-50"
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </a>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleContinue}
                disabled={!file || isPending}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  file && !isPending
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "cursor-not-allowed bg-gray-100 text-gray-400",
                )}
              >
                {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {isPending ? "Uploading…" : "Continue"}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mb-2 text-center">
              <h2 className="text-lg font-bold text-gray-900">
                Confirm Question Upload
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Review the summary before completing the import.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: "Imported",
                  value: parseResult!.imported,
                  icon: "✅",
                  color: "text-green-700",
                  bg: "bg-green-50 border-green-200",
                },
                {
                  label: "Failed",
                  value: parseResult!.failed,
                  icon: "⚠️",
                  color: "text-red-700",
                  bg:
                    parseResult!.failed > 0
                      ? "bg-red-50 border-red-200"
                      : "bg-white border-gray-200",
                },
              ].map(({ label, value, icon, color, bg }) => (
                <div key={label} className={cn("rounded-xl border p-4", bg)}>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-base">{icon}</span>
                    <span className="text-xs text-gray-500">{label}</span>
                  </div>
                  <p className={cn("text-2xl font-bold", color)}>{value}</p>
                </div>
              ))}
            </div>

            {parseResult!.failed > 0 && (
              <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <p className="text-sm text-amber-800">
                  {parseResult!.failed} question
                  {parseResult!.failed !== 1 ? "s" : ""} could not be imported.
                  Fix the errors and re-upload to include them.
                </p>
              </div>
            )}

            {parseResult!.errors.length > 0 && (
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <h3 className="mb-3 text-sm font-semibold text-gray-900">
                  Error Breakdown
                </h3>
                <ul className="space-y-2">
                  {parseResult!.errors.map((err, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                      {err}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={parseResult!.imported === 0}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-5 py-2 text-sm font-medium transition-colors",
                  parseResult!.imported > 0
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "cursor-not-allowed bg-gray-100 text-gray-400",
                )}
              >
                Confirm & Done
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
