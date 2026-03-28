"use client";

import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { X, Download, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { Modal } from "./Modal";

interface ImportQuestionsModalProps {
	open: boolean;
	onClose: () => void;
	onImported: (count: number) => void;
}

type Step = 1 | 2;

interface UploadedFile {
	name: string;
	size: string;
}

interface ParseResult {
	total: number;
	valid: number;
	invalid: number;
	errors: string[];
}

// ─── Step indicator ────────────────────────────────────────────────────────────
const StepIndicator = ({ step }: { step: Step }) => (
	<div className="mb-5 flex items-center gap-0 overflow-hidden rounded-xl border border-gray-200">
		{[
			{ n: 1, label: "Import questions" },
			{ n: 2, label: "Confirm & Upload" },
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
							<Loader2 className="h-3.5 w-3.5 animate-spin text-blue-500" />
						) : (
							<span className="text-xs font-semibold text-gray-400">
								{n}
							</span>
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

// ─── Main modal ────────────────────────────────────────────────────────────────
export const ImportQuestionsModal = ({
	open,
	onClose,
	onImported,
}: ImportQuestionsModalProps) => {
	const [step, setStep] = useState<Step>(1);
	const [file, setFile] = useState<UploadedFile | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [parseResult, setParseResult] = useState<ParseResult | null>(null);
	const [processing, setProcessing] = useState(false);
	const [importing, setImporting] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleClose = () => {
		onClose();
		setTimeout(() => {
			setStep(1);
			setFile(null);
			setParseResult(null);
		}, 200);
	};

	const formatSize = (bytes: number) => {
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	};

	const handleFileAccepted = useCallback(async (f: File) => {
		setFile({ name: f.name, size: formatSize(f.size) });
	}, []);

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
		const f = e.dataTransfer.files[0];
		if (f) handleFileAccepted(f);
	};

	const handleContinue = async () => {
		if (!file) return;
		setProcessing(true);
		// Simulate parsing
		await new Promise((r) => setTimeout(r, 1200));
		setParseResult({
			total: 67,
			valid: 78,
			invalid: 45,
			errors: [
				"3 missing Admission Numbers",
				"1 invalid question",
				"1 unrecognized class",
			],
		});
		setProcessing(false);
		setStep(2);
	};

	const handleImport = async () => {
		if (!parseResult) return;
		setImporting(true);
		await new Promise((r) => setTimeout(r, 1000));
		onImported(parseResult.valid);
		setImporting(false);
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
					<Step1
						file={file}
						isDragging={isDragging}
						inputRef={inputRef}
						processing={processing}
						onDrop={handleDrop}
						onDragOver={(e) => {
							e.preventDefault();
							setIsDragging(true);
						}}
						onDragLeave={() => setIsDragging(false)}
						onFileChange={(e) => {
							const f = e.target.files?.[0];
							if (f) handleFileAccepted(f);
						}}
						onBrowseClick={() => inputRef.current?.click()}
						onRemoveFile={() => setFile(null)}
						onCancel={handleClose}
						onContinue={handleContinue}
					/>
				) : (
					<Step2
						result={parseResult!}
						importing={importing}
						onBack={() => setStep(1)}
						onImport={handleImport}
					/>
				)}
			</div>
		</Modal>
	);
};

// ─── Step 1: Upload ────────────────────────────────────────────────────────────
const Step1 = ({
	file,
	isDragging,
	inputRef,
	processing,
	onDrop,
	onDragOver,
	onDragLeave,
	onFileChange,
	onBrowseClick,
	onRemoveFile,
	onCancel,
	onContinue,
}: {
	file: UploadedFile | null;
	isDragging: boolean;
	inputRef: React.RefObject<HTMLInputElement | null>;
	processing: boolean;
	onDrop: (e: React.DragEvent) => void;
	onDragOver: (e: React.DragEvent) => void;
	onDragLeave: () => void;
	onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onBrowseClick: () => void;
	onRemoveFile: () => void;
	onCancel: () => void;
	onContinue: () => void;
}) => (
	<div className="space-y-4">
		<div className="mb-2 text-center">
			<h2 className="text-lg font-bold text-gray-900">Import Questions</h2>
			<p className="mt-1 text-sm text-gray-500">
				Upload your questions in CSV format to quickly add them to the
				question bank.
			</p>
		</div>

		{/* Drop zone */}
		<div
			onDrop={onDrop}
			onDragOver={onDragOver}
			onDragLeave={onDragLeave}
			className={cn(
				"flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition-all",
				isDragging
					? "border-blue-400 bg-blue-50"
					: "border-gray-200 bg-gray-50/50 hover:border-gray-300",
			)}
		>
			{/* Grid icon */}
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
				Drag and drop a CSV file here, or{" "}
				<button
					onClick={onBrowseClick}
					className="font-medium text-blue-600 hover:underline"
				>
					click to browse
				</button>
			</p>
			<p className="mt-1 text-xs text-gray-400">Maximum of 40MB</p>
			<input
				ref={inputRef}
				type="file"
				accept=".csv,.xlsx"
				className="hidden"
				onChange={onFileChange}
			/>
		</div>

		{/* Uploaded file */}
		{file && (
			<div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3">
				<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
					<span className="text-xs font-bold text-gray-500">CSV</span>
				</div>
				<div className="min-w-0 flex-1">
					<p className="truncate text-sm font-medium text-gray-800">
						{file.name}
					</p>
					<p className="text-xs text-gray-400">
						{file.size}{" "}
						<span className="font-medium text-green-600">• Uploaded</span>
					</p>
				</div>
				<button
					onClick={onRemoveFile}
					className="text-gray-400 transition-colors hover:text-gray-600"
				>
					<X className="h-4 w-4" />
				</button>
			</div>
		)}

		{/* Template download */}
		<div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
			<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-600">
				<span className="text-xs font-bold text-white">X</span>
			</div>
			<div className="min-w-0 flex-1">
				<p className="text-sm font-semibold text-gray-800">
					Download CSV or XLSX Template
				</p>
				<p className="text-xs text-gray-500">
					You can download the attached example and use them as a starting
					point for your file
				</p>
			</div>
			<button className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors hover:bg-gray-50">
				<Download className="h-3.5 w-3.5" />
				Download
			</button>
		</div>

		{/* Footer */}
		<div className="flex items-center justify-between pt-1">
			<button
				onClick={onCancel}
				className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
			>
				Cancel
			</button>
			<button
				onClick={onContinue}
				disabled={!file || processing}
				className={cn(
					"flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
					file && !processing
						? "bg-blue-600 text-white hover:bg-blue-700"
						: "cursor-not-allowed bg-gray-100 text-gray-400",
				)}
			>
				{processing && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
				Continue
			</button>
		</div>
	</div>
);

// ─── Step 2: Confirm ───────────────────────────────────────────────────────────
const Step2 = ({
	result,
	importing,
	onBack,
	onImport,
}: {
	result: ParseResult;
	importing: boolean;
	onBack: () => void;
	onImport: () => void;
}) => (
	<div className="space-y-4">
		<div className="mb-2 text-center">
			<h2 className="text-lg font-bold text-gray-900">
				Confirm Question Upload
			</h2>
			<p className="mt-1 text-sm text-gray-500">
				Review the summary of your upload before completing the import.
			</p>
		</div>

		{/* Stats */}
		<div className="grid grid-cols-3 gap-3">
			{[
				{
					label: "Total Questions",
					value: result.total,
					icon: "📋",
					color: "text-gray-700",
				},
				{
					label: "Valid Questions",
					value: result.valid,
					icon: "✅",
					color: "text-green-700",
				},
				{
					label: "Invalid Questions",
					value: result.invalid,
					icon: "⚠️",
					color: "text-red-700",
				},
			].map(({ label, value, icon, color }) => (
				<div
					key={label}
					className="rounded-xl border border-gray-200 bg-white p-4"
				>
					<div className="mb-2 flex items-center gap-2">
						<span className="text-base">{icon}</span>
						<span className="text-xs text-gray-500">{label}</span>
					</div>
					<p className={cn("text-2xl font-bold", color)}>{value}</p>
				</div>
			))}
		</div>

		{/* Warning */}
		{result.invalid > 0 && (
			<div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5">
				<AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
				<p className="text-sm text-amber-800">
					Some questions contain errors. They will not be imported unless
					corrected.
				</p>
			</div>
		)}

		{/* Error breakdown */}
		{result.errors.length > 0 && (
			<div className="rounded-xl border border-gray-200 bg-white p-4">
				<h3 className="mb-3 text-sm font-semibold text-gray-900">
					Error Breakdown
				</h3>
				<ul className="space-y-2">
					{result.errors.map((err, i) => (
						<li
							key={i}
							className="flex items-center gap-2 text-sm text-gray-700"
						>
							<span className="h-2 w-2 shrink-0 rounded-full bg-red-500" />
							{err}
						</li>
					))}
				</ul>
			</div>
		)}

		{/* Download error report */}
		<button className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-50">
			<Download className="h-4 w-4" />
			Download Error Report (CSV)
		</button>

		{/* Footer */}
		<div className="flex items-center justify-between pt-1">
			<button
				onClick={onBack}
				className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
			>
				Back
			</button>
			<button
				onClick={onImport}
				disabled={importing}
				className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
			>
				{importing && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
				Confirm & Import
			</button>
		</div>
	</div>
);
