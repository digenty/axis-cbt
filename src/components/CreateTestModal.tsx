"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/Modal";
import { toast } from "@/components/Toast";
import {
	useCreateAssessment,
	useUpdateAssessment,
} from "@/hooks/queryHooks/useAssessment";
import type {
	ApiAssessment,
	AssessmentFormState,
	AssessmentMapping,
	AssessmentTerm,
	AssessmentTestType,
	CreateAssessmentPayload,
} from "@/types/assessment";
import {
	ASSESSMENT_FORM_INITIAL,
	ASSESSMENT_MAPPING_LABELS,
	ASSESSMENT_TERM_LABELS,
	ASSESSMENT_TEST_TYPE_LABELS,
} from "@/types/assessment";

// ─── Props ────────────────────────────────────────────────────────────────────

interface CreateTestModalProps {
	open: boolean;
	branchId: number;
	classId: number;
	subjectId: number;
	/** Display-only — shown in the read-only Class/Subject fields */
	className?: string;
	subjectName?: string;
	editAssessment?: ApiAssessment | null;
	onClose: () => void;
	onSaved?: (assessment: ApiAssessment) => void;
}

// ─── Time helpers ─────────────────────────────────────────────────────────────

/** "2024-09-01T10:30:00" → { date: "2024-09-01", hour: "10", minute: "30", period: "AM" } */
function parseDateTime(iso: string | null): {
	date: string;
	hour: string;
	minute: string;
	period: "AM" | "PM";
} {
	if (!iso) return { date: "", hour: "00", minute: "00", period: "AM" };
	const d = new Date(iso);
	const date = iso.slice(0, 10);
	let h = d.getHours();
	const period: "AM" | "PM" = h >= 12 ? "PM" : "AM";
	if (h > 12) h -= 12;
	if (h === 0) h = 12;
	return {
		date,
		hour: String(h).padStart(2, "0"),
		minute: String(d.getMinutes()).padStart(2, "0"),
		period,
	};
}

/** date + hour + minute + period → ISO string "2024-09-01T10:30:00" */
function buildIso(
	date: string,
	hour: string,
	minute: string,
	period: "AM" | "PM",
): string | null {
	if (!date) return null;
	let h = parseInt(hour || "12", 10);
	if (period === "AM" && h === 12) h = 0;
	if (period === "PM" && h !== 12) h += 12;
	return `${date}T${String(h).padStart(2, "0")}:${(minute || "00").padStart(2, "0")}:00`;
}

// ─── Form state helpers ───────────────────────────────────────────────────────

interface TimeState {
	date: string;
	hour: string;
	minute: string;
	period: "AM" | "PM";
}

function hydrateForm(a: ApiAssessment): AssessmentFormState {
	return {
		name: a.name,
		term: a.term,
		testType: a.testType,
		assessmentMapping: a.assessmentMapping,
		startDateTime: a.startDateTime ?? "",
		endDateTime: a.endDateTime ?? "",
		durationMinutes:
			a.durationMinutes != null ? String(a.durationMinutes) : "60",
		totalMarks: String(a.totalMarks ?? ""),
		passingMarks: a.passingMarks != null ? String(a.passingMarks) : "",
		shuffleQuestions: a.shuffleQuestions,
		shuffleOptions: a.shuffleOptions,
		showResultsImmediately: a.showResultsImmediately,
		allowReview: a.allowReview,
		instructions: a.instructions ?? "",
	};
}

function buildPayload(
	form: AssessmentFormState,
	timeState: TimeState,
	branchId: number,
	classId: number,
	subjectId: number,
): CreateAssessmentPayload {
	return {
		name: form.name.trim(),
		branchId,
		classId,
		subjectId,
		term: form.term as AssessmentTerm,
		testType: form.testType as AssessmentTestType,
		assessmentMapping: form.assessmentMapping as AssessmentMapping,
		startDateTime: buildIso(
			timeState.date,
			timeState.hour,
			timeState.minute,
			timeState.period,
		),
		durationMinutes: form.durationMinutes
			? Number(form.durationMinutes)
			: null,
		totalMarks: form.totalMarks ? Number(form.totalMarks) : undefined,
		passingMarks: form.passingMarks ? Number(form.passingMarks) : null,
		shuffleQuestions: form.shuffleQuestions,
		shuffleOptions: form.shuffleOptions,
		showResultsImmediately: form.showResultsImmediately,
		allowReview: form.allowReview,
		instructions: form.instructions.trim() || null,
	};
}

// ─── Component ────────────────────────────────────────────────────────────────

export const CreateTestModal = ({
	open,
	branchId,
	classId,
	subjectId,
	className,
	subjectName,
	editAssessment,
	onClose,
	onSaved,
}: CreateTestModalProps) => {
	const [form, setForm] = useState<AssessmentFormState>(
		ASSESSMENT_FORM_INITIAL,
	);
	const [timeState, setTimeState] = useState<TimeState>({
		date: "",
		hour: "00",
		minute: "00",
		period: "AM",
	});
	const [errors, setErrors] = useState<
		Partial<Record<keyof AssessmentFormState, string>>
	>({});

	const { mutateAsync: createAssessment, isPending: isCreating } =
		useCreateAssessment();
	const { mutateAsync: updateAssessment, isPending: isUpdating } =
		useUpdateAssessment();
	const saving = isCreating || isUpdating;

	useEffect(() => {
		if (!open) return;
		if (editAssessment) {
			const f = hydrateForm(editAssessment);
			setForm(f);
			setTimeState(parseDateTime(editAssessment.startDateTime));
		} else {
			setForm(ASSESSMENT_FORM_INITIAL);
			setTimeState({ date: "", hour: "00", minute: "00", period: "AM" });
		}
		setErrors({});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [editAssessment]);

	const update = <K extends keyof AssessmentFormState>(
		key: K,
		val: AssessmentFormState[K],
	) => {
		setForm((p) => ({ ...p, [key]: val }));
		setErrors((p) => ({ ...p, [key]: undefined }));
	};

	const validate = (): boolean => {
		const errs: Partial<Record<keyof AssessmentFormState, string>> = {};
		if (!form.name.trim()) errs.name = "Test name is required";
		if (!form.term) errs.term = "Term is required";
		if (!form.testType) errs.testType = "Test type is required";
		if (!form.assessmentMapping)
			errs.assessmentMapping = "Assessment mapping is required";
		setErrors(errs);
		return Object.keys(errs).length === 0;
	};

	const handleSave = async () => {
		if (!validate()) return;
		const payload = buildPayload(
			form,
			timeState,
			branchId,
			classId,
			subjectId,
		);

		try {
			let result: ApiAssessment;
			if (editAssessment) {
				const res = await updateAssessment({
					id: editAssessment.id,
					payload,
				});
				result = res.data;
				toast({ title: "Assessment updated", type: "success" });
			} else {
				const res = await createAssessment(payload);
				result = res.data;
				toast({ title: "Assessment created", type: "success" });
			}
			onSaved?.(result);
			onClose();
		} catch (err: unknown) {
			const msg =
				err && typeof err === "object" && "message" in err
					? String((err as { message: string }).message)
					: "Could not save assessment";
			toast({ title: msg, type: "error" });
		}
	};

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={editAssessment ? "Edit Test" : "Create Test"}
			subtitle="Set up the basic details. You'll add questions in the next step."
			className="max-h-[90vh] overflow-y-auto"
			footer={
				<div className="flex items-center justify-between px-5 pb-5">
					<button
						type="button"
						onClick={onClose}
						className="rounded-lg border border-gray-200 px-5 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={handleSave}
						disabled={saving}
						className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
					>
						{saving && (
							<span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
						)}
						{editAssessment ? "Save Changes" : "Save & Continue"}
					</button>
				</div>
			}
		>
			<div className="space-y-4 px-5 py-4">
				{/* Test Name */}
				<div>
					<label className="mb-1.5 block text-sm font-medium text-gray-800">
						Test Name
					</label>
					<input
						type="text"
						value={form.name}
						onChange={(e) => update("name", e.target.value)}
						placeholder="e.g Mid-term mathematics test"
						className={cn(
							"h-10 w-full rounded-lg border px-3 text-sm transition placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none",
							errors.name ? "border-red-400" : "border-gray-200",
						)}
					/>
					{errors.name && (
						<p className="mt-1 text-xs text-red-500">{errors.name}</p>
					)}
				</div>

				{/* Class + Subject (read-only) */}
				<div className="grid grid-cols-2 gap-3">
					<div>
						<label className="mb-1.5 block text-sm font-medium text-gray-800">
							Class
						</label>
						<input
							type="text"
							value={className ?? ""}
							readOnly
							placeholder="Class"
							className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-500 outline-none"
						/>
					</div>
					<div>
						<label className="mb-1.5 block text-sm font-medium text-gray-800">
							Subject
						</label>
						<input
							type="text"
							value={subjectName ?? ""}
							readOnly
							placeholder="Subject"
							className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-500 outline-none"
						/>
					</div>
				</div>

				{/* Term + Test Type */}
				<div className="grid grid-cols-2 gap-3">
					<div>
						<label className="mb-1.5 block text-sm font-medium text-gray-800">
							Term
						</label>
						<SelectField
							value={form.term}
							onChange={(v) => update("term", v as AssessmentTerm)}
							placeholder="Select term"
							options={Object.entries(ASSESSMENT_TERM_LABELS).map(
								([value, label]) => ({ value, label }),
							)}
							error={!!errors.term}
						/>
						{errors.term && (
							<p className="mt-1 text-xs text-red-500">{errors.term}</p>
						)}
					</div>
					<div>
						<label className="mb-1.5 block text-sm font-medium text-gray-800">
							Test Type
						</label>
						<SelectField
							value={form.testType}
							onChange={(v) =>
								update("testType", v as AssessmentTestType)
							}
							placeholder="Select type"
							options={Object.entries(ASSESSMENT_TEST_TYPE_LABELS).map(
								([value, label]) => ({ value, label }),
							)}
							error={!!errors.testType}
						/>
						{errors.testType && (
							<p className="mt-1 text-xs text-red-500">
								{errors.testType}
							</p>
						)}
					</div>
				</div>

				{/* Assessment Mapping */}
				<div>
					<label className="mb-1.5 block text-sm font-medium text-gray-800">
						Assessment Mapping
					</label>
					<SelectField
						value={form.assessmentMapping}
						onChange={(v) =>
							update("assessmentMapping", v as AssessmentMapping)
						}
						placeholder="Map assessment"
						options={Object.entries(ASSESSMENT_MAPPING_LABELS).map(
							([value, label]) => ({ value, label }),
						)}
						error={!!errors.assessmentMapping}
					/>
					{errors.assessmentMapping && (
						<p className="mt-1 text-xs text-red-500">
							{errors.assessmentMapping}
						</p>
					)}
				</div>

				{/* Test Date + Select Time */}
				<div className="grid grid-cols-2 gap-3">
					<div>
						<label className="mb-1.5 block text-sm font-medium text-gray-800">
							Test Date
						</label>
						<input
							type="date"
							value={timeState.date}
							onChange={(e) =>
								setTimeState((p) => ({ ...p, date: e.target.value }))
							}
							className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm transition focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
						/>
					</div>
					<div>
						<label className="mb-1.5 block text-sm font-medium text-gray-800">
							Select Time
						</label>
						<div className="flex h-10 items-center gap-1 rounded-lg border border-gray-200 px-2">
							{/* Hour */}
							<input
								type="text"
								inputMode="numeric"
								maxLength={2}
								value={timeState.hour}
								onChange={(e) => {
									const v = e.target.value
										.replace(/\D/g, "")
										.slice(0, 2);
									setTimeState((p) => ({ ...p, hour: v }));
								}}
								className="w-8 bg-transparent text-center text-sm focus:outline-none"
								placeholder="00"
							/>
							<span className="text-gray-400">:</span>
							{/* Minute */}
							<input
								type="text"
								inputMode="numeric"
								maxLength={2}
								value={timeState.minute}
								onChange={(e) => {
									const v = e.target.value
										.replace(/\D/g, "")
										.slice(0, 2);
									setTimeState((p) => ({ ...p, minute: v }));
								}}
								className="w-8 bg-transparent text-center text-sm focus:outline-none"
								placeholder="00"
							/>
							{/* AM / PM toggle */}
							<div className="ml-auto flex overflow-hidden rounded-md border border-gray-200">
								{(["AM", "PM"] as const).map((p) => (
									<button
										key={p}
										type="button"
										onClick={() =>
											setTimeState((prev) => ({
												...prev,
												period: p,
											}))
										}
										className={cn(
											"px-2.5 py-1 text-xs font-medium transition-colors",
											timeState.period === p
												? "bg-blue-600 text-white"
												: "bg-white text-gray-500 hover:bg-gray-50",
										)}
									>
										{p}
									</button>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Duration */}
				<div>
					<label className="mb-1.5 block text-sm font-medium text-gray-800">
						Duration (minutes)
					</label>
					<input
						type="number"
						min={1}
						value={form.durationMinutes}
						onChange={(e) => update("durationMinutes", e.target.value)}
						placeholder="60"
						className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm transition placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
					/>
				</div>

				{/* Student result access toggle */}
				<button
					type="button"
					onClick={() =>
						update("showResultsImmediately", !form.showResultsImmediately)
					}
					className="flex w-full items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 text-left transition-colors hover:bg-gray-50"
				>
					{/* Pill toggle */}
					<div
						className={cn(
							"relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition-colors duration-200",
							form.showResultsImmediately
								? "bg-blue-600"
								: "bg-gray-200",
						)}
					>
						<span
							className={cn(
								"absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200",
								form.showResultsImmediately
									? "translate-x-4"
									: "translate-x-0.5",
							)}
						/>
					</div>
					<div>
						<p className="text-sm font-medium text-gray-900">
							Student result access
						</p>
						<p className="mt-0.5 text-xs text-gray-500">
							Enable to allow students view their scores, answers, and
							feedback after submission.
						</p>
					</div>
				</button>
			</div>
		</Modal>
	);
};

// ─── SelectField ──────────────────────────────────────────────────────────────

const SelectField = ({
	value,
	onChange,
	placeholder,
	options,
	error,
}: {
	value: string;
	onChange: (v: string) => void;
	placeholder: string;
	options: { value: string; label: string }[];
	error?: boolean;
}) => (
	<div className="relative">
		<select
			value={value}
			onChange={(e) => onChange(e.target.value)}
			className={cn(
				"h-10 w-full appearance-none rounded-lg border bg-white px-3 pr-9 text-sm transition focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none",
				error ? "border-red-400" : "border-gray-200",
				!value && "text-gray-400",
			)}
		>
			<option value="" disabled>
				{placeholder}
			</option>
			{options.map((opt) => (
				<option key={opt.value} value={opt.value}>
					{opt.label}
				</option>
			))}
		</select>
		<ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
	</div>
);
