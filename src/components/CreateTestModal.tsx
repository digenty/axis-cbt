"use client";
import { useState, useEffect } from "react";
// import { Modal } from "@/components/ui/modal";
import { Test, TestType, TermType, AssessmentMapping } from "@/types";
import { generateId, cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";
import { Modal } from "./Modal";
// import { Modal } from "@/Modal";

interface CreateTestModalProps {
	open: boolean;
	onClose: () => void;
	subjectId: number;
	classId: number;
	className: string;
	subjectName: string;
	editTest?: Test | null;
	onSaved: (test: Test) => void;
}

const TERMS: TermType[] = ["First Term", "Second Term", "Third Term"];
const TEST_TYPES: TestType[] = ["Continuous Assessment", "Examination"];
const ASSESSMENT_MAPPINGS: AssessmentMapping[] = [
	"None ( Manual Scoring)",
	"Continuous Assessment 1 (20%)",
	"Continuous Assessment 2 (20%)",
	"Examination (60%)",
];

const MAPPING_LABELS: Record<string, string> = {
	"None ( Manual Scoring)": "Manual",
	"Continuous Assessment 1 (20%)": "CA 1",
	"Continuous Assessment 2 (20%)": "CA 2",
	"Examination (60%)": "Exam",
};

interface FormState {
	title: string;
	term: TermType;
	testType: TestType;
	assessmentMapping: AssessmentMapping | "";
	testDate: string;
	startHour: string;
	startMinute: string;
	amPm: "AM" | "PM";
	duration: number;
	studentResultAccess: boolean;
}

const defaultForm = (): FormState => ({
	title: "",
	term: "First Term",
	testType: "Continuous Assessment",
	assessmentMapping: "",
	testDate: "",
	startHour: "00",
	startMinute: "00",
	amPm: "AM",
	duration: 60,
	studentResultAccess: false,
});

export const CreateTestModal = ({
	open,
	onClose,
	subjectId,
	classId,
	className,
	subjectName,
	editTest,
	onSaved,
}: CreateTestModalProps) => {
	const [form, setForm] = useState<FormState>(defaultForm);
	const [errors, setErrors] = useState<
		Partial<Record<keyof FormState, string>>
	>({});
	const [saving, setSaving] = useState(false);
	const [testTypeOpen, setTestTypeOpen] = useState(false);
	const [mappingOpen, setMappingOpen] = useState(false);

	useEffect(() => {
		if (open) {
			if (editTest) {
				// eslint-disable-next-line react-hooks/set-state-in-effect
				setForm({
					title: editTest.title,
					term: editTest.term,
					testType: editTest.testType,
					assessmentMapping: editTest.assessmentMapping,
					testDate: editTest.testDate,
					startHour: editTest.startTime.split(":")[0] || "00",
					startMinute: editTest.startTime.split(":")[1] || "00",
					amPm: editTest.amPm,
					duration: editTest.duration,
					studentResultAccess: editTest.studentResultAccess,
				});
			} else {
				setForm(defaultForm());
				setErrors({});
			}
		}
	}, [open, editTest]);

	const update = <K extends keyof FormState>(k: K, v: FormState[K]) => {
		setForm((p) => ({ ...p, [k]: v }));
		setErrors((p) => ({ ...p, [k]: undefined }));
	};

	const validate = () => {
		const e: Partial<Record<keyof FormState, string>> = {};
		if (!form.title.trim()) e.title = "Test name is required";
		setErrors(e);
		return Object.keys(e).length === 0;
	};

	const handleSave = async () => {
		if (!validate()) return;
		setSaving(true);
		await new Promise((r) => setTimeout(r, 400));
		const test: Test = {
			id: editTest?.id || generateId(),
			title: form.title,
			subjectId,
			classId,
			term: form.term,
			testType: form.testType,
			assessmentMapping: form.assessmentMapping as AssessmentMapping,
			mappingLabel: MAPPING_LABELS[form.assessmentMapping] || "CA 1",
			testDate: form.testDate,
			startTime: `${form.startHour}:${form.startMinute}`,
			amPm: form.amPm,
			duration: form.duration,
			studentResultAccess: form.studentResultAccess,
			status: editTest?.status || "draft",
			sections: editTest?.sections || [
				{
					id: generateId(),
					title: "Section A",
					instruction: "",
					questionIds: [],
				},
			],
			totalMarks: editTest?.totalMarks || 0,
			createdAt: editTest?.createdAt || new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};
		setSaving(false);
		onSaved(test);
	};

	return (
		<Modal
			open={open}
			onClose={onClose}
			title="Create Test"
			className="max-h-[90vh] overflow-y-auto"
			subtitle="Set up the basic details. You'll add questions in the next step."
			// size="xl"
			footer={
				<div className="flex items-center justify-between px-5 pb-5">
					<button
						onClick={onClose}
						className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
					>
						Cancel
					</button>
					<button
						onClick={handleSave}
						disabled={saving}
						className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
					>
						{saving && (
							<span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
						)}
						Save & Continue
					</button>
				</div>
			}
		>
			<div className="space-y-5 px-6 py-5">
				{/* Test name */}
				<div>
					<label className="mb-1.5 block text-sm font-medium text-gray-800">
						Test Name
					</label>
					<input
						type="text"
						value={form.title}
						onChange={(e) => update("title", e.target.value)}
						placeholder="e.g Mid-term mathematics test"
						className={cn(
							"h-11 w-full rounded-xl border px-4 py-2.5 text-sm transition placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none",
							errors.title ? "border-red-400" : "border-gray-200",
						)}
					/>
					{errors.title && (
						<p className="mt-1 text-xs text-red-500">{errors.title}</p>
					)}
				</div>

				{/* Class + Subject (read-only) */}
				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="mb-1.5 block text-sm font-medium text-gray-800">
							Class
						</label>
						<input
							readOnly
							value={className}
							className="h-11 w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-500"
						/>
					</div>
					<div>
						<label className="mb-1.5 block text-sm font-medium text-gray-800">
							Subject
						</label>
						<input
							readOnly
							value={subjectName}
							className="h-11 w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-500"
						/>
					</div>
				</div>

				{/* Term + Test Type */}
				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="mb-1.5 block text-sm font-medium text-gray-800">
							Term
						</label>
						<div className="relative">
							<select
								value={form.term}
								onChange={(e) =>
									update("term", e.target.value as TermType)
								}
								className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm transition focus:ring-2 focus:ring-blue-500 focus:outline-none"
							>
								{TERMS.map((t) => (
									<option key={t}>{t}</option>
								))}
							</select>
							<ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
						</div>
					</div>
					<div>
						<label className="mb-1.5 block text-sm font-medium text-gray-800">
							Test Type
						</label>
						<div className="relative">
							<button
								onClick={() => setTestTypeOpen((v) => !v)}
								className="flex h-11 w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm transition hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
							>
								<span>{form.testType}</span>
								<ChevronDown className="h-4 w-4 text-gray-400" />
							</button>
							{testTypeOpen && (
								<div className="absolute top-full right-0 z-30 mt-1 w-full overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-xl">
									{TEST_TYPES.map((t) => (
										<button
											key={t}
											onClick={() => {
												update("testType", t);
												setTestTypeOpen(false);
											}}
											className="w-full px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
										>
											{t}
										</button>
									))}
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Assessment Mapping */}
				<div>
					<label className="mb-1.5 block text-sm font-medium text-gray-800">
						Assessment Mapping
					</label>
					<div className="relative">
						<button
							onClick={() => setMappingOpen((v) => !v)}
							className="flex h-11 w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm transition hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						>
							<span
								className={
									form.assessmentMapping
										? "text-gray-800"
										: "text-gray-400"
								}
							>
								{form.assessmentMapping || "Map assessment"}
							</span>
							<ChevronDown className="h-4 w-4 text-gray-400" />
						</button>
						{mappingOpen && (
							<div className="absolute top-full left-0 z-30 mt-1 w-full overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-xl">
								{ASSESSMENT_MAPPINGS.map((m) => (
									<button
										key={m}
										onClick={() => {
											update("assessmentMapping", m);
											setMappingOpen(false);
										}}
										className="flex w-full items-center justify-between px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
									>
										{m}
										{form.assessmentMapping === m && (
											<Check className="h-3.5 w-3.5 text-blue-600" />
										)}
									</button>
								))}
							</div>
						)}
					</div>
				</div>

				{/* Test Date + Time */}
				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="mb-1.5 block text-sm font-medium text-gray-800">
							Test Date
						</label>
						<input
							type="date"
							value={form.testDate}
							onChange={(e) => update("testDate", e.target.value)}
							className="h-11 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-600 transition focus:ring-2 focus:ring-blue-500 focus:outline-none"
						/>
					</div>
					<div>
						<label className="mb-1.5 block text-sm font-medium text-gray-800">
							Select Time
						</label>
						<div className="flex items-center gap-2">
							<input
								type="text"
								maxLength={2}
								value={form.startHour}
								onChange={(e) =>
									update(
										"startHour",
										e.target.value
											.replace(/\D/g, "")
											.padStart(2, "0")
											.slice(-2),
									)
								}
								className="h-11 w-16 rounded-xl border border-gray-200 px-2 py-2.5 text-center text-sm transition focus:ring-2 focus:ring-blue-500 focus:outline-none"
							/>
							<span className="font-bold text-gray-400">:</span>
							<input
								type="text"
								maxLength={2}
								value={form.startMinute}
								onChange={(e) =>
									update(
										"startMinute",
										e.target.value
											.replace(/\D/g, "")
											.padStart(2, "0")
											.slice(-2),
									)
								}
								className="h-11 w-16 rounded-xl border border-gray-200 px-2 py-2.5 text-center text-sm transition focus:ring-2 focus:ring-blue-500 focus:outline-none"
							/>
							<div className="flex overflow-hidden rounded-xl border border-gray-200">
								{(["AM", "PM"] as const).map((period) => (
									<button
										key={period}
										onClick={() => update("amPm", period)}
										className={cn(
											"px-3 py-2 text-sm font-medium transition-colors",
											form.amPm === period
												? "bg-gray-800 text-white"
												: "bg-white text-gray-600 hover:bg-gray-50",
										)}
									>
										{period}
									</button>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Duration */}
				<div>
					<label className="mb-1.5 block text-sm font-medium text-gray-800">
						Duration{" "}
						<span className="font-normal text-gray-400">(minutes)</span>
					</label>
					<input
						type="number"
						min={1}
						value={form.duration}
						onChange={(e) => update("duration", Number(e.target.value))}
						className="h-11 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm transition focus:ring-2 focus:ring-blue-500 focus:outline-none"
					/>
				</div>

				{/* Student result access */}
				<div className="flex items-start gap-3">
					<button
						onClick={() =>
							update("studentResultAccess", !form.studentResultAccess)
						}
						className={cn(
							"relative mt-0.5 h-6 w-10 shrink-0 rounded-full transition-colors",
							form.studentResultAccess ? "bg-blue-600" : "bg-gray-200",
						)}
					>
						<span
							className={cn(
								"absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform",
								form.studentResultAccess
									? "translate-x-5"
									: "translate-x-1",
							)}
						/>
					</button>
					<div>
						<p className="text-sm font-medium text-gray-800">
							Student result access
						</p>
						<p className="mt-0.5 text-xs text-gray-500">
							Enable to allow students view their scores, answers, and
							feedback after submission.
						</p>
					</div>
				</div>
			</div>
		</Modal>
	);
};
